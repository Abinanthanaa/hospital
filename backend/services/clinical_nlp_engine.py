import re
import math
from typing import Dict, Any, List

CLINICAL_ANCHORS = {
    "infection_control": ["screening", "isolation", "checklist", "swab", "sterile", "ppe", "sanitization"],
    "medication_safety": ["titration", "infusion", "double-check", "narcotic", "chemo", "dose", "iv drip"],
    "respiratory_icu": ["ventilator", "airway", "extubation", "pressure transducer", "oxygen saturation"],
    "triage_emergency": ["fast-track", "triage", "door-to-balloon", "crash cart", "trauma bay"]
}

def compute_semantic_similarity(text1: str, text2: str) -> float:
    """
    Computes cosine similarity between token n-grams for semantic clinical matching.
    """
    words1 = set(re.findall(r'\w+', text1.lower()))
    words2 = set(re.findall(r'\w+', text2.lower()))
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    similarity = len(intersection) / math.sqrt(len(words1) * len(words2))
    return round(similarity, 3)

def analyze_clinical_context(statement: str) -> Dict[str, Any]:
    text_lower = statement.lower()
    
    domain_scores = {}
    for domain, keywords in CLINICAL_ANCHORS.items():
        match_count = sum(1 for kw in keywords if kw in text_lower)
        if match_count > 0:
            domain_scores[domain] = round(match_count / len(keywords), 2)
            
    primary_domain = max(domain_scores, key=domain_scores.get) if domain_scores else "general_clinical"
    confidence_boost = min(sum(domain_scores.values()) * 20.0, 15.0)

    return {
        "primary_domain": primary_domain,
        "domain_scores": domain_scores,
        "confidence_boost": round(confidence_boost, 1),
        "is_bio_clinical": len(domain_scores) > 0
    }
