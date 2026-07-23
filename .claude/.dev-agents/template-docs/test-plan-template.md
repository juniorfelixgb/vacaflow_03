# Test Plan

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> QA_Orchestrator / `playwright-plan` skill may **add, remove, or rename sections** when clarity requires it; document deviations in §1.

## Document Information

- **Test Plan ID:** TP-[YYYY-MM-DD]-[Feature-Slug]
- **Feature / User Story:** [name + US ID]
- **Author:** QA_Orchestrator Agent
- **Created Date:** [YYYY-MM-DD]
- **Target Environment(s):** [local | dev | staging]
- **Test Type(s):** [E2E | integration | regression]

---

## 1. Scope

**In scope:**

- [Feature areas / user flows covered]

**Out of scope:**

- [Areas explicitly NOT tested in this plan]

**Notes on template usage:** [Standard | sections added/removed because…]

---

## 2. Test Strategy

- **Framework:** the project's E2E testing tool
- **Execution mode:** [headless | headed]
- **Browsers:** [chromium | webkit | firefox]
- **Parallelism:** [workers count]
- **Reporting:** [HTML reporter / CI artifact]

---

## 3. Preconditions & Test Data

### 3.1 Environment preconditions

- [Service running on …]
- [Database state: empty / seeded with X]
- [Feature flags enabled: …]

### 3.2 Test users / fixtures

| User / fixture  | Role / data       | Source / seed script |
| --------------- | ----------------- | -------------------- |
| `qa-admin@…`    | Compliance admin  | `tests/fixtures/…`   |
| `qa-employee@…` | Standard employee | `tests/fixtures/…`   |

### 3.3 Database setup

- [SQL / EF migration to apply, if any]
- [Seed data path]

---

## 4. Test Scenarios

> One scenario per acceptance criterion. Add error/edge/regression scenarios as needed.

### 4.1 Scenario: [Happy path name]

- **Maps to AC:** AC-001
- **Priority:** High
- **Tags:** `@smoke @feature-x`
- **Preconditions:** [from §3]
- **Steps:**
  1. Navigate to [URL/page]
  2. [User action]
  3. [User action]
- **Expected result:** [what should be visible / network call / state]
- **Assertions:**
  - [DOM assertion]
  - [Network/response assertion]
  - [State / DB assertion (if applicable)]
- **Cleanup:** [revert state]

### 4.2 Scenario: [Error path / validation]

- **Maps to AC:** AC-002
- [Same structure]

### 4.3 Scenario: [Edge case]

- [Same structure]

### 4.4 Regression scenarios

- [List existing flows that must keep working]

---

## 5. Risk-Based Coverage

| Risk area             | Likelihood | Impact | Test coverage      |
| --------------------- | ---------- | ------ | ------------------ |
| [e.g. permissions]    | M          | H      | scenarios 4.1, 4.5 |
| [e.g. data migration] | L          | H      | scenario 4.7       |

---

## 6. Non-Functional Checks (optional)

- **Accessibility:** [WCAG 2.1 AA — axe scan on key pages]
- **Performance:** [Page load < Xs, API < Yms]
- **Visual regression:** [snapshots updated for …]

---

## 7. Exit Criteria

- [ ] All High-priority scenarios pass
- [ ] No Blocking defects open
- [ ] Coverage matrix (§4) 100% mapped to ACs
- [ ] CI green on target branch

---

## 8. Deliverables

- Test spec files: `[e2e-tests-dir]/<feature>.[test-spec-ext]`
- Fixtures: `tests/fixtures/<feature>/…`
- Test run report: [path / CI link]

---

## 9. References

- User Story: [work-tracking platform link]
- Implementation Plan: [path]
- Existing test suites touched: [paths]
