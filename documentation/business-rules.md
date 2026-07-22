# Business Rules Catalog: VacaFlow_03

**Project:** VacaFlow_03
**Document ID:** BR-001
**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-20
**Version:** 1.0
**Status:** Draft
**Related Documents:** SI-001 (Strategic Intake)

---

## 1. Overview

### 1.1 Purpose

This document catalogs all business rules governing the VacaFlow_03 application — a locally executable web application that manages employee vacation and absence requests for IGS Solutions. The rules defined here provide unambiguous guidance for implementation, testing, and validation of the MVP's request lifecycle, authorization model, identity resolution, and data integrity requirements.

### 1.2 Scope

This catalog covers the following rule domains:

- **Authentication & Identity** — registration, password storage, and session-based identity resolution
- **Authorization** — role-based access control and action-level permission enforcement
- **Request Lifecycle** — state transitions, editability, and finality constraints
- **Date Validation** — temporal constraints on absence request dates
- **Approval & Decision** — rules governing the approval and rejection of requests
- **Reference Data** — absence type management and seeding
- **Data Protection** — password hashing and database exposure constraints

Rules governing privacy notices, formal data retention policies, and production-grade data protection are explicitly out of scope for the MVP. These are deferred for revisitation if VacaFlow moves to a production deployment, as confirmed by the project sponsor (SI-001, §5).

### 1.3 Rule Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Constraint** | Restrictions that prevent an action or state | End date cannot precede start date |
| **Computation** | Derived or calculated values | No computational rules in MVP scope |
| **Derivation** | Values derived from context or state | Approver identity derived from authenticated session |
| **Inference** | Logical conclusions about eligibility or authorization | Only Managers may approve requests |
| **Timing** | Time-based restrictions | Start date cannot be in the past |
| **Compliance** | Rules enforcing data protection or security policy | Passwords must be stored as hashes |

### 1.4 Rule Naming Convention

Rules are identified using the format `BR-{DOMAIN}-{NNN}`, where:

- `{DOMAIN}` is a short domain code (e.g., `AUTH`, `ROLE`, `REQ`, `DATE`, `APPR`, `DATA`)
- `{NNN}` is a zero-padded sequential number within the domain

---

## 2. Rule Template

Each business rule is documented using the following structure:

| Field | Description |
|-------|-------------|
| **Rule ID** | Unique identifier in `BR-{DOMAIN}-{NNN}` format |
| **Name** | Short descriptive name |
| **Category** | One of: Constraint, Derivation, Inference, Timing, Compliance |
| **Priority** | High / Medium / Low |
| **Source** | Origin of the rule (business policy, security policy, legal, etc.) |
| **Description** | What the rule does and why |
| **Condition** | When the rule applies |
| **Rule Logic** | The precise condition-action specification |
| **Action on Violation** | What happens when the rule is violated |
| **Related Requirements** | Linked document IDs and requirement references |
| **Exceptions** | Documented cases where the rule does not apply |

---

## 3. Authentication Rules

### BR-AUTH-001: Public Registration Role Restriction

| Field | Value |
|-------|-------|
| **Rule ID** | BR-AUTH-001 |
| **Name** | Public Registration Role Restriction |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
The public self-registration endpoint must only permit the creation of accounts with the Employee role. No registration path — including direct API requests with modified payloads — may result in a newly registered user holding the Manager role.

**Condition:**
When any user submits a registration request through the public registration endpoint.

**Rule Logic:**
```
IF registration_request is received via public endpoint
THEN
  SET new_account.role = Employee  // Force, regardless of any role field in payload
  IF payload contains role = Manager OR role = any elevated role
    IGNORE the submitted role value
    Proceed with role = Employee
```

**Action on Violation:**
The submitted role value is silently overridden to Employee. No error is returned to the client for including a role field — the field is ignored. The resulting account always holds the Employee role.

**Related Requirements:** SI-001 §4 (Scope), SI-001 §5 (Constraints)

**Exceptions:**
- Manager accounts created through seed data or a controlled administrative setup process are exempt from this rule — they are not created through the public registration endpoint.

---

### BR-AUTH-002: Password Hashing Requirement

| Field | Value |
|-------|-------|
| **Rule ID** | BR-AUTH-002 |
| **Name** | Password Hashing Requirement |
| **Category** | Compliance |
| **Priority** | High |
| **Source** | Security Policy (SI-001, §5) |

**Description:**
Passwords must never be stored in plain text. Every password must be transformed through a cryptographic one-way hashing function before persistence. This rule applies at all points where a password is written to or read from the data store.

**Condition:**
When a user registers an account or when a credential comparison is required during login.

**Rule Logic:**
```
ON registration:
  stored_credential = HASH(submitted_password, salt)
  PERSIST stored_credential  // Never persist raw submitted_password

ON login:
  result = VERIFY(submitted_password, stored_credential)
  IF result = true → grant access
  IF result = false → deny access
```

**Action on Violation:**
Any attempt to store a plain-text password must be treated as a critical defect. The operation must not complete. The architecture must enforce this at the infrastructure layer so no application logic path can bypass it.

**Related Requirements:** SI-001 §5 (Technical Constraints)

**Exceptions:**
None. There are no circumstances under which plain-text password storage is acceptable in this application.

---

### BR-AUTH-003: Manager Account Creation Channel

| Field | Value |
|-------|-------|
| **Rule ID** | BR-AUTH-003 |
| **Name** | Manager Account Creation Channel |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
Manager accounts must only be created through seed data or a controlled administrative setup process. No operational endpoint — public or otherwise — may create a Manager account outside of this controlled channel.

**Condition:**
At all points where user account creation occurs.

**Rule Logic:**
```
IF account creation is requested through any operational endpoint
THEN role = Employee  // Enforced by BR-AUTH-001

Manager accounts exist ONLY IF created through:
  - Seed data executed at application startup
  - A controlled, non-public administrative setup process
```

**Action on Violation:**
The Manager role must be blocked from assignment through any operational endpoint. If a non-seed path produces a Manager account, it is a critical defect.

**Related Requirements:** SI-001 §4 (Scope), BR-AUTH-001

**Exceptions:**
Seed data and administrative setup scripts operating outside the public API are the only valid creation paths.

---

## 4. Identity Resolution Rules

### BR-IDEN-001: Employee Identity Derived from Session

| Field | Value |
|-------|-------|
| **Rule ID** | BR-IDEN-001 |
| **Name** | Employee Identity Derived from Authenticated Session |
| **Category** | Derivation |
| **Priority** | High |
| **Source** | Security Policy (SI-001, §4, §5) |

**Description:**
The API must derive the identity of the employee performing any action from the authenticated session or token. The frontend must not send an employee identifier as a payload field for any business operation, and the API must not trust any client-supplied identity for decisions affecting ownership, editability, or authorization.

**Condition:**
When any API endpoint is called for a business operation (create, edit, submit, cancel, approve, reject, or list requests).

**Rule Logic:**
```
ON any business endpoint call:
  current_employee = GET_IDENTITY_FROM(authenticated_session OR access_token)
  DISCARD any employee_id or user_id field in the request payload for trust decisions

  IF current_employee cannot be resolved
    THEN return 401 Unauthorized
```

**Action on Violation:**
Any endpoint that accepts a client-supplied employee identifier as the basis for ownership or authorization is a critical security defect. The operation must be rejected until resolved.

**Related Requirements:** SI-001 §4 (Scope), SI-001 §5 (Technical Constraints)

**Exceptions:**
None.

---

### BR-IDEN-002: Approver Identity Derived from Session

| Field | Value |
|-------|-------|
| **Rule ID** | BR-IDEN-002 |
| **Name** | Approver Identity Derived from Authenticated Session |
| **Category** | Derivation |
| **Priority** | High |
| **Source** | Security Policy (SI-001, §4, §5) |

**Description:**
The identity of the manager performing an approval or rejection must be derived from the authenticated session or token at the time the decision is made. The frontend must not supply an approver identifier, and the API must not trust any client-supplied approver identity for recording the decision.

**Condition:**
When an approve or reject action is called on any absence request.

**Rule Logic:**
```
ON approve OR reject endpoint call:
  approver_identity = GET_IDENTITY_FROM(authenticated_session OR access_token)
  DISCARD any approver_id or manager_id field in the request payload

  USE approver_identity to:
    - Validate the Manager role (see BR-ROLE-001)
    - Validate the manager-employee assignment (see BR-APPR-003)
    - Record in the Approval record (see BR-APPR-002)
```

**Action on Violation:**
Any approval or rejection recorded with a client-supplied approver identity is a critical security and data integrity defect.

**Related Requirements:** SI-001 §4 (Scope), SI-001 §5 (Technical Constraints), BR-APPR-002

**Exceptions:**
None.

---

## 5. Authorization Rules

### BR-ROLE-001: Manager Role Required for Approval Actions

| Field | Value |
|-------|-------|
| **Rule ID** | BR-ROLE-001 |
| **Name** | Manager Role Required for Approval and Rejection |
| **Category** | Inference |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
Only users holding the Manager role may approve or reject absence requests. Users with the Employee role must be denied access to the approve and reject endpoints regardless of any other condition.

**Condition:**
When the approve or reject endpoint is called.

**Rule Logic:**
```
IF authenticated_user.role != Manager
THEN return 403 Forbidden
   // "Approval and rejection require the Manager role."
ELSE
  Continue with approval/rejection validation rules
```

**Action on Violation:**
Return HTTP 403 Forbidden. Do not process the action.

**Related Requirements:** SI-001 §4 (Scope), BR-IDEN-002

**Exceptions:**
None.

---

### BR-ROLE-002: Request Ownership Required for Employee Actions

| Field | Value |
|-------|-------|
| **Rule ID** | BR-ROLE-002 |
| **Name** | Request Ownership Required for Edit, Submit, and Cancel |
| **Category** | Inference |
| **Priority** | High |
| **Source** | Business Policy |

**Description:**
Only the employee who created an absence request may edit, submit, or cancel that request. No other employee — regardless of role — may perform these actions on a request they do not own.

**Condition:**
When the edit, submit, or cancel endpoint is called for a specific request.

**Rule Logic:**
```
ON edit OR submit OR cancel endpoint call for request R:
  requesting_employee = GET_IDENTITY_FROM(authenticated_session)

  IF request_R.owner_id != requesting_employee.id
  THEN return 403 Forbidden
     // "Only the request owner may perform this action."
  ELSE
    Continue with lifecycle state validation
```

**Action on Violation:**
Return HTTP 403 Forbidden.

**Related Requirements:** SI-001 §4 (Scope), BR-IDEN-001

**Exceptions:**
None within MVP scope.

---

### BR-ROLE-003: Manager Cannot Act on Own Requests

| Field | Value |
|-------|-------|
| **Rule ID** | BR-ROLE-003 |
| **Name** | Manager Cannot Approve or Reject Their Own Absence Request |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy |

**Description:**
A user holding the Manager role who also has a pending absence request may not approve or reject that request themselves. The manager-employee conflict check must prevent self-approval in all cases.

**Condition:**
When the approve or reject endpoint is called and the authenticated user holds the Manager role.

**Rule Logic:**
```
ON approve OR reject for request R:
  approver = GET_IDENTITY_FROM(authenticated_session)

  IF request_R.owner_id == approver.id
  THEN return 403 Forbidden
     // "A manager cannot approve or reject their own absence request."
```

**Action on Violation:**
Return HTTP 403 Forbidden.

**Related Requirements:** SI-001 §4 (Scope), BR-ROLE-001

**Exceptions:**
None. This rule has no exceptions in the MVP.

---

## 6. Request Lifecycle Rules

### BR-LIFE-001: Valid Request State Transitions

| Field | Value |
|-------|-------|
| **Rule ID** | BR-LIFE-001 |
| **Name** | Valid Request State Transitions |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
Absence requests follow a defined lifecycle. Only the transitions listed below are permitted. Any attempt to apply an action from a state where it is not authorized must be rejected.

**Condition:**
When any lifecycle action (edit, submit, cancel, approve, reject) is called on a request.

**Permitted Transitions:**

| Current State | Action | Resulting State | Actor |
|---------------|--------|-----------------|-------|
| Draft | Edit | Draft | Owner (Employee) |
| Draft | Submit | Submitted | Owner (Employee) |
| Draft | Cancel | Cancelled | Owner (Employee) |
| Submitted | Cancel | Cancelled | Owner (Employee) |
| Submitted | Approve | Approved | Assigned Manager |
| Submitted | Reject | Rejected | Assigned Manager |

**Rule Logic:**
```
ON action A for request R:
  IF (R.current_state, A) NOT IN permitted_transitions
  THEN return 422 Unprocessable Entity
     // "Action '{A}' is not permitted for a request in state '{R.current_state}'."
```

**Action on Violation:**
Return HTTP 422 Unprocessable Entity with an informative error message.

**Related Requirements:** SI-001 §4 (Scope), BR-LIFE-002, BR-LIFE-003

**Exceptions:**
None.

---

### BR-LIFE-002: Final States Are Immutable

| Field | Value |
|-------|-------|
| **Rule ID** | BR-LIFE-002 |
| **Name** | Final States Are Immutable |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
Once an absence request reaches the Approved, Rejected, or Cancelled state, no further state transitions are permitted for that request. These states are terminal for the MVP.

**Condition:**
When any action is attempted on a request in the Approved, Rejected, or Cancelled state.

**Rule Logic:**
```
IF request.state IN {Approved, Rejected, Cancelled}
THEN return 422 Unprocessable Entity
   // "No further actions are permitted on a {state} request."
```

**Action on Violation:**
Return HTTP 422 Unprocessable Entity.

**Related Requirements:** SI-001 §4 (Scope), BR-LIFE-001

**Exceptions:**
None in the MVP. Post-MVP, a reopening or resubmission flow may be considered, but it is not in scope.

---

### BR-LIFE-003: Only Draft Requests Are Editable

| Field | Value |
|-------|-------|
| **Rule ID** | BR-LIFE-003 |
| **Name** | Only Draft Requests Are Editable |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
The edit action is only valid when a request is in the Draft state. Requests in Submitted, Approved, Rejected, or Cancelled states cannot be modified through the edit endpoint.

**Condition:**
When the edit endpoint is called for a request.

**Rule Logic:**
```
IF request.state != Draft
THEN return 422 Unprocessable Entity
   // "Only requests in Draft state may be edited."
```

**Action on Violation:**
Return HTTP 422 Unprocessable Entity.

**Related Requirements:** SI-001 §4 (Scope), BR-LIFE-001

**Exceptions:**
None.

---

### BR-LIFE-004: Cancellable States

| Field | Value |
|-------|-------|
| **Rule ID** | BR-LIFE-004 |
| **Name** | Only Draft and Submitted Requests May Be Cancelled |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy |

**Description:**
A request owner may cancel a request only if it is currently in the Draft or Submitted state. Requests in Approved, Rejected, or Cancelled states cannot be cancelled.

**Condition:**
When the cancel endpoint is called for a request.

**Rule Logic:**
```
IF request.state NOT IN {Draft, Submitted}
THEN return 422 Unprocessable Entity
   // "Only Draft or Submitted requests may be cancelled."
```

**Action on Violation:**
Return HTTP 422 Unprocessable Entity.

**Related Requirements:** SI-001 §4 (Scope), BR-LIFE-001, BR-LIFE-002

**Exceptions:**
None.

---

### BR-LIFE-005: Only Submitted Requests May Be Approved or Rejected

| Field | Value |
|-------|-------|
| **Rule ID** | BR-LIFE-005 |
| **Name** | Only Submitted Requests May Be Approved or Rejected |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
Managers may only approve or reject requests that are in the Submitted state. Draft, Approved, Rejected, and Cancelled requests cannot be acted upon by a manager through the approve or reject endpoints.

**Condition:**
When the approve or reject endpoint is called for a request.

**Rule Logic:**
```
IF request.state != Submitted
THEN return 422 Unprocessable Entity
   // "Only Submitted requests may be approved or rejected."
```

**Action on Violation:**
Return HTTP 422 Unprocessable Entity.

**Related Requirements:** SI-001 §4 (Scope), BR-LIFE-001, BR-ROLE-001

**Exceptions:**
None.

---

## 7. Date Validation Rules

### BR-DATE-001: End Date Not Before Start Date

| Field | Value |
|-------|-------|
| **Rule ID** | BR-DATE-001 |
| **Name** | End Date Cannot Precede Start Date |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
The end date of an absence request must be equal to or later than the start date. A request whose end date falls before its start date is invalid and must be rejected.

**Condition:**
When a request is created or when a Draft request is edited.

**Rule Logic:**
```
IF request.end_date < request.start_date
THEN return 400 Bad Request
   // "End date cannot be earlier than the start date."
```

**Action on Violation:**
Return HTTP 400 Bad Request with a field-level validation error identifying the end date field.

**Related Requirements:** SI-001 §4 (Scope)

**Exceptions:**
None. A same-day absence (start date = end date) is valid.

---

### BR-DATE-002: Start Date Cannot Be in the Past

| Field | Value |
|-------|-------|
| **Rule ID** | BR-DATE-002 |
| **Name** | Start Date Cannot Be in the Past |
| **Category** | Timing |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
The start date of an absence request must be today's date or a future date. Requests with a start date that falls before the current date at the time of creation or edit are invalid.

**Condition:**
When a request is created or when a Draft request is edited.

**Rule Logic:**
```
today = GET_CURRENT_DATE()  // Date only, no time component

IF request.start_date < today
THEN return 400 Bad Request
   // "Start date cannot be in the past."
```

**Action on Violation:**
Return HTTP 400 Bad Request with a field-level validation error identifying the start date field.

**Related Requirements:** SI-001 §4 (Scope)

**Exceptions:**
None in the MVP. Date comparisons use calendar dates; no working-day or timezone adjustments are applied (holiday calendar and timezone logic are out of scope per SI-001 §4).

---

## 8. Approval Record Rules

### BR-APPR-001: One Final Decision Per Request

| Field | Value |
|-------|-------|
| **Rule ID** | BR-APPR-001 |
| **Name** | One Final Decision Per Request |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy |

**Description:**
Each absence request may have at most one final decision (approval or rejection). Once a decision is recorded, the request transitions to a final state (Approved or Rejected), and no further decisions may be recorded against it.

**Condition:**
When the approve or reject endpoint is called for a request.

**Rule Logic:**
```
IF request.approval_record EXISTS
  THEN return 422 Unprocessable Entity
     // "A decision has already been recorded for this request."

IF request.state IN {Approved, Rejected}
  THEN return 422 Unprocessable Entity (enforced also by BR-LIFE-002)
```

**Action on Violation:**
Return HTTP 422 Unprocessable Entity.

**Related Requirements:** SI-001 §4 (Scope), BR-LIFE-002, BR-LIFE-005

**Exceptions:**
None.

---

### BR-APPR-002: Approval Record Must Capture Full Decision Context

| Field | Value |
|-------|-------|
| **Rule ID** | BR-APPR-002 |
| **Name** | Approval Record Must Capture Full Decision Context |
| **Category** | Constraint |
| **Priority** | High |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
When a manager approves or rejects a request, the system must create exactly one Approval record that stores the following: the authenticated manager's identity, the decision (Approved or Rejected), an optional comment, and the date and time of the decision. No partial record is acceptable.

**Condition:**
When the approve or reject endpoint completes successfully.

**Rule Logic:**
```
ON successful approve OR reject:
  CREATE Approval record WHERE:
    approval.request_id      = request.id
    approval.manager_id      = GET_IDENTITY_FROM(authenticated_session).id  // From BR-IDEN-002
    approval.decision        = Approved OR Rejected
    approval.comment         = submitted_comment OR null  // Comment is optional
    approval.decision_date   = GET_CURRENT_DATETIME()
```

**Action on Violation:**
If the Approval record cannot be created (e.g., due to a persistence failure), the entire approve/reject transaction must be rolled back and an error returned. A state transition without a corresponding Approval record is not acceptable.

**Related Requirements:** SI-001 §4 (Scope), BR-IDEN-002, BR-APPR-001

**Exceptions:**
None.

---

### BR-APPR-003: Manager May Only Act on Assigned Employees' Requests

| Field | Value |
|-------|-------|
| **Rule ID** | BR-APPR-003 |
| **Name** | Manager Scope Limited to Assigned Employees |
| **Category** | Inference |
| **Priority** | High |
| **Source** | Business Policy |

**Description:**
A manager may only approve or reject absence requests belonging to employees who are assigned to that manager. A manager must not be able to act on requests from employees outside their assignment scope.

**Condition:**
When the approve or reject endpoint is called and the authenticated user holds the Manager role.

**Rule Logic:**
```
ON approve OR reject for request R:
  approver = GET_IDENTITY_FROM(authenticated_session)
  request_owner = LOOKUP_EMPLOYEE(request_R.owner_id)

  IF request_owner.assigned_manager_id != approver.id
  THEN return 403 Forbidden
     // "You are not authorized to act on this employee's request."
```

**Action on Violation:**
Return HTTP 403 Forbidden.

**Related Requirements:** SI-001 §4 (Scope), BR-ROLE-001, BR-ROLE-003

**Exceptions:**
None in the MVP. Multi-manager hierarchies and delegation are deferred to post-MVP.

---

## 9. Reference Data Rules

### BR-DATA-001: Absence Types Are Seeded and Read-Only

| Field | Value |
|-------|-------|
| **Rule ID** | BR-DATA-001 |
| **Name** | Absence Types Are Seeded and Not Editable Through the UI |
| **Category** | Constraint |
| **Priority** | Medium |
| **Source** | Business Policy (SI-001, §4) |

**Description:**
Absence types are defined at application initialization through seed data and must not be creatable, editable, or deletable through any user interface or operational API endpoint. The seed data defines exactly three absence types for the MVP: Vacation, Personal Leave, and Sick Leave.

**Condition:**
At all times during application operation.

**Seeded Absence Types:**

| ID | Name |
|----|------|
| 1 | Vacation |
| 2 | Personal Leave |
| 3 | Sick Leave |

**Rule Logic:**
```
Absence type values are set at seed time and are immutable through any operational endpoint.
No API endpoint may create, update, or delete absence types.
The list-absence-types endpoint is read-only.

IF any request attempts to create, update, or delete an absence type through an API call
THEN return 405 Method Not Allowed OR 404 Not Found (no such endpoint exists)
```

**Action on Violation:**
The absence type management endpoints must not exist in the MVP API surface. Any attempt to call them returns a 404 or 405 response.

**Related Requirements:** SI-001 §4 (Scope)

**Exceptions:**
Direct database seed scripts used at application startup are exempt — they operate outside the API surface.

---

## 10. Data Protection Rules

### BR-PROT-001: Database File Must Not Be Publicly Exposed

| Field | Value |
|-------|-------|
| **Rule ID** | BR-PROT-001 |
| **Name** | SQLite Database File Must Not Be Publicly Exposed |
| **Category** | Compliance |
| **Priority** | High |
| **Source** | Security Policy (SI-001, §5) |

**Description:**
The SQLite database file must not be served as a static asset, placed in a publicly accessible directory, or committed to source control with real user credentials or data. The file must be accessible only to the running application process on the local machine.

**Condition:**
At all times during development, review, and local execution.

**Rule Logic:**
```
ENSURE:
  - SQLite file path is NOT within any web server's static file directory
  - .gitignore MUST exclude the SQLite file (or the data directory containing it)
  - If a pre-seeded SQLite file is committed for convenience, it must contain ONLY seed/demo data with no real user credentials
```

**Action on Violation:**
Exposure of the database file with real credentials is a critical security defect. The README must explicitly document this constraint for any developer or reviewer running the application locally.

**Related Requirements:** SI-001 §5 (Technical Constraints, Legal Constraints)

**Exceptions:**
A pre-seeded demo database file containing only seed/test data (no real credentials) may be committed if explicitly documented as such.

---

## 11. Rule Summary

### By Category

| Category | Count | Rule IDs |
|----------|-------|----------|
| Constraint | 10 | BR-AUTH-001, BR-AUTH-003, BR-LIFE-001, BR-LIFE-002, BR-LIFE-003, BR-LIFE-004, BR-LIFE-005, BR-APPR-001, BR-APPR-002, BR-DATA-001 |
| Derivation | 2 | BR-IDEN-001, BR-IDEN-002 |
| Inference | 3 | BR-ROLE-001, BR-ROLE-002, BR-APPR-003 |
| Timing | 1 | BR-DATE-002 |
| Compliance | 2 | BR-AUTH-002, BR-PROT-001 |
| Mixed (Constraint + Timing) | 1 | BR-DATE-001 |

**Total Rules: 19**

### By Priority

| Priority | Count | Rule IDs |
|----------|-------|----------|
| High | 18 | BR-AUTH-001, BR-AUTH-002, BR-AUTH-003, BR-IDEN-001, BR-IDEN-002, BR-ROLE-001, BR-ROLE-002, BR-ROLE-003, BR-LIFE-001, BR-LIFE-002, BR-LIFE-003, BR-LIFE-004, BR-LIFE-005, BR-DATE-001, BR-DATE-002, BR-APPR-001, BR-APPR-002, BR-APPR-003, BR-PROT-001 |
| Medium | 1 | BR-DATA-001 |
| Low | 0 | — |

### By Domain

| Domain | Code | Count |
|--------|------|-------|
| Authentication | AUTH | 3 |
| Identity Resolution | IDEN | 2 |
| Authorization / Roles | ROLE | 3 |
| Request Lifecycle | LIFE | 5 |
| Date Validation | DATE | 2 |
| Approval Records | APPR | 3 |
| Reference Data | DATA | 1 |
| Data Protection | PROT | 1 |

---

## 12. Rule Interaction Map

The following rules interact and must be evaluated in sequence for approval and rejection actions:

```
Approve / Reject Request Flow
────────────────────────────────────────────────────────
1. BR-IDEN-002   → Derive approver identity from session
2. BR-ROLE-001   → Confirm approver holds Manager role
3. BR-ROLE-003   → Confirm approver is not the request owner
4. BR-APPR-003   → Confirm request owner is assigned to this manager
5. BR-LIFE-005   → Confirm request is in Submitted state
6. BR-APPR-001   → Confirm no prior decision exists
7. BR-APPR-002   → Create Approval record and transition state
────────────────────────────────────────────────────────

Create / Edit Request Flow
────────────────────────────────────────────────────────
1. BR-IDEN-001   → Derive employee identity from session
2. BR-ROLE-002   → Confirm employee owns the request (edit only)
3. BR-LIFE-003   → Confirm request is in Draft state (edit only)
4. BR-DATE-002   → Validate start date is not in the past
5. BR-DATE-001   → Validate end date is not before start date
────────────────────────────────────────────────────────

Registration Flow
────────────────────────────────────────────────────────
1. BR-AUTH-001   → Force role = Employee
2. BR-AUTH-002   → Hash password before storage
3. BR-AUTH-003   → Verify no Manager role was assigned
────────────────────────────────────────────────────────
```

---

## 13. Out-of-Scope Rules (Deferred)

The following rule categories are explicitly deferred to post-MVP and must not be implemented in the current version:

| Rule Area | Deferral Reason | Reference |
|-----------|-----------------|-----------|
| Privacy notice and consent flow | Deferred by project sponsor — revisit only if VacaFlow moves to production | SI-001 §5 |
| Formal data retention policy | No retention rule applies in the MVP; data persists until manually deleted | SI-001 §5 |
| Overlapping request detection | Not required to validate the core lifecycle | SI-001 §4 (Won't v1) |
| Password reset and account recovery | Manual database reset or seeded accounts used during the review window | SI-001 §4 (Out of Scope) |
| Vacation balance and accrual rules | No balance calculations in the MVP | SI-001 §4 (Out of Scope) |
| Holiday calendar and working-day rules | Dates are calendar days only; no working-day logic | SI-001 §4 (Out of Scope) |
| Multi-level approval and delegation | Single Manager decision per request in the MVP | SI-001 §4 (Out of Scope) |
| Account lockout and brute-force protection | Deferred to post-MVP hardening | SI-001 §4 (Won't v1) |

---

## 14. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Yeuri Jessel Reyes (AI Assisted) | Initial catalog — 19 rules across 8 domains |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Solution Architect | Yeuri Jessel Reyes | | Pending |
| BSA / Product Owner | Junior Gervacio | | Pending |
| Technical Lead | | | Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Solution Architect (PM_OVERRIDE — bypassed Solution Architect) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 19:01:11 UTC |

*— End of document —*
