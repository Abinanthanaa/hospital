import random
import datetime
from sqlalchemy.orm import Session
from backend.models import User, Meeting, Decision, Task, ChatMessage, Event, Override, Base
from backend.database import engine
from backend.services.evidence_service import process_transcript_statement

DEPARTMENTS = [
    "Emergency Department", "ICU", "Infection Control", 
    "Nursing", "Pharmacy", "Laboratory", "Administration"
]

STAFF_POOL = [
    {"name": "Nurse Priya", "role": "Senior Nurse Coordinator", "dept": "Infection Control"},
    {"name": "Dr. Ravi", "role": "Attending Physician", "dept": "Emergency Department"},
    {"name": "Dr. Kumar", "role": "ICU Department Lead", "dept": "ICU"},
    {"name": "Nurse Sarah", "role": "Nurse Supervisor", "dept": "Nursing"},
    {"name": "Dr. Aisha", "role": "Clinical Director", "dept": "Administration"},
    {"name": "Pharmacy Lead Mark", "role": "Chief Pharmacist", "dept": "Pharmacy"},
    {"name": "Nurse James", "role": "Night Shift Charge Nurse", "dept": "Nursing"},
    {"name": "Dr. Chen", "role": "Lead Pathologist", "dept": "Laboratory"},
    {"name": "Coordinator Elena", "role": "Operations Manager", "dept": "Administration"},
    {"name": "Lab Tech David", "role": "Senior Lab Technician", "dept": "Laboratory"},
    {"name": "Nurse Supervisor Maya", "role": "Triage Supervisor", "dept": "Emergency Department"},
    {"name": "Dr. Marcus", "role": "Consultant Cardiologist", "dept": "ICU"},
    {"name": "Dr. Patel", "role": "Infectious Disease Specialist", "dept": "Infection Control"}
]

SEED_STATEMENT_TEMPLATES = [
    {
        "title": "Infection Screening & Isolation Protocol",
        "dept": "Infection Control",
        "chair": "Dr. Patel",
        "speaker": "Nurse Priya",
        "statement": "Starting Monday, all suspected infection patients must be screened using the new checklist. I will train the night-shift staff by Friday.",
        "is_high_impact": True
    },
    {
        "title": "ICU High-Risk Medication Double-Check",
        "dept": "ICU",
        "chair": "Dr. Kumar",
        "speaker": "Pharmacy Lead Mark",
        "statement": "Starting Monday, all high-risk ICU IV drip titrations require dual verification. I will update the digital pharmacy checklist before September 10.",
        "is_high_impact": True
    },
    {
        "title": "Emergency Department Fast-Track Triage",
        "dept": "Emergency Department",
        "chair": "Dr. Ravi",
        "speaker": "Nurse Supervisor Maya",
        "statement": "We agreed that peak-hour triage screening time must be under 10 minutes. Nurse Supervisor Maya will conduct staff briefing by Wednesday.",
        "is_high_impact": True
    },
    {
        "title": "Pharmacy Controlled Substance Audit",
        "dept": "Pharmacy",
        "chair": "Pharmacy Lead Mark",
        "speaker": "Pharmacy Lead Mark",
        "statement": "Effective immediately, daily automated narcotics counts will run at end of shift. Pharmacy Lead Mark will verify drawer sensors by tomorrow.",
        "is_high_impact": False
    },
    {
        "title": "Laboratory Critical Value Reporting",
        "dept": "Laboratory",
        "chair": "Dr. Chen",
        "speaker": "Lab Tech David",
        "statement": "All panic blood lab values must be called directly to the attending physician within 15 minutes. Lab Tech David will log call times starting Monday.",
        "is_high_impact": True
    },
    {
        "title": "Nursing Shift Handover Standardization",
        "dept": "Nursing",
        "chair": "Nurse Sarah",
        "speaker": "Nurse James",
        "statement": "Shift handover logs must be submitted in the digital portal. Nurse James will train night-shift nurses by end of week.",
        "is_high_impact": False
    },
    {
        "title": "Chemotherapy Preparation Verification",
        "dept": "Pharmacy",
        "chair": "Pharmacy Lead Mark",
        "speaker": "Dr. Aisha",
        "statement": "Starting Monday, chemo compounding protocols must follow cleanroom protocol 4B. Dr. Aisha will inspect cleanroom airflow sensors by Friday.",
        "is_high_impact": True
    },
    {
        "title": "Surgical Site Infection Surveillance",
        "dept": "Infection Control",
        "chair": "Nurse Priya",
        "speaker": "Dr. Patel",
        "statement": "Post-op wound swabs must be audited weekly. Dr. Patel will submit the infection surveillance summary before September 15.",
        "is_high_impact": True
    },
    {
        "title": "Pediatric Emergency Resuscitation Equipment",
        "dept": "Emergency Department",
        "chair": "Dr. Ravi",
        "speaker": "Dr. Ravi",
        "statement": "Pediatric crash carts must undergo daily checklist verification. Dr. Ravi will inspect cart seal tags by tomorrow.",
        "is_high_impact": True
    },
    {
        "title": "Ventilator Maintenance & Airway Safety",
        "dept": "ICU",
        "chair": "Dr. Kumar",
        "speaker": "Dr. Marcus",
        "statement": "All ICU ventilators will undergo filter replacement every 72 hours. Dr. Marcus will calibrate pressure transducers by Thursday.",
        "is_high_impact": True
    }
]

def seed_database(db: Session):
    # Clear existing tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Users
    user_objs = []
    for u in STAFF_POOL:
        user_obj = User(name=u["name"], role=u["role"], department=u["dept"], email=f"{u['name'].lower().replace(' ', '.')}@synthetic-hospital.org")
        db.add(user_obj)
        user_objs.append(user_obj)
    db.commit()

    meeting_count = 0
    decision_count = 0
    task_count = 0
    chat_count = 0
    event_count = 0

    base_date = datetime.datetime.now() - datetime.timedelta(days=15)

    # Generate 52 synthetic meetings
    for i in range(1, 53):
        template = SEED_STATEMENT_TEMPLATES[(i - 1) % len(SEED_STATEMENT_TEMPLATES)]
        dept = template["dept"] if i <= 10 else DEPARTMENTS[i % len(DEPARTMENTS)]
        m_id = f"MGT-2026-{i:03d}"
        m_date = (base_date + datetime.timedelta(days=(i // 4), hours=(i % 8))).strftime("%Y-%m-%d %H:%M")
        
        m_title = f"{template['title']} #{i}" if i > 10 else template["title"]
        speaker = template["speaker"]
        chair = template["chair"]
        statement = template["statement"]

        transcript = (
            f"Meeting called to order by {chair} for {dept}.\n"
            f"Discussion topic: Operational protocol review and departmental action tracking.\n"
            f"{chair}: 'Welcome everyone. Let us review our current procedural guidelines.'\n"
            f"{speaker}: '{statement}'\n"
            f"Coordinator Elena: 'Thank you. We will track this commitment in the system.'\n"
            f"Meeting adjourned."
        )

        meeting = Meeting(
            id=m_id,
            title=m_title,
            department=dept,
            chair=chair,
            date=m_date,
            transcript=transcript,
            summary=f"Operational review meeting covering {m_title} for {dept}."
        )
        db.add(meeting)
        meeting_count += 1
        db.flush()

        # Extract decision from statement
        extracted = process_transcript_statement(statement, speaker=speaker, meeting_title=m_title)
        
        # Give first decision specific demo parameters
        if i == 1:
            d_id = "D024"
        else:
            d_id = f"DEC-{i:03d}"

        # Status distribution: 1-15 Approved, 16-30 Pending Review, 31-45 Overridden, rest Rejected
        if i <= 35:
            d_status = "Approved"
        elif i <= 45:
            d_status = "Pending Review"
        else:
            d_status = "Approved"

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
            status=d_status
        )
        db.add(decision)
        decision_count += 1
        db.flush()

        # Create Task if decision is approved or for initial batch
        if d_status == "Approved" or i <= 35:
            t_id = f"TSK-2026-{i:03d}"
            
            # Status distribution: 1-15 Completed, 16-25 In Progress, 26-35 Pending
            if i <= 15:
                t_status = "Completed"
                c_evidence = f"Training completed by {speaker} on schedule. Verified via shift checklist."
            elif i <= 25:
                t_status = "In Progress"
                c_evidence = None
            else:
                t_status = "Pending"
                c_evidence = None

            task = Task(
                id=t_id,
                decision_id=d_id,
                action=extracted["extracted_action"],
                owner=extracted["extracted_owner"],
                department=dept,
                deadline=extracted["extracted_deadline"],
                priority=extracted["priority"],
                risk_level=extracted["risk_level"],
                status=t_status,
                source_evidence=extracted["evidence_quote"],
                completion_evidence=c_evidence,
                version=1
            )
            db.add(task)
            task_count += 1
            db.flush()

            # Chat messages
            chat_1 = ChatMessage(
                id=f"MSG-{i:03d}-A",
                meeting_id=m_id,
                task_id=t_id,
                sender=speaker,
                content=f"Created task: {extracted['extracted_action']}. Target deadline: {extracted['extracted_deadline']}.",
                msg_type="decision_update"
            )
            db.add(chat_1)
            chat_count += 1

            if t_status == "Completed":
                chat_2 = ChatMessage(
                    id=f"MSG-{i:03d}-B",
                    meeting_id=m_id,
                    task_id=t_id,
                    sender=speaker,
                    content=f"Update: {extracted['extracted_action']} has been completed successfully.",
                    msg_type="completion_update"
                )
                db.add(chat_2)
                chat_count += 1

            # Events
            evt_1 = Event(
                event_id=f"EVT-DEC-{i:03d}",
                task_id=t_id,
                decision_id=d_id,
                event_type="DecisionCreated",
                source="NLP_Extractor",
                payload=f"{{\"decision_id\":\"{d_id}\",\"action\":\"{extracted['extracted_action']}\"}}",
                sequence_num=1
            )
            evt_2 = Event(
                event_id=f"EVT-TSK-{i:03d}",
                task_id=t_id,
                decision_id=d_id,
                event_type="TaskCreated",
                source="TaskEngine",
                payload=f"{{\"task_id\":\"{t_id}\",\"owner\":\"{extracted['extracted_owner']}\"}}",
                sequence_num=2
            )
            db.add(evt_1)
            db.add(evt_2)
            event_count += 2

            if t_status == "Completed":
                evt_3 = Event(
                    event_id=f"EVT-CMP-{i:03d}",
                    task_id=t_id,
                    decision_id=d_id,
                    event_type="TaskCompleted",
                    source="ChatStream",
                    payload=f"{{\"task_id\":\"{t_id}\",\"evidence\":\"{c_evidence}\"}}",
                    sequence_num=3
                )
                db.add(evt_3)
                event_count += 1

    # Add extra synthetic chat messages & events to exceed 100+
    for k in range(1, 40):
        c_msg = ChatMessage(
            id=f"MSG-EXTRA-{k:03d}",
            sender=random.choice(STAFF_POOL)["name"],
            content=f"Shift update #{k}: All routine department checklists verified and logged for shift handover.",
            msg_type="general"
        )
        db.add(c_msg)
        chat_count += 1

        e_msg = Event(
            event_id=f"EVT-SYS-{k:03d}",
            event_type="ChatUpdate",
            source="SystemAudit",
            payload=f"{{\"audit_tick\":{k},\"status\":\"OK\"}}",
            sequence_num=k
        )
        db.add(e_msg)
        event_count += 1

    # Add sample Overrides for Audit History
    override_1 = Override(
        decision_id="DEC-002",
        task_id="TSK-2026-002",
        field_changed="owner",
        original_value="Dr. Ravi",
        new_value="Dr. Kumar",
        reason="Dr. Ravi discussed the action during meeting, but Dr. Kumar is the responsible ICU department lead.",
        reviewer="Coordinator Elena"
    )
    override_2 = Override(
        decision_id="DEC-003",
        task_id="TSK-2026-003",
        field_changed="deadline",
        original_value="Wednesday",
        new_value="Friday",
        reason="Extended deadline to allow thorough staff shift coverage.",
        reviewer="Nurse Sarah"
    )
    db.add(override_1)
    db.add(override_2)

    db.commit()

    return {
        "meetings": meeting_count,
        "decisions": decision_count,
        "tasks": task_count,
        "chats": chat_count,
        "events": event_count
    }
