import datetime
import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models import ChatMessage, Task, Event
from backend.schemas import ChatMessageResponse, ChatMessageBase
from backend.services.event_processor import process_event
from backend.services.owner_extractor import detect_owner_conflict

router = APIRouter(prefix="/api/chat", tags=["Chat Feed"])

COMPLETION_PATTERNS = [
    r"\b(completed|done|finished|trained|verified|installed|checklist finalized|screened|updated|audited)\b"
]

@router.get("", response_model=List[ChatMessageResponse])
def get_chat_messages(limit: int = 100, db: Session = Depends(get_db)):
    return db.query(ChatMessage).order_by(ChatMessage.timestamp.desc()).limit(limit).all()

@router.post("", response_model=ChatMessageResponse)
def post_chat_message(req: ChatMessageBase, db: Session = Depends(get_db)):
    msg_id = f"MSG-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    content_lower = req.content.lower()

    # 1. Automatic completion detection logic
    msg_type = req.msg_type or "general"
    linked_task = None

    if req.task_id:
        linked_task = db.query(Task).filter(Task.id == req.task_id).first()

    if not linked_task:
        # Search task by keywords in chat content
        tasks = db.query(Task).filter(Task.status != "Completed").all()
        for t in tasks:
            # Check if key action word or task id matches
            if t.id.lower() in content_lower or any(word in content_lower for word in t.action.lower().split() if len(word) > 4):
                linked_task = t
                break

    is_completion = any(re.search(pat, content_lower) for pat in COMPLETION_PATTERNS)
    
    if is_completion and linked_task:
        msg_type = "completion_update"
        
        # Process completion via Event Processor engine
        event_data = {
            "event_id": f"EVT-CHAT-CMP-{linked_task.id}-{int(datetime.datetime.utcnow().timestamp())}",
            "task_id": linked_task.id,
            "event_type": "TaskCompleted",
            "source": "ChatCompletionDetector",
            "payload": {
                "evidence": f'"{req.content}" (Reported by {req.sender})',
                "sender": req.sender
            }
        }
        process_event(db, event_data)

    # 2. Check owner conflict detection
    if linked_task and ("responsible" in content_lower or "taking over" in content_lower):
        # Look for staff names in message
        from backend.services.owner_extractor import KNOWN_STAFF_MEMBERS
        for staff in KNOWN_STAFF_MEMBERS:
            if staff.lower() in content_lower and staff.lower() != linked_task.owner.lower():
                conflict = detect_owner_conflict(linked_task.owner, staff)
                if conflict:
                    msg_type = "conflict"
                    break

    chat_msg = ChatMessage(
        id=msg_id,
        meeting_id=req.meeting_id,
        task_id=linked_task.id if linked_task else req.task_id,
        sender=req.sender,
        content=req.content,
        msg_type=msg_type,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(chat_msg)
    db.commit()
    db.refresh(chat_msg)
    return chat_msg
