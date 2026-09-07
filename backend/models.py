import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=True)

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    department = Column(String(100), nullable=False)
    chair = Column(String(100), nullable=False)
    date = Column(String(50), nullable=False)
    transcript = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    decisions = relationship("Decision", back_populates="meeting", cascade="all, delete-orphan")
    chats = relationship("ChatMessage", back_populates="meeting", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(50), primary_key=True, index=True)
    meeting_id = Column(String(50), ForeignKey("meetings.id"), nullable=True)
    task_id = Column(String(50), ForeignKey("tasks.id"), nullable=True)
    sender = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    msg_type = Column(String(50), default="general") # general, completion_update, decision_update, conflict

    meeting = relationship("Meeting", back_populates="chats")
    task = relationship("Task", back_populates="chats")

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String(50), primary_key=True, index=True)
    meeting_id = Column(String(50), ForeignKey("meetings.id"), nullable=False)
    raw_statement = Column(Text, nullable=False)
    decision_title = Column(String(200), nullable=False)
    classification = Column(String(50), nullable=False) # Confirmed Decision, Proposed Decision, Discussion Only, Rejected Decision, Completed Decision
    extracted_action = Column(Text, nullable=False)
    extracted_owner = Column(String(100), nullable=False)
    owner_confidence = Column(Float, default=0.0)
    extracted_deadline = Column(String(100), nullable=False)
    priority = Column(String(50), default="Medium")
    risk_level = Column(String(50), default="Low")
    is_high_impact = Column(Boolean, default=False)
    confidence_score = Column(Float, default=0.0)
    evidence_quote = Column(Text, nullable=False)
    rules_reason = Column(Text, nullable=False)
    status = Column(String(50), default="Pending Review") # Pending Review, Approved, Rejected, Overridden
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    meeting = relationship("Meeting", back_populates="decisions")
    task = relationship("Task", back_populates="decision", uselist=False)
    overrides = relationship("Override", back_populates="decision")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(50), primary_key=True, index=True)
    decision_id = Column(String(50), ForeignKey("decisions.id"), nullable=True)
    action = Column(Text, nullable=False)
    owner = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    deadline = Column(String(100), nullable=False)
    priority = Column(String(50), default="Medium")
    risk_level = Column(String(50), default="Low")
    status = Column(String(50), default="Pending") # Pending, In Progress, Completed, Overdue, Rejected
    source_evidence = Column(Text, nullable=False)
    completion_evidence = Column(Text, nullable=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    decision = relationship("Decision", back_populates="task")
    chats = relationship("ChatMessage", back_populates="task")
    events = relationship("Event", back_populates="task")
    overrides = relationship("Override", back_populates="task")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(100), unique=True, index=True, nullable=False) # hash for idempotency
    task_id = Column(String(50), ForeignKey("tasks.id"), nullable=True)
    decision_id = Column(String(50), nullable=True)
    event_type = Column(String(50), nullable=False) # DecisionCreated, TaskCreated, TaskAssigned, TaskUpdated, TaskCompleted, ChatUpdate, Override, DeadlineChanged
    source = Column(String(100), nullable=False)
    payload = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    sequence_num = Column(Integer, default=1)

    task = relationship("Task", back_populates="events")

class Override(Base):
    __tablename__ = "overrides"

    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String(50), ForeignKey("decisions.id"), nullable=True)
    task_id = Column(String(50), ForeignKey("tasks.id"), nullable=True)
    field_changed = Column(String(50), nullable=False)
    original_value = Column(String(255), nullable=True)
    new_value = Column(String(255), nullable=False)
    reason = Column(Text, nullable=False)
    reviewer = Column(String(100), default="Hospital Admin")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    decision = relationship("Decision", back_populates="overrides")
    task = relationship("Task", back_populates="overrides")
