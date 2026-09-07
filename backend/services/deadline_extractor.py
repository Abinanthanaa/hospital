import re
from typing import Dict, Any

DEADLINE_PATTERNS = [
    (r"\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b", lambda m: m.group(1).capitalize()),
    (r"\bby\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}\b", lambda m: m.group(0).replace("by ", "").strip().capitalize()),
    (r"\bbefore\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}\b", lambda m: m.group(0).replace("before ", "").strip().capitalize()),
    (r"\bstarting\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b", lambda m: f"Starting {m.group(1).capitalize()}"),
    (r"\bby\s+(end of shift|end of week|end of month|tomorrow|today|noon|5 pm|17:00)\b", lambda m: m.group(1).capitalize()),
    (r"\bcompleted by\s+([a-zA-Z0-9\s]+?)(?=\.|$|,)\b", lambda m: m.group(1).strip().capitalize()),
    (r"\bdeadline is\s+([a-zA-Z0-9\s]+?)(?=\.|$|,)\b", lambda m: m.group(1).strip().capitalize()),
    (r"\b(september|october|november|december|january|february)\s+\d{1,2}\b", lambda m: m.group(0).capitalize())
]

def extract_deadline(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    
    for pattern, formatter in DEADLINE_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            extracted_val = formatter(match)
            return {
                "deadline": extracted_val,
                "has_deadline": True,
                "confidence": 0.95,
                "reason": f"Explicit temporal constraint detected in sentence: '{match.group(0)}'"
            }

    return {
        "deadline": "Not specified",
        "has_deadline": False,
        "confidence": 0.0,
        "reason": "No explicit deadline keyword found in transcript"
    }
