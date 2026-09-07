# Hospital Operational Risk Register

| Risk ID | Risk Description | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|---|
| **RISK-01** | Wrong Owner Assigned | High | Medium | Confidence scoring + explicit human confirmation required before task assignment for high-impact actions. |
| **RISK-02** | Wrong Deadline Extracted | Medium | Low | Explicit temporal pattern matcher defaults to 'Not specified' rather than inventing dates. |
| **RISK-03** | AI Hallucination in Clinical Protocols | Critical | Low | Rule-based deterministic extraction engine with explicit evidence quote requirement and zero autonomous protocol alteration. |
| **RISK-04** | High-Impact Action Automatically Executed | Critical | Low | Prominent high-impact warning modal blocks auto-approval; enforces mandatory manual Approve/Reject/Override. |
| **RISK-05** | Duplicate Event Corruption | Medium | Medium | Idempotent event processor using unique event hash log to prevent double task creation. |
| **RISK-06** | Out-of-Order Event State Regression | High | Low | State sequence matrix and state lock ensure Completed status cannot be regressed by delayed assignment events. |
| **RISK-07** | Conflicting Owner Information | High | Medium | Automatic conflict detection flags conflicting chat updates and raises Human Review alert. |
