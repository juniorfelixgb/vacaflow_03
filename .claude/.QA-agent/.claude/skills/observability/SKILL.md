---
name: observability
description: Shift-right monitoring that closes the feedback loop. Use only when shift-right is enabled and CP-6 approved — to monitor production health, evaluate canary rollback thresholds during a rollout, give health context to synthetic runs, or turn a production anomaly into a new test-coverage request. Read-only against production.
allowed-tools: Read, Grep, Glob, Bash
---

# Observability (Shift-right)

The canonical rules live in **[.claude/docs/reference/observability.md](../../docs/reference/observability.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Run **only** if `observability` is enabled, a shift-right feature is active (`canary_config` or `synthetic_monitoring`), and CP-6 is in the contract `hitl_log`. Otherwise skip cleanly — never fail.
- Read `cicd.canary_config`, `synthetic_monitoring`, `production_feedback`, and `agents_config.observability_provider` from `docs/qa-config.yaml`. Never hardcode the provider.
- Evaluate canary metrics vs rollback thresholds and feed advance/hold/rollback to the **cicd** lane; emit `production_feedback` events to the **coverage-matrix** lane to close coverage gaps.
- **Read-only against production.** Every feedback event names the metric, threshold, and affected flow.
