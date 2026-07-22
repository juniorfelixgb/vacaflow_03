# User Acceptance Testing Plan — VacaFlow_03

**Project:** VacaFlow_03
**Document ID:** UAT-001
**Phase:** 08 — Quality
**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Draft
**References:** FRS-001 (Functional Requirements Specification), TP-001 (Test Plan)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version |

---

## 1. UAT Overview

### 1.1 Purpose

This User Acceptance Testing Plan defines the strategy, scope, scenarios, and sign-off procedures through which the VacaFlow_03 review group validates that the absence request management application meets business requirements and is ready for MVP acceptance. UAT focuses exclusively on business workflow correctness as experienced by real users, complementing the technical and security testing already documented in TP-001.

### 1.2 Background

VacaFlow_03 replaces an informal absence management process conducted through email, Microsoft Teams messages, and ad-hoc spreadsheets at IGS Solutions. The application introduces a five-state request lifecycle (Draft → Submitted → Approved / Rejected / Cancelled), two roles (Employee and Manager), and a formal Approval Record that permanently ties every manager decision to the authenticated manager's identity. UAT is the final gate before the MVP is declared accepted for the bounded review window.

### 1.3 Objectives

- Validate that all key business workflows execute correctly end-to-end as experienced by Employees and Managers
- Confirm that business rule enforcement is visible and understandable to non-technical users
- Verify that role-based authorization prevents unauthorized operations without requiring technical knowledge to exploit
- Obtain formal written acceptance from the Business Sponsor (James Parker, Operations Manager)

### 1.4 Scope

**In Scope:**

| Business Workflow | Description |
|-------------------|-------------|
| User Registration and Login | Any person can register as an Employee; login is required to access the application |
| Absence Request Creation | Employee creates a Draft request specifying absence type, date range, and reason |
| Absence Request Editing | Employee edits a Draft request before submission |
| Absence Request Submission | Employee promotes a Draft request to Submitted state |
| Edit Prevention After Submission | System prevents Employees from editing Submitted, Approved, Rejected, or Cancelled requests |
| Absence Request Cancellation | Employee cancels a Draft or Submitted request |
| Manager Request View | Manager views all Submitted requests assigned to them |
| Manager Approval and Rejection | Manager approves or rejects a Submitted request with an optional comment |
| Authenticated Manager Recording | System records the authenticated manager's identity as the approver — not a frontend-supplied value |
| Employee Decision View | Employee views the final Approved or Rejected status and any comment |
| Business Rule Enforcement | System rejects invalid date ranges, past start dates, unauthorized operations, and self-approval attempts |

**Out of Scope:**

| Area | Rationale |
|------|-----------|
| Infrastructure and deployment testing | Completed in infrastructure and DevOps phases |
| Performance and load testing | No concurrent-scale targets for MVP; covered in TP-001 §2.2 |
| Security penetration testing | Completed in QA Cycle 2 per TP-001 |
| Usability heuristic evaluation | Completed by QA team per TP-001 §2.2 |
| Microsoft Entra ID / SSO | Excluded from MVP per FRS-001 §6 OS-001 |
| Email and Teams notifications | No notification infrastructure in MVP per FRS-001 §6 OS-004 |
| Vacation balance calculations | Out of MVP scope per FRS-001 §6 OS-007 |
| Reporting and data exports | No analytics layer in MVP per FRS-001 §6 OS-011 |

---

## 2. UAT Schedule

### 2.1 Timeline

| Phase | Start | End | Duration |
|-------|-------|-----|----------|
| UAT Preparation | 2026-07-21 | 2026-07-21 | 1 day |
| UAT Execution | 2026-07-21 | 2026-07-22 | 2 days |
| Defect Resolution (if any) | 2026-07-22 | 2026-07-22 | 1 day |
| Re-testing and Sign-off | 2026-07-22 | 2026-07-22 | 1 day |

### 2.2 Key Milestones

| Milestone | Date | Owner |
|-----------|------|-------|
| UAT environment verified and stable | 2026-07-21 | QA Lead |
| UAT scenarios distributed to testers | 2026-07-21 | QA Lead |
| UAT execution begins | 2026-07-21 | Review Group |
| UAT execution complete | 2026-07-22 | Review Group |
| All Critical / High blockers resolved or accepted | 2026-07-22 | Development Support |
| Formal sign-off from Business Sponsor | 2026-07-22 | James Parker |

---

## 3. UAT Team

### 3.1 Roles and Responsibilities

| Role | Name | Responsibilities |
|------|------|------------------|
| Business Sponsor (Final Authority) | James Parker (Operations Manager) | Provides final written acceptance; confirms the workflow meets operational needs |
| Supporting Manager Tester | To be identified by James Parker | Executes Manager-role scenarios; validates approval and rejection workflow |
| Supporting Employee Tester | To be identified by James Parker | Executes Employee-role scenarios; validates request lifecycle from an employee perspective |
| UAT Lead | Yeuri Jessel Reyes (QA Lead) | Coordinates UAT activities; supports environment setup; reviews defects; manages sign-off |
| Technical Support | Development Team | Resolves Critical and High defects identified during UAT; provides environment support |

### 3.2 RACI Matrix

| Activity | Business Sponsor | Supporting Testers | UAT Lead | Tech Support |
|----------|:----------------:|:-----------------:|:--------:|:------------:|
| UAT Planning | A | I | R | I |
| Environment Setup | I | I | C | R |
| Test Scenario Review | A | C | R | I |
| Test Execution | I | R | C | I |
| Defect Logging | I | R | C | I |
| Defect Fix | I | I | I | R |
| Re-testing | I | R | C | I |
| Final Sign-off | A/R | C | C | I |

---

## 4. Entry Criteria

Before UAT execution begins, the following must be confirmed:

| Criterion | Owner | Status |
|-----------|-------|--------|
| System testing (Cycle 1 and Cycle 2) completed with overall pass rate ≥ 95% per TP-001 §4.3 | QA Lead | To be confirmed |
| Zero open Critical defects from QA testing cycles | QA Lead | To be confirmed |
| Zero open High defects that block the core review workflow | QA Lead | To be confirmed |
| UAT environment deployed from a fresh clone and verified stable | QA Lead | To be confirmed |
| SQLite database initialized with seeded absence types and at least one Manager account | QA Lead | To be confirmed |
| Seeded account credentials documented and accessible to testers | QA Lead | To be confirmed |
| UAT scenarios reviewed and distributed to testers | UAT Lead | To be confirmed |
| Business Sponsor has confirmed participant availability | James Parker | To be confirmed |

---

## 5. UAT Scenarios

### 5.1 Scenario Overview

| ID | Scenario | Business Workflow | Priority | Tester Role |
|----|----------|-------------------|----------|-------------|
| UAT-001 | User Registration | Registration and Login | High | Employee Tester |
| UAT-002 | User Login | Registration and Login | High | Employee Tester |
| UAT-003 | Create a Draft Absence Request | Request Lifecycle | High | Employee Tester |
| UAT-004 | Edit a Draft Absence Request | Request Lifecycle | High | Employee Tester |
| UAT-005 | Submit a Draft Request | Request Lifecycle | High | Employee Tester |
| UAT-006 | Verify Edit Prevention After Submission | Business Rule Enforcement | High | Employee Tester |
| UAT-007 | Cancel a Draft Request | Request Lifecycle | High | Employee Tester |
| UAT-008 | Cancel a Submitted Request | Request Lifecycle | High | Employee Tester |
| UAT-009 | Manager Login and View of Submitted Requests | Manager Workflow | High | Manager Tester |
| UAT-010 | Manager Approves a Request | Manager Workflow | High | Manager Tester |
| UAT-011 | Manager Rejects a Request with Comment | Manager Workflow | High | Manager Tester |
| UAT-012 | System Records Authenticated Manager as Approver | Business Rule Enforcement | High | Manager Tester |
| UAT-013 | Employee Views Final Decision | Request Lifecycle | High | Employee Tester |
| UAT-014 | Date Range Validation — End Before Start | Business Rule Enforcement | High | Employee Tester |
| UAT-015 | Date Validation — Past Start Date | Business Rule Enforcement | High | Employee Tester |
| UAT-016 | Role Authorization — Non-Manager Cannot Approve | Business Rule Enforcement | High | Employee Tester |
| UAT-017 | Ownership Enforcement — Employee Cannot Operate on Another's Request | Business Rule Enforcement | High | Employee Tester |
| UAT-018 | Manager Cannot Approve Own Request | Business Rule Enforcement | High | Manager Tester |

### 5.2 Detailed Scenarios

---

#### UAT-001: User Registration

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-001 |
| **Business Workflow** | Registration and Login |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-AUTH-001, FR-AUTH-002; TP-001 |

**Business Objective:**
Verify that any person can register a new Employee account using the public registration form and that no elevated role can be assigned through this form.

**Preconditions:**
- UAT environment is accessible
- No existing account with the test email

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the application in the browser | Login or registration page is displayed |
| 2 | Select the option to register a new account | Registration form is displayed |
| 3 | Enter a full name, email address, and password meeting the stated requirements | Fields accept the input without error |
| 4 | Submit the registration form | Account is created and the user is taken to the application |
| 5 | Confirm the account is created as an Employee role | The user does not have access to Manager-only functions |

**Acceptance Criteria:**

- [ ] Registration completes without errors using valid input
- [ ] Registered account receives Employee role — Manager role cannot be self-assigned via registration
- [ ] The user can access the application immediately after registration

**Test Data:**
- Name: UAT Employee One
- Email: uat.employee1@vacaflow.test
- Password: (any password meeting the documented policy)

**Result:**
- [ ] PASS — Scenario works as expected
- [ ] FAIL — Issues found (see UAT Defect Log)
- [ ] BLOCKED — Cannot execute (reason: )

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-002: User Login

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-002 |
| **Business Workflow** | Registration and Login |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 5 minutes |
| **References** | FRS-001 FR-AUTH-003, FR-AUTH-004; TP-001 |

**Business Objective:**
Verify that a registered user can log in with correct credentials and is denied access with incorrect credentials.

**Preconditions:**
- UAT-001 completed successfully or seeded Employee account available

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the login page | Login form is displayed |
| 2 | Enter correct email and password | Credentials accepted |
| 3 | Submit the login form | User is authenticated and redirected to their dashboard |
| 4 | Log out of the application | Session is ended; login page is displayed |
| 5 | Attempt to log in with an incorrect password | Login is rejected with an appropriate error message; account is not exposed |

**Acceptance Criteria:**

- [ ] Login succeeds with valid credentials
- [ ] Login is rejected with invalid credentials
- [ ] Logout ends the session and requires re-authentication to access the application again

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-003: Create a Draft Absence Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-003 |
| **Business Workflow** | Absence Request Creation |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-001, FR-ARM-002, FR-ARM-003; TP-001 |

**Business Objective:**
Verify that an authenticated Employee can create a new absence request in Draft state by selecting an absence type, providing a valid future date range, and supplying a reason.

**Preconditions:**
- Employee is logged in
- At least one absence type is available in the system

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the section for creating a new absence request | Request creation form is displayed |
| 2 | Select an absence type from the available list | Absence type is selected |
| 3 | Enter a start date that is today or in the future | Date is accepted |
| 4 | Enter an end date that is on or after the start date | Date is accepted |
| 5 | Enter a reason for the absence | Reason field accepts the input |
| 6 | Submit the form to create the request | Request is created with Draft status and appears in the employee's request list |

**Acceptance Criteria:**

- [ ] A new Draft request is created with the correct absence type, date range, and reason
- [ ] The request appears in the employee's request list with Draft status
- [ ] The creation date is recorded correctly

**Test Data:**
- Absence Type: (select first available type)
- Start Date: 2026-07-28
- End Date: 2026-07-30
- Reason: Annual rest — UAT test request

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-004: Edit a Draft Absence Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-004 |
| **Business Workflow** | Absence Request Editing |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-004, FR-ARM-005; TP-001 |

**Business Objective:**
Verify that an Employee can modify a Draft request — changing the absence type, dates, or reason — and that the changes are saved correctly.

**Preconditions:**
- Employee is logged in
- A Draft request exists (created in UAT-003 or a separate Draft request)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the request list and select the Draft request | Request details are displayed with an edit option available |
| 2 | Open the edit view for the request | Editable form is displayed with current values pre-populated |
| 3 | Change the end date to a later date | New end date is accepted |
| 4 | Update the reason text | Reason field reflects the updated text |
| 5 | Save the changes | Request is updated and the new values are shown in the request detail view |

**Acceptance Criteria:**

- [ ] Draft request can be opened for editing
- [ ] Changes to date and reason are saved correctly
- [ ] The request remains in Draft status after editing

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-005: Submit a Draft Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-005 |
| **Business Workflow** | Absence Request Submission |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-006, FR-ARM-007, FR-LSE-003; TP-001 |

**Business Objective:**
Verify that an Employee can submit a Draft request, transitioning it to Submitted status and making it visible to Managers for review.

**Preconditions:**
- Employee is logged in
- A Draft request exists with valid data

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the Draft request | Request details are displayed with a submit option |
| 2 | Select the option to submit the request | Confirmation or direct state transition occurs |
| 3 | Confirm the submission | Request transitions to Submitted status |
| 4 | Verify the request status in the employee's request list | Request is listed with Submitted status |

**Acceptance Criteria:**

- [ ] Draft request transitions to Submitted status after the submit action
- [ ] The Submitted request appears in the employee's request list with the correct status
- [ ] The submission action is no longer available once the request is Submitted

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-006: Verify Edit Prevention After Submission

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-006 |
| **Business Workflow** | Business Rule Enforcement |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-004, FR-ARM-005, FR-LSE-004, BR-003; TP-001 |

**Business Objective:**
Verify that the system prevents an Employee from editing a request that is no longer in Draft status, ensuring data integrity throughout the approval process.

**Preconditions:**
- Employee is logged in
- A Submitted request exists (created in UAT-005)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the Submitted request | Request details are displayed |
| 2 | Attempt to find or invoke an edit option on the Submitted request | No edit option is available; or if attempted, the system rejects the operation with a clear message |
| 3 | Attempt to change the date range directly (if any edit path is accessible) | System rejects the change and returns an appropriate error |

**Acceptance Criteria:**

- [ ] No edit option is presented to the employee for a Submitted request
- [ ] Any attempt to edit a Submitted request is rejected by the system
- [ ] The rejection message is clear and understandable

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-007: Cancel a Draft Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-007 |
| **Business Workflow** | Absence Request Cancellation |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-008, FR-ARM-009, FR-LSE-002, BR-010; TP-001 |

**Business Objective:**
Verify that an Employee can cancel a Draft request, transitioning it to Cancelled status, and that Cancelled is a final state.

**Preconditions:**
- Employee is logged in
- A Draft request exists (create a new one for this scenario to preserve others)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to a Draft request | Request details are displayed with a cancel option |
| 2 | Select the cancel option | Confirmation prompt or direct transition occurs |
| 3 | Confirm the cancellation | Request transitions to Cancelled status |
| 4 | Verify no further actions (edit, submit, cancel) are available | Request shows Cancelled status with no actionable options |

**Acceptance Criteria:**

- [ ] Draft request transitions to Cancelled status
- [ ] Cancelled request cannot be edited, submitted, re-cancelled, or reverted to Draft
- [ ] Cancelled request remains visible in the employee's request list for reference

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-008: Cancel a Submitted Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-008 |
| **Business Workflow** | Absence Request Cancellation |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-008, FR-LSE-002, BR-010; TP-001 |

**Business Objective:**
Verify that an Employee can cancel a Submitted request before a Manager has acted on it.

**Preconditions:**
- Employee is logged in
- A Submitted request exists that has not yet been approved or rejected

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the Submitted request | Request details are displayed |
| 2 | Select the cancel option for the Submitted request | System presents the cancellation option |
| 3 | Confirm the cancellation | Request transitions to Cancelled status |
| 4 | Verify the request is no longer visible to the Manager for approval | Manager's review list no longer includes the cancelled request |

**Acceptance Criteria:**

- [ ] Submitted request can be cancelled by the owning Employee
- [ ] Cancelled request transitions out of the Manager's review queue
- [ ] Cancelled status is final — no further state changes are possible

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-009: Manager Login and View of Submitted Requests

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-009 |
| **Business Workflow** | Manager Workflow |
| **Priority** | High |
| **Tester Role** | Manager Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-MRA-001, FR-MRA-007; TP-001 |

**Business Objective:**
Verify that a Manager can log in and view the list of Submitted absence requests that require their review, and that Employee-role users do not see this view.

**Preconditions:**
- Manager account credentials are available (seeded or pre-created)
- At least one Submitted request exists (created in UAT-005 or UAT-008)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Log in with Manager credentials | Manager is authenticated and reaches their dashboard |
| 2 | Navigate to the Manager review section | List of Submitted requests assigned for review is displayed |
| 3 | Verify the Submitted request from the Employee tester appears | Request is visible with correct details (employee name, dates, absence type, reason) |
| 4 | Confirm that requests in other states (Draft, Cancelled) are not shown in the pending review list | Only Submitted requests are shown in the approval queue |

**Acceptance Criteria:**

- [ ] Manager can log in and access the review queue
- [ ] All Submitted requests requiring review are visible
- [ ] Request details (employee, dates, type, reason) are accurate
- [ ] Requests in non-Submitted states are not mixed into the approval queue

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-010: Manager Approves a Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-010 |
| **Business Workflow** | Manager Approval |
| **Priority** | High |
| **Tester Role** | Manager Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-MRA-002, FR-MRA-004, FR-MRA-005, FR-MRA-008, BR-005, BR-006, BR-009; TP-001 |

**Business Objective:**
Verify that a Manager can approve a Submitted request, that the request transitions to Approved status, and that an optional comment can be included.

**Preconditions:**
- Manager is logged in
- At least one Submitted request exists in the review queue (ensure it belongs to a different user — see UAT-018 for self-approval enforcement)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the review queue and select a Submitted request | Request details are displayed with approve and reject options |
| 2 | Optionally enter an approval comment | Comment field accepts the text |
| 3 | Select the Approve action | Request transitions to Approved status |
| 4 | Verify the request is no longer in the pending review queue | Request is removed from the Submitted queue |
| 5 | Verify the request status is now Approved | Request detail shows Approved status and the optional comment |

**Acceptance Criteria:**

- [ ] Manager can approve a Submitted request
- [ ] Request transitions to Approved status
- [ ] Optional comment is recorded and visible
- [ ] Approved request is removed from the Manager's pending queue
- [ ] Approval action is no longer available once the request is Approved (Approved is a final state)

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-011: Manager Rejects a Request with Comment

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-011 |
| **Business Workflow** | Manager Rejection |
| **Priority** | High |
| **Tester Role** | Manager Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-MRA-003, FR-MRA-004, FR-MRA-005, FR-MRA-008, BR-005, BR-006, BR-009; TP-001 |

**Business Objective:**
Verify that a Manager can reject a Submitted request with an explanatory comment, and that the request transitions to Rejected status as a final state.

**Preconditions:**
- Manager is logged in
- A Submitted request exists in the review queue (different from the one approved in UAT-010; create a new submission if needed)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to a Submitted request in the review queue | Request details and action options are displayed |
| 2 | Enter a rejection comment (e.g., "Dates conflict with team availability") | Comment field accepts the text |
| 3 | Select the Reject action | Request transitions to Rejected status |
| 4 | Verify the request is removed from the pending queue | Manager's review list no longer includes this request |
| 5 | Verify the request status is now Rejected with the comment | Request detail shows Rejected status and the comment |

**Acceptance Criteria:**

- [ ] Manager can reject a Submitted request
- [ ] Rejection comment is saved and visible on the request
- [ ] Request transitions to Rejected status
- [ ] Rejected is a final state — no further transitions are possible

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-012: System Records Authenticated Manager as Approver

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-012 |
| **Business Workflow** | Authenticated Manager Recording |
| **Priority** | High |
| **Tester Role** | Manager Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-MRA-005, FR-AUTH-008, FR-ARM-010, BR-009, BR-011; TP-001 |

**Business Objective:**
Verify that the system records the identity of the authenticated Manager who approved or rejected a request — derived from the server-side session — and that this identity cannot be spoofed or substituted by a frontend-supplied value.

**Preconditions:**
- Manager is logged in
- A request was approved or rejected in UAT-010 or UAT-011

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the detail view of a request that has been Approved or Rejected | Request details are displayed |
| 2 | Review the recorded approver identity | The approver shown matches the Manager who is currently logged in and performed the action |
| 3 | Confirm the approver identity was not supplied by the user interface | QA Lead verifies with the technical team (or via database inspection if access is available) that the approver field is populated from the server-side session, not a form field |

**Acceptance Criteria:**

- [ ] The approver identity displayed on an Approved or Rejected request matches the authenticated Manager who performed the action
- [ ] The system does not expose an editable field for the approver identity during approval or rejection
- [ ] No mechanism exists in the UI to supply a different approver identity than the logged-in user

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-013: Employee Views Final Decision

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-013 |
| **Business Workflow** | Employee Decision View |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-009, FR-MRA-004; TP-001 |

**Business Objective:**
Verify that an Employee can see the final Approved or Rejected status of their request, including any comment left by the Manager, after the Manager has acted.

**Preconditions:**
- Employee is logged in
- At least one of the employee's requests has been Approved (UAT-010) and one Rejected (UAT-011)

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the employee's request list | All requests are displayed with their current status |
| 2 | Select the Approved request | Request detail shows Approved status and the Manager's comment (if any) |
| 3 | Select the Rejected request | Request detail shows Rejected status and the Manager's rejection comment |
| 4 | Confirm the employee cannot take any further action on Approved or Rejected requests | No edit, submit, or cancel options are available for final-state requests |

**Acceptance Criteria:**

- [ ] Employee can see Approved and Rejected status clearly
- [ ] Manager's comment (if provided) is visible to the employee on a Rejected request
- [ ] No further actions are available to the employee on requests in final states

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-014: Date Range Validation — End Date Before Start Date

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-014 |
| **Business Workflow** | Business Rule Enforcement |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-002, BR-001; TP-001 |

**Business Objective:**
Verify that the system rejects an absence request where the end date is before the start date, and that the error message is clear to the user.

**Preconditions:**
- Employee is logged in

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the new absence request form | Form is displayed |
| 2 | Enter a start date of 2026-07-30 | Start date is accepted |
| 3 | Enter an end date of 2026-07-28 (before the start date) | The form or system indicates an error |
| 4 | Attempt to submit the request | Request is rejected with a clear message explaining the date range is invalid |

**Acceptance Criteria:**

- [ ] System rejects requests where end date is before start date
- [ ] Error message is clear, plain-language, and understandable without technical knowledge
- [ ] No invalid request is created in the system

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-015: Date Validation — Past Start Date

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-015 |
| **Business Workflow** | Business Rule Enforcement |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-003, BR-002; TP-001 |

**Business Objective:**
Verify that the system rejects an absence request where the start date is in the past.

**Preconditions:**
- Employee is logged in

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Navigate to the new absence request form | Form is displayed |
| 2 | Enter a start date of 2026-07-01 (in the past) | Form or system indicates an error |
| 3 | Enter an end date of 2026-07-05 | Date is entered |
| 4 | Attempt to submit the request | Request is rejected with a message indicating the start date cannot be in the past |

**Acceptance Criteria:**

- [ ] System rejects requests with a past start date
- [ ] Error message is clear and actionable
- [ ] No invalid request is created in the system

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-016: Role Authorization — Non-Manager Cannot Approve

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-016 |
| **Business Workflow** | Business Rule Enforcement |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-MRA-007, BR-006; TP-001 |

**Business Objective:**
Verify that an Employee-role user cannot access the Manager review queue or approve / reject any request, confirming that approval authority is restricted to Manager accounts.

**Preconditions:**
- Employee is logged in
- At least one Submitted request exists

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Log in as an Employee | Employee dashboard is displayed |
| 2 | Attempt to navigate to the Manager review section | Section is not accessible; no approval or rejection options are presented |
| 3 | Attempt to invoke an approve or reject action directly (e.g., via a known URL if provided) | System returns an authorization error; the action is not performed |

**Acceptance Criteria:**

- [ ] Employee-role users have no access to the Manager review queue in the UI
- [ ] Any attempt to invoke approval or rejection actions as an Employee is rejected by the system
- [ ] The rejection response does not expose sensitive system details

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-017: Ownership Enforcement — Employee Cannot Operate on Another User's Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-017 |
| **Business Workflow** | Business Rule Enforcement |
| **Priority** | High |
| **Tester Role** | Employee Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-ARM-004, FR-ARM-006, FR-ARM-008, FR-LSE-006, BR-004; TP-001 |

**Business Objective:**
Verify that an Employee can only view and act on their own requests and cannot edit, submit, or cancel a request owned by another Employee.

**Preconditions:**
- Two Employee accounts exist (Employee Tester and a second account — can be created during this scenario or pre-seeded)
- At least one Draft or Submitted request belonging to the second Employee account exists

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Log in as Employee Tester (Account A) | Employee A's dashboard is displayed |
| 2 | Verify that only Employee A's requests are shown in the request list | No requests from Employee B are visible |
| 3 | Attempt to access or act on a request owned by Employee B (e.g., via a known request ID) | System returns an authorization error; the request is not accessible or modifiable |

**Acceptance Criteria:**

- [ ] Employees see only their own requests in the request list
- [ ] Any attempt to operate on another employee's request is rejected
- [ ] No data from other employees is exposed

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

#### UAT-018: Manager Cannot Approve or Reject Own Request

| Field | Value |
|-------|-------|
| **Scenario ID** | UAT-018 |
| **Business Workflow** | Business Rule Enforcement |
| **Priority** | High |
| **Tester Role** | Manager Tester |
| **Estimated Duration** | 10 minutes |
| **References** | FRS-001 FR-MRA-006, BR-008; TP-001 |

**Business Objective:**
Verify that a user with the Manager role cannot approve or reject an absence request that they themselves submitted, preventing conflict-of-interest approvals.

**Preconditions:**
- Manager account is logged in
- The Manager has previously submitted an absence request as an employee-like action, or a Submitted request owned by the Manager account exists

**Scenario Steps:**

| Step | Business Action | Expected Business Outcome |
|------|-----------------|---------------------------|
| 1 | Log in as the Manager | Manager dashboard is displayed |
| 2 | Navigate to the Manager review queue | Submitted requests are listed |
| 3 | Identify whether any request in the queue belongs to the logged-in Manager | If such a request appears, attempt to approve it |
| 4 | Attempt to approve or reject a request owned by the logged-in Manager | System rejects the action with a clear message indicating self-approval is not permitted |

**Acceptance Criteria:**

- [ ] The system prevents a Manager from approving or rejecting their own Submitted request
- [ ] An appropriate error message is displayed
- [ ] No Approval Record is created for the self-approval attempt

**Result:**
- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

**Tester Notes:**

**Tester Sign-off:**
Name: _________________ Date: _________ Signature: _________________

---

## 6. Defect Management

### 6.1 Defect Process

1. Tester identifies an issue during scenario execution
2. Tester documents the issue with reproduction steps and attaches it to the UAT Defect Log (§6.3)
3. UAT Lead reviews, assigns severity, and communicates to Technical Support
4. Technical Support resolves Critical and High defects within the UAT window
5. Tester re-executes the affected scenario to verify the fix
6. UAT Lead confirms resolution before proceeding to sign-off

### 6.2 Defect Severity for UAT

| Severity | Definition | Action Before Sign-off |
|----------|------------|------------------------|
| Critical | A business workflow cannot be completed or a business rule is violated | Must be fixed and re-tested before sign-off is granted |
| High | A workflow step cannot be completed but a partial workaround exists; the system behaves unexpectedly in a significant way | Must be fixed and re-tested before sign-off is granted |
| Medium | Minor impact; the workflow can be completed but behavior is suboptimal or an error message is unclear | Must be documented; Business Sponsor decides whether to accept or require a fix |
| Low | Cosmetic issue with no functional impact | Documented for post-MVP backlog; does not block sign-off |

### 6.3 UAT Defect Log

| ID | Scenario | Description | Severity | Status | Tester | Date Found | Resolution |
|----|----------|-------------|----------|--------|--------|------------|------------|
| (None at plan issuance) | | | | | | | |

---

## 7. Exit Criteria

UAT is complete and sign-off may be granted when all of the following are satisfied:

| Criterion | Target | Status |
|-----------|--------|--------|
| All 18 UAT scenarios executed | 100% | Pending |
| High-priority scenario pass rate | 100% | Pending |
| Zero open Critical defects | 0 | Pending |
| Zero open High defects | 0 | Pending |
| All Medium defects documented and accepted or resolved | Yes | Pending |
| All 14 MVP acceptance criteria demonstrated to the Business Sponsor | 14/14 | Pending |
| Business Sponsor written sign-off obtained | Yes | Pending |

---

## 8. MVP Acceptance Criteria Demonstration Checklist

The following 14 items must be demonstrated to the Business Sponsor (James Parker) before final sign-off is granted. Each item corresponds directly to the stated MVP acceptance criteria:

| # | Demonstration Item | Scenario(s) | Demonstrated | Accepted by Sponsor |
|---|-------------------|-------------|:------------:|:-------------------:|
| 1 | Registering a new user | UAT-001 | [ ] | [ ] |
| 2 | Logging in | UAT-002 | [ ] | [ ] |
| 3 | Creating a Draft absence request | UAT-003 | [ ] | [ ] |
| 4 | Rejecting an invalid date range (end before start) | UAT-014 | [ ] | [ ] |
| 5 | Rejecting a past start date | UAT-015 | [ ] | [ ] |
| 6 | Editing a Draft request | UAT-004 | [ ] | [ ] |
| 7 | Submitting a request | UAT-005 | [ ] | [ ] |
| 8 | Preventing edits after submission | UAT-006 | [ ] | [ ] |
| 9 | Logging in as a Manager | UAT-009 | [ ] | [ ] |
| 10 | Viewing Submitted requests assigned to the Manager | UAT-009 | [ ] | [ ] |
| 11 | Approving or rejecting with a comment | UAT-010, UAT-011 | [ ] | [ ] |
| 12 | Recording the authenticated Manager as the responsible approver | UAT-012 | [ ] | [ ] |
| 13 | Showing the final decision to the Employee | UAT-013 | [ ] | [ ] |
| 14 | Blocking unauthorized operations (non-managers cannot approve; users cannot operate on requests they do not own; logged-in identity cannot be bypassed) | UAT-016, UAT-017, UAT-018 | [ ] | [ ] |

---

## 9. UAT Sign-off Form

### Project: VacaFlow_03
### Release: MVP v1.0
### UAT Period: 2026-07-21 to 2026-07-22

---

### Summary of Testing

| Metric | Value |
|--------|-------|
| Scenarios Planned | 18 |
| Scenarios Executed | (to be completed) |
| Scenarios Passed | (to be completed) |
| Scenarios Failed | (to be completed) |
| Pass Rate | (to be completed) |

### Defect Summary

| Severity | Found | Fixed | Open | Accepted Without Fix |
|----------|-------|-------|------|----------------------|
| Critical | | | | N/A |
| High | | | | N/A |
| Medium | | | | |
| Low | | | | |

### Known Issues Going Live

| ID | Description | Workaround | Target Fix Release |
|----|-------------|------------|-------------------|
| None at plan issuance | | | |

---

### Acceptance Declaration

I confirm that:

- [ ] I have participated in or observed the UAT execution
- [ ] The system has been demonstrated to meet the 14 MVP acceptance criteria listed in §8
- [ ] Known issues (if any) are documented and acceptable for the bounded review window
- [ ] The system is accepted for the MVP review phase

**Business Sponsor Acceptance:**

Name: James Parker

Title: Operations Manager, IGS Solutions

Signature: _________________________________

Date: _________________________________

---

**Additional Stakeholder Sign-off (if required):**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | Yeuri Jessel Reyes | | |
| Supporting Manager Tester | | | |
| Supporting Employee Tester | | | |

---

## 10. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | Yeuri Jessel Reyes | | Pending |
| Business Sponsor | James Parker | | Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | QA Lead (PM_OVERRIDE — bypassed QA Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:44:49 UTC |

*— End of document —*
