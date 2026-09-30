import pytest
from backend.services.fhir_adapter import convert_task_to_fhir, parse_fhir_communication

def test_convert_task_to_fhir():
    task_dict = {
        "id": "TSK-2026-001",
        "action": "Train night-shift staff on infection checklist",
        "owner": "Nurse Priya",
        "department": "Infection Control",
        "deadline": "Friday",
        "priority": "High",
        "risk_level": "High",
        "status": "In Progress",
        "source_evidence": "I will train the night-shift staff by Friday",
        "version": 1
    }

    fhir_task = convert_task_to_fhir(task_dict)
    assert fhir_task["resourceType"] == "Task"
    assert fhir_task["id"] == "TSK-2026-001"
    assert fhir_task["status"] == "in-progress"
    assert fhir_task["owner"]["display"] == "Nurse Priya"
    assert fhir_task["priority"] == "high"

def test_parse_fhir_communication():
    comm = {
        "id": "COMM-001",
        "sender": {"display": "Dr. Ravi"},
        "payload": [{"contentString": "Night shift training completed"}],
        "sent": "2026-09-30T10:00:00Z"
    }

    parsed = parse_fhir_communication(comm)
    assert parsed["sender"] == "Dr. Ravi"
    assert "training completed" in parsed["content"]
