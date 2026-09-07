from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    role: str
    department: str
    email: Optional[str] = None

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# Meeting Schemas
class MeetingBase(BaseModel):
    title: str
    department: str
    chair: str
    date: str
    transcript: str
    summary: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# Override Schemas
class OverrideRequest(BaseModel):
    field_changed: str # Action, Owner, Deadline, Priority, Risk level
    new_value: str
    reason: str
    reviewer: Optional[str] = "Ops Manager"

class OverrideResponse(BaseModel):
    id: int
    decision_id: Optional[str] = None
    task_id: Optional[str] = None
    field_changed: str
    original_value: Optional[str] = None
    new_value: str
    reason: str
    reviewer: str
    timestamp: datetime.datetime
    class Config:
        from_attributes = True

# Decision Schemas
class DecisionResponse(BaseModel):
    id: str
    meeting_id: str
    raw_statement: str
    decision_title: str
    classification: str
    extracted_action: str
    extracted_owner: str
    owner_confidence: float
    extracted_deadline: str
    priority: str
    risk_level: str
    is_high_impact: bool
    confidence_score: float
    evidence_quote: str
    rules_reason: str
    status: str
    created_at: datetime.datetime
    overrides: List[OverrideResponse] = []
    class Config:
        from_attributes = True

class DecisionApproveRequest(BaseModel):
    reviewer: Optional[str] = "Ops Lead"
    notes: Optional[str] = None

class DecisionRejectRequest(BaseModel):
    reason: str
    reviewer: Optional[str] = "Ops Lead"

# Task Schemas
class TaskResponse(BaseModel):
    id: str
    decision_id: Optional[str] = None
    action: str
    owner: str
    department: str
    deadline: str
    priority: str
    risk_level: str
    status: str
    source_evidence: str
    completion_evidence: Optional[str] = None
    version: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    class Config:
        from_attributes = True

class TaskUpdateRequest(BaseModel):
    status: Optional[str] = None
    owner: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None

# Chat Schemas
class ChatMessageBase(BaseModel):
    meeting_id: Optional[str] = None
    task_id: Optional[str] = None
    sender: str
    content: str
    msg_type: Optional[str] = "general"

class ChatMessageResponse(ChatMessageBase):
    id: str
    timestamp: datetime.datetime
    class Config:
        from_attributes = True

# Event Schemas
class EventCreate(BaseModel):
    event_id: str
    task_id: Optional[str] = None
    decision_id: Optional[str] = None
    event_type: str
    source: str
    payload: str
    sequence_num: Optional[int] = 1
    timestamp: Optional[datetime.datetime] = None

class EventResponse(BaseModel):
    id: int
    event_id: str
    task_id: Optional[str] = None
    decision_id: Optional[str] = None
    event_type: str
    source: str
    payload: str
    timestamp: datetime.datetime
    sequence_num: int
    class Config:
        from_attributes = True

# Evaluation Schemas
class MetricItem(BaseModel):
    metric: str
    baseline: float
    target: float
    measured: float
    unit: str

class ErrorAnalysisItem(BaseModel):
    id: str
    input_text: str
    system_output: str
    expected_output: str
    error_category: str
    possible_improvement: str

class EvaluationReportResponse(BaseModel):
    metrics: List[MetricItem]
    error_analysis: List[ErrorAnalysisItem]
    total_meetings_evaluated: int
    total_decisions_evaluated: int
    total_tasks_evaluated: int
