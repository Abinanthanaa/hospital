# Architecture Specification - Hospital Decision-to-Action System

## High-Level Architecture Diagram

```
 MEETING TRANSCRIPT / CHAT STREAM
               │
               ▼
 ┌────────────────────────────────────────────────────────┐
 │           NLP & HEURISTIC EXTRACTION ENGINE            │
 │  - Decision Classifier (Confirmed/Proposed/Rejected)   │
 │  - Action Phrase Extractor                             │
 │  - Owner & Ambiguity Resolver                          │
 │  - Deadline Temporal Parser                            │
 │  - Risk & High-Impact Detection                        │
 └─────────────────────────────┬──────────────────────────┘
                               │
                               ▼
 ┌────────────────────────────────────────────────────────┐
 │            EVIDENCE & CONFIDENCE SCORING               │
 │  - Evidence Quote Linking                              │
 │  - Rules Rationale Matrix (0-100% Score)               │
 └─────────────────────────────┬──────────────────────────┘
                               │
                               ▼
 ┌────────────────────────────────────────────────────────┐
 │               HUMAN CONFIRMATION GATEWAY               │
 │  - High-Impact Action Safety Warning                   │
 │  - Approve / Reject / Override Controls                │
 └─────────────────────────────┬──────────────────────────┘
                               │
                               ▼
 ┌────────────────────────────────────────────────────────┐
 │            IDEMPOTENT EVENT PROCESSOR ENGINE           │
 │  - Sequence Hash Deduplication                         │
 │  - Out-of-Order & Delayed State Machine                │
 └─────────────────────────────┬──────────────────────────┘
                               │
                               ▼
 ┌────────────────────────────────────────────────────────┐
 │           SQLITE DB & OPERATIONAL DASHBOARD            │
 │  - Task Tracker, Audit Trail, Evaluation Benchmark     │
 └────────────────────────────────────────────────────────┘
```

## System Interfaces & Endpoints
- REST APIs built with FastAPI
- Frontend developed with React + TypeScript + Tailwind CSS
- Persistence managed via SQLAlchemy ORM & SQLite database
