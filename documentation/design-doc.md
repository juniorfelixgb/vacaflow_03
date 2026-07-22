# Architecture Overview
## VacaFlow_03

**Author**: Yeuri Jessel Reyes (AI Assisted)
**Date**: 2026-07-20
**Version**: 1.0
**Status**: Draft
**Project**: VacaFlow_03 — IGS Solutions
**References**: SI-001 (Strategic Intake), FRS-001 (Functional Requirements Specification), NFR-001 (Non-Functional Requirements Specification), RTM-001 (Requirements Traceability Matrix), UT-001 (Utility Tree)

---

## 1. Executive Summary

### 1.1 Purpose

This document describes the technical architecture for VacaFlow_03 (IGS Solutions), providing a consolidated reference of requirements, constraints, quality attributes, and architecture decisions to guide the development team. It integrates information from the functional specification, non-functional specification, requirements traceability matrix, and the quality attribute weighting analysis into a single authoritative architecture communication document for all stakeholders.

### 1.2 Scope

This architecture covers the VacaFlow MVP application and all its internal components: the Next.js web frontend, the ASP.NET Core Minimal API backend, the SQLite database, the local authentication system (registration and login), and the core business workflow (absence requests and approvals). The architecture also covers the Onion Architecture layering — Domain, Application, Infrastructure, API, and Web.

The following are explicitly excluded from this architecture:

- Microsoft Entra ID and any corporate single sign-on provider
- Azure deployment infrastructure
- Docker and CI/CD pipelines
- Email or Teams notifications
- Password reset and email verification flows
- Account administration screens
- Vacation balance calculations, holiday calendars, working-day calculations, and overlapping request validation
- Attachments, HR administration views, reporting and exports
- Multi-level approvals, approval delegation
- Payroll, HR, calendar, and directory integrations
- Advanced audit trails

### 1.3 Audience

| Role | Interest |
|------|----------|
| Development Team | Implementation guidance — layer responsibilities, component assignments, and technology choices |
| Technical Lead | Architecture validation — layer boundaries, dependency direction, and design decision rationale |
| Solution Architect | Architecture ownership — quality attribute coverage, trade-off acceptance, and compliance with NFR-MAINT-001 |
| Business Sponsor (James Parker) | Strategic alignment — confirmation that the MVP scope and constraints are correctly reflected |
| QA Lead | Quality and testability review — testability of business rules, state machine, and security constraints via the defined verification methods |
| Product Owner | Acceptance criteria alignment — traceability of functional requirements to architectural decisions |

### 1.4 Architecture Summary

VacaFlow_03 adopts a **Reduced Onion Architecture** pattern (five layers: Domain, Application, Infrastructure, API, Web), selected via the Quality Attribute Weighting analysis conducted against the eight quality attributes identified in NFR-001. Security ranked first (Critical priority, highest stakeholder weight) and Reliability ranked second (Critical priority), together establishing the architectural non-negotiables: server-side identity derivation, role enforcement at the API boundary, and transactional approval records. Usability and Compatibility ranked jointly third, confirming the requirement for a clean HTTP-based frontend-backend separation and local self-contained execution.

The selected architecture achieved the highest weighted alignment with these drivers by providing clear inward-pointing dependencies that isolate domain business rules from infrastructure concerns, enabling reliable rule enforcement without introducing unnecessary patterns such as MediatR, CQRS, or generic repositories. Trade-offs accepted: absence of a distributed or cloud-ready deployment model, no event-driven integration capability, and SQLite as the sole persistence engine, all of which are appropriate given the explicitly bounded MVP scope.

---

## 2. Requirements

### 2.1 Functional Requirements

> Source: FRS-001 (`documentation/02-define/functional-spec.md`)

#### User Authentication Module (FR-AUTH)

| ID | Functional Requirement |
|----|------------------------|
| FR-AUTH-001 | Register with name, email, password, and role |
| FR-AUTH-002 | Public registration cannot assign Manager role |
| FR-AUTH-003 | Passwords stored as cryptographic hashes |
| FR-AUTH-004 | Validate credentials on login and establish session |
| FR-AUTH-005 | Generic error message on invalid credentials |
| FR-AUTH-006 | Terminate session on logout |
| FR-AUTH-007 | Current-user endpoint returns identity from session |
| FR-AUTH-008 | API derives identity from session; frontend never sends trusted IDs |

#### Absence Type Catalog Module (FR-ATC)

| ID | Functional Requirement |
|----|------------------------|
| FR-ATC-001 | Seed Vacation, Personal Leave, Sick Leave at startup |
| FR-ATC-002 | Endpoint lists all available absence types |
| FR-ATC-003 | No create/edit/delete endpoint or UI for absence types |

#### Absence Request Management Module (FR-ARM)

| ID | Functional Requirement |
|----|------------------------|
| FR-ARM-001 | Employee creates Draft request |
| FR-ARM-002 | End date cannot be earlier than start date |
| FR-ARM-003 | Start date cannot be in the past |
| FR-ARM-004 | Employee edits a Draft request |
| FR-ARM-005 | Non-Draft requests cannot be edited |
| FR-ARM-006 | Employee submits Draft → Submitted |
| FR-ARM-007 | Submitted request is read-only for employee |
| FR-ARM-008 | Employee cancels Draft or Submitted request |
| FR-ARM-009 | Only owner can edit, submit, or cancel |
| FR-ARM-010 | Owner inferred from session; no employee ID from frontend |
| FR-ARM-011 | Employee lists own requests including final decisions |

#### Manager Review and Approval Module (FR-MRA)

| ID | Functional Requirement |
|----|------------------------|
| FR-MRA-001 | Manager views only Submitted requests assigned to them |
| FR-MRA-002 | Manager approves Submitted → Approved + one Approval record |
| FR-MRA-003 | Manager rejects Submitted → Rejected + one Approval record |
| FR-MRA-004 | Optional comment on approval or rejection |
| FR-MRA-005 | Approver derived from session; no approver ID from frontend |
| FR-MRA-006 | Manager cannot approve or reject own request |
| FR-MRA-007 | Only Manager role can approve or reject |
| FR-MRA-008 | Each request has at most one Approval record |

#### Request Lifecycle State Enforcement Module (FR-LSE)

| ID | Functional Requirement |
|----|------------------------|
| FR-LSE-001 | Enforce valid state transitions only |
| FR-LSE-002 | Approved, Rejected, Cancelled are final states |
| FR-LSE-003 | Return clear descriptive error on invalid state transition |
| FR-LSE-004 | Only Draft requests can be edited |
| FR-LSE-005 | Only Submitted requests can be approved or rejected |
| FR-LSE-006 | Only request owner can edit, submit, or cancel |
| FR-LSE-007 | Only Manager role can approve or reject |

---

### 2.2 Non-Functional Requirements

> Source: NFR-001 (`documentation/03-requirements/nonfunctional-spec.md`)

| ID | Quality Attribute | Requirement | Priority |
|----|-------------------|-------------|----------|
| NFR-PERF-001 | Performance | No observable blocking delays during review workflow | Low |
| NFR-PERF-002 | Performance | SQLite handles concurrent review-window load without lock errors | Low |
| NFR-SEC-001 | Security | Passwords stored as hashes; never plain text | Critical |
| NFR-SEC-002 | Security | All authorization derived server-side from session or token | Critical |
| NFR-SEC-003 | Security | Two roles enforced server-side; Manager role not self-assignable | Critical |
| NFR-SEC-004 | Security | SQLite file not publicly accessible; excluded from source control | Critical |
| NFR-SEC-005 | Security | Personal data not exposed to unauthorized users or in logs | Critical |
| NFR-AVAIL-001 | Availability | Blocking defects in core workflow remediated before acceptance | Low |
| NFR-AVAIL-002 | Availability | README documents SQLite file location and reset instructions | Low |
| NFR-USE-001 | Usability | Workflow completable without training beyond README | High |
| NFR-USE-002 | Usability | UI shows only valid actions for current request state | High |
| NFR-USE-003 | Usability | Renders correctly on standard desktop viewports (1024px+) | High |
| NFR-REL-001 | Reliability | All business rules enforced consistently; acceptance fails if bypassed | Critical |
| NFR-REL-002 | Reliability | Approval/rejection recorded atomically; no inconsistent state on failure | High |
| NFR-REL-003 | Reliability | All API inputs validated before business logic executes | High |
| NFR-MAINT-001 | Maintainability | Reduced Onion Architecture (5 layers); no MediatR, CQRS, generic repos | Medium |
| NFR-MAINT-002 | Maintainability | README covers prerequisites, setup, accounts, endpoints, scope, deferred items | Medium |
| NFR-COMPAT-001 | Compatibility | Application starts and runs from source on local machine | High |
| NFR-COMP-001 | Compliance | Basic data protection practices for MVP | Medium |

---

## 3. Constraints and Assumptions

### 3.1 Constraints

> Source: SI-001 (`sources/01-intake-strategic-intake-sources.md`) — Questions 11a, 11b, 11c

#### 3.1.1 Business Constraints

- The absence management workflow must validate date ranges: the end date of any request cannot precede the start date, and the start date cannot be set in the past.
- Only request owners (the employee who created the request) may edit, submit, or cancel their own requests; no action may be performed on another employee's behalf.
- Only employees with the Manager role may approve or reject requests; an Employee-role user cannot perform approval actions under any circumstances.
- A Manager cannot approve or reject a request they personally submitted, eliminating any self-approval path.
- Manager accounts cannot be created through public self-registration; the registration flow must prevent self-assignment of the Manager role. Manager accounts are provisioned exclusively through seed data or controlled manual setup.
- The Manager role and the authenticated approver identity must be enforced server-side; bypassing identity or role controls through any mechanism is grounds for acceptance failure.
- Three absence types are pre-seeded and fixed for the MVP: Vacation, Personal Leave, and Sick Leave. No catalog administration interface is provided.
- Each request must produce exactly one Approval record upon approval or rejection; duplicate approval records are not permitted.

#### 3.1.2 Legal Constraints

- User emails, password hashes, names, absence request reasons, request dates, and approval comments constitute personal data and must be protected from unauthorized access.
- The application must not expose personal data in API error responses, log output, or HTTP responses to users who do not have authorization to view it.
- No formal regulatory or compliance certifications (SOC 2, GDPR, HIPAA, IRS) are required for the MVP. The README must acknowledge that these requirements must be formally revisited before any production or broader employee use of the system.
- No privacy notice or user consent flow is required for the MVP review window; this is explicitly deferred to a post-MVP stage contingent on production authorization by the project sponsor.

#### 3.1.3 Technical Constraints

- The entire application must run locally from source code on a reviewer's developer machine. Azure deployment, Docker, and CI/CD pipelines are out of scope for the MVP.
- Authentication must be managed by the application itself using local registration and login with hashed passwords. Microsoft Entra ID and any corporate SSO provider are explicitly deferred.
- The API must derive the current user's identity and the responsible approver exclusively from the authenticated session or token on every protected request. The frontend must not supply employee IDs, approver IDs, or role claims as trusted values for business decisions.
- Passwords must always be stored as cryptographic hashes. Plain-text password storage is prohibited regardless of the MVP scope.
- The architecture must implement a reduced Onion Architecture with exactly five layers: Domain, Application, Infrastructure, API, and Web. No MediatR, CQRS, generic repository patterns, or messaging frameworks may be introduced.
- The SQLite database file must not be served as a static asset by the web server or API, and must be excluded from source control commits. The README must document the file location and reset instructions.
- The codebase must include a README sufficient for a reviewer to set up, run, and navigate the full workflow without external assistance.

### 3.2 Assumptions

- The application is run locally from source code by a reviewer on a developer machine; no cloud or server infrastructure is available during the MVP validation window.
- A single SQLite database file is sufficient for persistence during the MVP validation window; no concurrent multi-user production load is expected.
- At least one Manager account will be available via seed data before the review begins, enabling approval and rejection scenarios to be exercised without an admin UI.
- The session or token mechanism chosen by the implementation team (cookie-based or token-based) will reliably identify the current user across all API requests, allowing the API to derive ownership and approver identity server-side without ambiguity.
- Public self-registration will not be exploited to create unauthorized Manager accounts, because the registration flow prevents self-assignment of the Manager role; Manager accounts remain controlled through seed data or manual setup.
- The reviewer's local environment has the necessary runtimes (.NET SDK and Node.js) installed and available to start both the API and the web application from source.
- No real employee personal data will be entered during the MVP review; the SQLite file will not be committed to source control containing real credentials or personal information.

### 3.3 Technical Dependencies

| Dependency | Type | Description |
|------------|------|-------------|
| Next.js and React | Internal (Web Layer) | Web interface framework; must be available in the local Node.js environment |
| ASP.NET Core Minimal API (.NET runtime) | Internal (API Layer) | Backend API framework; must be available in the local .NET environment |
| SQLite | Internal (Infrastructure Layer) | Embedded database engine used for both application data and local authentication tables; no separate database server required |
| Entity Framework Core | Internal (Infrastructure Layer) | ORM used by the Infrastructure layer to interact with SQLite, including migrations or automatic database creation and seed data population |
| Node.js runtime | External (Build/Run) | Required to restore and run the Next.js web application from source |
| .NET SDK | External (Build/Run) | Required to restore and run the ASP.NET Core API from source |

No external identity providers, cloud services, email services, or third-party APIs are depended upon by the MVP.

---

## 4. Utility Tree

> Source: UT-001 (`documentation/04-architecture/utility-tree.md`) — Quality Tree diagram (Section 2)

The following quality tree was generated from the weighted quality attribute analysis (Porcentaje method) conducted during the Utility Tree phase. It reflects the priority ordering of quality attributes that drove the architecture selection for VacaFlow_03.

```
VacaFlow_03 — Quality Utility Tree
│
├── Security [Critical / Highest Weight]
│   ├── SC-01: Password hashing — raw password never stored or logged
│   ├── SC-02: Session-based identity — spoofed body IDs ignored by API
│   ├── SC-03: Role enforcement — Employee on approve/reject returns 403
│   ├── SC-04: Cross-user data isolation — Employee sees only own requests
│   └── SC-05: Database file protection — not served as static asset; excluded from source control
│
├── Reliability [Critical / High Weight]
│   ├── SC-06: Date validation — invalid date range returns 400; no record created
│   ├── SC-07: State transition enforcement — invalid transitions return descriptive error; state unchanged
│   └── SC-08: Transactional approval — DB write failure rolls back entire operation; no orphaned state
│
├── Usability [High / Joint Third Weight]
│   ├── SC-09: Full lifecycle completable by first-time reviewer using only README
│   ├── SC-10: State-appropriate action visibility — only valid actions rendered per state
│   └── SC-11: Desktop viewport rendering — no horizontal scroll at 1280×800 and 1920×1080
│
├── Compatibility [High / Joint Third Weight]
│   └── SC-12: Fresh-clone setup — all README steps complete successfully; full workflow executable
│
├── Maintainability [Medium Weight]
│   ├── SC-13: Layer boundary identification — five layers identifiable by name; no MediatR/CQRS packages
│   └── SC-14: README completeness — all required sections present; first-time setup succeeds
│
├── Compliance [Medium Weight]
│   └── SC-15: MVP data protection — README acknowledges stored data and deferred compliance obligations
│
├── Performance [Low Weight]
│   └── SC-16: Review workflow responsiveness — no perceivable blocking delays; no timeout fires
│
└── Availability [Low Weight]
    └── SC-17: Blocking defect remediation — all core workflow steps complete without blocking defects at acceptance
```

---

## 5. Architecture Overview

### 5.1 Architecture Principles

| Principle | Description | Rationale |
|-----------|-------------|-----------|
| Minimal Scope Discipline | Include only what is required to demonstrate the full request lifecycle and nothing more | The MVP must prove the end-to-end workflow without growing into an HR platform. Scope creep is identified as a primary risk in SI-001 |
| Server-Side Identity Authority | The API must derive the current user identity and the responsible approver from the authenticated session or token on every protected request | Prevents users from spoofing request ownership or approval responsibility, which was explicitly identified as an unacceptable security risk by the project sponsor and is enforced by NFR-SEC-002 and BR-011 |
| Layered Separation via Onion Architecture | The codebase is structured into distinct layers — Domain, Application, Infrastructure, API, and Web — with all dependencies pointing inward toward the Domain | Keeps domain business rules and use cases isolated from infrastructure concerns, enabling clarity and maintainability without requiring heavyweight patterns such as MediatR or CQRS (NFR-MAINT-001) |
| Self-Contained Local Execution | The entire application must run locally from source code without cloud infrastructure, containers, or external services | The MVP is scoped for requirements validation on a reviewer's machine, not for production deployment; minimising external dependencies is essential for NFR-COMPAT-001 |
| Basic Security Hygiene | Passwords must always be stored as hashes and sensitive data must not be publicly exposed | Even in a limited MVP, protecting user credentials and personal data is a non-negotiable baseline agreed by the project sponsor and mandated by NFR-SEC-001 through NFR-SEC-005 |

### 5.2 Architecture Style

> *Auto-populated from Utility Tree sources (UT-001) — do not modify manually.*

**Style**: Reduced Onion Architecture (Domain, Application, Infrastructure, API, Web)

**Rationale**: Selected via Quality Attribute Weighting analysis (Porcentaje method). The Reduced Onion Architecture was identified as the highest-alignment option for the VacaFlow_03 quality attribute profile. It provides clear inward-pointing dependencies that isolate business rules in the Domain layer, enabling consistent enforcement of the 11 business rules defined in RTM-001 without coupling them to infrastructure or transport concerns. It satisfies NFR-MAINT-001 (no MediatR, CQRS, or generic repositories) while remaining sufficiently lightweight for a self-contained local MVP. See UT-001 for the full evaluation.

**Key drivers**:
- **Security** (Critical) — The inward-pointing dependency model ensures that authorization and identity derivation in the Application layer cannot be bypassed by the API or Web layers
- **Reliability** (Critical) — Domain-layer rule enforcement guarantees that business rules are evaluated independently of the transport layer, preventing bypass via any API path
- **Usability and Compatibility** (High, joint) — The clean HTTP boundary between the Web and API layers supports state-driven UI rendering and enables local execution without cloud dependencies

**Trade-offs accepted**:
- No distributed or cloud-ready deployment model; the architecture is optimized for single-machine local execution, not horizontal scaling
- SQLite as the sole persistence engine; no support for multi-tenant or high-concurrency production load
- No event-driven integration capability; all cross-layer communication is synchronous and in-process
- No generic repository abstraction; the Infrastructure layer implements concrete data access, which is appropriate for the bounded MVP but would require refactoring for a more general production persistence strategy

### 5.3 High-Level Architecture

The VacaFlow MVP follows a reduced Onion Architecture with five layers, hosted entirely on a local developer machine. All inter-layer communication flows strictly inward; no layer may bypass the API to access the database directly from the web layer.

```
┌─────────────────────────────────────────────────────────────────┐
│  REVIEWER'S LOCAL MACHINE                                       │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  WEB LAYER — Next.js / React                              │  │
│  │                                                           │  │
│  │  Screens:                                                 │  │
│  │   • Register          • Employee Request List             │  │
│  │   • Login             • Request Form (Create / Edit)      │  │
│  │   • Logout            • Manager Review List               │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ HTTP (REST)                       │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  API LAYER — ASP.NET Core Minimal API                     │  │
│  │                                                           │  │
│  │  Auth endpoints:                                          │  │
│  │   POST /register  POST /login  POST /logout               │  │
│  │   GET  /me                                                │  │
│  │                                                           │  │
│  │  Workflow endpoints:                                      │  │
│  │   GET  /absence-types                                     │  │
│  │   GET  /requests          POST   /requests                │  │
│  │   PUT  /requests/{id}     POST   /requests/{id}/submit    │  │
│  │   POST /requests/{id}/cancel                              │  │
│  │   GET  /manager/requests                                  │  │
│  │   POST /requests/{id}/approve                             │  │
│  │   POST /requests/{id}/reject                              │  │
│  │                                                           │  │
│  │  Identity resolved from authenticated session/token       │  │
│  │  Role enforcement via RoleAuthorizationMiddleware         │  │
│  │  Global error handling middleware (no stack traces)       │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ In-process calls                  │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  APPLICATION LAYER                                        │  │
│  │                                                           │  │
│  │  Use cases:                                               │  │
│  │   • Request lifecycle orchestration (create, edit,        │  │
│  │     submit, cancel, approve, reject)                      │  │
│  │   • Business rule enforcement coordination                │  │
│  │   • Authorization checks (role, ownership,                │  │
│  │     manager assignment, self-approval guard)              │  │
│  │   • SessionContext — reads authenticated identity         │  │
│  │                                                           │  │
│  │  Services: UserService, AuthService, RequestService,      │  │
│  │            ApprovalService, AbsenceTypeService            │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ Inward dependency                 │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  DOMAIN LAYER                                             │  │
│  │                                                           │  │
│  │  Entities: Employee, AbsenceType, AbsenceRequest,         │  │
│  │            ApprovalRecord                                 │  │
│  │                                                           │  │
│  │  Rules: DateRangeRule, RequestStateMachine,               │  │
│  │         RequestStateGuard, SelfApprovalGuard,             │  │
│  │         RoleValidator, OwnershipGuard                     │  │
│  │                                                           │  │
│  │  State transitions:                                       │  │
│  │   Draft → Submitted → Approved (final)                    │  │
│  │                     → Rejected  (final)                   │  │
│  │   Draft → Cancelled (final)                               │  │
│  │   Submitted → Cancelled (final)                           │  │
│  └───────────────────────────┬───────────────────────────────┘  │
│                              │ Implements interfaces             │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  INFRASTRUCTURE LAYER                                     │  │
│  │                                                           │  │
│  │  Entity Framework Core + SQLite                           │  │
│  │                                                           │  │
│  │  Tables: Employees, AbsenceTypes, AbsenceRequests,        │  │
│  │          ApprovalRecords, (auth tables)                   │  │
│  │                                                           │  │
│  │  Seed data: Vacation, Personal Leave, Sick Leave          │  │
│  │             Initial Manager account                       │  │
│  │                                                           │  │
│  │  Repositories: UserRepository, RequestRepository,         │  │
│  │                ApprovalRepository, AbsenceTypeSeeder      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key structural rules:**
- The Web layer communicates exclusively with the API layer over HTTP; it has no direct access to Application, Domain, or Infrastructure layers
- The API layer authenticates every protected request, derives user identity from the session/token, and delegates business operations to the Application layer only
- The Application layer enforces ownership and role authorization and orchestrates Domain rule evaluation; it does not access Infrastructure directly — it depends on repository interfaces implemented by Infrastructure
- The Domain layer contains all business entities and rule enforcement; it has zero dependencies on any other layer
- The Infrastructure layer implements repository interfaces defined in the Application layer and owns all data access; no other layer references EF Core or SQLite directly

### 5.4 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Authentication mechanism | Application-managed local registration and login with hashed passwords (BCrypt / PBKDF2 via ASP.NET Core Identity defaults) | Microsoft Entra ID and corporate SSO are explicitly deferred. The MVP requires enough authentication to bind actions to a real logged-in user and prevent the old simulated user selector. A simple local model achieves this without external dependencies (NFR-SEC-001, FR-AUTH-003) |
| User identity source for all business operations | API derives employee and approver identity exclusively from the authenticated session or token; no trusted identity values accepted from the frontend | Prevents spoofing of request ownership and approval responsibility, which the project sponsor explicitly identified as an unacceptable security risk. Implements NFR-SEC-002, NFR-SEC-003, and BR-011 |
| Database engine | SQLite via Entity Framework Core | Keeps the application fully self-contained for local execution without requiring a database server or cloud infrastructure. Consistent with the MVP self-containment constraint in SI-001 §5 and NFR-COMPAT-001. Azure SQL and cloud hosting are out of scope |
| Backend framework | ASP.NET Core Minimal API | Provides a lightweight HTTP API surface that matches the small, focused endpoint set required for the MVP workflow without the overhead of full MVC or heavy framework scaffolding. Consistent with NFR-MAINT-001 (no unnecessary patterns) |
| Frontend framework | Next.js with React | Confirmed by the project sponsor as the appropriate web interface technology for the MVP |
| Architecture style | Reduced Onion Architecture (Domain, Application, Infrastructure, API, Web) | Provides clear separation of concerns and inward-pointing dependencies without introducing MediatR, CQRS, generic repositories, or messaging infrastructure. Satisfies NFR-MAINT-001 and enables reliable enforcement of the 11 business rules defined in RTM-001 |
| Manager account provisioning | Seed data or controlled registration setup | An account administration screen is out of scope (SI-001 §4). Seeding or manual setup is sufficient for the MVP review and validation window. Enforces NFR-SEC-003 by removing any public path to the Manager role |
| Absence type management | Seed data only (Vacation, Personal Leave, Sick Leave) | A catalog administration screen is deferred (SI-001 §4). Pre-seeded types cover all MVP scenarios. Consistent with FR-ATC-001 and FR-ATC-003 |
| Request state management | Explicit state machine in the Domain layer (RequestStateMachine) | Centralises all transition logic in one place, ensuring consistent enforcement across all entry points and satisfying FR-LSE-001 through FR-LSE-007 and NFR-REL-001. No state change is possible without passing through the Domain state machine |
| Transactional approval recording | Single EF Core transaction covering both the request state update and the Approval record creation | Prevents the inconsistent state scenario (Approved request with no corresponding Approval record) required by NFR-REL-002 and BR-009 |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Solution Architect | | | |
| Architecture Review Board | | | |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Yeuri Jessel Reyes (AI Assisted) | Initial generation — consolidated from SI-001, FRS-001, NFR-001, RTM-001, and UT-001; full content provided by Solution Architect |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Solution Architect (PM_OVERRIDE — bypassed Solution Architect) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 19:41:10 UTC |

*— End of document —*
