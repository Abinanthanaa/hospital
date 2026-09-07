import pytest
import datetime
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

def test_delayed_assignment_event_after_completion(db_session):
    task = Task(
        id="TSK-DELAYED-01",
        action="Calibrate ICU Ventilators",
        owner="Pending Assignment",
        department="ICU",
        deadline="Thursday",
        status="Completed",
        source_evidence="Test evidence",
        version=1
    )
    db_session.add(task)
    db_session.commit()

    # Delayed assignment event arrives at 11:00 (task completed at 10:00)
    delayed_event = {
        "event_id": "EVT-ASN-LATE-01",
        "task_id": "TSK-DELAYED-01",
        "event_type": "TaskAssigned",
        "source": "DelayedEventBus",
        "payload": {"owner": "Dr. Marcus"},
        "timestamp": datetime.datetime.utcnow()
    }

    res = process_event(db_session, delayed_event)
    
    task_after = db_session.query(Task).filter(Task.id == "TSK-DELAYED-01").first()
    # Task status must REMAIN Completed, owner updated
    assert task_after.status == "Completed"
    assert task_after.owner == "Dr. Marcus"
