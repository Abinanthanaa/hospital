import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models import Task, Event
from backend.schemas import TaskResponse, TaskUpdateRequest

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskResponse])
def get_tasks(
    department: Optional[str] = None,
    owner: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    risk: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Task)
    if department:
        query = query.filter(Task.department == department)
    if owner:
        query = query.filter(Task.owner.ilike(f"%{owner}%"))
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if risk:
        query = query.filter(Task.risk_level == risk)

    return query.order_by(Task.updated_at.desc()).all()

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, req: TaskUpdateRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if req.status and req.status != task.status:
        task.status = req.status
        if req.status == "Completed" and not task.completion_evidence:
            task.completion_evidence = f"Manual status update to Completed by user at {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
        
        # Log Event
        evt = Event(
            event_id=f"EVT-UPD-{task_id}-{int(datetime.datetime.utcnow().timestamp())}",
            task_id=task.id,
            event_type="TaskUpdated",
            source="UserInterface",
            payload=f"{{\"new_status\":\"{req.status}\"}}"
        )
        db.add(evt)

    if req.owner:
        task.owner = req.owner
    if req.deadline:
        task.deadline = req.deadline
    if req.priority:
        task.priority = req.priority

    task.version += 1
    task.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task
