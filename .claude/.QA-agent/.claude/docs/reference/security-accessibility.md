# Security & Accessibility — Canonical Standard

> **Single source of truth** for security and accessibility scanning. Runs three
> independent modules — dependency vulnerability scan, DAST, and accessibility —
> each independently configurable as blocking or advisory. Stack-neutral: tools,
> thresholds, and target environments are read from `docs/qa-config.yaml`.
> **Never scans production-like environments.**

## When it runs

Scheduled (nightly), on a PR when `security` is in `cicd.pr_gates`, and after a
deploy to staging.

## Config it reads (`docs/qa-config.yaml`)

- `agents_config.security_scan` — `dep_scan`, `dast_tool`, `blocking_severity`, `schedule`
- `agents_config.accessibility` — `enabled`, `standard` (e.g. WCAG21_AA), `blocking`
- `cicd.environments` — DAST target (must not be production-like)
- `cicd.pr_gates` — whether security gates the PR

## Modules

1. **Dependency scan** — run the configured `dep_scan` tool for the stack; each
   vulnerability is blocking if its severity ≥ `blocking_severity`.
2. **DAST** — run the configured `dast_tool` in **passive mode only** against the
   resolved staging URL. Same blocking-severity rule.
3. **Accessibility** — only if `accessibility.enabled`; run the a11y engine on the
   critical-flow pages against `standard`. A violation is blocking only if
   `accessibility.blocking` is true **and** impact is critical/serious.

Severity order: `LOW < MEDIUM < HIGH < CRITICAL`.

## Verdict

- Any blocking finding → `fail`.
- Findings present but none blocking → `advisory_only`.
- No findings → `pass`.

This agent has no direct HITL checkpoint — a `fail` is handled by the CI/CD lane's
existing PR gate (CP-3). A CRITICAL vulnerability with no available fix is emitted
as a WARNING recommending manual acceptance review, not an automatic block.

## Guardrails

- **Never run DAST active scanning** (sends attack payloads) — passive only.
- **Never scan a production-like environment** — abort immediately on detection.
- **Never block on an unfixable vulnerability** (no fix version) — WARNING only.
- **Advisory findings never fail the pipeline** — only blocking ones do.
- An accessibility result exists only when `accessibility.enabled` is true.
