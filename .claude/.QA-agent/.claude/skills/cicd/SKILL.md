---
name: cicd
description: Integrating the test suite into the delivery pipeline. Use when generating pipeline config from the contract, gating a Pull Request, processing a completed run, classifying failures, proposing a bug, scheduling nightly/synthetic runs, or orchestrating canary phases. Bridges arch-contract config to the actual CI platform (Azure DevOps, GitHub Actions, etc.).
---

# CI/CD

The canonical rules live in **[.claude/docs/reference/cicd.md](../../docs/reference/cicd.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Read `cicd.platform`, `cicd.pr_gates`, `cicd.branch_protection`, `cicd.environments`, `cicd.canary_config` and the schedules from `docs/qa-config.yaml`; generate pipeline files in the platform's format. Never inline secrets/URLs.
- On a PR, activate the **reviewer** lane on changed files. On a completed run, classify every failure (`script_failure`/`data_issue` → healing; `app_regression` → bug proposal; else manual review).
- Gate to HITL at **CP-5** before creating a bug, and **CP-CANARY** before advancing canary traffic. Auto-rollback on threshold breach fires with no delay.
- **Never create a bug without CP-5, never run reset/regression against production, keep synthetic runs read-only.**
