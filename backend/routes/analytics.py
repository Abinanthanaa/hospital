from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.services.shift_analytics import compute_shift_handover_analytics

router = APIRouter(prefix="/api/analytics", tags=["Shift Handover Analytics"])

@router.get("/handover-risk")
def get_handover_analytics(db: Session = Depends(get_db)):
    return compute_shift_handover_analytics(db)
