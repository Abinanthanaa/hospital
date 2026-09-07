import pytest
from backend.services.owner_extractor import detect_owner_conflict

def test_detect_owner_conflict():
    current_owner = "Dr. Ravi"
    proposed_owner = "Dr. Kumar"
    
    conflict = detect_owner_conflict(current_owner, proposed_owner)
    assert conflict is not None
    assert conflict["has_conflict"] == True
    assert conflict["original_owner"] == "Dr. Ravi"
    assert conflict["conflicting_owner"] == "Dr. Kumar"
    assert "CONFLICT DETECTED" in conflict["warning"]

def test_no_conflict_when_same_owner():
    conflict = detect_owner_conflict("Nurse Priya", "Nurse Priya")
    assert conflict is None
