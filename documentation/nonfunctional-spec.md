# Non-Functional Requirements Specification

**Project:** VacaFlow_03
**Document ID:** NFR-001
**Phase:** 03 — Requirements
**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-20
**Version:** 1.0
**Status:** Draft
**References:** SI-001 (Strategic Intake)

---

## Executive Summary

This register documents the non-functional requirements for VacaFlow_03, the locally executable absence request management application developed for IGS Solutions. The system is an MVP intended to validate a structured request lifecycle (Draft → Submitted → Approved/Rejected/Cancelled) for a small, controlled review audience. It is not a production deployment.

Given the MVP context, the NFR profile is deliberately shaped by the priorities established in SI-001: security and correctness are rated Critical because they directly govern trust in the recorded approval identity; usability and maintainability are rated High because they determine whether the review group can complete the workflow without support; compatibility is rated High because the system must run from source code on a reviewer's machine; performance and availability are rated Low because neither concurrent scale nor uptime commitments apply to this local validation exercise; and formal regulatory compliance is explicitly out of scope for the MVP.

This document covers 8 NFR categories and a total of 19 individual requirements.

---

## NFR Summary

| Category | Count | Critical | High | Medium | Low |
|----------|-------|----------|------|--------|-----|
| Performance | 2 | — | — | — | 2 |
| Security | 5 | 5 | — | — | — |
| Availability | 2 | — | — | — | 2 |
| Usability | 3 | — | 3 | — | — |
| Reliability | 3 | 1 | 2 | — | — |
| Maintainability | 2 | — | — | 2 | — |
| Compatibility | 1 | — | 1 | — | — |
| Compliance | 1 | — | — | 1 | — |
| **Total** | **19** | **6** | **6** | **3** | **4** |

---

## 1. Performance Requirements

Performance is a low priority for VacaFlow_03. The user base is intentionally small and limited to a review group validating the workflow locally. No throughput, concurrency, or response-time SLAs have been defined. The sole requirement is that the application must not introduce observable blocking delays during the review workflow.

---

### NFR-PERF-001: Review Workflow Responsiveness

**Category:** Performance
**Priority:** Low

#### Requirement

The application shall respond to user interactions across the complete review workflow — registration, login, request creation, submission, approval, and rejection — without observable blocking delays on a standard development machine running the application locally from source code.

#### Acceptance Criteria

| Scenario | Acceptable Behavior |
|----------|---------------------|
| Page navigation (any screen) | Renders without a perceivable loading hang during normal single-user use |
| API call (any endpoint) | Returns a response before the default browser or HTTP client timeout fires |
| Database read (list of requests or absence types) | Result visible within a single user interaction cycle |
| Database write (create, submit, approve, reject) | Operation completes and the updated state is reflected on the next page load |

#### Conditions

- Single user or a small simultaneous review group (no concurrent-load targets defined)
- Local execution only; no network latency between client and server
- SQLite database with seed data and a small number of test requests generated during review

#### Verification Method

- Manual end-to-end walkthrough of the full request lifecycle by the reviewer
- No automated load or performance testing is required for MVP acceptance

#### Related Requirements

- SI-001 §4 — Scope Boundaries (local execution)
- SI-001 §5 — Constraints (SQLite, local only)

---

### NFR-PERF-002: SQLite Concurrency Adequacy

**Category:** Performance
**Priority:** Low

#### Requirement

The SQLite database shall handle the concurrent read/write load expected during the MVP review window without producing lock errors that prevent a reviewer from completing a workflow action.

#### Acceptance Criteria

| Condition | Requirement |
|-----------|-------------|
| Sequential single-user use | Zero lock errors |
| Small simultaneous review group | No workflow-blocking lock errors during normal use |
| No automated stress or concurrency test required | Validated by manual review only |

#### Conditions

- Review audience is a small, controlled group as confirmed in SI-001 §5 Assumptions
- If concurrent load causes SQLite locking issues during review, a database layer change is required per SI-001 §5 Assumptions — this assumption must be validated before the review window opens

#### Verification Method

- Manual concurrent-use test by the review group
- SQLite file location documented in README per SI-001 §4

#### Related Requirements

- SI-001 §5 — Assumptions (SQLite performance assumption)

---

## 2. Security Requirements

Security is the highest-priority NFR category. The trust value of VacaFlow derives entirely from the integrity of recorded approval decisions. Any vulnerability that allows identity spoofing, unauthorized role assumption, or plain-text credential exposure invalidates the core value proposition established in SI-001 §2.

---

### NFR-SEC-001: Password Storage

**Category:** Security
**Priority:** Critical

#### Requirement

The system shall never store user passwords in plain text. All passwords must be stored as hashes using an industry-standard hashing algorithm with per-user salting.

#### Acceptance Criteria

- [ ] Passwords are stored using a well-established hashing library (e.g., BCrypt, Argon2, or ASP.NET Core Identity's default PBKDF2)
- [ ] The raw password value is not written to any persistent store, log file, or response payload at any point
- [ ] The SQLite database file, when inspected, contains only hash values in the password column — no readable passwords
- [ ] Seeded account credentials in the README are documented as example values only; no real production passwords are committed

#### Verification Method

- Code review of the registration and login pathways
- Direct inspection of the SQLite database after registration to confirm no plain-text passwords
- Review of all log output during registration and login to confirm passwords are absent

#### Related Requirements

- SI-001 §5 — Technical Constraints (hashed passwords)

---

### NFR-SEC-002: Server-Side Authorization Enforcement

**Category:** Security
**Priority:** Critical

#### Requirement

All authorization decisions shall be enforced by the API using the authenticated session or token. The frontend must not supply employee IDs, approver IDs, or role values as trusted inputs for business decisions. The API must derive the current user's identity and role independently on every request.

#### Acceptance Criteria

- [ ] The API reads the current user's identity and role from the authenticated session or JWT claim on every protected endpoint call
- [ ] No endpoint that performs a business action (submit, approve, reject, cancel) accepts an employee ID or approver ID as a body or query parameter that influences authorization
- [ ] Manually crafting a request body with a different employeeId or approverId does not result in the action being attributed to a different user
- [ ] The approval record stores the identity of the authenticated Manager, not a value supplied by the frontend

#### Verification Method

- Code review of all protected API endpoints
- Manual API test: submit a crafted request with a spoofed employeeId and verify the action is rejected or the correct identity is used
- Inspection of approval records to confirm the authenticated manager's identity is stored

#### Related Requirements

- SI-001 §5 — Technical Constraints (API derives identity from session)
- SI-001 §2 — Value Proposition (manager identity integrity)

---

### NFR-SEC-003: Role-Based Access Control

**Category:** Security
**Priority:** Critical

#### Requirement

The system shall enforce two application roles — Employee and Manager — with distinct permissions. Role assignments shall be controlled server-side. Public self-registration shall create Employee accounts only; no path through public registration shall allow a user to assume the Manager role.

#### Acceptance Criteria

| Rule | Acceptance Test |
|------|-----------------|
| Only Managers can approve requests | An API call to the approve endpoint authenticated as an Employee returns 403 |
| Only Managers can reject requests | An API call to the reject endpoint authenticated as an Employee returns 403 |
| A Manager cannot approve or reject their own request | An API call to approve/reject a request submitted by the authenticated Manager returns a business rule error |
| Public registration produces only Employee accounts | Submitting a registration payload with a role claim of "Manager" does not result in a Manager account |
| Manager accounts are available only through seed data or controlled setup | No publicly accessible registration endpoint accepts a Manager role value |

#### Verification Method

- Code review of registration and role assignment logic
- Manual API tests with Employee credentials against Manager-only endpoints
- Manual API test: attempt self-approval and confirm rejection
- Inspect the database after registering via the public endpoint to confirm role = Employee

#### Related Requirements

- SI-001 §4 — Scope Boundaries (two roles, Manager accounts via seed)
- SI-001 §5 — Business Constraints (Manager role cannot be self-assigned)

---

### NFR-SEC-004: Database File Protection

**Category:** Security
**Priority:** Critical

#### Requirement

The SQLite database file shall not be publicly accessible during local execution and shall not be committed to source control with real credential data.

#### Acceptance Criteria

- [ ] The SQLite file path is not served by the web server or API as a static file
- [ ] The repository's `.gitignore` excludes the SQLite database file from source control commits
- [ ] No seeded accounts in committed code use real organizational passwords; seed values are placeholder credentials documented in the README for review use only
- [ ] The README documents the file location and instructions for manual copy and database reset per SI-001 §4

#### Verification Method

- Review of `.gitignore` and repository contents to confirm the database file is excluded
- Attempt to fetch the SQLite file path via the running web server and confirm it is not accessible
- Review of seed data for non-real credential values

#### Related Requirements

- SI-001 §5 — Technical Constraints (database file not publicly exposed)
- SI-001 §4 — Out of Scope (automated backups out of scope; manual copy documented)

---

### NFR-SEC-005: Protected Personal Data

**Category:** Security
**Priority:** Critical

#### Requirement

User emails, password hashes, names, request reasons, dates, and approval comments shall not be exposed to unauthorized users through API responses, logs, or error messages.

#### Acceptance Criteria

- [ ] An Employee authenticated to the API cannot retrieve the request list or request details of another employee through any available endpoint
- [ ] API error responses do not include stack traces, SQL query fragments, or internal object representations
- [ ] Application logs do not write request body contents containing personal data in plain text
- [ ] The manager review list returns only the data required for the approval decision; it does not expose data fields beyond those defined in the approved API contract

#### Verification Method

- Manual API test: attempt cross-user data access with a valid Employee token
- Review of error handling middleware to confirm stack traces are suppressed in responses
- Review of logging configuration for personal data exposure
- Comparison of API response payloads against the defined data contract

#### Related Requirements

- SI-001 §5 — Legal Constraints (protected personal data)
- SI-001 §4 — Scope Boundaries (defined workflow endpoints only)

---

## 3. Availability Requirements

High availability is not required. VacaFlow_03 is a local MVP, not a production deployment. There are no uptime commitments, no RTO or RPO targets, and no disaster recovery infrastructure.

---

### NFR-AVAIL-001: Review-Window Support

**Category:** Availability
**Priority:** Low

#### Requirement

During the MVP review window, blocking defects that prevent reviewers from completing registration, login, request creation, submission, approval, rejection, or final status visibility shall be remediated. Cosmetic issues may be deferred.

#### Acceptance Criteria

| Defect Class | Treatment |
|--------------|-----------|
| Blocking: prevents any step of the core review workflow | Must be fixed before acceptance review |
| Non-blocking: cosmetic, display, or convenience issue | May be deferred to post-MVP |

#### Conditions

- No formal SLA or response time commitment
- Support is limited to the MVP review window as defined in SI-001 §4 — Out of Scope

#### Verification Method

- End-to-end walkthrough of the full workflow by the reviewer confirms no blocking defects remain

#### Related Requirements

- SI-001 §4 — Out of Scope (production support SLAs out of scope)

---

### NFR-AVAIL-002: Database Recovery Documentation

**Category:** Availability
**Priority:** Low

#### Requirement

The README shall document the SQLite database file location and provide instructions for manually copying and resetting the database. Automated backups are out of scope.

#### Acceptance Criteria

- [ ] The README contains the exact relative path to the SQLite file
- [ ] The README contains step-by-step instructions for resetting the database to the seeded state
- [ ] Instructions for manually copying the database file for safekeeping are included
- [ ] No automated backup mechanism is implemented (out of scope per SI-001 §4)

#### Verification Method

- Review of README content against the above checklist items

#### Related Requirements

- SI-001 §4 — Out of Scope (automated backups out of scope)
- SI-001 §5 — Technical Constraints (SQLite file location documented)

---

## 4. Usability Requirements

The interface must be simple and functional enough for employees and managers to complete the full review workflow without training beyond reading the README.

---

### NFR-USE-001: Workflow Completability Without Training

**Category:** Usability
**Priority:** High

#### Requirement

An employee or manager with no prior knowledge of VacaFlow shall be able to complete the full request lifecycle — register, log in, create a Draft request, submit, and view the result; or log in as a manager, review a submitted request, and approve or reject it with a comment — using only the README as a reference.

#### Acceptance Criteria

- [ ] All form labels, page titles, and action buttons use plain language that matches the business terminology in SI-001 (e.g., "Submit Request", "Approve", "Reject", "Cancel")
- [ ] A reviewer completing a first-time walkthrough does not require clarification beyond the README to advance through any step of the workflow
- [ ] Error messages use plain language and indicate what the user must do to resolve the issue
- [ ] No screen exposes an action that is invalid for the current request state (e.g., an Approve button does not appear on a Draft request)

#### Verification Method

- First-time walkthrough by a reviewer using only the README and the running application
- UI review against the state-action mapping

#### Related Requirements

- SI-001 §4 — Scope Boundaries (web screens defined)
- NFR-REL-001: Business Rule Enforcement

---

### NFR-USE-002: State-Appropriate Action Visibility

**Category:** Usability
**Priority:** High

#### Requirement

The UI shall display only the actions that are valid for the current lifecycle state of a request. Invalid actions shall not be rendered.

#### Acceptance Criteria

| Request State | Visible Employee Actions | Visible Manager Actions |
|---------------|--------------------------|------------------------|
| Draft | Edit, Submit, Cancel | None |
| Submitted | Cancel | Approve, Reject |
| Approved | None (read-only) | None (read-only) |
| Rejected | None (read-only) | None (read-only) |
| Cancelled | None (read-only) | None (read-only) |

#### Verification Method

- Manual UI walkthrough through all five lifecycle states, confirming action button visibility matches the table above
- Confirm that no hidden HTML element exposes an action button that is suppressed in the visible UI

#### Related Requirements

- NFR-REL-001: Business Rule Enforcement
- SI-001 §4 — Scope Boundaries (lifecycle states and actions)

---

### NFR-USE-003: Responsive Layout on Standard Desktop Viewports

**Category:** Usability
**Priority:** High

#### Requirement

The application UI shall render correctly and be usable on standard desktop browser viewports. Mobile optimization is not required for the MVP.

#### Acceptance Criteria

| Viewport Width | Behavior |
|----------------|----------|
| 1024px and above | All screens render without horizontal scroll; all interactive elements are accessible |
| Below 768px | Not required; MVP review is performed on desktop machines |

#### Verification Method

- Manual review at 1280×800 and 1920×1080 viewport sizes in the latest version of at least one supported browser

#### Related Requirements

- SI-001 §4 — Out of Scope (formal accessibility certification out of scope)

---

## 5. Reliability Requirements

The correctness of business rule enforcement is a hard requirement. Acceptance explicitly fails if any defined business rule can be bypassed.

---

### NFR-REL-001: Business Rule Enforcement

**Category:** Reliability
**Priority:** Critical

#### Requirement

The system shall enforce all defined business rules consistently on every request, regardless of the requesting user, the approving manager, or the order of operations. Acceptance fails if any rule can be bypassed.

#### Acceptance Criteria

| Business Rule | Test Scenario | Expected Result |
|---------------|---------------|-----------------|
| End date not before start date | Submit a request with EndDate < StartDate | API returns validation error; request is not created |
| Start date not in the past | Submit a request with StartDate < today | API returns validation error; request is not created |
| Only Draft requests are editable | Attempt to edit a Submitted, Approved, or Rejected request | API returns error; request data is unchanged |
| Only Submitted requests can be approved or rejected | Attempt to approve a Draft or Approved request | API returns error; state does not change |
| Only Managers can approve or reject | Attempt approval with an Employee token | API returns 403; request state unchanged |
| A Manager cannot approve their own request | Manager submits a request and attempts self-approval | API returns business rule error; request state unchanged |
| Public registration cannot produce a Manager account | Register with a role claim of Manager | Account is created as Employee or registration is rejected |
| API derives approver identity from session | Attempt to approve with a spoofed approverId in the body | Action records the authenticated manager; spoofed value is ignored |

#### Verification Method

- Manual API test for each rule in the table above
- Code review of the application and domain layer rule implementations

#### Related Requirements

- SI-001 §4 — Scope Boundaries (business rules defined)
- SI-001 §5 — Business Constraints (bypassing identity or role causes acceptance to fail)
- NFR-SEC-002: Server-Side Authorization Enforcement
- NFR-SEC-003: Role-Based Access Control

---

### NFR-REL-002: Transactional Integrity for Approval Records

**Category:** Reliability
**Priority:** High

#### Requirement

An approval or rejection action shall be recorded atomically. If the write fails after the state transition has been applied, the system shall not leave the request in an inconsistent state.

#### Acceptance Criteria

- [ ] Approval and rejection operations execute within a single database transaction covering both the state update and the approval record creation
- [ ] A simulated write failure during approval does not produce a request in the Approved state with no corresponding Approval record
- [ ] Error responses to the client accurately reflect whether the operation succeeded or failed

#### Verification Method

- Code review of the approval and rejection service methods to confirm transaction scope
- Review of error handling to confirm rollback behavior on partial failure

#### Related Requirements

- NFR-REL-001: Business Rule Enforcement
- SI-001 §2 — Value Proposition (approval record integrity)

---

### NFR-REL-003: Validated Data at Entry Points

**Category:** Reliability
**Priority:** High

#### Requirement

All inputs to the API shall be validated before any business logic executes. Invalid inputs shall return a descriptive error response; they shall not cause unhandled exceptions or corrupt application state.

#### Acceptance Criteria

- [ ] Required fields (start date, end date, absence type, request reason for create; comment for approve/reject) are validated and an informative error is returned if missing
- [ ] Date fields reject non-date values with a descriptive error message
- [ ] Absence type ID is validated against the seeded list; an unknown ID returns an error
- [ ] No API endpoint produces an unhandled exception (HTTP 500) for malformed but syntactically valid input

#### Verification Method

- Manual API tests with missing required fields, invalid date formats, and unknown absence type IDs
- Review of global error-handling middleware

#### Related Requirements

- NFR-REL-001: Business Rule Enforcement
- SI-001 §4 — Scope Boundaries (defined workflow endpoints)

---

## 6. Maintainability Requirements

The codebase must be structured for easy review and future extension without unnecessary patterns.

---

### NFR-MAINT-001: Reduced Onion Architecture Compliance

**Category:** Maintainability
**Priority:** Medium

#### Requirement

The codebase shall implement a reduced Onion Architecture with exactly five layers: Domain, Application, Infrastructure, API, and Web. No additional architectural patterns (MediatR, CQRS, generic repositories, messaging frameworks) shall be introduced.

#### Acceptance Criteria

| Layer | Responsibility | Constraint |
|-------|----------------|------------|
| Domain | Business entities and rules | No dependency on Infrastructure or API |
| Application | Use case orchestration and service interfaces | No dependency on Infrastructure |
| Infrastructure | Data access (SQLite, EF Core or Dapper) | Implements Application interfaces |
| API | ASP.NET Core Minimal API endpoints | Depends on Application only |
| Web | Next.js frontend | Communicates with API via HTTP only |

- [ ] No MediatR, CQRS, event bus, or generic repository pattern present in the codebase
- [ ] Dependency direction flows strictly inward (Infrastructure → Application → Domain)
- [ ] An independent reviewer can identify the layer boundary from project/folder naming without additional documentation

#### Verification Method

- Code review of project structure and dependency references
- Confirm absence of MediatR, CQRS, or messaging NuGet packages in the solution file

#### Related Requirements

- SI-001 §5 — Technical Constraints (reduced Onion Architecture required)

---

### NFR-MAINT-002: README Completeness

**Category:** Maintainability
**Priority:** Medium

#### Requirement

The repository shall include a README that enables a reviewer to set up and run the application, understand its scope, and locate key information without assistance.

#### Acceptance Criteria

- [ ] Prerequisites section lists required runtime versions (Node.js, .NET SDK)
- [ ] Step-by-step setup instructions from clone to running application are included
- [ ] Seeded account credentials (email and password) for at least one Employee and one Manager are documented
- [ ] Endpoint summary lists all API routes, HTTP methods, and brief descriptions
- [ ] Scope limitations section acknowledges all known out-of-scope items from SI-001 §4
- [ ] Deferred backlog section lists items explicitly deferred from the Won't v1 list in SI-001 §4
- [ ] SQLite file location and database reset instructions are included (per NFR-AVAIL-002)
- [ ] A reviewer can complete the full workflow using only the README and the application

#### Verification Method

- First-time setup attempt by a reviewer using only the README
- README content checklist review against the acceptance criteria above

#### Related Requirements

- SI-001 §4 — Out of Scope and Won't v1
- NFR-AVAIL-002: Database Recovery Documentation
- NFR-USE-001: Workflow Completability Without Training

---

## 7. Compatibility Requirements

The application must run locally from source code on a standard development machine. No cloud, container, or pipeline infrastructure is required.

---

### NFR-COMPAT-001: Local Source Execution

**Category:** Compatibility
**Priority:** High

#### Requirement

The application shall start and run correctly from source code on a reviewer's local machine using only the documented prerequisites and setup instructions. No Docker, Azure deployment, or CI/CD pipeline is required.

#### Acceptance Criteria

| Step | Requirement |
|------|-------------|
| Clone and restore | `git clone` followed by dependency restore commands completes without errors |
| Database initialization | Running the documented setup command generates the SQLite database with seeded absence types and at least one Manager account |
| API startup | The ASP.NET Core API starts and serves requests on the documented local port |
| Web startup | The Next.js web application starts and is accessible in a browser at the documented local URL |
| Full workflow | A reviewer can complete the full request lifecycle without additional configuration |

#### Operating Environment

- Windows, macOS, or Linux development machine with the documented runtime versions installed
- No internet connection required during execution (all dependencies restored at setup)

#### Verification Method

- Fresh-clone setup walkthrough on a machine that has not previously run the application
- Confirm each step in the acceptance criteria above completes successfully

#### Related Requirements

- SI-001 §5 — Technical Constraints (local execution from source code)
- SI-001 §4 — Out of Scope (Docker and CI/CD out of scope)
- NFR-MAINT-002: README Completeness

---

## 8. Compliance Requirements

No formal regulatory compliance standards apply to the VacaFlow MVP. This section documents the applicable data protection practices and the explicit acknowledgment of deferred compliance obligations.

---

### NFR-COMP-001: MVP Data Protection Practices

**Category:** Compliance
**Priority:** Medium

#### Requirement

The application shall implement basic data protection practices appropriate for an internal MVP storing employee identity and absence request data, without requiring formal regulatory certification.

#### Acceptance Criteria

- [ ] Passwords are hashed (covered by NFR-SEC-001)
- [ ] Personal data (emails, names, request reasons, approval comments) is accessible only to authenticated users with appropriate role and ownership (covered by NFR-SEC-002, NFR-SEC-003, NFR-SEC-005)
- [ ] The SQLite database file is excluded from source control (covered by NFR-SEC-004)
- [ ] The README acknowledges that the application stores basic employee identity and absence request data
- [ ] The README acknowledges that formal privacy, data retention, and compliance requirements must be revisited if VacaFlow moves to production use
- [ ] No formal SOC 2, GDPR, or HIPAA certification is pursued or claimed for the MVP

#### Deferred Compliance Items

The following compliance requirements are explicitly deferred to a post-MVP stage, contingent on James Parker's authorization of production hardening:

| Deferred Item | Trigger for Revisit |
|---------------|---------------------|
| Privacy notice and user consent flow | Before broader employee access beyond the review group |
| Data retention and deletion policy | Before production deployment |
| Formal GDPR or applicable privacy regulation review | Before any employee data is processed beyond the review window |
| SOC 2 or equivalent controls | Before commercial or enterprise deployment |

#### Verification Method

- README review against the acknowledgment checklist
- Confirm NFR-SEC-001 through NFR-SEC-005 pass their respective verification methods

#### Related Requirements

- SI-001 §5 — Legal Constraints
- SI-001 §4 — Out of Scope (privacy notice out of scope for MVP)
- NFR-SEC-001 through NFR-SEC-005

---

## NFR Traceability

| NFR ID | Category | Priority | Related SI-001 Section | Related NFRs |
|--------|----------|----------|------------------------|--------------|
| NFR-PERF-001 | Performance | Low | §4 Scope, §5 Constraints | NFR-COMPAT-001 |
| NFR-PERF-002 | Performance | Low | §5 Assumptions | NFR-COMPAT-001 |
| NFR-SEC-001 | Security | Critical | §5 Technical Constraints | NFR-COMP-001 |
| NFR-SEC-002 | Security | Critical | §5 Technical Constraints, §2 Value Prop | NFR-REL-001 |
| NFR-SEC-003 | Security | Critical | §4 Scope, §5 Business Constraints | NFR-REL-001 |
| NFR-SEC-004 | Security | Critical | §5 Technical Constraints | NFR-COMP-001 |
| NFR-SEC-005 | Security | Critical | §5 Legal Constraints | NFR-SEC-002 |
| NFR-AVAIL-001 | Availability | Low | §4 Out of Scope | — |
| NFR-AVAIL-002 | Availability | Low | §4 Out of Scope, §5 Constraints | NFR-MAINT-002 |
| NFR-USE-001 | Usability | High | §4 Scope Boundaries | NFR-MAINT-002 |
| NFR-USE-002 | Usability | High | §4 Scope Boundaries | NFR-REL-001 |
| NFR-USE-003 | Usability | High | §4 Out of Scope | — |
| NFR-REL-001 | Reliability | Critical | §4 Scope, §5 Business Constraints | NFR-SEC-002, NFR-SEC-003, NFR-USE-002 |
| NFR-REL-002 | Reliability | High | §2 Value Proposition | NFR-REL-001 |
| NFR-REL-003 | Reliability | High | §4 Scope Boundaries | NFR-REL-001 |
| NFR-MAINT-001 | Maintainability | Medium | §5 Technical Constraints | — |
| NFR-MAINT-002 | Maintainability | Medium | §4 Out of Scope, Won't v1 | NFR-AVAIL-002, NFR-USE-001 |
| NFR-COMPAT-001 | Compatibility | High | §5 Technical Constraints | NFR-MAINT-002 |
| NFR-COMP-001 | Compliance | Medium | §5 Legal Constraints | NFR-SEC-001 through NFR-SEC-005 |

---

## Validation Checklist

- [x] All 8 NFR categories addressed
- [x] All metrics are quantified or defined with explicit acceptance criteria
- [x] Verification methods defined for each NFR
- [x] All priorities assigned
- [x] Traceability to SI-001 established for all NFRs
- [x] No placeholder text remaining
- [x] MVP context and deferred items explicitly documented
- [x] Security requirements reflect the Critical priority established in the user inputs

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Solution Architect | Yeuri Jessel Reyes | | Pending |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Yeuri Jessel Reyes (AI Assisted) | Initial draft |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Solution Architect (PM_OVERRIDE — bypassed Solution Architect) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 18:58:21 UTC |

*— End of document —*
