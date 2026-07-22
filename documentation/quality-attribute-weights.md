# Utility Tree
## VacaFlow_03

**Architect**: Yeuri Jessel Reyes
**Date**: 2026-07-20
**Version**: 1.0
**Status**: Draft
**Weight Method**: Porcentaje (%)
**Author**: Yeuri Jessel Reyes (AI Assisted)
**References**: NFR-001 (Non-Functional Requirements Specification), FRS-001 (Functional Requirements Specification), RTM-001 (Requirements Traceability Matrix)

---

> ⚠️ **INSTRUCTIONS FOR THE ARCHITECT**
>
> Complete all fields marked with `[COMPLETAR]`.
> Rules:
> - Fill the Utility Tree with concrete, measurable scenarios for each quality attribute
> - **[Porcentaje method]**: Complete the `Quality Percentage` column for each attribute (all values must sum to exactly 100%) and the `Scenario Percentage` column for each scenario within each attribute (values per attribute must sum to exactly 100%)
> - When finished, tell the agent: **"documento listo"** or **"calcular"**
>
> The agent will validate the document, calculate the quality tree diagram automatically, and request your signature.

---

## 1. Quality Attributes (from NFR)

Quality attributes identified from the Non-Functional Requirements Specification (NFR-001).

> **NFR Priority scale:** Low = 1–3 · Medium = 4–6 · High = 7–10

| # | Attribute | NFR Priority | Definition |
|---|-----------|--------------|------------|
| 1 | Security | 10 (High) | Protection of user identity, credentials, personal data, and approval integrity. Passwords must be hashed; server-side authorization must derive identity from authenticated session; roles must be enforced server-side; database file must not be publicly exposed. |
| 2 | Reliability | 9 (High) | Consistent enforcement of all business rules across every request, regardless of user, role, or sequence. Includes transactional integrity for approval records and validated data entry. Acceptance explicitly fails if any business rule can be bypassed. |
| 3 | Usability | 7 (High) | The interface must enable employees and managers to complete the full request lifecycle without training beyond the README. UI must show only state-valid actions; labels must use plain business language; desktop viewports (1024px+) must render correctly. |
| 4 | Compatibility | 7 (High) | The application must run from source code on a reviewer's local machine using only the documented prerequisites and setup steps, with no Docker, Azure deployment, or CI/CD pipeline required. |
| 5 | Maintainability | 5 (Medium) | The codebase must implement a reduced Onion Architecture (Domain, Application, Infrastructure, API, Web) with no MediatR, CQRS, or generic repository patterns. A complete README must support independent setup and review. |
| 6 | Compliance | 5 (Medium) | Basic data protection practices appropriate for an internal MVP storing employee identity and absence data. Formal regulatory certifications (SOC 2, GDPR) are explicitly deferred. |
| 7 | Performance | 2 (Low) | No formal SLA or throughput targets defined. The application must remain responsive during single-user or small-group review workflows on local hardware without observable blocking delays. |
| 8 | Availability | 2 (Low) | No uptime or RTO commitments. During the MVP review window, blocking defects in the core workflow must be remediated. SQLite file location and reset instructions must be documented in the README. |

---

## 2. Utility Tree

> ⚠️ **ARCHITECT ACTION REQUIRED — Complete this section before proceeding.**
>
> For each quality attribute, one or more concrete measurable scenarios are pre-populated based on the NFR. Add or modify scenarios as needed.
> - `NFR Priority` is pre-filled from Section 1 — **do not modify**.
> - `Quality Percentage`: assign a weight percentage to each attribute. All values across all attributes must sum to exactly **100%**.
> - `Scenario Percentage`: within each attribute, assign a weight percentage to each scenario. Values for each attribute must sum to exactly **100%**.
> - Fill in all `[COMPLETAR]` fields with concrete, measurable values.

| Attribute | NFR Priority | Scenario ID | Stimulus | Context | Expected Response | Measure | Quality Percentage | Scenario Percentage |
|-----------|--------------|-------------|----------|---------|-------------------|---------|-------------------|---------------------|
| Security | 10 | SC-01 | A user attempts to register or log in, and their password must be stored or verified | Application is running locally; user submits credentials via the registration or login form | The system stores only the cryptographic hash; the raw password is never written to the database, logs, or any API response | Direct inspection of SQLite password column shows no readable plain-text values after registration; no password field appears in any log file | [COMPLETAR] | [COMPLETAR] |
| Security | 10 | SC-02 | A user crafts an API request with a spoofed employeeId or approverId field in the request body to assume another identity | Application is running; attacker has a valid authenticated session for their own account | The API ignores the supplied identifier and derives the acting user exclusively from the authenticated session or token | Manual API test: crafted request body with foreign employeeId is processed using the authenticated user's identity; approval record stores the session-authenticated manager, not the spoofed value | [COMPLETAR] | [COMPLETAR] |
| Security | 10 | SC-03 | A user with the Employee role calls the approve or reject endpoint | Application is running; Employee has a valid authenticated session | The API returns HTTP 403 Forbidden; the request state does not change | Manual API test: Employee token on approve/reject endpoint returns 403; no state change or approval record is created | [COMPLETAR] | [COMPLETAR] |
| Security | 10 | SC-04 | A user attempts to access another employee's request data through any available endpoint | Application is running; both accounts are registered; requester has a valid session | The API returns an unauthorized or not-found response; no cross-user data is returned | Manual API test: Employee A's token on request list and detail endpoints returns only Employee A's data; Employee B's records are not visible | [COMPLETAR] | [COMPLETAR] |
| Security | 10 | SC-05 | The SQLite database file is targeted via a direct HTTP request to the running web server or API | Application is running; attacker knows or guesses the database file path | The server does not serve the database file as a static asset; the file is not committed to source control with real credentials | HTTP GET to the database file path returns 404; .gitignore excludes the file; seeded credentials in committed code are placeholder values only | [COMPLETAR] | [COMPLETAR] |
| Reliability | 9 | SC-06 | A user submits an absence request with an end date earlier than the start date, or a start date in the past | Any authenticated Employee; application is running | The API returns a descriptive validation error; no request is created or updated | Manual API test: invalid date pair returns HTTP 400 with a message identifying the violated rule; the database contains no new record for that submission | [COMPLETAR] | [COMPLETAR] |
| Reliability | 9 | SC-07 | A user attempts a state transition that is not permitted for the current request state (e.g., editing a Submitted request, approving an already-Approved request) | Any authenticated user; application is running; request is in a non-eligible state | The API returns a descriptive error identifying the current state and the rejected action; the request state does not change | Manual API test for each invalid transition: response identifies current state and disallowed action; database record reflects no state change | [COMPLETAR] | [COMPLETAR] |
| Reliability | 9 | SC-08 | A manager approves or rejects a request and a database write failure occurs mid-operation | Application is running; approval service begins the transaction | The system rolls back the entire operation; no approval record is persisted and the request state is not changed; the client receives an accurate error response | Code review confirms single-transaction scope covering both state update and Approval record creation; simulated failure leaves no orphaned Approved state without a corresponding Approval record | [COMPLETAR] | [COMPLETAR] |
| Usability | 7 | SC-09 | A first-time reviewer attempts to complete the full request lifecycle (register → login → create → submit → approve/reject → view result) using only the README as a reference | Reviewer has no prior knowledge of VacaFlow; application is running locally; README is the only documentation used | The reviewer completes every step without requiring clarification beyond the README; all action buttons, labels, and error messages use plain business language matching SI-001 terminology | First-time walkthrough succeeds without external assistance; reviewer confirms no step required interpretation beyond README instructions | [COMPLETAR] | [COMPLETAR] |
| Usability | 7 | SC-10 | An Employee views a request in each of the five lifecycle states (Draft, Submitted, Approved, Rejected, Cancelled) | Employee is authenticated; at least one request exists in each state | The UI renders only the valid actions for each state as defined in the state-action matrix; no invalid action button is visible or accessible in any state | Manual UI walkthrough confirms: Draft shows Edit/Submit/Cancel; Submitted shows Cancel; Approved/Rejected/Cancelled show no action buttons; no hidden HTML element exposes suppressed actions | [COMPLETAR] | [COMPLETAR] |
| Usability | 7 | SC-11 | A reviewer opens the application at 1280×800 and 1920×1080 viewport resolutions | Desktop browser; latest version; both resolutions tested | All screens render without horizontal scroll; all interactive elements (forms, buttons, navigation) are accessible and usable at both viewport sizes | Manual visual review at both resolutions confirms no horizontal overflow; all interactive elements are reachable without scrolling horizontally | [COMPLETAR] | [COMPLETAR] |
| Compatibility | 7 | SC-12 | A reviewer performs a fresh clone of the repository and follows the README setup instructions on a machine that has not previously run VacaFlow | Reviewer's machine has the documented runtime versions (Node.js, .NET SDK) installed; no prior application state exists | The reviewer completes all setup steps (clone, restore dependencies, initialize database, start API, start web) without errors; the application is accessible in the browser and the full workflow can be executed | Fresh-clone setup walkthrough: each step in the README acceptance checklist completes successfully; application starts on the documented local ports; full workflow is executable | [COMPLETAR] | [COMPLETAR] |
| Maintainability | 5 | SC-13 | An independent reviewer inspects the repository structure and solution file to evaluate architectural compliance | Reviewer has .NET and JavaScript knowledge; source code is available | The reviewer can identify the five architectural layers (Domain, Application, Infrastructure, API, Web) from folder or project naming alone without additional documentation; no MediatR, CQRS, or generic repository NuGet packages are present | Code review: layer boundaries are identifiable by name; solution file contains no MediatR, CQRS, event bus, or generic repository packages; dependency direction flows inward only | [COMPLETAR] | [COMPLETAR] |
| Maintainability | 5 | SC-14 | A new developer reads the README to set up the project and understand its scope | Developer has not previously encountered VacaFlow; README is the primary reference | The README covers all required sections: prerequisites, step-by-step setup, seeded account credentials, endpoint summary, scope limitations, deferred backlog items, and SQLite file location and reset instructions | README content checklist review confirms all required sections are present and complete; a first-time setup attempt using only the README succeeds | [COMPLETAR] | [COMPLETAR] |
| Compliance | 5 | SC-15 | A reviewer inspects the README and system behavior to confirm MVP data protection practices | Application is running; README is available | The README acknowledges that the application stores basic employee identity and absence data and that formal compliance requirements must be revisited before any production use; no formal SOC 2, GDPR, or HIPAA certification is claimed | README review confirms acknowledgment text is present; all NFR-SEC-001 through NFR-SEC-005 pass their respective verification methods | [COMPLETAR] | [COMPLETAR] |
| Performance | 2 | SC-16 | A single reviewer or a small simultaneous group completes the full request lifecycle during the MVP review window | Local execution; SQLite database with seed data and a small number of test requests; standard development machine | All user interactions (page navigation, API calls, database reads and writes) complete without observable blocking delays; no browser or HTTP client timeout fires during normal use | Manual end-to-end walkthrough by reviewer confirms no perceivable loading hang on any screen; all API calls return before default timeout fires | [COMPLETAR] | [COMPLETAR] |
| Availability | 2 | SC-17 | A reviewer encounters a blocking defect that prevents completing any step of the core review workflow (register, login, create, submit, approve, reject, view result) | MVP review window is active; application is running locally | Blocking defects are identified, triaged, and remediated before the acceptance review concludes; cosmetic issues may be deferred | End-to-end walkthrough by reviewer completes all core workflow steps without any blocking defect; defect triage log confirms no open blocking issues at acceptance | [COMPLETAR] | [COMPLETAR] |

> 📊 **Quality Tree** — *Generated automatically by the agent after "documento listo"*
> The diagram below will appear here once the agent validates and calculates the attribute and scenario weights.

---

## 3. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Solution Architect | | | *(utility tree approval)* |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | Yeuri Jessel Reyes (AI Assisted) | Initial generation — quality attributes extracted from NFR-001; utility tree pre-populated with scenarios; porcentaje weight method selected |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Solution Architect (PM_OVERRIDE — bypassed Solution Architect) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-20 19:07:33 UTC |

*— End of document —*
