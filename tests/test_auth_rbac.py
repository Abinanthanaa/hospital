import pytest
from backend.services.auth import create_mock_jwt_token, verify_role_permission

def test_create_jwt_token():
    token_res = create_mock_jwt_token("priya_nurse", "Nurse Coordinator", "Infection Control")
    assert "access_token" in token_res
    assert token_res["user"]["sub"] == "priya_nurse"
    assert token_res["user"]["role"] == "Nurse Coordinator"

def test_rbac_permission_hierarchy():
    assert verify_role_permission("Hospital Administrator", "Doctor") == True
    assert verify_role_permission("Doctor", "Department Lead") == False
    assert verify_role_permission("Department Lead", "Nurse Coordinator") == True
