import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend.models import Task, Event
from backend.services.event_processor import process_event

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_duplicate_event_handling(db_session):
    # Setup initial task
    task = Task(
        id="TSK-TEST-DUP",
        action="Train night-shift staff",
        owner="Nurse Priya",
        department="Infection Control",
        deadline="Friday",
        status="Pending",
        source_evidence="Test evidence",
        version=1
    )
    db_session.add(task)
    db_session.commit()

    dup_event_id = "EVT-DUP-001"
    event_payload = {
        "event_id": dup_event_id,
        "task_id": "TSK-TEST-DUP",
        "event_type": "TaskCompleted",
        "source": "ChatStream",
        "payload": {"evidence": "Night shift training completed"}
    }

    # First event submission
    res1 = process_event(db_session, event_payload)
    assert res1["status"] == "processed"
    assert res1["is_duplicate"] == False
    
    task_after_1 = db_session.query(Task).filter(Task.id == "TSK-TEST-DUP").first()
    assert task_after_1.status == "Completed"

    # Duplicate event submission
    res2 = process_event(db_session, event_payload)
    assert res2["status"] == "ignored_duplicate"
    assert res2["is_duplicate"] == True

    # Ensure single event record and single task state
    events = db_session.query(Event).filter(Event.event_id == dup_event_id).all()
    assert len(events) == 1
    assert task_after_1.status == "Completed"
