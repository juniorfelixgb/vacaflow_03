# Bug Report: [Short descriptive title]

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Bsa may **add, remove, or rename sections** to keep the report clear; document deviations under §1.

## Metadata

- **Bug ID:** Bug-[YYYY-MM-DD]-[Slug]
- **Reported by:** [name / agent]
- **Reported date:** [YYYY-MM-DD]
- **Severity:** [Critical | High | Medium | Low]
- **Priority:** [P0 | P1 | P2 | P3]
- **Environment:** [prod | staging | dev]
- **Component / area:** [API | Application | Domain | Infrastructure | web | FileProcessing | IsolatedFunctions | DB]
- **Affected versions / builds:** [version or commit SHA]
- **Linked work-tracking platform work item:** [ID]

---

## 1. Summary

[1–3 sentences. What is broken, who is impacted, headline business effect.]

**Notes on template usage:** [Standard | deviations…]

---

## 2. Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Pre-conditions / data setup:** [e.g. "user X has role Y, report Z exists in compliance region W"]

**Reproducibility:** [Always | Intermittent (X% of attempts) | Once]

---

## 3. Expected vs Actual Behavior

| Aspect | Expected           | Actual                |
| ------ | ------------------ | --------------------- |
| UI     | [what should show] | [what actually shows] |
| API    | [HTTP 2xx, body…]  | [HTTP 5xx, body…]     |
| DB     | [state]            | [state]               |

---

## 4. Evidence

- **Screenshots / videos:** [paths or links]
- **Logs:**
  ```text
  [Excerpt — Application Insights / API logs / browser console]
  ```
- **Network traces / HAR:** [path]
- **Database snapshot / queries run:**
  ```sql
  -- read-only queries used to confirm the issue
  ```

---

## 5. Impact

- **User impact:** [who, how many, how often]
- **Business impact:** [revenue, compliance, SLA, etc.]
- **Workaround available?** [yes/no — describe]

---

## 6. Root-Cause Analysis (fill once known)

### 6.1 Hypothesis

[Initial theory]

### 6.2 Confirmed root cause

[Verified cause + reference to code / commit / config that introduced it]

### 6.3 Why was it not caught earlier?

[Missing test, missing review, infra gap, etc. — feeds into preventive action]

---

## 7. Fix Proposal

- **Approach:** [short description]
- **Files likely affected:**
  - [path 1]
  - [path 2]
- **Risk of regression:** [Low | Medium | High] — [why]
- **Test additions required:**
  - [unit / integration / e2e test description]

---

## 8. Acceptance Criteria for the Fix

- [ ] Reproduction steps no longer reproduce the bug
- [ ] New test covers the failure mode
- [ ] No regression in [related area]
- [ ] [Other domain-specific criterion]

---

## 9. Preventive Actions (optional)

- [Process / tooling / monitoring change to avoid recurrence]

---

## 10. References

- Related BRDs / User Stories: [paths]
- Related ADRs: [paths]
- Linked PRs / commits: [links]
