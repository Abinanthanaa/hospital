from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Override
from backend.schemas import OverrideResponse

router = APIRouter(prefix="/api/audit", tags=["Audit Log"])

@router.get("", response_model=List[OverrideResponse])
def get_audit_trail(db: Session = Depends(get_db)):
    return db.query(Override).order_by(Override.timestamp.desc()).all()
