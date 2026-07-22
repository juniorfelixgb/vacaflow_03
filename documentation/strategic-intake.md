# Strategic Intake Document

**Project:** VacaFlow_03
**Document ID:** SI-001
**Stage:** 01 — Understand
**Author:** Junior Gervacio (AI Assisted)
**BSA/PO:** Junior Gervacio
**Sponsor:** James Parker
**Organization:** IGS Solutions
**Date:** 2026-07-20
**Status:** Draft

---

## 1. Project Context

IGS Solutions currently manages all employee vacation and absence requests through informal channels: email threads, Microsoft Teams chat messages, and ad-hoc spreadsheets. There is no centralized system to record whether a request was submitted, who holds approval responsibility, or what the final decision was. As the organization has grown, the volume of informal requests has increased to the point where managers spend a disproportionate amount of time confirming request status across these disconnected channels rather than making decisions.

The informal process produces recurring, measurable problems. There is no single authoritative record for absence requests or their outcomes — requests exist only as chat messages or emails that can be missed, misread, or forgotten. Approval responsibility is ambiguous; any reply from a manager can be interpreted as an approval even when no formal decision was made. Employees cannot independently check the status of their request without contacting the manager directly, creating additional overhead on both sides.

**Why now?**
A specific incident occurred in which an employee treated an informal Microsoft Teams reply as a formal approval and proceeded on that basis, but no decision record existed anywhere. The absence was not logged, and the event exposed the organization's complete reliance on individual discipline and memory rather than a controlled process. This incident — not a general desire to modernize — establishes the need for a system that creates and records decisions in a single, structured location.

---

## 2. Value Proposition

> **For** IGS Solutions employees and managers, **who need** a reliable way to submit, track, and decide on absence requests without relying on memory, informal chat replies, or disconnected spreadsheets, **VacaFlow offers** a locally executable web application with a structured request lifecycle, explicit manager approval or rejection recorded against the authenticated decision-maker's identity, **unlike** the current combination of email, Microsoft Teams messages, and spreadsheets, which provides no authoritative record of decisions and no enforcement of approval responsibility.

### Value Comparison

| Dimension | VacaFlow MVP | Current Alternative |
|-----------|-------------|---------------------|
| **Decision record** | Every approval and rejection stored with the authenticated manager's identity and timestamp | No record exists; decision lives in a chat message or email thread that may be deleted or overlooked |
| **Request status visibility** | Employee views current lifecycle state (Draft, Submitted, Approved, Rejected, Cancelled) directly in the application | Employee must ask the manager directly and wait for a reply across email or chat |
| **Manager workload — status confirmation** | Manager sees only Submitted requests awaiting action; no need to search across channels | Manager searches email, Teams chat, and spreadsheets to find pending requests before deciding |
| **Business rule enforcement** | System enforces date validation (end date not before start date, start date not in the past), editability restrictions, and role-based authorization | Enforcement depends entirely on individual discipline; errors are caught informally or not at all |
| **Approval responsibility** | Responsible manager derived from authenticated session; cannot be spoofed by the frontend | Any informal reply can be interpreted as an approval; responsibility is never explicitly assigned |

---

## 3. Stakeholders

| Name / Role | Influence | What They Decide or Need to Answer |
|-------------|-----------|--------------------------------------|
| James Parker · Operations Manager & Project Sponsor | High | Final functional sign-off; approval of MVP scope boundaries; acceptance validation of the end-to-end workflow; authorization of any scope change during development; decision on post-MVP hardening investments |
| Junior Gervacio · Product Owner / BSA | High | MVP scope definition and prioritization; API and UI boundary documentation; acceptance criteria; executive summary and presentation preparation |
| Emily Harrison · Functional Analyst | Medium | **RISK:** Controls scope documentation and the executive presentation materials; if she is unavailable or unclear on MVP boundaries, scope creep or an incomplete handoff package are realistic outcomes. Must be involved early in scope-freeze discussions and before any change request is raised. |

---

## 4. Business Context & Scope

### Expected Value (Quantified)

**Measurable Benefits:**
- **Eliminate unrecorded decisions:** Current baseline — zero formal records of approval or rejection exist for any absence request. Target — 100% of manager decisions (approve or reject) recorded with the authenticated manager's identity by end of the MVP review window.
- **Eliminate ambiguous request status:** Current baseline — employees have no way to check request status without contacting the manager directly, creating additional back-and-forth across email and chat. Target — every employee can view the current lifecycle state and the responsible approver's identity directly in VacaFlow with no additional communication required.
- **Reduce manager status-confirmation overhead:** Current baseline — managers spend time searching email threads, chat history, and spreadsheets to locate pending requests before acting. Target — managers access a single filtered view of Submitted requests awaiting decision, eliminating cross-channel search.
- **Enforce business rules systematically:** Current baseline — date validation, editability, and role-based authorization depend on individual discipline with no system enforcement. Target — all defined business rules enforced by the application for every request, regardless of the requesting employee or reviewing manager.

**Qualitative Benefits:**
- A single incident of the type that triggered this project — an employee acting on an informal chat reply as though it were a formal approval — becomes impossible under VacaFlow, because decisions are only recorded by an authenticated Manager through the application workflow.
- The organization gains a documented baseline for a future production-grade absence management system, including defined business rules, a role model, and a tested lifecycle, without committing to a full HR platform.

### Scope Boundaries

**In Scope:**
- Next.js web application with a compact user experience covering registration, login, employee request management, and manager review screens
- Basic local registration and login using email and hashed password; public self-registration creates Employee accounts only
- Two application roles: Employee and Manager
- Four core business entities: Employee, Absence Type, Request, and Approval
- SQLite database for application data and local authentication tables
- ASP.NET Core Minimal API backend
- Reduced Onion Architecture: Domain, Application, Infrastructure, API, and Web layers — no MediatR, CQRS, generic repositories, or messaging frameworks
- Request lifecycle with five states: Draft, Submitted, Approved, Rejected, and Cancelled
- Explicit lifecycle actions: create, edit Draft, submit, cancel, approve, and reject
- Business rules: end date not before start date; start date not in the past; only Draft requests are editable; only Submitted requests can be approved or rejected; only the authenticated Manager may approve or reject; public registration cannot self-assign the Manager role
- Manager accounts created through seed data or a controlled setup process; not available via public registration
- Seeded absence types: Vacation, Personal Leave, and Sick Leave
- Authentication endpoints: Register, Login, Logout, Get current user
- Workflow endpoints: List absence types, List visible requests, Create Draft, Edit Draft, Submit, Cancel, Approve, Reject
- Web screens: Register, Login, Employee request list, Request form (create and edit), Manager review list with approve and reject actions
- Local execution from source code only
- API derives the current user and responsible approver from the authenticated session or token; the frontend does not send trusted identifiers for business decisions
- A short README with setup instructions, seeded account details, endpoint summary, scope limitations, and deferred backlog

**Out of Scope:**
- Microsoft Entra ID and any corporate single sign-on provider — deferred to post-MVP hardening; MVP authentication is local only
- Azure deployment and cloud hosting — MVP is local execution only; no cloud infrastructure in scope
- Docker and CI/CD pipelines — not required for local review and MVP validation
- Email and Microsoft Teams notifications — no outbound messaging in the MVP
- Password reset and email verification — manual database reset or seeded accounts used during the review window
- Account administration screens — Manager accounts are managed through seed data
- Vacation balance calculations — out of scope for the MVP lifecycle model
- Holiday calendars and working-day calculations — dates are calendar days only, no working-day logic
- Overlapping request validation — no conflict detection between concurrent requests
- File attachments and supporting documents — requests contain no binary content
- Reporting, dashboards, and data exports — no analytics or reporting layer
- HR administration screens — no HR platform functionality
- Multi-level approvals and approval delegation — single Manager decision per request
- Integration with payroll, HR, calendar, or directory systems — no external system connectivity
- Data migration from existing systems — no import of historical email or spreadsheet records
- Advanced audit trail beyond the core approval record — no extended event log
- Automated backups — SQLite file is local; manual copy instructions provided in README
- Formal accessibility certification — not in scope for MVP review
- Production support SLAs — only review-window defect support is included
- Privacy notice or consent flow — to be revisited if the system moves to production
- Multifactor authentication and external identity providers

**Deferred (Won't v1):**
- Microsoft Entra ID / corporate SSO — requires Azure integration and identity platform work beyond MVP scope
- Azure deployment — MVP validates the workflow locally first; cloud deployment is a post-MVP decision
- Vacation balance calculation and holiday calendar logic — adds complexity beyond the lifecycle validation goal
- Overlapping request validation — useful but not required to demonstrate the core workflow
- Email and Teams notifications — value is high but adds infrastructure dependencies outside the MVP boundary
- Reports, exports, and HR administration views — post-MVP when the system moves toward broader use
- Multi-level approvals and delegation — applicable to larger organizations; out of scope for the current use case
- Advanced audit logs, automated backups, and MFA — post-MVP hardening items authorized by James Parker after review

---

## 5. Constraints & Assumptions

### Constraints (Non-negotiable)

**Business Constraints:**
- The MVP must validate the complete request lifecycle with the smallest practical scope and must not evolve into a full HR platform during development
- Manager accounts must be controlled; public self-registration must not permit assignment of the Manager role under any path
- Acceptance requires the full workflow — registration, login, Draft creation, submission, manager approval or rejection with comment, and final result visibility — to be demonstrable end-to-end with all defined business rules enforced
- Bypassing the logged-in user identity or approving requests without a Manager role is not acceptable and will cause acceptance to fail
- Scope additions during development must be explicitly approved by James Parker; optional features must not be added because they appear low-effort

**Technical Constraints:**
- The application must run locally from source code; no Azure deployment, Docker, or cloud hosting in this version
- SQLite is the required database; Azure SQL, automated backup services, and cloud persistence are excluded
- Passwords must be stored as hashes; plain-text password storage is not permitted
- The API must derive the current employee and responsible approver from the authenticated session or token; the frontend must not send trusted employee or approver identifiers for business decisions
- The architecture must follow a reduced Onion Architecture (Domain, Application, Infrastructure, API, Web) without MediatR, CQRS, generic repositories, or messaging frameworks
- The web interface must include only the screens required to complete the workflow; no extra screens may be added for convenience
- The SQLite database file must not be publicly exposed and must not be committed to source control with real passwords

**Legal Constraints:**
- User emails, password hashes, names, request reasons, dates, and approval comments must be protected from unauthorized access or exposure
- No formal privacy notice or consent flow is required for the MVP, but the application is documented as storing basic employee identity and absence request data; formal privacy and data retention requirements must be revisited before any move to production
- No special data retention rule applies in the MVP; data persists in the SQLite file until manually deleted or reset; this limitation must be acknowledged in the README

### Assumptions (If these change, project changes)

| Assumption | Impact if Wrong | Validation Method | Owner | Status |
|------------|-----------------|-------------------|-------|--------|
| IGS Solutions does not have an active Microsoft Entra ID tenant that must be used for employee authentication in the MVP | If an Entra ID tenant is mandatory, the local registration approach is blocked and authentication scope expands significantly | Confirm with James Parker before development begins | James Parker | Not Validated |
| The review window will involve a small, controlled group of users (not a broad employee rollout) | If broad rollout is expected during review, the absence of notifications, balance calculations, and account administration becomes a material gap rather than an acceptable deferral | Confirm review audience and rollout expectations with James Parker | James Parker | Not Validated |
| SQLite performance is acceptable for the number of concurrent users during the review period | If concurrent load causes SQLite locking issues during review, the database layer must change, affecting the infrastructure constraint | Establish the expected concurrent user count before the review window | Emily Harrison | Not Validated |
| Emily Harrison has sufficient availability to complete scope documentation and the executive presentation before the acceptance review | If unavailable, the handoff package is incomplete and acceptance may be delayed | Confirm availability and delivery timeline with Emily Harrison | Emily Harrison | Not Validated |
| No regulatory or contractual requirement mandates a formal privacy notice before the MVP is used by any employee, even internally | If a legal obligation exists, a consent flow must be added to the MVP, expanding scope | Confirm with IGS Solutions legal or compliance contact before any employee accesses the running application | James Parker | Not Validated |

---

## 6. Critical Information Gaps

| Gap | Impact if Not Resolved | Owner | Deadline |
|-----|------------------------|-------|----------|
| Entra ID obligation for the MVP | If mandatory, the local authentication approach is invalid and the technical architecture must change before a line of code is written | James Parker | Before development kickoff |
| Expected concurrent user count during the review window | Determines whether SQLite is an acceptable choice or whether a database change is required before review | James Parker | Before development kickoff |
| Availability of Emily Harrison for scope documentation and presentation | If unavailable, the acceptance review may be delayed due to an incomplete handoff package | Emily Harrison | Before Sprint 1 |
| Legal or compliance confirmation that no privacy notice is required for internal MVP use | If a notice is required, a consent flow must be scoped into the MVP, affecting timeline and scope | James Parker | Before any employee accesses the application |

---

## 7. Decision Framework

### Evaluation

| Criterion | Assessment | Justification |
|-----------|------------|---------------|
| **Strategic fit** | High | The project directly addresses a documented incident and a growing operational problem at IGS Solutions. The scope is tightly bounded to the lifecycle validation goal without expanding into a full HR platform. |
| **Technical feasibility** | High, with scope discipline required | The technology stack (Next.js, ASP.NET Core Minimal API, SQLite, reduced Onion Architecture) is well-established and appropriate for a local MVP. The primary feasibility risk is scope creep, not technical difficulty. |
| **Cost-benefit** | Favorable | The MVP eliminates unrecorded decisions and status-confirmation overhead without requiring cloud infrastructure, licensing, or integration costs. The investment is development time only. |
| **Competitive position** | No exact current alternative in use | The organization has no structured system for absence management. VacaFlow introduces a controlled process where none exists, rather than replacing a competitor product. |
| **Team alignment** | Confirmed | James Parker has provided scope boundaries, acceptance criteria, and explicit approval of MVP constraints. Emily Harrison's role in documentation is defined. |

### Decision

**Recommendation:** Proceed with Conditions

**Conditions to Proceed:**
- Confirm with James Parker whether a Microsoft Entra ID tenant is mandatory for the MVP before development begins — Owner: James Parker — Deadline: Before development kickoff
- Establish the expected concurrent user count during the review window to validate SQLite as the appropriate database — Owner: James Parker — Deadline: Before development kickoff
- Confirm with IGS Solutions legal or compliance that no privacy notice is required before any employee accesses the MVP application — Owner: James Parker — Deadline: Before any employee accesses the application

**Rationale:**
VacaFlow addresses a real, documented operational problem with a clearly bounded scope, an appropriate technology stack, and explicit acceptance criteria. The three conditions above are information gaps that could require architecture or scope changes if not resolved before development begins; resolving them is low-effort and does not affect the core build plan.

---

## 8. Next Steps

- [ ] Confirm whether Microsoft Entra ID is mandatory for the MVP — Owner: James Parker — Target: 2026-07-27
- [ ] Establish expected concurrent user count for the review window — Owner: James Parker — Target: 2026-07-27
- [ ] Obtain legal/compliance confirmation that no privacy notice is required for internal MVP use — Owner: James Parker — Target: 2026-07-27
- [ ] Confirm Emily Harrison's availability for scope documentation and executive presentation preparation — Owner: Emily Harrison — Target: 2026-07-24
- [ ] Sign the Strategic Intake Document and authorize proceed to Phase 2 — Owner: Junior Gervacio (Product Owner) — Target: 2026-07-24
- [ ] Begin Phase 2: Define — Functional Specification — Owner: Junior Gervacio — Target: 2026-07-28

**If Approved → Proceed to Phase 2:** Define — Functional Specification (Target: 2026-07-28)

---

## 9. Document Control

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Junior Gervacio (AI Assisted) | Initial draft |

## Approval

| Role | Name | Date | Status | Comments |
|------|------|------|--------|----------|
| Product Owner | Junior Gervacio | | Pending | |
| Sponsor | James Parker | | Pending | |
| Tech Lead | | | Pending | |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Junior Gervacio (AI Assisted) |
| Approval Authority | Product Owner (PM_OVERRIDE — bypassed Product Owner) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 18:39:29 UTC |

*— End of document —*
