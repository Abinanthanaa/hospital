import re
from typing import Dict, Any

ACTION_VERBS = [
    "train", "update", "screen", "implement", "audit", "draft", "revise", 
    "review", "order", "inspect", "prepare", "conduct", "verify", "install", 
    "setup", "monitor", "notify", "deploy", "check"
]

VAGUE_PATTERNS = [
    r"\bsomeone should\b",
    r"\bwe need to think\b",
    r"\bmaybe later\b",
    r"\blook into it\b"
]

def extract_action(text: str, default_title: str = "") -> Dict[str, Any]:
    text_clean = text.strip()
    text_lower = text_clean.lower()
    
    # Check if vague
    is_vague = any(re.search(pat, text_lower) for pat in VAGUE_PATTERNS)
    
    # Search for action verb clause
    action_found = None
    for verb in ACTION_VERBS:
        match = re.search(rf"\b({verb}\b[^.?!;,]*)", text_clean, re.IGNORECASE)
        if match:
            clause = match.group(1).strip()
            # Capitalize first letter
            action_found = clause[0].upper() + clause[1:]
            break

    if not action_found and default_title:
        # Check if default title has a direct action
        for verb in ACTION_VERBS:
            if verb in default_title.lower():
                action_found = default_title
                break

    if is_vague or not action_found:
        return {
            "action": "Unclear",
            "is_clear": False,
            "reason": "No explicit actionable verb phrase identified or statement is too vague"
        }
    
    return {
        "action": action_found,
        "is_clear": True,
        "reason": f"Extracted explicit action phrase around active verb"
    }
