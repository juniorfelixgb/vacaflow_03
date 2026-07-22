# Work Breakdown Structure: VacaFlow_03

**Author:** Junior Gervacio (AI Assisted)
**Date:** 2026-07-20
**Version:** 1.0
**Status:** Draft
**Project:** VacaFlow_03 — IGS Solutions
**Document ID:** WBS-001
**References:** BLG-001 (Prioritized Backlog), EA-001 (Execution Alignment / Roadmap), SAD (Software Architecture Document)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Junior Gervacio (AI Assisted) | Initial WBS derived from signed Backlog (BLG-001), Roadmap (EA-001), and Software Architecture Document |

---

## 1. Introduction

### 1.1 Purpose

This Work Breakdown Structure (WBS) decomposes the VacaFlow_03 project scope into a complete, hierarchical set of deliverables, work packages, and activities. It establishes the formal scope baseline for the project and provides a common reference framework for planning, scheduling, and tracking across all phases of delivery.

### 1.2 Scope Summary

VacaFlow_03 is an absence request management web application built on a Reduced Onion Architecture (.NET 8 / ASP.NET Core Minimal API backend + Next.js 14 frontend + SQLite). The project delivers 13 prioritized user stories (11 Must Have, 2 Should Have) across four sprints over a nine-day delivery window, from project kickoff (2026-07-07) to MVP acceptance and project close (2026-07-20). Nineteen features are explicitly deferred to Won't v1 and are excluded from this WBS.

### 1.3 WBS Approach

- **Deliverable-oriented decomposition:** each WBS branch terminates in a tangible output or verifiable work product
- **100% rule compliance:** all work required to deliver the VacaFlow_03 MVP scope is captured; nothing outside the signed Backlog (BLG-001) and Won't v1 boundary is included
- **Mutually exclusive work packages:** no overlap between work package definitions
- **8/80 rule for sizing:** individual work packages are estimated between 8 and 80 person-hours
- **Sprint alignment:** development work packages map directly to the four sprints defined in the Roadmap (EA-001)
- **Component alignment:** development branches follow the five Onion layers defined in the Software Architecture Document (Domain, Application, Infrastructure, Api, vacaflow-web)

### 1.4 Related Documents

| Document ID | Title | Purpose |
|-------------|-------|---------|
| BLG-001 | Prioritized Backlog | Source of user stories, sprint assignments, MoSCoW priorities, and Won't v1 scope |
| EA-001 | Execution Alignment — Roadmap + Risk Log | Source of sprint structure, milestones, team roles, timelines, and risk log |
| SAD | Software Architecture Document | Source of Onion layer components, technology stack, infrastructure, API endpoints |
| FRS-001 | Functional Requirements Specification | Source of functional requirements traced to user stories |
| SI-001 | Strategic Intake | Project authorization and scope boundaries |

### 1.5 Won't v1 Exclusions (Out of Scope)

The following 19 feature categories are formally excluded from this WBS per BLG-001 §3. No work package in this document covers any of these items:

Microsoft Entra ID / SSO, Azure deployment, Docker / CI/CD pipelines, email and Teams notifications, password reset, email verification, account administration UI, vacation balance calculation, holiday calendars / working-day calculations, overlapping request validation, attachments, reporting / dashboards / exports, HR administration screens, multi-level approvals, approval delegation, payroll / HR / calendar / directory integrations, advanced audit trail, automated backups, and multifactor authentication.

---

## 2. WBS Overview

### 2.1 Project Summary

| Field | Value |
|-------|-------|
| Project | VacaFlow_03 — IGS Solutions |
| Description | Absence request management web application with role-based workflow and approval audit trail |
| Start Date | 2026-07-07 |
| Go-Live Date | 2026-07-16 |
| Project Close | 2026-07-20 |
| Duration | 14 calendar days (9 delivery days + 4 closure days) |
| Team | Yeuri Reyes (Functional Analyst), Junior Gervacio (Operations Manager / Project Sponsor / Product Owner) |
| Delivery Model | 4 sprints (2–3 days each); local SQLite execution only |

### 2.2 WBS Levels

| Level | Name | Description |
|-------|------|-------------|
| 0 | Project | VacaFlow_03 in its entirety |
| 1 | Phase | Major project phases grouping related deliverables |
| 2 | Deliverable | Key outputs within each phase |
| 3 | Work Package | Assignable, estimable units of work |
| 4 | Activity | Individual tasks within a work package (shown for selected packages) |

### 2.3 Team Role Mapping

| WBS Role Label | Person | Actual Role |
|----------------|--------|-------------|
| PM / PO | Junior Gervacio | Operations Manager / Project Sponsor / Product Owner — sole acceptance authority |
| FA / Dev | Yeuri Reyes | Functional Analyst — documentation, verification, acceptance criteria validation, development coordination |

---

## 3. WBS Hierarchy

```
0.0  VacaFlow_03
│
├── 1.0  Project Management
│   ├── 1.1  Project Initiation & Kickoff
│   ├── 1.2  Sprint Planning & Coordination
│   ├── 1.3  Risk Management & Monitoring
│   └── 1.4  Project Closure
│
├── 2.0  Requirements & Architecture (Pre-Sprint)
│   ├── 2.1  Scope Definition & Functional Requirements
│   ├── 2.2  Architecture Design & Evaluation
│   └── 2.3  Planning Artifacts
│
├── 3.0  Environment & Infrastructure Setup (Pre-Sprint)
│   ├── 3.1  Development Environment
│   ├── 3.2  Project Repository Structure
│   └── 3.3  Database Provisioning & Seed Data
│
├── 4.0  Sprint 1 — Authentication Foundation (2026-07-07 to 2026-07-09)
│   ├── 4.1  US-001: User Registration
│   ├── 4.2  US-002: User Login
│   └── 4.3  US-003: User Logout
│
├── 5.0  Sprint 2 — Employee Request Lifecycle (2026-07-10 to 2026-07-12)
│   ├── 5.1  US-004: Create Draft Request
│   ├── 5.2  US-005: Edit Draft Request
│   ├── 5.3  US-006: Submit Request
│   └── 5.4  US-007: Cancel Request
│
├── 6.0  Sprint 3 — Manager Approval Workflow (2026-07-13 to 2026-07-15)
│   ├── 6.1  US-008: Manager Views Submitted Requests
│   ├── 6.2  US-009: Approve Request
│   └── 6.3  US-010: Reject Request
│
├── 7.0  Sprint 4 — Hardening & Go-Live (2026-07-16)
│   ├── 7.1  Should Have Stories (US-011, US-012, US-013)
│   ├── 7.2  End-to-End Verification & Negative Path Testing
│   ├── 7.3  Bug Triage & Resolution
│   └── 7.4  MVP Acceptance & Go-Live Sign-Off
│
├── 8.0  Quality Assurance (Cross-Sprint)
│   ├── 8.1  Unit Test Coverage
│   ├── 8.2  Acceptance Criteria Verification
│   └── 8.3  Security & Business Rule Validation
│
└── 9.0  Documentation & Knowledge Transfer
    ├── 9.1  SDLC Documentation Artifacts
    ├── 9.2  Technical Documentation
    └── 9.3  Closure Documentation
```

---

## 4. Detailed WBS

### 1.0 Project Management

#### 1.1 Project Initiation & Kickoff

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 1.1.1 | Stakeholder Alignment | Confirm project sponsor, product owner, and team roles; establish communication channels via Microsoft Teams | PM / PO | M1 | 4 h |
| 1.1.2 | Scope Agreement & Won't v1 Sign-Off | Conduct kickoff meeting; walk through 19 Won't v1 items; obtain explicit Junior Gervacio approval to proceed to Sprint 1 | PM / PO | M1 | 4 h |
| 1.1.3 | Environment Readiness Confirmation | Verify .NET 8 SDK, Node.js 20.x, and SQLite auto-provisioning are functional on all team machines | FA / Dev | M1 | 2 h |
| 1.1.4 | Kickoff Meeting Facilitation | Facilitate 60-minute structured kickoff per EA-001 §5 agenda; document outcomes; capture all open actions | FA / Dev | M1 | 2 h |

**Activities for 1.1.2:**
- Walk through all 19 Won't v1 items with Junior Gervacio
- Record explicit verbal and written agreement in meeting transcript
- Confirm scope is limited to Employee, Absence Type, Request, Approval entities
- Confirm go-live target: 2026-07-16

---

#### 1.2 Sprint Planning & Coordination

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 1.2.1 | Sprint 1 Planning | Define acceptance criteria validation approach for US-001, US-002, US-003; assign verification tasks to Yeuri Reyes | FA / Dev | M2 | 2 h |
| 1.2.2 | Sprint 2 Planning | Define acceptance criteria validation approach for US-004 through US-007; confirm absence type seed dependency | FA / Dev | M3 | 2 h |
| 1.2.3 | Sprint 3 Planning | Define acceptance criteria validation approach for US-008, US-009, US-010; confirm self-approval guard test scenarios | FA / Dev | M4 | 2 h |
| 1.2.4 | Sprint 4 Planning | Triage Should Have stories (US-011, US-012, US-013) against available capacity; confirm hardening-only constraint | PM / PO | M5 | 2 h |
| 1.2.5 | Sprint Review Facilitation (×4) | Facilitate end-of-sprint demos with Junior Gervacio; document acceptance decisions; update Change Log | FA / Dev | M2–M5 | 8 h |
| 1.2.6 | Change Log Maintenance | Record every scope discussion, decision, or deferral; owner: Yeuri Reyes; updated continuously | FA / Dev | Ongoing | 4 h |

---

#### 1.3 Risk Management & Monitoring

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 1.3.1 | Risk Log Monitoring — R-01 Scope Creep | Monitor for requests to add Won't v1 features; enforce Change Log process; escalate to Junior Gervacio immediately | PM / PO | 4 h |
| 1.3.2 | Risk Monitoring — R-02 Identity Spoofing | Verify `ICurrentUserContext` is used for all business-critical identity reads; execute AC-004 (US-004), AC-003 (US-009, US-010) | FA / Dev | 4 h |
| 1.3.3 | Risk Monitoring — R-03 Architecture Complexity | Confirm `VacaFlow.Application.csproj` carries zero `PackageReference` to `Microsoft.AspNetCore.*` or `Microsoft.EntityFrameworkCore.*` before Sprint 1 closes | FA / Dev | 2 h |
| 1.3.4 | Risk Monitoring — R-04 Timeline | Track Must Have story completion daily; trigger Should Have deferral if Must Have is at risk entering Sprint 4 | PM / PO | 4 h |
| 1.3.5 | Risk Monitoring — R-05 Security (BCrypt) | Inspect `vacaflow.db` to confirm no plain-text passwords; verify BCrypt hashes in Sprint 1 acceptance | FA / Dev | 2 h |
| 1.3.6 | Risk Monitoring — R-06 Self-Approval Guard | Execute self-approval guard test scenarios in Sprint 3; verify `DomainException` thrown before persistence | FA / Dev | 2 h |

---

#### 1.4 Project Closure

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 1.4.1 | Retrospective Facilitation | Conduct retrospective with Yeuri Reyes and Junior Gervacio; document findings | PM / PO | M6 | 2 h |
| 1.4.2 | Final Defect Confirmation | Confirm zero open blocking defects against all signed stories | FA / Dev | M6 | 2 h |
| 1.4.3 | Formal Project Close | Junior Gervacio formally closes the project; all closure documentation complete | PM / PO | M6 | 1 h |

---

### 2.0 Requirements & Architecture (Pre-Sprint)

#### 2.1 Scope Definition & Functional Requirements

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 2.1.1 | Strategic Intake Document (SI-001) | Document project context, business problem, value proposition, constraints, and go/no-go decision | FA / Dev | 8 h |
| 2.1.2 | Functional Requirements Specification (FRS-001) | Define 37 functional requirements across Auth, Absence Type Catalog, Request Management, and Lifecycle State Engine modules | FA / Dev | 16 h |
| 2.1.3 | Non-Functional Requirements Specification | Define NFRs covering security (NFR-SEC-001/002), maintainability (NFR-MAINT-001/002), reliability (NFR-REL-001 through 004), usability (NFR-USE-001), and compatibility (NFR-COMP-001) | FA / Dev | 8 h |
| 2.1.4 | Business Rules Catalog | Document 11 business rules (BR-001 through BR-011) covering date validation, state transitions, ownership, role authorization, self-approval guard, and session-derived identity | FA / Dev | 8 h |
| 2.1.5 | Requirements Traceability Matrix | Map all 37 FRs to user stories; verify 100% coverage | FA / Dev | 4 h |

---

#### 2.2 Architecture Design & Evaluation

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 2.2.1 | Utility Tree (UT-001) | Define quality attribute weights and scenarios for Security (40%), Reliability (30%), Usability (20%), Maintainability (10%) | FA / Dev | 8 h |
| 2.2.2 | Architecture Overview (AO-001) | Document architectural principles, Reduced Onion layer structure, and key design constraints | FA / Dev | 8 h |
| 2.2.3 | Architecture Alternatives (AA-001) | Document three candidate architectures: Alt A (Cookie + SessionContext), Alt B (JWT + ICurrentUserService), Alt C (Cookie + ICurrentUserContext + ITransactionService) | FA / Dev | 12 h |
| 2.2.4 | Architecture Evaluation (AE-001) | Score all three alternatives against quality attribute scenarios; select Alternative C (score 5.000) as the recommended architecture | FA / Dev | 8 h |
| 2.2.5 | Software Architecture Document (SAD) | Produce full SAD including C4 diagrams (L1–L3), component architecture, five ADRs, and strategic path forward | FA / Dev | 20 h |

---

#### 2.3 Planning Artifacts

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 2.3.1 | Prioritized Backlog (BLG-001) | Define 13 user stories with acceptance criteria, MoSCoW priorities, sprint assignments, and 19 Won't v1 items | FA / Dev | 12 h |
| 2.3.2 | Execution Alignment — Roadmap + Risk Log (EA-001) | Define 4-sprint roadmap, 6 milestones, team roles, communication channels, risk log, kickoff agenda, success metrics | FA / Dev | 8 h |
| 2.3.3 | Work Breakdown Structure (WBS-001) | Decompose full project scope into hierarchical deliverables and work packages (this document) | FA / Dev | 8 h |

---

### 3.0 Environment & Infrastructure Setup (Pre-Sprint)

#### 3.1 Development Environment

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 3.1.1 | .NET 8 SDK Installation & Verification | Install .NET 8 SDK; run `dotnet --version` to confirm; resolve any PATH or SDK conflicts | FA / Dev | M1 | 2 h |
| 3.1.2 | Node.js 20.x Installation & Verification | Install Node.js 20.x; run `node --version` and `npm --version` to confirm | FA / Dev | M1 | 1 h |
| 3.1.3 | IDE / Editor Configuration | Configure Visual Studio / VS Code with recommended extensions; confirm C# DevKit and ESLint are functional | FA / Dev | M1 | 2 h |

---

#### 3.2 Project Repository Structure

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 3.2.1 | Solution Structure Initialization | Create .NET solution with five Onion layer projects: `VacaFlow.Domain`, `VacaFlow.Application`, `VacaFlow.Infrastructure`, `VacaFlow.Api`; initialize `vacaflow-web` Next.js app | FA / Dev | M1 | 4 h |
| 3.2.2 | Project References Configuration | Configure project-to-project references following the Onion dependency rule: Domain ← Application ← Infrastructure ← Api; verify no outward references exist | FA / Dev | M1 | 2 h |
| 3.2.3 | .gitignore Configuration | Add `vacaflow.db`, `*.db-shm`, `*.db-wal`, `bin/`, `obj/`, `.next/`, `node_modules/` to `.gitignore`; prevent database file and credentials from being committed | FA / Dev | M1 | 1 h |
| 3.2.4 | NuGet & npm Package Restoration | Add required NuGet packages: `Microsoft.EntityFrameworkCore.Sqlite` 8.x, `BCrypt.Net-Next` 4.x, `Microsoft.AspNetCore.Http.Abstractions`; run `npm install` for Next.js dependencies | FA / Dev | M1 | 2 h |
| 3.2.5 | Application Layer Purity Guard | Add `<PackageReference>` guard comment to `VacaFlow.Application.csproj` documenting the zero-framework-dependency restriction; verify with `grep` that no `Microsoft.AspNetCore.*` or `Microsoft.EntityFrameworkCore.*` references exist | FA / Dev | M1 | 1 h |

---

#### 3.3 Database Provisioning & Seed Data

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 3.3.1 | VacaFlowDbContext Configuration | Implement `VacaFlowDbContext` with Fluent API entity configurations for all four tables: `Employees`, `AbsenceRequests`, `AbsenceTypes`, `ApprovalRecords` | FA / Dev | M1 | 6 h |
| 3.3.2 | EF Core Auto-Provisioning | Configure `EnsureCreated()` or initial migration in API startup to auto-provision `vacaflow.db` on first `dotnet run`; verify file is created at the correct path | FA / Dev | M1 | 2 h |
| 3.3.3 | Absence Type Seed Data | Implement `AbsenceTypeSeeder` with exactly three records: Vacation, Personal Leave, Sick Leave (per FR-ATC-001); apply via `HasData` or startup hook | FA / Dev | M1 | 2 h |
| 3.3.4 | Manager Account Seed Data | Implement `ManagerAccountSeeder` to create at least one Manager-role account via seed data; confirm Manager role cannot be assigned via public registration endpoint | FA / Dev | M1 | 2 h |

---

### 4.0 Sprint 1 — Authentication Foundation (2026-07-07 to 2026-07-09)

**Sprint Goal:** A user can register an Employee account, log in, and log out — all actions attributed to an authenticated server-side HttpOnly session cookie, with BCrypt-hashed passwords stored in `vacaflow.db`.

**Milestone:** M2 — Authentication working in local environment (2026-07-09)

---

#### 4.1 US-001: User Registration

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 4.1.1 | Employee Domain Entity — Registration | Implement `Employee` aggregate with factory method: accepts name, email, password, role; applies BCrypt hash via `BCrypt.Net-Next`; throws `DomainException` if Manager role is requested | FA / Dev | 4 h |
| 4.1.2 | IUserRepository — CreateAsync & FindByEmailAsync | Define `IUserRepository` interface in `VacaFlow.Application`; implement `EfCoreUserRepository` in `VacaFlow.Infrastructure` with `CreateAsync` (insert + save) and `FindByEmailAsync` (unique lookup) | FA / Dev | 4 h |
| 4.1.3 | AuthService — RegisterAsync | Implement `AuthService.RegisterAsync`: validate email uniqueness via `IUserRepository.FindByEmailAsync`, block Manager role self-assignment, create Employee domain entity, persist via `IUserRepository.CreateAsync` | FA / Dev | 4 h |
| 4.1.4 | POST /auth/register Endpoint | Map `POST /auth/register` in `AuthEndpointGroup`; accept JSON body (name, email, password, role); call `IAuthService.RegisterAsync`; return 201 on success, 400 on validation failure, 409 on duplicate email | FA / Dev | 3 h |
| 4.1.5 | Registration UI — vacaflow-web | Implement registration form page in Next.js; collect name, email, password, role (Employee only); POST to `/api/auth/register`; display success or error messages | FA / Dev | 4 h |
| 4.1.6 | Unit Tests — US-001 Business Rules | Write unit tests for AC-001 (successful registration), AC-002 (duplicate email rejected), AC-003 (Manager role blocked), AC-004 (missing field rejected); use in-memory fakes for `IUserRepository` | FA / Dev | 4 h |
| 4.1.7 | AC Verification — US-001 | Verify all 4 acceptance criteria in the local environment; inspect `vacaflow.db` to confirm BCrypt hashes are stored (no plain text); document results for sprint review | FA / Dev | 2 h |

---

#### 4.2 US-002: User Login

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 4.2.1 | AuthService — LoginAsync | Implement `AuthService.LoginAsync`: find user by email, verify BCrypt hash, generate authentication claims (employee ID, role), return ClaimsPrincipal | FA / Dev | 4 h |
| 4.2.2 | HttpOnly Cookie Issuance | Configure `CookieAuthenticationOptions`: `HttpOnly=true`, `SameSite=Strict`, sliding expiration 120 min, secure flag for production; implement `AuthEndpointGroup` login handler to call `HttpContext.SignInAsync` | FA / Dev | 4 h |
| 4.2.3 | POST /auth/login Endpoint | Map `POST /auth/login`; accept email and password; call `IAuthService.LoginAsync`; issue `HttpOnly` cookie on success; return generic 401 on failure (no email/password distinction) | FA / Dev | 3 h |
| 4.2.4 | HttpContextCurrentUserContext Implementation | Implement `HttpContextCurrentUserContext` in `VacaFlow.Infrastructure`: read `ClaimTypes.NameIdentifier` and role from `HttpContext.User`; throw `UnauthorizedAccessException` if claim absent | FA / Dev | 3 h |
| 4.2.5 | Login UI — vacaflow-web | Implement login page in Next.js; POST to `/api/auth/login` with `credentials: 'include'`; redirect to dashboard on success; display generic error on failure | FA / Dev | 3 h |
| 4.2.6 | Unit Tests — US-002 Business Rules | Write unit tests for AC-001 (successful login), AC-002 (invalid credentials), AC-003 (non-existent account — same generic error), AC-004 (session-derived identity); use fakes | FA / Dev | 3 h |
| 4.2.7 | AC Verification — US-002 | Verify all 4 acceptance criteria in local environment; confirm cookie is `HttpOnly` via browser DevTools; document results | FA / Dev | 2 h |

---

#### 4.3 US-003: User Logout

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 4.3.1 | POST /auth/logout Endpoint | Map `POST /auth/logout`; call `HttpContext.SignOutAsync` to invalidate and clear the session cookie; return 200 | FA / Dev | 2 h |
| 4.3.2 | Logout UI — vacaflow-web | Add logout button to authenticated layout; POST to `/api/auth/logout` with `credentials: 'include'`; redirect to login on success | FA / Dev | 2 h |
| 4.3.3 | Unit Tests — US-003 Business Rules | Write unit tests for AC-001 (session terminated), AC-002 (subsequent request returns 401), AC-003 (already-expired session handled gracefully) | FA / Dev | 2 h |
| 4.3.4 | AC Verification — US-003 | Verify all 3 acceptance criteria; confirm previous session cookie cannot be reused after logout; document results | FA / Dev | 1 h |
| 4.3.5 | Sprint 1 Acceptance Review | Present US-001, US-002, US-003 to Junior Gervacio; verify BCrypt hashes in DB; confirm HttpOnly cookie; obtain sprint sign-off | PM / PO | 2 h |

---

### 5.0 Sprint 2 — Employee Request Lifecycle (2026-07-10 to 2026-07-12)

**Sprint Goal:** An authenticated Employee can create, edit, submit, and cancel absence requests — all ownership and date rules enforced by the API, with no frontend-trusted employee identifiers accepted for any business decision.

**Milestone:** M3 — Full employee-side request lifecycle working (2026-07-12)

---

#### 5.1 US-004: Create Draft Request

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 5.1.1 | AbsenceRequest Domain Entity — Creation | Implement `AbsenceRequest` aggregate root: factory method accepting absence type, start date, end date, reason, owner ID (from session); enforce BR-001 (end date ≥ start date), BR-002 (start date not in past); set state to Draft | FA / Dev | 4 h |
| 5.1.2 | IRequestRepository & IAbsenceTypeRepository | Define repository interfaces in `VacaFlow.Application`; implement `EfCoreRequestRepository` and `EfCoreAbsenceTypeRepository` in `VacaFlow.Infrastructure` | FA / Dev | 4 h |
| 5.1.3 | RequestService — CreateAsync | Implement `RequestService.CreateAsync`: read owner ID from `ICurrentUserContext.CurrentUserId`; validate absence type exists via `IAbsenceTypeRepository`; create domain entity; persist via `IRequestRepository.CreateAsync` | FA / Dev | 4 h |
| 5.1.4 | POST /requests Endpoint | Map `POST /requests`; require authenticated caller; accept absence type, start date, end date, reason; call `IRequestService.CreateAsync`; return 201 with request details; return 400 for date validation failures | FA / Dev | 3 h |
| 5.1.5 | Create Request UI — vacaflow-web | Implement create-request form; dropdown hydrated from seeded absence types; date pickers for start and end; reason text area; POST to `/api/requests` with `credentials: 'include'` | FA / Dev | 5 h |
| 5.1.6 | Unit Tests — US-004 Business Rules | Write unit tests for AC-001 (successful creation), AC-002 (end date before start date), AC-003 (past start date), AC-004 (ownership from session — payload employee ID ignored), AC-005 (missing field); use fakes | FA / Dev | 4 h |
| 5.1.7 | AC Verification — US-004 | Verify all 5 acceptance criteria; confirm no frontend employee ID is accepted; document results | FA / Dev | 2 h |

---

#### 5.2 US-005: Edit Draft Request

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 5.2.1 | AbsenceRequest Domain — Edit Method | Implement `AbsenceRequest.Edit(absenceType, startDate, endDate, reason)`: enforce BR-001, BR-002 (date re-validation on edit), BR-003 (only Draft editable); throw `DomainException` on invalid state | FA / Dev | 3 h |
| 5.2.2 | RequestService — UpdateAsync | Implement `RequestService.UpdateAsync`: retrieve request; verify caller is owner (BR-004) via `ICurrentUserContext`; call domain `Edit` method; persist via `IRequestRepository.UpdateAsync` | FA / Dev | 3 h |
| 5.2.3 | PUT /requests/{id} Endpoint | Map `PUT /requests/{id}`; require authenticated caller; call `IRequestService.UpdateAsync`; return 200 on success; 403 on ownership mismatch; 400 on state or date validation failure | FA / Dev | 2 h |
| 5.2.4 | Edit Request UI — vacaflow-web | Show Edit button only for Draft requests owned by the current user; pre-populate form with current values; PUT to `/api/requests/{id}` | FA / Dev | 3 h |
| 5.2.5 | Unit Tests — US-005 Business Rules | Write unit tests for AC-001 (successful edit), AC-002 (non-Draft request rejected), AC-003 (other employee's request rejected), AC-004 (date re-validation on edit) | FA / Dev | 3 h |
| 5.2.6 | AC Verification — US-005 | Verify all 4 acceptance criteria in local environment; document results | FA / Dev | 1 h |

---

#### 5.3 US-006: Submit Request

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 5.3.1 | RequestStateMachine — Draft → Submitted | Implement `RequestStateMachine.Submit()` transition: validate current state is Draft (BR-003); transition to Submitted; throw `DomainException` on invalid transition | FA / Dev | 3 h |
| 5.3.2 | RequestService — SubmitAsync | Implement `RequestService.SubmitAsync`: retrieve request; verify caller is owner (BR-004); call state machine Submit; persist | FA / Dev | 3 h |
| 5.3.3 | POST /requests/{id}/submit Endpoint | Map `POST /requests/{id}/submit`; require authenticated Employee; return 200 on success; 403 on ownership mismatch; 400 on invalid state | FA / Dev | 2 h |
| 5.3.4 | Submit UI — vacaflow-web | Show Submit button only for Draft requests owned by the current user; POST to `/api/requests/{id}/submit`; update UI to reflect Submitted state | FA / Dev | 3 h |
| 5.3.5 | Unit Tests — US-006 Business Rules | Write unit tests for AC-001 (successful submission), AC-002 (non-Draft rejected), AC-003 (other employee's request rejected), AC-004 (Submitted is read-only for employee) | FA / Dev | 3 h |
| 5.3.6 | AC Verification — US-006 | Verify all 4 acceptance criteria; document results | FA / Dev | 1 h |

---

#### 5.4 US-007: Cancel Request

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 5.4.1 | RequestStateMachine — Cancel Transitions | Implement `RequestStateMachine.Cancel()`: allow from Draft and Submitted; block from Approved, Rejected, Cancelled (BR-010 final states); throw `DomainException` on invalid transition | FA / Dev | 3 h |
| 5.4.2 | RequestService — CancelAsync | Implement `RequestService.CancelAsync`: retrieve request; verify caller is owner (BR-004); call state machine Cancel; persist | FA / Dev | 2 h |
| 5.4.3 | POST /requests/{id}/cancel Endpoint | Map `POST /requests/{id}/cancel`; require authenticated Employee; return 200 on success; 403 on ownership mismatch; 400 on final-state transition attempt | FA / Dev | 2 h |
| 5.4.4 | Cancel UI — vacaflow-web | Show Cancel button for Draft and Submitted requests owned by current user; POST to `/api/requests/{id}/cancel`; update UI to reflect Cancelled state | FA / Dev | 3 h |
| 5.4.5 | Unit Tests — US-007 Business Rules | Write unit tests for AC-001 (cancel Draft), AC-002 (cancel Submitted), AC-003 (cancel final-state rejected), AC-004 (cancel other employee's request rejected) | FA / Dev | 3 h |
| 5.4.6 | AC Verification — US-007 | Verify all 4 acceptance criteria; document results | FA / Dev | 1 h |
| 5.4.7 | Sprint 2 Acceptance Review | Present US-004 through US-007 to Junior Gervacio; demonstrate date rules, state transitions, ownership enforcement, spoofing prevention; obtain sprint sign-off | PM / PO | 2 h |

---

### 6.0 Sprint 3 — Manager Approval Workflow (2026-07-13 to 2026-07-15)

**Sprint Goal:** An authenticated Manager can view submitted requests, approve or reject them with an optional comment — with approver identity derived exclusively from the validated session cookie and the self-approval guard enforced at the domain layer.

**Milestone:** M4 — Manager approval workflow complete (2026-07-15)

---

#### 6.1 US-008: Manager Views Submitted Requests

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 6.1.1 | IRequestRepository — ListSubmittedAsync | Add `ListSubmittedAsync()` to `IRequestRepository`; implement in `EfCoreRequestRepository` returning only Submitted-state requests; no cross-manager filtering in MVP (single manager context) | FA / Dev | 3 h |
| 6.1.2 | RequestService — ListSubmittedForManagerAsync | Implement `RequestService.ListSubmittedForManagerAsync`: verify caller role is Manager via `ICurrentUserContext.CurrentUserRole`; call `IRequestRepository.ListSubmittedAsync` | FA / Dev | 2 h |
| 6.1.3 | GET /requests/pending Endpoint | Map `GET /requests/pending`; require Manager role via authorization policy; return list of Submitted requests; return 403 for Employee callers | FA / Dev | 2 h |
| 6.1.4 | Manager Approval Queue UI — vacaflow-web | Implement manager approval queue page; display Submitted requests with employee name, absence type, dates, reason; show Approve/Reject action buttons | FA / Dev | 5 h |
| 6.1.5 | Unit Tests — US-008 Business Rules | Write unit tests for AC-001 (only Submitted requests returned), AC-002 (non-Submitted excluded), AC-003 (Employee caller returns 403), AC-004 (empty queue returns empty list) | FA / Dev | 3 h |
| 6.1.6 | AC Verification — US-008 | Verify all 4 acceptance criteria; document results | FA / Dev | 1 h |

---

#### 6.2 US-009: Approve Request

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 6.2.1 | ApprovalRecord Domain Value Object | Implement `ApprovalRecord`: stores approver ID (from session), decision (Approved/Rejected), optional comment, timestamp; no direct constructor access — created via domain method | FA / Dev | 3 h |
| 6.2.2 | SelfApprovalGuard Implementation | Implement `SelfApprovalGuard` at Domain layer: throw `DomainException` before any persistence when `ApproverId == RequestorId` (BR-008); verify guard is independent of API authorization layer | FA / Dev | 3 h |
| 6.2.3 | AbsenceRequest Domain — Approve Method | Implement `AbsenceRequest.Approve(approverId, comment)`: call `SelfApprovalGuard`; validate current state is Submitted (BR-005); transition to Approved; create `ApprovalRecord` | FA / Dev | 3 h |
| 6.2.4 | IApprovalRepository — InsertAsync | Define `IApprovalRepository` interface; implement `EfCoreApprovalRepository.InsertAsync` in `VacaFlow.Infrastructure` | FA / Dev | 3 h |
| 6.2.5 | EfCoreTransactionService Implementation | Implement `EfCoreTransactionService.ExecuteInTransactionAsync`: open `BeginTransactionAsync`, execute delegate, `CommitAsync`; catch exceptions and `RollbackAsync`; guard against nested transaction calls with descriptive `InvalidOperationException` | FA / Dev | 4 h |
| 6.2.6 | ApprovalService — ApproveAsync | Implement `ApprovalService.ApproveAsync`: read approver ID from `ICurrentUserContext.CurrentUserId`; retrieve request; call `request.Approve(approverId, comment)` (triggers guard + state machine); wrap `IRequestRepository.UpdateAsync` + `IApprovalRepository.InsertAsync` in `ITransactionService.ExecuteInTransactionAsync` | FA / Dev | 5 h |
| 6.2.7 | POST /requests/{id}/approve Endpoint | Map `POST /requests/{id}/approve`; require Manager role; accept optional comment; call `IApprovalService.ApproveAsync`; return 200 on success; 403 on role or self-approval; 400 on invalid state | FA / Dev | 3 h |
| 6.2.8 | Approve Action UI — vacaflow-web | Add Approve button on manager queue; show comment input (optional); POST to `/api/requests/{id}/approve`; update queue to remove approved request | FA / Dev | 3 h |
| 6.2.9 | Unit Tests — US-009 Business Rules | Write unit tests for AC-001 (approval without comment), AC-002 (approval with comment), AC-003 (approver ID from session), AC-004 (self-approval blocked), AC-005 (non-Submitted rejected), AC-006 (second approval rejected), AC-007 (Employee 403) | FA / Dev | 6 h |
| 6.2.10 | AC Verification — US-009 | Verify all 7 acceptance criteria; inspect `vacaflow.db` to confirm Approval record contains session-derived approver identity; document results | FA / Dev | 2 h |

---

#### 6.3 US-010: Reject Request

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 6.3.1 | AbsenceRequest Domain — Reject Method | Implement `AbsenceRequest.Reject(approverId, comment)`: call `SelfApprovalGuard`; validate current state is Submitted; transition to Rejected; create `ApprovalRecord` with Rejected decision | FA / Dev | 3 h |
| 6.3.2 | ApprovalService — RejectAsync | Implement `ApprovalService.RejectAsync`: identical pattern to `ApproveAsync`; read approver from session; call `request.Reject`; wrap persistence in `ITransactionService` | FA / Dev | 3 h |
| 6.3.3 | POST /requests/{id}/reject Endpoint | Map `POST /requests/{id}/reject`; require Manager role; accept optional comment; call `IApprovalService.RejectAsync`; return 200 on success; 403 on role or self-rejection; 400 on invalid state | FA / Dev | 2 h |
| 6.3.4 | Reject Action UI — vacaflow-web | Add Reject button on manager queue with optional comment input; POST to `/api/requests/{id}/reject`; update queue to remove rejected request | FA / Dev | 3 h |
| 6.3.5 | Unit Tests — US-010 Business Rules | Write unit tests for all 7 acceptance criteria (parallel to US-009 reject scenarios) | FA / Dev | 5 h |
| 6.3.6 | AC Verification — US-010 | Verify all 7 acceptance criteria; inspect `vacaflow.db` for Approval record with session-derived approver identity; document results | FA / Dev | 2 h |
| 6.3.7 | Sprint 3 Acceptance Review | Present US-008, US-009, US-010 to Junior Gervacio; demonstrate self-approval guard, session-derived approver identity, single Approval record constraint; obtain sprint sign-off | PM / PO | 2 h |

---

### 7.0 Sprint 4 — Hardening & Go-Live (2026-07-16)

**Sprint Constraint:** No new features. Capacity is reserved exclusively for stabilization, Should Have story evaluation, and acceptance walkthrough. If any Must Have story is incomplete, Should Have stories (US-011, US-012, US-013) are formally deferred and Sprint 4 capacity is redirected to Must Have completion.

**Milestone:** M5 — Go-Live — MVP accepted (2026-07-16)

---

#### 7.1 Should Have Stories (US-011, US-012, US-013)

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 7.1.1 | US-011: Employee Views Request List & Final Decision | Implement `GET /requests` for Employee callers returning own requests in all states; include Approval record details (decision, approver identity, comment) for Approved/Rejected requests; implement request list UI in vacaflow-web | FA / Dev | 8 h |
| 7.1.2 | US-012: List Absence Types Endpoint | Implement `GET /absence-types`; return all three seeded types (Vacation, Personal Leave, Sick Leave); verify no create/edit/delete endpoints exist | FA / Dev | 3 h |
| 7.1.3 | US-013: Get Current User Profile | Implement `GET /me`; return name, email, and role from validated session cookie claims; return 401 for unauthenticated callers; use in vacaflow-web for initial identity hydration on app load | FA / Dev | 3 h |
| 7.1.4 | Should Have AC Verification | Verify acceptance criteria for US-011, US-012, US-013 in local environment; document results for sprint review | FA / Dev | 3 h |

---

#### 7.2 End-to-End Verification & Negative Path Testing

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 7.2.1 | Full Acceptance Checklist Walkthrough | Execute all 14+ acceptance criteria end-to-end with at least one Manager account and one Employee account; use registered accounts in local environment | FA / Dev | 4 h |
| 7.2.2 | Negative Path — Unauthorized Operations | Verify all forbidden operations return correct HTTP error responses: non-Manager approving (403), Employee editing Submitted request (error), spoofing another employee's request (403), self-approval (domain error), unauthenticated access (401) | FA / Dev | 3 h |
| 7.2.3 | Identity Spoofing Scenarios | Execute all identity-spoofing scenarios: send explicit employee ID in create-request payload (AC-004 US-004), send explicit approver ID in approve payload (AC-003 US-009, AC-003 US-010); confirm API ignores all payload-supplied identity fields | FA / Dev | 2 h |
| 7.2.4 | Business Rule Completeness Verification | Confirm all 11 business rules (BR-001 through BR-011) are enforced by the API with both valid and invalid inputs; log verification results | FA / Dev | 3 h |
| 7.2.5 | Database Integrity Inspection | Inspect `vacaflow.db`: confirm BCrypt hashes only (no plain text), confirm exactly one Approval record per decided request, confirm correct state values for all request records | FA / Dev | 2 h |

---

#### 7.3 Bug Triage & Resolution

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 7.3.1 | Defect Log Initialization | Initialize defect tracking for Sprint 4 issues; classify defects as blocking or non-blocking | FA / Dev | 1 h |
| 7.3.2 | Blocking Defect Resolution | Investigate, fix, and re-verify all defects classified as blocking against Must Have acceptance criteria | FA / Dev | 8 h |
| 7.3.3 | Non-Blocking Defect Documentation | Document non-blocking defects for post-MVP backlog; confirm Junior Gervacio is aware and accepts go-live with these items open | PM / PO | 2 h |

---

#### 7.4 MVP Acceptance & Go-Live Sign-Off

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 7.4.1 | UAT Walkthrough with Junior Gervacio | Conduct structured UAT walkthrough: Junior Gervacio executes key scenarios as both Employee and Manager in the local environment | PM / PO | M5 | 3 h |
| 7.4.2 | MVP Formal Acceptance Sign-Off | Junior Gervacio grants formal UAT sign-off confirming all Must Have acceptance criteria are demonstrable and all business rules are enforced | PM / PO | M5 | 1 h |
| 7.4.3 | Go-Live Confirmation | Record go-live date (2026-07-16); notify team; update project status to MVP Delivered | PM / PO | M5 | 1 h |

---

### 8.0 Quality Assurance (Cross-Sprint)

#### 8.1 Unit Test Coverage

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 8.1.1 | Test Project Setup | Initialize `VacaFlow.Tests` xUnit project; configure project reference to `VacaFlow.Application` and `VacaFlow.Domain`; implement base fake classes for all six Application interfaces | FA / Dev | 4 h |
| 8.1.2 | Domain Entity Unit Tests | Write unit tests for `RequestStateMachine` (all valid and invalid transitions), `SelfApprovalGuard`, `AbsenceRequest` factory validation (BR-001, BR-002), `Employee` factory (BCrypt hash, role blocking) | FA / Dev | 8 h |
| 8.1.3 | Application Service Unit Tests | Write unit tests for `AuthService`, `RequestService`, and `ApprovalService` using in-memory fakes — no `HttpContext`, no `DbContext`, no EF Core in-memory provider | FA / Dev | 12 h |
| 8.1.4 | Application Layer Purity Verification | Run `grep -r "using Microsoft" VacaFlow.Application/` and confirm zero results; run `dotnet build` on `VacaFlow.Application` in isolation and confirm success | FA / Dev | 1 h |

---

#### 8.2 Acceptance Criteria Verification

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 8.2.1 | Sprint 1 AC Verification Report | Compile AC verification results for US-001, US-002, US-003; present to Junior Gervacio at Sprint 1 review | FA / Dev | 2 h |
| 8.2.2 | Sprint 2 AC Verification Report | Compile AC verification results for US-004 through US-007; present at Sprint 2 review | FA / Dev | 2 h |
| 8.2.3 | Sprint 3 AC Verification Report | Compile AC verification results for US-008, US-009, US-010; present at Sprint 3 review | FA / Dev | 2 h |
| 8.2.4 | Sprint 4 AC Verification Report | Compile final AC verification results for all 13 stories; present at UAT | FA / Dev | 2 h |

---

#### 8.3 Security & Business Rule Validation

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 8.3.1 | CORS Configuration Validation | Test CORS with `credentials: 'include'` from `http://localhost:3000` → `http://localhost:5000`; confirm cookies are sent and returned; confirm other origins are blocked | FA / Dev | 2 h |
| 8.3.2 | Error Response Quality Review | Verify all error responses are structured JSON without stack traces or internal implementation details; verify no BCrypt hash or password data appears in any response | FA / Dev | 2 h |
| 8.3.3 | Cookie Security Attribute Verification | Verify cookie attributes in browser DevTools: `HttpOnly=true`, `SameSite=Strict`, correct domain, correct expiry; verify no session credential is accessible from JavaScript | FA / Dev | 1 h |
| 8.3.4 | Role Boundary Enforcement Verification | Systematically verify all role-protected endpoints return 403 for unauthorized callers: Employee calling approve/reject (403), Manager calling endpoints with Employee restrictions verified | FA / Dev | 2 h |

---

### 9.0 Documentation & Knowledge Transfer

#### 9.1 SDLC Documentation Artifacts

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 9.1.1 | Strategic Intake Sign-Off (SI-001) | Obtain stakeholder signatures on SI-001; archive as approved baseline | PM / PO | 1 h |
| 9.1.2 | Functional Requirements Specification Sign-Off (FRS-001) | Obtain stakeholder signatures on FRS-001; archive as approved baseline | PM / PO | 1 h |
| 9.1.3 | Architecture Documents Sign-Off (UT-001, AO-001, AA-001, AE-001, SAD) | Obtain Solution Architect and Architecture Review Board signatures on all five architecture documents | FA / Dev | 2 h |
| 9.1.4 | Planning Documents Sign-Off (BLG-001, EA-001, WBS-001) | Obtain Product Owner and Technical Lead signatures on Backlog, Roadmap, and WBS | PM / PO | 2 h |

---

#### 9.2 Technical Documentation

| WBS ID | Work Package | Description | Owner | Est. Effort |
|--------|--------------|-------------|-------|-------------|
| 9.2.1 | README — Local Setup Guide | Document step-by-step local setup: prerequisites (.NET 8 SDK, Node.js 20.x), clone instructions, `dotnet run` for API, `npm run dev` for frontend, CORS configuration note, expected behavior on first run | FA / Dev | 4 h |
| 9.2.2 | API Endpoint Reference | Document all REST endpoints: method, path, required role, request body, response codes, example responses; include note on `credentials: 'include'` requirement | FA / Dev | 4 h |
| 9.2.3 | Architecture Notes — ITransactionService & ICurrentUserContext | Add inline comments to `ITransactionService.cs` and `ICurrentUserContext.cs` citing NFR-MAINT-001 and NFR-REL-002 as rationale; document nested transaction guard behavior | FA / Dev | 2 h |
| 9.2.4 | Database Schema Documentation | Document `vacaflow.db` schema: all four tables, columns, data types, constraints, relationships; include note on BCrypt hash storage and manual backup procedure | FA / Dev | 2 h |

---

#### 9.3 Closure Documentation

| WBS ID | Work Package | Description | Owner | Milestone | Est. Effort |
|--------|--------------|-------------|-------|-----------|-------------|
| 9.3.1 | Closure Report | Document final project outcomes, scope delivered vs. planned, milestone achievement, team performance summary | FA / Dev | M6 | 6 h |
| 9.3.2 | Lessons Learned | Document lessons learned from the compressed 9-day delivery: what worked (explicit interfaces, domain-first testing), what could improve (earlier CORS documentation, earlier seed data verification) | FA / Dev | M6 | 4 h |
| 9.3.3 | Knowledge Transfer Checklist | Produce KT checklist covering: local setup procedure, architecture walkthrough, business rules reference, Won't v1 backlog, recommended next steps for Phase 2 and Phase 3 per SAD §1.5 | FA / Dev | M6 | 4 h |

---

## 5. WBS Dictionary — Key Work Packages

### WBS 4.2.4 — HttpContextCurrentUserContext Implementation

| Field | Value |
|-------|-------|
| WBS ID | 4.2.4 |
| Work Package Name | HttpContextCurrentUserContext Implementation |
| Description | Implement the `HttpContextCurrentUserContext` class in `VacaFlow.Infrastructure`. Reads `ClaimTypes.NameIdentifier` and the role claim from `HttpContext.User` after the `CookieAuthenticationMiddleware` has validated the session cookie. Throws `UnauthorizedAccessException` if the identity claim is absent. Implements the `ICurrentUserContext` interface declared in `VacaFlow.Application`. |
| Responsible | Yeuri Reyes (FA / Dev) |
| Deliverables | `HttpContextCurrentUserContext.cs` in `VacaFlow.Infrastructure`; DI registration in `InfrastructureServiceExtensions`; passing unit test for absent-claim throw scenario |
| Dependencies | 4.2.2 (HttpOnly Cookie issuance must be configured so that validated claims are present in `HttpContext.User`) |
| Assumptions | `IHttpContextAccessor` is registered as scoped in the DI container by ASP.NET Core |
| Constraints | Must implement `ICurrentUserContext` using only types from `VacaFlow.Application`; no ASP.NET Core types may appear in the Application layer interface signature |
| Acceptance Criteria | `ICurrentUserContext.CurrentUserId` returns the correct `Guid` from the validated cookie claim; `ICurrentUserContext.CurrentUserRole` returns the correct `UserRole` enum value; throws `UnauthorizedAccessException` when called without a valid session |
| Estimated Effort | 3 person-hours |

---

### WBS 6.2.5 — EfCoreTransactionService Implementation

| Field | Value |
|-------|-------|
| WBS ID | 6.2.5 |
| Work Package Name | EfCoreTransactionService Implementation |
| Description | Implement `EfCoreTransactionService` in `VacaFlow.Infrastructure`, providing explicit database transaction management for the approve/reject atomic boundary. Implements `ITransactionService.ExecuteInTransactionAsync(Func<Task>)`: opens a transaction via `VacaFlowDbContext.Database.BeginTransactionAsync()`, executes the delegate, commits on success, rolls back on exception. Includes a guard that throws a descriptive `InvalidOperationException` if a nested transaction is detected (SQLite does not support nested transactions). |
| Responsible | Yeuri Reyes (FA / Dev) |
| Deliverables | `EfCoreTransactionService.cs` in `VacaFlow.Infrastructure`; DI registration in `InfrastructureServiceExtensions`; unit test with pass-through fake confirming delegate execution and rollback behavior |
| Dependencies | 3.3.1 (VacaFlowDbContext configured), 3.3.2 (EF Core auto-provisioning working) |
| Assumptions | `VacaFlowDbContext` is registered as scoped; `EfCoreTransactionService` is registered as scoped |
| Constraints | `ITransactionService` interface in `VacaFlow.Application` must use only `System.Func<System.Threading.Tasks.Task>` — no EF Core types in the interface signature (NFR-MAINT-001); `EfCoreTransactionService` resides in Infrastructure only |
| Acceptance Criteria | `ExecuteInTransactionAsync` commits on successful delegate completion; rolls back on exception and re-throws; guard throws descriptive `InvalidOperationException` on nested call; Application layer unit tests for `ApprovalService` use a simple pass-through fake with no `DbContext` dependency |
| Estimated Effort | 4 person-hours |

---

### WBS 6.2.6 — ApprovalService — ApproveAsync

| Field | Value |
|-------|-------|
| WBS ID | 6.2.6 |
| Work Package Name | ApprovalService — ApproveAsync |
| Description | Implement `ApprovalService.ApproveAsync(requestId, comment)` in `VacaFlow.Application`. Reads the approver's identity from `ICurrentUserContext.CurrentUserId` (session-derived, never from request payload). Retrieves the `AbsenceRequest` via `IRequestRepository.GetByIdAsync`. Calls `request.Approve(approverId, comment)` on the domain entity, which invokes `SelfApprovalGuard` and the `RequestStateMachine`. Wraps `IRequestRepository.UpdateAsync` and `IApprovalRepository.InsertAsync` inside `ITransactionService.ExecuteInTransactionAsync` to guarantee atomicity of the state change and Approval record creation. |
| Responsible | Yeuri Reyes (FA / Dev) |
| Deliverables | `ApprovalService.ApproveAsync` implementation; unit tests covering all 7 AC scenarios for US-009 using in-memory fakes |
| Dependencies | 6.2.1 (ApprovalRecord), 6.2.2 (SelfApprovalGuard), 6.2.3 (AbsenceRequest.Approve), 6.2.4 (IApprovalRepository), 6.2.5 (EfCoreTransactionService), 4.2.4 (ICurrentUserContext) |
| Assumptions | `ITransactionService`, `IRequestRepository`, `IApprovalRepository`, and `ICurrentUserContext` are all injected via constructor DI |
| Constraints | `ApprovalService` must import only types from `VacaFlow.Domain` and `VacaFlow.Application`; no EF Core, no ASP.NET Core references in this class |
| Acceptance Criteria | Approver ID is always read from `ICurrentUserContext.CurrentUserId`; payload approver ID is never used; `SelfApprovalGuard` throws `DomainException` when `ApproverId == RequestorId`; both `UpdateAsync` and `InsertAsync` execute within a single transaction; second approval attempt throws because request state is already Approved |
| Estimated Effort | 5 person-hours |

---

### WBS 7.2.1 — Full Acceptance Checklist Walkthrough

| Field | Value |
|-------|-------|
| WBS ID | 7.2.1 |
| Work Package Name | Full Acceptance Checklist Walkthrough |
| Description | Execute a structured end-to-end walkthrough of all 14+ acceptance criteria from the signed Backlog (BLG-001) in the local execution environment. Walkthrough uses registered accounts — at least one Employee account and one Manager account (the Manager account seeded at startup). Yeuri Reyes prepares results; Junior Gervacio observes and approves each scenario. |
| Responsible | Yeuri Reyes (FA / Dev) — execution; Junior Gervacio (PM / PO) — observation and final acceptance |
| Deliverables | Completed acceptance checklist document with pass/fail status for each of the 14+ criteria; list of any open defects with classification (blocking / non-blocking) |
| Dependencies | 7.3.1–7.3.3 (defect triage must be complete before final UAT walkthrough) |
| Assumptions | Local environment is running (`dotnet run` + `npm run dev`); `vacaflow.db` is freshly provisioned with seed data; both Employee and Manager accounts are available |
| Constraints | All scenarios executed in the local environment only — no cloud, no Docker, no external services |
| Acceptance Criteria | All Must Have acceptance criteria demonstrate pass status; all business rules (BR-001 through BR-011) verified with correct and incorrect inputs; zero blocking defects remain open |
| Estimated Effort | 4 person-hours |

---

### WBS 9.2.1 — README — Local Setup Guide

| Field | Value |
|-------|-------|
| WBS ID | 9.2.1 |
| Work Package Name | README — Local Setup Guide |
| Description | Produce a comprehensive README documenting all steps required to clone and run VacaFlow_03 in under 15 minutes (NFR-USE-001, SC-USE-01). Covers prerequisites, repository structure, API startup (`dotnet run`), frontend startup (`npm run dev`), CORS configuration, expected first-run behavior (auto-provisioned `vacaflow.db`), and seed data (absence types, Manager account). Includes warning about `.gitignore` for `vacaflow.db`. |
| Responsible | Yeuri Reyes (FA / Dev) |
| Deliverables | `README.md` at repository root |
| Dependencies | 3.2.3 (.gitignore configuration), 3.3.2 (auto-provisioning confirmed working) |
| Assumptions | Reviewer has .NET 8 SDK and Node.js 20.x installed |
| Constraints | Setup time must not exceed 15 minutes for a developer with prerequisites already installed |
| Acceptance Criteria | An independent reviewer can clone the repository, follow the README, and reach a running application with seeded data in ≤ 15 minutes; no steps requiring external service accounts, API keys, or cloud access |
| Estimated Effort | 4 person-hours |

---

## 6. Milestone-to-WBS Mapping

| Milestone | Target Date | WBS Elements Required |
|-----------|-------------|----------------------|
| M1: Kickoff & Environment Ready | 2026-07-07 | 1.1.1, 1.1.2, 1.1.3, 1.1.4, 3.1.1, 3.1.2, 3.1.3, 3.2.1 through 3.2.5, 3.3.1 through 3.3.4 |
| M2: Authentication Working | 2026-07-09 | 4.1.1 through 4.1.7, 4.2.1 through 4.2.7, 4.3.1 through 4.3.5, 8.1.1, 8.1.2 |
| M3: Employee Request Lifecycle Complete | 2026-07-12 | 5.1.1 through 5.1.7, 5.2.1 through 5.2.6, 5.3.1 through 5.3.6, 5.4.1 through 5.4.7 |
| M4: Manager Approval Workflow Complete | 2026-07-15 | 6.1.1 through 6.1.6, 6.2.1 through 6.2.10, 6.3.1 through 6.3.7, 8.3.1 through 8.3.4 |
| M5: Go-Live — MVP Accepted | 2026-07-16 | 7.1.1 through 7.1.4, 7.2.1 through 7.2.5, 7.3.1 through 7.3.3, 7.4.1 through 7.4.3, 8.2.1 through 8.2.4 |
| M6: Project Close | 2026-07-20 | 1.4.1 through 1.4.3, 9.1.1 through 9.1.4, 9.2.1 through 9.2.4, 9.3.1 through 9.3.3 |

---

## 7. Sprint-to-WBS Traceability

| Sprint | WBS Branch | User Stories | Milestone |
|--------|-----------|--------------|-----------|
| Pre-Sprint (2026-07-07) | 1.1, 2.0, 3.0 | — | M1 |
| Sprint 1 (2026-07-07 to 2026-07-09) | 4.0, 8.1.1, 8.1.2 | US-001, US-002, US-003 | M2 |
| Sprint 2 (2026-07-10 to 2026-07-12) | 5.0 | US-004, US-005, US-006, US-007 | M3 |
| Sprint 3 (2026-07-13 to 2026-07-15) | 6.0, 8.3.0 | US-008, US-009, US-010 | M4 |
| Sprint 4 (2026-07-16) | 7.0, 8.2.0, 8.1.3, 8.1.4 | US-011, US-012, US-013 (if capacity) | M5 |
| Closure (2026-07-17 to 2026-07-20) | 1.4, 9.0 | — | M6 |

---

## 8. Effort Summary

| WBS Phase | Work Packages | Estimated Effort |
|-----------|---------------|-----------------|
| 1.0 Project Management | 19 | 55 h |
| 2.0 Requirements & Architecture | 13 | 104 h |
| 3.0 Environment & Infrastructure Setup | 10 | 31 h |
| 4.0 Sprint 1 — Authentication | 18 | 51 h |
| 5.0 Sprint 2 — Employee Request Lifecycle | 23 | 66 h |
| 6.0 Sprint 3 — Manager Approval Workflow | 21 | 77 h |
| 7.0 Sprint 4 — Hardening & Go-Live | 14 | 42 h |
| 8.0 Quality Assurance (Cross-Sprint) | 12 | 41 h |
| 9.0 Documentation & Knowledge Transfer | 11 | 33 h |
| **Total** | **141** | **~500 h** |

> **Note on Effort vs. Calendar Time:** The 9-day delivery window (M1 to M5) reflects a 2-person team where Yeuri Reyes is the primary executor. The effort figures represent total person-hours across all activities including requirements documentation, architecture design, implementation, testing, and verification. The compressed calendar timeline is reflected in the roadmap's 3-story/sprint velocity target.

---

## 9. WBS Verification Checklist

- [x] **100% scope coverage:** All 13 user stories from BLG-001 are represented in WBS branches 4.0 through 7.0; all 19 Won't v1 items are explicitly excluded
- [x] **Milestone alignment:** All 6 milestones from EA-001 are mapped to specific WBS work packages
- [x] **Component alignment:** Onion layer structure from SAD (Domain, Application, Infrastructure, Api, vacaflow-web) is reflected in Sprint 1–3 work package decomposition
- [x] **Ownership assignment:** All work packages assigned to PM / PO (Junior Gervacio) or FA / Dev (Yeuri Reyes)
- [x] **Dependency identification:** Key technical dependencies documented in WBS Dictionary entries and within work package descriptions
- [x] **Mutually exclusive packages:** No overlap between sprint branches; QA (8.0) and Documentation (9.0) are cross-cutting but non-overlapping with feature development branches
- [x] **8/80 rule compliance:** All individual work packages estimated between 1 and 20 person-hours at the Level 3 granularity; no package exceeds 80 hours
- [x] **Business rules traceability:** All 11 business rules (BR-001 through BR-011) are referenced in the relevant acceptance criteria verification work packages
- [x] **Risk-to-WBS coverage:** All 6 risks from EA-001 §4 are addressed by dedicated risk monitoring work packages (1.3.1 through 1.3.6)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | Junior Gervacio | | ⏳ Pending |
| Technical Lead | Yeuri Reyes | | ⏳ Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Junior Gervacio (AI Assisted) |
| Approval Authority | Product Owner |
| Status | Approved |
| Signature | ✅ SIGNED by Junior Gervacio (junior.gervacio@arroyoconsulting.net) on 2026-07-20 21:45:19 UTC |

*— End of document —*
