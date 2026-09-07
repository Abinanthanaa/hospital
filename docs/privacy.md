# Data Privacy & Synthetic Data Assumptions

> [!IMPORTANT]
> **SYNTHETIC DATA MANDATE**: This system is constructed strictly using synthetic/anonymized data to demonstrate hospital workflow intelligence without risking patient privacy.

### Key Safeguards & Guarantees
1. **No Real Patient Information**: Zero real patient names, medical record numbers (MRNs), diagnoses, or clinical notes are used.
2. **No Real Hospital Records**: All meeting transcripts, timestamps, room numbers, and protocols are 100% fictional.
3. **Fictional Staff Identities**: All names (e.g. Nurse Priya, Dr. Ravi, Dr. Kumar) are synthesized fictional personas.
4. **No Patient Identifiers Stored**: The database schema contains zero tables for patient personal health information (PHI).
5. **Demonstration Scope**: This system is a proof-of-concept prototype built for technical evaluation.
6. **Production Security Roadmap**: Transitioning to production would require:
   - OAuth2 / SAML Single Sign-On (SSO) authentication
   - Role-Based Access Control (RBAC)
   - AES-256 database encryption at rest & TLS 1.3 in transit
   - Immutable audit logging and HIPAA Business Associate Agreement (BAA) compliance
