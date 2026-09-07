import json
import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.models import Event, Task, Decision, Override, ChatMessage

STATUS_HIERARCHY = {
    "Pending": 1,
    "In Progress": 2,
    "Completed": 3,
    "Rejected": 3,
    "Overdue": 2
}

def process_event(db: Session, event_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Idempotent, out-of-order resilient event processor for hospital task workflows.
    """
    event_id = event_data.get("event_id")
    if not event_id:
        raise ValueError("event_id is required")

    # 1. Deduplication check (Idempotency)
    existing_event = db.query(Event).filter(Event.event_id == event_id).first()
    if existing_event:
        return {
            "status": "ignored_duplicate",
            "message": f"Duplicate event '{event_id}' received and ignored cleanly.",
            "event_id": event_id,
            "is_duplicate": True
        }

    event_type = event_data.get("event_type")
    task_id = event_data.get("task_id")
    source = event_data.get("source", "system")
    payload = event_data.get("payload", {})
    if isinstance(payload, dict):
        payload_str = json.dumps(payload)
        payload_dict = payload
    else:
        payload_str = str(payload)
        try:
            payload_dict = json.loads(payload_str)
        except Exception:
            payload_dict = {"raw": payload_str}

    event_timestamp = event_data.get("timestamp") or datetime.datetime.utcnow()

    # Log event record first
    new_event = Event(
        event_id=event_id,
        task_id=task_id,
        decision_id=event_data.get("decision_id"),
        event_type=event_type,
        source=source,
        payload=payload_str,
        timestamp=event_timestamp,
        sequence_num=event_data.get("sequence_num", 1)
    )
    db.add(new_event)

    # 2. State reconciliation logic
    task = db.query(Task).filter(Task.id == task_id).first() if task_id else None
    
    # Out-of-order handling: If event is TaskCompleted or TaskAssigned or TaskUpdated but task doesn't exist yet, auto-create stub task
    if not task and task_id:
        task = Task(
            id=task_id,
            decision_id=event_data.get("decision_id"),
            action=payload_dict.get("action", "Auto-created action from out-of-order event"),
            owner=payload_dict.get("owner", "Pending Assignment"),
            department=payload_dict.get("department", "Emergency"),
            deadline=payload_dict.get("deadline", "Not specified"),
            priority=payload_dict.get("priority", "Medium"),
            risk_level=payload_dict.get("risk_level", "Low"),
            status="Pending",
            source_evidence=payload_dict.get("evidence", "Generated from event stream"),
            version=1
        )
        db.add(task)
        db.flush()

    state_changed = False
    action_taken = ""

    if event_type == "TaskCreated":
        if task:
            # If task exists, update metadata without regressing completion state
            if payload_dict.get("action"):
                task.action = payload_dict.get("action")
            if payload_dict.get("owner") and task.owner == "Pending Assignment":
                task.owner = payload_dict.get("owner")
            action_taken = "Task metadata updated (TaskCreated)"

    elif event_type in ["TaskCompleted", "ChatUpdate"]:
        if task:
            current_level = STATUS_HIERARCHY.get(task.status, 0)
            target_level = STATUS_HIERARCHY.get("Completed", 3)
            # Only update if task is not already in a terminal state
            if task.status != "Completed":
                task.status = "Completed"
                if payload_dict.get("evidence"):
                    task.completion_evidence = payload_dict.get("evidence")
                task.version += 1
                task.updated_at = datetime.datetime.utcnow()
                state_changed = True
                action_taken = "Task status updated to Completed"
            else:
                action_taken = "Task was already Completed; state preserved"

    elif event_type == "TaskAssigned":
        if task:
            new_owner = payload_dict.get("owner")
            # State protection: Do NOT regress Completed state to Pending/In Progress if assignment arrives late
            if task.status == "Completed":
                action_taken = f"Late assignment event arrived for completed task. Updated owner to '{new_owner}' without regressing status."
                task.owner = new_owner
            else:
                task.owner = new_owner
                if task.status == "Pending":
                    task.status = "In Progress"
                task.version += 1
                state_changed = True
                action_taken = f"Assigned task to '{new_owner}' and updated status to In Progress"

    elif event_type == "DeadlineChanged":
        if task and payload_dict.get("deadline"):
            task.deadline = payload_dict.get("deadline")
            task.version += 1
            action_taken = f"Updated task deadline to '{task.deadline}'"

    elif event_type == "Override":
        if task:
            field = payload_dict.get("field")
            new_val = payload_dict.get("new_value")
            if field and new_val:
                setattr(task, field.lower(), new_val)
                task.version += 1
                action_taken = f"Applied human override on field '{field}' -> '{new_val}'"

    db.commit()

    return {
        "status": "processed",
        "event_id": event_id,
        "task_id": task_id,
        "event_type": event_type,
        "state_changed": state_changed,
        "action_taken": action_taken,
        "final_task_status": task.status if task else None,
        "is_duplicate": False
    }
