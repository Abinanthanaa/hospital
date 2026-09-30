from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.auth import create_mock_jwt_token, verify_role_permission

router = APIRouter(prefix="/api/auth", tags=["Authentication & Security"])

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str = "Nurse Coordinator"
    department: str = "Infection Control"

@router.post("/login")
def login(req: LoginRequest):
    if not req.username or not req.password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    token = create_mock_jwt_token(req.username, req.role, req.department)
    return token

@router.get("/verify-access")
def verify_access(role: str, required_role: str):
    allowed = verify_role_permission(role, required_role)
    return {
        "user_role": role,
        "required_role": required_role,
        "access_granted": allowed
    }
