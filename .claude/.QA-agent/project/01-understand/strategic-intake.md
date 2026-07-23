# Strategic Intake Document

**Project:** NEXA
**Document ID:** SI-001
**Stage:** 01 — Understand
**Author:** Andrea Bermudez (AI Assisted)
**BSA/PO:** Andrea Bermudez
**Sponsor:** InspyrSolutions Leadership
**Organization:** InspyrSolutions
**Date:** 2026-07-14
**Status:** Draft

---

## 1. Project Context

InspyrSolutions currently operates **SenseHQ** (sensehq.com), a CRM platform that centralizes the full lifecycle management of candidates and employees. The platform maintains complete interaction histories — call attempts, responses, profile data, skills, and project assignments — and integrates bidirectionally with **JobDiva**, the organization's external Applicant Tracking System, synchronizing candidate profiles and skill updates. Automated workflows guide each individual through journeys defined by their status (active candidate, project-placed employee, or returning talent), with communications delivered across SMS, WhatsApp, email, AI-powered voice calls, and chat. When an employee's project ends, the system automatically prompts skill updates and surfaces open positions. Three departments rely on this platform daily: Marketing, Recruiting, and HR.

Three dedicated kickoff sessions with stakeholders validated critical limitations in SenseHQ's current implementation. **Journey definitions lack the granularity** required for country-specific compliance rules, language preferences, and local time-zone scheduling. **Audience segmentation is constrained**, preventing dynamic inclusion or exclusion of recipient groups. As a direct consequence, teams maintain **multiple duplicated journey copies** across departments to work around filtering gaps — increasing maintenance effort, elevating error risk, and reducing agility. A stakeholder explicitly flagged a reliability deficit: *"It keeps breaking,"* requiring manual intervention to restore execution. Journey creation requires technical team involvement, further reducing business agility. The platform also carries a **recurring external licensing cost** confirmed as a replacement driver.

**Why now?**
InspyrSolutions has made a **formal, non-renegotiable commitment** to the business: NEXA must be operational and replace SenseHQ by **September 2026**. This deadline is fixed and non-negotiable — it is not a modernization target but a contractual boundary driven by two concrete facts: (1) SenseHQ has reached its functional ceiling and cannot be extended to meet the personalization, segmentation, and multi-country compliance requirements now demanded by organizational growth, and (2) replacing SenseHQ eliminates its recurring licensing cost entirely. Delaying project initiation directly compresses available development time against this immovable date.

---

## 2. Value Proposition

> **For** Marketing, Recruiting, and HR teams at InspyrSolutions, **who need** reliable, country-aware, multi-audience journey automation without technical team dependency, **NEXA offers** a self-service journey automation platform with dynamic audience segmentation, multi-channel delivery (SMS via Twilio, Email via SendGrid), local time-zone scheduling, and country-specific compliance enforcement, **unlike** SenseHQ — which requires duplicated journey copies per audience variant, fails during execution requiring manual intervention, and cannot enforce time-zone or compliance rules natively.

### Value Comparison

| Dimension | NEXA | SenseHQ (Current) |
|-----------|------|-------------------|
| **Journey authorship** | Business users self-serve via visual journey editor; no technical team required | Requires technical team involvement to create or reconfigure journeys |
| **Audience segmentation** | Dynamic rules-based segmentation by country, language, and configurable business attributes; real-time inclusion/exclusion | Constrained filtering forces manual audience management and duplicate journey copies per variant |
| **Communication reliability** | Custom orchestration engine with retry mechanisms; zero stakeholder-reported failures target at go-live | Active execution failures reported across all three kickoff sessions ("keeps breaking"); manual intervention required |
| **Compliance & scheduling** | Local time-zone scheduling enforced per recipient; country-specific compliance rules (TCPA, GDPR, CASL) enforced at delivery; Twilio (SMS) and SendGrid (Email) configured and integrated as part of MVP | No local time-zone scheduling; no country-specific compliance enforcement in delivery engine |
| **Licensing cost** | Zero recurring external licensing cost (fully owned, OSS-first stack) | Recurring external licensing cost — confirmed business driver for replacement |
| **Journey maintenance burden** | One canonical journey per business process | Multiple duplicated copies per audience variant maintained across Marketing, Recruiting, and HR |

---

## 3. Stakeholders

| Name / Role | Influence | What They Decide or Need to Answer |
|-------------|-----------|-------------------------------------|
| InspyrSolutions Leadership · Executive Sponsor | High | Makes the final go/no-go decision for NEXA; authorizes budget and September 2026 delivery commitment |
| Milgrim Bello · Marketing | High | Approves Marketing journey requirements and confirms reporting dashboard content and layout specifications |
| Colby Sanders · JobDiva / HR | High | Confirms the JobDiva data access model for NEXA — whether integration uses REST API, direct DB access, or read replica — a decision that determines the Adapter Service architecture |
| Jim Barrett · HR / Recruiting | High | Validates HR and Recruiting journey requirements and confirms priority journey definitions for Sprint 1 |
| Amanda Hilsenbeck · HR Operations | Medium | Validates operational workflows for Payroll W2/C2C journeys and confirms dashboard reporting requirements for HR Operations |
| Paula Sanders · HR / Recruiting | Medium | **RISK:** Can block scope changes if Recruiting journey requirements are not aligned before Sprint 1 backlog finalization. Must be involved in priority journey validation before kickoff closes to confirm requirements are captured correctly and prevent late-stage scope disputes. |

---

## 4. Business Context & Scope

### Expected Value (Quantified)

**Measurable Benefits:**

| Benefit | Current Baseline | Target | Target Date |
|---------|-----------------|--------|-------------|
| Licensing cost | SenseHQ recurring external licensing cost (amount not yet disclosed) | Reduced to zero | September 2026 (NEXA go-live) |
| Journey copies per process | Multiple duplicated journeys per audience variant across Marketing, Recruiting, and HR | One canonical journey per business process | Q3 2026 |
| Journey creation time | Requires technical team involvement and significant manual effort | Business users self-serve with no technical team involvement | September 2026 |
| Communication reliability | Execution failures reported across all three kickoff sessions | Zero stakeholder-reported execution failures at MVP go-live | September 2026 |
| Audience targeting accuracy | No local time-zone scheduling; no country-specific compliance controls | 100% of SMS and Email communications delivered within recipient's local business hours and in compliance with applicable country rules | September 2026 |
| Priority journey coverage | Eight priority journeys not yet automated in NEXA | All eight journeys operational (Candidates Placed INFRA/IT; Terminations/Offboarding — Amazon AWS, Cisco, General, Meta; Payroll W2/C2C) | September 2026 |

**Qualitative Benefits:**
- Improved candidate and employee experience through timely, personalized lifecycle communications
- Increased recruiter and HR team confidence in platform reliability — directly addressing the trust deficit surfaced at kickoff
- Standardized, reusable workflow templates across Marketing, Recruiting, and HR — eliminating the multi-copy maintenance burden
- Architectural independence from third-party product decisions; NEXA is fully owned and operated by InspyrSolutions
- Foundation for future growth across additional countries, communication channels (WhatsApp, voice), and journey types post-MVP

### Scope Boundaries

**In Scope:**
- **Audience Management:** Dynamic audience creation based on configurable segmentation rules (country, language, configurable business rules); real-time inclusion and exclusion of audience segments
- **Journey Management:** Create, edit, activate, deactivate, and manage automated journeys; trigger-based automation on business events; journey history and audit trail
- **Multi-Channel Communication:** Automated SMS (via Twilio) and Email (via SendGrid) delivery; scheduling based on recipient local time zone; country-specific compliance rule enforcement
- **Twilio & SendGrid Integration and Configuration (MVP):** Full configuration and integration of Twilio (SMS) and SendGrid (Email) as the delivery infrastructure within NEXA — including account setup, credential management via Azure Key Vault, webhook configuration, delivery status handling, and retry logic — is in scope for the MVP
- **Template Management:** Centralized creation and management of SMS and Email communication templates
- **Survey Creation and Personalization:** Create, edit, and associate surveys with journeys
- **Administrative Dashboard:** Operational and administrative management interface
- **Basic Reporting and Analytics:** Operational reports and business dashboards (content and layouts to be confirmed with Milgrim Bello and Amanda Hilsenbeck before Requirements phase closes)
- **Error Management:** Retry mechanisms for failed communication deliveries
- **Priority Journeys (MVP):** Eight journeys confirmed across three kickoff sessions — Candidates Placed (INFRA and IT), Terminations/Offboarding (Amazon AWS, Cisco, General, Meta), and Payroll W2/C2C workflows
- **JobDiva Integration:** NEXA reads candidate and employee data from JobDiva via a dedicated JobDiva Adapter Service; communication history (sent messages and replies for SMS and Email) is written back to JobDiva per candidate

**Out of Scope:**
- **Data Migration** — Historical SenseHQ data will not be migrated; legacy system remains in parallel during transition to protect continuity
- **Additional Communication Channels (WhatsApp, AI Voice, Chat)** — Excluded from MVP as agreed at kickoff; SMS and Email only
- **AI / MCP / LLM Capabilities** — Any AI-powered features, machine learning, or large language model integrations are explicitly excluded
- **Paid iPaaS or Packaged Connectors** — No commercial integration middleware may be used for the JobDiva integration
- **Calendar Integration (OAuth2)** — Out of scope for MVP; pending future decision

**Deferred (Won't v1):**
- **Export Functionality** — Export of workflows, user lists, surveys, and reports is a nice-to-have; feasibility to be validated post-MVP
- **Advanced Reporting** — Complex analytics and custom report builders deferred to v2
- **WhatsApp and Voice Channels** — Deferred to post-MVP as agreed with stakeholders at kickoff
- **Real-Time and Incremental JobDiva Synchronization** — Manual or adapter-triggered sync is sufficient for MVP; real-time sync may be added post-MVP
- **Multi-Tenant Support and Additional JobDiva Environments** — May be incorporated as the platform evolves
- **Azure Blob Storage Integration** — May be incorporated as the platform evolves
- **Containerization / Local-Run (Docker / Docker Compose)** — To be decided post-Architecture phase
- **Multi-Region High Availability** — Sizing to be determined during Architecture phase per corporate requirements

---

## 5. Constraints & Assumptions

### Constraints (Non-negotiable)

**Business Constraints:**
- Hard delivery deadline of September 2026; NEXA must be operational and replace SenseHQ's communication engine by this date — the commitment has been made formally to the business and cannot be renegotiated
- The solution eliminates the recurring SenseHQ licensing cost; low cost must be preferred over complex components when no other constraint overrides this preference
- Budget has not yet been formally allocated or communicated to the project team — this is an open gap (see Section 6)
- Security and ISO 27001 compliance requirements take precedence over cost and simplicity when they conflict

**Technical Constraints:**
- Frontend: React / Next.js SPA; Redux state management; communicates exclusively through Azure API Management; no secrets or tokens stored client-side
- Journey Editor: React-compatible OSS canvas library (React Flow, Rete.js, or JointJS core) with no per-seat or runtime license fee; Syncfusion, GoJS, JointJS+, and jsPlumb Toolkit are prohibited; flow definitions must be persisted in a versioned, auditable form
- Backend: .NET 10 microservices; REST endpoints via Azure API Management; simplified Clean Architecture per service; preferred deployment on Azure App Service
- JobDiva Integration: Handled exclusively by a dedicated JobDiva Adapter Service; ETL and field-mapping in custom .NET code; schema-to-internal-model mapping externalized as configuration; no paid iPaaS or packaged connectors; credentials stored in Azure Key Vault and never exposed to the frontend
- Messaging: SendGrid for email; Twilio for SMS (US, Europe, Latin America); each channel behind a custom interface to avoid vendor lock-in; Twilio and SendGrid accounts must be fully configured and integrated as part of the MVP delivery; engagement orchestration in custom code
- Database: Azure SQL Database or SQL Server (to be confirmed during Architecture phase); Entity Framework Core for data access; premium/specialized tiers require documented scale justification
- Authentication & Security: Username/password with JWT tokens; RBAC by business role; passwords never stored in plain text; secrets in Azure Key Vault; TLS encryption in transit and at rest mandatory; ISO 27001 auditability required for key user and system actions
- CI/CD: Azure DevOps Pipelines; backend services deployed to Azure App Service unified through Azure API Management
- AI, MCP, and LLM capabilities are explicitly prohibited

**Legal Constraints:**
- Country-specific compliance rules for communication delivery (timing, content, opt-out handling) must be enforced; applicable frameworks per country (e.g., TCPA for the US, GDPR for Europe, CASL for Canada) have not yet been fully documented and must be confirmed with the Compliance or Legal team before the Requirements phase closes
- Data residency requirements for candidate and employee records have not been confirmed and must be resolved before architecture decisions are finalized
- Encryption in transit (TLS) and at rest is mandatory for all data handling
- ISO 27001 auditability is required for key user and system actions

### Assumptions (If these change, the project changes)

| Assumption | Impact if Wrong | Validation Method | Owner | Status |
|------------|-----------------|-------------------|-------|--------|
| JobDiva exposes a stable data access mechanism (API, direct DB, or read replica) sufficient for NEXA's read/write requirements without licensing or contractual restrictions | JobDiva Adapter Service architecture must be redesigned; integration timeline impacted; could block MVP delivery | Colby Sanders to confirm access model and any contractual constraints before Requirements phase closes | Colby Sanders | Not Validated |
| The eight priority journeys confirmed at kickoff represent sufficient MVP scope to replace SenseHQ's active usage by September 2026 | Scope must expand to cover additional journeys, compressing development timeline | Jim Barrett and Paula Sanders to validate and sign off on priority journey list before Sprint 1 backlog finalization | Jim Barrett / Paula Sanders | Not Validated |
| SenseHQ can remain operational in parallel during the NEXA transition period without service disruption | Transition plan must be redesigned; go-live risk increases | InspyrSolutions Leadership to confirm SenseHQ contract and operational availability during the transition window | InspyrSolutions Leadership | Not Validated |
| The external licensing cost of SenseHQ, once eliminated, justifies the full build cost of NEXA without requiring a formal ROI approval process | A formal ROI or budget approval gate is introduced, potentially delaying project initiation | Leadership to confirm whether a formal budget allocation and ROI approval process is required before development begins | InspyrSolutions Leadership | Not Validated |
| Applicable country-specific compliance rules (TCPA, GDPR, CASL) can be modeled as configurable business rules within NEXA without requiring jurisdiction-specific custom code per country | Compliance engine design becomes significantly more complex; timeline and architecture must be revisited | Legal or Compliance team to document specific rules per jurisdiction before Requirements phase closes | InspyrSolutions Legal / Compliance | Not Validated |
| The OSS journey editor library selected (React Flow, Rete.js, or JointJS core) can represent all journey types required for the eight priority journeys without requiring a proprietary component | Journey editor selection must be revisited; could introduce licensing exposure or require custom canvas development | Architecture phase to validate selected library against all confirmed journey types before design is finalized | Solution Architect / Technical Lead | Not Validated |
| Twilio and SendGrid accounts (or existing InspyrSolutions credentials) can be configured and integrated within the MVP timeline without contractual, provisioning, or rate-limit obstacles | Communication delivery infrastructure is delayed, directly impacting all eight priority journeys and the September 2026 go-live | Andrea Bermudez to confirm account availability and provisioning timeline with InspyrSolutions operations before Requirements phase closes | Andrea Bermudez | Not Validated |

---

## 6. Critical Information Gaps

| Gap | Impact if Not Resolved | Owner | Deadline |
|-----|------------------------|-------|----------|
| **JobDiva data access model** (API, direct DB, or read replica) and any contractual restrictions on integration | Blocks JobDiva Adapter Service architecture; without this, the integration approach — and therefore NEXA's data foundation — cannot be designed | Colby Sanders | Before Requirements phase closes |
| **Twilio and SendGrid account provisioning** — whether existing InspyrSolutions accounts exist or new accounts must be created, and whether any rate limits, provisioning timelines, or contractual steps apply | Blocks MVP communication delivery planning; Twilio and SendGrid integration is in scope for MVP and their availability is on the critical path | Andrea Bermudez | Before Requirements phase closes |
| **Budget allocation** — formal budget has not been communicated to the project team | Without a budget boundary, cost-sensitive architecture decisions (database tier, Azure services, infrastructure sizing) cannot be validated; team cannot confirm resource capacity for the September 2026 deadline | InspyrSolutions Leadership | Before kickoff closes / Sprint 1 |
| **Country-specific compliance rules per jurisdiction** (TCPA, GDPR, CASL, and others) | Blocks the compliance engine design; if rules cannot be modeled as configuration, architecture complexity increases significantly and may impact delivery timeline | InspyrSolutions Legal / Compliance | Before Requirements phase closes |
| **Data residency requirements** for candidate and employee records | Directly impacts Azure region selection, database configuration, and storage architecture; cannot be deferred past Architecture phase | InspyrSolutions Legal / Compliance | Before Architecture phase begins |
| **Reporting dashboard requirements** — content and layout not yet confirmed | Blocks front-end and reporting service design; without confirmed requirements, scope for this component is undefined | Milgrim Bello / Amanda Hilsenbeck | Before Requirements phase closes |
| **SenseHQ contract status and parallel operation window** | If SenseHQ cannot run in parallel, the transition plan must be redesigned and go-live risk increases substantially | InspyrSolutions Leadership | Before Sprint 1 |

---

## 7. Decision Framework

### Evaluation

| Criterion | Assessment | Justification |
|-----------|------------|---------------|
| **Strategic fit** | High | NEXA directly addresses the confirmed functional ceiling of SenseHQ, eliminates recurring licensing cost, and enables InspyrSolutions to scale multi-country operations with full platform ownership |
| **Technical feasibility** | Feasible with managed risks | The selected OSS-first stack (.NET 10, React/Next.js, Azure, Twilio, SendGrid) is proven and internally available; key risks — JobDiva access model, OSS canvas library selection, compliance rule modeling, Twilio/SendGrid provisioning — are resolvable within the Requirements and Architecture phases if addressed promptly |
| **Cost-benefit** | Favorable | Licensing cost elimination alone justifies the investment; eight priority journeys replacing active SenseHQ usage with zero recurring cost provides a clear return; formal ROI calculation pending budget confirmation |
| **Competitive position** | No exact internal alternative | No other internally owned platform exists to replace SenseHQ; building NEXA eliminates vendor dependency and provides a scalable, extensible foundation |
| **Team alignment** | Confirmed with conditions | Stakeholder participation confirmed across Marketing, Recruiting, and HR through three kickoff sessions; Paula Sanders alignment on Recruiting scope must be confirmed before Sprint 1 to mitigate block risk |

### Decision

**Recommendation:** Proceed with Conditions

**Conditions to Proceed:**

| Condition | Owner | Deadline |
|-----------|-------|----------|
| Colby Sanders confirms JobDiva data access model (API, direct DB, or read replica) and rules out contractual restrictions on integration | Colby Sanders | Before Requirements phase closes |
| Andrea Bermudez confirms Twilio and SendGrid account availability, provisioning timeline, and any rate limits or contractual steps required before integration can begin | Andrea Bermudez | Before Requirements phase closes |
| InspyrSolutions Leadership communicates budget allocation or confirms build-cost approval pathway | InspyrSolutions Leadership | Before Sprint 1 kickoff |
| Paula Sanders validates and signs off on priority Recruiting journey requirements to prevent late-stage scope disputes | Paula Sanders | Before Sprint 1 backlog finalization |
| Legal or Compliance team documents applicable jurisdiction-specific rules (TCPA, GDPR, CASL) per country for compliance engine design | InspyrSolutions Legal / Compliance | Before Requirements phase closes |
| InspyrSolutions Leadership confirms SenseHQ can remain operational in parallel during the NEXA transition period | InspyrSolutions Leadership | Before Sprint 1 |

**Rationale:**
NEXA is strategically justified, technically feasible, and deadline-bound — the September 2026 commitment is non-negotiable and already limits available development time. The six conditions are resolvable within the normal Requirements and Architecture phases; none of them warrant delaying initiation. Proceeding now maximizes available runway against the fixed delivery date.

---

## 8. Next Steps

- [ ] Colby Sanders confirms JobDiva data access model and any contractual integration constraints — **Owner:** Colby Sanders — **Target:** 2026-07-28
- [ ] Andrea Bermudez confirms Twilio and SendGrid account availability and provisioning steps — **Owner:** Andrea Bermudez — **Target:** 2026-07-28
- [ ] InspyrSolutions Leadership communicates budget allocation or confirms approval pathway for build cost — **Owner:** InspyrSolutions Leadership — **Target:** 2026-07-28
- [ ] Paula Sanders reviews and signs off on priority Recruiting journey list — **Owner:** Andrea Bermudez (facilitator) / Paula Sanders (sign-off) — **Target:** 2026-07-28
- [ ] Legal / Compliance team documents applicable communication compliance rules per jurisdiction (TCPA, GDPR, CASL) — **Owner:** InspyrSolutions Legal / Compliance — **Target:** 2026-08-04
- [ ] InspyrSolutions Leadership confirms SenseHQ parallel operation availability during transition window — **Owner:** InspyrSolutions Leadership — **Target:** 2026-07-28
- [ ] Milgrim Bello and Amanda Hilsenbeck confirm reporting dashboard content and layout requirements — **Owner:** Andrea Bermudez (facilitator) — **Target:** 2026-08-04
- [ ] Strategic Intake Document signed by Sponsor and BSA/PO — **Owner:** Andrea Bermudez — **Target:** 2026-07-21

**If Approved → Proceed to Phase 2:** Define — Functional Specification (Target: 2026-07-21)

---

## 9. Document Control

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-14 | Andrea Bermudez (AI Assisted) | Initial draft |
| 1.1 | 2026-07-14 | Andrea Bermudez (AI Assisted) | Incorporated reviewer feedback: Twilio and SendGrid configuration and integration added explicitly to MVP In Scope (Section 4); added as a named technical constraint (Section 5); added Twilio/SendGrid provisioning as a new Critical Information Gap (Section 6); added assumption on account availability (Section 5); added corresponding Proceed condition and next step (Sections 7 and 8); updated Technical Feasibility justification (Section 7) |

---

**Stage:** 01 — Understand
**Max Length:** 3–4 pages

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Andrea Bermudez (AI Assisted) |
| Approval Authority | Product Owner (PM_OVERRIDE — bypassed Product Owner) |
| Status | Approved |
| Signature | ✅ SIGNED by Andrea Bermudez (andrea.bermudez@arroyoconsulting.net) on 2026-07-14 14:14:58 UTC |

*— End of document —*
