---
description: Generate the full SDLC QA documentation set (Decisions Log → Test Strategy → Test Plan → Test Cases → UAT Plan → Test Report) from upstream project docs — scored-option strategy first, then one human gate per artifact
argument-hint: "[path to project documentation root | empty to discover from repo]"
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(git status:*), Bash(git log:*)
---

# QA Docs — SDLC Documentation Pipeline

You orchestrate the generation of the project's SDLC QA documentation. You **route and
gate** — the rules for each artifact live in `.claude/docs/reference/` and are surfaced by
skills, never restated here. All output is in **English**. Every claim cites its source
(`{DOC-ID} §{section}` or `QD-NN`/`EV-NN`); gaps become explicit `OPEN QUESTION` / `NO DATA`
markers, never invented content.

Docs root (optional argument): $ARGUMENTS. If empty, discover it from the repo. Write
artifacts to the project's QA docs location — default `docs/`, or the QA-owned folder
inside an SDLC documentation tree (folders matching `^\d{2}-`) when one is detected: the
numbered folder whose name signals quality/testing/QA ownership (e.g. `08-quality`,
`08-testing`). If none matches, ask the user which numbered folder is QA's.

This pipeline is the **documentation** counterpart to the automation lanes. It is
technology-agnostic and assumes the automation-first / AI-SDET operating model of
`qa-testing-strategy-architect`: every verification is designed as an automated check;
manual execution is a justified exception carrying an automation backlog item.

## Workflow

### 1. DISCOVER

Inventory the upstream documentation using the extraction sources in
[testing-strategy-intake-checklist.md](../docs/reference/testing-strategy-intake-checklist.md).
Be agnostic: any subset of artifacts may exist, under any naming. If little or no
documentation exists, fall back to the README/codebase (`cite as repo:{path}`) and finally
to asking the user. Present a short inventory table (doc found → what it feeds) including
the gaps, then continue — missing sources are recorded, never a blocker.

### 2. DECISIONS — intake + decisions log

Run Phases 1–3 of `qa-testing-strategy-architect` (INTAKE → ANALYSIS → OPTIONS): extract
context, classify risk, and present **three scored architecture options** with the `/60`
scorecard and a ranked recommendation. Record every decision in `qa-decisions.md` (QD-001)
per [qa-decisions-log.md](../docs/reference/qa-decisions-log.md) — the Phase-3 scorecard is
`EV-01`. Stop at the option **APPROVAL GATE** and wait for the user's explicit choice.

If `qa-decisions.md` already exists, present its decision table and ask whether to **reuse**
it or **re-decide** — do not silently overwrite it.

### 3–7. GENERATE — one artifact at a time, gated

Generate in this order; each artifact feeds the next. Present the verification gate and
**wait for the decision** before starting the next step:

| Step | Skill / reference | Output | Gate |
|------|-------------------|--------|------|
| 3 | `qa-testing-strategy-architect` → [testing-strategy-template.md](../docs/reference/testing-strategy-template.md) | `test-strategy.md` | CP-STRATEGY |
| 4 | `qa-testing-strategy-architect` → [test-plan-template.md](../docs/reference/test-plan-template.md) | `test-plan.md` | CP-PLAN |
| 5 | `manual-test-design` → [manual-test-design.md](../docs/reference/manual-test-design.md) | `test-cases/{module}.md` (one per module) | CP-CASES |
| 6 | `qa-testing-strategy-architect` → [uat-plan-template.md](../docs/reference/uat-plan-template.md) | `uat-plan.md` | CP-UAT |
| 7 | `qa-testing-strategy-architect` → [test-report-template.md](../docs/reference/test-report-template.md) | `test-report.md` (real data or NO DATA shell) | CP-REPORT |

Each gate uses the **document verification gate** in
[output-style.md](../docs/reference/output-style.md): a content digest with inline
citations, the agent self-checks, the downstream impact, a clickable link to the file, and
the `SHOW FULL` option. The human must be able to **verify, not just confirm**.

Gate handling: **APPROVE** → set the artifact's `Status: Approved`, record who/when at its
sign-off section, continue. **EDIT: notes** → revise and re-present the same gate showing
**only the diff** (sections changed, before → after). **REJECT: why** → stop the pipeline
and summarize what was produced and why it stopped.

### 8. SUMMARY

After CP-REPORT, emit the END-OF-RUN SUMMARY (per output-style.md): every generated file
with its document ID and status, the open questions remaining across artifacts, and the
recommended next actions (resolve open questions, schedule UAT, fill the Test Report after
the first execution cycle, hand the approved option to `/qa-setup` Part B if adopting the
automation lanes).

## Boundaries

- This command **routes and gates** — it never embeds rules. Strategy/plan/UAT/report shape
  lives in the reference docs; test-case design lives in `manual-test-design`; the decisions
  format lives in `qa-decisions-log.md`.
- The Test Report here is the **document-level** summary (manual + UAT). When the automation
  lanes are configured, `/qa-release-report` aggregates the run artifacts — link to it.
- Never write `docs/qa-config.yaml` — that is `/qa-setup` (CP-1).
- A single artifact can be (re)generated standalone by invoking its skill directly instead
  of the whole pipeline.
