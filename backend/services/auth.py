import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel

ROLES = ["Doctor", "Nurse Coordinator", "Department Lead", "Hospital Administrator"]

class TokenPayload(BaseModel):
    sub: str
    role: str
    department: str
    exp: int

def create_mock_jwt_token(username: str, role: str, department: str) -> Dict[str, Any]:
    """
    Generates OAuth2 JWT token payload for clinical staff authentication.
    """
    exp = int((datetime.datetime.utcnow() + datetime.timedelta(hours=8)).timestamp())
    token_data = {
        "sub": username,
        "role": role if role in ROLES else "Nurse Coordinator",
        "department": department,
        "exp": exp
    }
    mock_token = f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{username}.{role}.{exp}"
    return {
        "access_token": mock_token,
        "token_type": "bearer",
        "user": token_data
    }

def verify_role_permission(user_role: str, required_role: str) -> bool:
    """
    Role-Based Access Control (RBAC) permission validator.
    """
    role_hierarchy = {
        "Nurse Coordinator": 1,
        "Doctor": 2,
        "Department Lead": 3,
        "Hospital Administrator": 4
    }
    
    user_level = role_hierarchy.get(user_role, 0)
    required_level = role_hierarchy.get(required_role, 0)
    return user_level >= required_level
