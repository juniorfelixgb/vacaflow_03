# VacaFlow MVP — Implementation Plan Index

**Date:** 2026-07-22  
**Project:** VacaFlow_03 (Absence Request Management MVP)  
**Client:** IGS Solutions  
**Version:** 1.0  
**Status:** Draft — Ready for Phase 1 Execution

---

## Executive Overview

VacaFlow_03 is a locally-run absence request management system that connects Employees (who submit vacation/leave requests) to Managers (who approve or reject them). This index organizes the complete implementation across **13 linked User Stories (US-001 … US-013)**, each with its own detailed Implementation Plan (IP).

### Phasing Strategy

The implementation follows a **strictly sequential, dependency-aware phasing** where:

1. **US-001 (User Registration)** is a greenfield bootstrap that creates the entire 5-project solution, database schema, and API/frontend scaffolding.
2. **US-002 through US-013** extend this foundation incrementally, adding authentication, request lifecycle, and manager approval workflows.
3. Each US leaves both `dotnet build` and `npm run build` green.
4. No feature is built in parallel; each US completes before the next begins.

### Key Constraints

- **No Docker, no external services** — everything runs locally from source.
- **Reduced Onion Architecture** — strict inward-only dependencies across five layers (Domain → Application → Infrastructure → API → Web).
- **Cookie-based auth only** — no JWT tokens in browser storage.
- **Business rules enforced server-side** — the client is never trusted for state transitions.
- **No MediatR, CQRS, or generic repository patterns** — keep the codebase simple.

---

## User Story Inventory

### Phase 1: Foundation (Week 1)

| US ID | Title | Effort | Status | IP Reference |
|-------|-------|--------|--------|--------------|
| **US-001** | User Registration | 53h | Not Started | [IP-2026-07-22-us-001-user-registration.md](IP-2026-07-22-us-001-user-registration.md) |
| **US-002** | User Login | 38h | Not Started | [IP-2026-07-22-us-002-user-login.md](IP-2026-07-22-us-002-user-login.md) |
| **US-003** | User Logout | 18h | Not Started | [IP-2026-07-22-us-003-user-logout.md](IP-2026-07-22-us-003-user-logout.md) |
| **US-012** | List Absence Types | 12h | Not Started | [IP-2026-07-22-us-012-list-absence-types.md](IP-2026-07-22-us-012-list-absence-types.md) |
| **US-013** | Get Current User Profile | 16h | Not Started | [IP-2026-07-22-us-013-get-current-user-profile.md](IP-2026-07-22-us-013-get-current-user-profile.md) |

**Phase 1 Total:** 137 hours (Auth foundation + user profile APIs)

### Phase 2: Request Creation & Management (Week 2)

| US ID | Title | Effort | Status | IP Reference |
|-------|-------|--------|--------|--------------|
| **US-004** | Create Draft Request | 42h | Not Started | (See backlog — implies US-004 not yet documented; derive from backlog.md) |
| **US-005** | Edit Draft Request | 35h | Not Started | [IP-2026-07-22-us-005-edit-draft-request.md](IP-2026-07-22-us-005-edit-draft-request.md) |
| **US-006** | Submit Request | 38h | Not Started | [IP-2026-07-22-us-006-submit-request.md](IP-2026-07-22-us-006-submit-request.md) |
| **US-007** | Cancel Request | 24h | Not Started | [IP-2026-07-22-us-007-cancel-request.md](IP-2026-07-22-us-007-cancel-request.md) |
| **US-011** | Employee Views Request List | 41h | Not Started | [IP-2026-07-22-us-011-employee-views-request-list.md](IP-2026-07-22-us-011-employee-views-request-list.md) |

**Phase 2 Total:** 180 hours (Employee request lifecycle: create, edit, submit, cancel, list)

### Phase 3: Manager Approval Workflow (Week 3)

| US ID | Title | Effort | Status | IP Reference |
|-------|-------|--------|--------|--------------|
| **US-008** | Manager Views Submitted Requests | 33h | Not Started | [IP-2026-07-22-us-008-manager-views-submitted-requests.md](IP-2026-07-22-us-008-manager-views-submitted-requests.md) |
| **US-009** | Approve Request | 42h | Not Started | [IP-2026-07-22-us-009-approve-request.md](IP-2026-07-22-us-009-approve-request.md) |
| **US-010** | Reject Request | 24h | Not Started | [IP-2026-07-22-us-010-reject-request.md](IP-2026-07-22-us-010-reject-request.md) |

**Phase 3 Total:** 99 hours (Manager review queue and approval/rejection)

### **Grand Total: 416 hours (~10.4 weeks at 40h/week for a single full-stack engineer)**

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│ US-001: User Registration (Foundation — 53h)                    │
│ • Scaffolds entire 5-project solution                           │
│ • EF Core + SQLite schema (Employees, AbsenceTypes)            │
│ • Cookie-auth host + ExceptionHandlingMiddleware              │
│ • Next.js app + api.ts client                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                 ▼
   ┌─────────┐    ┌──────────┐    ┌──────────────┐
   │ US-002: │    │ US-012:  │    │ US-013:      │
   │ Login   │    │ List     │    │ Current User │
   │ (38h)   │    │ Absence  │    │ Profile      │
   │         │    │ Types    │    │ (16h)        │
   │ Adds:   │    │ (12h)    │    │              │
   │ • Cookie│    │          │    │ Adds:        │
   │   auth  │    │ Adds:    │    │ • /me        │
   │ • /me   │    │ • GET    │    │   endpoint   │
   │ • Login │    │   /api/  │    │              │
   │ • IAuth │    │   absence│    │              │
   │   logic │    │   -types │    │              │
   └────┬────┘    └──────────┘    └──────────────┘
        │
        ▼
   ┌──────────┐
   │ US-003:  │
   │ Logout   │
   │ (18h)    │
   │          │
   │ Adds:    │
   │ • /logout│
   │ • Cookie │
   │   clear  │
   └────┬─────┘
        │
        ├────────────────────────────────┐
        │                                │
        ▼                                ▼
   ┌─────────────┐            ┌──────────────────┐
   │ US-004:     │            │ US-012+013 are   │
   │ Create      │            │ already deps for │
   │ Request     │            │ Employee & Mgr   │
   │ (42h)       │            │ UI data binding  │
   │             │            └──────────────────┘
   │ (Implied)   │
   │ Adds:       │
   │ • Request   │
   │   entity    │
   │ • IRequest  │
   │   Repo      │
   │ • /api/req  │
   │   POST      │
   └────┬────────┘
        │
        ├─────────────────────────────────────┐
        │                                     │
        ▼                                     ▼
   ┌──────────────┐              ┌────────────────────┐
   │ US-005:      │              │ US-011:            │
   │ Edit Draft   │              │ Employee List      │
   │ (35h)        │              │ Requests (41h)     │
   │              │              │                    │
   │ Adds:        │              │ Adds:              │
   │ • PUT /api/  │              │ • GET /api/req     │
   │   req/[id]   │              │ • List page UI     │
   │ • State      │              │                    │
   │   guard      │              │ Requires: US-004,  │
   │   (Draft)    │              │ US-005, US-006,    │
   │              │              │ US-007             │
   └──────────────┘              └────────────────────┘
        │
        ▼
   ┌──────────────┐
   │ US-006:      │
   │ Submit       │
   │ Request      │
   │ (38h)        │
   │              │
   │ Adds:        │
   │ • PATCH /api/│
   │   req/[id]/  │
   │   submit     │
   │ • State      │
   │   machine    │
   │   (Draft→    │
   │   Submitted) │
   └──────┬───────┘
          │
          ▼
     ┌──────────────┐
     │ US-007:      │
     │ Cancel       │
     │ (24h)        │
     │              │
     │ Adds:        │
     │ • PATCH /api/│
     │   req/[id]/  │
     │   cancel     │
     │ • Cancellation
     │   terminal   │
     │   state      │
     └──────┬───────┘
            │
            ├──────────────────────────────────┐
            │                                  │
            ▼                                  ▼
       ┌──────────────┐            ┌──────────────────┐
       │ US-008:      │            │ US-011 now has   │
       │ Manager      │            │ Draft/Submitted/ │
       │ Views Queue  │            │ Approved/        │
       │ (33h)        │            │ Rejected cards   │
       │              │            │                  │
       │ Adds:        │            └──────────────────┘
       │ • GET /api/  │
       │   req?       │
       │   status=    │
       │   Submitted  │
       │ • Manager    │
       │   queue UI   │
       │              │
       │ Requires:    │
       │ Manager      │
       │ scoping guard│
       │ (BR-APPR-003)
       └────┬─────────┘
            │
            ├──────────────────────┐
            │                      │
            ▼                      ▼
       ┌──────────────┐    ┌──────────────┐
       │ US-009:      │    │ US-010:      │
       │ Approve      │    │ Reject       │
       │ (42h)        │    │ (24h)        │
       │              │    │              │
       │ Adds:        │    │ Adds:        │
       │ • PATCH /api/│    │ • PATCH /api/│
       │   req/[id]/  │    │   req/[id]/  │
       │   approve    │    │   reject     │
       │ • ITransaction   │ • ITransaction│
       │   Service    │    │   Service    │
       │ • Approval   │    │ • Rejection  │
       │   record     │    │   record     │
       │ • Self-      │    │ • Self-      │
       │   approval   │    │   approval   │
       │   guard      │    │   guard      │
       │ • Atomic     │    │ • Atomic     │
       │   tx        │    │   tx        │
       └──────────────┘    └──────────────┘
```

---

## Execution Roadmap

### Week 1: Foundation (US-001, US-002, US-003, US-012, US-013)

**Goal:** Stand up the entire solution, basic auth (register/login/logout), and profile/type lookups.

| Day | Task | Owner | Effort | Dependencies |
|-----|------|-------|--------|--------------|
| Mon–Wed | US-001: Scaffolding + Registration | BE | 53h | None (greenfield) |
| Thu–Fri (partial) | US-002: Login + ICurrentUserContext | BE | 38h | US-001 |
| Fri (partial) | US-012: List Absence Types | BE | 12h | US-001 |
| Fri–Mon | US-013: GET /me Profile | BE | 16h | US-002 |
| Mon–Tue | US-003: Logout | BE | 18h | US-002 |

**End of Week 1:** Login, registration, session management, profile/types complete.

### Week 2: Request Lifecycle (US-004, US-005, US-006, US-007, US-011)

**Goal:** Employees can create, edit, submit, and cancel their own absence requests.

| Day | Task | Owner | Effort | Dependencies |
|-----|------|-------|--------|--------------|
| Mon–Tue | US-004: Create Request (implied) | BE | 42h | US-001, US-013 |
| Tue–Wed | US-005: Edit Draft Request | BE | 35h | US-004 |
| Wed–Thu | US-006: Submit Request | BE | 38h | US-005 |
| Thu–Fri | US-007: Cancel Request | BE | 24h | US-006 |
| Throughout Week 2 | US-011: Employee Request List UI | FE | 41h | US-004/005/006/007 |

**End of Week 2:** Complete employee request lifecycle (draft → submitted → cancelled/approved/rejected).

### Week 3: Manager Approval Workflow (US-008, US-009, US-010)

**Goal:** Managers review submitted requests and approve or reject them.

| Day | Task | Owner | Effort | Dependencies |
|-----|------|-------|--------|--------------|
| Mon–Tue | US-008: Manager Views Queue | BE/FE | 33h | US-006 (submitted state exists) |
| Tue–Thu | US-009: Approve Request | BE | 42h | US-008, ITransactionService, Approval entity |
| Thu–Fri | US-010: Reject Request | BE | 24h | US-009 |

**End of Week 3 / MVP Complete:** Full absent request workflow (employee submit → manager approve/reject).

---

## Testing & Validation Strategy

### Phase 1 Testing (US-001 → US-003, US-012, US-013)

- **Unit tests:** Domain `Employee` factory, `UserRole` enum, password validation rules.
- **Integration tests:** `POST /api/auth/register`, login/logout flow, cookie management.
- **UI tests:** Registration form, login form, logout button.
- **Smoke test:** Register new employee, log in, navigate to profile, log out.

### Phase 2 Testing (US-004 → US-007, US-011)

- **Unit tests:** `RequestStateMachine` state transitions, date validation rules, `SelfApprovalGuard`.
- **Integration tests:** POST (create), PUT (edit), PATCH (submit/cancel) workflows.
- **UI tests:** Form validation (date range, empty fields), button state (edit/submit/cancel), list rendering.
- **Smoke test:** Create draft → edit → submit → view on list.

### Phase 3 Testing (US-008 → US-010)

- **Unit tests:** Manager-only queue filtering, atomic approval/rejection transaction.
- **Integration tests:** Manager views queue, approves/rejects a request, employee sees decision on their list.
- **UI tests:** Queue card rendering, approve/reject buttons, optional comment field.
- **Full end-to-end test:** Employee submits request → Manager receives notification (via queue load) → Manager approves with comment → Employee sees "Approved by Manager: comment" on their card.

### Smoke Test Checklist (End of MVP)

- [ ] **Register:** Employee can self-register (role auto-assigned as Employee).
- [ ] **Login:** Registered employee can log in with email/password.
- [ ] **Profile:** `/me` returns authenticated user name, email, role.
- [ ] **Create Request:** Employee clicks "+ Nueva Solicitud", fills form, saves as Draft.
- [ ] **Edit Draft:** Employee edits the draft request (changes dates/reason), saves.
- [ ] **Submit:** Employee submits draft → transitions to "Enviada" status.
- [ ] **View List:** Employee sees all requests on "Mis Solicitudes" with correct status badges.
- [ ] **Manager Queue:** Manager logs in, sees "Cola de Revisión" with submitted requests (excluding own).
- [ ] **Approve:** Manager enters optional comment, clicks "Aprobar" → request transitions to "Aprobada".
- [ ] **Employee sees decision:** Employee refreshes list, sees approved request with manager name + comment.
- [ ] **Reject:** Manager rejects another request → Employee sees "Rechazada" badge.
- [ ] **Cancel:** Employee can cancel a Draft or Submitted request → status transitions to "Cancelada".
- [ ] **Logout:** Both roles can logout; session cookie is cleared.

---

## Resource Requirements

### Development Team

- **1 Backend Engineer** (C# / .NET 8 / Entity Framework): 416h total
- **1 Frontend Engineer** (TypeScript / Next.js / React): Embedded in BE tasks (forms, UI state)
- **1 QA / Tester** (Manual smoke tests + integration test oversight): 20h (parallel to dev)

### Infrastructure / Tools

- **.NET 8 SDK** (Windows / macOS / Linux)
- **Node.js 20.x LTS** + npm
- **SQLite 3** (bundled in Microsoft.Data.Sqlite)
- **dotnet-ef** CLI (Entity Framework migrations)
- **VS Code** or **Rider** (IDE)
- **Postman / curl / REST Client extension** (API testing)
- **Git + GitHub** (version control, PR reviews)

### Hardware Requirements

- **Minimum:** 4 GB RAM, 2 GB free disk space
- **Recommended:** 8 GB+ RAM, SSD (for fast rebuilds)

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Greenfield scaffolding errors (US-001) | Medium | High | Pre-validate project structure, run `dotnet build` immediately after each step |
| Application layer purity violation | Medium | High | Automated check: grep for `Microsoft.AspNetCore` in `VacaFlow.Application/` **using statements** |
| SQLite database lock during migrations | Low | Medium | Kill any stray `dotnet watch` processes; delete `.db` file and restart if migration fails |
| Frontend/backend CORS mismatch | Low | Medium | Always use `credentials: 'include'` in fetch; validate `Access-Control-Allow-Origin: http://localhost:3000` in responses |
| State machine infinite loop (e.g., Approved → Submitted) | Low | High | Unit test all state transitions; state machine must be immutable (no state setter) |
| Self-approval bypassed | Low | High | Unit test `SelfApprovalGuard` with both owned + non-owned requests; never trust client for approver identity |
| Password hashing misconfiguration | Low | High | Unit test BCrypt work factor (≥12), salt generation; never store plaintext passwords |

---

## Deliverables Checklist

### By End of MVP

- [x] **CLAUDE.md** — Ready (generated separately)
- [ ] **VacaFlow.sln** (5 projects, clean inward dependencies)
- [ ] **Domain layer** — Employee, AbsenceType, AbsenceRequest, RequestStateMachine, DomainException
- [ ] **Application layer** — AuthService, RequestService, ApprovalService, DTOs, interface declarations
- [ ] **Infrastructure layer** — EF Core DbContext, repositories, transaction service, seeders
- [ ] **API layer** — Program.cs, cookie-auth, middleware, endpoints (all 13 US), health check
- [ ] **Frontend** — Next.js app, 5 screens (login, register, employee list, request form, manager queue), API client
- [ ] **Database** — SQLite schema, migrations, seed data (demo employees + absence types)
- [ ] **Tests** — Unit tests (Domain + Application), integration tests (selected flows), no UI automation
- [ ] **Documentation** — README.md (setup instructions), inline code comments (domain rules + ADRs only)
- [ ] **Git** — Clean commit history (one commit per US, descriptive messages)

---

## Rollout Plan

### Deployment Method: Canary (Progressive Reviewer Validation)

Per [deployment-runbook.md](../../documentation/deployment-runbook.md):

1. **Stage 1 — Employee Workflow:** One reviewer validates employee role (register → create → submit → view list).
2. **Stage 2 — Manager Workflow:** One reviewer validates manager role (login → view queue → approve/reject).
3. **Stage 3 — Full Lifecycle:** Combined review (Draft → Submitted → Approved / Rejected / Cancelled).

All three stages must pass with zero critical defects before MVP is declared complete.

---

## Success Criteria

### Functional

- All 13 US implemented with acceptance criteria met per respective IPs.
- All smoke tests pass.
- State machine enforces correct lifecycle (Draft → Submitted → terminal states).
- Self-approval guard prevents manager from approving own request.
- Session identity is never spoofed (always read from cookie, never from request body).

### Non-Functional

- `dotnet build` and `npm run build` succeed with zero errors.
- No warnings in Application layer `using` directives (no ASP.NET Core, no EF Core imports).
- API response times < 100ms (local SQLite, no optimization needed).
- Database schema matches EF Core migrations (no manual SQL).

### Code Quality

- Naming conventions follow [code-standards.md](../../documentation/code-standards.md).
- No hardcoded credentials, magic strings, or TODO comments without tickets.
- Domain rules extracted into Domain layer, not scattered in API handlers.
- Comments only where WHY is non-obvious (domain invariants, ADRs, workarounds).

---

## Next Steps

1. **Approve this Implementation Plan Index** — Confirm phasing and effort estimates with stakeholders.
2. **Create feature branch:** `feature/yreyes/us001` (or similar).
3. **Start US-001:** Follow [IP-2026-07-22-us-001-user-registration.md](IP-2026-07-22-us-001-user-registration.md) Phase 1 (scaffolding).
4. **Daily standup:** Track progress against the Execution Roadmap; surface blockers immediately.
5. **Weekly review:** Validate smoke tests; adjust estimates if drift is detected.

---

## Approval Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | [PO Name] | [Date] | [ ] |
| Tech Lead | [Lead Name] | [Date] | [ ] |
| QA Lead | [QA Name] | [Date] | [ ] |

---

## Document History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-07-22 | Yeuri Jessel Reyes (AI Assisted) | Initial MVP implementation plan index |

---

## References

- **Architecture:** [software-architecture-document.md](../../documentation/software-architecture-document.md)
- **Business Rules:** [business-rules.md](../../documentation/business-rules.md)
- **Code Standards:** [code-standards.md](../../documentation/code-standards.md)
- **Technical Setup:** [tech-doc.md](../../documentation/tech-doc.md)
- **UI Design:** [guidelines/README.md](../../guidelines/README.md)
- **Deployment:** [deployment-runbook.md](../../documentation/deployment-runbook.md)
- **Backlog:** [backlog.md](../../documentation/backlog.md)

