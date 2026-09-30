import json
import datetime
from typing import Dict, Any, List

def convert_task_to_fhir(task_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts internal Task object into a standardized HL7 FHIR R4 Task Resource.
    """
    status_map = {
        "Pending": "requested",
        "In Progress": "in-progress",
        "Completed": "completed",
        "Rejected": "rejected"
    }

    fhir_task = {
        "resourceType": "Task",
        "id": task_data.get("id", "TSK-UNKNOWN"),
        "meta": {
            "versionId": str(task_data.get("version", 1)),
            "lastUpdated": datetime.datetime.utcnow().isoformat() + "Z"
        },
        "status": status_map.get(task_data.get("status"), "requested"),
        "intent": "order",
        "priority": task_data.get("priority", "routine").lower(),
        "code": {
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "code": "708170007",
                    "display": "Hospital protocol directive execution"
                }
            ],
            "text": task_data.get("action", "Clinical Directive")
        },
        "description": task_data.get("action"),
        "owner": {
            "display": task_data.get("owner", "Unassigned Staff")
        },
        "executionPeriod": {
            "end": task_data.get("deadline", "Not specified")
        },
        "reasonCode": {
            "text": task_data.get("source_evidence", "Extracted from meeting transcript")
        },
        "note": [
            {
                "text": f"Department: {task_data.get('department')} | Risk Level: {task_data.get('risk_level')}"
            }
        ]
    }
    return fhir_task

def parse_fhir_communication(fhir_communication: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses incoming FHIR R4 Communication Resource into internal meeting/chat update schema.
    """
    payload_text = ""
    for payload_item in fhir_communication.get("payload", []):
        if "contentString" in payload_item:
            payload_text += payload_item["contentString"] + " "

    sender = fhir_communication.get("sender", {}).get("display", "Unknown Sender")
    
    return {
        "message_id": fhir_communication.get("id"),
        "sender": sender,
        "content": payload_text.strip(),
        "timestamp": fhir_communication.get("sent", datetime.datetime.utcnow().isoformat())
    }
