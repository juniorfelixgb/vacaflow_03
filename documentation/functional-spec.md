# Functional Requirements Specification

**Project:** VacaFlow_03
**Document ID:** FRS-001
**Stage:** 02 — Define
**Author:** Junior Gervacio (AI Assisted)
**PO/BSA:** Junior Gervacio
**Related SI:** SI-001
**Date:** 2026-07-20
**Version:** 1.0
**Status:** Draft

---

## 1. System Overview

### 1.1 Purpose

VacaFlow is a locally executable internal web application that gives IGS Solutions employees and managers a single, structured place to submit, track, and decide on absence requests. The system replaces an informal process — conducted through email, Microsoft Teams chat messages, and ad-hoc spreadsheets — that produced no authoritative record of decisions, no clear approval responsibility, and recurring status-confirmation overhead for managers. Every manager decision is recorded against the authenticated decision-maker's identity, and every employee can view the current lifecycle state of their own requests directly in the application without additional communication.

### 1.2 Scope

VacaFlow covers the complete absence request lifecycle from employee registration through manager approval or rejection, running locally from source code. It includes application-managed local authentication (email and hashed password), two roles (Employee and Manager), a five-state request lifecycle (Draft, Submitted, Approved, Rejected, Cancelled), a fixed seeded catalog of absence types, and a manager review workflow that records the authenticated approver for every decision.

Excluded from this version: Microsoft Entra ID / SSO, Azure deployment, Docker, CI/CD pipelines, email or Teams notifications, password reset, account administration screens, vacation balance calculations, holiday calendars, overlapping request validation, file attachments, reporting and exports, HR administration, multi-level approvals, integrations with external systems, and advanced audit trails.

### 1.3 Definitions

| Term | Definition |
|------|------------|
| Draft | Initial state of a new absence request; editable by the owner |
| Submitted | State after an employee submits a Draft request; read-only for the employee; awaits manager action |
| Approved | Final state after a Manager approves a Submitted request |
| Rejected | Final state after a Manager rejects a Submitted request |
| Cancelled | Final state after the request owner cancels a Draft or Submitted request |
| Approval Record | A single persisted record that captures the authenticated Manager's identity, the decision (Approved or Rejected), an optional comment, and the timestamp |
| Authenticated Session | Server-managed session or token from which the API derives the current user's identity for all business decisions |
| Seed Data | Initial database records inserted at application startup (absence types, Manager accounts) |
| MVP | Minimum Viable Product — the bounded scope defined in SI-001 for local review and workflow validation |
| Onion Architecture | Reduced layered architecture (Domain, Application, Infrastructure, API, Web) used for this project; no MediatR, CQRS, generic repositories, or messaging frameworks |

---

## 2. User Roles & Personas

| Role ID | Role Name | Description | Access Level |
|---------|-----------|-------------|--------------|
| UR-01 | Employee | Registers and logs in via public registration. Creates, edits, submits, and cancels their own absence requests. Views the lifecycle state and final decision on each of their requests. Cannot access other employees' requests or perform manager actions. | Write (own requests only) |
| UR-02 | Manager | Account created through seed data or controlled setup; cannot self-register via the public endpoint. Logs in and views only Submitted requests assigned to them. Approves or rejects Submitted requests with an optional comment. Cannot approve or reject their own requests. | Write (decisions on assigned Submitted requests only) |

---

## 3. Functional Requirements

> Requirements are grouped by feature/module.
> Format: FR-[Feature Code]-[###]
> Priority: Must Have | Should Have | Won't v1

---

### 3.1 User Registration and Login

**Feature Description:** Application-managed local authentication allowing users to register and log in with email and password. Supports session establishment, logout, and current-user identity retrieval. Two roles exist: Employee (self-registerable) and Manager (seed/controlled setup only).

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-AUTH-001 | The system shall allow a user to register with a name, email address, password, and role selection, creating a new account. | Must Have | Public self-registration only |
| FR-AUTH-002 | The system shall restrict public self-registration so that a user cannot assign themselves the Manager role; only the Employee role is selectable during public registration. | Must Have | Manager role created via seed data or controlled setup only |
| FR-AUTH-003 | The system shall store all passwords as cryptographic hashes; plain-text password storage is not permitted under any path. | Must Have | Security constraint from SI-001 §5 |
| FR-AUTH-004 | The system shall validate submitted credentials (email and password) during login and establish an authenticated session or issue a token on success. | Must Have | |
| FR-AUTH-005 | The system shall return a clear error response when login credentials are invalid, without disclosing whether the email or password was incorrect. | Should Have | Prevents account enumeration |
| FR-AUTH-006 | The system shall terminate the authenticated session or invalidate the token on logout. | Must Have | |
| FR-AUTH-007 | The system shall provide a current-user endpoint that returns the authenticated user's identity (name, email, role) derived from the active session or token. | Must Have | Frontend must not send trusted identifiers |
| FR-AUTH-008 | The system shall derive the current user's identity exclusively from the authenticated session or token for all business decisions; the frontend must not supply trusted employee or approver identifiers. | Must Have | Architectural security constraint from SI-001 §5 |

#### Acceptance Criteria

**FR-AUTH-001:**
- Given a visitor is not logged in, when they submit a valid name, email, password, and the Employee role, then the system creates the account and confirms registration.
- Given a visitor submits a registration form with an email that already exists, then the system returns an error indicating the email is already in use.

**FR-AUTH-002:**
- Given a visitor attempts to register via the public endpoint with the Manager role, then the system rejects the request and returns an error.
- Given a visitor attempts to manipulate the registration payload to assign the Manager role, then the system rejects the request regardless of the method used.

**FR-AUTH-003:**
- Given any registration or account creation event, when the password is persisted, then the stored value is a cryptographic hash with no plain-text equivalent in the database.

**FR-AUTH-004:**
- Given a registered user submits correct email and password, then the system establishes a session or issues a token and returns a success response.
- Given a user submits an incorrect password, then the system returns an authentication failure response.

**FR-AUTH-005:**
- Given a login attempt with an unregistered email, then the system returns the same error message format as an incorrect password, without specifying which field is wrong.

**FR-AUTH-006:**
- Given an authenticated user calls the logout endpoint, then the system terminates the session or invalidates the token, and subsequent requests using that token return an unauthorized response.

**FR-AUTH-007:**
- Given an authenticated user calls the current-user endpoint, then the system returns the user's name, email, and role derived from the session or token.
- Given an unauthenticated request is made to the current-user endpoint, then the system returns an unauthorized response.

**FR-AUTH-008:**
- Given any business operation (create, submit, approve, reject, cancel), when the API processes the request, then the user's identity is read from the authenticated session or token, not from any field supplied by the frontend.

---

### 3.2 Absence Type Catalog

**Feature Description:** A fixed, seeded catalog of absence types used to classify requests. Not maintainable through a UI in the MVP. An endpoint exposes the list for use in request creation.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-ATC-001 | The system shall seed the database with the following absence types on startup: Vacation, Personal Leave, and Sick Leave. | Must Have | |
| FR-ATC-002 | The system shall provide an endpoint that returns the full list of available absence types. | Must Have | Used by the request creation form |
| FR-ATC-003 | The system shall not provide any screen or API endpoint to create, edit, or delete absence types. | Must Have | Catalog is fixed for the MVP |

#### Acceptance Criteria

**FR-ATC-001:**
- Given the application starts with a clean database, then exactly three absence types (Vacation, Personal Leave, Sick Leave) exist in the catalog.

**FR-ATC-002:**
- Given an authenticated user calls the absence-type list endpoint, then the system returns all seeded absence types.

**FR-ATC-003:**
- Given any user attempts to call an endpoint to create, edit, or delete an absence type, then the system returns a not-found or method-not-allowed response, as no such endpoint exists.

---

### 3.3 Absence Request Management

**Feature Description:** Allows employees to create and manage their own absence requests through a defined lifecycle. The API infers request ownership from the authenticated session.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-ARM-001 | The system shall allow an authenticated Employee to create a new absence request in the Draft state by providing an absence type, start date, end date, and a reason. | Must Have | Owner inferred from session |
| FR-ARM-002 | The system shall validate that the end date is not earlier than the start date when creating or editing a request; requests that fail this validation must be rejected with a clear error message. | Must Have | Business rule BR-001 |
| FR-ARM-003 | The system shall validate that the start date is not in the past when creating or editing a request; requests that fail this validation must be rejected with a clear error message. | Must Have | Business rule BR-002 |
| FR-ARM-004 | The system shall allow an authenticated Employee to edit a request that they own and that is in the Draft state, updating absence type, start date, end date, or reason. | Must Have | Business rule BR-003 |
| FR-ARM-005 | The system shall prevent editing of any request that is not in the Draft state; attempts to edit a non-Draft request must return a clear error. | Must Have | Business rule BR-003 |
| FR-ARM-006 | The system shall allow an authenticated Employee to submit a Draft request they own, transitioning its state from Draft to Submitted. | Must Have | |
| FR-ARM-007 | The system shall make a Submitted request read-only for the employee owner; the employee cannot edit a Submitted request. | Must Have | |
| FR-ARM-008 | The system shall allow an authenticated Employee to cancel a request they own that is in the Draft or Submitted state, transitioning it to Cancelled. | Must Have | Business rule BR-010 |
| FR-ARM-009 | The system shall prevent any user from cancelling, editing, submitting, approving, or rejecting a request owned by another user, unless the action is explicitly permitted by role (approve/reject by Manager). | Must Have | Business rule BR-004 |
| FR-ARM-010 | The system shall derive the request owner from the authenticated session when creating a request; the frontend must not supply an employee identifier to claim ownership. | Must Have | Security constraint from SI-001 §5 |
| FR-ARM-011 | The system shall provide an endpoint for an authenticated Employee to list their own requests, including the current state and the final decision if one exists. | Must Have | |

#### Acceptance Criteria

**FR-ARM-001:**
- Given an authenticated Employee submits a valid create-request payload (absence type, start date, end date, reason), then a new request is created in the Draft state and associated with the authenticated user.
- Given an Employee submits a create-request payload that omits a required field, then the system returns a validation error identifying the missing field.

**FR-ARM-002:**
- Given an Employee provides a start date of 2026-07-25 and an end date of 2026-07-24, then the system returns an error stating the end date cannot be earlier than the start date.
- Given an Employee provides equal start and end dates, then the system accepts the request as valid.

**FR-ARM-003:**
- Given an Employee provides a start date that is the day before today, then the system returns an error stating the start date cannot be in the past.
- Given an Employee provides today's date as the start date, then the system accepts the request as valid.

**FR-ARM-004:**
- Given an authenticated Employee owns a Draft request, when they submit an edit with updated fields, then the system updates the request and it remains in the Draft state.

**FR-ARM-005:**
- Given an authenticated Employee owns a Submitted request, when they attempt to edit it, then the system returns an error stating the request cannot be edited in its current state.

**FR-ARM-006:**
- Given an authenticated Employee owns a Draft request, when they submit it, then the request state transitions from Draft to Submitted.

**FR-ARM-007:**
- Given an authenticated Employee owns a Submitted request, when they attempt to edit it, then the system returns an error consistent with FR-ARM-005.

**FR-ARM-008:**
- Given an authenticated Employee owns a Draft request, when they cancel it, then the request state transitions to Cancelled.
- Given an authenticated Employee owns a Submitted request, when they cancel it, then the request state transitions to Cancelled.

**FR-ARM-009:**
- Given an authenticated Employee attempts to edit, submit, or cancel a request owned by a different Employee, then the system returns an unauthorized or forbidden error.

**FR-ARM-010:**
- Given an Employee submits a create-request payload that includes an explicit employee ID field, then the system ignores that field and assigns ownership based on the authenticated session.

**FR-ARM-011:**
- Given an authenticated Employee calls the list-requests endpoint, then the system returns only their own requests with current state and decision information where applicable.

---

### 3.4 Manager Review and Approval

**Feature Description:** Allows Managers to review Submitted requests and record a formal approval or rejection decision. The API records the authenticated Manager as the responsible approver.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-MRA-001 | The system shall provide an endpoint that returns all Submitted requests visible to the authenticated Manager. | Must Have | Scoped to requests assigned to that manager |
| FR-MRA-002 | The system shall allow an authenticated Manager to approve a Submitted request, transitioning its state to Approved and creating exactly one Approval record that includes the Manager's authenticated identity, the decision, and a timestamp. | Must Have | Business rule BR-009 |
| FR-MRA-003 | The system shall allow an authenticated Manager to reject a Submitted request, transitioning its state to Rejected and creating exactly one Approval record that includes the Manager's authenticated identity, the decision, and a timestamp. | Must Have | Business rule BR-009 |
| FR-MRA-004 | The system shall allow an optional comment to be recorded on an approval or rejection decision. | Must Have | |
| FR-MRA-005 | The system shall derive the responsible approver from the authenticated Manager's session or token when recording a decision; the frontend must not supply an approver identifier. | Must Have | Security constraint from SI-001 §5 |
| FR-MRA-006 | The system shall prevent a Manager from approving or rejecting a request that they themselves own. | Must Have | Business rule BR-008 |
| FR-MRA-007 | The system shall prevent any user without the Manager role from approving or rejecting a request; such attempts must return a forbidden error. | Must Have | Business rule BR-006 |
| FR-MRA-008 | The system shall prevent a second approval or rejection decision on a request that already has an Approval record; each request may have at most one final decision. | Must Have | Business rule BR-009 |

#### Acceptance Criteria

**FR-MRA-001:**
- Given an authenticated Manager calls the manager-request-list endpoint, then the system returns only Submitted requests assigned to them, not Submitted requests assigned to other managers.

**FR-MRA-002:**
- Given an authenticated Manager approves a Submitted request, then the request state transitions to Approved and exactly one Approval record is created containing the Manager's identity, the Approved decision, and a timestamp.

**FR-MRA-003:**
- Given an authenticated Manager rejects a Submitted request with a comment, then the request state transitions to Rejected and exactly one Approval record is created containing the Manager's identity, the Rejected decision, the comment, and a timestamp.

**FR-MRA-004:**
- Given an authenticated Manager approves a request without providing a comment, then the decision is recorded successfully with a null or empty comment.
- Given an authenticated Manager rejects a request and provides a comment, then the comment is stored and retrievable on the request.

**FR-MRA-005:**
- Given a Manager submits an approval payload that includes an explicit approver ID field, then the system ignores that field and records the approver as the authenticated Manager from the session.

**FR-MRA-006:**
- Given a Manager attempts to approve or reject a request that they themselves submitted as an Employee, then the system returns an error preventing the action.

**FR-MRA-007:**
- Given an authenticated Employee attempts to call the approve or reject endpoint, then the system returns a forbidden error.

**FR-MRA-008:**
- Given a request is already in the Approved state, when a Manager attempts to approve or reject it again, then the system returns an error stating the request already has a final decision.

---

### 3.5 Request Lifecycle State Enforcement

**Feature Description:** Enforces valid state transitions and business rules across the request workflow. All invalid actions return clear error messages.

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-LSE-001 | The system shall enforce only the following valid state transitions: Draft → Submitted, Draft → Cancelled, Submitted → Approved, Submitted → Rejected, Submitted → Cancelled. | Must Have | Business rule BR-010 |
| FR-LSE-002 | The system shall treat Approved, Rejected, and Cancelled as final states with no further transitions permitted. | Must Have | Business rule BR-010 |
| FR-LSE-003 | The system shall return a clear, descriptive error message when any invalid state transition is attempted, identifying the current state and the rejected action. | Must Have | |
| FR-LSE-004 | The system shall enforce that only Draft requests can be edited; all other state edit attempts must be rejected. | Must Have | Business rule BR-003 |
| FR-LSE-005 | The system shall enforce that only Submitted requests can be approved or rejected; approve or reject actions on any other state must be rejected. | Must Have | Business rule BR-005 |
| FR-LSE-006 | The system shall enforce that only the request owner can edit, submit, or cancel their own request. | Must Have | Business rule BR-004 |
| FR-LSE-007 | The system shall enforce that only a user with the Manager role can approve or reject a request. | Must Have | Business rule BR-006 |

#### Acceptance Criteria

**FR-LSE-001:**
- Given a request is in the Draft state, when a submit action is called, then the state transitions to Submitted.
- Given a request is in the Draft state, when a cancel action is called, then the state transitions to Cancelled.
- Given a request is in the Submitted state, when an approve action is called by a Manager, then the state transitions to Approved.
- Given a request is in the Submitted state, when a reject action is called by a Manager, then the state transitions to Rejected.
- Given a request is in the Submitted state, when a cancel action is called by the owner, then the state transitions to Cancelled.

**FR-LSE-002:**
- Given a request is in the Approved, Rejected, or Cancelled state, when any transition action is attempted, then the system returns an error indicating no further transitions are permitted.

**FR-LSE-003:**
- Given any invalid action is attempted on a request, then the system returns an error message that identifies the request's current state and why the requested action is not permitted.

**FR-LSE-004:**
- Given a request in any state other than Draft, when an edit action is attempted, then the system returns an error consistent with FR-ARM-005.

**FR-LSE-005:**
- Given a request in any state other than Submitted, when an approve or reject action is attempted, then the system returns an error stating only Submitted requests can be approved or rejected.

**FR-LSE-006:**
- Given a user who does not own a request attempts to submit or cancel it, then the system returns a forbidden error.

**FR-LSE-007:**
- Given a user with the Employee role attempts to approve or reject any request, then the system returns a forbidden error.

---

## 4. Use Cases

> High-level use cases describing user-system interactions.
> Format: UC-[###]

---

### UC-001: Register as an Employee

| Field | Value |
|-------|-------|
| **ID** | UC-001 |
| **Actor** | Visitor (unregistered user) |
| **Goal** | Create an Employee account to access the system |
| **Trigger** | Visitor navigates to the registration screen |
| **Preconditions** | Visitor is not authenticated; the email address is not already registered |
| **Postconditions** | A new Employee account exists; the visitor can log in with the registered credentials |

**Main Flow:**
1. Visitor opens the registration screen.
2. Visitor enters name, email address, and password.
3. Visitor selects the Employee role (the only option available on the public form).
4. Visitor submits the form.
5. The system validates the input (no duplicate email, required fields present).
6. The system hashes the password and creates the account.
7. The system confirms successful registration.

**Alternative Flows:**
- Duplicate email: The system returns an error indicating the email is already in use; the visitor must use a different email or log in.

**Exceptions:**
- Missing required field: The system returns a validation error identifying the missing field; the form is not submitted.
- Attempt to assign Manager role: The system rejects the request; the Manager role cannot be self-assigned via public registration.

---

### UC-002: Log In

| Field | Value |
|-------|-------|
| **ID** | UC-002 |
| **Actor** | Employee or Manager (registered user) |
| **Goal** | Authenticate and access the application |
| **Trigger** | User navigates to the login screen |
| **Preconditions** | User has a registered account |
| **Postconditions** | User is authenticated; the system has established a session or issued a token |

**Main Flow:**
1. User opens the login screen.
2. User enters email address and password.
3. User submits the credentials.
4. The system validates the credentials against stored hashed values.
5. On success, the system establishes a session or issues a token.
6. The user is redirected to their home screen (Employee request list or Manager review list, based on role).

**Alternative Flows:**
- Invalid credentials: The system returns a generic authentication failure message without specifying whether the email or password was incorrect.

**Exceptions:**
- Account does not exist: The system returns the same generic failure message as an incorrect password (prevents account enumeration).

---

### UC-003: Create an Absence Request

| Field | Value |
|-------|-------|
| **ID** | UC-003 |
| **Actor** | Employee (UR-01) |
| **Goal** | Create a new absence request in Draft state |
| **Trigger** | Employee selects the option to create a new request on the request list screen |
| **Preconditions** | Employee is authenticated |
| **Postconditions** | A new absence request in Draft state exists, owned by the authenticated Employee |

**Main Flow:**
1. Employee opens the request creation form.
2. Employee selects an absence type from the seeded catalog (Vacation, Personal Leave, Sick Leave).
3. Employee enters start date, end date, and a reason.
4. Employee submits the form.
5. The system validates the dates (end date not before start date; start date not in the past).
6. The system creates the request in Draft state, assigning ownership to the authenticated user.
7. The system displays the new request on the Employee's request list.

**Alternative Flows:**
- End date before start date: The system returns a validation error; no request is created.
- Start date in the past: The system returns a validation error; no request is created.

**Exceptions:**
- Missing required field: The system returns a validation error identifying the missing field.

---

### UC-004: Edit a Draft Request

| Field | Value |
|-------|-------|
| **ID** | UC-004 |
| **Actor** | Employee (UR-01) |
| **Goal** | Modify a Draft absence request before submitting it |
| **Trigger** | Employee selects edit on an owned Draft request |
| **Preconditions** | Employee is authenticated; the target request is in Draft state and owned by the authenticated Employee |
| **Postconditions** | The request is updated with the new values; it remains in Draft state |

**Main Flow:**
1. Employee selects a Draft request from their list.
2. Employee opens the edit form pre-populated with current values.
3. Employee modifies one or more fields (absence type, start date, end date, or reason).
4. Employee submits the form.
5. The system re-validates dates.
6. The system saves the updated values; the request remains in Draft state.

**Alternative Flows:**
- Date validation failure: The system returns the relevant validation error; changes are not saved.

**Exceptions:**
- Request not in Draft state: The system returns an error indicating the request is not editable in its current state.
- Request owned by another user: The system returns a forbidden error.

---

### UC-005: Submit an Absence Request

| Field | Value |
|-------|-------|
| **ID** | UC-005 |
| **Actor** | Employee (UR-01) |
| **Goal** | Submit a Draft request for manager review |
| **Trigger** | Employee selects submit on an owned Draft request |
| **Preconditions** | Employee is authenticated; the target request is in Draft state and owned by the authenticated Employee |
| **Postconditions** | The request state transitions to Submitted; the request is read-only for the Employee |

**Main Flow:**
1. Employee selects submit on a Draft request.
2. The system transitions the request state from Draft to Submitted.
3. The system updates the request on the Employee's list to reflect the Submitted state.

**Exceptions:**
- Request not in Draft state: The system returns an error indicating the request cannot be submitted from its current state.
- Request owned by another user: The system returns a forbidden error.

---

### UC-006: Cancel an Absence Request

| Field | Value |
|-------|-------|
| **ID** | UC-006 |
| **Actor** | Employee (UR-01) |
| **Goal** | Cancel a Draft or Submitted request |
| **Trigger** | Employee selects cancel on an owned Draft or Submitted request |
| **Preconditions** | Employee is authenticated; the target request is in Draft or Submitted state and owned by the authenticated Employee |
| **Postconditions** | The request state transitions to Cancelled; no further transitions are permitted |

**Main Flow:**
1. Employee selects cancel on a request.
2. The system validates the request is in a cancellable state (Draft or Submitted).
3. The system transitions the request to Cancelled.
4. The system updates the Employee's request list.

**Exceptions:**
- Request in a final state (Approved, Rejected, Cancelled): The system returns an error indicating no further transitions are permitted.
- Request owned by another user: The system returns a forbidden error.

---

### UC-007: View Request List and Final Decision

| Field | Value |
|-------|-------|
| **ID** | UC-007 |
| **Actor** | Employee (UR-01) |
| **Goal** | View all own requests with their current state and final decision where applicable |
| **Trigger** | Employee navigates to the request list screen |
| **Preconditions** | Employee is authenticated |
| **Postconditions** | Employee can see the current lifecycle state and, for decided requests, the decision outcome and responsible approver's identity |

**Main Flow:**
1. Employee opens the request list screen.
2. The system retrieves all requests owned by the authenticated Employee.
3. The system displays each request with its current state (Draft, Submitted, Approved, Rejected, Cancelled).
4. For requests with a final decision (Approved or Rejected), the system displays the decision, the responsible approver's identity, and any decision comment.

**Exceptions:**
- No requests exist: The system displays an empty list with a prompt to create a new request.

---

### UC-008: Approve an Absence Request

| Field | Value |
|-------|-------|
| **ID** | UC-008 |
| **Actor** | Manager (UR-02) |
| **Goal** | Approve a Submitted absence request and record the decision |
| **Trigger** | Manager selects approve on a Submitted request in the manager review list |
| **Preconditions** | Manager is authenticated; the target request is in Submitted state; the Manager is not the owner of the request |
| **Postconditions** | The request state transitions to Approved; one Approval record is created with the authenticated Manager's identity, decision, and timestamp |

**Main Flow:**
1. Manager opens the manager review list; only Submitted requests assigned to them are shown.
2. Manager selects a request to review.
3. Manager optionally enters a comment.
4. Manager selects approve.
5. The system records the authenticated Manager as the approver.
6. The system creates one Approval record (Approved decision, Manager identity, timestamp, optional comment).
7. The system transitions the request state to Approved.
8. The request is removed from the Manager's Submitted queue.

**Exceptions:**
- Manager attempts to approve their own request: The system returns an error preventing the action.
- Request no longer in Submitted state: The system returns an error indicating the action is not valid for the current state.

---

### UC-009: Reject an Absence Request

| Field | Value |
|-------|-------|
| **ID** | UC-009 |
| **Actor** | Manager (UR-02) |
| **Goal** | Reject a Submitted absence request and record the decision |
| **Trigger** | Manager selects reject on a Submitted request in the manager review list |
| **Preconditions** | Manager is authenticated; the target request is in Submitted state; the Manager is not the owner of the request |
| **Postconditions** | The request state transitions to Rejected; one Approval record is created with the authenticated Manager's identity, decision, and timestamp |

**Main Flow:**
1. Manager opens the manager review list.
2. Manager selects a request to reject.
3. Manager optionally enters a comment explaining the rejection reason.
4. Manager selects reject.
5. The system records the authenticated Manager as the approver.
6. The system creates one Approval record (Rejected decision, Manager identity, timestamp, optional comment).
7. The system transitions the request state to Rejected.
8. The request is removed from the Manager's Submitted queue.

**Exceptions:**
- Manager attempts to reject their own request: The system returns an error preventing the action.
- Request no longer in Submitted state: The system returns an error indicating the action is not valid for the current state.

---

### UC-010: Log Out

| Field | Value |
|-------|-------|
| **ID** | UC-010 |
| **Actor** | Employee or Manager (authenticated user) |
| **Goal** | End the authenticated session |
| **Trigger** | User selects logout |
| **Preconditions** | User is authenticated |
| **Postconditions** | The session is terminated; the user must log in again to access the application |

**Main Flow:**
1. User selects logout.
2. The system terminates the session or invalidates the token.
3. The user is redirected to the login screen.

**Exceptions:**
- Session already expired: The system redirects the user to the login screen without error.

---

## 5. Business Rules

| ID | Rule | Applies To | Source |
|----|------|------------|--------|
| BR-001 | The end date of a request cannot be earlier than the start date. | FR-ARM-001, FR-ARM-004, FR-LSE-001 | SI-001 §4 (Business Constraints) |
| BR-002 | The start date of a request cannot be in the past. | FR-ARM-001, FR-ARM-004, FR-LSE-001 | SI-001 §4 (Business Constraints) |
| BR-003 | Only requests in the Draft state can be edited. | FR-ARM-004, FR-ARM-005, FR-LSE-004 | SI-001 §4 (Business Constraints) |
| BR-004 | Only the request owner can edit, submit, or cancel their own request. | FR-ARM-004, FR-ARM-006, FR-ARM-008, FR-LSE-006 | SI-001 §4 (Business Constraints) |
| BR-005 | Only Submitted requests can be approved or rejected. | FR-MRA-002, FR-MRA-003, FR-LSE-005 | SI-001 §4 (Business Constraints) |
| BR-006 | Only a user with the Manager role can approve or reject a request. | FR-MRA-002, FR-MRA-003, FR-MRA-007, FR-LSE-007 | SI-001 §4 (Business Constraints) |
| BR-007 | Public self-registration must not permit a user to assign themselves the Manager role. | FR-AUTH-001, FR-AUTH-002 | SI-001 §4 (Business Constraints) |
| BR-008 | A Manager cannot approve or reject a request that they themselves own. | FR-MRA-006 | SI-001 §4 (Business Constraints) |
| BR-009 | The authenticated Manager must be recorded as the responsible approver on every approval or rejection. Each request can have only one Approval record. | FR-MRA-002, FR-MRA-003, FR-MRA-005, FR-MRA-008 | SI-001 §4 (Business Constraints) |
| BR-010 | Approved, Rejected, and Cancelled states are final — no further state transitions are permitted from these states. | FR-ARM-008, FR-LSE-002 | SI-001 §4 (Business Constraints) |
| BR-011 | The API must derive the current employee identity and responsible approver from the authenticated session or token; the frontend must not supply trusted employee or approver identifiers for business decisions. | FR-AUTH-008, FR-ARM-010, FR-MRA-005 | SI-001 §5 (Technical Constraints) |

---

## 6. Out of Scope

| ID | Feature | Reason for Exclusion |
|----|---------|----------------------|
| OS-001 | Microsoft Entra ID / corporate single sign-on | Authentication for the MVP is local only; SSO deferred to post-MVP hardening per SI-001 §4 |
| OS-002 | Azure deployment and cloud hosting | MVP runs locally from source code; no cloud infrastructure in scope per SI-001 §4 |
| OS-003 | Docker and CI/CD pipelines | Not required for local review and MVP validation per SI-001 §4 |
| OS-004 | Email and Microsoft Teams notifications | Adds infrastructure dependencies outside the MVP boundary per SI-001 §4 |
| OS-005 | Password reset and email verification | Manual database reset or seeded accounts used during the review window per SI-001 §4 |
| OS-006 | Account administration screens | Manager accounts managed through seed data per SI-001 §4 |
| OS-007 | Vacation balance calculations | Adds complexity beyond the lifecycle validation goal per SI-001 §4 |
| OS-008 | Holiday calendars and working-day calculations | Dates are calendar days only; no working-day logic per SI-001 §4 |
| OS-009 | Overlapping request validation | Not required to demonstrate the core workflow per SI-001 §4 |
| OS-010 | File attachments and supporting documents | Requests contain no binary content per SI-001 §4 |
| OS-011 | Reporting, dashboards, and data exports | No analytics or reporting layer in the MVP per SI-001 §4 |
| OS-012 | HR administration screens | No HR platform functionality per SI-001 §4 |
| OS-013 | Multi-level approvals and approval delegation | Single Manager decision per request; higher complexity deferred per SI-001 §4 |
| OS-014 | Integration with payroll, HR, calendar, or directory systems | No external system connectivity in the MVP per SI-001 §4 |
| OS-015 | Data migration from existing systems | No import of historical email or spreadsheet records per SI-001 §4 |
| OS-016 | Advanced audit trail beyond the core approval record | No extended event log beyond the Approval record per SI-001 §4 |
| OS-017 | Automated backups | SQLite file is local; manual copy instructions provided in README per SI-001 §4 |
| OS-018 | Formal accessibility certification | Not in scope for MVP review per SI-001 §4 |
| OS-019 | Privacy notice or consent flow | To be revisited if the system moves to production per SI-001 §5 |
| OS-020 | Multifactor authentication and external identity providers | Post-MVP hardening items per SI-001 §4 |
| OS-021 | Absence type management UI | Absence types are fixed/seeded; no maintenance screen exists per FR-ATC-003 |

---

## 7. External Integrations

| System | Purpose | Protocol | Notes |
|--------|---------|----------|-------|
| None | No external integrations are in scope for the MVP | N/A | All integrations (payroll, HR, calendar, directory, SSO) are explicitly excluded per SI-001 §4 |

---

## 8. Traceability to SI

| FR ID | Requirement Summary | SI Section | SI Requirement |
|-------|---------------------|------------|----------------|
| FR-AUTH-001 | Allow user registration with name, email, password, and role | SI-001 §4 — In Scope | "Basic local registration and login using email and hashed password; public self-registration creates Employee accounts only" |
| FR-AUTH-002 | Restrict Manager role assignment via public registration | SI-001 §4 — Business Constraints | "Public registration cannot self-assign the Manager role"; "Public self-registration must not permit assignment of the Manager role under any path" |
| FR-AUTH-003 | Store passwords as cryptographic hashes | SI-001 §5 — Technical Constraints | "Authentication must use hashed passwords; plain-text password storage is not permitted" |
| FR-AUTH-004 | Validate credentials and establish session on login | SI-001 §4 — In Scope | "Authentication endpoints: Register, Login, Logout, Get current user" |
| FR-AUTH-006 | Terminate session on logout | SI-001 §4 — In Scope | "Authentication endpoints: Register, Login, Logout, Get current user" |
| FR-AUTH-007 | Current-user endpoint returning identity from session | SI-001 §4 — In Scope | "A current-user endpoint returns the logged-in identity" |
| FR-AUTH-008 | API derives identity from session; frontend must not supply trusted identifiers | SI-001 §5 — Technical Constraints | "The API must derive the current employee and responsible approver from the authenticated session or token; the frontend must not send trusted employee or approver identifiers for business decisions" |
| FR-ATC-001 | Seed absence types: Vacation, Personal Leave, Sick Leave | SI-001 §4 — In Scope | "Seeded absence types: Vacation, Personal Leave, and Sick Leave" |
| FR-ATC-002 | Endpoint listing all available absence types | SI-001 §4 — In Scope | "Workflow endpoints: List absence types" |
| FR-ATC-003 | No UI or endpoint to create, edit, or delete absence types | SI-001 §4 — In Scope | "Manager accounts created through seed data or controlled setup process; not available via public registration" (analogous pattern for catalog) |
| FR-ARM-001 | Employee creates Draft request with absence type, dates, reason | SI-001 §4 — In Scope | "Explicit actions: create, edit Draft, submit, cancel, approve, and reject" |
| FR-ARM-002 | End date cannot be earlier than start date | SI-001 §4 — Business Constraints | "Business rules: end date not before start date" |
| FR-ARM-003 | Start date cannot be in the past | SI-001 §4 — Business Constraints | "Business rules: start date not in the past" |
| FR-ARM-004 | Employee can edit a Draft request | SI-001 §4 — In Scope | "Explicit lifecycle actions: edit Draft" |
| FR-ARM-005 | Only Draft requests are editable | SI-001 §4 — Business Constraints | "Business rules: only Draft requests are editable" |
| FR-ARM-006 | Employee submits a Draft request → Submitted | SI-001 §4 — In Scope | "Explicit lifecycle actions: submit" |
| FR-ARM-008 | Employee cancels Draft or Submitted request → Cancelled | SI-001 §4 — In Scope | "Explicit lifecycle actions: cancel" |
| FR-ARM-009 | Only request owner can edit, submit, or cancel | SI-001 §4 — Business Constraints | "Only the authenticated Manager may approve or reject; public registration cannot self-assign Manager role" (ownership pattern) |
| FR-ARM-010 | Owner inferred from authenticated session | SI-001 §5 — Technical Constraints | "API derives the current user and responsible approver from authenticated session or token; frontend does not send trusted identifiers" |
| FR-ARM-011 | Employee views their own request list including final decision | SI-001 §4 — In Scope | "Web screens: Employee request list"; "Employees can view the final decision and responsible approver directly in the application" |
| FR-MRA-001 | Manager views only Submitted requests assigned to them | SI-001 §4 — In Scope | "Web screens: Manager review list with approve and reject actions"; "Managers access a single filtered view of Submitted requests awaiting decision" |
| FR-MRA-002 | Manager approves Submitted request → Approved + one Approval record | SI-001 §4 — In Scope | "Explicit actions: approve"; "every manager decision (approve or reject) is recorded with the authenticated manager's identity" |
| FR-MRA-003 | Manager rejects Submitted request → Rejected + one Approval record | SI-001 §4 — In Scope | "Explicit actions: reject"; "every manager decision (approve or reject) is recorded with the authenticated manager's identity" |
| FR-MRA-004 | Optional comment on approval or rejection | SI-001 §4 — In Scope | "An optional comment can be added with the decision" |
| FR-MRA-005 | Approver derived from authenticated session | SI-001 §5 — Technical Constraints | "The API must derive the current employee and responsible approver from the authenticated session or token" |
| FR-MRA-006 | Manager cannot approve or reject own request | SI-001 §4 — Business Constraints | "A manager cannot approve or reject their own request" |
| FR-MRA-007 | Only Manager role can approve or reject | SI-001 §4 — Business Constraints | "Business rules: only the authenticated Manager may approve or reject" |
| FR-MRA-008 | Each request has at most one Approval record | SI-001 §4 — In Scope | "Each decision creates exactly one Approval record" |
| FR-LSE-001 | Enforce valid state transitions only | SI-001 §4 — In Scope | "Request lifecycle with five states: Draft, Submitted, Approved, Rejected, and Cancelled" |
| FR-LSE-002 | Approved, Rejected, Cancelled are final states | SI-001 §4 — Business Constraints | "Approved, Rejected, and Cancelled states are final — no further transitions permitted" |
| FR-LSE-003 | Return clear error on invalid state transition | SI-001 §4 — Business Constraints | "The system returns a clear error message when an invalid action is attempted" |

---

## 9. Document Control

### Review & Approval

| Role | Name | Date | Status | Comments |
|------|------|------|--------|----------|
| BSA / PO | Junior Gervacio | | Pending | |
| Business Sponsor | James Parker | | Pending | |
| Tech Lead | | | Pending | |

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Junior Gervacio (AI Assisted) | Initial draft |

---

## 10. Next Steps

- [ ] Review and sign this document — Owner: Junior Gervacio (BSA/PO) — Target: 2026-07-28
- [ ] Confirm open SI-001 conditions with James Parker (Entra ID mandate, concurrent user count, privacy notice) — Target: 2026-07-27
- [ ] Proceed to Phase 3: Requirements — Non-Functional Requirements Specification

**If Approved → Proceed to Phase 3:** Requirements — Non-Functional Requirements Specification (Target: 2026-07-28)

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Junior Gervacio (AI Assisted) |
| Approval Authority | BSA (PM_OVERRIDE — bypassed BSA) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 18:50:30 UTC |

*— End of document —*
