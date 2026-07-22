# Requirements Traceability Matrix

**Project:** VacaFlow_03
**Document ID:** RTM-001
**Phase:** 03 — Requirements
**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-20
**Version:** 1.0
**Status:** Draft
**References:** SI-001 (Strategic Intake), FRS-001 (Functional Requirements Specification), NFR-001 (Non-Functional Requirements Specification)

---

## Executive Summary

This Requirements Traceability Matrix (RTM) establishes bidirectional links between all requirements defined for VacaFlow_03 and their corresponding design elements, implementation components, and test cases. It covers 35 functional requirements across 5 feature modules (FR-AUTH, FR-ATC, FR-ARM, FR-MRA, FR-LSE), 19 non-functional requirements across 8 categories, 11 business rules, and 10 use cases.

At this stage of the SDLC, design documents and test cases have not yet been generated. Design references (DD-###) and test case references (TC-###) are pre-defined in this matrix using the naming conventions that will be applied when those artifacts are produced, enabling the RTM to be populated forward as each phase completes. All coverage gaps are explicitly identified in Section 6.

---

## 1. Overview

### 1.1 Purpose

This RTM serves three primary purposes for VacaFlow_03:

1. **Coverage assurance** — confirms that every requirement defined in FRS-001 and NFR-001 is linked to at least one design element, implementation component, and test case.
2. **Change impact analysis** — provides a lookup table to identify downstream artifacts affected when any requirement changes.
3. **Compliance evidence** — demonstrates that the acceptance criteria defined in SI-001 are verifiably covered by design and test artifacts.

### 1.2 Traceability Levels

```
Business Needs (SI-001)
         │
         ▼
Business Requirements / Business Rules (BR-001 – BR-011)
         │
         ▼
Functional Requirements (FR-AUTH, FR-ATC, FR-ARM, FR-MRA, FR-LSE)
         │
         ├─────────────────────────┐
         ▼                         ▼
Non-Functional Requirements    Use Cases (UC-001 – UC-010)
   (NFR-001 registry)              │
         │                         │
         ├─────────────────────────┤
         ▼                         ▼
   Design Elements              Test Cases
   (DD-### refs)                (TC-### refs)
         │                         │
         └──────────┬──────────────┘
                    ▼
              Implementation
           (components / layers)
```

### 1.3 Document References

| Document | ID | Version | Phase |
|----------|----|---------|-------|
| Strategic Intake | SI-001 | 1.0 | 01 — Understand |
| Functional Requirements Specification | FRS-001 | 1.0 | 02 — Define |
| Non-Functional Requirements Specification | NFR-001 | 1.0 | 03 — Requirements |
| Architecture Overview | DD-001 | Pending | 04 — Architecture |
| Test Plan | TP-001 | Pending | 08 — Quality |
| Test Cases | TC-001 | Pending | 08 — Quality |

### 1.4 Architecture Layer Reference

VacaFlow_03 uses a reduced Onion Architecture (NFR-MAINT-001) with the following layers referenced throughout this matrix:

| Layer Code | Layer Name | Responsibility |
|------------|------------|----------------|
| DOM | Domain | Business entities and rule enforcement |
| APP | Application | Use case orchestration, service interfaces |
| INF | Infrastructure | Data access via SQLite / EF Core or Dapper |
| API | API | ASP.NET Core Minimal API endpoints |
| WEB | Web | Next.js frontend |

---

## 2. Functional Requirements Traceability

### 2.1 User Authentication Module (FR-AUTH)

| Req ID | Requirement Summary | Priority | SI Source | Business Rule | Design Ref | Component (Layer) | Test Cases | Status |
|--------|---------------------|----------|-----------|---------------|------------|-------------------|------------|--------|
| FR-AUTH-001 | Register with name, email, password, and role | Must Have | SI-001 §4 | BR-007 | DD-001 §AUTH | UserService (APP), UserRepository (INF), RegisterEndpoint (API), RegisterForm (WEB) | TC-AUTH-P-001, TC-AUTH-N-001, TC-AUTH-N-002 | 🔜 Planned |
| FR-AUTH-002 | Public registration cannot assign Manager role | Must Have | SI-001 §4 | BR-007 | DD-001 §AUTH | RoleValidator (DOM), RegisterEndpoint (API) | TC-AUTH-N-003, TC-AUTH-N-004 | 🔜 Planned |
| FR-AUTH-003 | Passwords stored as cryptographic hashes | Must Have | SI-001 §5 | — | DD-001 §AUTH | PasswordHasher (APP), UserRepository (INF) | TC-AUTH-SEC-001 | 🔜 Planned |
| FR-AUTH-004 | Validate credentials on login and establish session | Must Have | SI-001 §4 | — | DD-001 §AUTH | AuthService (APP), LoginEndpoint (API), LoginForm (WEB) | TC-AUTH-P-002, TC-AUTH-N-005 | 🔜 Planned |
| FR-AUTH-005 | Generic error message on invalid credentials | Should Have | SI-001 §4 | — | DD-001 §AUTH | LoginEndpoint (API) | TC-AUTH-N-005, TC-AUTH-N-006 | 🔜 Planned |
| FR-AUTH-006 | Terminate session on logout | Must Have | SI-001 §4 | — | DD-001 §AUTH | AuthService (APP), LogoutEndpoint (API) | TC-AUTH-P-003 | 🔜 Planned |
| FR-AUTH-007 | Current-user endpoint returns identity from session | Must Have | SI-001 §4 | BR-011 | DD-001 §AUTH | SessionContext (APP), CurrentUserEndpoint (API) | TC-AUTH-P-004 | 🔜 Planned |
| FR-AUTH-008 | API derives identity from session; frontend never sends trusted IDs | Must Have | SI-001 §5 | BR-011 | DD-001 §AUTH | SessionContext (APP), all protected endpoints (API) | TC-AUTH-SEC-002, TC-AUTH-SEC-003 | 🔜 Planned |

### 2.2 Absence Type Catalog Module (FR-ATC)

| Req ID | Requirement Summary | Priority | SI Source | Business Rule | Design Ref | Component (Layer) | Test Cases | Status |
|--------|---------------------|----------|-----------|---------------|------------|-------------------|------------|--------|
| FR-ATC-001 | Seed Vacation, Personal Leave, Sick Leave at startup | Must Have | SI-001 §4 | — | DD-001 §ATC | AbsenceTypeSeeder (INF) | TC-ATC-P-001 | 🔜 Planned |
| FR-ATC-002 | Endpoint lists all available absence types | Must Have | SI-001 §4 | — | DD-001 §ATC | AbsenceTypeService (APP), AbsenceTypeEndpoint (API) | TC-ATC-P-002 | 🔜 Planned |
| FR-ATC-003 | No create/edit/delete endpoint or UI for absence types | Must Have | SI-001 §4 | — | DD-001 §ATC | N/A (intentionally absent) | TC-ATC-N-001 | 🔜 Planned |

### 2.3 Absence Request Management Module (FR-ARM)

| Req ID | Requirement Summary | Priority | SI Source | Business Rule | Design Ref | Component (Layer) | Test Cases | Status |
|--------|---------------------|----------|-----------|---------------|------------|-------------------|------------|--------|
| FR-ARM-001 | Employee creates Draft request | Must Have | SI-001 §4 | BR-011 | DD-001 §ARM | AbsenceRequest (DOM), RequestService (APP), CreateRequestEndpoint (API), CreateRequestForm (WEB) | TC-ARM-P-001, TC-ARM-N-001 | 🔜 Planned |
| FR-ARM-002 | End date cannot be earlier than start date | Must Have | SI-001 §4 | BR-001 | DD-001 §ARM | DateRangeRule (DOM), RequestValidator (APP) | TC-ARM-N-002, TC-ARM-P-002 | 🔜 Planned |
| FR-ARM-003 | Start date cannot be in the past | Must Have | SI-001 §4 | BR-002 | DD-001 §ARM | DateRangeRule (DOM), RequestValidator (APP) | TC-ARM-N-003, TC-ARM-P-003 | 🔜 Planned |
| FR-ARM-004 | Employee edits a Draft request | Must Have | SI-001 §4 | BR-003, BR-004 | DD-001 §ARM | RequestService (APP), EditRequestEndpoint (API), EditRequestForm (WEB) | TC-ARM-P-004 | 🔜 Planned |
| FR-ARM-005 | Non-Draft requests cannot be edited | Must Have | SI-001 §4 | BR-003 | DD-001 §ARM | RequestStateGuard (DOM), RequestService (APP) | TC-ARM-N-004, TC-ARM-N-005, TC-ARM-N-006, TC-ARM-N-007 | 🔜 Planned |
| FR-ARM-006 | Employee submits Draft → Submitted | Must Have | SI-001 §4 | — | DD-001 §ARM | RequestStateMachine (DOM), RequestService (APP), SubmitRequestEndpoint (API) | TC-ARM-P-005 | 🔜 Planned |
| FR-ARM-007 | Submitted request is read-only for employee | Must Have | SI-001 §4 | BR-003 | DD-001 §ARM | RequestStateMachine (DOM), RequestService (APP) | TC-ARM-N-004 | 🔜 Planned |
| FR-ARM-008 | Employee cancels Draft or Submitted request | Must Have | SI-001 §4 | BR-010 | DD-001 §ARM | RequestStateMachine (DOM), RequestService (APP), CancelRequestEndpoint (API) | TC-ARM-P-006, TC-ARM-P-007 | 🔜 Planned |
| FR-ARM-009 | Only owner can edit, submit, or cancel | Must Have | SI-001 §4 | BR-004 | DD-001 §ARM | OwnershipGuard (APP), all request mutation endpoints (API) | TC-ARM-N-008, TC-ARM-N-009, TC-ARM-N-010 | 🔜 Planned |
| FR-ARM-010 | Owner inferred from session; no employee ID from frontend | Must Have | SI-001 §5 | BR-011 | DD-001 §ARM | SessionContext (APP), CreateRequestEndpoint (API) | TC-ARM-SEC-001 | 🔜 Planned |
| FR-ARM-011 | Employee lists own requests including final decisions | Must Have | SI-001 §4 | — | DD-001 §ARM | RequestService (APP), ListRequestsEndpoint (API), RequestListScreen (WEB) | TC-ARM-P-008 | 🔜 Planned |

### 2.4 Manager Review and Approval Module (FR-MRA)

| Req ID | Requirement Summary | Priority | SI Source | Business Rule | Design Ref | Component (Layer) | Test Cases | Status |
|--------|---------------------|----------|-----------|---------------|------------|-------------------|------------|--------|
| FR-MRA-001 | Manager views only Submitted requests assigned to them | Must Have | SI-001 §4 | — | DD-001 §MRA | ApprovalService (APP), ManagerRequestListEndpoint (API), ManagerReviewScreen (WEB) | TC-MRA-P-001, TC-MRA-N-001 | 🔜 Planned |
| FR-MRA-002 | Manager approves Submitted → Approved + one Approval record | Must Have | SI-001 §4 | BR-005, BR-006, BR-009 | DD-001 §MRA | ApprovalRecord (DOM), ApprovalService (APP), ApprovalRepository (INF), ApproveEndpoint (API) | TC-MRA-P-002, TC-MRA-N-002 | 🔜 Planned |
| FR-MRA-003 | Manager rejects Submitted → Rejected + one Approval record | Must Have | SI-001 §4 | BR-005, BR-006, BR-009 | DD-001 §MRA | ApprovalRecord (DOM), ApprovalService (APP), ApprovalRepository (INF), RejectEndpoint (API) | TC-MRA-P-003, TC-MRA-N-002 | 🔜 Planned |
| FR-MRA-004 | Optional comment on approval or rejection | Must Have | SI-001 §4 | — | DD-001 §MRA | ApprovalRecord (DOM), ApprovalService (APP) | TC-MRA-P-004, TC-MRA-P-005 | 🔜 Planned |
| FR-MRA-005 | Approver derived from session; no approver ID from frontend | Must Have | SI-001 §5 | BR-009, BR-011 | DD-001 §MRA | SessionContext (APP), ApprovalService (APP) | TC-MRA-SEC-001 | 🔜 Planned |
| FR-MRA-006 | Manager cannot approve or reject own request | Must Have | SI-001 §4 | BR-008 | DD-001 §MRA | SelfApprovalGuard (DOM), ApprovalService (APP) | TC-MRA-N-003 | 🔜 Planned |
| FR-MRA-007 | Only Manager role can approve or reject | Must Have | SI-001 §4 | BR-006 | DD-001 §MRA | RoleAuthorizationMiddleware (API), ApproveEndpoint (API), RejectEndpoint (API) | TC-MRA-N-004, TC-MRA-N-005 | 🔜 Planned |
| FR-MRA-008 | Each request has at most one Approval record | Must Have | SI-001 §4 | BR-009 | DD-001 §MRA | ApprovalRecord (DOM), ApprovalRepository (INF) | TC-MRA-N-006, TC-MRA-N-007 | 🔜 Planned |

### 2.5 Request Lifecycle State Enforcement Module (FR-LSE)

| Req ID | Requirement Summary | Priority | SI Source | Business Rule | Design Ref | Component (Layer) | Test Cases | Status |
|--------|---------------------|----------|-----------|---------------|------------|-------------------|------------|--------|
| FR-LSE-001 | Enforce valid state transitions only | Must Have | SI-001 §4 | BR-010 | DD-001 §LSE | RequestStateMachine (DOM) | TC-LSE-P-001 through TC-LSE-P-005 | 🔜 Planned |
| FR-LSE-002 | Approved, Rejected, Cancelled are final states | Must Have | SI-001 §4 | BR-010 | DD-001 §LSE | RequestStateMachine (DOM) | TC-LSE-N-001, TC-LSE-N-002, TC-LSE-N-003 | 🔜 Planned |
| FR-LSE-003 | Return clear descriptive error on invalid state transition | Must Have | SI-001 §4 | — | DD-001 §LSE | ErrorHandlingMiddleware (API) | TC-LSE-N-001 through TC-LSE-N-003 | 🔜 Planned |
| FR-LSE-004 | Only Draft requests can be edited | Must Have | SI-001 §4 | BR-003 | DD-001 §LSE | RequestStateGuard (DOM) | TC-LSE-N-004, TC-LSE-N-005, TC-LSE-N-006 | 🔜 Planned |
| FR-LSE-005 | Only Submitted requests can be approved or rejected | Must Have | SI-001 §4 | BR-005 | DD-001 §LSE | RequestStateGuard (DOM) | TC-LSE-N-007, TC-LSE-N-008 | 🔜 Planned |
| FR-LSE-006 | Only request owner can edit, submit, or cancel | Must Have | SI-001 §4 | BR-004 | DD-001 §LSE | OwnershipGuard (APP) | TC-LSE-N-009, TC-LSE-N-010 | 🔜 Planned |
| FR-LSE-007 | Only Manager role can approve or reject | Must Have | SI-001 §4 | BR-006 | DD-001 §LSE | RoleAuthorizationMiddleware (API) | TC-LSE-N-011 | 🔜 Planned |

---

## 3. Non-Functional Requirements Traceability

### 3.1 Performance

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-PERF-001 | No observable blocking delays during review workflow | Low | DD-001 §PERF | Local SQLite with synchronous endpoints; no caching or indexing required at MVP scale | TC-PERF-001 (manual walkthrough) | 🔜 Planned |
| NFR-PERF-002 | SQLite handles concurrent review-window load without lock errors | Low | DD-001 §PERF | SQLite in WAL mode if needed; validated by manual concurrent-use test | TC-PERF-002 (manual concurrent test) | 🔜 Planned |

### 3.2 Security

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-SEC-001 | Passwords stored as hashes; never plain text | Critical | DD-001 §SEC | BCrypt / Argon2 / PBKDF2 via ASP.NET Core Identity default | TC-SEC-001 (DB inspection) | 🔜 Planned |
| NFR-SEC-002 | All authorization derived server-side from session or token | Critical | DD-001 §SEC | SessionContext (APP); no trusted frontend fields accepted | TC-SEC-002, TC-SEC-003 | 🔜 Planned |
| NFR-SEC-003 | Two roles enforced server-side; Manager role not self-assignable | Critical | DD-001 §SEC | RoleValidator (DOM); seed-only Manager creation | TC-SEC-004, TC-SEC-005 | 🔜 Planned |
| NFR-SEC-004 | SQLite file not publicly accessible; excluded from source control | Critical | DD-001 §SEC | .gitignore exclusion; file path not served as static asset | TC-SEC-006 (review) | 🔜 Planned |
| NFR-SEC-005 | Personal data not exposed to unauthorized users or in logs | Critical | DD-001 §SEC | Scoped query logic (APP); error middleware suppresses stack traces; logging config | TC-SEC-007, TC-SEC-008 | 🔜 Planned |

### 3.3 Availability

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-AVAIL-001 | Blocking defects in core workflow remediated before acceptance | Low | N/A | End-to-end walkthrough by reviewer; defect triage during review window | TC-AVAIL-001 (E2E walkthrough) | 🔜 Planned |
| NFR-AVAIL-002 | README documents SQLite file location and reset instructions | Low | DD-001 §MAINT | README content checklist item | TC-AVAIL-002 (README review) | 🔜 Planned |

### 3.4 Usability

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-USE-001 | Workflow completable without training beyond README | High | DD-001 §UX | Plain-language labels and action buttons matching SI-001 terminology | TC-USE-001 (first-time walkthrough) | 🔜 Planned |
| NFR-USE-002 | UI shows only valid actions for current request state | High | DD-001 §UX | State-conditional rendering in WEB layer; action buttons driven by request state | TC-USE-002 (state-action matrix validation) | 🔜 Planned |
| NFR-USE-003 | Renders correctly on standard desktop viewports (1024px+) | High | DD-001 §UX | Responsive CSS; tested at 1280×800 and 1920×1080 | TC-USE-003 (viewport review) | 🔜 Planned |

### 3.5 Reliability

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-REL-001 | All business rules enforced consistently; acceptance fails if bypassed | Critical | DD-001 §REL | Rule enforcement in DOM layer; API tests for each rule scenario | TC-REL-001 through TC-REL-008 | 🔜 Planned |
| NFR-REL-002 | Approval/rejection recorded atomically; no inconsistent state on failure | High | DD-001 §REL | Single database transaction covering state update and Approval record creation | TC-REL-009 (transaction review) | 🔜 Planned |
| NFR-REL-003 | All API inputs validated before business logic executes | High | DD-001 §REL | RequestValidator (APP); global error handling middleware (API) | TC-REL-010, TC-REL-011 | 🔜 Planned |

### 3.6 Maintainability

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-MAINT-001 | Reduced Onion Architecture (5 layers); no MediatR, CQRS, generic repos | Medium | DD-001 §ARCH | Project/folder structure enforcing DOM, APP, INF, API, WEB separation | TC-MAINT-001 (code review) | 🔜 Planned |
| NFR-MAINT-002 | README covers prerequisites, setup, accounts, endpoints, scope, deferred items | Medium | DD-001 §MAINT | README content checklist | TC-MAINT-002 (README content review) | 🔜 Planned |

### 3.7 Compatibility

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-COMPAT-001 | Application starts and runs from source on local machine | High | DD-001 §COMPAT | Clone → restore → DB init → API start → WEB start; documented in README | TC-COMPAT-001 (fresh-clone walkthrough) | 🔜 Planned |

### 3.8 Compliance

| NFR ID | Requirement Summary | Priority | Design Ref | Implementation Approach | Test Cases | Status |
|--------|---------------------|----------|------------|-------------------------|------------|--------|
| NFR-COMP-001 | Basic data protection practices for MVP | Medium | DD-001 §SEC | Satisfied by NFR-SEC-001 through NFR-SEC-005; README acknowledgment of deferred compliance | TC-COMP-001 (README review + SEC tests) | 🔜 Planned |

---

## 4. Business Rules Traceability

| Rule ID | Business Rule | Source (SI-001) | Functional Requirements | NFR Requirements | Test Cases |
|---------|---------------|-----------------|-------------------------|------------------|------------|
| BR-001 | End date cannot be earlier than start date | §4 Business Constraints | FR-ARM-002, FR-LSE-001 | NFR-REL-001, NFR-REL-003 | TC-ARM-N-002, TC-REL-001 |
| BR-002 | Start date cannot be in the past | §4 Business Constraints | FR-ARM-003, FR-LSE-001 | NFR-REL-001, NFR-REL-003 | TC-ARM-N-003, TC-REL-002 |
| BR-003 | Only Draft requests are editable | §4 Business Constraints | FR-ARM-004, FR-ARM-005, FR-ARM-007, FR-LSE-004 | NFR-REL-001 | TC-ARM-N-004 through N-007, TC-LSE-N-004 through N-006 |
| BR-004 | Only the request owner can edit, submit, or cancel | §4 Business Constraints | FR-ARM-004, FR-ARM-006, FR-ARM-008, FR-ARM-009, FR-LSE-006 | NFR-REL-001 | TC-ARM-N-008 through N-010, TC-LSE-N-009, TC-LSE-N-010 |
| BR-005 | Only Submitted requests can be approved or rejected | §4 Business Constraints | FR-MRA-002, FR-MRA-003, FR-LSE-005 | NFR-REL-001 | TC-MRA-N-002, TC-LSE-N-007, TC-LSE-N-008 |
| BR-006 | Only a Manager role user can approve or reject | §4 Business Constraints | FR-MRA-002, FR-MRA-003, FR-MRA-007, FR-LSE-007 | NFR-REL-001, NFR-SEC-003 | TC-MRA-N-004, TC-MRA-N-005, TC-LSE-N-011 |
| BR-007 | Public registration cannot self-assign Manager role | §4 Business Constraints | FR-AUTH-001, FR-AUTH-002 | NFR-SEC-003, NFR-REL-001 | TC-AUTH-N-003, TC-AUTH-N-004, TC-SEC-004 |
| BR-008 | Manager cannot approve or reject own request | §4 Business Constraints | FR-MRA-006 | NFR-REL-001 | TC-MRA-N-003, TC-REL-006 |
| BR-009 | Authenticated Manager recorded as approver; one Approval record per request | §4 Business Constraints | FR-MRA-002, FR-MRA-003, FR-MRA-005, FR-MRA-008 | NFR-REL-001, NFR-REL-002 | TC-MRA-P-002, TC-MRA-P-003, TC-MRA-N-006, TC-MRA-N-007, TC-MRA-SEC-001 |
| BR-010 | Approved, Rejected, Cancelled are final states | §4 Business Constraints | FR-ARM-008, FR-LSE-001, FR-LSE-002 | NFR-REL-001 | TC-LSE-N-001 through N-003 |
| BR-011 | API derives identity from session; frontend must not send trusted IDs | §5 Technical Constraints | FR-AUTH-007, FR-AUTH-008, FR-ARM-010, FR-MRA-005 | NFR-SEC-002, NFR-REL-001 | TC-AUTH-SEC-002, TC-AUTH-SEC-003, TC-ARM-SEC-001, TC-MRA-SEC-001 |

---

## 5. Use Case Traceability

| Use Case | Title | Functional Requirements | Business Rules | NFRs | Test Cases |
|----------|-------|-------------------------|----------------|------|------------|
| UC-001 | Register as an Employee | FR-AUTH-001, FR-AUTH-002, FR-AUTH-003 | BR-007 | NFR-SEC-001, NFR-SEC-003 | TC-AUTH-P-001, TC-AUTH-N-001, TC-AUTH-N-002, TC-AUTH-N-003, TC-AUTH-N-004 |
| UC-002 | Log In | FR-AUTH-004, FR-AUTH-005 | — | NFR-SEC-001 | TC-AUTH-P-002, TC-AUTH-N-005, TC-AUTH-N-006 |
| UC-003 | Create an Absence Request | FR-ARM-001, FR-ARM-002, FR-ARM-003, FR-ARM-010 | BR-001, BR-002, BR-011 | NFR-REL-001, NFR-REL-003 | TC-ARM-P-001, TC-ARM-N-001, TC-ARM-N-002, TC-ARM-N-003, TC-ARM-SEC-001 |
| UC-004 | Edit a Draft Request | FR-ARM-004, FR-ARM-005, FR-ARM-009 | BR-003, BR-004 | NFR-REL-001 | TC-ARM-P-004, TC-ARM-N-004, TC-ARM-N-008 |
| UC-005 | Submit an Absence Request | FR-ARM-006, FR-ARM-007, FR-ARM-009 | BR-003, BR-004 | NFR-REL-001 | TC-ARM-P-005, TC-ARM-N-004, TC-ARM-N-009 |
| UC-006 | Cancel an Absence Request | FR-ARM-008, FR-ARM-009 | BR-004, BR-010 | NFR-REL-001 | TC-ARM-P-006, TC-ARM-P-007, TC-ARM-N-010 |
| UC-007 | View Request List and Final Decision | FR-ARM-011, FR-ARM-009 | BR-004 | NFR-SEC-005 | TC-ARM-P-008, TC-SEC-007 |
| UC-008 | Approve an Absence Request | FR-MRA-001, FR-MRA-002, FR-MRA-004, FR-MRA-005, FR-MRA-006, FR-MRA-007, FR-MRA-008 | BR-005, BR-006, BR-008, BR-009, BR-011 | NFR-REL-001, NFR-REL-002, NFR-SEC-002 | TC-MRA-P-002, TC-MRA-P-004, TC-MRA-N-003, TC-MRA-N-004, TC-MRA-N-006, TC-MRA-SEC-001 |
| UC-009 | Reject an Absence Request | FR-MRA-001, FR-MRA-003, FR-MRA-004, FR-MRA-005, FR-MRA-006, FR-MRA-007, FR-MRA-008 | BR-005, BR-006, BR-008, BR-009, BR-011 | NFR-REL-001, NFR-REL-002, NFR-SEC-002 | TC-MRA-P-003, TC-MRA-P-005, TC-MRA-N-003, TC-MRA-N-005, TC-MRA-N-007, TC-MRA-SEC-001 |
| UC-010 | Log Out | FR-AUTH-006 | — | — | TC-AUTH-P-003 |

---

## 6. Coverage Analysis

### 6.1 Requirements Coverage Summary

| Category | Total Requirements | With Design Ref | With Implementation Component | With Test Cases |
|----------|--------------------|-----------------|-------------------------------|-----------------|
| FR-AUTH (Authentication) | 8 | 8 | 8 | 8 |
| FR-ATC (Absence Type Catalog) | 3 | 3 | 3 | 3 |
| FR-ARM (Request Management) | 11 | 11 | 11 | 11 |
| FR-MRA (Manager Review) | 8 | 8 | 8 | 8 |
| FR-LSE (State Enforcement) | 7 | 7 | 7 | 7 |
| **Functional Total** | **37** | **37** | **37** | **37** |
| NFR — Performance | 2 | 2 | 2 | 2 |
| NFR — Security | 5 | 5 | 5 | 5 |
| NFR — Availability | 2 | 2 | 2 | 2 |
| NFR — Usability | 3 | 3 | 3 | 3 |
| NFR — Reliability | 3 | 3 | 3 | 3 |
| NFR — Maintainability | 2 | 2 | 2 | 2 |
| NFR — Compatibility | 1 | 1 | 1 | 1 |
| NFR — Compliance | 1 | 1 | 1 | 1 |
| **NFR Total** | **19** | **19** | **19** | **19** |
| Business Rules | 11 | 11 | 11 | 11 |
| Use Cases | 10 | 10 | 10 | 10 |
| **Grand Total** | **77** | **77** | **77** | **77** |

**Coverage rate: 100%** — All requirements have pre-defined design references, implementation components, and test case identifiers. Artifacts are flagged 🔜 Planned and will be populated as the Architecture and Quality phases complete.

### 6.2 Priority Coverage Summary

| Priority | Functional Reqs | NFRs | Total | Coverage |
|----------|-----------------|------|-------|----------|
| Must Have | 35 | — | 35 | 100% |
| Should Have | 1 | — | 1 | 100% |
| Critical | — | 6 | 6 | 100% |
| High | — | 6 | 6 | 100% |
| Medium | — | 3 | 3 | 100% |
| Low | — | 4 | 4 | 100% |
| **Total** | **36** | **19** | **55** | **100%** |

### 6.3 Module-Level Test Case Distribution

| Module / Category | Estimated Test Cases | Positive Scenarios | Negative / Security Scenarios |
|-------------------|----------------------|--------------------|-------------------------------|
| FR-AUTH | 11 | 4 | 7 |
| FR-ATC | 3 | 2 | 1 |
| FR-ARM | 14 | 8 | 6 |
| FR-MRA | 12 | 5 | 7 |
| FR-LSE | 11 | 5 | 6 |
| NFR — Performance | 2 | 2 | 0 |
| NFR — Security | 8 | 0 | 8 |
| NFR — Reliability | 11 | 5 | 6 |
| NFR — Usability | 3 | 3 | 0 |
| NFR — Availability / Compat / Maint / Comp | 5 | 5 | 0 |
| **Total** | **80** | **39** | **41** |

### 6.4 Gaps Identified

| Gap Type | Count | Items | Resolution |
|----------|-------|-------|------------|
| Design references pending | 37 (FR) + 19 (NFR) | All DD-001 sub-sections | To be populated after Architecture phase (DD-001) is signed |
| Test case content pending | 80 | All TC-### identifiers | To be populated after Quality phase (TP-001, TC-001) is signed |
| No implementation code yet | All | All components listed | Expected during Development phase |

No requirement is missing a design reference placeholder, implementation component assignment, or test case identifier. All gaps are forward-looking artifacts to be produced in subsequent phases.

---

## 7. Change Impact Analysis

### 7.1 Impact Matrix

| If Changed | Check These Artifacts |
|------------|----------------------|
| SI-001 (Strategic Intake) | All FRs, NFRs, BRs, UCs in this RTM; re-validate scope boundaries |
| Any FR (e.g., FR-MRA-006) | Linked BRs, UCs, NFRs, Design ref, Component, Test Cases in this RTM |
| Any NFR | Linked design approach, implementation component, test verification method |
| Any BR | All FRs referencing it; corresponding test cases |
| Design element (DD-001 section) | All FRs and NFRs linked to that design section; test cases that verify the component |
| Component (e.g., ApprovalService) | Test cases covering that component; NFR coverage claims for that module |
| Test case | Backward trace to the requirement it verifies; confirm the acceptance criterion is still met |
| SQLite file path or schema | NFR-SEC-004, NFR-AVAIL-002, NFR-MAINT-002, NFR-COMPAT-001, FR-ATC-001 |
| Authentication mechanism | FR-AUTH-004 through FR-AUTH-008, BR-011, NFR-SEC-001 through NFR-SEC-003 |

### 7.2 High-Risk Change Zones

The following areas have the highest number of dependent requirements and carry the most change impact risk:

| Zone | Requirements Linked | Risk |
|------|---------------------|------|
| Session-based identity derivation (BR-011) | FR-AUTH-007, FR-AUTH-008, FR-ARM-010, FR-MRA-005, NFR-SEC-002 | High — change here cascades to all business actions |
| Request state machine | FR-LSE-001 through FR-LSE-007, BR-003, BR-004, BR-005, BR-010 | High — central to the entire workflow |
| Approval record creation | FR-MRA-002, FR-MRA-003, FR-MRA-005, FR-MRA-008, BR-009, NFR-REL-002 | High — core value proposition of the system |
| Role enforcement | FR-AUTH-002, FR-MRA-006, FR-MRA-007, FR-LSE-007, BR-006, BR-007, BR-008, NFR-SEC-003 | High — security boundary |

---

## 8. Forward Traceability

### From Requirements to Artifacts (Representative Examples)

```
BR-011: API derives identity from session; frontend must not send trusted IDs
├── Functional Requirements:
│   ├── FR-AUTH-007: Current-user endpoint returns identity from session
│   ├── FR-AUTH-008: API derives identity from session exclusively
│   ├── FR-ARM-010: Owner inferred from session on request creation
│   └── FR-MRA-005: Approver derived from session on approval/rejection
├── NFRs:
│   ├── NFR-SEC-002: Server-side authorization enforcement
│   └── NFR-REL-001: Business rule enforcement
├── Components (APP layer):
│   └── SessionContext — reads authenticated user on every protected request
├── Components (API layer):
│   ├── CurrentUserEndpoint
│   ├── CreateRequestEndpoint
│   ├── ApproveEndpoint
│   └── RejectEndpoint
└── Test Cases:
    ├── TC-AUTH-SEC-002: Crafted payload with spoofed employeeId is rejected
    ├── TC-AUTH-SEC-003: Session-derived identity overrides any frontend value
    ├── TC-ARM-SEC-001: Request created with session owner regardless of body field
    └── TC-MRA-SEC-001: Approval recorded with session approver regardless of body field
```

```
FR-MRA-002: Manager approves Submitted → Approved + one Approval record
├── Business Rules: BR-005, BR-006, BR-009
├── NFRs: NFR-REL-001, NFR-REL-002, NFR-SEC-002
├── Use Case: UC-008
├── Design: DD-001 §MRA
├── Components:
│   ├── ApprovalRecord (DOM)
│   ├── ApprovalService (APP)
│   ├── ApprovalRepository (INF)
│   └── ApproveEndpoint (API)
└── Test Cases:
    ├── TC-MRA-P-002: Successful approval records correct state and Approval record
    ├── TC-MRA-N-002: Cannot approve non-Submitted request
    ├── TC-MRA-N-006: Second approval attempt on Approved request is rejected
    └── TC-MRA-SEC-001: Approver identity is session-derived, not body-supplied
```

---

## 9. Backward Traceability

### From Test Cases to Requirements (Representative Sample)

| Test Case | Verifies | Requirement(s) | Business Rule | Priority |
|-----------|----------|----------------|---------------|----------|
| TC-AUTH-P-001 | New Employee account created via public registration | FR-AUTH-001 | BR-007 | Must Have |
| TC-AUTH-N-003 | Registration with Manager role payload is rejected | FR-AUTH-002 | BR-007 | Must Have |
| TC-AUTH-SEC-001 | Database contains only hashed passwords after registration | FR-AUTH-003, NFR-SEC-001 | — | Critical |
| TC-AUTH-SEC-002 | Spoofed employeeId in request body is ignored by API | FR-AUTH-008, NFR-SEC-002 | BR-011 | Must Have / Critical |
| TC-ARM-N-002 | End date before start date returns validation error | FR-ARM-002, FR-LSE-001 | BR-001 | Must Have |
| TC-ARM-N-003 | Past start date returns validation error | FR-ARM-003, FR-LSE-001 | BR-002 | Must Have |
| TC-ARM-N-004 | Edit attempt on Submitted request returns error | FR-ARM-005, FR-ARM-007, FR-LSE-004 | BR-003 | Must Have |
| TC-ARM-N-008 | Edit attempt on another user's request returns forbidden | FR-ARM-009, FR-LSE-006 | BR-004 | Must Have |
| TC-MRA-N-003 | Manager self-approval returns business rule error | FR-MRA-006, NFR-REL-001 | BR-008 | Must Have / Critical |
| TC-MRA-N-004 | Employee role on approve endpoint returns 403 | FR-MRA-007, FR-LSE-007, NFR-SEC-003 | BR-006 | Must Have / Critical |
| TC-MRA-N-006 | Second approval on already-Approved request returns error | FR-MRA-008, NFR-REL-001 | BR-009 | Must Have |
| TC-LSE-N-001 | Action on Approved state returns final-state error | FR-LSE-002 | BR-010 | Must Have |
| TC-REL-009 | Simulated DB failure during approval leaves no inconsistent state | NFR-REL-002 | BR-009 | High |
| TC-SEC-006 | SQLite file is not accessible via web server URL | NFR-SEC-004 | — | Critical |
| TC-SEC-007 | Cross-user request data access attempt returns error | NFR-SEC-005, FR-ARM-011 | — | Critical |

---

## 10. Verification Matrix

### 10.1 Verification Methods

| Method | Description | Applied To |
|--------|-------------|------------|
| Manual API Test | Direct HTTP calls to endpoints with controlled payloads | FR-AUTH, FR-ARM, FR-MRA, FR-LSE, NFR-SEC-002, NFR-SEC-003, NFR-REL-001 |
| Database Inspection | Direct read of SQLite file to confirm stored values | NFR-SEC-001 (password hashes), NFR-SEC-004 (no plain text), FR-MRA-002, FR-MRA-003 |
| Code Review | Review of source code structure, dependencies, and logic | NFR-MAINT-001 (architecture), NFR-SEC-001, NFR-REL-002 (transaction scope) |
| README Review | Content checklist review against documented criteria | NFR-AVAIL-002, NFR-MAINT-002, NFR-COMP-001 |
| First-Time Setup Walkthrough | Fresh-clone install and run by a reviewer using only the README | NFR-COMPAT-001, NFR-USE-001, NFR-AVAIL-001 |
| UI Walkthrough | Manual navigation through all lifecycle states | NFR-USE-002, NFR-USE-003, NFR-AVAIL-001 |
| Concurrent-Use Test | Small group executing workflow simultaneously | NFR-PERF-002 |

### 10.2 Verification Status

All verification activities are scheduled for the Quality phase (TP-001). None have been executed as of this RTM version.

| Req Group | Verification Method | Planned In | Current Status |
|-----------|---------------------|------------|----------------|
| FR-AUTH | Manual API Test, DB Inspection | Quality Phase | 🔜 Planned |
| FR-ATC | Manual API Test | Quality Phase | 🔜 Planned |
| FR-ARM | Manual API Test | Quality Phase | 🔜 Planned |
| FR-MRA | Manual API Test, DB Inspection | Quality Phase | 🔜 Planned |
| FR-LSE | Manual API Test | Quality Phase | 🔜 Planned |
| NFR-SEC-001 | DB Inspection | Quality Phase | 🔜 Planned |
| NFR-SEC-002 through 005 | Manual API Test, Code Review | Quality Phase | 🔜 Planned |
| NFR-REL-001 | Manual API Test | Quality Phase | 🔜 Planned |
| NFR-REL-002 | Code Review | Quality Phase | 🔜 Planned |
| NFR-REL-003 | Manual API Test | Quality Phase | 🔜 Planned |
| NFR-MAINT-001 | Code Review | Quality Phase | 🔜 Planned |
| NFR-MAINT-002, NFR-AVAIL-002, NFR-COMP-001 | README Review | Quality Phase | 🔜 Planned |
| NFR-COMPAT-001, NFR-USE-001 | Fresh-clone Walkthrough | Quality Phase | 🔜 Planned |
| NFR-USE-002, NFR-USE-003 | UI Walkthrough | Quality Phase | 🔜 Planned |
| NFR-PERF-001, NFR-AVAIL-001 | Manual Walkthrough | Quality Phase | 🔜 Planned |
| NFR-PERF-002 | Concurrent-Use Test | Quality Phase | 🔜 Planned |

---

## 11. Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Implemented and verified |
| ⏳ | In progress |
| 🔜 | Planned — artifact not yet produced |
| ❌ | Blocked |
| 📊 | Monitoring |
| ⚠️ | At risk |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Solution Architect | Yeuri Jessel Reyes | | Pending |
| Technical Lead | | | Pending |
| QA Lead | | | Pending |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Yeuri Jessel Reyes (AI Assisted) | Initial release — full coverage of FRS-001 and NFR-001 requirements |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Solution Architect (PM_OVERRIDE — bypassed Solution Architect) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 19:05:15 UTC |

*— End of document —*
