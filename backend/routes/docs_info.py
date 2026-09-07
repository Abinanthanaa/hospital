from fastapi import APIRouter

router = APIRouter(prefix="/api/docs-info", tags=["Documentation & Compliance"])

@router.get("/privacy")
def get_privacy_info():
    return {
        "title": "Privacy & Synthetic Data Policy",
        "guarantees": [
            "NO REAL PATIENT DATA IS USED in any shape or form.",
            "NO REAL HOSPITAL RECORDS or electronic health records (EHR) are stored.",
            "ALL STAFF IDENTITIES, meeting transcripts, decisions, and chat messages are 100% fictional/synthetic.",
            "NO PATIENT IDENTIFIERS (PHI/PII) are stored, processed, or generated.",
            "PROTOTYPE ONLY: Built exclusively for demonstration and evaluation purposes.",
            "PRODUCTION DEPLOYMENT REQUIREMENTS: Production deployment would mandate OAuth2/JWT authentication, RBAC authorization, AES-256 encryption at rest, TLS 1.3 in transit, immutable audit logging, HIPAA BAA agreements, and GDPR compliance."
        ],
        "assumptions": [
            "Fictional hospital structure spans 7 departments: Emergency, ICU, Infection Control, Nursing, Pharmacy, Laboratory, Administration.",
            "NLP decision rules emulate clinical ops directives without requiring cloud LLM dependencies.",
            "All operational events run in a local SQLite database file without external network leakage."
        ]
    }

@router.get("/risks")
def get_risk_register():
    return {
        "title": "Hospital Operational Risk Register",
        "risks": [
            {
                "id": "RISK-01",
                "risk": "Wrong Owner Assigned",
                "impact": "High",
                "likelihood": "Medium",
                "mitigation": "Confidence scoring + explicit human confirmation required before task assignment for high-impact actions."
            },
            {
                "id": "RISK-02",
                "risk": "Wrong Deadline Extracted",
                "impact": "Medium",
                "likelihood": "Low",
                "mitigation": "Explicit temporal pattern matcher defaults to 'Not specified' rather than inventing dates."
            },
            {
                "id": "RISK-03",
                "risk": "AI Hallucination in Clinical Protocols",
                "impact": "Critical",
                "likelihood": "Low",
                "mitigation": "Rule-based deterministic extraction engine with explicit evidence quote requirement and zero autonomous protocol alteration."
            },
            {
                "id": "RISK-04",
                "risk": "High-Impact Action Automatically Executed",
                "impact": "Critical",
                "likelihood": "Low",
                "mitigation": "Prominent high-impact warning modal blocks auto-approval; enforces mandatory manual Approve/Reject/Override."
            },
            {
                "id": "RISK-05",
                "risk": "Duplicate Event Corruption",
                "impact": "Medium",
                "likelihood": "Medium",
                "mitigation": "Idempotent event processor using unique event hash log to prevent double task creation."
            },
            {
                "id": "RISK-06",
                "risk": "Out-of-Order Event State Regression",
                "impact": "High",
                "likelihood": "Low",
                "mitigation": "State sequence matrix and state lock ensure Completed status cannot be regressed by delayed assignment events."
            },
            {
                "id": "RISK-07",
                "risk": "Conflicting Owner Information",
                "impact": "High",
                "likelihood": "Medium",
                "mitigation": "Automatic conflict detection flags conflicting chat updates and raises Human Review alert."
            }
        ]
    }

@router.get("/user-guide")
def get_user_guide():
    return {
        "title": "Hospital Decision & Action Tracker - System User Guide",
        "steps": [
            {"step": 1, "title": "Start Application", "desc": "Launch Python FastAPI backend on port 8000 and Vite React frontend on port 5173."},
            {"step": 2, "title": "Open Dashboard Overview", "desc": "Inspect top-level KPIs (Total Decisions, Conversion Rate, Completed Tasks, High-Impact Count)."},
            {"step": 3, "title": "View Meeting Transcripts", "desc": "Navigate to Meetings tab to view transcripts across Emergency, ICU, Infection Control, etc."},
            {"step": 4, "title": "Review Extracted Decisions", "desc": "Open Decision Review screen. Inspect AI recommendations, evidence quotes, and confidence scores."},
            {"step": 5, "title": "Handle High-Impact Approvals", "desc": "Observe high-impact warning flags. Click APPROVE to create a tracked task or REJECT to decline."},
            {"step": 6, "title": "Perform Human Override", "desc": "Click OVERRIDE on any decision/task to modify Owner or Deadline, entering a mandatory audit reason."},
            {"step": 7, "title": "Track Tasks", "desc": "Use Task Tracker grid to filter by Department, Owner, Status, and Risk level."},
            {"step": 8, "title": "Inspect Live Chat Updates", "desc": "Observe chat messages where staff post completion updates that auto-advance tasks to Completed."},
            {"step": 9, "title": "Monitor Event Pipeline", "desc": "View Event Monitor to verify duplicate handling and out-of-order state recovery."},
            {"step": 10, "title": "Run Evaluation Benchmark", "desc": "Open Evaluation tab to compare Baseline vs Target vs Measured metrics and analyze error taxonomy."}
        ]
    }

@router.get("/stakeholders")
def get_stakeholders():
    return {
        "title": "Stakeholders & Synthetic Validation",
        "primary": {
            "role": "Hospital Operations Manager",
            "key_question": "What decisions were made, who is responsible, what is the deadline, and has the action been completed?"
        },
        "secondary": [
            "Department Coordinator",
            "Nurse Shift Coordinator",
            "Doctor / Clinical Lead",
            "Hospital Administrator"
        ],
        "validation_survey": [
            {"id": "Q1", "question": "Does the evidence quote help you trust the extracted decision?", "result": "96% Positive"},
            {"id": "Q2", "question": "Is the high-impact approval safeguard effective for clinical protocols?", "result": "98% Positive"},
            {"id": "Q3", "question": "Does automatic chat completion detection save shift handover time?", "result": "94% Positive"},
            {"id": "Q4", "question": "Is the override audit trail clear and compliant for ops managers?", "result": "95% Positive"}
        ]
    }
