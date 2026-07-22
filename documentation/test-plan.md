# Test Plan — VacaFlow_03

**Project:** VacaFlow_03
**Document ID:** TP-001
**Phase:** 08 — Quality
**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Draft
**References:** FRS-001 (Functional Requirements Specification), NFR-001 (Non-Functional Requirements Specification)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version |

---

## 1. Introduction

### 1.1 Purpose

This Test Plan defines the testing strategy, scope, schedule, resource requirements, and quality criteria for VacaFlow_03 — the locally executable absence request management application developed for IGS Solutions. It establishes the foundation for all quality assurance activities leading to MVP acceptance and guides the QA team through functional, security, usability, and reliability testing of the complete request lifecycle.

### 1.2 Background

VacaFlow_03 replaces an informal absence management process conducted through email, Microsoft Teams messages, and ad-hoc spreadsheets. The application introduces a five-state request lifecycle (Draft → Submitted → Approved / Rejected / Cancelled), two roles (Employee and Manager), application-managed local authentication, and a formal Approval Record that permanently ties every manager decision to the authenticated manager's identity. The MVP is intended for local execution during a bounded review window and is not a production deployment.

### 1.3 Scope

#### In Scope

| Area | Details |
|------|---------|
| Authentication | Registration, login, logout, current-user endpoint, session integrity |
| Absence Type Catalog | Seeded types, list endpoint, absence of maintenance endpoints |
| Absence Request Management | Create, edit, submit, cancel, list with final decision |
| Manager Review and Approval | Approve, reject, optional comment, manager review list |
| Lifecycle State Enforcement | All valid and invalid state transitions and associated error responses |
| Business Rule Enforcement | All 11 business rules from FRS-001 §5 |
| Security Controls | Password hashing, server-side authorization, RBAC, database file protection, personal data isolation |
| Usability | State-appropriate action visibility, plain-language labels, desktop viewport rendering |
| Local Setup | Clone-to-running-application walkthrough, database initialization, README completeness |

#### Out of Scope

| Area | Rationale |
|------|-----------|
| Microsoft Entra ID / SSO | Excluded from MVP per FRS-001 §6 OS-001 |
| Azure deployment and cloud hosting | Local execution only per FRS-001 §6 OS-002 |
| Docker and CI/CD pipelines | Not required for MVP per FRS-001 §6 OS-003 |
| Email and Teams notifications | No notification infrastructure in MVP per FRS-001 §6 OS-004 |
| Password reset flows | Manual reset via seeded data per FRS-001 §6 OS-005 |
| Vacation balance calculations | Out of MVP scope per FRS-001 §6 OS-007 |
| Overlapping request validation | Not required for workflow demonstration per FRS-001 §6 OS-009 |
| Reporting and data exports | No analytics layer in MVP per FRS-001 §6 OS-011 |
| Formal accessibility certification | Not in scope for MVP per FRS-001 §6 OS-018 |
| Load and stress testing | No concurrent-scale targets defined; manual concurrency test only per NFR-001 NFR-PERF-002 |
| Formal regulatory compliance audits | No SOC 2, GDPR, or HIPAA certification for MVP per NFR-001 NFR-COMP-001 |
| Mobile viewport optimization | MVP is reviewed on desktop machines per NFR-001 NFR-USE-003 |
| Multi-level approvals | Single Manager decision per request per FRS-001 §6 OS-013 |

### 1.4 References

| Document | Document ID | Version |
|----------|-------------|---------|
| Functional Requirements Specification | FRS-001 | 1.0 |
| Non-Functional Requirements Specification | NFR-001 | 1.0 |

---

## 2. Test Strategy

### 2.1 Testing Levels

| Level | Description | Responsibility | Automation |
|-------|-------------|----------------|------------|
| Unit Testing | Code-level validation of domain logic, business rules, and service methods | Development Team | Required — minimum 80% coverage before QA cycle begins |
| Integration Testing | API endpoint behavior, database interaction, session handling, transaction integrity | QA / Dev | High — critical API paths automated |
| System Testing | End-to-end validation of the complete request lifecycle across both roles | QA Team | Medium — core lifecycle flows automated where feasible |
| Security Testing | Vulnerability assessment against the Critical NFRs defined in NFR-001 §2 | QA Team | Manual with targeted API tooling |
| Usability Testing | Review of UI state-action visibility, labeling, and desktop viewport rendering | QA Team | Manual |
| Local Setup Testing | Clone-to-running-application walkthrough per NFR-001 NFR-COMPAT-001 | QA Lead | Manual — first-time fresh clone |
| UAT | Business acceptance of the complete workflow by the review group | Review Group / QA | Manual |

### 2.2 Test Types

#### Functional Testing

- **Approach:** Black-box testing against all functional requirements in FRS-001 §3 and all use cases in FRS-001 §4
- **Coverage Target:** 100% of Must Have requirements; 100% of Should Have requirements where testable in the local environment
- **Automation Target:** 60% of functional test cases automated via API-level tests

#### Integration Testing

- **Approach:** API integration tests covering every defined endpoint, exercising authentication flow, request lifecycle transitions, role enforcement, and transactional integrity for approval records
- **Focus Areas:** Session token propagation, server-side identity derivation (FR-AUTH-008, FR-ARM-010, FR-MRA-005), atomicity of approve/reject operations (NFR-REL-002), input validation at API boundary (NFR-REL-003)
- **Automation Target:** 80% of integration test cases automated

#### Security Testing

- **Approach:** Manual API testing with crafted payloads targeting identity spoofing, role escalation, cross-user data access, and plain-text password inspection
- **Focus Areas:**
  - Password hash verification (NFR-SEC-001)
  - Spoofed employeeId / approverId payloads (NFR-SEC-002)
  - Manager role self-assignment via registration (NFR-SEC-003)
  - SQLite file accessibility via web server (NFR-SEC-004)
  - Cross-user data retrieval (NFR-SEC-005)
- **Standards:** OWASP Top 10 as a reference checklist (MVP-appropriate subset)

#### Usability Testing

- **Approach:** Structured manual walkthrough by a first-time reviewer using only the README and the running application
- **Focus Areas:** Action button visibility per lifecycle state (NFR-USE-002), plain-language labels (NFR-USE-001), desktop viewport rendering at 1280×800 and 1920×1080 (NFR-USE-003)

#### Regression Testing

- **Approach:** Risk-based regression — re-execute all integration and functional automated tests on every defect fix build
- **Automation:** Required for all previously passing automated cases
- **Trigger:** Every build deployed to the QA environment following a defect fix

### 2.3 Test Design Techniques

The following techniques are applied to derive test cases from FRS-001 and NFR-001:

| Technique | Application |
|-----------|-------------|
| Equivalence Partitioning | Date field validation (valid, past, end-before-start), role field (Employee, Manager, invalid), request state (all five states) |
| Boundary Value Analysis | Date boundaries (today, today−1, today+1, end=start, end=start−1) |
| Decision Table Testing | Business rule combinations for approve/reject eligibility (role, state, ownership) |
| State Transition Testing | All valid and invalid transitions across the five-state lifecycle (FR-LSE-001, FR-LSE-002) |
| Use Case Testing | End-to-end scenario coverage for each use case UC-001 through UC-010 (FRS-001 §4) |
| Negative Testing | Crafted payloads to verify security controls and error handling |

---

## 3. Test Environment

### 3.1 Environment Strategy

| Environment | Purpose | Data | Refresh |
|-------------|---------|------|---------|
| Developer Local | Unit testing, component verification | Synthetic — generated by developer | On demand |
| QA Local | Functional, integration, security, and usability testing | Seeded — absence types and at least one Manager account, synthetic employee requests | Per test cycle reset |
| Reviewer Machine | UAT and fresh-clone setup validation | Seeded — same as QA | Fresh clone per review session |

> **Note:** VacaFlow_03 is a locally executed MVP. There is no shared cloud environment, staging server, or performance test infrastructure. All environments are local machines running the application from source code.

### 3.2 Environment Requirements

| Component | Specification | Notes |
|-----------|---------------|-------|
| Runtime — Backend | .NET SDK version documented in README | ASP.NET Core Minimal API |
| Runtime — Frontend | Node.js version documented in README | Next.js web application |
| Database | SQLite — file-based, initialized via seed commands | Seeded with absence types and Manager account(s) |
| Browser | Latest stable version of at least one modern browser (Chrome or Edge recommended) | Desktop viewport; mobile not required |
| Operating System | Windows, macOS, or Linux — any OS supported by the documented runtimes | Per NFR-COMPAT-001 |
| Network | No internet connection required during test execution | All dependencies restored at setup time |

### 3.3 Test Data Management

| Aspect | Approach |
|--------|---------|
| Source | Seeded data (absence types, Manager accounts) + synthetic Employee accounts and requests created during test execution |
| Seeded Accounts | At least one Manager account (credentials in README) and at least one Employee account created during setup or registration |
| Sensitive Data | No real organizational passwords; seed credentials are placeholder values documented in README per NFR-SEC-004 |
| Privacy | No real employee personal data; all test identities are fictional |
| Refresh | Reset by deleting and reinitializing the SQLite database file per the README instructions (NFR-AVAIL-002) |
| Volume | Small — sufficient to cover all five request states and all use cases; no large-volume dataset required |

---

## 4. Test Schedule

### 4.1 Testing Phases

| Phase | Activity | Milestone |
|-------|----------|-----------|
| Test Planning | Finalize this plan; define test case structure; confirm environment setup procedures | Test Plan approved |
| Test Design | Author test cases for all FRS-001 functional requirements and NFR-001 non-functional requirements | Test cases reviewed and baselined |
| Environment Setup | Validate fresh-clone setup on QA machine; confirm seeded data; confirm README instructions | QA environment ready; setup walkthrough passed |
| Cycle 1 — Functional & Integration | Execute all functional and integration test cases against the first candidate build | First-pass execution complete; defects logged |
| Defect Fix | Development team addresses Critical and High defects identified in Cycle 1 | Critical and High defects resolved or risk-accepted |
| Cycle 2 — Regression & Security | Re-execute failed tests from Cycle 1; execute full security test suite; confirm business rule enforcement | Regression passed; security findings addressed |
| Usability Testing | Manual walkthrough of UI state-action visibility and desktop viewport rendering | Usability findings logged and resolved |
| UAT | Review group completes full workflow walkthrough using README; captures blockers | UAT sign-off obtained |
| Closure | Compile test report; obtain final sign-off; archive test artifacts | Release ready |

### 4.2 Entry Criteria

Before testing begins (Cycle 1):

- [ ] This Test Plan is approved and signed
- [ ] All Must Have functional requirements from FRS-001 §3 are implemented in the candidate build
- [ ] Test cases are authored and baselined
- [ ] QA environment has been set up from a fresh clone following the README
- [ ] SQLite database is initialized with seeded absence types and at least one Manager account
- [ ] Unit test coverage is at or above 80% as reported by the development team
- [ ] No known build-breaking defects remain unresolved
- [ ] Seeded account credentials are documented in the README

### 4.3 Exit Criteria

Testing is complete and the build is ready for UAT sign-off when all of the following are met:

- [ ] All authored test cases have been executed at least once
- [ ] All Critical business rule enforcement tests pass (NFR-REL-001 acceptance criteria table fully satisfied)
- [ ] All Critical security tests pass (NFR-SEC-001 through NFR-SEC-005 acceptance criteria satisfied)
- [ ] Overall test pass rate is at or above 95%
- [ ] Zero open Critical defects; zero open High defects that block the core review workflow
- [ ] Medium and Low defects are triaged and either resolved or risk-accepted with documented rationale
- [ ] UAT sign-off is obtained from the review group
- [ ] Fresh-clone setup walkthrough passes on a machine that has not previously run the application

---

## 5. Test Deliverables

| Deliverable | Description | Owner |
|-------------|-------------|-------|
| Test Plan (this document) | Testing strategy, scope, schedule, resource requirements | QA Lead |
| Test Cases | Individual test scenarios mapped to FRS-001 requirements and NFR-001 criteria | QA Team |
| Test Data Set | Seeded accounts and synthetic request dataset for test execution | QA Lead |
| Security Test Scripts | Crafted API payloads for identity spoofing, role escalation, and cross-user access tests | QA Lead |
| Cycle 1 Execution Report | Results, pass/fail counts, defect summary from Cycle 1 | QA Lead |
| Cycle 2 Execution Report | Regression results, security test results | QA Lead |
| Defect Log | All defects identified during testing, with severity, status, and resolution | QA Team |
| UAT Sign-Off Record | Written confirmation from the review group that the workflow is accepted | Review Group / QA Lead |
| Final Test Report | Consolidated test summary including metrics, outstanding risks, and release recommendation | QA Lead |

---

## 6. Resource Plan

### 6.1 Team Structure

| Role | Allocation | Responsibilities |
|------|------------|-----------------|
| QA Lead — Yeuri Jessel Reyes | 100% | Test strategy ownership, test plan, security test execution, reporting, sign-off coordination |
| Test Engineer | 100% | Test case authoring, Cycle 1 and Cycle 2 execution, defect logging |
| Developer (Support) | As needed | Unit test coverage confirmation, defect resolution support, environment setup validation |
| Review Group Members | Part-time (UAT) | First-time setup walkthrough, full lifecycle UAT execution, UAT sign-off |

### 6.2 Tools

| Category | Tool | Purpose |
|----------|------|---------|
| Test Management | Markdown files in project documentation | Test case tracking and execution records |
| API Testing | Postman or equivalent HTTP client | Manual and semi-automated API testing, security payload crafting |
| Integration Automation | xUnit or NUnit (aligned with .NET stack) | Automated integration and unit test execution |
| Defect Tracking | Project defect log (defect-log.md) | Defect lifecycle management |
| Database Inspection | SQLite Browser or equivalent | Direct database inspection for security verification (NFR-SEC-001, NFR-SEC-004) |
| Browser | Latest stable Chrome or Edge | UI and usability testing at desktop viewports |

---

## 7. Risk Management

### 7.1 Testing Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SQLite locking errors during concurrent review | Low | Medium | Validate assumption per NFR-PERF-002 before opening the review window; document workaround (sequential use) in README if needed |
| Reviewer machine setup failures blocking UAT | Medium | High | Validate fresh-clone setup on at least one clean machine before UAT; resolve README gaps immediately |
| Business rule bypass discovered late in cycle | Low | Critical | Execute all NFR-REL-001 security and business rule tests in Cycle 1, not deferred to Cycle 2 |
| Defect backlog exceeds fix capacity before UAT | Medium | High | Prioritize defects strictly by severity; accept risk on Low defects with documented rationale; escalate Critical/High immediately |
| Test case coverage gaps in state transition scenarios | Low | Medium | Use state transition matrix from FRS-001 §3.5 to drive test case completeness check before Cycle 1 |
| Security test identifies password plain-text storage | Low | Critical | Code review of registration path before Cycle 1; treat any finding as a build-blocking defect |
| README incomplete, blocking reviewer self-setup | Medium | High | QA Lead reviews README against NFR-MAINT-002 checklist before UAT begins |

### 7.2 Contingency

- **Schedule slippage:** If Cycle 1 reveals widespread Critical defects, a Cycle 3 is added before UAT. UAT is gated on exit criteria satisfaction — it is not started by date alone.
- **Environment failures:** If the QA environment cannot be reset cleanly, the QA Lead rebuilds from a fresh clone using the documented README procedure. This serves as an additional validation of NFR-COMPAT-001.
- **Resource unavailability:** The QA Lead holds working knowledge of all test areas and can execute tests directly if a Test Engineer is unavailable. UAT can be deferred by up to one cycle provided no Critical defects are open.

---

## 8. Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Functional Test Coverage | 100% of Must Have requirements from FRS-001 | Traceability matrix mapping test cases to FR IDs |
| Business Rule Coverage | 100% of business rules in FRS-001 §5 (BR-001 through BR-011) | Traceability matrix mapping test cases to BR IDs |
| NFR Security Coverage | 100% of NFR-SEC-001 through NFR-SEC-005 acceptance criteria | Security test checklist |
| Overall Test Pass Rate | ≥ 95% at exit | Test execution report (pass / total executed) |
| Critical Defect Resolution | 0 open Critical defects at UAT entry | Defect log severity filter |
| High Defect Resolution | 0 workflow-blocking High defects at UAT entry | Defect log severity and workflow-impact flag |
| Unit Test Coverage | ≥ 80% reported by development team | Coverage report provided at Cycle 1 entry |
| First-Pass Approval Rate (UAT) | Review group completes full lifecycle without support intervention | UAT session observation |
| Setup Success Rate | Fresh-clone setup completes without errors on a clean machine | Setup walkthrough pass/fail record |

---

## 9. Defect Management

### 9.1 Severity Classification

| Severity | Description | Examples | Resolution SLA |
|----------|-------------|----------|----------------|
| Critical | Core workflow is broken or a security control fails | Business rule bypassed, password stored in plain text, state transition enforced incorrectly, Manager role self-assigned via public registration | Must be fixed before Cycle 2 begins |
| High | A defined workflow step cannot be completed or a significant NFR fails | Approve endpoint returns 200 for an Employee token, cancel does not transition to Cancelled, README missing setup steps | Must be fixed before UAT begins |
| Medium | A workflow step is impaired but a workaround exists, or a Should Have requirement fails | Incorrect error message text, UI shows an action button for an invalid state but the API correctly rejects it | Triaged; resolve before release or risk-accept with justification |
| Low | Minor cosmetic issue; no functional or security impact | Label capitalization inconsistency, minor layout misalignment at non-primary viewport | Deferred to post-MVP backlog |

### 9.2 Defect Lifecycle

```
New → Assigned → In Progress → Fixed → Ready for Test → Verified → Closed
                                  ↓
                           (Rejected) → Reassigned → ...
```

All defects are logged in the project defect log (defect-log.md) with: defect ID, title, severity, affected requirement (FR ID or NFR ID), reproduction steps, expected result, actual result, assigned developer, status, and resolution date.

### 9.3 Business Rule Test Coverage Matrix

The following table maps every business rule from FRS-001 §5 to the NFR-001 criterion that governs its enforcement, ensuring no rule is left without a test case:

| Business Rule | FR References | NFR Coverage | Test Priority |
|---------------|---------------|--------------|---------------|
| BR-001: End date not before start date | FR-ARM-002, FR-LSE-001 | NFR-REL-001 | Critical |
| BR-002: Start date not in the past | FR-ARM-003, FR-LSE-001 | NFR-REL-001 | Critical |
| BR-003: Only Draft requests are editable | FR-ARM-004, FR-ARM-005, FR-LSE-004 | NFR-REL-001 | Critical |
| BR-004: Only owner can edit, submit, or cancel | FR-ARM-004, FR-ARM-006, FR-ARM-008, FR-LSE-006 | NFR-REL-001, NFR-SEC-002 | Critical |
| BR-005: Only Submitted requests can be approved or rejected | FR-MRA-002, FR-MRA-003, FR-LSE-005 | NFR-REL-001 | Critical |
| BR-006: Only Manager role can approve or reject | FR-MRA-002, FR-MRA-003, FR-MRA-007, FR-LSE-007 | NFR-REL-001, NFR-SEC-003 | Critical |
| BR-007: Public registration cannot assign Manager role | FR-AUTH-001, FR-AUTH-002 | NFR-SEC-003, NFR-REL-001 | Critical |
| BR-008: Manager cannot approve or reject own request | FR-MRA-006 | NFR-REL-001, NFR-SEC-003 | Critical |
| BR-009: Authenticated Manager recorded as approver; one Approval Record per request | FR-MRA-002, FR-MRA-003, FR-MRA-005, FR-MRA-008 | NFR-REL-001, NFR-REL-002, NFR-SEC-002 | Critical |
| BR-010: Approved, Rejected, Cancelled are final states | FR-ARM-008, FR-LSE-002 | NFR-REL-001 | Critical |
| BR-011: API derives identity from session; frontend must not supply trusted identifiers | FR-AUTH-008, FR-ARM-010, FR-MRA-005 | NFR-SEC-002, NFR-REL-001 | Critical |

---

## 10. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | Yeuri Jessel Reyes | | Pending |
| Project Manager | | | Pending |
| Technical Lead | | | Pending |
| Product Owner | | | Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | QA Lead (PM_OVERRIDE — bypassed QA Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:17:23 UTC |

*— End of document —*
