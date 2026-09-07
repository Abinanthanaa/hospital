from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Meeting
from backend.schemas import MeetingResponse

router = APIRouter(prefix="/api/meetings", tags=["Meetings"])

@router.get("", response_model=List[MeetingResponse])
def get_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).all()

@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting_by_id(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting
