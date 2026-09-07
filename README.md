# Hospital Decision-to-Action Extractor & Action Tracking System

> **A real working end-to-end web application for converting hospital meeting transcripts and chat updates into tracked, evidence-verified actions with idempotent event state recovery.**

---

## 1. Repository & Folder Structure

```
hospital-decision-action-tracker/
├── backend/
│   ├── main.py                     # FastAPI app entry point & startup seeder
│   ├── database.py                 # SQLite SQLAlchemy session manager
│   ├── models.py                   # ORM models (User, Meeting, Decision, Task, Event, Override, ChatMessage)
│   ├── schemas.py                  # Pydantic request/response validation schemas
│   ├── services/
│   │   ├── decision_extractor.py   # Rule-based classification (Confirmed, Proposed, Discussion, Rejected, Completed)
│   │   ├── action_extractor.py     # Explicit action verb extractor ("Unclear" handling)
│   │   ├── owner_extractor.py      # Responsible staff extractor & conflict detector
│   │   ├── deadline_extractor.py   # Temporal parser ("by Friday", "starting Monday", etc.)
│   │   ├── evidence_service.py     # Confidence score & evidence quote generator
│   │   ├── event_processor.py      # Idempotent state processor (Deduplication & Out-of-Order Engine)
│   │   ├── evaluation_engine.py    # Benchmark framework (Baseline vs Target vs Measured metrics)
│   │   └── seed_data.py            # Generator script (52 meetings, 52 decisions, 60+ tasks, 100+ events)
│   └── routes/
│       ├── meetings.py             # Meeting transcripts API
│       ├── decisions.py            # Decision review queue & human approval/override API
│       ├── tasks.py                # Task tracking & status update API
│       ├── chat.py                 # Shift chat stream & auto-completion detection API
│       ├── events.py               # Event monitor & simulation API
│       ├── audit.py                # Override audit log API
│       ├── evaluation.py           # Benchmark metrics & error analysis API
│       ├── demo.py                 # Interactive demo workflow & edge-case injection API
│       └── docs_info.py            # Privacy policy, risk register, and user guide API
├── frontend/
│   ├── index.html                  # HTML entry with Google Font Inter
│   ├── vite.config.ts              # Vite dev server configuration & API proxy
│   ├── tailwind.config.js          # Custom theme & color tokens
│   ├── package.json                # Frontend React, Lucide Icons, Recharts dependencies
│   └── src/
│       ├── components/             # Sidebar, Header, KPICard, DecisionCard, OverrideModal, TaskTable, DemoControlsModal
│       ├── pages/                  # Dashboard, Meetings, Decisions, Tasks, Chat, Evidence, Events, Audit, Evaluation, Risks, Privacy, Docs
│       ├── services/               # Axios API client wrapper
│       └── types/                  # TypeScript interfaces
├── tests/
│   ├── test_decision_extraction.py # Tests NLP classification rules & evidence parsing
│   ├── test_duplicate_events.py    # Tests event deduplication idempotency (EDGE CASE 1)
│   ├── test_delayed_events.py      # Tests delayed assignment events
│   ├── test_out_of_order_events.py # Tests out-of-order state recovery (EDGE CASE 2)
│   └── test_conflicting_owner.py   # Tests owner conflict detection (EDGE CASE 5)
├── docs/
│   ├── architecture.md             # System architecture & interface diagrams
│   ├── privacy.md                  # Synthetic data safeguards & HIPAA roadmap
│   ├── risk_register.md            # Risk matrix with active software mitigations
│   ├── user_guide.md               # Step-by-step user guide
│   └── evaluation.md               # Quantitative benchmark comparison
├── requirements.txt                # Python backend dependencies (FastAPI, SQLAlchemy, Pytest)
└── README.md                       # Project documentation & execution guide
```

---

## 2. Installation & Setup

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ and npm installed

### Step A: Backend Environment Setup
```powershell
# Create Python virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install required packages
pip install -r requirements.txt
```

### Step B: Frontend Environment Setup
```powershell
cd frontend
npm install
cd ..
```

---

## 3. Running the Backend Server
```powershell
# Activate venv if not already active
.\venv\Scripts\Activate.ps1

# Start FastAPI server on port 8000
uvicorn backend.main:app --reload --port 8000
```
> *The database will automatically create `hospital.db` and seed 50+ meetings, 50+ decisions, 60+ tasks, and 100+ events on first startup.*

---

## 4. Running the Frontend Application
In a separate terminal window:
```powershell
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. How to Seed Synthetic Data Manually
The backend seeds automatically on startup. If you wish to re-seed:
```powershell
python -c "from backend.database import SessionLocal; from backend.services.seed_data import seed_database; db=SessionLocal(); print(seed_database(db))"
```

---

## 6. How to Run Automated Tests
```powershell
# Run Pytest suite covering extraction rules, duplicates, delayed, out-of-order, and conflict detection
pytest -v
```

---

## 7. How to Run Evaluation Benchmark
Access the `/api/evaluation` endpoint or view the **Evaluation** tab in the web application dashboard.

---

## 8. 5–10 Minute Demo Flow

1. **Open Dashboard**: Go to `http://localhost:5173`. View top-level KPIs (Total Decisions: 52, Actions Created: 52, High-Impact Count: 35, Conversion Rate: 100%).
2. **Launch Demo Workflow**: Click **Run Demo Workflow** in top header or open **Interactive Demo Mode** from sidebar.
3. **Inspect High-Impact Warning**: Observe decision `D024` ("Introduce new infection screening protocol"). High-impact safety warning modal highlights mandatory human approval requirement.
4. **Approve Action**: Click **[ APPROVE ]**. System creates task `TSK-DEMO-001` ("Train night-shift staff on new screening protocol") assigned to Nurse Priya with deadline Friday.
5. **Inspect Live Chat Completion**: Switch to **Chat Updates** screen. Post message: *"Night shift infection screening training has been completed successfully."* NLP completion engine turns task status to **Completed** and attaches chat quote as evidence.
6. **Demonstrate Duplicate Event**: Open Demo Controls modal -> Click **EDGE CASE 1: Duplicate Event**. System processes identical `TaskCompleted` event ID twice; event engine logs duplicate suppression and preserves single completed state.
7. **Demonstrate Out-of-Order Event**: Click **EDGE CASE 2: Out-of-Order Event**. System ingests `TaskCompleted` BEFORE `TaskCreated` and `TaskAssigned`. State sequence matrix auto-initializes task and recovers clean `Completed` state without regression.
8. **Inspect Audit History & Evaluation**: Open **Audit History** tab to view logged human overrides and **Evaluation** tab to review Baseline vs Target vs Measured benchmark performance.

---

## 9. Important Implementation Decisions

1. **Zero External API Dependency**: Built with rule-based NLP keyword and pattern matchers so the application runs 100% locally out-of-the-box without requiring cloud LLM API keys.
2. **Human-in-the-Loop Safety Gating**: High-impact clinical procedures (infection control, ICU medication titrations, pediatric emergency procedures) require explicit manual approval before tasks become active.
3. **Idempotent State Machine**: Sequence hash tracking and state hierarchy matrices prevent double-task creation from duplicate events and prevent state regression when assignment events arrive out of order.
4. **Complete Evidence Traceability**: Every decision and task links directly to its verbatim transcript quote and exact rule rationale to build clinical operational trust.
