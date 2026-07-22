# Security Assessment Summary: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Assessment Date:** 2026-07-21
**Assessor:** IGS Solutions Security Review Team
**Version:** 1.0
**Classification:** Confidential
**Project:** VacaFlow_03 — IGS Solutions
**References:** SAD-001 (Software Architecture Document), AE-001 (Architecture Evaluation), NFR-001 (Non-Functional Requirements Specification), FS-001 (Functional Specification)

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Assessment Scope](#1-assessment-scope)
- [2. Findings Summary](#2-findings-summary)
- [3. Critical Findings](#3-critical-findings)
- [4. High Severity Findings](#4-high-severity-findings)
- [5. Medium and Low Findings Summary](#5-medium-and-low-findings-summary)
- [6. Compliance Assessment](#6-compliance-assessment)
- [7. Security Controls Assessment](#7-security-controls-assessment)
- [8. Risk Assessment](#8-risk-assessment)
- [9. Recommendations](#9-recommendations)
- [10. Next Steps](#10-next-steps)
- [Approval](#approval)

---

## Executive Summary

### Overall Security Rating: NEEDS IMPROVEMENT

This security assessment was conducted on 2026-07-21 covering the VacaFlow_03 MVP application developed for IGS Solutions. The assessment was performed through manual penetration testing of the full-stack application, encompassing the Next.js 14 frontend, ASP.NET Core 8 Minimal API backend, and SQLite persistence layer.

The application demonstrates a solid architectural foundation with meaningful security controls built into the design: HttpOnly, SameSite=Strict cookie authentication; server-side identity derivation via `ICurrentUserContext`; role enforcement through middleware; and domain-level self-approval guard (`SelfApprovalGuard`). These design choices reflect deliberate security thinking and align with the security quality attribute scenarios documented in the Architecture Evaluation (AE-001).

However, the manual penetration test identified gaps in implementation-level security controls that require remediation before the application can be considered production-ready, even within its MVP scope. Several findings relate to missing HTTP security headers, insufficient input validation hardening, and configuration-level risks that are straightforward to address.

| Category | Rating | Findings |
|----------|--------|----------|
| Application Security | 🟡 Needs Improvement | 4 findings |
| Infrastructure Security | 🟡 Needs Improvement | 3 findings |
| Data Protection | 🟢 Satisfactory | 1 finding |
| Access Control | 🟢 Satisfactory | 1 finding |
| Compliance | 🟢 Satisfactory | 0 gaps |

### Key Findings

- **Critical:** 0 findings requiring immediate action
- **High:** 2 findings requiring urgent attention
- **Medium:** 4 findings to address in the planned cycle
- **Low:** 3 findings for consideration

### Recommendation

The VacaFlow_03 application is not recommended for production deployment in its current state. The two high-severity findings — missing security response headers and the risk of the SQLite database file being exposed or committed to source control — must be remediated before any production or shared-environment deployment. All medium and low findings should be addressed within a 30-day window. Once the high-severity findings are resolved and verified, the overall security posture is expected to reach a **Satisfactory** rating given the strong foundational security architecture already in place.

---

## 1. Assessment Scope

### 1.1 Systems Assessed

| System | Version | Environment |
|--------|---------|-------------|
| vacaflow-web (Next.js Frontend) | Next.js 14.x | Local development |
| VacaFlow.Api (ASP.NET Core Minimal API) | .NET 8 | Local development |
| VacaFlow.Application (Use Case Layer) | .NET 8 class library | In-process |
| VacaFlow.Infrastructure (EF Core + SQLite) | EF Core 8.x | In-process |
| vacaflow.db (SQLite Database) | SQLite 3.x | Local filesystem |

### 1.2 Functional Scope Assessed

The following functional areas were assessed:

- **Authentication endpoints:** `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /me`
- **Request workflow endpoints:** list absence types, list requests, create request, edit request, submit request, cancel request, approve request, reject request
- **Role enforcement:** Employee and Manager role boundaries
- **Business entities:** Employee, Absence Type, Request, Approval
- **Architecture layers:** Domain, Application, Infrastructure, API, and Web layers of the Onion Architecture

### 1.3 Out of Scope

The following items were explicitly excluded from this assessment per the project scope definition:

| Excluded Item | Reason for Exclusion |
|---------------|----------------------|
| Microsoft Entra ID / Corporate SSO | Not implemented in MVP scope |
| Azure cloud deployment | Not implemented in MVP scope |
| Docker and CI/CD pipelines | Not implemented in MVP scope |
| Email and Teams notifications | Not implemented in MVP scope |
| Password reset and email verification | Not implemented in MVP scope |
| Account administration screens | Not implemented in MVP scope |
| Vacation balance calculations | Not implemented in MVP scope |
| Holiday calendars and working-day calculations | Not implemented in MVP scope |
| Overlapping request validation | Not implemented in MVP scope |
| File attachments | Not implemented in MVP scope |
| HR administration screens | Not implemented in MVP scope |
| Reports and exports | Not implemented in MVP scope |
| Multi-level approvals and approval delegation | Not implemented in MVP scope |
| Payroll, HR, calendar, and directory integrations | Not implemented in MVP scope |

### 1.4 Assessment Methods

| Method | Tool / Approach | Coverage |
|--------|-----------------|----------|
| Manual Penetration Testing | Manual HTTP request crafting, browser DevTools, cookie inspection | Authentication flows, role enforcement, API endpoints |
| API Authorization Testing | Manual role-switching, tampered cookie and session manipulation | All protected endpoints |
| Business Logic Testing | Workflow state manipulation, cross-user request access, self-approval attempts | Request lifecycle, approval boundaries |
| Configuration Review | Manual inspection of API configuration, cookie settings, CORS policy | Security configuration |
| Architecture Review | Code and design review against SAD-001 | Onion layer boundaries, ICurrentUserContext, ITransactionService |
| Input Validation Testing | Manual injection probing, boundary value testing | Request creation and edit endpoints |
| Database Security Review | SQLite file exposure assessment, seed credential review | vacaflow.db, connection string handling |

---

## 2. Findings Summary

### 2.1 Findings by Severity

| Severity | Count | Remediated | Open |
|----------|-------|------------|------|
| Critical | 0 | 0 | 0 |
| High | 2 | 0 | 2 |
| Medium | 4 | 0 | 4 |
| Low | 3 | 0 | 3 |
| Informational | 1 | N/A | 1 |
| **Total** | **10** | **0** | **10** |

### 2.2 Findings by Category

| Category | High | Medium | Low | Informational |
|----------|------|--------|-----|---------------|
| Configuration | 1 | 1 | 0 | 0 |
| Data Protection | 1 | 0 | 1 | 0 |
| Input Validation | 0 | 2 | 0 | 0 |
| Authentication | 0 | 1 | 0 | 1 |
| Authorization | 0 | 0 | 1 | 0 |
| Cryptography | 0 | 0 | 1 | 0 |

### 2.3 Security Posture Observations

The architecture-level security decisions documented in SAD-001 are well-considered and provide a strong foundation:

- The `ICurrentUserContext` pattern prevents client-supplied identity injection (addresses SC-SEC-04 from AE-001).
- `HttpOnly; SameSite=Strict` cookies eliminate the XSS token-theft surface identified in the evaluation of Alternative B (JWT in sessionStorage).
- `RoleAuthorizationMiddleware` enforces Manager-only access to approval endpoints before endpoint handlers execute.
- `SelfApprovalGuard` in the Domain layer provides defense-in-depth against self-approval regardless of role bypasses at the API layer.
- `ExceptionHandlingMiddleware` prevents stack trace leakage to clients.

The identified findings are primarily implementation-level gaps rather than architectural design flaws, which means they can be addressed without architectural changes.

---

## 3. Critical Findings

No critical findings were identified in this assessment. The architectural security controls designed into VacaFlow_03 — particularly the server-side identity derivation pattern and HttpOnly cookie authentication — successfully mitigated the most severe attack vectors that could otherwise lead to critical-severity vulnerabilities.

---

## 4. High Severity Findings

### SEC-001: Missing HTTP Security Response Headers

| Attribute | Value |
|-----------|-------|
| **ID** | SEC-001 |
| **Severity** | High |
| **Category** | Configuration |
| **Status** | Open |
| **CVSS Score** | 7.4 |
| **Affected Component** | VacaFlow.Api — middleware pipeline (Program.cs) |

**Description:**

The API and web application responses do not include a set of standard HTTP security headers that defend against common browser-based attacks. During manual testing, the following headers were found to be absent or misconfigured:

- `Content-Security-Policy` (CSP): no policy is set, allowing unrestricted resource loading and inline script execution.
- `X-Content-Type-Options: nosniff`: absent, allowing browsers to MIME-sniff responses.
- `X-Frame-Options: DENY` or `SAMEORIGIN`: absent, leaving the application open to clickjacking attacks.
- `Referrer-Policy`: absent, potentially leaking URL parameters in HTTP referer headers to third-party origins.
- `Permissions-Policy`: absent, browser feature access is unrestricted.

While the `SameSite=Strict` cookie attribute provides meaningful CSRF protection, the absence of CSP and `X-Frame-Options` represents an exploitable attack surface for content injection and UI redressing attacks.

**Impact:**

An attacker who can inject content into a co-hosted page or a compromised CDN resource (cross-site content injection) could execute scripts in the application context. Without CSP, the browser will execute any injected inline scripts. Clickjacking allows an attacker to overlay the application in a transparent iframe and trick users into performing unintended actions (such as approving requests they did not intend to approve).

**Recommendation:**

Add a security headers middleware in `Program.cs` before endpoint mapping. For ASP.NET Core, this can be achieved with the `app.Use` middleware pattern or by installing the `NWebsec.AspNetCore.Middleware` package. Minimum required headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

For the Next.js frontend, configure security headers in `next.config.js` under the `headers()` export.

**References:**

- OWASP: A05:2021 — Security Misconfiguration
- CWE-1021: Improper Restriction of Rendered UI Layers or Frames
- CWE-693: Protection Mechanism Failure
- OWASP Secure Headers Project

---

### SEC-002: SQLite Database File Exposure and Seeded Credential Risk

| Attribute | Value |
|-----------|-------|
| **ID** | SEC-002 |
| **Severity** | High |
| **Category** | Data Protection |
| **Status** | Open |
| **CVSS Score** | 7.1 |
| **Affected Component** | VacaFlow.Infrastructure — VacaFlowDbContext, seed data; vacaflow.db filesystem location |

**Description:**

The SQLite database file (`vacaflow.db`) contains all persistent application data, including BCrypt password hashes for all registered employees and the seeded Manager account. Two risks were identified:

1. **Source control exposure risk:** If `vacaflow.db` is not explicitly listed in `.gitignore`, it may be inadvertently committed to the source repository. A committed database file with a seeded Manager account (or test user accounts with predictable credentials) would expose BCrypt hashes, which — while computationally expensive to crack — represent a tangible data leakage risk. The seed data configuration in `ManagerAccountSeeder` must use a strong, unique default credential and must be documented as requiring change before any shared or production deployment.

2. **Filesystem access control:** The database file resides in the application working directory with default filesystem permissions. On multi-user operating systems, other local users may have read access to the file, exposing all BCrypt hashes and all absence request data.

The Architecture Evaluation (AE-001 §7, Risk 5) identified this risk and specified a `.gitignore` mitigation, but the effectiveness of that control was not verified during this assessment.

**Impact:**

Unauthorized access to the `vacaflow.db` file grants full read access to all employee records (including password hashes), all absence requests, and all approval records. If the seeded Manager credential uses a predictable password, offline BCrypt cracking may succeed within a feasible time window for weak passwords (dictionary words, common patterns).

**Recommendation:**

1. Verify that `vacaflow.db` is listed in `.gitignore` and confirm no database file exists in the repository history using `git log --all -- "*.db"`.
2. Add an API startup check that logs a warning if the database file path is inside the project source directory.
3. Ensure the seeded Manager account uses a non-trivial default password (minimum 12 characters, mixed character classes) and document that it must be changed before any shared deployment.
4. On Linux/macOS deployment targets, set restrictive file permissions on the database file: `chmod 600 vacaflow.db`.
5. Consider using the operating system's user-specific application data directory (`Environment.GetFolderPath(SpecialFolder.LocalApplicationData)`) as the database file location rather than the working directory.

**References:**

- OWASP: A02:2021 — Cryptographic Failures
- CWE-312: Cleartext Storage of Sensitive Information
- CWE-732: Incorrect Permission Assignment for Critical Resource
- AE-001 §7 Risk 5

---

## 5. Medium and Low Findings Summary

### 5.1 Medium Severity Findings

---

#### SEC-003: Absence of Server-Side Input Length and Format Validation

| Attribute | Value |
|-----------|-------|
| **ID** | SEC-003 |
| **Severity** | Medium |
| **Category** | Input Validation |
| **Status** | Open |

**Description:**

Manual testing of the request creation and edit endpoints revealed that server-side validation of string field lengths and format constraints is not consistently enforced. Fields such as the request description or reason field accept payloads significantly exceeding reasonable business limits without returning validation errors. While the SQLite text type does not impose a hard length limit, unbounded input acceptance increases the risk of application-layer denial-of-service through storage exhaustion and may provide an injection surface if output encoding is not applied consistently in the frontend.

**Recommendation:**

Implement `DataAnnotations` or FluentValidation on all request DTOs in the API layer. Define explicit maximum lengths for all string fields (e.g., description: 500 characters, notes: 1000 characters). Return HTTP 400 with structured validation error responses for out-of-range inputs. Apply EF Core `HasMaxLength` constraints in `VacaFlowDbContext` to enforce limits at the database layer as a secondary control.

**References:** CWE-20: Improper Input Validation, OWASP: A03:2021 — Injection

---

#### SEC-004: CORS Policy Allows All Headers Without Explicit Allowlist

| Attribute | Value |
|-----------|-------|
| **ID** | SEC-004 |
| **Severity** | Medium |
| **Category** | Configuration |
| **Status** | Open |

**Description:**

The CORS configuration in `Program.cs` restricts the allowed origin to `http://localhost:3000` and enables `AllowCredentials()`, which is correct. However, the allowed headers configuration was observed to use a broad allow pattern rather than an explicit allowlist of the headers actually consumed by the API (e.g., `Content-Type`, `Accept`, `X-Requested-With`). Overly broad CORS header allowances can enable browser-based cross-origin information disclosure in certain preflight bypass scenarios.

**Recommendation:**

Replace the broad header allow pattern with an explicit allowlist in the CORS policy configuration:

```csharp
policy.WithOrigins("http://localhost:3000")
      .AllowCredentials()
      .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
      .WithHeaders("Content-Type", "Accept", "X-Requested-With");
```

**References:** CWE-942: Overly Permissive Cross-domain Allowlist, OWASP: A05:2021 — Security Misconfiguration

---

#### SEC-005: No Rate Limiting on Authentication Endpoints

| Attribute | Value |
|-----------|-------|
| **ID** | SEC-005 |
| **Severity** | Medium |
| **Category** | Authentication |
| **Status** | Open |

**Description:**

The `POST /auth/login` and `POST /auth/register` endpoints do not implement rate limiting or account lockout mechanisms. An attacker with network access to the API can issue an unlimited number of login attempts against a known email address without triggering any throttling or lockout response. BCrypt's computational cost (work factor) provides meaningful protection against high-speed offline attacks, but online credential stuffing against the login endpoint is not mitigated.

**Recommendation:**

Apply ASP.NET Core's built-in rate limiting middleware (`Microsoft.AspNetCore.RateLimiting`, available in .NET 7+) to the authentication endpoint group. A sliding window policy of 10 requests per minute per IP address is a reasonable starting point for an MVP. For production, consider implementing account-level lockout after 5 consecutive failed attempts with a 15-minute lockout window.

**References:** CWE-307: Improper Restriction of Excessive Authentication Attempts, OWASP: A07:2021 — Identification and Authentication Failures

---

#### SEC-006: Error Responses May Leak Enumerable User Existence

| Attribute | Value |
|-----------|-------|
| **ID** | SEC-006 |
| **Severity** | Medium |
| **Category** | Input Validation |
| **Status** | Open |

**Description:**

During testing of the `POST /auth/login` endpoint, the error response behavior for an unknown email address versus a known email address with an incorrect password was observed to differ in either response timing or message content in ways that allow an attacker to enumerate whether an email address is registered in the system. User enumeration enables targeted credential attacks and reduces the effort required for account compromise.

**Recommendation:**

Implement constant-time response behavior for all authentication failure paths:

1. Return an identical generic error message for both "email not found" and "incorrect password" cases: `"Invalid email address or password."` — never indicate which field is incorrect.
2. Ensure BCrypt comparison is always performed, even for non-existent users, by comparing against a dummy hash when the email is not found. This prevents timing attacks that distinguish found from not-found accounts based on response latency.

**References:** CWE-204: Observable Response Discrepancy, OWASP: A07:2021 — Identification and Authentication Failures

---

### 5.2 Low Severity Findings

| ID | Finding | Severity | Category | Status |
|----|---------|----------|----------|--------|
| SEC-007 | Cookie `Secure` flag not enforced in development configuration | Low | Configuration | Open |
| SEC-008 | BCrypt work factor not documented or configurable | Low | Cryptography | Open |
| SEC-009 | No audit logging for failed authorization attempts at the domain layer | Low | Authorization | Open |

---

#### SEC-007: Cookie `Secure` Flag Not Enforced in Development Configuration

**Description:** The `Secure` cookie attribute is conditionally set based on environment (`production` only per SAD-001 documentation). While acceptable for local MVP review, if the application is deployed to any shared or staging environment over HTTP, the session cookie will be transmitted in cleartext. The configuration must explicitly require HTTPS before any non-localhost deployment.

**Recommendation:** Document that the `Secure` flag must be enabled for any deployment target other than `localhost`. Add an application startup check that logs a warning (or throws) if `Secure=false` and the application is not bound to `localhost`.

---

#### SEC-008: BCrypt Work Factor Not Documented or Configurable

**Description:** Password hashing uses BCrypt via `BCrypt.Net-Next`. The work factor (cost parameter) used in the `Employee` entity factory method was not confirmed during the review. The default `BCrypt.Net-Next` work factor is 11, which is acceptable at time of writing, but should be documented and made configurable to allow future increase without code changes.

**Recommendation:** Document the BCrypt work factor in `appsettings.json` (or a constants file) and read it at startup. Log the active work factor at application start. Consider exposing it as a configurable parameter in `appsettings.Development.json` to facilitate future increases.

---

#### SEC-009: No Audit Logging for Failed Authorization Attempts at the Domain Layer

**Description:** The `SelfApprovalGuard` in the Domain layer throws a `DomainException` when a self-approval attempt is detected. The `ExceptionHandlingMiddleware` catches this and returns an appropriate HTTP error. However, no structured audit log entry is created recording the attempted self-approval (who attempted it, on which request, and at what time). For accountability and incident investigation purposes, failed authorization attempts should be persisted.

**Recommendation:** In the `ExceptionHandlingMiddleware` or in the `ApprovalService`, catch `DomainException` instances related to authorization violations and write a structured log entry (using `ILogger`) with the caller identity, target request ID, and timestamp. In a production system, route these log entries to a persistent audit store.

---

### 5.3 Informational Finding

| ID | Finding | Category |
|----|---------|----------|
| SEC-010 | Session cookie sliding expiration window | Authentication |

**SEC-010 (Informational):** The session cookie is configured with a 120-minute sliding expiration (per SAD-001, ADR-002). This is a reasonable value for a local MVP reviewer demo. For production deployment, a shorter absolute expiration (e.g., 8 hours) combined with the sliding window should be considered to reduce the session hijacking window if a cookie is compromised.

---

## 6. Compliance Assessment

### 6.1 Applicable Security Requirements

No formal compliance standards (PCI-DSS, SOC 2, GDPR, ISO 27001) were specified for VacaFlow_03. The following project-defined security baseline requirements were assessed as the applicable compliance framework.

### 6.2 Compliance Status

| Requirement | Source | Status | Notes |
|-------------|--------|--------|-------|
| Passwords stored as hashes, never plain text | Project baseline | ✅ Compliant | BCrypt via `BCrypt.Net-Next` in Domain entity factory |
| SQLite database file must not be publicly exposed | Project baseline | ⚠️ Partial | `.gitignore` mitigation specified but not verified; see SEC-002 |
| SQLite database file must not be committed with real passwords | Project baseline | ⚠️ Partial | Seeded Manager credential risk identified; see SEC-002 |
| API must derive user identity from authenticated session or token | Project baseline | ✅ Compliant | `ICurrentUserContext` reads from validated cookie claims; identity cannot be injected from request body |
| Unauthorized operations must be blocked | Project baseline | ✅ Compliant | `RoleAuthorizationMiddleware` (Manager-only for approvals) + `SelfApprovalGuard` (domain-level); tested and confirmed |

### 6.3 Compliance Gaps

| Gap | Requirement | Risk | Remediation |
|-----|-------------|------|-------------|
| SQLite `.gitignore` status unverified | Project baseline — database not committed | Medium — accidental credential exposure | Verify `.gitignore` entry and run `git log --all -- "*.db"` to confirm no historical commit; see SEC-002 |
| Seeded Manager default credential strength | Project baseline — no real passwords committed | Medium — weak default enables offline crack | Enforce strong seeded default; document change requirement before shared deployment; see SEC-002 |

---

## 7. Security Controls Assessment

### 7.1 Control Effectiveness

| Control | Expected Behavior | Observed Behavior | Rating |
|---------|-------------------|-------------------|--------|
| HttpOnly Cookie Authentication | Session cookie inaccessible to JavaScript | Confirmed — `document.cookie` does not expose session cookie | ✅ Effective |
| SameSite=Strict Cookie | Blocks cross-site request forgery | Confirmed — cross-origin requests do not include session cookie | ✅ Effective |
| ICurrentUserContext (Server-Side Identity) | Approver identity read from validated cookie claims, never from request body | Confirmed — approval endpoints use `ICurrentUserContext.CurrentUserId`; request body identity parameters rejected | ✅ Effective |
| RoleAuthorizationMiddleware | 403 returned for Employee role on Manager-only endpoints | Confirmed — `POST /requests/{id}/approve` returns 403 for Employee-role callers | ✅ Effective |
| SelfApprovalGuard (Domain Layer) | DomainException thrown when ApproverId == RequestorId | Confirmed — self-approval attempt returns structured error | ✅ Effective |
| ExceptionHandlingMiddleware | No stack traces or internal details in error responses | Confirmed — error responses contain structured JSON only | ✅ Effective |
| BCrypt Password Hashing | Passwords never stored in cleartext | Confirmed — database inspection shows BCrypt hash format | ✅ Effective |
| HTTP Security Headers | CSP, X-Frame-Options, X-Content-Type-Options present | Not implemented — headers absent from API and web responses | 🔴 Absent (SEC-001) |
| Input Length Validation | All string inputs validated for length | Not consistently enforced at API layer | 🟡 Partial (SEC-003) |
| Rate Limiting on Auth Endpoints | Login throttled per IP | Not implemented | 🔴 Absent (SEC-005) |
| CORS Header Allowlist | Only required headers permitted | Overly broad header configuration observed | 🟡 Partial (SEC-004) |

### 7.2 Control Gaps

| Control | Gap | Risk | Recommendation |
|---------|-----|------|----------------|
| HTTP Security Headers | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy all absent | High — clickjacking, content injection, MIME sniffing | Add security headers middleware in Program.cs and next.config.js (SEC-001) |
| Rate Limiting | No throttling on authentication endpoints | Medium — credential stuffing, online brute force | Apply ASP.NET Core rate limiting middleware to /auth group (SEC-005) |
| CORS Header Policy | Overly broad allowed headers | Medium — cross-origin information disclosure surface | Restrict to explicit header allowlist (SEC-004) |
| Input Validation | No server-side length or format constraints on string fields | Medium — storage exhaustion, injection surface | Add FluentValidation / DataAnnotations + EF Core HasMaxLength (SEC-003) |

---

## 8. Risk Assessment

### 8.1 Risk Summary

| Risk Level | Finding Count | Business Impact |
|------------|---------------|-----------------|
| Critical | 0 | No critical risk items identified |
| High | 2 | UI redressing / clickjacking attack; database credential exposure |
| Medium | 4 | Credential stuffing; user enumeration; storage exhaustion; CORS misconfiguration |
| Low | 3 | Session configuration; BCrypt documentation; audit logging gaps |

### 8.2 Risk Context

The VacaFlow_03 application is scoped as a local MVP designed for reviewer evaluation. The threat model is therefore constrained: the primary attack surface during the MVP phase is a single developer machine with no internet exposure. This context reduces the likelihood of exploitation for several findings. However, the risk ratings above are assigned based on the inherent severity of the vulnerability class, independent of the MVP deployment context, to ensure that remediation is appropriately prioritized when the application is deployed to any shared or network-accessible environment.

### 8.3 Risk Heat Map

```
Likelihood →
              Low               Medium              High
Impact ↓
High    │                  ●SEC-002             ●SEC-001
        │                  (DB exposure)        (Missing headers)
Medium  │  ●SEC-008         ●SEC-003 ●SEC-006   ●SEC-005
        │  ●SEC-009         ●SEC-004             (Rate limiting)
Low     │  ●SEC-007
        │  (Secure flag)
```

---

## 9. Recommendations

### 9.1 Immediate Actions (Within 7 Days)

| Priority | Action | Owner | Finding |
|----------|--------|-------|---------|
| 1 | Add HTTP security headers middleware to VacaFlow.Api (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) | Backend Team | SEC-001 |
| 2 | Add security headers to Next.js `next.config.js` headers export | Frontend Team | SEC-001 |
| 3 | Verify `vacaflow.db` is in `.gitignore` and not in git history; confirm seeded Manager credential strength | Backend Team | SEC-002 |
| 4 | Document database file location risk and add startup warning log if file is in source directory | Backend Team | SEC-002 |

### 9.2 Short-term Actions (Within 30 Days)

| Priority | Action | Owner | Finding |
|----------|--------|-------|---------|
| 5 | Implement ASP.NET Core rate limiting middleware on `/auth/register` and `/auth/login` endpoints | Backend Team | SEC-005 |
| 6 | Standardize login error response to generic message; implement constant-time BCrypt comparison for unknown emails | Backend Team | SEC-006 |
| 7 | Add FluentValidation (or DataAnnotations) to all request DTOs; enforce `HasMaxLength` in `VacaFlowDbContext` | Backend Team | SEC-003 |
| 8 | Restrict CORS allowed headers to explicit allowlist | Backend Team | SEC-004 |
| 9 | Document BCrypt work factor; expose as configurable parameter in `appsettings.json` | Backend Team | SEC-008 |
| 10 | Add structured audit log entries for `DomainException` authorization violations in `ExceptionHandlingMiddleware` | Backend Team | SEC-009 |

### 9.3 Long-term Improvements

| Recommendation | Benefit | Effort |
|----------------|---------|--------|
| Implement HTTPS enforcement with HSTS for any shared deployment | Eliminates cookie interception over non-localhost networks | Low |
| Add absolute session expiration (max 8 hours) in addition to sliding window | Reduces session hijacking window | Low |
| Conduct follow-up assessment after Medium/High remediation | Validates remediation effectiveness | Medium |
| Implement structured security event logging routed to a persistent store | Enables incident investigation and audit trail | Medium |
| Introduce SAST tooling (e.g., SonarQube, Semgrep) into the development workflow | Catches input validation and injection issues during development | Medium |
| Evaluate migration from SQLite to PostgreSQL for any multi-user deployment | Eliminates single-file database exposure risk; supports row-level security | High |

---

## 10. Next Steps

1. **Immediate (Days 1–7):** Remediate SEC-001 (security headers) and SEC-002 (database exposure controls). These two findings represent the highest risk relative to effort and must be closed before the application is shared beyond the original reviewer's machine.

2. **Week 2–3:** Address SEC-005 (rate limiting), SEC-006 (user enumeration), and SEC-003 (input validation). These medium-severity findings require moderate implementation effort and directly affect the application's resistance to online attacks.

3. **Week 3–4:** Close SEC-004 (CORS headers), SEC-008 (BCrypt documentation), and SEC-009 (authorization audit logging). These are lower-effort improvements that complete the medium and low finding remediation cycle.

4. **Follow-up Assessment:** Schedule a follow-up manual review after all High and Medium findings have been remediated to confirm effectiveness and update the security rating. Based on the architectural strengths already present, a **Satisfactory** overall rating is achievable after remediation.

5. **Ongoing:** Maintain the security controls inventory in the Vulnerability Report (to be created under `/security/vulnerability-report`) and the Remediation Log (`/security/remediation-log`). Review security posture at each major feature addition to the VacaFlow system.

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| CISO | | | ⏳ Pending |
| Project Manager | | | ⏳ Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | CISO (PM_OVERRIDE — bypassed CISO) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:48:27 UTC |

*— End of document —*
