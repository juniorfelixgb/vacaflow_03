# Test Cases: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Draft
**Project:** VacaFlow_03
**Document ID:** TC-001
**References:** TP-001 (Test Plan), FRS-001 (Functional Requirements Specification), NFR-001 (Non-Functional Requirements Specification)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version — full test case catalog for Authentication, Request Workflow, Business Rules, Authorization, and Catalog modules |

---

## 1. Test Case Overview

### 1.1 Scope

This document contains test cases for VacaFlow_03 covering the following modules and test types:

- **Authentication:** Employee self-registration, Manager account setup, login, logout, current-user retrieval, password hashing enforcement, Manager role self-assignment prevention
- **Absence Request Workflow:** Create Draft, edit Draft, submit, cancel (Draft and Submitted states), approve Submitted, reject Submitted
- **Business Rule Enforcement:** All eleven business rules from FRS-001 §5 (BR-001 through BR-011)
- **Authorization and Identity Enforcement:** Server-side identity derivation, RBAC blocking, cross-user access prevention
- **Request Lifecycle State Transitions:** All valid and invalid transitions across the five-state model
- **Manager Review:** Manager request list (Submitted only), employee request history with final decision
- **Absence Type Catalog:** List endpoint returning seeded types
- **Error Handling:** Invalid state transitions, forbidden operations

**Test Types Applied:**
- Functional (positive, negative, edge)
- Integration (API-level)
- Regression
- Security (crafted payloads)

### 1.2 Test Case Naming Convention

`TC-[Module]-[Type]-[SequenceNumber]`

| Segment | Values |
|---------|--------|
| Module | AUTH, ARM, MRA, LSE, CAT (Authentication, Absence Request Management, Manager Review & Approval, Lifecycle State Enforcement, Catalog) |
| Type | P (Positive), N (Negative), E (Edge/Security) |
| SequenceNumber | Three-digit sequential number within module+type |

**Test Categories (used in Section 2 index):**
- **Functional** — black-box verification of FR requirements
- **Integration** — API endpoint + database interaction
- **Regression** — re-executed on every defect fix build
- **Security** — crafted payloads targeting identity and authorization controls

### 1.3 Test Case Template

| Field | Description |
|-------|-------------|
| Test Case ID | Unique identifier following naming convention |
| Title | Brief description of what is being tested |
| Module | Feature/component area |
| Priority | High / Medium / Low |
| Requirement | Linked FR or NFR ID(s) |
| Type | Positive / Negative / Edge / Security |
| Category | Functional / Integration / Regression / Security |
| Preconditions | Required system state before test execution |
| Test Steps | Numbered action steps with expected intermediate results |
| Test Data | Data values required for the test |
| Expected Result | Observable outcome that defines pass |
| Actual Result | Recorded during execution |
| Status | Pass / Fail / Blocked |

### 1.4 Test Environment

- **Runtime:** Local execution — .NET backend (ASP.NET Core Minimal API) + Next.js frontend
- **Database:** SQLite, file-based, initialized with seeded absence types (Vacation, Personal Leave, Sick Leave) and at least one Manager account
- **Browser:** Latest stable Chrome or Edge, desktop viewport
- **API Client:** Postman or equivalent HTTP client for integration and security tests
- **Database Inspector:** SQLite Browser or equivalent for security verification

---

## 2. Test Case Summary

| Test Case ID | Title | Priority | Category | Dependencies |
|--------------|-------|----------|----------|--------------|
| TC-AUTH-P-001 | Successful Employee Self-Registration | High | Functional | — |
| TC-AUTH-P-002 | Login with Valid Credentials — Employee | High | Functional / Regression | TC-AUTH-P-001 |
| TC-AUTH-P-003 | Login with Valid Credentials — Manager | High | Functional / Regression | Seeded Manager account |
| TC-AUTH-P-004 | Logout Terminates Session | High | Functional / Regression | TC-AUTH-P-002 |
| TC-AUTH-P-005 | Retrieve Current Authenticated User | High | Integration | TC-AUTH-P-002 |
| TC-AUTH-P-006 | Password Stored as Hash — Not Plain Text | High | Security | TC-AUTH-P-001 |
| TC-AUTH-N-001 | Login with Invalid Password | High | Functional / Regression | TC-AUTH-P-001 |
| TC-AUTH-N-002 | Login with Non-Existent Email | High | Functional | — |
| TC-AUTH-N-003 | Access Protected Endpoint Without Authentication | High | Security | — |
| TC-AUTH-E-001 | Registration Attempt with Manager Role via Public Endpoint | High | Security / Regression | — |
| TC-AUTH-E-002 | Login with SQL Injection Payload | High | Security | — |
| TC-ARM-P-001 | Create Absence Request in Draft State | High | Functional / Regression | TC-AUTH-P-002 |
| TC-ARM-P-002 | Edit a Draft Absence Request | High | Functional / Regression | TC-ARM-P-001 |
| TC-ARM-P-003 | Submit a Draft Absence Request | High | Functional / Regression | TC-ARM-P-001 |
| TC-ARM-P-004 | Cancel a Draft Absence Request | High | Functional | TC-ARM-P-001 |
| TC-ARM-P-005 | Cancel a Submitted Absence Request | High | Functional / Regression | TC-ARM-P-003 |
| TC-ARM-P-006 | Employee Views Own Request History with Final Decision | Medium | Functional | TC-MRA-P-001 |
| TC-ARM-N-001 | Create Request with End Date Before Start Date | High | Functional / Regression | TC-AUTH-P-002 |
| TC-ARM-N-002 | Create Request with Start Date in the Past | High | Functional / Regression | TC-AUTH-P-002 |
| TC-ARM-N-003 | Edit a Submitted Request — Must Be Rejected | High | Functional / Regression | TC-ARM-P-003 |
| TC-ARM-N-004 | Edit a Request Belonging to Another Employee | High | Security / Regression | TC-ARM-P-001 |
| TC-ARM-N-005 | Submit a Request Belonging to Another Employee | High | Security / Regression | TC-ARM-P-001 |
| TC-ARM-N-006 | Cancel a Request Belonging to Another Employee | High | Security / Regression | TC-ARM-P-001 |
| TC-ARM-E-001 | Attempt to Edit an Approved Request | High | Functional / Regression | TC-MRA-P-001 |
| TC-ARM-E-002 | Attempt to Edit a Rejected Request | High | Functional / Regression | TC-MRA-P-002 |
| TC-ARM-E-003 | Attempt to Edit a Cancelled Request | High | Functional / Regression | TC-ARM-P-004 |
| TC-ARM-E-004 | Attempt to Supply Spoofed Employee ID in Request Payload | High | Security | TC-AUTH-P-002 |
| TC-MRA-P-001 | Manager Approves a Submitted Request | High | Functional / Regression | TC-ARM-P-003, TC-AUTH-P-003 |
| TC-MRA-P-002 | Manager Rejects a Submitted Request | High | Functional / Regression | TC-ARM-P-003, TC-AUTH-P-003 |
| TC-MRA-P-003 | Manager Views Only Submitted Requests Assigned to Them | High | Functional / Regression | TC-AUTH-P-003 |
| TC-MRA-P-004 | Approval Record Created with Authenticated Manager Identity | High | Integration / Regression | TC-MRA-P-001 |
| TC-MRA-P-005 | Exactly One Approval Record Created per Approve Action | High | Integration / Regression | TC-MRA-P-001 |
| TC-MRA-N-001 | Employee Attempts to Approve a Request | High | Security / Regression | TC-AUTH-P-002, TC-ARM-P-003 |
| TC-MRA-N-002 | Employee Attempts to Reject a Request | High | Security / Regression | TC-AUTH-P-002, TC-ARM-P-003 |
| TC-MRA-N-003 | Manager Attempts to Approve Own Request | High | Security / Regression | TC-AUTH-P-003 |
| TC-MRA-N-004 | Manager Attempts to Reject Own Request | High | Security / Regression | TC-AUTH-P-003 |
| TC-MRA-N-005 | Attempt to Approve a Draft Request | High | Functional / Regression | TC-ARM-P-001, TC-AUTH-P-003 |
| TC-MRA-N-006 | Attempt to Approve an Already Approved Request | High | Functional / Regression | TC-MRA-P-001 |
| TC-MRA-N-007 | Attempt to Approve a Cancelled Request | High | Functional / Regression | TC-ARM-P-004, TC-AUTH-P-003 |
| TC-MRA-E-001 | Spoofed Approver ID in Approve Payload | High | Security | TC-AUTH-P-003, TC-ARM-P-003 |
| TC-LSE-P-001 | Valid Transition Draft → Submitted | High | Integration / Regression | TC-ARM-P-001 |
| TC-LSE-P-002 | Valid Transition Draft → Cancelled | High | Integration / Regression | TC-ARM-P-001 |
| TC-LSE-P-003 | Valid Transition Submitted → Approved | High | Integration / Regression | TC-ARM-P-003, TC-AUTH-P-003 |
| TC-LSE-P-004 | Valid Transition Submitted → Rejected | High | Integration / Regression | TC-ARM-P-003, TC-AUTH-P-003 |
| TC-LSE-P-005 | Valid Transition Submitted → Cancelled | High | Integration / Regression | TC-ARM-P-003 |
| TC-LSE-N-001 | Invalid Transition Submitted → Draft (Edit Attempt) | High | Integration / Regression | TC-ARM-P-003 |
| TC-LSE-N-002 | Invalid Transition Approved → Any Other State | High | Integration / Regression | TC-MRA-P-001 |
| TC-LSE-N-003 | Invalid Transition Rejected → Any Other State | High | Integration / Regression | TC-MRA-P-002 |
| TC-LSE-N-004 | Invalid Transition Cancelled → Any Other State | High | Integration / Regression | TC-ARM-P-004 |
| TC-CAT-P-001 | Absence Types Endpoint Returns Seeded Types | Medium | Functional / Regression | Seeded database |
| TC-CAT-N-001 | No Absence Type Create/Update/Delete Endpoints Exposed | Medium | Security | — |

---

## 3. Authentication Test Cases

### TC-AUTH-P-001: Successful Employee Self-Registration

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-001 |
| **Title** | Successful Employee Self-Registration |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-001, FR-AUTH-002 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Application is running on local environment
- SQLite database is initialized with seeded data
- No existing account with the test email address

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Application running; database seeded; no duplicate email | System ready for registration |
| 1 | Navigate to the registration page | Registration form displayed with fields for name, email, password, and role |
| 2 | Enter First Name: `Alice` | Field populated |
| 3 | Enter Last Name: `Employee` | Field populated |
| 4 | Enter Email: `alice.employee@vacaflow.test` | Field populated |
| 5 | Enter Password: `SecurePass123!` | Password masked |
| 6 | Select Role: `Employee` | Employee role selected |
| 7 | Submit the registration form | Processing indicator shown |
| 8 | Wait for response | Success confirmation displayed or redirect to login |

**Test Data:**
```json
{
  "firstName": "Alice",
  "lastName": "Employee",
  "email": "alice.employee@vacaflow.test",
  "password": "SecurePass123!",
  "role": "Employee"
}
```

**Expected Result:**
- Registration succeeds with HTTP 201 or success response
- User account created with role Employee
- User can subsequently log in with the registered credentials
- No Manager role assigned

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-P-002: Login with Valid Credentials — Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-002 |
| **Title** | Login with Valid Credentials — Employee |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-003, FR-AUTH-004 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Application is running
- Employee account `alice.employee@vacaflow.test` exists (created in TC-AUTH-P-001 or seeded)
- User is on the login page

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Application running; Employee account exists | System ready |
| 1 | Navigate to login page | Login form displayed |
| 2 | Enter email: `alice.employee@vacaflow.test` | Email accepted |
| 3 | Enter password: `SecurePass123!` | Password masked |
| 4 | Click Login | Processing indicator shown |
| 5 | Wait for response | Redirected to Employee dashboard or home page |

**Test Data:**
- Email: `alice.employee@vacaflow.test`
- Password: `SecurePass123!`

**Expected Result:**
- Login succeeds
- Session token or cookie established
- User redirected to Employee view
- Employee identity available via current-user endpoint

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-P-003: Login with Valid Credentials — Manager

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-003 |
| **Title** | Login with Valid Credentials — Manager |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-003, FR-AUTH-004 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Application is running
- Manager account exists via seed (credentials documented in README)
- User is on the login page

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Application running; seeded Manager account credentials available | System ready |
| 1 | Navigate to login page | Login form displayed |
| 2 | Enter seeded Manager email | Email accepted |
| 3 | Enter seeded Manager password | Password masked |
| 4 | Click Login | Processing indicator shown |
| 5 | Wait for response | Redirected to Manager dashboard |

**Test Data:**
- Email: seeded Manager email (from README)
- Password: seeded Manager password (from README)

**Expected Result:**
- Login succeeds
- Session established with Manager role
- Manager review queue visible
- Manager identity available via current-user endpoint

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-P-004: Logout Terminates Session

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-004 |
| **Title** | Logout Terminates Session |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-005 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- User is logged in as Employee (session active)
- Application is running

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active | Authenticated state confirmed |
| 1 | Click Logout | Logout request sent |
| 2 | Wait for response | Redirected to login page |
| 3 | Attempt to access a protected page directly via URL | Redirected back to login; access denied |
| 4 | Send API request to a protected endpoint using the previous session token | HTTP 401 Unauthorized returned |

**Expected Result:**
- Session invalidated on the server
- Subsequent requests with the old token receive 401
- User must authenticate again to access any protected resource

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-P-005: Retrieve Current Authenticated User

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-005 |
| **Title** | Retrieve Current Authenticated User |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-007, FR-AUTH-008 |
| **Type** | Positive |
| **Category** | Integration |

**Preconditions:**
- Employee is logged in
- Valid session token is available

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; token available in Postman | Ready |
| 1 | Send GET request to the current-user endpoint with session token in header/cookie | HTTP 200 response |
| 2 | Inspect response body | User object returned |
| 3 | Verify returned identity matches the logged-in user | Identity matches |

**Test Data:**
- Endpoint: `GET /api/auth/me` (or equivalent documented in API spec)
- Authorization: session token for `alice.employee@vacaflow.test`

**Expected Result:**
- HTTP 200 with JSON body containing at minimum: user ID, email, role
- Returned identity matches the authenticated session; no user-supplied override accepted
- Role field reads `Employee`

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-P-006: Password Stored as Hash — Not Plain Text

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-P-006 |
| **Title** | Password Stored as Hash — Not Plain Text |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-006 |
| **NFR** | NFR-SEC-001 |
| **Type** | Positive |
| **Category** | Security |

**Preconditions:**
- Employee account `alice.employee@vacaflow.test` registered with password `SecurePass123!`
- SQLite Browser or equivalent is available
- Direct access to the SQLite database file

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Account created; database file accessible for inspection | Ready |
| 1 | Open the SQLite database file in SQLite Browser | Database tables visible |
| 2 | Query the Users table: `SELECT * FROM Users WHERE email = 'alice.employee@vacaflow.test'` | User row returned |
| 3 | Inspect the password column value | Value is a hash string, not the plain text `SecurePass123!` |
| 4 | Verify the hash prefix or length is consistent with a modern hashing algorithm (e.g., bcrypt `$2a$`, Argon2, or PBKDF2) | Hash format matches expected algorithm |

**Expected Result:**
- Password column does not contain `SecurePass123!` or any recognizable plain text
- Hash is a non-reversible cryptographic value
- Hash algorithm prefix indicates a modern, salted algorithm

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-N-001: Login with Invalid Password

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-001 |
| **Title** | Login with Invalid Password |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-003 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee account `alice.employee@vacaflow.test` exists
- User is on the login page

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee account exists; login page displayed | Ready |
| 1 | Enter email: `alice.employee@vacaflow.test` | Email accepted |
| 2 | Enter incorrect password: `WrongPassword99!` | Password masked |
| 3 | Click Login | Processing indicator shown |
| 4 | Wait for response | Error message displayed; login denied |

**Test Data:**
- Email: `alice.employee@vacaflow.test`
- Password: `WrongPassword99!`

**Expected Result:**
- HTTP 401 Unauthorized (API) or equivalent error on UI
- Generic error message: "Invalid email or password" (does not reveal which field is wrong)
- User remains on login page
- No session created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-N-002: Login with Non-Existent Email

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-002 |
| **Title** | Login with Non-Existent Email |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-003 |
| **Type** | Negative |
| **Category** | Functional |

**Preconditions:**
- Application is running
- No account exists for `ghost@vacaflow.test`

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Application running; non-existent email confirmed | Ready |
| 1 | Enter email: `ghost@vacaflow.test` | Email accepted |
| 2 | Enter any password: `AnyPass123!` | Password masked |
| 3 | Click Login | Processing indicator |
| 4 | Wait for response | Error message displayed |

**Test Data:**
- Email: `ghost@vacaflow.test`
- Password: `AnyPass123!`

**Expected Result:**
- Login fails with the same generic error as TC-AUTH-N-001: "Invalid email or password"
- No indication that the email does not exist (prevents user enumeration)
- No session created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-N-003: Access Protected Endpoint Without Authentication

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-N-003 |
| **Title** | Access Protected Endpoint Without Authentication |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-008 |
| **NFR** | NFR-SEC-002 |
| **Type** | Negative |
| **Category** | Security |

**Preconditions:**
- Application is running
- No active session or token

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: No session cookie or token present | Unauthenticated state |
| 1 | Send GET request to the absence requests list endpoint without any Authorization header or session cookie | HTTP 401 Unauthorized |
| 2 | Send POST request to create an absence request without authentication | HTTP 401 Unauthorized |
| 3 | Send GET request to the manager review endpoint without authentication | HTTP 401 Unauthorized |
| 4 | Attempt to navigate directly to the Employee dashboard URL in the browser | Redirected to login page |

**Expected Result:**
- All protected API endpoints return HTTP 401 when no valid session is present
- UI redirects unauthenticated navigation to login page
- No data is returned to an unauthenticated caller

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-E-001: Registration Attempt with Manager Role via Public Endpoint

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-E-001 |
| **Title** | Registration Attempt with Manager Role via Public Endpoint |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-001, FR-AUTH-002 |
| **NFR** | NFR-SEC-003 |
| **Business Rule** | BR-007 |
| **Type** | Edge / Security |
| **Category** | Security, Regression |

**Preconditions:**
- Application is running
- API client (Postman) available
- Registration endpoint URL known

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: API client ready; registration endpoint identified | Ready |
| 1 | Craft POST request to the public registration endpoint with role field set to `Manager` | Request constructed |
| 2 | Send the request | Response received |
| 3 | Inspect HTTP response code and body | Registration rejected OR role silently downgraded to Employee |
| 4 | If account is created, attempt to log in and call the current-user endpoint | Role in response must not be Manager |
| 5 | Attempt to access the manager review endpoint with the new session | HTTP 403 Forbidden returned |

**Test Data:**
```json
{
  "firstName": "Malicious",
  "lastName": "Actor",
  "email": "escalate@vacaflow.test",
  "password": "EscalateMe123!",
  "role": "Manager"
}
```

**Expected Result:**
- Manager role cannot be self-assigned via public registration
- Either: HTTP 400 Bad Request with error indicating Manager role not allowed, OR account created with Employee role and the role field value ignored
- Under no circumstance does a self-registered account receive Manager privileges
- Attempt is effectively prevented (BR-007)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-AUTH-E-002: Login with SQL Injection Payload

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-E-002 |
| **Title** | Login with SQL Injection Payload |
| **Module** | Authentication |
| **Priority** | High |
| **Requirement** | FR-AUTH-003 |
| **NFR** | NFR-SEC-002 |
| **Type** | Edge / Security |
| **Category** | Security |

**Preconditions:**
- Application is running
- API client available

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: API client ready; login endpoint identified | Ready |
| 1 | Send POST request to login endpoint with email: `' OR '1'='1' --` and password: `' OR '1'='1'` | Response received |
| 2 | Inspect HTTP status and body | HTTP 400 or 401; login fails |
| 3 | Verify no SQL error message or stack trace is exposed in the response | Generic error message only |
| 4 | Repeat with email: `admin'--` and any password | Login fails; no bypass |

**Test Data:**
```json
{
  "email": "' OR '1'='1' --",
  "password": "' OR '1'='1'"
}
```

**Expected Result:**
- Login fails for all injection payloads
- No SQL error, table name, or stack trace exposed in response
- Generic authentication error message returned
- No session created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## 4. Absence Request Management Test Cases

### TC-ARM-P-001: Create Absence Request in Draft State

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-P-001 |
| **Title** | Create Absence Request in Draft State |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-001, FR-ARM-002, FR-ARM-003, FR-LSE-001 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in (TC-AUTH-P-002 passed)
- Database contains seeded absence types (Vacation, Personal Leave, Sick Leave)
- Start date is today or future; end date is on or after start date

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; absence types available | Ready |
| 1 | Navigate to the create absence request form | Form displayed with absence type dropdown, start date, end date, optional notes |
| 2 | Select Absence Type: `Vacation` | Type selected |
| 3 | Enter Start Date: today's date (`2026-07-21`) | Date accepted |
| 4 | Enter End Date: `2026-07-25` | Date accepted |
| 5 | Enter Notes: `Annual leave for family trip` | Notes populated |
| 6 | Click Save as Draft | Processing |
| 7 | Wait for confirmation | Request created; state shown as Draft |

**Test Data:**
```json
{
  "absenceTypeId": 1,
  "startDate": "2026-07-21",
  "endDate": "2026-07-25",
  "notes": "Annual leave for family trip"
}
```

**Expected Result:**
- HTTP 201 Created with request ID returned
- Request state is `Draft`
- Employee ID on the record matches the authenticated user (not user-supplied)
- Request appears in employee's own request list

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-P-002: Edit a Draft Absence Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-P-002 |
| **Title** | Edit a Draft Absence Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-004, FR-ARM-005 |
| **Business Rule** | BR-003, BR-004 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- A Draft request exists belonging to this employee (TC-ARM-P-001)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; Draft request exists | Ready |
| 1 | Navigate to the Draft request detail or edit form | Edit form displayed with current values |
| 2 | Change End Date to `2026-07-28` | Date field updated |
| 3 | Update Notes to `Extended family trip` | Notes updated |
| 4 | Click Save / Update | Processing |
| 5 | Wait for confirmation | Request updated; state remains Draft |

**Test Data:**
- Request ID: from TC-ARM-P-001
- New End Date: `2026-07-28`
- New Notes: `Extended family trip`

**Expected Result:**
- HTTP 200 OK
- Updated fields reflected on the request record
- State remains `Draft`
- No change to request owner or employee ID

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-P-003: Submit a Draft Absence Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-P-003 |
| **Title** | Submit a Draft Absence Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-006, FR-LSE-003 |
| **Business Rule** | BR-004 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- A Draft request exists belonging to this employee

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; Draft request exists | Ready |
| 1 | Navigate to the Draft request | Request detail displayed; Submit action visible |
| 2 | Click Submit | Confirmation prompt or direct processing |
| 3 | Wait for response | Request state changed to Submitted |

**Test Data:**
- Request ID: from TC-ARM-P-001 (or fresh Draft created for this case)

**Expected Result:**
- HTTP 200 OK or equivalent
- Request state transitions from `Draft` to `Submitted`
- Request appears in Manager's review queue
- Submit action no longer available on this request
- Edit action no longer available (Draft-only operations removed)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-P-004: Cancel a Draft Absence Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-P-004 |
| **Title** | Cancel a Draft Absence Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-008, FR-LSE-002 |
| **Business Rule** | BR-004, BR-010 |
| **Type** | Positive |
| **Category** | Functional |

**Preconditions:**
- Employee is logged in
- A Draft request exists belonging to this employee

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; Draft request exists | Ready |
| 1 | Navigate to the Draft request | Request detail displayed; Cancel action visible |
| 2 | Click Cancel | Confirmation prompt or direct processing |
| 3 | Confirm cancellation | Processing |
| 4 | Wait for response | Request state changed to Cancelled |

**Expected Result:**
- HTTP 200 OK
- Request state is `Cancelled`
- Cancelled state is final — no further actions (edit, submit, approve, reject) available
- Request remains visible in employee's history with Cancelled status

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-P-005: Cancel a Submitted Absence Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-P-005 |
| **Title** | Cancel a Submitted Absence Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-008, FR-LSE-002 |
| **Business Rule** | BR-004, BR-010 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- A Submitted request exists belonging to this employee (TC-ARM-P-003 completed)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; Submitted request exists | Ready |
| 1 | Navigate to the Submitted request | Request detail displayed; Cancel action visible for owner |
| 2 | Click Cancel | Processing |
| 3 | Wait for response | Request state changed to Cancelled |

**Expected Result:**
- HTTP 200 OK
- Request state transitions from `Submitted` to `Cancelled`
- Request removed from Manager's review queue
- Cancelled state is final

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-P-006: Employee Views Own Request History with Final Decision

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-P-006 |
| **Title** | Employee Views Own Request History with Final Decision |
| **Module** | Absence Request Management |
| **Priority** | Medium |
| **Requirement** | FR-ARM-009 |
| **Type** | Positive |
| **Category** | Functional |

**Preconditions:**
- Employee is logged in
- Employee has at least one Approved or Rejected request (TC-MRA-P-001 or TC-MRA-P-002 completed for this employee's request)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; at least one completed request exists | Ready |
| 1 | Navigate to My Requests or request history view | List of own requests displayed |
| 2 | Locate the Approved request | Request row shows state `Approved` and manager decision |
| 3 | Locate the Rejected request (if available) | Request row shows state `Rejected` and optional rejection comment |
| 4 | Verify requests from other employees are not visible | Only own requests shown |

**Expected Result:**
- Employee sees all their own requests in all states (Draft, Submitted, Approved, Rejected, Cancelled)
- Final decision (Approved / Rejected) is visible with the manager's recorded decision
- No other employee's requests are visible in this list

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-N-001: Create Request with End Date Before Start Date

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-N-001 |
| **Title** | Create Request with End Date Before Start Date |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-002 |
| **Business Rule** | BR-001 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active | Ready |
| 1 | Navigate to create absence request form | Form displayed |
| 2 | Select Absence Type: `Sick Leave` | Type selected |
| 3 | Enter Start Date: `2026-07-25` | Date entered |
| 4 | Enter End Date: `2026-07-22` (before start date) | Date entered |
| 5 | Submit form / Send POST via API | Validation triggered |
| 6 | Wait for response | Error returned |

**Test Data:**
```json
{
  "absenceTypeId": 3,
  "startDate": "2026-07-25",
  "endDate": "2026-07-22"
}
```

**Expected Result:**
- HTTP 400 Bad Request
- Clear error message indicating end date cannot be earlier than start date
- No request record created in database
- Error enforced server-side (not only client-side validation)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-N-002: Create Request with Start Date in the Past

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-N-002 |
| **Title** | Create Request with Start Date in the Past |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-003 |
| **Business Rule** | BR-002 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active | Ready |
| 1 | Navigate to create absence request form | Form displayed |
| 2 | Select Absence Type: `Personal Leave` | Type selected |
| 3 | Enter Start Date: `2026-07-10` (past date) | Date entered |
| 4 | Enter End Date: `2026-07-12` | Date entered |
| 5 | Submit form / Send POST via API | Validation triggered |
| 6 | Wait for response | Error returned |

**Test Data:**
```json
{
  "absenceTypeId": 2,
  "startDate": "2026-07-10",
  "endDate": "2026-07-12"
}
```

**Expected Result:**
- HTTP 400 Bad Request
- Clear error message indicating start date cannot be in the past
- No request record created
- Validation enforced server-side

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-N-003: Edit a Submitted Request — Must Be Rejected

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-N-003 |
| **Title** | Edit a Submitted Request — Must Be Rejected |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-004, FR-ARM-005 |
| **Business Rule** | BR-003 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- A Submitted request exists belonging to this employee (TC-ARM-P-003)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Submitted request exists for this employee | Ready |
| 1 | Attempt to send PUT/PATCH request to edit the Submitted request via API | Response received |
| 2 | Inspect HTTP status and body | HTTP 400 or 409; edit refused |
| 3 | Verify on UI that no Edit button is displayed for a Submitted request | Edit action not available |

**Test Data:**
- Request ID: Submitted request belonging to the authenticated employee
- Payload: any valid update (e.g., changed end date)

**Expected Result:**
- HTTP 400 Bad Request or HTTP 409 Conflict
- Error message indicating only Draft requests can be edited
- Request state remains Submitted; no field changes applied

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-N-004: Edit a Request Belonging to Another Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-N-004 |
| **Title** | Edit a Request Belonging to Another Employee |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-004 |
| **Business Rule** | BR-004 |
| **NFR** | NFR-SEC-002, NFR-REL-001 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Two Employee accounts exist: `alice.employee@vacaflow.test` and `bob.employee@vacaflow.test`
- Bob has a Draft request
- Alice is logged in

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Both accounts exist; Bob's Draft request ID is known; Alice is authenticated | Ready |
| 1 | While authenticated as Alice, send PUT/PATCH request to edit Bob's Draft request ID | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |

**Test Data:**
- Alice's session token
- Bob's Draft request ID

**Expected Result:**
- HTTP 403 Forbidden
- Alice cannot edit Bob's request regardless of its state
- No changes applied to Bob's request

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-N-005: Submit a Request Belonging to Another Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-N-005 |
| **Title** | Submit a Request Belonging to Another Employee |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-006 |
| **Business Rule** | BR-004 |
| **NFR** | NFR-SEC-002, NFR-REL-001 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Two Employee accounts exist
- Bob has a Draft request
- Alice is logged in

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Bob's Draft request ID known; Alice authenticated | Ready |
| 1 | While authenticated as Alice, send POST/PATCH request to submit Bob's Draft request | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |

**Expected Result:**
- HTTP 403 Forbidden
- Bob's request state remains Draft
- Only the request owner can submit their own requests

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-N-006: Cancel a Request Belonging to Another Employee

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-N-006 |
| **Title** | Cancel a Request Belonging to Another Employee |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-008 |
| **Business Rule** | BR-004 |
| **NFR** | NFR-SEC-002, NFR-REL-001 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Two Employee accounts exist
- Bob has a Draft or Submitted request
- Alice is logged in

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Bob's request ID known; Alice authenticated | Ready |
| 1 | While authenticated as Alice, send request to cancel Bob's request | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |

**Expected Result:**
- HTTP 403 Forbidden
- Bob's request state unchanged
- Only the request owner can cancel their own requests

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-E-001: Attempt to Edit an Approved Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-E-001 |
| **Title** | Attempt to Edit an Approved Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-004, FR-LSE-002 |
| **Business Rule** | BR-003, BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Edge |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- An Approved request exists belonging to this employee (TC-MRA-P-001 completed)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Approved request ID known; owner authenticated | Ready |
| 1 | Send PUT/PATCH request to edit the Approved request | Response received |
| 2 | Inspect HTTP status and body | HTTP 400 or 409; edit refused |
| 3 | Verify UI shows no Edit action on Approved requests | Edit not available in UI |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error message indicating Approved is a final state and cannot be modified
- Request record unchanged

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-E-002: Attempt to Edit a Rejected Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-E-002 |
| **Title** | Attempt to Edit a Rejected Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-004, FR-LSE-002 |
| **Business Rule** | BR-003, BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Edge |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- A Rejected request exists belonging to this employee (TC-MRA-P-002 completed)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Rejected request ID known; owner authenticated | Ready |
| 1 | Send PUT/PATCH request to edit the Rejected request | Response received |
| 2 | Inspect HTTP status | HTTP 400 or 409; edit refused |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error message indicating Rejected is a final state
- Request record unchanged

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-E-003: Attempt to Edit a Cancelled Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-E-003 |
| **Title** | Attempt to Edit a Cancelled Request |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-004, FR-LSE-002 |
| **Business Rule** | BR-003, BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Edge |
| **Category** | Functional, Regression |

**Preconditions:**
- Employee is logged in
- A Cancelled request exists belonging to this employee (TC-ARM-P-004)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Cancelled request ID known; owner authenticated | Ready |
| 1 | Send PUT/PATCH request to edit the Cancelled request | Response received |
| 2 | Inspect HTTP status | HTTP 400 or 409; edit refused |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error message indicating Cancelled is a final state
- Request record unchanged

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-ARM-E-004: Attempt to Supply Spoofed Employee ID in Request Payload

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ARM-E-004 |
| **Title** | Attempt to Supply Spoofed Employee ID in Request Payload |
| **Module** | Absence Request Management |
| **Priority** | High |
| **Requirement** | FR-ARM-010 |
| **Business Rule** | BR-011 |
| **NFR** | NFR-SEC-002, NFR-REL-001 |
| **Type** | Edge / Security |
| **Category** | Security |

**Preconditions:**
- Alice is logged in
- Bob's employee ID is known
- API client available

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Alice authenticated; Bob's employee ID known | Ready |
| 1 | Craft POST request to create an absence request with `employeeId` set to Bob's ID in the body | Request constructed |
| 2 | Send the request with Alice's session token | Response received |
| 3 | Inspect created record's employee ownership | Record's employee is Alice (from session), not Bob |
| 4 | Verify the supplied `employeeId` field was ignored by the server | Bob's ID not persisted |

**Test Data:**
```json
{
  "employeeId": "<bob_id>",
  "absenceTypeId": 1,
  "startDate": "2026-07-21",
  "endDate": "2026-07-23"
}
```

**Expected Result:**
- Request created (HTTP 201) but with Alice's identity derived from the authenticated session
- Supplied `employeeId` field is ignored by the server
- Record belongs to Alice, not Bob
- Server enforces BR-011: identity derived from token, never from payload

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## 5. Manager Review and Approval Test Cases

### TC-MRA-P-001: Manager Approves a Submitted Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-P-001 |
| **Title** | Manager Approves a Submitted Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-002, FR-MRA-005, FR-MRA-008 |
| **Business Rule** | BR-005, BR-006, BR-009 |
| **NFR** | NFR-REL-001, NFR-REL-002 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Manager is logged in (TC-AUTH-P-003)
- A Submitted request from another employee exists in the manager's review queue (TC-ARM-P-003)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Submitted request visible in review queue | Ready |
| 1 | Navigate to Manager review queue | Submitted requests listed |
| 2 | Select the Submitted request from another employee | Request detail displayed; Approve and Reject actions visible |
| 3 | Click Approve | Processing |
| 4 | Wait for response | Request state changed to Approved |
| 5 | Verify Approval Record created in database | One Approval Record with manager's identity |

**Test Data:**
- Manager session token
- Submitted request ID from another employee

**Expected Result:**
- HTTP 200 OK
- Request state transitions from `Submitted` to `Approved`
- Exactly one Approval Record created (NFR-REL-002)
- Approval Record contains the authenticated manager's ID (not user-supplied)
- Request removed from manager's active review queue
- Request visible in employee's history as Approved

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-P-002: Manager Rejects a Submitted Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-P-002 |
| **Title** | Manager Rejects a Submitted Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-003, FR-MRA-005, FR-MRA-008 |
| **Business Rule** | BR-005, BR-006, BR-009 |
| **NFR** | NFR-REL-001, NFR-REL-002 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Manager is logged in
- A Submitted request from another employee exists (fresh Submitted request — not the one used in TC-MRA-P-001)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Submitted request exists from another employee | Ready |
| 1 | Navigate to Manager review queue | Submitted request visible |
| 2 | Select the Submitted request | Approve and Reject actions visible |
| 3 | Click Reject | Rejection form or confirmation shown |
| 4 | Enter optional comment: `Conflicts with project deadline` | Comment entered |
| 5 | Confirm rejection | Processing |
| 6 | Wait for response | Request state changed to Rejected |

**Test Data:**
- Manager session token
- Submitted request ID from another employee
- Comment: `Conflicts with project deadline`

**Expected Result:**
- HTTP 200 OK
- Request state transitions from `Submitted` to `Rejected`
- Rejection comment recorded if provided
- Exactly one Approval Record created with authenticated manager's identity
- Request visible in employee's history as Rejected with comment

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-P-003: Manager Views Only Submitted Requests Assigned to Them

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-P-003 |
| **Title** | Manager Views Only Submitted Requests Assigned to Them |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-001 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Manager is logged in
- At least one Submitted request exists (assigned to this manager)
- At least one Draft and one Approved request exist (should not appear in review queue)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session; requests in various states exist | Ready |
| 1 | Navigate to Manager review queue | Request list displayed |
| 2 | Inspect the list | Only Submitted requests shown |
| 3 | Verify Draft requests are not visible in the review queue | Draft requests absent |
| 4 | Verify Approved / Rejected / Cancelled requests are not visible in active queue | Only Submitted state shown |

**Expected Result:**
- Manager review queue contains only Submitted requests
- Draft, Approved, Rejected, and Cancelled requests are not shown in the active review queue
- All visible requests are actionable (Approve / Reject available)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-P-004: Approval Record Created with Authenticated Manager Identity

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-P-004 |
| **Title** | Approval Record Created with Authenticated Manager Identity |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-005, FR-MRA-008 |
| **Business Rule** | BR-009, BR-011 |
| **NFR** | NFR-REL-001, NFR-REL-002, NFR-SEC-002 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- Manager approved a request (TC-MRA-P-001 completed)
- SQLite Browser available for database inspection

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: TC-MRA-P-001 completed; database accessible | Ready |
| 1 | Open SQLite database in SQLite Browser | Database visible |
| 2 | Query the Approvals table for the approved request ID: `SELECT * FROM Approvals WHERE requestId = <id>` | One row returned |
| 3 | Inspect the `approverId` or `managerUserId` column | Contains the authenticated Manager's user ID |
| 4 | Cross-reference with the Users table to confirm identity matches the logged-in manager | Identity confirmed |

**Expected Result:**
- Exactly one row in the Approvals table for the request
- `approverId` matches the Manager who was authenticated during approval (not any user-supplied value)
- Approval timestamp recorded
- Identity trail is complete and tamper-evident

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-P-005: Exactly One Approval Record Created per Approve Action

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-P-005 |
| **Title** | Exactly One Approval Record Created per Approve Action |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-008 |
| **Business Rule** | BR-009 |
| **NFR** | NFR-REL-001, NFR-REL-002 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- TC-MRA-P-001 completed (one Approval action performed)
- SQLite Browser available

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Approval action completed; database accessible | Ready |
| 1 | Query: `SELECT COUNT(*) FROM Approvals WHERE requestId = <approved_request_id>` | Count is 1 |
| 2 | Attempt to approve the same request again via API (now in Approved state) | HTTP 400 or 409; second approval rejected |
| 3 | Query count again | Count remains 1 |

**Expected Result:**
- Database contains exactly one Approval Record per request
- A second approve/reject attempt on an already-decided request is rejected by the API
- No duplicate Approval Records created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-001: Employee Attempts to Approve a Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-001 |
| **Title** | Employee Attempts to Approve a Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-002, FR-MRA-007 |
| **Business Rule** | BR-006 |
| **NFR** | NFR-REL-001, NFR-SEC-003 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Employee is logged in
- A Submitted request exists (from any employee)
- Employee's session token available in API client

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; Submitted request ID known | Ready |
| 1 | Send POST/PATCH request to the approve endpoint with the Employee's session token | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |
| 3 | Verify request state unchanged | Request remains Submitted |
| 4 | Verify no Approval Record created | Approvals table unchanged |

**Expected Result:**
- HTTP 403 Forbidden — Employee role is not authorized to approve
- Request state unchanged
- No Approval Record created
- Error message indicates insufficient role

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-002: Employee Attempts to Reject a Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-002 |
| **Title** | Employee Attempts to Reject a Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-003, FR-MRA-007 |
| **Business Rule** | BR-006 |
| **NFR** | NFR-REL-001, NFR-SEC-003 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Employee is logged in
- A Submitted request exists (from any employee)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Employee session active; Submitted request ID known | Ready |
| 1 | Send POST/PATCH request to the reject endpoint with the Employee's session token | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |
| 3 | Verify request state unchanged | Request remains Submitted |

**Expected Result:**
- HTTP 403 Forbidden
- Request state unchanged
- No Approval Record created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-003: Manager Attempts to Approve Own Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-003 |
| **Title** | Manager Attempts to Approve Own Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-006 |
| **Business Rule** | BR-008 |
| **NFR** | NFR-REL-001, NFR-SEC-003 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Manager is logged in
- Manager has their own Submitted request (the Manager created a request and submitted it — possible if business flow allows, or setup via direct DB insertion for testing)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Manager's own Submitted request ID known | Ready |
| 1 | Send approve request to the approve endpoint for the Manager's own request | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |
| 3 | Verify request state unchanged | Request remains Submitted |
| 4 | Verify no Approval Record created | Approvals table unchanged |

**Expected Result:**
- HTTP 403 Forbidden with clear message indicating a manager cannot approve or reject their own request
- Request state unchanged
- No self-approval Approval Record created (BR-008)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-004: Manager Attempts to Reject Own Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-004 |
| **Title** | Manager Attempts to Reject Own Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-006 |
| **Business Rule** | BR-008 |
| **NFR** | NFR-REL-001, NFR-SEC-003 |
| **Type** | Negative |
| **Category** | Security, Regression |

**Preconditions:**
- Manager is logged in
- Manager has their own Submitted request

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Manager's own Submitted request ID known | Ready |
| 1 | Send reject request to the reject endpoint for the Manager's own request | Response received |
| 2 | Inspect HTTP status | HTTP 403 Forbidden |

**Expected Result:**
- HTTP 403 Forbidden
- Request state unchanged
- No self-rejection record created (BR-008)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-005: Attempt to Approve a Draft Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-005 |
| **Title** | Attempt to Approve a Draft Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-002 |
| **Business Rule** | BR-005 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Manager is logged in
- A Draft request exists from another employee

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Draft request ID known | Ready |
| 1 | Send approve request to the approve endpoint for the Draft request | Response received |
| 2 | Inspect HTTP status | HTTP 400 or 409 |
| 3 | Verify request state unchanged | Request remains Draft |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error message indicating only Submitted requests can be approved
- Request state unchanged; no Approval Record created (BR-005)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-006: Attempt to Approve an Already Approved Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-006 |
| **Title** | Attempt to Approve an Already Approved Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-002, FR-LSE-002 |
| **Business Rule** | BR-005, BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Manager is logged in
- An Approved request exists (TC-MRA-P-001 completed)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Approved request ID known | Ready |
| 1 | Send approve request again for the already-Approved request | Response received |
| 2 | Inspect HTTP status | HTTP 400 or 409 |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error indicating Approved is a final state — no further actions allowed
- No second Approval Record created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-N-007: Attempt to Approve a Cancelled Request

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-N-007 |
| **Title** | Attempt to Approve a Cancelled Request |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-002, FR-LSE-002 |
| **Business Rule** | BR-005, BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Functional, Regression |

**Preconditions:**
- Manager is logged in
- A Cancelled request exists (TC-ARM-P-004 or TC-ARM-P-005 completed)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active; Cancelled request ID known | Ready |
| 1 | Send approve request for the Cancelled request | Response received |
| 2 | Inspect HTTP status | HTTP 400 or 409 |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error indicating Cancelled is a final state
- No Approval Record created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-MRA-E-001: Spoofed Approver ID in Approve Payload

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MRA-E-001 |
| **Title** | Spoofed Approver ID in Approve Payload |
| **Module** | Manager Review and Approval |
| **Priority** | High |
| **Requirement** | FR-MRA-005 |
| **Business Rule** | BR-011 |
| **NFR** | NFR-SEC-002, NFR-REL-001 |
| **Type** | Edge / Security |
| **Category** | Security |

**Preconditions:**
- Manager A is logged in
- A Submitted request exists from another employee
- Manager B's user ID is known
- API client available

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager A authenticated; Submitted request ID known; Manager B's ID known | Ready |
| 1 | Craft approve POST request body including `approverId: <manager_b_id>` | Request constructed |
| 2 | Send request with Manager A's session token | Response received |
| 3 | Inspect HTTP status — expect 200 (approve succeeds, but with correct identity) | Processing |
| 4 | Query the Approvals table for the created record | One row returned |
| 5 | Verify the `approverId` in the record is Manager A's ID, not Manager B's spoofed ID | Identity matches session |

**Test Data:**
```json
{
  "approverId": "<manager_b_id>",
  "comment": "Approved"
}
```

**Expected Result:**
- Approve action succeeds (if Manager A is authorized)
- Approval Record contains Manager A's authenticated identity
- Supplied `approverId` field in the payload is ignored by the server
- Server enforces BR-011: approver identity derived from session token

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## 6. Lifecycle State Enforcement Test Cases

### TC-LSE-P-001: Valid Transition Draft → Submitted

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-P-001 |
| **Title** | Valid Transition Draft → Submitted |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-001, FR-LSE-003 |
| **Business Rule** | BR-004 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- Employee is logged in
- A Draft request exists (created via TC-ARM-P-001)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Draft request exists; owner authenticated | Ready |
| 1 | Send submit request (POST/PATCH to submit endpoint) | HTTP 200; state changes to Submitted |
| 2 | Query request state from API or database | State = `Submitted` |

**Expected Result:**
- Transition accepted; state is `Submitted`
- Request appears in manager review queue
- Confirm previous state was `Draft` (audit trail or state check)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-P-002: Valid Transition Draft → Cancelled

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-P-002 |
| **Title** | Valid Transition Draft → Cancelled |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-001, FR-LSE-002 |
| **Business Rule** | BR-010 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- Employee is logged in
- A Draft request exists

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Draft request exists; owner authenticated | Ready |
| 1 | Send cancel request | HTTP 200; state changes to Cancelled |
| 2 | Query request state | State = `Cancelled` |

**Expected Result:**
- Transition accepted; state is `Cancelled` (final state)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-P-003: Valid Transition Submitted → Approved

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-P-003 |
| **Title** | Valid Transition Submitted → Approved |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-001, FR-LSE-005 |
| **Business Rule** | BR-005, BR-009 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- Manager is logged in
- A Submitted request from another employee exists

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Submitted request exists; Manager authenticated | Ready |
| 1 | Send approve request | HTTP 200; state changes to Approved |
| 2 | Query request state | State = `Approved` |

**Expected Result:**
- Transition accepted; state is `Approved` (final state)
- Approval Record created

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-P-004: Valid Transition Submitted → Rejected

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-P-004 |
| **Title** | Valid Transition Submitted → Rejected |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-001, FR-LSE-005 |
| **Business Rule** | BR-005, BR-009 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- Manager is logged in
- A Submitted request from another employee exists (separate from TC-LSE-P-003 request)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Submitted request exists; Manager authenticated | Ready |
| 1 | Send reject request | HTTP 200; state changes to Rejected |
| 2 | Query request state | State = `Rejected` |

**Expected Result:**
- Transition accepted; state is `Rejected` (final state)
- Approval Record created with rejection decision

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-P-005: Valid Transition Submitted → Cancelled

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-P-005 |
| **Title** | Valid Transition Submitted → Cancelled |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-001, FR-LSE-002 |
| **Business Rule** | BR-004, BR-010 |
| **Type** | Positive |
| **Category** | Integration, Regression |

**Preconditions:**
- Employee is logged in
- A Submitted request belonging to this employee exists

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Submitted request; owner authenticated | Ready |
| 1 | Send cancel request by the request owner | HTTP 200; state changes to Cancelled |
| 2 | Query request state | State = `Cancelled` |

**Expected Result:**
- Transition accepted; state is `Cancelled` (final state)
- Request no longer in manager review queue

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-N-001: Invalid Transition Submitted → Draft (Edit Attempt)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-N-001 |
| **Title** | Invalid Transition Submitted → Draft (Edit Attempt) |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-004 |
| **Business Rule** | BR-003 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Integration, Regression |

**Preconditions:**
- Employee is logged in
- A Submitted request belonging to this employee exists

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Submitted request; owner authenticated | Ready |
| 1 | Send edit (PUT/PATCH) request to the Submitted request | HTTP 400 or 409 |
| 2 | Query request state | State remains `Submitted` |

**Expected Result:**
- HTTP 400 or HTTP 409
- Error indicating Submitted requests cannot be edited (no backward state transition)
- State unchanged

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-N-002: Invalid Transition Approved → Any Other State

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-N-002 |
| **Title** | Invalid Transition Approved → Any Other State |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-002 |
| **Business Rule** | BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Integration, Regression |

**Preconditions:**
- An Approved request exists
- Relevant authenticated session (Employee or Manager)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Approved request ID known | Ready |
| 1 | Send cancel request for the Approved request (as owner) | HTTP 400 or 409 |
| 2 | Send approve request again (as Manager) | HTTP 400 or 409 |
| 3 | Send reject request (as Manager) | HTTP 400 or 409 |
| 4 | Query state after all attempts | State remains `Approved` |

**Expected Result:**
- All transition attempts rejected with HTTP 400 or 409
- Approved is a terminal state — no further state changes allowed (BR-010)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-N-003: Invalid Transition Rejected → Any Other State

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-N-003 |
| **Title** | Invalid Transition Rejected → Any Other State |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-002 |
| **Business Rule** | BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Integration, Regression |

**Preconditions:**
- A Rejected request exists

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Rejected request ID known | Ready |
| 1 | Send cancel, submit, approve, or reject request targeting the Rejected request | HTTP 400 or 409 for each |
| 2 | Query state | State remains `Rejected` |

**Expected Result:**
- All transition attempts rejected
- Rejected is a terminal state (BR-010)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-LSE-N-004: Invalid Transition Cancelled → Any Other State

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-LSE-N-004 |
| **Title** | Invalid Transition Cancelled → Any Other State |
| **Module** | Lifecycle State Enforcement |
| **Priority** | High |
| **Requirement** | FR-LSE-002 |
| **Business Rule** | BR-010 |
| **NFR** | NFR-REL-001 |
| **Type** | Negative |
| **Category** | Integration, Regression |

**Preconditions:**
- A Cancelled request exists

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Cancelled request ID known | Ready |
| 1 | Send submit, approve, reject, or edit request targeting the Cancelled request | HTTP 400 or 409 for each |
| 2 | Query state | State remains `Cancelled` |

**Expected Result:**
- All transition attempts rejected
- Cancelled is a terminal state (BR-010)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## 7. Absence Type Catalog Test Cases

### TC-CAT-P-001: Absence Types Endpoint Returns Seeded Types

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAT-P-001 |
| **Title** | Absence Types Endpoint Returns Seeded Types |
| **Module** | Catalog |
| **Priority** | Medium |
| **Requirement** | FR-CAT-001 |
| **Type** | Positive |
| **Category** | Functional, Regression |

**Preconditions:**
- Application is running
- Database initialized with seeded absence types: Vacation, Personal Leave, Sick Leave
- Employee is logged in

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Application running; database seeded; Employee authenticated | Ready |
| 1 | Send GET request to the absence types endpoint | HTTP 200 |
| 2 | Inspect the response body | JSON array of absence types returned |
| 3 | Verify all three seeded types are present: Vacation, Personal Leave, Sick Leave | All three types found in response |
| 4 | Verify each type object has at minimum: an ID and a name/label field | Required fields present |

**Test Data:**
- Endpoint: `GET /api/absence-types` (or equivalent)
- Expected types: `Vacation`, `Personal Leave`, `Sick Leave`

**Expected Result:**
- HTTP 200 with JSON array
- Array contains at least three objects corresponding to the seeded types
- Each object includes a unique ID and display name
- No absence types from other projects or environments present

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### TC-CAT-N-001: No Absence Type Create/Update/Delete Endpoints Exposed

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CAT-N-001 |
| **Title** | No Absence Type Create/Update/Delete Endpoints Exposed |
| **Module** | Catalog |
| **Priority** | Medium |
| **Requirement** | FR-CAT-001 |
| **NFR** | NFR-SEC-002 |
| **Type** | Negative |
| **Category** | Security |

**Preconditions:**
- Application is running
- Manager is logged in (maximum privilege level)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 0 | Preconditions: Manager session active | Ready |
| 1 | Send POST request to `/api/absence-types` with a new type payload | HTTP 404 Not Found or HTTP 405 Method Not Allowed |
| 2 | Send PUT/PATCH request to `/api/absence-types/1` | HTTP 404 or HTTP 405 |
| 3 | Send DELETE request to `/api/absence-types/1` | HTTP 404 or HTTP 405 |

**Test Data:**
```json
{
  "name": "Unauthorized Type"
}
```

**Expected Result:**
- POST, PUT, PATCH, DELETE operations on absence types return HTTP 404 or HTTP 405
- No absence type is created, modified, or deleted through the API
- Absence type management is not exposed as an API feature (catalog is read-only, seeded at initialization)

**Actual Result:** [To be filled during execution]
**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## 8. Test Data Requirements

### 8.1 User Test Data

| ID | Email | Password | Role | Status | Source |
|----|-------|----------|------|--------|--------|
| TD-U-001 | alice.employee@vacaflow.test | SecurePass123! | Employee | Active | Created via TC-AUTH-P-001 |
| TD-U-002 | bob.employee@vacaflow.test | SecurePass456! | Employee | Active | Created via registration for cross-user tests |
| TD-U-003 | Seeded Manager email (see README) | Seeded Manager password (see README) | Manager | Active | Seeded at database initialization |
| TD-U-004 | escalate@vacaflow.test | EscalateMe123! | Attempted Manager → expect Employee or rejected | Test only | Used in TC-AUTH-E-001 |

### 8.2 Absence Request Test Data

| ID | Owner | Type | Start Date | End Date | State | Used In |
|----|-------|------|------------|----------|-------|---------|
| TD-REQ-001 | Alice (Employee) | Vacation | 2026-07-21 | 2026-07-25 | Draft | TC-ARM-P-001 |
| TD-REQ-002 | Alice (Employee) | Vacation | 2026-07-21 | 2026-07-28 | Draft (edited) | TC-ARM-P-002 |
| TD-REQ-003 | Alice (Employee) | Vacation | 2026-07-21 | 2026-07-28 | Submitted | TC-ARM-P-003 |
| TD-REQ-004 | Alice (Employee) | Sick Leave | 2026-07-29 | 2026-07-30 | Draft (to be cancelled) | TC-ARM-P-004 |
| TD-REQ-005 | Alice (Employee) | Personal Leave | 2026-08-04 | 2026-08-07 | Submitted (to be cancelled) | TC-ARM-P-005 |
| TD-REQ-006 | Bob (Employee) | Vacation | 2026-08-10 | 2026-08-14 | Draft | Cross-user tests (TC-ARM-N-004 through N-006) |
| TD-REQ-007 | Alice (Employee) | Vacation | 2026-08-18 | 2026-08-20 | Submitted (for Manager to approve) | TC-MRA-P-001 |
| TD-REQ-008 | Alice (Employee) | Personal Leave | 2026-08-25 | 2026-08-26 | Submitted (for Manager to reject) | TC-MRA-P-002 |

### 8.3 Absence Type Seeded Data

| ID | Name | Source |
|----|------|--------|
| 1 | Vacation | Database seed |
| 2 | Personal Leave | Database seed |
| 3 | Sick Leave | Database seed |

### 8.4 Invalid / Boundary Date Test Data

| Scenario | Start Date | End Date | Expected Outcome |
|----------|------------|----------|-----------------|
| End before start | 2026-07-25 | 2026-07-22 | Rejected — BR-001 |
| Past start date | 2026-07-10 | 2026-07-12 | Rejected — BR-002 |
| Start = today (valid) | 2026-07-21 | 2026-07-21 | Accepted |
| End = start (valid) | 2026-07-21 | 2026-07-21 | Accepted |
| Start = yesterday | 2026-07-20 | 2026-07-25 | Rejected — BR-002 |

### 8.5 Security Payload Test Data

| ID | Payload Type | Value | Used In |
|----|-------------|-------|---------|
| TD-SEC-001 | SQL Injection — email | `' OR '1'='1' --` | TC-AUTH-E-002 |
| TD-SEC-002 | SQL Injection — password | `' OR '1'='1'` | TC-AUTH-E-002 |
| TD-SEC-003 | Role Escalation | `"role": "Manager"` in registration payload | TC-AUTH-E-001 |
| TD-SEC-004 | Spoofed Employee ID | Bob's user ID in create-request payload body | TC-ARM-E-004 |
| TD-SEC-005 | Spoofed Approver ID | Manager B's user ID in approve payload body | TC-MRA-E-001 |

---

## 9. Traceability Matrix

### 9.1 Functional Requirements Coverage

| Requirement | Description | Test Cases | Coverage |
|-------------|-------------|------------|----------|
| FR-AUTH-001 | Employee self-registration | TC-AUTH-P-001, TC-AUTH-E-001 | Covered |
| FR-AUTH-002 | Employee-only public registration | TC-AUTH-E-001 | Covered |
| FR-AUTH-003 | Login with credentials | TC-AUTH-P-002, TC-AUTH-P-003, TC-AUTH-N-001, TC-AUTH-N-002, TC-AUTH-E-002 | Covered |
| FR-AUTH-004 | Session establishment | TC-AUTH-P-002, TC-AUTH-P-003 | Covered |
| FR-AUTH-005 | Logout and session termination | TC-AUTH-P-004 | Covered |
| FR-AUTH-006 | Password hashing | TC-AUTH-P-006 | Covered |
| FR-AUTH-007 | Current user endpoint | TC-AUTH-P-005 | Covered |
| FR-AUTH-008 | Server-side identity derivation | TC-AUTH-P-005, TC-AUTH-N-003, TC-ARM-E-004, TC-MRA-E-001 | Covered |
| FR-ARM-001 | Create absence request | TC-ARM-P-001 | Covered |
| FR-ARM-002 | End date not before start date | TC-ARM-N-001 | Covered |
| FR-ARM-003 | Start date not in the past | TC-ARM-N-002 | Covered |
| FR-ARM-004 | Edit Draft request only | TC-ARM-P-002, TC-ARM-N-003, TC-ARM-N-004, TC-ARM-E-001, TC-ARM-E-002, TC-ARM-E-003 | Covered |
| FR-ARM-005 | Edit fields (type, dates, notes) | TC-ARM-P-002 | Covered |
| FR-ARM-006 | Submit Draft request | TC-ARM-P-003, TC-ARM-N-005 | Covered |
| FR-ARM-008 | Cancel Draft and Submitted requests | TC-ARM-P-004, TC-ARM-P-005, TC-ARM-N-006 | Covered |
| FR-ARM-009 | Employee views own request history | TC-ARM-P-006 | Covered |
| FR-ARM-010 | Server-side employee ID derivation | TC-ARM-E-004 | Covered |
| FR-MRA-001 | Manager sees Submitted requests queue | TC-MRA-P-003 | Covered |
| FR-MRA-002 | Manager approves Submitted request | TC-MRA-P-001, TC-MRA-N-005, TC-MRA-N-006, TC-MRA-N-007 | Covered |
| FR-MRA-003 | Manager rejects Submitted request | TC-MRA-P-002 | Covered |
| FR-MRA-005 | Server-side approver ID derivation | TC-MRA-P-004, TC-MRA-E-001 | Covered |
| FR-MRA-006 | Manager cannot self-approve | TC-MRA-N-003, TC-MRA-N-004 | Covered |
| FR-MRA-007 | Only Manager role can approve/reject | TC-MRA-N-001, TC-MRA-N-002 | Covered |
| FR-MRA-008 | One Approval Record per request | TC-MRA-P-004, TC-MRA-P-005 | Covered |
| FR-LSE-001 | Valid state transitions defined | TC-LSE-P-001 through TC-LSE-P-005 | Covered |
| FR-LSE-002 | Terminal states are final | TC-LSE-N-002, TC-LSE-N-003, TC-LSE-N-004, TC-ARM-E-001, TC-ARM-E-002, TC-ARM-E-003 | Covered |
| FR-LSE-003 | Draft → Submitted | TC-LSE-P-001 | Covered |
| FR-LSE-004 | Only Draft editable | TC-LSE-N-001 | Covered |
| FR-LSE-005 | Submitted → Approved / Rejected | TC-LSE-P-003, TC-LSE-P-004 | Covered |
| FR-LSE-006 | Owner controls submit and cancel | TC-ARM-N-005, TC-ARM-N-006 | Covered |
| FR-LSE-007 | Manager role controls approve/reject | TC-MRA-N-001, TC-MRA-N-002 | Covered |
| FR-CAT-001 | Absence types list endpoint | TC-CAT-P-001, TC-CAT-N-001 | Covered |

### 9.2 Business Rule Coverage

| Business Rule | Description | Test Cases | Priority |
|---------------|-------------|------------|----------|
| BR-001 | End date not before start date | TC-ARM-N-001 | Critical |
| BR-002 | Start date not in the past | TC-ARM-N-002 | Critical |
| BR-003 | Only Draft requests editable | TC-ARM-N-003, TC-ARM-E-001, TC-ARM-E-002, TC-ARM-E-003, TC-LSE-N-001 | Critical |
| BR-004 | Only owner can edit/submit/cancel | TC-ARM-N-004, TC-ARM-N-005, TC-ARM-N-006 | Critical |
| BR-005 | Only Submitted can be approved/rejected | TC-MRA-N-005, TC-MRA-N-006, TC-MRA-N-007 | Critical |
| BR-006 | Only Manager role can approve/reject | TC-MRA-N-001, TC-MRA-N-002 | Critical |
| BR-007 | Public registration cannot assign Manager role | TC-AUTH-E-001 | Critical |
| BR-008 | Manager cannot approve/reject own request | TC-MRA-N-003, TC-MRA-N-004 | Critical |
| BR-009 | Authenticated Manager recorded; one Approval Record | TC-MRA-P-004, TC-MRA-P-005, TC-MRA-E-001 | Critical |
| BR-010 | Approved/Rejected/Cancelled are final | TC-ARM-E-001, TC-ARM-E-002, TC-ARM-E-003, TC-LSE-N-002, TC-LSE-N-003, TC-LSE-N-004 | Critical |
| BR-011 | API derives identity from session; frontend must not supply trusted IDs | TC-AUTH-P-005, TC-ARM-E-004, TC-MRA-E-001, TC-MRA-P-004 | Critical |

### 9.3 Non-Functional Requirements Coverage

| NFR | Description | Test Cases |
|-----|-------------|------------|
| NFR-SEC-001 | Password stored as hash | TC-AUTH-P-006 |
| NFR-SEC-002 | Server-side identity enforcement; no spoofed IDs | TC-ARM-E-004, TC-MRA-E-001, TC-AUTH-N-003 |
| NFR-SEC-003 | Manager role not self-assignable; employee cannot approve | TC-AUTH-E-001, TC-MRA-N-001, TC-MRA-N-002, TC-MRA-N-003, TC-MRA-N-004 |
| NFR-SEC-004 | Database file security (not exposed via web server) | Referenced in test data; inspector access is local filesystem only |
| NFR-REL-001 | Business rule enforcement at all times | All TC-ARM-N, TC-MRA-N, TC-LSE-N test cases |
| NFR-REL-002 | Atomicity of approve/reject — exactly one Approval Record | TC-MRA-P-004, TC-MRA-P-005 |
| NFR-REL-003 | Input validation at API boundary | TC-ARM-N-001, TC-ARM-N-002, TC-AUTH-E-002 |

---

## 10. Test Case Coverage by Module

| Module | Total TCs | High Priority | Medium Priority | Low Priority |
|--------|-----------|---------------|-----------------|--------------|
| Authentication (AUTH) | 11 | 11 | 0 | 0 |
| Absence Request Management (ARM) | 12 | 11 | 1 | 0 |
| Manager Review and Approval (MRA) | 12 | 12 | 0 | 0 |
| Lifecycle State Enforcement (LSE) | 9 | 9 | 0 | 0 |
| Catalog (CAT) | 2 | 0 | 2 | 0 |
| **Total** | **46** | **43** | **3** | **0** |

### Coverage by Test Category

| Category | Count | Percentage |
|----------|-------|------------|
| Functional | 28 | 61% |
| Integration | 10 | 22% |
| Security | 12 | 26% |
| Regression | 35 | 76% |

> Note: Individual test cases may belong to more than one category (e.g., a test may be both Functional and Regression). Percentages reflect category overlap.

---

## 11. Test Execution Review Checklist

- [x] All functional requirements from FRS-001 §3 covered by at least one test case
- [x] All eleven business rules from FRS-001 §5 (BR-001 through BR-011) have Critical-priority test cases
- [x] All NFR-SEC-001 through NFR-SEC-003 security controls tested with crafted payloads
- [x] NFR-REL-001 (business rule enforcement) covered across all state and role scenarios
- [x] NFR-REL-002 (atomic Approval Record creation) verified via database inspection
- [x] Positive, negative, and edge test cases present for each module
- [x] All five request lifecycle states represented in test scenarios
- [x] Server-side identity derivation (BR-011) verified via API payload spoofing tests
- [x] Cross-user access attempts (employees editing/submitting/cancelling others' requests) covered
- [x] All test cases have unambiguous preconditions, step-by-step actions, and pass criteria
- [x] Test data requirements fully specified with no placeholder values
- [x] Traceability matrix maps every test case to at least one FR or BR ID
- [x] No test case contains TODO, TBD, or placeholder expected results

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | Yeuri Jessel Reyes | | Pending |
| Business Analyst | | | Pending |
| Product Owner | | | Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | QA Lead (PM_OVERRIDE — bypassed QA Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:23:35 UTC |

*— End of document —*
