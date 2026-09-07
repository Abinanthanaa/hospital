import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Meeting, Decision, Task, ChatMessage, Event
from backend.services.evidence_service import process_transcript_statement
from backend.services.event_processor import process_event

router = APIRouter(prefix="/api/demo", tags=["Demo Mode Workflow"])

@router.post("/run-flow")
def run_demo_workflow(db: Session = Depends(get_db)):
    m_id = "MGT-DEMO-001"
    statement = "Starting Monday, all suspected infection patients must be screened using the new checklist. I will train the night-shift staff by Friday."
    
    # 1. Reset/ensure demo meeting exists
    meeting = db.query(Meeting).filter(Meeting.id == m_id).first()
    if not meeting:
        meeting = Meeting(
            id=m_id,
            title="Infection Control Mandatory Protocol Meeting",
            department="Infection Control",
            chair="Dr. Patel",
            date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            transcript=f"Dr. Patel: 'Reviewing infection screening.'\nNurse Priya: '{statement}'",
            summary="Emergency infection control protocol review."
        )
        db.add(meeting)
        db.flush()

    # 2. Extract decision
    extracted = process_transcript_statement(statement, speaker="Nurse Priya", meeting_title="Infection Screening Protocol")
    
    d_id = "D024"
    decision = db.query(Decision).filter(Decision.id == d_id).first()
    if not decision:
        decision = Decision(
            id=d_id,
            meeting_id=m_id,
            raw_statement=statement,
            decision_title=extracted["decision_title"],
            classification=extracted["classification"],
            extracted_action=extracted["extracted_action"],
            extracted_owner=extracted["extracted_owner"],
            owner_confidence=extracted["owner_confidence"],
            extracted_deadline=extracted["extracted_deadline"],
            priority=extracted["priority"],
            risk_level=extracted["risk_level"],
            is_high_impact=extracted["is_high_impact"],
            confidence_score=extracted["confidence_score"],
            evidence_quote=extracted["evidence_quote"],
            rules_reason=extracted["rules_reason"],
            status="Pending Review"
        )
        db.add(decision)
        db.flush()
    else:
        decision.status = "Pending Review"

    # 3. Simulate Human Approval
    decision.status = "Approved"
    t_id = "TSK-DEMO-001"
    task = db.query(Task).filter(Task.id == t_id).first()
    if not task:
        task = Task(
            id=t_id,
            decision_id=d_id,
            action=extracted["extracted_action"],
            owner=extracted["extracted_owner"],
            department="Infection Control",
            deadline=extracted["extracted_deadline"],
            priority=extracted["priority"],
            risk_level=extracted["risk_level"],
            status="Pending",
            source_evidence=extracted["evidence_quote"]
        )
        db.add(task)
        db.flush()
    else:
        task.status = "Pending"
        task.completion_evidence = None

    # 4. Simulate Chat Completion Message arriving later
    chat_content = "Night shift infection screening training has been completed successfully."
    chat_msg = ChatMessage(
        id=f"MSG-DEMO-{int(datetime.datetime.utcnow().timestamp())}",
        meeting_id=m_id,
        task_id=t_id,
        sender="Nurse Priya",
        content=chat_content,
        msg_type="completion_update",
        timestamp=datetime.datetime.utcnow()
    )
    db.add(chat_msg)

    # 5. Process completion event
    process_event(db, {
        "event_id": f"EVT-DEMO-CMP-{int(datetime.datetime.utcnow().timestamp())}",
        "task_id": t_id,
        "event_type": "TaskCompleted",
        "source": "ChatCompletionDetector",
        "payload": {"evidence": chat_content, "sender": "Nurse Priya"}
    })

    db.commit()

    return {
        "scenario": "End-to-End Infection Control Protocol Workflow",
        "meeting": meeting.title,
        "raw_statement": statement,
        "extracted_decision": {
            "id": d_id,
            "decision": extracted["decision_title"],
            "action": extracted["extracted_action"],
            "owner": extracted["extracted_owner"],
            "deadline": extracted["extracted_deadline"],
            "is_high_impact": extracted["is_high_impact"],
            "confidence": f"{extracted['confidence_score']}%",
            "evidence": extracted["evidence_quote"]
        },
        "human_approval": "APPROVED",
        "created_task_id": t_id,
        "chat_update": chat_content,
        "final_task_status": task.status,
        "completion_evidence": task.completion_evidence
    }

@router.post("/inject-ambiguous")
def inject_ambiguous(db: Session = Depends(get_db)):
    statement = "Someone from the night shift should update the infection checklist."
    extracted = process_transcript_statement(statement, speaker="", meeting_title="Ambiguous Infection Checklist")
    
    d_id = f"DEC-AMB-{int(datetime.datetime.utcnow().timestamp())}"
    decision = Decision(
        id=d_id,
        meeting_id="MGT-2026-001",
        raw_statement=statement,
        decision_title=extracted["decision_title"],
        classification=extracted["classification"],
        extracted_action=extracted["extracted_action"],
        extracted_owner=extracted["extracted_owner"],
        owner_confidence=extracted["owner_confidence"],
        extracted_deadline=extracted["extracted_deadline"],
        priority="Medium",
        risk_level="Medium",
        is_high_impact=True,
        confidence_score=45.0,
        evidence_quote=f'"{statement}"',
        rules_reason="⚠ AMBIGUOUS OWNER DETECTED: Statement specifies 'someone from night shift'. Requires human assignment before task creation.",
        status="Pending Review"
    )
    db.add(decision)
    db.commit()
    return {"message": "Injected ambiguous owner decision", "decision_id": d_id, "owner": extracted["extracted_owner"], "warning": "Requires Human Review"}

@router.post("/inject-conflict")
def inject_conflict(task_id: str = "TSK-2026-001", db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        task = db.query(Task).first()
    
    orig_owner = task.owner
    conflicting_owner = "Dr. Kumar" if "Kumar" not in orig_owner else "Dr. Ravi"

    chat_content = f"Dr. Kumar is responsible for the checklist and is taking over from {orig_owner}."
    
    chat_msg = ChatMessage(
        id=f"MSG-CNF-{int(datetime.datetime.utcnow().timestamp())}",
        task_id=task.id,
        sender="Dr. Aisha",
        content=chat_content,
        msg_type="conflict",
        timestamp=datetime.datetime.utcnow()
    )
    db.add(chat_msg)
    db.commit()

    return {
        "message": "Injected owner conflict notification",
        "task_id": task.id,
        "original_owner": orig_owner,
        "conflicting_owner": conflicting_owner,
        "warning": f"⚠ CONFLICT DETECTED: Meeting assigned to '{orig_owner}' but chat states '{conflicting_owner}' is taking over. Human override required."
    }
