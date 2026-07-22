# Prioritized Backlog: VacaFlow_03

**Project:** VacaFlow_03
**Document ID:** BLG-001
**Stage:** 05 — Planning
**Author:** Junior Gervacio (AI Assisted)
**Product Owner / BSA:** Junior Gervacio
**Related Documents:** FRS-001, SAD (software-architecture-document)
**Sprint Velocity:** 3 stories per sprint (estimated)
**Date:** 2026-07-20
**Version:** 1.0

---

## MoSCoW Summary

| Priority | Stories | Sprint | Estimated Velocity |
|----------|---------|--------|--------------------|
| Must Have | 11 stories | Sprint 1–4 | 3 stories/sprint |
| Should Have | 2 stories | Sprint 4 | 3 stories/sprint |
| Won't v1 | 19 items | Deferred | — |
| **Total** | **13 user stories + 19 deferred items** | | |

---

## User Story Summary

| ID | Title | Priority | Sprint | Source FR(s) | Dependencies |
|----|-------|----------|--------|--------------|--------------|
| US-001 | User Registration | Must Have | Sprint 1 | FR-AUTH-001, FR-AUTH-002, FR-AUTH-003 | None |
| US-002 | User Login | Must Have | Sprint 1 | FR-AUTH-004, FR-AUTH-008 | US-001 |
| US-003 | User Logout | Must Have | Sprint 1 | FR-AUTH-006 | US-002 |
| US-004 | Create Draft Request | Must Have | Sprint 2 | FR-ARM-001, FR-ARM-002, FR-ARM-003, FR-ARM-010 | US-002, US-010 |
| US-005 | Edit Draft Request | Must Have | Sprint 2 | FR-ARM-004, FR-ARM-005, FR-LSE-004 | US-004 |
| US-006 | Submit Request | Must Have | Sprint 2 | FR-ARM-006, FR-ARM-007, FR-LSE-001 | US-004 |
| US-007 | Cancel Request | Must Have | Sprint 2 | FR-ARM-008, FR-LSE-002 | US-004 |
| US-008 | Manager Views Submitted Requests | Must Have | Sprint 3 | FR-MRA-001, FR-LSE-007 | US-002, US-006 |
| US-009 | Approve Request | Must Have | Sprint 3 | FR-MRA-002, FR-MRA-004, FR-MRA-005, FR-MRA-006, FR-MRA-008, FR-LSE-005 | US-008 |
| US-010 | Reject Request | Must Have | Sprint 3 | FR-MRA-003, FR-MRA-004, FR-MRA-005, FR-MRA-006, FR-MRA-008, FR-LSE-005 | US-008 |
| US-011 | Employee Views Request List and Final Decision | Must Have | Sprint 4 | FR-ARM-011, FR-LSE-006 | US-002, US-004 |
| US-012 | List Absence Types | Should Have | Sprint 4 | FR-ATC-001, FR-ATC-002, FR-ATC-003 | US-002 |
| US-013 | Get Current User Profile | Should Have | Sprint 4 | FR-AUTH-007 | US-002 |

---

## 1. Must Have — Sprint 1–4

*These stories implement the core functional requirements. The product cannot launch without them.*

---

### US-001: User Registration

**As an** unregistered visitor,
**I want to** register with my name, email address, password, and the Employee role,
**So that** I have a personal account in VacaFlow and all my actions are attributed to my authenticated identity.

**Source Requirements:** FR-AUTH-001, FR-AUTH-002, FR-AUTH-003

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful employee registration | A visitor is on the registration screen and has not registered before | They submit a valid name, unique email, password, and the Employee role | The system creates the account, stores a BCrypt hash of the password (no plain text), and confirms successful registration |
| AC-002 | Duplicate email rejected | A visitor provides an email address already registered in the system | They submit the registration form | The system returns an error indicating the email is already in use; no duplicate account is created |
| AC-003 | Manager role self-assignment blocked | A visitor attempts to register via the public endpoint with the Manager role (e.g., by manipulating the payload) | They submit the registration request | The system rejects the request and returns an error regardless of the method used; no Manager account is created |
| AC-004 | Missing required field rejected | A visitor submits a registration form omitting a required field (name, email, or password) | They submit the form | The system returns a validation error identifying the missing field; no account is created |

**Business Rules:** BR-007 (Manager role cannot be self-assigned), BR-011 (API derives identity from session)
**Dependencies:** SQLite database schema and local auth infrastructure (VacaFlow.Infrastructure / VacaFlowDbContext)
**Sprint Assignment:** Sprint 1

---

### US-002: User Login

**As an** Employee or Manager,
**I want to** log in with my email address and password,
**So that** I can access the application and all subsequent actions are performed as my authenticated identity.

**Source Requirements:** FR-AUTH-004, FR-AUTH-008

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful login | A registered user provides their correct email and password | They submit the login form | The system validates the credentials against the stored BCrypt hash, establishes a session (HttpOnly cookie), and returns a success response |
| AC-002 | Invalid credentials rejected | A registered user provides an incorrect password | They submit the login form | The system returns a generic authentication failure response without specifying whether the email or password was incorrect |
| AC-003 | Non-existent account | A visitor provides an email address that does not exist in the system | They submit the login form | The system returns the same generic authentication failure message as an incorrect password, preventing account enumeration |
| AC-004 | Session identity derived server-side | An authenticated user performs any business operation | The API processes the request | The user's identity (employee ID, role) is read exclusively from the validated session cookie, not from any field in the request body |

**Business Rules:** BR-011 (identity derived from session), FR-AUTH-005 (generic error message)
**Dependencies:** US-001 (User Registration)
**Sprint Assignment:** Sprint 1

---

### US-003: User Logout

**As an** Employee or Manager,
**I want to** log out of the application,
**So that** my session is terminated and no further actions can be performed under my identity without re-authenticating.

**Source Requirements:** FR-AUTH-006

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful logout | An authenticated user is logged in with an active session cookie | They call the logout endpoint | The system terminates the session (invalidates / clears the cookie) and returns a success response |
| AC-002 | Subsequent request rejected after logout | A user has successfully logged out | They attempt any authenticated operation using the previous session | The system returns an unauthorized (401) response; the previous session cannot be reused |
| AC-003 | Already-expired session | A user whose session has already expired navigates to a protected screen | The system evaluates the request | The system redirects to the login screen without returning an error; no secondary logout failure occurs |

**Business Rules:** FR-AUTH-006 (session termination)
**Dependencies:** US-002 (User Login)
**Sprint Assignment:** Sprint 1

---

### US-004: Create Draft Request

**As an** Employee,
**I want to** create a new absence request by selecting an absence type, a start date, an end date, and providing a reason,
**So that** a Draft request is recorded in the system under my authenticated identity without requiring me to supply my own employee identifier.

**Source Requirements:** FR-ARM-001, FR-ARM-002, FR-ARM-003, FR-ARM-010

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful Draft creation | An authenticated Employee submits a valid create-request payload (valid absence type, start date today or in the future, end date on or after start date, and a reason) | They call the create-request endpoint | The system creates the request in Draft state, assigns ownership to the authenticated user (from the session), and returns the new request details |
| AC-002 | End date before start date rejected | An authenticated Employee provides a start date of 2026-07-25 and an end date of 2026-07-24 | They submit the create-request form | The system returns a validation error stating the end date cannot be earlier than the start date; no request is created |
| AC-003 | Past start date rejected | An authenticated Employee provides a start date of the day before today | They submit the create-request form | The system returns a validation error stating the start date cannot be in the past; no request is created |
| AC-004 | Ownership from session, not payload | An authenticated Employee submits a create-request payload that includes an explicit employee ID field | They call the create-request endpoint | The system ignores the supplied employee ID field and assigns ownership based on the authenticated session; no impersonation is possible |
| AC-005 | Missing required field rejected | An authenticated Employee omits a required field (absence type, start date, end date, or reason) | They submit the form | The system returns a validation error identifying the missing field; no request is created |

**Business Rules:** BR-001 (end date ≥ start date), BR-002 (start date not in past), BR-011 (ownership from session)
**Dependencies:** US-002 (User Login), US-010 (Reject Request — indirectly requires absence type seed, see FR-ATC-001); absence types must be seeded at startup per FR-ATC-001
**Sprint Assignment:** Sprint 2

---

### US-005: Edit Draft Request

**As an** Employee,
**I want to** edit my own Draft request before submitting it,
**So that** I can correct or update the absence type, dates, or reason prior to submission.

**Source Requirements:** FR-ARM-004, FR-ARM-005, FR-LSE-004

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful edit of Draft request | An authenticated Employee owns a request in Draft state | They submit an edit payload with updated fields | The system updates the request fields (re-validating dates per BR-001 and BR-002), and the request remains in Draft state |
| AC-002 | Edit of non-Draft request rejected | An authenticated Employee owns a request in Submitted, Approved, Rejected, or Cancelled state | They attempt to edit the request | The system returns a clear error stating the request cannot be edited in its current state |
| AC-003 | Edit of another employee's request rejected | An authenticated Employee attempts to edit a Draft request owned by a different Employee | They call the edit endpoint with the other employee's request ID | The system returns a forbidden (403) error; no changes are made |
| AC-004 | Date validation re-applied on edit | An authenticated Employee edits a Draft request and provides a start date in the past | They submit the edit | The system returns the same date validation error as on creation; the request is not updated |

**Business Rules:** BR-001, BR-002, BR-003 (only Draft is editable), BR-004 (only owner can edit)
**Dependencies:** US-004 (Create Draft Request)
**Sprint Assignment:** Sprint 2

---

### US-006: Submit Request

**As an** Employee,
**I want to** submit my Draft request for manager review,
**So that** the request moves to Submitted state and becomes visible to my manager for a decision.

**Source Requirements:** FR-ARM-006, FR-ARM-007, FR-LSE-001

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful submission | An authenticated Employee owns a request in Draft state | They call the submit action | The system transitions the request state from Draft to Submitted; the request becomes read-only for the employee |
| AC-002 | Submission of non-Draft request rejected | An authenticated Employee owns a request in any state other than Draft | They attempt to submit it | The system returns a clear error stating the request cannot be submitted from its current state |
| AC-003 | Submission of another employee's request rejected | An authenticated Employee attempts to submit a Draft request owned by a different Employee | They call the submit endpoint with the other employee's request ID | The system returns a forbidden (403) error; the request state is unchanged |
| AC-004 | Submitted request is read-only for employee | An authenticated Employee owns a Submitted request | They attempt to edit it | The system returns an error consistent with FR-ARM-005 and FR-LSE-004 |

**Business Rules:** BR-003, BR-004, BR-010 (Submitted is not a final state — further transitions are valid)
**Dependencies:** US-004 (Create Draft Request)
**Sprint Assignment:** Sprint 2

---

### US-007: Cancel Request

**As an** Employee,
**I want to** cancel my Draft or Submitted request,
**So that** the request is marked Cancelled and no further action is taken on it.

**Source Requirements:** FR-ARM-008, FR-LSE-002

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Cancel Draft request | An authenticated Employee owns a request in Draft state | They call the cancel action | The system transitions the request state to Cancelled |
| AC-002 | Cancel Submitted request | An authenticated Employee owns a request in Submitted state | They call the cancel action | The system transitions the request state to Cancelled |
| AC-003 | Cancel of final-state request rejected | An authenticated Employee owns a request in Approved, Rejected, or Cancelled state | They attempt to cancel it | The system returns a clear error stating no further transitions are permitted from the current state |
| AC-004 | Cancel of another employee's request rejected | An authenticated Employee attempts to cancel a request owned by a different Employee | They call the cancel endpoint | The system returns a forbidden (403) error; the request state is unchanged |

**Business Rules:** BR-004 (only owner can cancel), BR-010 (Approved, Rejected, Cancelled are final)
**Dependencies:** US-004 (Create Draft Request)
**Sprint Assignment:** Sprint 2

---

### US-008: Manager Views Submitted Requests

**As a** Manager,
**I want to** see the list of Submitted requests assigned to me,
**So that** I can review pending requests and take an approval or rejection decision.

**Source Requirements:** FR-MRA-001, FR-LSE-007

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Manager sees only their Submitted requests | An authenticated Manager calls the manager-request-list endpoint | The request is processed | The system returns only the Submitted requests assigned to them; requests belonging to other managers are not included |
| AC-002 | Non-Submitted requests excluded | Requests in Draft, Approved, Rejected, or Cancelled state exist in the system | An authenticated Manager calls the list endpoint | None of the non-Submitted requests appear in the Manager review list |
| AC-003 | Employee cannot access Manager review list | An authenticated Employee attempts to call the manager-request-list endpoint | The request is processed | The system returns a forbidden (403) error |
| AC-004 | Empty queue returned correctly | No Submitted requests are assigned to the authenticated Manager | They call the list endpoint | The system returns an empty list without error |

**Business Rules:** BR-006 (only Manager role can approve/reject — enforced at this boundary too)
**Dependencies:** US-002 (User Login), US-006 (Submit Request — ensures Submitted requests exist)
**Sprint Assignment:** Sprint 3

---

### US-009: Approve Request

**As a** Manager,
**I want to** approve a Submitted request and optionally add a comment,
**So that** the request is marked Approved and exactly one Approval Record is created recording my authenticated identity as the responsible approver.

**Source Requirements:** FR-MRA-002, FR-MRA-004, FR-MRA-005, FR-MRA-006, FR-MRA-008, FR-LSE-005

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful approval without comment | An authenticated Manager calls the approve endpoint for a Submitted request they do not own | They submit the approval without a comment | The system transitions the request state to Approved, creates exactly one Approval Record containing the Manager's identity (from the session), the Approved decision, and a timestamp; the comment is null or empty |
| AC-002 | Successful approval with comment | An authenticated Manager approves a Submitted request and provides a comment | They submit the approval | The Approval Record is created with the Manager's identity, Approved decision, timestamp, and the provided comment |
| AC-003 | Approver identity derived from session | An authenticated Manager submits an approval payload that includes an explicit approver ID | They call the approve endpoint | The system ignores the supplied approver ID and records the approver as the authenticated Manager from the session |
| AC-004 | Manager cannot approve own request | An authenticated Manager attempts to approve a request that they themselves submitted as an Employee | They call the approve endpoint | The system returns an error preventing the action; no Approval Record is created and the state does not change |
| AC-005 | Non-Submitted request cannot be approved | A Manager attempts to approve a request in Draft, Approved, Rejected, or Cancelled state | They call the approve endpoint | The system returns an error stating only Submitted requests can be approved |
| AC-006 | Second approval decision rejected | A request already in the Approved state exists | A Manager attempts to approve it again | The system returns an error stating the request already has a final decision; no second Approval Record is created |
| AC-007 | Employee cannot approve | An authenticated Employee attempts to call the approve endpoint | The request is processed | The system returns a forbidden (403) error |

**Business Rules:** BR-005, BR-006, BR-008, BR-009, BR-011
**Dependencies:** US-008 (Manager Views Submitted Requests)
**Sprint Assignment:** Sprint 3

---

### US-010: Reject Request

**As a** Manager,
**I want to** reject a Submitted request and optionally add a comment,
**So that** the request is marked Rejected and exactly one Approval Record is created recording my authenticated identity and decision.

**Source Requirements:** FR-MRA-003, FR-MRA-004, FR-MRA-005, FR-MRA-006, FR-MRA-008, FR-LSE-005

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Successful rejection with comment | An authenticated Manager calls the reject endpoint for a Submitted request they do not own and provides a comment | They submit the rejection | The system transitions the request state to Rejected, creates exactly one Approval Record containing the Manager's identity (from the session), the Rejected decision, the comment, and a timestamp |
| AC-002 | Successful rejection without comment | An authenticated Manager rejects a Submitted request without a comment | They submit the rejection | The Approval Record is created with the Manager's identity, Rejected decision, and timestamp; the comment is null or empty |
| AC-003 | Approver identity derived from session | An authenticated Manager submits a rejection payload that includes an explicit approver ID | They call the reject endpoint | The system ignores the supplied approver ID and records the approver as the authenticated Manager from the session |
| AC-004 | Manager cannot reject own request | An authenticated Manager attempts to reject a request that they themselves submitted as an Employee | They call the reject endpoint | The system returns an error preventing the action; no Approval Record is created and the state does not change |
| AC-005 | Non-Submitted request cannot be rejected | A Manager attempts to reject a request in Draft, Approved, Rejected, or Cancelled state | They call the reject endpoint | The system returns an error stating only Submitted requests can be rejected |
| AC-006 | Second rejection decision rejected | A request already in the Rejected state exists | A Manager attempts to reject it again | The system returns an error stating the request already has a final decision; no second Approval Record is created |
| AC-007 | Employee cannot reject | An authenticated Employee attempts to call the reject endpoint | The request is processed | The system returns a forbidden (403) error |

**Business Rules:** BR-005, BR-006, BR-008, BR-009, BR-011
**Dependencies:** US-008 (Manager Views Submitted Requests)
**Sprint Assignment:** Sprint 3

---

### US-011: Employee Views Request List and Final Decision

**As an** Employee,
**I want to** view my own requests and their current state, including the final manager decision where one exists,
**So that** I know the outcome of each request I have submitted without requiring additional communication with my manager.

**Source Requirements:** FR-ARM-011, FR-LSE-006

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Employee sees only own requests | An authenticated Employee calls the list-requests endpoint | The request is processed | The system returns only requests owned by the authenticated Employee; requests belonging to other employees are never included |
| AC-002 | All states visible in list | An authenticated Employee has requests in various states (Draft, Submitted, Approved, Rejected, Cancelled) | They view their request list | All of their requests are displayed with their correct current state |
| AC-003 | Final decision details displayed | An authenticated Employee has a request in Approved or Rejected state | They view their request list | The response includes the decision outcome, the responsible approver's identity, and any decision comment |
| AC-004 | Another employee's requests not accessible | An authenticated Employee attempts to query another employee's requests by ID | They call the list or detail endpoint | The system returns only their own data; the other employee's request is not returned or returns a forbidden (403) error |
| AC-005 | Empty list returned correctly | An authenticated Employee has no requests | They call the list endpoint | The system returns an empty list without error |

**Business Rules:** BR-004 (only owner can act on own requests), BR-011 (identity from session)
**Dependencies:** US-002 (User Login), US-004 (Create Draft Request)
**Sprint Assignment:** Sprint 4

---

## 2. Should Have — Sprint 4

*These stories add meaningful value but are not blockers for go-live. They are deferred if Sprint 1–3 capacity is at risk.*

---

### US-012: List Absence Types

**As an** Employee,
**I want to** retrieve the available absence types from the API when creating a request,
**So that** I can select the correct classification for my absence from a system-controlled list.

**Source Requirements:** FR-ATC-001, FR-ATC-002, FR-ATC-003

**Deferral Justification:** Absence types (Vacation, Personal Leave, Sick Leave) are seeded at startup and the list endpoint is straightforward. The create-request flow (US-004) can operate with hardcoded type identifiers in Sprint 2 for MVP validation; the formal endpoint allowing the frontend to dynamically hydrate the dropdown is a UX improvement that does not block the core workflow. Absence types are seeded regardless of whether this endpoint is exercised.

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Seeded types present on startup | The application starts with a clean database | The seed process runs | Exactly three absence types exist: Vacation, Personal Leave, and Sick Leave |
| AC-002 | Authenticated user retrieves all types | An authenticated user (Employee or Manager) calls the absence-type list endpoint | The request is processed | The system returns all three seeded absence types |
| AC-003 | No create, edit, or delete endpoints exist | Any user attempts to call an endpoint to create, edit, or delete an absence type | The request is processed | The system returns a not-found (404) or method-not-allowed (405) response; no such endpoint exists |

**Business Rules:** FR-ATC-003 (catalog is fixed — no management UI)
**Dependencies:** US-002 (User Login)
**Sprint Assignment:** Sprint 4

---

### US-013: Get Current User Profile

**As an** Employee or Manager,
**I want to** retrieve my own profile information (name, email, role) from the API,
**So that** the web interface can display my identity without trusting frontend state or the login response payload alone.

**Source Requirements:** FR-AUTH-007

**Deferral Justification:** The frontend can display basic identity (name, role) from the login response in Sprint 1, satisfying the reviewer demo without a dedicated profile endpoint. The `GET /me` endpoint is an architectural best practice (avoiding frontend-trusted identity state) and directly supports the `ICurrentUserContext` design, but its absence does not block any core workflow scenario in the MVP review window.

**Acceptance Criteria:**

| # | Scenario | Given | When | Then |
|---|----------|-------|------|------|
| AC-001 | Authenticated user retrieves own profile | An authenticated Employee or Manager calls the current-user endpoint | The request is processed | The system returns the user's name, email, and role derived from the validated session cookie |
| AC-002 | Unauthenticated request rejected | An unauthenticated caller (no valid session cookie) calls the current-user endpoint | The request is processed | The system returns an unauthorized (401) response; no user data is returned |
| AC-003 | Identity is session-derived | An authenticated user calls the current-user endpoint | The request is processed | The returned identity matches the session claims, not any field from the request body |

**Business Rules:** BR-011 (identity derived from session)
**Dependencies:** US-002 (User Login)
**Sprint Assignment:** Sprint 4

---

## 3. Won't v1 — Explicitly Out of Scope

*These features are explicitly excluded from v1. Including them without a formal scope change is prohibited.*

| ID | Feature | Reason Excluded | Future Trigger |
|----|---------|-----------------|----------------|
| W-001 | Microsoft Entra ID and corporate single sign-on | Requires corporate identity infrastructure integration; explicitly excluded from MVP scope per SI-001 §4 | Evaluate when VacaFlow is hardened for broad company deployment |
| W-002 | Azure deployment and cloud hosting | MVP is designed for local execution from source code only; cloud infrastructure is out of scope per SI-001 §4 | Revisit when a decision is made to deploy VacaFlow broadly across the organisation |
| W-003 | Docker and CI/CD pipelines | Not required for local MVP validation; adds pipeline complexity not needed for workflow review per SI-001 §4 | Include in a post-MVP DevOps phase |
| W-004 | Email and Teams notifications | Requires email infrastructure setup and is explicitly deferred per SI-001 §4 | High priority for an operational version where users should not need to poll the application for status updates |
| W-005 | Password reset flow | Not needed during the MVP review window; manual database reset is acceptable per SI-001 §4 | Required before any production rollout |
| W-006 | Email verification on registration | Requires email infrastructure; out of scope for MVP per SI-001 §4 | Include alongside notification capability in a later phase |
| W-007 | Account administration screen | Manager accounts are handled via seed data; no admin UI is needed in the MVP per SI-001 §4 | Needed if non-technical staff must manage roles or create Manager accounts |
| W-008 | Vacation balance calculation | Adds leave policy complexity that is not required for workflow validation per SI-001 §4 | Consider after the approval workflow has been proven in operation |
| W-009 | Holiday calendars and working-day calculations | Introduces policy questions outside the MVP boundary; dates are calendar days only per SI-001 §4 | Relevant when balance or entitlement tracking is introduced |
| W-010 | Overlapping request validation | Adds scheduling policy decisions that are explicitly deferred per SI-001 §4 | Include when balance and scheduling rules are formalised |
| W-011 | Attachments and supporting documents | Requests carry no binary content; not required for the core approval workflow per SI-001 §4 | Consider if compliance or medical documentation requirements arise |
| W-012 | Reporting, dashboards, and data exports | No reporting requirement exists in the MVP per SI-001 §4 | Relevant for HR and management oversight in a broader deployment |
| W-013 | HR administration screens | The MVP is not an HR platform per SI-001 §4 | Evaluate if VacaFlow expands to cover HR workflows |
| W-014 | Multi-level approvals | Single-level Manager approval is sufficient for MVP; higher complexity is deferred per SI-001 §4 | Relevant for organisations with layered authorisation structures |
| W-015 | Approval delegation | Not part of the MVP workflow per SI-001 §4 | Useful for handling manager absence in an operational version |
| W-016 | Payroll, HR, calendar, and directory integrations | External integrations are entirely out of scope for the MVP per SI-001 §4 | Required for a production HR system |
| W-017 | Advanced audit trail beyond the Approval Record | The core Approval Record satisfies MVP traceability needs per SI-001 §4 | Needed for compliance in a production deployment |
| W-018 | Automated backups | SQLite is local; backup is a manual copy of the database file in the MVP per SI-001 §4 | Required for any cloud or production hosting scenario |
| W-019 | Multifactor authentication | Not needed for the limited internal MVP per SI-001 §4 | Required before broad deployment or any cloud-hosted version |

> **Rule:** No Won't v1 item may enter a sprint without a formal scope change request approved by Junior Gervacio (Product Owner) and the Business Sponsor.

---

## 4. Definition of Done (Global)

*All stories must meet these criteria before being marked "Done":*

- [ ] All acceptance criteria listed on the story are met and verified in the local execution environment (API started from source, Next.js web app started from source, SQLite database generated with seed data)
- [ ] Business rules enforced by the story — date validation (BR-001, BR-002), state transitions (BR-003, BR-005, BR-010), ownership checks (BR-004), role checks (BR-006, BR-007), self-approval guard (BR-008), approver recording (BR-009) — pass with both correct and incorrect inputs
- [ ] The API derives user identity from the authenticated session cookie; no employee ID or approver ID is trusted from the request body for any business decision (BR-011)
- [ ] Passwords are stored as BCrypt hashes; no plain-text credential appears in the database, logs, or source code
- [ ] Code has been peer-reviewed by at least one other team member
- [ ] At least the critical business-rule paths (date rules, state transitions, authorization checks) are covered by unit tests that pass; Application layer unit tests use in-memory fakes for `ICurrentUserContext`, `ITransactionService`, and repository interfaces — no `HttpContext` or `DbContext` required
- [ ] The feature runs correctly in the local execution environment without any external service configuration
- [ ] Invalid or unauthorized operations return clear, descriptive error responses and do not expose internal implementation details or stack traces
- [ ] The Product Owner (Junior Gervacio) has reviewed and accepted the story against the acceptance criteria in a sprint review
- [ ] No known blocking defects remain open against the story

---

## 5. Traceability to Functional Requirements Specification

| FR ID | Requirement Summary | Story ID | Priority |
|-------|---------------------|----------|----------|
| FR-AUTH-001 | Allow user registration with name, email, password, and role | US-001 | Must Have |
| FR-AUTH-002 | Restrict Manager role assignment via public self-registration | US-001 | Must Have |
| FR-AUTH-003 | Store passwords as cryptographic hashes | US-001 | Must Have |
| FR-AUTH-004 | Validate credentials and establish session on login | US-002 | Must Have |
| FR-AUTH-005 | Return generic error on invalid login (no enumeration) | US-002 | Must Have |
| FR-AUTH-006 | Terminate session on logout | US-003 | Must Have |
| FR-AUTH-007 | Current-user endpoint returning identity from session | US-013 | Should Have |
| FR-AUTH-008 | API derives identity from session; frontend must not supply trusted identifiers | US-002, US-004, US-009, US-010 | Must Have |
| FR-ATC-001 | Seed absence types: Vacation, Personal Leave, Sick Leave | US-012 | Should Have |
| FR-ATC-002 | Endpoint listing all available absence types | US-012 | Should Have |
| FR-ATC-003 | No UI or endpoint to create, edit, or delete absence types | US-012 | Should Have |
| FR-ARM-001 | Employee creates Draft request with absence type, dates, and reason | US-004 | Must Have |
| FR-ARM-002 | End date cannot be earlier than start date | US-004, US-005 | Must Have |
| FR-ARM-003 | Start date cannot be in the past | US-004, US-005 | Must Have |
| FR-ARM-004 | Employee can edit a Draft request | US-005 | Must Have |
| FR-ARM-005 | Only Draft requests are editable | US-005, US-006 | Must Have |
| FR-ARM-006 | Employee submits a Draft request → Submitted | US-006 | Must Have |
| FR-ARM-007 | Submitted request is read-only for the employee owner | US-006 | Must Have |
| FR-ARM-008 | Employee cancels Draft or Submitted request → Cancelled | US-007 | Must Have |
| FR-ARM-009 | Only request owner can edit, submit, or cancel | US-005, US-006, US-007 | Must Have |
| FR-ARM-010 | Owner inferred from authenticated session on create | US-004 | Must Have |
| FR-ARM-011 | Employee views own request list including final decision | US-011 | Must Have |
| FR-MRA-001 | Manager views only Submitted requests assigned to them | US-008 | Must Have |
| FR-MRA-002 | Manager approves Submitted request → Approved + one Approval Record | US-009 | Must Have |
| FR-MRA-003 | Manager rejects Submitted request → Rejected + one Approval Record | US-010 | Must Have |
| FR-MRA-004 | Optional comment on approval or rejection | US-009, US-010 | Must Have |
| FR-MRA-005 | Approver derived from authenticated session | US-009, US-010 | Must Have |
| FR-MRA-006 | Manager cannot approve or reject own request | US-009, US-010 | Must Have |
| FR-MRA-007 | Only Manager role can approve or reject | US-008, US-009, US-010 | Must Have |
| FR-MRA-008 | Each request has at most one Approval Record | US-009, US-010 | Must Have |
| FR-LSE-001 | Enforce valid state transitions only | US-006, US-009, US-010 | Must Have |
| FR-LSE-002 | Approved, Rejected, Cancelled are final states | US-007, US-009, US-010 | Must Have |
| FR-LSE-003 | Return clear error on invalid state transition | US-005, US-006, US-007, US-009, US-010 | Must Have |
| FR-LSE-004 | Only Draft requests can be edited | US-005, US-006 | Must Have |
| FR-LSE-005 | Only Submitted requests can be approved or rejected | US-009, US-010 | Must Have |
| FR-LSE-006 | Only request owner can edit, submit, or cancel | US-005, US-006, US-007, US-011 | Must Have |
| FR-LSE-007 | Only Manager role can approve or reject | US-008, US-009, US-010 | Must Have |

**FRS Coverage:** 37 of 37 functional requirements traced (100%)

---

## 6. Document Control

### Review & Approval

| Role | Name | Date | Status | Comments |
|------|------|------|--------|----------|
| Product Owner / BSA | Junior Gervacio | | Pending | |
| Tech Lead | | | Pending | |
| Business Sponsor | James Parker | | Pending | |

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Junior Gervacio (AI Assisted) | Initial backlog derived from FRS-001 and Software Architecture Document |

---

## 7. Next Steps

- [ ] Review backlog with Tech Lead for technical feasibility and sprint sizing confirmation — Target: 2026-07-27
- [ ] Confirm sprint velocity (3 stories/sprint) with the full team — Target: 2026-07-27
- [ ] Validate Won't v1 list with Business Sponsor (James Parker) — Target: 2026-07-27
- [ ] Confirm absence type seed values cover all needed types before Sprint 2 begins — Target: 2026-07-28
- [ ] Proceed to Roadmap (`/align/roadmap`) — Target: 2026-07-28
- [ ] Proceed to Work Breakdown Structure (`/planning/wbs`) after Roadmap is signed — Target: 2026-07-30

---

**Stage:** 05 — Planning

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Junior Gervacio (AI Assisted) |
| Approval Authority | Product Owner (PM_OVERRIDE — bypassed Product Owner) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 20:14:03 UTC |

*— End of document —*
