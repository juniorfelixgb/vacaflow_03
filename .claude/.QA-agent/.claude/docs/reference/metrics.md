# Metrics & Reporting — Canonical Standard

> **Single source of truth** for aggregating quality data across the system,
> governing the report configuration, feeding the quality dashboard, detecting
> threshold breaches, and producing the sprint summary. **Read-only** — never
> modifies test code or the contract. Stack-neutral: thresholds and reporter come
> from `docs/qa-config.yaml`.

## When it runs

After every pipeline run completes, at sprint close, and on demand for a quality
snapshot.

## Config it reads (`docs/qa-config.yaml`)

- `agents_config.mutation_score_threshold` — alert when score drops below
- `agents_config.flakiness_threshold_pct` — alert (and trigger healing) when exceeded
- `structure.reporter` — the report target it governs (e.g. Allure)
- `meta.project_id` — dashboard tag prefix

## What it does

- **Aggregate** the artifacts produced by the other lanes (reviewer, security,
  CI/CD, healing) into one run report.
- **Govern** the report configuration so every run produces a consistent,
  annotated report in the configured reporter.
- **Feed the dashboard** with coverage, pass rate, flakiness, mutation score,
  heal rate, and security trend.
- **Detect breaches** — when flakiness exceeds `flakiness_threshold_pct`, signal
  the healing lane; when mutation score or coverage drops below target, flag it.
- **Trend across runs** — maintain history so degradation surfaces early.
- **Sprint summary** — at sprint close, summarize coverage delta, defects found,
  flakiness, and outstanding risk for the PBIs in scope.

## Guardrails

- **Read and aggregate only** — never modify test code, fixtures, or the contract.
- Every alert references the threshold it breached and the source artifact.
- A breach signal is advisory to the orchestrator; it never directly mutates state
  in other lanes.
