import re
from typing import Dict, Any, List

CONFIRMED_PATTERNS = [
    r"\b(starting|effective)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|immediately|next week)\b",
    r"\b(all|every)\s+.*\s+(must|shall|will|is required to)\b",
    r"\b(agreed|decided|approved|mandated|ordered|resolved|confirmed|finalized)\b",
    r"\b(we will|i will|team will)\s+(implement|start|roll out|enforce|conduct|train|update|audit)\b",
    r"\bnew protocol\b",
    r"\b(must be screened|must use|shall follow)\b"
]

PROPOSED_PATTERNS = [
    r"\b(should consider|propose|suggest|might want to|thinking about|could try|maybe we can|option is to)\b",
    r"\b(what if|how about|perhaps we)\b"
]

REJECTED_PATTERNS = [
    r"\b(decided against|rejected|won't be doing|ruled out|canceled|cancelled|not proceeding)\b"
]

COMPLETED_PATTERNS = [
    r"\b(has been completed|already finished|training completed|done with|finalized and deployed|successfully updated)\b"
]

HIGH_IMPACT_KEYWORDS = [
    "infection", "medication", "dose", "chemotherapy", "icu", "patient safety", 
    "triage", "emergency", "isolation", "surgical", "anesthesia", "protocol",
    "blood transfusion", "cardiac arrest", "pediatric"
]

def classify_statement(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    
    classification = "Discussion Only"
    confidence = 0.65
    reasons = []

    # Check Completed
    for pattern in COMPLETED_PATTERNS:
        if re.search(pattern, text_lower):
            classification = "Completed Decision"
            confidence = 0.95
            reasons.append("Matched completion keyword phrase")
            break

    # Check Rejected
    if classification == "Discussion Only":
        for pattern in REJECTED_PATTERNS:
            if re.search(pattern, text_lower):
                classification = "Rejected Decision"
                confidence = 0.90
                reasons.append("Matched rejection directive phrase")
                break

    # Check Confirmed
    if classification == "Discussion Only":
        for pattern in CONFIRMED_PATTERNS:
            if re.search(pattern, text_lower):
                classification = "Confirmed Decision"
                confidence = 0.92
                reasons.append(f"Matched binding commitment pattern ('{pattern}')")
                break

    # Check Proposed
    if classification == "Discussion Only":
        for pattern in PROPOSED_PATTERNS:
            if re.search(pattern, text_lower):
                classification = "Proposed Decision"
                confidence = 0.85
                reasons.append("Matched non-binding proposal pattern")
                break

    if classification == "Discussion Only":
        reasons.append("No explicit decision directive pattern found")

    # High Impact Detection
    is_high_impact = any(kw in text_lower for kw in HIGH_IMPACT_KEYWORDS)
    if is_high_impact:
        reasons.append("Contains critical hospital patient-safety/infection/clinical terms")

    # Risk & Priority Assignment
    if is_high_impact:
        risk_level = "High" if classification == "Confirmed Decision" else "Medium"
        priority = "High"
    else:
        risk_level = "Low"
        priority = "Medium"

    return {
        "classification": classification,
        "confidence_score": round(confidence, 2),
        "is_high_impact": is_high_impact,
        "risk_level": risk_level,
        "priority": priority,
        "reasons": reasons
    }
