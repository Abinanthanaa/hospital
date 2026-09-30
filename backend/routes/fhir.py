from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Task
from backend.services.fhir_adapter import convert_task_to_fhir, parse_fhir_communication

router = APIRouter(prefix="/api/fhir", tags=["FHIR Interoperability"])

@router.get("/task/{task_id}")
def get_fhir_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_dict = {
        "id": task.id,
        "action": task.action,
        "owner": task.owner,
        "department": task.department,
        "deadline": task.deadline,
        "priority": task.priority,
        "risk_level": task.risk_level,
        "status": task.status,
        "source_evidence": task.source_evidence,
        "version": task.version
    }
    return convert_task_to_fhir(task_dict)

@router.post("/parse-communication")
def parse_fhir_comm(fhir_payload: dict):
    parsed = parse_fhir_communication(fhir_payload)
    return {
        "status": "parsed_successfully",
        "internal_schema": parsed
    }
