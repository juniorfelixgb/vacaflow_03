# Project Governance Framework: VacaFlow_03

**Project:** VacaFlow_03
**Organization:** IGS Solutions
**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Draft
**Reference:** SI-001 (Strategic Intake Document)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version |

---

## 1. Introduction

### 1.1 Purpose

This governance framework establishes the structures, processes, decision-making authorities, and controls that govern the VacaFlow_03 project at IGS Solutions. It defines how decisions will be made, how changes will be managed, who holds accountability for each type of decision, and how the project will be monitored through its MVP validation phase and any subsequent iterations.

### 1.2 Scope

This framework applies to all aspects of VacaFlow_03, including:

- Scope management and scope change control
- Schedule management
- Budget management
- Quality management and acceptance criteria
- Risk management
- Change management
- Technical architecture oversight
- MVP validation and acceptance workflow

### 1.3 Governance Objectives

- Establish unambiguous decision-making authority at every level
- Protect the MVP scope boundary from uncontrolled expansion
- Ensure every scope change is explicitly authorized by James Parker before implementation
- Provide a transparent escalation path for issues that cannot be resolved at the team level
- Create an audit trail of decisions to support the acceptance review
- Align governance with IGS Solutions' hierarchical decision-making culture and internal practices

### 1.4 Governing Context

VacaFlow_03 was initiated to resolve a documented operational problem: the absence of an authoritative record for absence request decisions at IGS Solutions. The MVP validates the complete request lifecycle (Draft → Submitted → Approved/Rejected/Cancelled) with a locally executable application and a tightly bounded scope. Governance must actively prevent scope creep, which is the primary project risk identified in the strategic intake (SI-001).

---

## 2. Governance Structure

### 2.1 Organization Chart

```
┌──────────────────────────────────────────────────────────────┐
│                     PROJECT SPONSOR                          │
│               James Parker (Operations Manager)              │
│         Final acceptance authority · Scope decisions         │
└───────────────────────────┬──────────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │                                   │
┌─────────┴──────────┐             ┌──────────┴──────────┐
│   FUNCTIONAL        │             │  ARCHITECTURE        │
│   REVIEW            │             │  OVERSIGHT           │
│   James Parker +    │             │  Technical Lead      │
│   Validation Users  │             │  (Clean/Onion Arch)  │
└─────────┬──────────┘             └──────────┬──────────┘
          │                                   │
┌─────────┴──────────┐             ┌──────────┴──────────┐
│   SCOPE & DOCS      │             │  DEVELOPMENT TEAM    │
│   Emily Harrison   │             │  (Developers, QA)    │
│  (Functional Analyst)             └─────────────────────┘
└─────────────────────┘
```

### 2.2 Governance Bodies

#### Project Sponsor Authority

| Aspect | Details |
|--------|---------|
| **Role holder** | James Parker, Operations Manager |
| **Purpose** | Final acceptance, scope decisions, escalation resolution |
| **Decision scope** | All scope additions, formal acceptance, budget decisions, post-MVP direction |
| **Availability** | Available for escalations; review meetings scheduled at key milestones |
| **Quorum** | James Parker alone constitutes full authority |

**Responsibilities:**
- Approve or reject any addition of deferred items (Microsoft Entra ID, Azure deployment, Docker/CI/CD, notifications, password reset, vacation balances, holiday calendars, reports, HR administration, multi-level approvals, or external integrations)
- Grant or deny formal acceptance of the MVP based on the functional checklist
- Authorize the involvement of one manager and one employee as validation participants prior to formal acceptance
- Resolve escalated issues that cannot be settled at the team level
- Approve budget variances and post-MVP investment decisions

---

#### Functional Documentation Authority

| Aspect | Details |
|--------|---------|
| **Role holder** | Emily Harrison, Functional Analyst |
| **Purpose** | Scope documentation, meeting transcripts, executive summaries, presentation materials |
| **Decision scope** | Documentation accuracy and completeness; scope boundary communication |
| **Collaboration** | Works under direction of James Parker for all material prepared for his review |

**Responsibilities:**
- Maintain the VacaFlow MVP Scope Validation document as the authoritative scope reference
- Prepare meeting transcripts and executive summaries for James Parker's review
- Prepare presentation materials for the acceptance review
- Flag any scope ambiguity or documentation gap before the acceptance review is convened
- Coordinate with the development team to ensure documentation reflects implementation reality

---

#### Technical Architecture Oversight

| Aspect | Details |
|--------|---------|
| **Role holder** | Technical Lead (development team) |
| **Purpose** | Enforce reduced Onion Architecture, Clean Architecture principles, and technical constraints |
| **Decision scope** | Technical implementation decisions within the approved architecture |
| **Boundaries** | Cannot override scope decisions; architecture choices must stay within approved constraints |

**Responsibilities:**
- Ensure the implementation follows the approved reduced Onion Architecture (Domain, Application, Infrastructure, API, Web layers)
- Enforce technical constraints: no MediatR, CQRS, generic repositories, or messaging frameworks
- Ensure passwords are hashed and the SQLite file is not publicly exposed or committed with real credentials
- Flag technical risks that require James Parker's decision
- Approve pull requests and code quality gates

---

### 2.3 Validation Participant Panel

Before formal acceptance by James Parker, up to two users — one manager and one employee — will execute the end-to-end workflow under James Parker's direction. This is not a separate governance body; it is an acceptance enablement step.

| Participant | Role in Validation |
|-------------|-------------------|
| One IGS Solutions Manager | Exercises manager-side workflow: login, review Submitted requests, approve or reject with comment |
| One IGS Solutions Employee | Exercises employee-side workflow: registration, login, Draft creation, submission, status verification |

Observations from this validation step are reported to James Parker, who holds the final acceptance decision.

---

## 3. Decision-Making Framework

### 3.1 Decision Culture

VacaFlow_03 operates under a **hierarchical decision-making model**. Decisions flow upward when they exceed the authority threshold of the current level. Consensus is sought within the development team for technical implementation choices, but scope, acceptance, and change decisions are not made by committee — they are made by James Parker.

### 3.2 Decision Authority Matrix

| Decision Type | Development Team | Technical Lead | Emily Harrison | James Parker |
|---------------|:----------------:|:--------------:|:--------------:|:------------:|
| Technical implementation (within architecture) | Recommend | **Decide** | Informed | Informed |
| Architecture pattern or technology choice | Recommend | **Decide** | Informed | Informed if risk |
| Bug priority during MVP window (blocking vs. cosmetic) | Recommend | **Decide** | Informed | Escalate if blocking |
| Documentation content and completeness | Input | Input | **Decide** | Review |
| Scope clarification (within signed scope) | Input | Input | **Decide** | Confirm |
| Any deferred item re-inclusion | Escalate | Escalate | Prepare brief | **Decide** |
| New feature not in signed scope | Escalate | Escalate | Document | **Decide** |
| MVP acceptance | N/A | Input | Input | **Decide** |
| Post-MVP roadmap | Input | Input | Input | **Decide** |
| Involvement of validation users | Inform | Inform | Coordinate | **Decide** |

### 3.3 Scope Change Decision Rule

Any addition of an item listed as Out of Scope or Deferred (Won't v1) in SI-001 requires an explicit separate scope decision approved by James Parker **before** any implementation work begins. This applies without exception to:

- Microsoft Entra ID or any corporate single sign-on provider
- Azure deployment or cloud hosting
- Docker or CI/CD pipelines
- Email or Microsoft Teams notifications
- Password reset or email verification
- Account administration screens
- Vacation balance calculations
- Holiday calendars or working-day calculations
- Overlapping request validation
- File attachments
- Reporting, dashboards, or data exports
- HR administration screens
- Multi-level approvals or approval delegation
- Payroll, HR, calendar, or directory integrations
- Advanced audit trails beyond the core approval record
- Automated backups
- Multifactor authentication

No team member may implement any of the above items without written authorization from James Parker. Implementation without authorization is a governance violation that will be escalated immediately.

### 3.4 Decision-Making Process

```
┌──────────────────────────────────────────────────────────────┐
│                  DECISION-MAKING PROCESS                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. IDENTIFY need for decision                               │
│           │                                                  │
│           ▼                                                  │
│  2. CLASSIFY: Is it within approved scope and architecture?  │
│           │                                                  │
│     ┌─────┴──────────────────────────┐                      │
│     │ YES — In-scope technical       │ NO — Scope or         │
│     │ decision                       │ deferred item         │
│     ▼                                ▼                       │
│  Technical Lead decides          Emily Harrison prepares     │
│  and documents rationale         scope change brief          │
│                                       │                      │
│                                       ▼                      │
│                               James Parker decides           │
│                                       │                      │
│                          ┌────────────┴────────────┐         │
│                       Approved                  Rejected     │
│                          │                          │        │
│                          ▼                          ▼        │
│                   Update scope baseline      Communicate     │
│                   and proceed                deferral and    │
│                                             close request    │
│           │                                                  │
│           ▼                                                  │
│  3. DOCUMENT decision in Decision Log                        │
│           │                                                  │
│           ▼                                                  │
│  4. COMMUNICATE to project team                              │
│           │                                                  │
│           ▼                                                  │
│  5. IMPLEMENT and verify outcome                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.5 Decision Log

All decisions affecting scope, architecture, or acceptance will be recorded in the Decision Log maintained by Emily Harrison.

| ID | Date | Decision | Options Considered | Choice | Rationale | Decided By |
|----|------|----------|--------------------|--------|-----------|------------|
| D001 | 2026-07-21 | MVP scope boundary established | Full HR platform vs. tightly bounded lifecycle MVP | Tightly bounded lifecycle MVP | Validates core workflow without infrastructure or integration complexity | James Parker |
| D002 | 2026-07-21 | Authentication approach | Microsoft Entra ID vs. local hashed-password auth | Local hashed-password auth | Entra ID is deferred; MVP validates workflow locally | James Parker |
| D003 | 2026-07-21 | Database technology | Azure SQL vs. SQLite | SQLite | Local execution only; no cloud infrastructure in MVP | James Parker |
| D004 | 2026-07-21 | Architecture style | Full Onion with MediatR/CQRS vs. reduced Onion | Reduced Onion (Domain, Application, Infrastructure, API, Web) | Appropriate for MVP complexity; avoids unnecessary framework overhead | Technical Lead |

---

## 4. Change Management

### 4.1 Change Control Process

```
┌──────────────────────────────────────────────────────────────┐
│                   CHANGE CONTROL PROCESS                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. IDENTIFY proposed change                                 │
│     - What is being requested?                               │
│     - Who is requesting it?                                  │
│           │                                                  │
│           ▼                                                  │
│  2. ASSESS whether the item is in scope or deferred          │
│           │                                                  │
│     ┌─────┴──────────────────────────────┐                  │
│     │ In scope — clarification or        │ Deferred/Out of   │
│     │ technical adjustment               │ scope addition    │
│     ▼                                    ▼                   │
│  Technical Lead resolves           STOP — Requires           │
│  with documentation                James Parker's            │
│                                    explicit decision         │
│                                         │                    │
│                                         ▼                    │
│                               3. PREPARE change brief        │
│                                  (Emily Harrison)            │
│                                         │                    │
│                                         ▼                    │
│                               4. PRESENT to James Parker     │
│                                         │                    │
│                               ┌─────────┴─────────┐         │
│                           Approved             Rejected      │
│                               │                    │        │
│                               ▼                    ▼        │
│                       5. UPDATE scope          Communicate   │
│                       baseline and log         rejection     │
│                       change decision          and archive   │
│                               │                             │
│                               ▼                             │
│                       6. IMPLEMENT change                   │
│                               │                             │
│                               ▼                             │
│                       7. VERIFY outcome                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Change Classification

| Classification | Criteria | Approval Authority |
|----------------|----------|--------------------|
| **Technical Adjustment** | Implementation choice within approved architecture and scope; no new features, no deferred items | Technical Lead |
| **Scope Clarification** | Ambiguity in documented scope that does not add new functionality | Emily Harrison (documents), James Parker (confirms if material) |
| **Scope Addition** | Any item not currently in the signed scope, regardless of perceived effort or complexity | James Parker — explicit written decision required |
| **Deferred Item Activation** | Any item listed in Won't v1 or Out of Scope in SI-001 | James Parker — treated as a separate, new scope decision |

### 4.3 Defect Handling During MVP Validation Window

| Defect Type | Definition | Action |
|-------------|------------|--------|
| **Blocking** | Prevents the end-to-end workflow from being demonstrated with business rules enforced | Addressed immediately; takes priority over all other work |
| **Cosmetic** | Visual, wording, or formatting issue that does not break the workflow or violate a business rule | Deferred; logged but not resolved during the MVP validation window |

This classification applies during the MVP validation window only. James Parker makes the final call on whether a specific defect is blocking or cosmetic if there is disagreement.

### 4.4 Change Request Template

```markdown
## Change Request

| Field | Value |
|-------|-------|
| CR ID | CR-[XXX] |
| Title | [Brief description of the requested change] |
| Requestor | [Name and role] |
| Date Submitted | [YYYY-MM-DD] |
| Priority | Low / Medium / High / Critical |
| Classification | Technical Adjustment / Scope Clarification / Scope Addition / Deferred Item Activation |

### Description
[What is being requested and why]

### Business Justification
[Why is this change needed? What problem does it solve that is not already solved by the approved MVP scope?]

### Impact Assessment

| Area | Impact | Details |
|------|--------|---------|
| Scope | [None / Low / Medium / High] | [Description of scope effect] |
| Schedule | [X days] | [Which deliverables affected] |
| Complexity | [Low / Medium / High] | [Technical effort estimate] |
| Risk | [Low / Medium / High] | [New risks introduced] |
| Acceptance criteria | [Affected / Not affected] | [How acceptance criteria change] |

### Recommendation
[Submitter's recommendation: Approve / Reject / Defer, with rationale]

### Decision

| Decided By | Decision | Date | Conditions or Notes |
|------------|----------|------|---------------------|
| James Parker | [Approve / Reject / Defer] | [Date] | [Any conditions] |
```

---

## 5. RACI Matrix

### 5.1 Project Activities RACI

| Activity | James Parker (Sponsor) | Emily Harrison (Functional Analyst) | Technical Lead | Development Team |
|----------|:----------------------:|:-----------------------------------:|:--------------:|:----------------:|
| MVP scope definition | A | R | C | I |
| Scope change authorization | A | R (prepares brief) | C | I |
| Functional documentation | C | A/R | C | I |
| Executive summary and presentation | A | R | I | I |
| Architecture decisions | I | I | A/R | C |
| Technical implementation | I | I | A | R |
| Business rule enforcement (code) | I | C | A | R |
| Password hashing and data protection | I | I | A | R |
| MVP validation workflow execution | A | R (coordinates) | C | I |
| Validation user selection | A | C | I | I |
| Blocking defect resolution | C | I | A | R |
| Cosmetic defect deferral decision | A | C | C | I |
| MVP formal acceptance | A | C | C | I |
| Post-MVP direction decisions | A | C | C | I |
| Risk identification | C | C | A/R | R |
| Risk escalation | A | I | R | C |
| Status reporting | I | A/R | C | C |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

### 5.2 Deliverable Approval RACI

| Deliverable | Creator | Reviewer | Approver |
|-------------|---------|----------|----------|
| MVP Scope Validation Document | Emily Harrison | James Parker | James Parker |
| Executive Summary / Presentation | Emily Harrison | James Parker | James Parker |
| Meeting Transcripts | Emily Harrison | James Parker | James Parker |
| Architecture Design | Technical Lead | Development Team | Technical Lead |
| API and UI Boundary Documentation | Emily Harrison + Technical Lead | James Parker | Emily Harrison |
| Functional Acceptance Checklist | Emily Harrison | James Parker | James Parker |
| README and Setup Instructions | Technical Lead / Developers | Technical Lead | Technical Lead |
| Change Request Brief | Emily Harrison | Technical Lead | James Parker |
| Source Code | Development Team | Technical Lead | Technical Lead |

---

## 6. Quality Gates

### 6.1 Phase Gate Reviews

| Gate | Milestone | Review Authority | Go/No-Go Criteria |
|------|-----------|-----------------|-------------------|
| G1 | MVP scope baseline frozen | James Parker | Scope validation document signed; all deferred items documented; no open scope ambiguities |
| G2 | Development complete | Technical Lead | All in-scope endpoints and screens implemented; all business rules enforced; no plain-text passwords; SQLite file not exposed |
| G3 | Internal technical review | Technical Lead | Unit tests passing; authentication, lifecycle, and authorization logic verified |
| G4 | MVP validation workflow | James Parker (with validation users) | End-to-end workflow demonstrated by one manager and one employee with all business rules enforced; no blocking defects |
| G5 | Formal MVP acceptance | James Parker | All acceptance criteria met; functional checklist validated; Emily Harrison's presentation materials delivered |

### 6.2 MVP Acceptance Criteria

The MVP is accepted when the following can be demonstrated end-to-end with no blocking defects:

1. An employee registers through the public registration page and receives an Employee account (not Manager)
2. The employee logs in and creates an absence request in Draft state
3. The employee edits the Draft request and verifies business rules (end date not before start date; start date not in the past)
4. The employee submits the request, changing its state to Submitted
5. A Manager account (seeded or controlled-setup) logs in and sees only Submitted requests
6. The manager approves or rejects the request with a comment; the decision is recorded against the authenticated manager's identity
7. The employee views the final decision and responsible approver directly in the application
8. The employee can cancel a Draft request
9. No deferred items are present in the application

### 6.3 Gate Review Process

1. **Prepare**: Compile the gate review package (status, evidence, outstanding items)
2. **Present**: Review with the gate authority (James Parker for G1, G4, G5; Technical Lead for G2, G3)
3. **Assess**: Evaluate against the stated criteria
4. **Decide**: Go / Conditional Go (with documented remediation required) / No-Go
5. **Document**: Record decision, conditions, and owner in the Decision Log
6. **Proceed**: Execute next phase or remediate blocking issues before reconvening

---

## 7. Reporting and Oversight

### 7.1 Reporting Schedule

| Report | Audience | Frequency | Owner | Format |
|--------|----------|-----------|-------|--------|
| Development Status | James Parker, Emily Harrison | At each milestone or on request | Technical Lead | Written summary |
| Scope Change Log | James Parker | As changes occur | Emily Harrison | Updated change log |
| Defect Status | James Parker | During validation window | Technical Lead | Defect list (blocking vs. cosmetic) |
| Acceptance Readiness | James Parker | Before G4 and G5 | Emily Harrison | Presentation + checklist |
| Decision Log | All parties | Maintained continuously | Emily Harrison | Decision log table |

### 7.2 Key Performance Indicators

| KPI | Target | Measurement |
|-----|--------|-------------|
| Scope additions without James Parker authorization | 0 | Count of unauthorized additions detected |
| Blocking defects at G4 | 0 | Count of blocking defects during validation workflow |
| Business rules enforced | 100% | All defined rules verified during G4 walkthrough |
| Manager accounts created via public registration | 0 | Verified during G4 that public registration cannot self-assign Manager role |
| Plain-text passwords in database | 0 | Technical verification by Technical Lead at G2 |
| SQLite file publicly exposed or committed with real credentials | 0 | Technical verification by Technical Lead at G2 |

---

## 8. Issue and Escalation Management

### 8.1 Issue Severity Classification

| Severity | Definition | Response Time | Escalation Path |
|----------|------------|---------------|-----------------|
| **Critical** | Blocks the MVP validation workflow; acceptance cannot proceed | Immediate | Technical Lead → James Parker within 4 hours |
| **High** | Significant impact on a deliverable; resolution required before acceptance | 1 business day | Technical Lead → James Parker if unresolved in 24 hours |
| **Medium** | Moderate impact; can be managed within the team | 3 business days | Technical Lead resolves; escalates if unresolved |
| **Low / Cosmetic** | Minor issue with no impact on workflow or business rules | Deferred to post-acceptance log | Technical Lead logs; no escalation required |

### 8.2 Scope Creep Escalation Rule

Any team member who becomes aware of a deferred or out-of-scope item being implemented or considered for implementation **must escalate immediately** to the Technical Lead, who escalates to James Parker within the same business day. This rule takes precedence over normal issue severity classification.

### 8.3 Escalation Path

```
              ┌──────────────────────────────────┐
              │     JAMES PARKER (PROJECT SPONSOR)│
              │  Final decision on all escalations│
              └─────────────────┬────────────────┘
                                │ Escalate within 1 business day
                                │ (immediately for critical/scope issues)
              ┌─────────────────┴────────────────┐
              │      TECHNICAL LEAD               │
              │  Technical and process escalations│
              └─────────────────┬────────────────┘
                                │ Escalate within 4 hours (critical)
                                │ 1 business day (high)
              ┌─────────────────┴────────────────┐
              │      DEVELOPMENT TEAM             │
              │  Identifies issues during build   │
              └──────────────────────────────────┘
```

---

## 9. Data Governance and Security Controls

### 9.1 Personal Data Inventory

VacaFlow_03 stores the following personal data in its SQLite database:

| Data Element | Purpose | Stored Where |
|--------------|---------|--------------|
| Employee full name | Identity, request display, approval record | SQLite — Employee table |
| Employee email address | Authentication username | SQLite — Authentication table |
| Password hash | Authentication credential | SQLite — Authentication table (hashed only; never plain text) |
| Absence request reason | Business record of absence request | SQLite — Request table |
| Absence request dates | Business record of absence period | SQLite — Request table |
| Approval comment | Manager's decision rationale | SQLite — Approval table |
| Approving manager identity | Accountability record | SQLite — Approval table (authenticated session identity) |

This data is stored for the duration of the MVP validation window. No data retention policy or automated deletion applies in the MVP. Formal privacy and data retention requirements must be revisited before any move to production.

### 9.2 Security Controls

| Control | Requirement | Enforcement |
|---------|-------------|-------------|
| Password storage | All passwords must be stored as hashes; plain text is prohibited | Technical Lead verifies at G2 |
| SQLite file exposure | The SQLite database file must not be publicly accessible via any URL | Technical Lead verifies at G2 |
| SQLite file in source control | The SQLite database file must not be committed with real user credentials | Technical Lead enforces via repository configuration |
| Approval identity | The approving manager's identity must be derived from the authenticated session, not from frontend input | Technical Lead verifies at G3 |
| Manager role self-assignment | Public registration must not permit self-assignment of the Manager role | Technical Lead verifies at G3; demonstrated at G4 |
| Scope of personal data disclosure | Personal data must not be accessible to unauthenticated users | Technical Lead verifies at G3 |

### 9.3 Acknowledgment of Limitations

The following limitations are acknowledged for the MVP and must be revisited before any production deployment:

- No formal privacy notice or consent flow is included in the MVP
- No data retention policy or automated deletion is implemented
- No audit log beyond the core approval record is provided
- No automated backup of the SQLite file is implemented; manual copy instructions are provided in the README
- Microsoft Entra ID and multifactor authentication are deferred to post-MVP hardening

---

## 10. Document Control

### 10.1 Governing Documents

| Document | Owner | Authority | Status |
|----------|-------|-----------|--------|
| Strategic Intake Document (SI-001) | Junior Gervacio | Approved (2026-07-20) | Signed |
| VacaFlow MVP Scope Validation | Emily Harrison | James Parker | Governing scope reference |
| This Governance Framework | Yeuri Jessel Reyes | James Parker | Draft |
| Functional Acceptance Checklist | Emily Harrison | James Parker | To be prepared before G4 |
| Decision Log | Emily Harrison | All parties | Maintained continuously |
| Change Request Log | Emily Harrison | James Parker | Maintained continuously |

### 10.2 Version Control Rules

- All governance documents are version controlled
- Major changes (scope redefinition, authority changes): increment major version (1.0 → 2.0)
- Minor changes (clarifications, additions within approved scope): increment minor version (1.0 → 1.1)
- All changes logged in the document's version history table with author and summary of changes

### 10.3 Compliance and Audit Trail

| Requirement | Evidence | Maintained By |
|-------------|----------|---------------|
| All scope decisions documented | Decision Log, Change Request Log | Emily Harrison |
| Acceptance criteria met | Functional Acceptance Checklist signed by James Parker | Emily Harrison |
| Security controls verified | G2 and G3 gate review records | Technical Lead |
| No unauthorized scope additions | Change Request Log showing zero unapproved additions | Emily Harrison |
| Personal data documented | Section 9.1 of this document | Yeuri Jessel Reyes |
| MVP limitations acknowledged | Section 9.3 of this document; README | Technical Lead |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Executive Sponsor | Yeuri Jessel Reyes | | Pending |
| Project Manager | | | Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Executive Sponsor (PM_OVERRIDE — bypassed Executive Sponsor) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:02:29 UTC |

*— End of document —*
