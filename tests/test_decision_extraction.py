import pytest
from backend.services.decision_extractor import classify_statement
from backend.services.action_extractor import extract_action
from backend.services.owner_extractor import extract_owner
from backend.services.deadline_extractor import extract_deadline
from backend.services.evidence_service import process_transcript_statement

def test_confirmed_decision_extraction():
    statement = "Starting Monday, all suspected infection patients must be screened using the new checklist. I will train the night-shift staff by Friday."
    res = process_transcript_statement(statement, speaker="Nurse Priya", meeting_title="Infection Screening")
    
    assert res["classification"] == "Confirmed Decision"
    assert res["is_high_impact"] == True
    assert res["extracted_owner"] == "Nurse Priya"
    assert res["extracted_deadline"] == "Friday"
    assert res["confidence_score"] >= 80.0
    assert "screen" in res["extracted_action"].lower() or "train" in res["extracted_action"].lower()

def test_proposed_decision_classification():
    statement = "We should consider changing the protocol next month."
    res = classify_statement(statement)
    assert res["classification"] == "Proposed Decision"

def test_ambiguous_owner_extraction():
    statement = "Someone from the night shift should update the checklist."
    res = extract_owner(statement)
    assert res["owner"] == "Unknown"
    assert res["is_ambiguous"] == True

def test_missing_deadline_extraction():
    statement = "We need to clean the ventilator tubes."
    res = extract_deadline(statement)
    assert res["deadline"] == "Not specified"
    assert res["has_deadline"] == False
