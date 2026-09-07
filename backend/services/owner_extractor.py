import re
from typing import Dict, Any, List, Optional

KNOWN_STAFF_MEMBERS = [
    "Nurse Priya", "Dr. Ravi", "Dr. Kumar", "Nurse Sarah", "Dr. Aisha",
    "Pharmacy Lead Mark", "Nurse James", "Dr. Chen", "Coordinator Elena",
    "Lab Tech David", "Nurse Supervisor Maya", "Dr. Marcus", "Dr. Patel"
]

AMBIGUOUS_PATTERNS = [
    r"\bsomeone\b", r"\banybody\b", r"\ba nurse\b", r"\ba doctor\b",
    r"\bthe team\b", r"\bwhoever is on shift\b", r"\bsomeone from\b"
]

def extract_owner(text: str, speaker_name: str = "") -> Dict[str, Any]:
    text_lower = text.lower()
    
    # 1. Check for explicit staff name match
    for staff in KNOWN_STAFF_MEMBERS:
        # Match full name or last name
        last_name = staff.split()[-1]
        first_name = staff.split()[0]
        if staff.lower() in text_lower or f"dr. {last_name.lower()}" in text_lower or f"nurse {first_name.lower()}" in text_lower:
            return {
                "owner": staff,
                "confidence": 0.95,
                "is_ambiguous": False,
                "reason": f"Explicit staff mention ('{staff}') detected in transcript"
            }

    # 2. Check for self-assigned statements ("I will...", "I can take care of...")
    if re.search(r"\b(i will|i can|i'll|i am going to|i'm handling)\b", text_lower) and speaker_name:
        return {
            "owner": speaker_name,
            "confidence": 0.90,
            "is_ambiguous": False,
            "reason": f"First-person commitment by speaker '{speaker_name}'"
        }

    # 3. Check for ambiguous phrases
    for pattern in AMBIGUOUS_PATTERNS:
        if re.search(pattern, text_lower):
            return {
                "owner": "Unknown",
                "confidence": 0.20,
                "is_ambiguous": True,
                "reason": "Ambiguous ownership phrase detected ('someone/whoever'). Requires human assignment."
            }

    # 4. Fallback speaker assignment if sentence is passive directive
    if speaker_name:
        return {
            "owner": speaker_name,
            "confidence": 0.70,
            "is_ambiguous": False,
            "reason": f"Assigned to meeting speaker '{speaker_name}' by context."
        }

    return {
        "owner": "Unknown",
        "confidence": 0.0,
        "is_ambiguous": True,
        "reason": "No explicit owner or speaker metadata found."
    }

def detect_owner_conflict(current_owner: str, proposed_owner: str) -> Optional[Dict[str, Any]]:
    if not current_owner or not proposed_owner:
        return None
    
    if current_owner.lower() != proposed_owner.lower() and current_owner != "Unknown" and proposed_owner != "Unknown":
        return {
            "has_conflict": True,
            "original_owner": current_owner,
            "conflicting_owner": proposed_owner,
            "warning": f"⚠ CONFLICT DETECTED: Meeting assigned task to '{current_owner}' but chat update specifies '{proposed_owner}'. Human review required."
        }
    return None
