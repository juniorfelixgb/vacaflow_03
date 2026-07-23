---
name: security-accessibility
description: Running security and accessibility scans against a non-production environment. Use on nightly schedules, on PRs when security is a gate, or after a staging deploy. Runs dependency vulnerability scan, passive DAST, and WCAG accessibility checks; classifies by severity and gates on the blocking threshold. Never scans production.
---

# Security & Accessibility

The canonical rules live in **[.claude/docs/reference/security-accessibility.md](../../docs/reference/security-accessibility.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Read `agents_config.security_scan` and `agents_config.accessibility` (tools, `blocking_severity`, `standard`, `blocking`) plus `cicd.environments` from `docs/qa-config.yaml`. Never hardcode tools or thresholds.
- Run the three modules: dependency scan, **passive-only** DAST against staging, and a11y on critical pages (only if enabled). A finding blocks when severity ≥ `blocking_severity`.
- Verdict: any blocking finding ⇒ `fail`; findings but none blocking ⇒ `advisory_only`; none ⇒ `pass`. A `fail` is gated by CI/CD's PR gate (CP-3).
- **Never run active DAST, never scan a production-like environment, never block on an unfixable vulnerability** (WARNING only).
