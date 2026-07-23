# Observability (Shift-right) — Canonical Standard

> **Single source of truth** for the shift-right loop: monitoring production
> health, evaluating canary thresholds during rollout, providing health context
> to synthetic runs, and turning production anomalies into new test coverage.
> Stack-neutral: provider, thresholds, and flows are read from `docs/qa-config.yaml`.
> **Only active when shift-right is enabled and CP-6 is approved.**

## Activation gate

Run **only** when `observability` is in `agents_config.enabled_agents` AND a
shift-right feature is active (`cicd.canary_config` or `synthetic_monitoring`)
AND CP-6 is recorded in the contract's `hitl_log`. Otherwise skip cleanly.

## Config it reads (`docs/qa-config.yaml`)

- `cicd.canary_config` — rollback thresholds to evaluate during a rollout
- `synthetic_monitoring` — target environment and flows
- `production_feedback` — incident sources and trigger config
- `agents_config.observability_provider` — the monitoring platform to query

## What it does

- **Monitor** production health metrics from the configured provider.
- **Evaluate canary** — during a rollout, compare live metrics to the
  `canary_config` rollback thresholds and feed the advance/hold/rollback decision
  back to the CI/CD lane.
- **Health context** — give synthetic monitoring runs the current production
  health picture so flapping flows aren't misread.
- **Close the loop** — when a metric anomaly indicates an application issue not
  covered by existing tests, emit a `production_feedback` event that routes to the
  **test-design / coverage-matrix** lane to create the missing coverage.

## Guardrails

- **Read-only against production** — observe and report; never mutate production.
- **Skip (do not fail) when shift-right is inactive or CP-6 is missing.**
- Every emitted feedback event names the metric, the threshold, and the affected
  flow so the coverage lane can act on it.
