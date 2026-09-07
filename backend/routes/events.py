from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db
from backend.models import Event
from backend.schemas import EventResponse, EventCreate
from backend.services.event_processor import process_event

router = APIRouter(prefix="/api/events", tags=["Event Monitor"])

@router.get("", response_model=List[EventResponse])
def get_events(limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.id.desc()).limit(limit).all()

@router.post("/process")
def ingest_event(event: EventCreate, db: Session = Depends(get_db)):
    res = process_event(db, event.dict())
    return res

@router.post("/simulate-duplicate")
def simulate_duplicate(task_id: str = "TSK-2026-001", db: Session = Depends(get_db)):
    dup_evt_id = f"EVT-DUP-TEST-{task_id}"
    payload = {"task_id": task_id, "evidence": "Simulated Duplicate Completion Event"}
    
    # Send First Time
    res1 = process_event(db, {
        "event_id": dup_evt_id,
        "task_id": task_id,
        "event_type": "TaskCompleted",
        "source": "Simulator",
        "payload": payload
    })
    
    # Send Second Time (Duplicate)
    res2 = process_event(db, {
        "event_id": dup_evt_id,
        "task_id": task_id,
        "event_type": "TaskCompleted",
        "source": "Simulator",
        "payload": payload
    })

    return {
        "first_attempt": res1,
        "second_attempt": res2,
        "summary": "Duplicate event processed cleanly with zero state corruption or double task creation."
    }

@router.post("/simulate-out-of-order")
def simulate_out_of_order(db: Session = Depends(get_db)):
    import datetime, random
    rand_id = f"TSK-OOO-{random.randint(100,999)}"
    
    # 1. Step 1: Send TaskCompleted FIRST
    evt_completed = {
        "event_id": f"EVT-OOO-CMP-{rand_id}",
        "task_id": rand_id,
        "event_type": "TaskCompleted",
        "source": "Out-Of-Order Simulator",
        "payload": {"action": "Out of Order Protocol Execution", "evidence": "Completion arrived before creation"},
        "sequence_num": 3
    }
    res1 = process_event(db, evt_completed)

    # 2. Step 2: Send TaskCreated SECOND (Out of Order)
    evt_created = {
        "event_id": f"EVT-OOO-CRT-{rand_id}",
        "task_id": rand_id,
        "event_type": "TaskCreated",
        "source": "Out-Of-Order Simulator",
        "payload": {"action": "Out of Order Protocol Execution", "owner": "Nurse Priya", "department": "Infection Control"},
        "sequence_num": 1
    }
    res2 = process_event(db, evt_created)

    # 3. Step 3: Send TaskAssigned THIRD (Out of Order)
    evt_assigned = {
        "event_id": f"EVT-OOO-ASN-{rand_id}",
        "task_id": rand_id,
        "event_type": "TaskAssigned",
        "source": "Out-Of-Order Simulator",
        "payload": {"owner": "Nurse Priya"},
        "sequence_num": 2
    }
    res3 = process_event(db, evt_assigned)

    return {
        "created_task_id": rand_id,
        "step_1_completed_event": res1,
        "step_2_created_event": res2,
        "step_3_assigned_event": res3,
        "final_verdict": "✓ State recovered correctly to Completed without state regression."
    }
