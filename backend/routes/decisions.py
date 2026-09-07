import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models import Decision, Task, Override, Event
from backend.schemas import DecisionResponse, DecisionApproveRequest, DecisionRejectRequest, OverrideRequest, OverrideResponse

router = APIRouter(prefix="/api/decisions", tags=["Decisions"])

@router.get("", response_model=List[DecisionResponse])
def get_decisions(department: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Decision)
    if status:
        query = query.filter(Decision.status == status)
    decisions = query.all()
    if department:
        decisions = [d for d in decisions if d.meeting and d.meeting.department.lower() == department.lower()]
    return decisions

@router.get("/{decision_id}", response_model=DecisionResponse)
def get_decision(decision_id: str, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision

@router.post("/{decision_id}/approve")
def approve_decision(decision_id: str, req: DecisionApproveRequest, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    decision.status = "Approved"
    
    # Check if task already exists
    task = db.query(Task).filter(Task.decision_id == decision_id).first()
    if not task:
        t_id = f"TSK-{decision.id.replace('DEC-', '').replace('D', '')}"
        dept = decision.meeting.department if decision.meeting else "Operations"
        task = Task(
            id=t_id,
            decision_id=decision.id,
            action=decision.extracted_action,
            owner=decision.extracted_owner,
            department=dept,
            deadline=decision.extracted_deadline,
            priority=decision.priority,
            risk_level=decision.risk_level,
            status="Pending",
            source_evidence=decision.evidence_quote
        )
        db.add(task)
        db.flush()

        # Log event
        evt = Event(
            event_id=f"EVT-APPROVE-{decision_id}-{int(datetime.datetime.utcnow().timestamp())}",
            task_id=task.id,
            decision_id=decision.id,
            event_type="TaskCreated",
            source="HumanApproval",
            payload=f"{{\"approved_by\":\"{req.reviewer}\",\"action\":\"{task.action}\"}}"
        )
        db.add(evt)

    db.commit()
    return {"message": "Decision approved and task created.", "task_id": task.id, "decision_status": decision.status}

@router.post("/{decision_id}/reject")
def reject_decision(decision_id: str, req: DecisionRejectRequest, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")

    decision.status = "Rejected"
    task = db.query(Task).filter(Task.decision_id == decision_id).first()
    if task:
        task.status = "Rejected"

    override = Override(
        decision_id=decision_id,
        task_id=task.id if task else None,
        field_changed="status",
        original_value="Pending Review",
        new_value="Rejected",
        reason=req.reason,
        reviewer=req.reviewer or "Ops Lead"
    )
    db.add(override)
    db.commit()
    return {"message": "Decision rejected", "decision_status": decision.status}

@router.post("/{decision_id}/override", response_model=OverrideResponse)
def override_decision(decision_id: str, req: OverrideRequest, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")

    field = req.field_changed.lower().replace(" ", "_")
    original_val = getattr(decision, f"extracted_{field}", None) or getattr(decision, field, None)

    # Apply override on Decision
    if hasattr(decision, f"extracted_{field}"):
        setattr(decision, f"extracted_{field}", req.new_value)
    elif hasattr(decision, field):
        setattr(decision, field, req.new_value)
    
    decision.status = "Overridden"

    # Also update Task if task exists
    task = db.query(Task).filter(Task.decision_id == decision_id).first()
    if task:
        if hasattr(task, field):
            setattr(task, field, req.new_value)
        task.version += 1

    override = Override(
        decision_id=decision_id,
        task_id=task.id if task else None,
        field_changed=req.field_changed,
        original_value=str(original_val),
        new_value=req.new_value,
        reason=req.reason,
        reviewer=req.reviewer or "Ops Lead"
    )
    db.add(override)
    db.commit()
    db.refresh(override)
    return override
