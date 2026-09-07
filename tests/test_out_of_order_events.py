import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend.models import Task
from backend.services.event_processor import process_event

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_out_of_order_event_sequence(db_session):
    task_id = "TSK-OOO-TEST-99"

    # Step 1: TaskCompleted arrives FIRST
    process_event(db_session, {
        "event_id": "EVT-OOO-CMP",
        "task_id": task_id,
        "event_type": "TaskCompleted",
        "source": "ChatStream",
        "payload": {"action": "Inspect Emergency Crash Carts", "evidence": "Inspection completed"}
    })

    task_step1 = db_session.query(Task).filter(Task.id == task_id).first()
    assert task_step1 is not None
    assert task_step1.status == "Completed"

    # Step 2: TaskCreated arrives SECOND (Out of order)
    process_event(db_session, {
        "event_id": "EVT-OOO-CRT",
        "task_id": task_id,
        "event_type": "TaskCreated",
        "source": "MeetingProcessor",
        "payload": {"action": "Inspect Emergency Crash Carts", "owner": "Dr. Ravi", "department": "Emergency Department"}
    })

    task_step2 = db_session.query(Task).filter(Task.id == task_id).first()
    # Task status must NOT regress to Pending
    assert task_step2.status == "Completed"

    # Step 3: TaskAssigned arrives THIRD (Out of order)
    process_event(db_session, {
        "event_id": "EVT-OOO-ASN",
        "task_id": task_id,
        "event_type": "TaskAssigned",
        "source": "OpsPortal",
        "payload": {"owner": "Dr. Ravi"}
    })

    task_step3 = db_session.query(Task).filter(Task.id == task_id).first()
    assert task_step3.status == "Completed"
    assert task_step3.owner == "Dr. Ravi"
