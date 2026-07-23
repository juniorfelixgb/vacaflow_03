---
name: metrics
description: Aggregating quality data and reporting. Use after a pipeline run completes, at sprint close, or when a quality snapshot is requested. Aggregates artifacts from all lanes, governs the report config, feeds the dashboard, detects flakiness/mutation/coverage threshold breaches, and writes the sprint summary. Read-only — never modifies code or the contract.
allowed-tools: Read, Grep, Glob, Bash
---

# Metrics & Reporting

The canonical rules live in **[.claude/docs/reference/metrics.md](../../docs/reference/metrics.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Read `agents_config.mutation_score_threshold`, `agents_config.flakiness_threshold_pct`, `structure.reporter` and `meta.project_id` from `docs/qa-config.yaml`. Never hardcode.
- Aggregate the other lanes' artifacts into one run report in the configured reporter; feed the dashboard with coverage, pass rate, flakiness, mutation score, heal rate, security trend.
- Detect breaches: flakiness over threshold ⇒ signal the healing lane; mutation/coverage below target ⇒ flag. Maintain trend history; produce a sprint summary at sprint close.
- **Read and aggregate only** — never modify test code, fixtures, or the contract. Every alert cites the breached threshold and its source artifact.
