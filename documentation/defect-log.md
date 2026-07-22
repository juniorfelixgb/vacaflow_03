# Defect Log: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Active

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version |

---

## 1. Defect Management Overview

### 1.1 Purpose

This document defines the defect management process and provides tracking templates for VacaFlow_03. It is tailored for the MVP validation window, during which the implementation team and functional stakeholders will exercise the full vacation-request workflow to identify and resolve defects before formal acceptance.

### 1.2 Scope

This defect log covers:

- Defects identified during the MVP review and acceptance window
- Issues affecting the core workflow: registration, login, request creation, submission, approval, rejection, and final status visibility
- Cosmetic or non-blocking issues that do not prevent workflow completion
- Business rule enforcement failures (e.g., incorrect approval routing, wrong status transitions)

Out of scope:

- Automated CI/CD pipeline issues (not part of this MVP)
- Azure cloud deployment issues (explicitly out of scope)
- Post-acceptance production support

### 1.3 Tools

**Primary Tool:** Azure DevOps (Work Items — Bug type)
**Reporting:** Azure DevOps Queries and Boards
**Communication:** Direct coordination between Emily Harrison (Functional Analyst) and James Parker (Project Sponsor / Operations Manager)

---

## 2. Defect Classification

### 2.1 Severity Levels

| Severity | Definition | Examples | Priority During MVP |
|----------|------------|----------|---------------------|
| **Blocking** | Prevents completion of any core workflow action | Registration fails, login does not work, request cannot be created or submitted, approval/rejection does not execute, final status not visible, business rule not enforced | Must be fixed before acceptance checklist can be validated |
| **Cosmetic / Non-Blocking** | Does not prevent workflow completion; affects UI presentation or experience only | Label misalignment, minor formatting inconsistency, non-critical text error, colour or spacing issues | Can wait; addressed after blocking defects are resolved and acceptance window permits |

### 2.2 Priority Levels

| Priority | Definition | Action |
|----------|------------|--------|
| **P1 — Blocking** | Defect prevents any step of the core workflow from completing | Fix immediately; acceptance testing cannot proceed past this point until resolved |
| **P2 — Non-Blocking** | Defect does not prevent workflow but should be tracked | Address after all P1 defects are resolved, within the MVP review window if time allows |

### 2.3 Defect Types

| Type | Description |
|------|-------------|
| Functional | Feature or workflow step does not behave as specified |
| Business Rule | A business rule (e.g., approval hierarchy, request lifecycle transition) is not enforced correctly |
| Data / Validation | Data entry, persistence, or validation behaves incorrectly |
| Usability | UI is confusing or misleading but workflow still completes |
| Cosmetic | Visual presentation issues that have no functional impact |
| Integration | Interaction between modules or layers fails (e.g., backend–frontend mismatch) |
| Security | Unauthorised access, data exposure, or authentication issue |

---

## 3. Defect Lifecycle

### 3.1 Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEFECT LIFECYCLE — VacaFlow_03 MVP        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────┐    ┌──────────┐    ┌───────────┐                  │
│  │ New  │───▶│ Triaged  │───▶│ Assigned  │                  │
│  └──────┘    └──────────┘    └─────┬─────┘                  │
│                    │               │                         │
│             (Duplicate/           ▼                         │
│              Invalid)      ┌───────────┐                    │
│                    │       │In Progress│                    │
│                    ▼       └─────┬─────┘                    │
│              ┌──────────┐        │                          │
│              │  Closed  │        ▼                          │
│              │(Invalid/ │  ┌───────────┐                    │
│              │Duplicate)│  │   Fixed   │                    │
│              └──────────┘  └─────┬─────┘                    │
│                                  │                          │
│                    ┌─────────────┼──────────────┐           │
│                    │             │              │           │
│                    ▼             ▼              ▼           │
│              ┌──────────┐ ┌───────────┐ ┌───────────┐      │
│              │ Verified │ │ Reopened  │ │  Failed   │      │
│              └────┬─────┘ └───────────┘ │Verification│     │
│                   │                     └───────────┘      │
│                   ▼                                         │
│              ┌──────────┐                                   │
│              │  Closed  │                                   │
│              └──────────┘                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Status Definitions

| Status | Definition | Responsible |
|--------|------------|-------------|
| New | Defect reported; awaiting triage | Reporter (Emily Harrison or James Parker's reviewers) |
| Triaged | Reviewed; severity and priority assigned; duplicate check done | Emily Harrison |
| Assigned | Assigned to implementation team member for fix | Emily Harrison |
| In Progress | Developer actively working on the fix | Implementation team |
| Fixed | Fix implemented; ready for verification | Implementation team |
| In Verification | James Parker (or designee) verifying the fix against acceptance checklist | James Parker |
| Verified | Fix confirmed; workflow step passes acceptance checklist | James Parker |
| Reopened | Fix did not resolve the issue; defect still reproducible | James Parker |
| Closed | Defect resolved (verified), rejected (not a defect), or duplicate | Emily Harrison |
| Deferred | Cosmetic issue intentionally deferred beyond acceptance window | Emily Harrison / James Parker |

---

## 4. Defect Logging Template

### 4.1 Required Fields

```
## Defect Report

| Field            | Value                                          |
|------------------|------------------------------------------------|
| ID               | DEF-[AUTO — Azure DevOps assigns]             |
| Title            | [Brief descriptive title]                      |
| Reporter         | [Name]                                         |
| Date Reported    | [YYYY-MM-DD]                                   |
| Severity         | Blocking / Cosmetic                            |
| Priority         | P1 / P2                                        |
| Type             | [Defect type from Section 2.3]                 |
| Status           | New                                            |
| Assigned To      | [Implementation team member]                   |
| Component        | [Module/Feature affected]                      |
| Environment      | Local MVP                                      |
| Version          | MVP — Local Build                              |

### Description
[Clear description of the defect and its impact on the workflow]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Result
[What the workflow should do, per specification or business rule]

### Actual Result
[What actually happens]

### Attachments
- [Screenshot / Screen recording]
- [Log file if available]

### Additional Information
- Browser/Device: [if applicable]
- User account used: [e.g., test employee, test manager]
- Related defects: [if any]
- Acceptance checklist item blocked: [Yes / No — and which item]
```

### 4.2 Good Defect Report Example

```
## Defect Report

| Field            | Value                                                            |
|------------------|------------------------------------------------------------------|
| ID               | DEF-001                                                          |
| Title            | Employee cannot submit vacation request — Submit button inactive |
| Reporter         | Emily Harrison                                                   |
| Date Reported    | 2026-07-21                                                       |
| Severity         | Blocking                                                         |
| Priority         | P1                                                               |
| Type             | Functional                                                       |
| Status           | New                                                              |
| Assigned To      | Implementation team                                              |
| Component        | Vacation Request — Submission Module                             |
| Environment      | Local MVP                                                        |
| Version          | MVP — Local Build                                                |

### Description
After filling in all required fields of the vacation request form (dates, type,
reason), the Submit button remains inactive and cannot be clicked. The employee
cannot complete the submission step of the workflow.

### Steps to Reproduce
1. Log in as an employee (test user: employee_01)
2. Navigate to "New Vacation Request"
3. Complete all required fields: start date, end date, request type, reason
4. Observe the Submit button

### Expected Result
The Submit button becomes active and, when clicked, sends the request to the
manager for approval.

### Actual Result
The Submit button remains greyed out (disabled) even after all fields are filled.
No validation error messages are shown.

### Attachments
- Screenshot: submit-button-inactive.png

### Additional Information
- Browser: Chrome 125 (local run)
- User account: employee_01
- Acceptance checklist item blocked: Yes — "Employee can submit a vacation request"
- Related defects: None
```

---

## 5. Defect Register

### 5.1 Active Defects Summary

This register is maintained in Azure DevOps. The table below is updated at each triage point during the MVP review window.

| ID | Title | Severity | Priority | Status | Assigned To | Age (days) |
|----|-------|----------|----------|--------|-------------|------------|
| — | No defects logged yet. Register will be populated during MVP review window. | — | — | — | — | — |

### 5.2 Defects by Status

| Status | Count | Notes |
|--------|-------|-------|
| New | 0 | MVP review window not yet open |
| In Progress | 0 | — |
| Fixed (pending verification) | 0 | — |
| Closed (this review window) | 0 | — |
| **Total Open** | **0** | — |

### 5.3 Defects by Severity

| Severity | Open | Closed | Total |
|----------|------|--------|-------|
| Blocking | 0 | 0 | 0 |
| Cosmetic / Non-Blocking | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

---

## 6. Defect Metrics

### 6.1 Key Metrics

Given that VacaFlow_03 is an MVP with a single local delivery and no formal SLA, the following metrics are adapted to the MVP context:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Blocking defects at acceptance | 0 | — | To be measured |
| Acceptance checklist pass rate | 100% | — | To be measured |
| Time to fix a Blocking defect (P1) | Before next review session | — | To be measured |
| Reopen rate | < 15% | — | To be measured |
| Cosmetic defects deferred | All | — | To be measured |
| Total defects identified | Minimised | — | To be measured |

### 6.2 Root Cause Categories

When defects are logged, root causes will be tracked using the following categories:

| Root Cause Category | Description | Corrective Action |
|---------------------|-------------|-------------------|
| Requirements gap | Behaviour was not clearly specified | Update functional spec and confirm with Emily Harrison |
| Implementation error | Code does not match specification | Code correction by implementation team |
| Business rule not implemented | Approval routing, status transition, or validation rule missing | Implement and verify against business rule catalog |
| Data / validation gap | Form validation, persistence, or data flow error | Fix validation logic and re-test |
| UI / presentation issue | Cosmetic or layout problem | Address in cosmetic fixes batch |
| Integration mismatch | Frontend and backend disagree on contract | Align and re-test integration point |

---

## 7. Defect Triage Process

### 7.1 Triage Approach

Given the MVP model and small team, triage is lightweight and event-driven rather than scheduled. Any defect reported during the review window is triaged by Emily Harrison within the same review session where it is discovered.

| Aspect | Details |
|--------|---------|
| **Frequency** | On-demand during the MVP review window; same session as discovery where possible |
| **Format** | Direct coordination between Emily Harrison and the implementation team |
| **Attendees** | Emily Harrison (triage lead); James Parker consulted for acceptance impact |
| **Duration** | As needed; blocking defects triaged immediately |

### 7.2 Triage Checklist

- [ ] Is this a valid defect? (Not a misunderstanding of expected behaviour, not a duplicate)
- [ ] Does it block the workflow? (Registration, login, request creation, submission, approval, rejection, or final status visibility)
- [ ] Is the severity correctly assigned (Blocking vs. Cosmetic)?
- [ ] Is there enough information to reproduce the issue?
- [ ] Which acceptance checklist item does it affect?
- [ ] Who should own the fix?
- [ ] Should it be deferred (cosmetic, low impact)?

### 7.3 Triage Decisions

| Decision | Criteria | Next Step |
|----------|----------|-----------|
| Fix Now | Blocking — prevents any core workflow step | Assign immediately to implementation team; acceptance testing paused on that step |
| Defer | Cosmetic — does not prevent workflow | Log in Azure DevOps as P2; addressed after all blocking defects resolved |
| Reject | Not a defect (working as specified), or duplicate | Close with reason documented in Azure DevOps |
| Needs More Information | Cannot reproduce; description insufficient | Return to reporter with specific questions |

---

## 8. SLA and Resolution Expectations

### 8.1 MVP-Adapted Resolution Expectations

No formal SLA with contractual response or resolution times is defined for this MVP. The following operational expectations apply during the review window:

| Severity | Resolution Expectation |
|----------|------------------------|
| **Blocking (P1)** | Addressed as the highest priority during the active review window. The acceptance checklist cannot be completed past the blocking item until resolved. Implementation team prioritises these fixes before cosmetic issues. |
| **Cosmetic / Non-Blocking (P2)** | Addressed after all Blocking defects are resolved, within the MVP review window if time permits. May be formally deferred with agreement of James Parker. |

### 8.2 Acceptance Completion Gate

Formal acceptance by James Parker is contingent on:

1. Zero open Blocking (P1) defects.
2. All items on the acceptance checklist passed by James Parker (and any manager/employee reviewers he involves).
3. Any remaining Cosmetic defects acknowledged and agreed to be deferred or waived.

---

## 9. Escalation Process

### 9.1 When to Escalate

| Condition | Escalation Action |
|-----------|-------------------|
| Blocking defect cannot be reproduced by implementation team | Emily Harrison provides additional reproduction evidence or assists in session |
| Blocking defect fix requires requirements clarification | Emily Harrison escalates to James Parker for decision |
| Blocking defect cannot be fixed within the review window | Emily Harrison and James Parker agree on extended review window or scope reduction |
| Disagreement on whether issue is blocking or cosmetic | James Parker makes final determination |
| Pattern of defects in same module | Emily Harrison flags to implementation team for root cause review |

### 9.2 Escalation Contacts

| Level | Contact | Role | Method |
|-------|---------|------|--------|
| 1 | Emily Harrison | Functional Analyst | Direct communication |
| 2 | James Parker | Project Sponsor / Operations Manager | Direct communication |

---

## 10. Reporting

### 10.1 Defect Status Summary (Per Review Session)

```
# Defect Status — VacaFlow_03 MVP Review Session [Date]

## Summary
- New defects this session: [X]
- Resolved this session: [X]
- Open Blocking (P1): [X]
- Open Cosmetic (P2): [X]
- Acceptance checklist items blocked: [X]

## New Defects This Session
| ID    | Title                | Severity  | Assigned To       |
|-------|----------------------|-----------|-------------------|
| DEF-X | [Title]              | [Sev]     | Implementation    |

## Resolved This Session
| ID    | Title                | Resolution             | Verified By       |
|-------|----------------------|------------------------|-------------------|
| DEF-X | [Title]              | Fixed / Invalid / Dup  | James Parker      |

## Blocking Defects Still Open
| ID    | Age   | Status      | Acceptance Item Blocked |
|-------|-------|-------------|-------------------------|
| DEF-X | X days| In Progress | [Checklist item]        |

## Acceptance Readiness
- Acceptance checklist: [X / Total items] passed
- Ready for formal sign-off: Yes / No
```

### 10.2 Final Acceptance Summary

```
# MVP Acceptance Defect Summary — VacaFlow_03

## Final Status
| Metric                         | Value         |
|-------------------------------|---------------|
| Total defects identified       | [X]           |
| Blocking defects resolved      | [X]           |
| Blocking defects outstanding   | 0 (required)  |
| Cosmetic defects resolved      | [X]           |
| Cosmetic defects deferred      | [X]           |
| Acceptance checklist pass rate | [X]% (must be 100%) |

## Deferred Cosmetic Defects
| ID    | Title                | Agreed Action           |
|-------|----------------------|-------------------------|
| DEF-X | [Title]              | Deferred — post-MVP     |

## Acceptance Decision
Confirmed by: James Parker (Project Sponsor / Operations Manager)
Date: [YYYY-MM-DD]
Outcome: Accepted / Not Accepted
Notes: [Any conditions]
```

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical Lead | Yeuri Jessel Reyes | Pending | Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Technical Lead (PM_OVERRIDE — bypassed Technical Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:12:26 UTC |

*— End of document —*
