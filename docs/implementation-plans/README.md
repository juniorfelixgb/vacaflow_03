# VacaFlow MVP — Implementation Plans

This directory contains detailed implementation plans (IP) for all 13 User Stories (US) that make up the VacaFlow MVP.

---

## Quick Start

**Start here:** [INDEX.md](INDEX.md) — Master roadmap linking all user stories, phasing, dependencies, and effort estimates.

---

## What's in This Directory

### Master Index

- **[INDEX.md](INDEX.md)** — Complete implementation roadmap
  - Phasing strategy (Week 1–3)
  - Dependency graph
  - Execution roadmap
  - Testing strategy
  - Success criteria

### Individual User Story Implementation Plans

Each plan is self-contained and includes:
- Metadata (effort, author, status, impacted stacks)
- Executive summary (change, motivation, impact)
- Scope (in/out of scope)
- Architecture impact
- API contract changes
- Pre-flight checklist
- Implementation phases (typically 4–6 detailed phases)
- Acceptance criteria verification
- Testing strategy

#### Foundation & Auth (Week 1)

- [US-001: User Registration](IP-2026-07-22-us-001-user-registration.md) — **53h**  
  Scaffolds entire 5-project solution, EF Core + SQLite, cookie-auth host, registration endpoint.

- [US-002: User Login](IP-2026-07-22-us-002-user-login.md) — **38h**  
  Implements POST /api/auth/login, cookie-based session, ICurrentUserContext interface.

- [US-003: User Logout](IP-2026-07-22-us-003-user-logout.md) — **18h**  
  Clears session cookie, redirects to login.

- [US-012: List Absence Types](IP-2026-07-22-us-012-list-absence-types.md) — **12h**  
  GET /api/absence-types endpoint for UI dropdowns.

- [US-013: Get Current User Profile](IP-2026-07-22-us-013-get-current-user-profile.md) — **16h**  
  GET /api/me endpoint; returns authenticated user info.

#### Request Lifecycle (Week 2)

- **US-004: Create Request** — **42h** (Implementation Plan to be written; see backlog.md for AC)  
  POST /api/requests; creates a new Draft request with absence type, dates, reason.

- [US-005: Edit Draft Request](IP-2026-07-22-us-005-edit-draft-request.md) — **35h**  
  PUT /api/requests/{id}; modifies Draft request (state guard: only Draft is editable).

- [US-006: Submit Request](IP-2026-07-22-us-006-submit-request.md) — **38h**  
  PATCH /api/requests/{id}/submit; transitions Draft → Submitted.

- [US-007: Cancel Request](IP-2026-07-22-us-007-cancel-request.md) — **24h**  
  PATCH /api/requests/{id}/cancel; terminal cancellation.

- [US-011: Employee Views Request List](IP-2026-07-22-us-011-employee-views-request-list.md) — **41h**  
  GET /api/requests (employee's own); renders list with status badges, action buttons.

#### Manager Approval Workflow (Week 3)

- [US-008: Manager Views Submitted Requests](IP-2026-07-22-us-008-manager-views-submitted-requests.md) — **33h**  
  GET /api/requests?status=Submitted (filtered by manager's direct reports); queue UI.

- [US-009: Approve Request](IP-2026-07-22-us-009-approve-request.md) — **42h**  
  PATCH /api/requests/{id}/approve; creates Approval record, atomic transaction, self-approval guard.

- [US-010: Reject Request](IP-2026-07-22-us-010-reject-request.md) — **24h**  
  PATCH /api/requests/{id}/reject; records rejection reason, terminal state.

---

## How to Use These Plans

### Before Starting Development

1. Read **[INDEX.md](INDEX.md)** for the big picture — phasing, dependencies, risks.
2. Review **[CLAUDE.md](../../CLAUDE.md)** in the repository root for codebase conventions and constraints.
3. Skim the **[software-architecture-document.md](../../documentation/software-architecture-document.md)** to understand the five-layer Onion Architecture.

### When Implementing a User Story

1. Open the corresponding **IP-YYYY-MM-DD-us-NNN-*.md** file.
2. Complete the **Pre-flight Checklist** (dependencies, prerequisites).
3. Follow the **Implementation Phases** in order, leaving the build green at each step.
4. After each phase, run:
   ```bash
   dotnet build          # Verify backend compiles
   npm run build         # Verify frontend builds (in vacaflow-web/)
   ```
5. Verify **Acceptance Criteria** (AC) at the end of the user story.
6. Update **[INDEX.md](INDEX.md)** status column (Status: "In Progress" → "Complete").

### Testing & Validation

- Each IP includes a **Testing Strategy** section.
- End-of-MVP smoke tests are listed in [INDEX.md](INDEX.md).
- See [deployment-runbook.md](../../documentation/deployment-runbook.md) for canary validation steps.

---

## Key Architectural Constraints

All implementation plans assume and enforce:

1. **Reduced Onion Architecture** — five strict layers with inward-only dependencies.
2. **No ASP.NET Core or Entity Framework imports in `VacaFlow.Application/`** — verify with `grep`.
3. **Cookie-based auth only** — no JWT tokens in browser storage.
4. **Business rules enforced server-side** — client never trusted for state transitions.
5. **No external services or Docker** — everything runs locally from source.

---

## Effort & Timeline

- **Total MVP:** 416 hours
- **1 Full-Stack Engineer:** ~10.4 weeks (40h/week)
- **Recommended:** Break across 2–3 engineers or extend to 3 weeks with daily standups.

---

## Common Questions

### Q: Can we implement US-006 before US-005?
**A:** No. US-005 (edit draft) depends on US-004 (create request), which isn't yet implemented. Strictly follow the dependency graph in [INDEX.md](INDEX.md).

### Q: What if we need to add a new feature mid-MVP?
**A:** Add it to the backlog (documentation/backlog.md) as a new US with its own IP. Do not insert it into the current phasing unless it's a blocker for an existing story.

### Q: How do we test without a frontend?
**A:** Each backend IP includes integration tests (via Postman/curl or `WebApplicationFactory`). Frontend UI tests are only needed once the corresponding feature endpoints are complete.

### Q: What if a phase takes longer than estimated?
**A:** Log hours daily, compare actual vs. estimate, and update [INDEX.md](INDEX.md) by end of day. Escalate blockers immediately to the tech lead.

---

## Support & References

- **Technical Questions:** See [tech-doc.md](../../documentation/tech-doc.md)
- **Business Rules:** See [business-rules.md](../../documentation/business-rules.md)
- **Code Standards:** See [code-standards.md](../../documentation/code-standards.md)
- **UI Reference:** See [guidelines/README.md](../../guidelines/README.md)
- **Architecture Decisions:** See [software-architecture-document.md](../../documentation/software-architecture-document.md)

---

## Status Dashboard

| Phase | Status | Notes |
|-------|--------|-------|
| **Phase 1 (Week 1)** | Not Started | Auth foundation (US-001 … US-003, US-012, US-013) |
| **Phase 2 (Week 2)** | Not Started | Request lifecycle (US-004 … US-007, US-011) |
| **Phase 3 (Week 3)** | Not Started | Manager approval (US-008 … US-010) |

---

**Last Updated:** 2026-07-22  
**Author:** Yeuri Jessel Reyes (AI Assisted)

