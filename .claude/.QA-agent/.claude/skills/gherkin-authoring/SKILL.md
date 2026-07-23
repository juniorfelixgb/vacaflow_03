---
name: gherkin-authoring
description: Writing or optimizing Gherkin .feature files and playwright-bdd step definitions for lanes with style bdd-gherkin (the lane's feature_dir and step_dir). Use for scenario authoring, feature-file headers and coverage matrices, business-language step phrasing, negative-scenario decisions, the createBdd() step pattern, or "No step definition found" / Undefined step issues.
---

# Gherkin & Step Definition Authoring

Two canonical references back this skill:
- Scenario / feature rules → **[.claude/docs/reference/gherkin-standards.md](../../docs/reference/gherkin-standards.md)**
- Step code rules → **[.claude/docs/reference/step-definition-standards.md](../../docs/reference/step-definition-standards.md)**

Read them and apply them — do not restate or invent rules here.

How to apply in this repo:
- One scenario per AC, numbered to match (`Scenario: 1.1 - ...`); mandatory feature header with coverage matrix; `@{module}` + `@smoke` tags; business language only (no selectors/waits/API in steps).
- **Detect the framework** from `automation.bdd_framework` (`playwright-bdd` here) and use the matching pattern — never mix. Reuse existing steps (grep first); `expect()` only in `Then`.
- Use shared page objects ([page-object-authoring]) and [locator-strategy]. Run `bddgen` after writing; `No step definition` is a **MISS** failure ([failure-healing]).
