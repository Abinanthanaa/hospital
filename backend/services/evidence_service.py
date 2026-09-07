from typing import Dict, Any
from backend.services.decision_extractor import classify_statement
from backend.services.action_extractor import extract_action
from backend.services.owner_extractor import extract_owner
from backend.services.deadline_extractor import extract_deadline

def process_transcript_statement(statement: str, speaker: str = "", meeting_title: str = "") -> Dict[str, Any]:
    decision_info = classify_statement(statement)
    action_info = extract_action(statement, default_title=meeting_title)
    owner_info = extract_owner(statement, speaker_name=speaker)
    deadline_info = extract_deadline(statement)

    # Compute overall confidence score
    scores = [
        decision_info["confidence_score"],
        0.90 if action_info["is_clear"] else 0.40,
        owner_info["confidence"],
        0.90 if deadline_info["has_deadline"] else 0.50
    ]
    overall_confidence = round(sum(scores) / len(scores) * 100, 1)

    # Compile rules / reasons checklist
    rule_reasons = []
    if action_info["is_clear"]:
        rule_reasons.append("✓ Explicit action verb detected")
    else:
        rule_reasons.append("⚠ Ambiguous action requiring review")

    if not owner_info["is_ambiguous"]:
        rule_reasons.append(f"✓ Explicit owner detected: {owner_info['owner']}")
    else:
        rule_reasons.append("⚠ Ambiguous owner phrase detected")

    if deadline_info["has_deadline"]:
        rule_reasons.append(f"✓ Explicit deadline detected: {deadline_info['deadline']}")
    else:
        rule_reasons.append("ℹ No explicit deadline specified")

    for r in decision_info["reasons"]:
        rule_reasons.append(f"• {r}")

    return {
        "classification": decision_info["classification"],
        "decision_title": meeting_title or statement[:60] + "...",
        "raw_statement": statement,
        "extracted_action": action_info["action"],
        "extracted_owner": owner_info["owner"],
        "owner_confidence": owner_info["confidence"],
        "extracted_deadline": deadline_info["deadline"],
        "priority": decision_info["priority"],
        "risk_level": decision_info["risk_level"],
        "is_high_impact": decision_info["is_high_impact"],
        "confidence_score": overall_confidence,
        "evidence_quote": f'"{statement.strip()}"',
        "rules_reason": "\n".join(rule_reasons)
    }
