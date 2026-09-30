from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models import Task, Decision

def compute_shift_handover_analytics(db: Session) -> Dict[str, Any]:
    tasks = db.query(Task).all()
    
    total_tasks = len(tasks)
    pending_tasks = [t for t in tasks if t.status == "Pending"]
    in_progress_tasks = [t for t in tasks if t.status == "In Progress"]
    completed_tasks = [t for t in tasks if t.status == "Completed"]
    
    high_risk_pending = [t for t in pending_tasks if t.risk_level == "High" or t.priority == "High"]
    
    # Department Risk Index
    dept_risk = {}
    for t in tasks:
        dept = t.department
        if dept not in dept_risk:
            dept_risk[dept] = {"total": 0, "pending": 0, "high_risk": 0}
        dept_risk[dept]["total"] += 1
        if t.status in ["Pending", "In Progress"]:
            dept_risk[dept]["pending"] += 1
        if t.risk_level == "High" and t.status != "Completed":
            dept_risk[dept]["high_risk"] += 1

    # Shift Handover Score (0-100%, higher = safer handover)
    handover_safety_score = round(max(0, 100.0 - (len(high_risk_pending) * 8.0) - (len(pending_tasks) * 1.5)), 1)

    return {
        "total_tasks": total_tasks,
        "completed_count": len(completed_tasks),
        "in_progress_count": len(in_progress_tasks),
        "pending_count": len(pending_tasks),
        "high_risk_pending_count": len(high_risk_pending),
        "handover_safety_score": handover_safety_score,
        "department_risk_breakdown": dept_risk,
        "shift_readiness_status": "OPTIMAL HANDOVER" if handover_safety_score >= 80.0 else "ATTENTION REQUIRED"
    }
