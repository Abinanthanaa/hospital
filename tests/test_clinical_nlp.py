import pytest
from backend.services.clinical_nlp_engine import compute_semantic_similarity, analyze_clinical_context

def test_semantic_similarity():
    sim = compute_semantic_similarity("Train night shift staff on infection control", "Infection control night shift staff training")
    assert sim > 0.6

def test_clinical_context_analysis():
    ctx = analyze_clinical_context("All ICU ventilator filters must be replaced every 72 hours")
    assert ctx["is_bio_clinical"] == True
    assert ctx["primary_domain"] == "respiratory_icu"
    assert ctx["confidence_boost"] > 0.0
