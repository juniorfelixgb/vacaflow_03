# Code Review Report

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Reviewer agent may **add, remove, or rename sections** to keep the report clear; any deviation should be justified in §1 _Reviewer notes on template usage_.

## Document Information

- **Review ID:** CR-[YYYY-MM-DD]-[Feature-Slug]
- **Reviewer:** Reviewer Agent (or human reviewer name)
- **Review Date:** [YYYY-MM-DD]
- **Target:**
  - **Branch / PR URL:** [branch name or PR link]
  - **Commit Range:** [start-sha]..[end-sha]
  - **Implementation Plan:** [docs/implementation-plans/IP-...md]
  - **User Story:** [US ID on the work-tracking platform]
- **Overall Score:** **[X]/10**
- **Verdict:** [APPROVE | APPROVE_WITH_MINOR_FIXES | REQUEST_CHANGES | BLOCK]

---

## 1. Executive Summary

[2–4 sentences: what was reviewed, headline finding, and recommended action.]

**Reviewer notes on template usage:** [If sections were added/removed/renamed, explain why here. Otherwise: "Standard template, no deviations".]

---

## 2. Scoring Breakdown

| Dimension                  | Score (1–10) | Rationale                                 |
| -------------------------- | ------------ | ----------------------------------------- |
| Correctness                | [X]          | [Does it implement the plan correctly?]   |
| Architecture & Design      | [X]          | [Clean Arch boundaries, SOLID, DRY]       |
| Security (OWASP Top 10)    | [X]          | [Input validation, secrets, authZ, etc.]  |
| Testing & Coverage         | [X]          | [Unit/integration coverage, hermeticity]  |
| Readability & Naming       | [X]          | [Clarity, consistency, comments quality]  |
| Performance                | [X]          | [N+1s, allocations, async correctness]    |
| Observability              | [X]          | [`ILogger<T>`, structured logging]        |
| Documentation              | [X]          | [README, ADR, code comments where due]    |
| **Overall (weighted avg)** | **[X]**      |                                           |

---

## 3. Findings

### 3.1 Blocking Issues (must fix before merge)

- **B-1:** [Short title]
  - **File:** [path/to/file#Lxx-Lyy]
  - **Problem:** [description]
  - **Suggested fix:** [concrete action]
  - **OWASP / Rule reference:** [if applicable]

### 3.2 Major Issues (fix before merge, room for discussion)

- **M-1:** [Short title] — [File], [Problem], [Suggested fix]

### 3.3 Minor Issues (nice-to-have / follow-up PR)

- **m-1:** [Short title] — [File], [Problem], [Suggested fix]

### 3.4 Positive Observations

- [Things done well — call them out so they get repeated.]

---

## 4. Acceptance Criteria Coverage

| AC ID  | Description     | Implemented? | Test exists? | Notes |
| ------ | --------------- | ------------ | ------------ | ----- |
| AC-001 | [scenario]      | ✅ / ❌      | ✅ / ❌      |       |
| AC-002 | [scenario]      | ✅ / ❌      | ✅ / ❌      |       |

---

## 5. Test Coverage Verification

- **Unit tests changed/added:** [count]
- **Coverage on changed files:** [X%] (target ≥80%)
- **Hermetic?** [yes/no — flag any tests that touch network, filesystem, clock, randomness without isolation]
- **Failing tests:** [none | list]

---

## 6. Security Review (OWASP Top 10 quick pass)

| Risk                                | Status | Notes |
| ----------------------------------- | ------ | ----- |
| A01 Broken Access Control           | ✅/⚠️/❌ |       |
| A02 Cryptographic Failures          | ✅/⚠️/❌ |       |
| A03 Injection (SQL/Command/etc.)    | ✅/⚠️/❌ |       |
| A04 Insecure Design                 | ✅/⚠️/❌ |       |
| A05 Security Misconfiguration       | ✅/⚠️/❌ |       |
| A06 Vulnerable & Outdated Components| ✅/⚠️/❌ |       |
| A07 Identification & AuthN Failures | ✅/⚠️/❌ |       |
| A08 Software & Data Integrity       | ✅/⚠️/❌ |       |
| A09 Logging & Monitoring Failures   | ✅/⚠️/❌ |       |
| A10 Server-Side Request Forgery     | ✅/⚠️/❌ |       |

---

## 7. Recommendation

- [ ] **APPROVE** — merge as-is
- [ ] **APPROVE_WITH_MINOR_FIXES** — merge after minor items addressed
- [ ] **REQUEST_CHANGES** — fix major items and re-review
- [ ] **BLOCK** — blocking issues must be resolved before any merge

**Next action owner:** [Coder / BSA / human]

---

## 8. References

- Implementation plan: [path]
- User story: [work-tracking platform link]
- BRD: [path]
- Related ADRs: [paths]
