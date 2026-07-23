# CI/CD — Canonical Standard

> **Single source of truth** for integrating the test suite into the delivery
> pipeline: generating pipeline config from the contract, gating Pull Requests,
> processing run results, classifying failures, proposing bugs, and (when enabled)
> orchestrating canary phases. Stack-neutral: platform, gates, environments and
> schedules are read from `docs/qa-config.yaml` — never hardcoded.

## Triggers

| Trigger | Action |
|---------|--------|
| Contract approved | Generate pipeline files for the configured platform |
| Pull Request opened | Activate the **reviewer** lane on the changed files |
| Run completed | Process results, classify failures, route them |
| Scheduled (nightly / synthetic / security) | Launch the matching suite |
| Canary phase | Evaluate thresholds, advance / hold / rollback |

## Config it reads

`cicd.platform` (pipeline format), `cicd.pr_gates`, `cicd.branch_protection`,
`cicd.environments` (names + URLs), `cicd.canary_config`,
`test_strategy.regression_schedule`, `test_strategy.smoke_max_minutes`,
`synthetic_monitoring` (if enabled). All from `docs/qa-config.yaml`.

## Pipeline generation

Generate one file per suite the contract calls for (smoke on every PR, scheduled
regression, nightly, and synthetic only when shift-right is active). Emit the
format that matches `cicd.platform` (e.g. Azure DevOps YAML, GitHub Actions).
Secrets and URLs come from pipeline secrets / `.env`, never inlined.

## Failure classification

For each failure, classify and route:

| Class | Signal | Route to |
|-------|--------|----------|
| `script_failure` | locator/selector error, script/compile error | healing lane |
| `data_issue` | timeout with no backend calls | healing lane |
| `app_regression` | meaningful assertion failed (not selector/wait) | bug proposal (CP-5) |
| `environment_issue` | low-confidence / infra | manual review |

## HITL gates

- **CP-5 — bug creation.** When a failure is classified `app_regression`, build a
  bug proposal (title, severity, repro steps, system info, attachments,
  classification rationale) and gate to HITL. Only create the bug after approval.
  Timeout: shorter for critical severity, longer otherwise.
- **CP-CANARY — canary advance.** When a phase requires sign-off and the bake
  window passed with metrics within thresholds, gate to HITL before advancing
  traffic. Phases not requiring sign-off auto-advance when metrics pass.

## Guardrails

- **Never create a bug without CP-5 approval.**
- **Auto-rollback fires immediately on a threshold breach** — no HITL delay.
- **Never advance canary past the first significant traffic step without at least
  one HITL-gated phase.**
- **Never run a regression/reset suite against production.**
- **Synthetic runs are read-only** — abort and alert if a synthetic flow performs
  a write.
- Every processed failure must carry a classification; `bug_proposals` only exist
  when an `app_regression` was found.
