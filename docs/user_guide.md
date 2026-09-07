# User Guide - Hospital Decision & Action Tracker

## Operational Workflow Steps

1. **Start System**: Run backend (`uvicorn backend.main:app --reload`) and frontend (`npm run dev`).
2. **Dashboard Overview**: Review system KPIs (Total Decisions, Actions Created, High-Impact Count, Conversion Rate).
3. **Meetings Tab**: Inspect meeting transcripts across Emergency, ICU, Infection Control, Nursing, Pharmacy, Laboratory, and Administration.
4. **Decision Review Queue**: Evaluate extracted decisions. High-impact clinical protocol changes display a prominent safety alert.
5. **Human Approval / Rejection / Override**:
   - **Approve**: Converts decision to an active task.
   - **Reject**: Archives decision with logged rationale.
   - **Override**: Modify Owner or Deadline, entering mandatory reviewer reason.
6. **Task Tracker**: Filter active tasks by Department, Owner, Status, and Priority.
7. **Live Chat Updates**: Post shift updates. System automatically links messages and marks tasks as Completed.
8. **Event Monitor**: Test duplicate event suppression and out-of-order state recovery.
9. **Evaluation Tab**: Inspect Baseline vs Target vs Measured benchmark metrics and categorized error analysis.
