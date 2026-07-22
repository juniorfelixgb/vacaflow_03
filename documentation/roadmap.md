# Execution Alignment: Roadmap + Risk Log
## VacaFlow_03

**Project:** VacaFlow_03 — IGS Solutions
**Document ID:** EA-001
**Stage:** 05 — Planning
**Author:** Junior Gervacio (AI Assisted)
**Product Owner:** Junior Gervacio
**Related Documents:** SI-001, FRS-001, BLG-001, SAD (software-architecture-document)
**Start Date:** 2026-07-07 | **Go-Live Target:** 2026-07-16 (9 days / ~2 weeks)
**Team:** Yeuri Reyes (Functional Analyst) · Junior Gervacio (Operations Manager / Project Sponsor)
**Investment:** 2-person team; estimated effort: ~40 person-hours total across the delivery window. Infrastructure cost: $0 (local SQLite execution, no cloud services).
**Date:** 2026-07-20

---

## 1. High-Level Roadmap

**Roadmap Structure:** 4 sprints over 9 days. Sprints 1–3 deliver features incrementally across the core request lifecycle. Sprint 4 is Hardening + Go-Live with NO new features — stabilization, acceptance review, and final sign-off only.

> **Note on Dates:** The project timeline ran from 2026-07-07 to 2026-07-16. This document provides retrospective alignment and serves as the formal planning record for the execution that occurred.

---

### Pre-Sprint — Setup (2026-07-07)

**Objective:** Local environment confirmed working, scope agreed, team onboarded before Sprint 1 begins.

**Activities:**
- Kickoff meeting with Junior Gervacio (Sponsor/PO) and Yeuri Reyes (Functional Analyst)
- Local development environment confirmed: .NET 8 SDK, Node.js 20.x, SQLite provisioning via EF Core `EnsureCreated`
- Repository structure established: `VacaFlow.Domain`, `VacaFlow.Application`, `VacaFlow.Infrastructure`, `VacaFlow.Api`, `vacaflow-web`
- Architectural approach confirmed: Alternative C (Cookie-Based Auth + `ICurrentUserContext` + `ITransactionService`)
- Won't v1 list reviewed and agreed by both team members

**Milestone:** **M1: Kickoff complete & environment ready (2026-07-07)**
**Success Criteria:** Junior Gervacio confirms scope, Won't v1 list agreed, Yeuri Reyes has a working local environment with `dotnet run` and `npm run dev` both succeeding, SQLite database auto-provisioned with seed data (Vacation, Personal Leave, Sick Leave absence types).

---

### Sprint 1 — Authentication Foundation (2026-07-07 – 2026-07-09)

**Objective:** A user can register an Employee account, log in, and log out — all actions attributed to an authenticated server-side session, with no plain-text passwords stored.

**Stories:** US-001 User Registration · US-002 User Login · US-003 User Logout

**Milestone:** **M2: Authentication working in local environment (2026-07-09)**
**Success Criteria:** All three acceptance criteria sets pass for US-001, US-002, US-003 in the local environment. BCrypt hashes confirmed in `vacaflow.db`. Manager self-registration blocked (AC-003 on US-001). Session cookie is `HttpOnly`; identity derived from cookie on all subsequent calls. Verified by Yeuri Reyes and accepted by Junior Gervacio.

---

### Sprint 2 — Employee Request Lifecycle (2026-07-10 – 2026-07-12)

**Objective:** An authenticated Employee can create, edit, submit, and cancel absence requests — all ownership and date rules enforced by the API with no trusted frontend identifiers.

**Stories:** US-004 Create Draft Request · US-005 Edit Draft Request · US-006 Submit Request · US-007 Cancel Request

**Milestone:** **M3: Full employee-side request lifecycle working (2026-07-12)**
**Success Criteria:** All acceptance criteria for US-004 through US-007 pass. Date validation (BR-001, BR-002), state transitions, and ownership enforcement (BR-004) all verified with both valid and invalid inputs. API rejects any payload carrying an explicit employee ID for ownership (AC-004 on US-004). Verified by Yeuri Reyes, accepted by Junior Gervacio.

---

### Sprint 3 — Manager Approval Workflow (2026-07-13 – 2026-07-15)

**Objective:** An authenticated Manager can view submitted requests, approve or reject them with an optional comment — with approver identity derived from the session and the self-approval guard enforced.

**Stories:** US-008 Manager Views Submitted Requests · US-009 Approve Request · US-010 Reject Request

**Milestone:** **M4: Manager approval workflow complete (2026-07-15)**
**Success Criteria:** All acceptance criteria for US-008, US-009, US-010 pass. Every Approval record contains the authenticated Manager's identity from the session — no frontend-supplied approver ID accepted (AC-003 on US-009 and US-010). Self-approval blocked (AC-004 on US-009 and US-010). Exactly one Approval record per request (AC-006 on US-009). Verified by Yeuri Reyes, accepted by Junior Gervacio.

---

### Sprint 4 — Hardening + Go-Live (2026-07-16)

**Objective:** Staging → UAT walkthrough → final acceptance sign-off → MVP delivered.

**Activities:** **NO new features.** End-to-end walkthrough of all 14 acceptance criteria with at least one Manager and one Employee account. Bug triage and resolution. Verification of all negative-path scenarios (unauthorized operations, state transition errors, spoofing attempts). Should Have stories (US-011 Employee Views Request List, US-012 List Absence Types, US-013 Get Current User Profile) reviewed for inclusion if capacity allows — otherwise formally deferred to a post-MVP iteration. Final acceptance by Junior Gervacio.

**Milestone:** **M5: Go-Live — MVP accepted (2026-07-16)**
**Success Criteria:** All 14 acceptance criteria demonstrable end-to-end with registered accounts in the local environment. 100% of defined business rules enforced by the API (date validation, state transitions, role authorization, manager self-approval prevention). Every Approval record contains the authenticated manager's identity with zero frontend-supplied approver IDs accepted. All forbidden operations return clear error responses. UAT sign-off granted by Junior Gervacio.

**Milestone:** **M6: Project close (2026-07-20)**
**Success Criteria:** Closure documentation complete (closure report, lessons learned, knowledge transfer checklist). Retrospective held with Yeuri Reyes and Junior Gervacio. No open blocking defects. Project formally closed.

---

## 2. Key Milestones & Dates

| Milestone | Target Date | Success Criteria |
|-----------|-------------|-----------------|
| M1: Kickoff & setup complete | 2026-07-07 | Junior Gervacio green-lights Sprint 1; dev environment running locally; Won't v1 agreed by both team members |
| M2: Authentication working | 2026-07-09 | US-001, US-002, US-003 acceptance criteria all pass; BCrypt hashes in DB; session cookie HttpOnly; Manager self-registration blocked |
| M3: Employee request lifecycle complete | 2026-07-12 | US-004 through US-007 all pass; date rules, state transitions, ownership enforced; no frontend-trusted identity accepted |
| M4: Manager approval workflow complete | 2026-07-15 | US-008, US-009, US-010 all pass; Approval records carry session-derived identity; self-approval blocked; one record per request |
| M5: Go-Live — MVP accepted | 2026-07-16 | 14 acceptance criteria demonstrable; all business rules enforced; UAT sign-off from Junior Gervacio; zero critical defects |
| M6: Project close | 2026-07-20 | Closure docs complete; retrospective held; no open blockers; project formally closed |

---

## 3. Team Roles & Communication

### Roles

| Person | Role | Unique Responsibility |
|--------|------|----------------------|
| Junior Gervacio | Operations Manager / Project Sponsor / Product Owner | Final functional sign-off and MVP acceptance. Only person who can approve a story as "Done" and authorize scope changes. Decides whether any Won't v1 item is elevated to an active sprint. Signs the project close milestone. |
| Yeuri Reyes | Functional Analyst | Defines and documents MVP scope, API boundaries, and UI boundaries. Produces all project documentation including executive summary, meeting transcripts, and SDLC artifacts. Single point of contact for technical and functional questions during delivery. Responsible for all acceptance criteria verification before presenting to Junior Gervacio. |

### Communication Channels

| Channel | Purpose | Frequency / Cadence |
|---------|---------|---------------------|
| Microsoft Teams | Project meetings, scope discussions, stakeholder alignment, and escalation of blockers | As needed — meetings held 2026-07-07, 2026-07-10, 2026-07-14, 2026-07-16 |
| Sprint Review (Microsoft Teams) | Demo of completed stories to Junior Gervacio against acceptance criteria | End of each sprint (approximately every 2–3 days given the compressed timeline) |
| Change Log (documented in project SDLC artifacts) | Any scope change, decision, or deferral formally recorded — Owner: Yeuri Reyes | Continuous; updated by Yeuri Reyes on any scope discussion |

---

## 4. Risk Log

**Context:** Nine days of delivery over a compressed MVP timeline with a 2-person team identified seven active risks. These six are ordered by combined impact and prioritized for active management throughout the delivery window.

| ID | Risk | Prob. | Impact | Mitigation | Owner |
|----|------|-------|--------|------------|-------|
| R-01 | Scope creep — adding optional or 'easy' features beyond the confirmed MVP boundary (19 Won't v1 items explicitly deferred) | High | High | All scope requests are logged immediately in the Change Log by Yeuri Reyes. No item enters a sprint without written approval from Junior Gervacio. If a Won't v1 item is proposed mid-sprint, Yeuri Reyes assesses impact on the go-live date before any discussion with the sponsor. | Junior Gervacio |
| R-02 | Frontend spoofing of user or approver identity — frontend sending trusted employee or manager IDs in request body fields for business decisions | Medium | High | The API derives all business-critical identity values exclusively from the validated `HttpOnly` session cookie via `ICurrentUserContext`. Any payload field carrying an employee ID or approver ID for a business decision is ignored by the API. Verified by specific acceptance criteria (US-004 AC-004, US-009 AC-003, US-010 AC-003) before sprint completion. | Yeuri Reyes |
| R-03 | Overly complex architecture — introducing unnecessary patterns such as MediatR, CQRS, generic repositories, or messaging that exceed the Reduced Onion mandate | Medium | Medium | Architecture is strictly constrained to five named Onion layers (Domain, Application, Infrastructure, Api, Web). `VacaFlow.Application.csproj` carries zero `PackageReference` to `Microsoft.AspNetCore.*` or `Microsoft.EntityFrameworkCore.*`. Any proposed addition is evaluated against NFR-MAINT-001 before implementation. | Yeuri Reyes |
| R-04 | Compressed timeline — 9-day delivery window with 2 people leaves no buffer for rework on Must Have stories | High | Medium | Sprint 4 (Hardening) is reserved exclusively for stabilization — no new stories. If any Must Have story is incomplete entering Sprint 4, Should Have stories (US-011, US-012, US-013) are formally deferred and Sprint 4 capacity is redirected to Must Have completion. Junior Gervacio is notified immediately if a Must Have is at risk. | Junior Gervacio |
| R-05 | Security regression — plain-text password stored in database, logs, or source code | Low | High | BCrypt hashing enforced at the domain entity level (`Employee` factory method using `BCrypt.Net-Next`). Database inspection of `vacaflow.db` is an explicit verification step in Sprint 1 acceptance (US-001 AC-001). No credential appears in application logs — verified by Yeuri Reyes before Sprint 1 close. | Yeuri Reyes |
| R-06 | Manager self-approval gap — a user with both Employee and Manager role context bypasses the self-approval guard | Low | High | `SelfApprovalGuard` is implemented at the Domain layer and throws `DomainException` before any persistence when `ApproverId == RequestorId`. This guard operates independently of the API authorization layer, providing defense in depth. Specific acceptance criteria (US-009 AC-004, US-010 AC-004) verify this guard with test scenarios before Sprint 3 is marked complete. | Yeuri Reyes |

**Legend:**
- **Probability:** Low <30% · Medium 30–60% · High >60%
- **Impact:** High = threatens timeline or scope · Medium = affects 1 sprint · Low = manageable within sprint

---

## 5. Kickoff Agenda

**Duration:** 60 minutes
**Attendees:** Junior Gervacio (Operations Manager / Project Sponsor / Product Owner), Yeuri Reyes (Functional Analyst)
**Location/Format:** Virtual — Microsoft Teams
**Planned Date:** 2026-07-07

| Time | Topic | Responsible | Expected Outcome |
|------|-------|-------------|-----------------|
| 10 min | Why VacaFlow_03? — The business problem: absence requests managed informally via email and chat; no audit trail, no role enforcement, no recorded approver identity | Junior Gervacio | Junior Gervacio confirms the MVP priority and value. Yeuri Reyes understands the "why" behind each security and business rule. |
| 15 min | **Scope: What's IN and what's OUT — Won't v1 walkthrough (19 deferred items)** | Yeuri Reyes | **Won't v1 explicitly agreed by Junior Gervacio.** All 19 deferred items (Entra ID, Azure deployment, Docker, notifications, password reset, balance calculations, reporting, integrations, MFA, etc.) are formally out of scope for this delivery. No ambiguity about MVP boundaries. |
| 10 min | Roadmap: 4 sprints over 9 days, milestones, go-live on 2026-07-16 | Yeuri Reyes | Team accepts the compressed timeline. Any concerns about sprint sequencing or capacity raised and resolved immediately. |
| 10 min | Roles, communication via Teams, scope change process (Change Log owned by Yeuri Reyes, all changes need Junior Gervacio approval) | Yeuri Reyes | Both team members confirm who decides what. Junior Gervacio is the sole acceptance authority. Yeuri Reyes is the single point of contact for all functional and technical questions. |
| 10 min | Top 6 risks and mitigation actions — scope creep, identity spoofing, architecture complexity, timeline, security, self-approval guard | Yeuri Reyes | Risk owners confirmed. Concrete mitigation steps agreed. Yeuri Reyes and Junior Gervacio each confirm their respective risks. |
| 5 min | Q&A and next steps — confirm Sprint 1 start, environment setup, first Teams meeting | Junior Gervacio | All blockers to Sprint 1 identified and assigned. No open ambiguities. |

**Kickoff Success Criteria:**
Junior Gervacio gives explicit approval to proceed to Sprint 1, and Yeuri Reyes can begin Sprint 1 with a confirmed Won't v1 agreement, a clear scope boundary for the four business entities (Employee, Absence Type, Request, Approval), and no open questions blocking technical implementation.

---

## 6. Dependencies & Constraints

### External Dependencies

| Dependency | Impact | Owner | Resolution Target |
|------------|--------|-------|-----------------|
| .NET 8 SDK available on local machine | Blocks API startup and all backend development | Yeuri Reyes | Pre-Sprint (2026-07-07) |
| Node.js 20.x available on local machine | Blocks Next.js frontend startup | Yeuri Reyes | Pre-Sprint (2026-07-07) |
| Junior Gervacio available for sprint reviews and acceptance sign-off | Blocks milestone completion and sprint advancement | Junior Gervacio | Confirmed for 2026-07-07, 2026-07-10, 2026-07-14, 2026-07-16 |

### Hard Constraints

- **Execution constraint:** The application must run locally from source code only — no Azure deployment, Docker containers, or CI/CD pipelines.
- **Database constraint:** SQLite is the only database for the MVP. No cloud database, no external database server, no automated backup (manual file copy is the only backup method).
- **Security constraint (passwords):** Passwords must never be stored in plain text. BCrypt hashing is mandatory at the domain layer using `BCrypt.Net-Next`.
- **Security constraint (identity):** The API must derive the current user and responsible approver exclusively from the authenticated session cookie or token. The frontend must not send trusted employee or approver identifiers for any business decision.
- **Role constraint:** Public self-registration must not allow any user to assign themselves the Manager role. Manager accounts are created via seed data only.
- **Identity provider constraint:** Microsoft Entra ID and all external or corporate identity providers are entirely out of scope for this MVP.
- **Scope constraint:** The MVP is strictly limited to four business entities (Employee, Absence Type, Request, Approval) and the defined request lifecycle (Draft → Submitted → Approved / Rejected / Cancelled). No HR administration screens, notifications, balance calculations, or external integrations are permitted.

---

## 7. Success Metrics (Post-Launch)

**How we will know this project succeeded:**

| Metric | Baseline (Current) | Target (Post-Launch) | Measurement |
|--------|--------------------|----------------------|-------------|
| Full request lifecycle completable end-to-end | No automated system — requests managed via email and chat with no structured record | All 14 acceptance criteria demonstrable with registered accounts in the local environment | Manual walkthrough of the full acceptance checklist by Junior Gervacio with at least one Manager account and one Employee account |
| Business rules enforced by the API | No enforcement — approvals informal, unrecorded, and unenforced | 100% of defined business rules enforced: date validation (BR-001, BR-002), state transitions (BR-003, BR-005, BR-010), ownership (BR-004), role authorization (BR-006, BR-007), manager self-approval prevention (BR-008), approver recording (BR-009) | Manual and unit-test verification of each rule during MVP acceptance review by Yeuri Reyes; results presented to Junior Gervacio |
| Authenticated manager identity recorded on every approval decision | Manager identity unrecorded — current informal process carries no audit trail of who approved or rejected a request | Every Approval record in `vacaflow.db` contains the authenticated manager's identity (derived from session) with zero frontend-supplied approver IDs accepted across all test scenarios | Database inspection of `vacaflow.db` Approval records after executing all approval and rejection test scenarios |
| Unauthorized operations blocked with clear error responses | No access control — no system enforcement of role boundaries or request ownership | All forbidden operations return clear HTTP error responses: non-Manager approving (403), owner editing a Submitted request (error), spoofing another employee's request (403), self-approval (domain error) | Negative-path test scenarios executed during acceptance review; all forbidden paths return structured error responses with no stack trace or internal detail leakage |

**Review Schedule:** Immediate post-launch review on 2026-07-16 (acceptance walkthrough with Junior Gervacio). Formal retrospective and project close on 2026-07-20.

---

## Related Documents

- Strategic Intake: `documentation/01-understand/strategic-intake.md` (SI-001)
- Functional Requirements Specification: `documentation/02-define/functional-spec.md` (FRS-001)
- Prioritized Backlog: `documentation/05-planning/backlog.md` (BLG-001)
- Software Architecture Document: `documentation/04-architecture/software-architecture-document.md`

---

## Next Steps

- [x] Kickoff meeting held — 2026-07-07 (Microsoft Teams)
- [x] Sprint 1 (Authentication) — 2026-07-07 to 2026-07-09
- [x] Sprint 2 (Employee Request Lifecycle) — 2026-07-10 to 2026-07-12
- [x] Sprint 3 (Manager Approval Workflow) — 2026-07-13 to 2026-07-15
- [x] Sprint 4 (Hardening + Go-Live) — 2026-07-16
- [ ] Proceed to Work Breakdown Structure (`/planning/wbs`) — Target: 2026-07-20
- [ ] Generate Closure Report (`/closure/closure-report`) — Target: 2026-07-20
- [ ] Conduct retrospective and formally close the project — Owner: Junior Gervacio — Target: 2026-07-20

---

**Stage:** 05 — Planning
**Version:** 1.0

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Junior Gervacio (AI Assisted) |
| Approval Authority | Product Owner |
| Status | Approved |
| Signature | ✅ SIGNED by Junior Gervacio (junior.gervacio@arroyoconsulting.net) on 2026-07-20 21:39:12 UTC |

*— End of document —*
