---
name: implementation-plan-generator
version: '2.0.0'
last_updated: '2026-05-13'
inherits: ../../AGENTS.md
description: >
  Generates a deterministic, full-stack (backend + frontend) implementation
  plan from an existing analysis document under `docs/analysis/`. Owned and
  invoked by the BSA agent. Produces a single Markdown file in
  `docs/implementation-plans/` following a strict 12-section structure that
  any developer or Copilot agent can execute without taking additional design
  decisions.
---

# Implementation Plan Generator Skill

> **Owner agent:** `Bsa` (Business Systems Analyst).
> **Purpose:** Convert an analysis document into a precise, executable, full-stack implementation plan.
> **One skill. One deterministic output. Backend + Frontend covered.**

---

## Inputs

| Name             | Required | Description                                                                 |
| ---------------- | -------- | --------------------------------------------------------------------------- |
| `analysis_path`  | ✅       | Relative path to the source analysis Markdown (e.g. `docs/analysis/foo.md`) |
| `ticket_id`      | optional | Work-tracking platform work item / user story ID to include in metadata     |
| `feedback_level` | optional | `full` \| `limited` \| `minimal` (default: `limited`)                       |
| `execution_mode` | optional | `unattended` \| `supervised` \| `semi` (default: `semi`)                    |

If `analysis_path` is missing → stop and ask the user for it. Do not invent one.

---

## Output

A single Markdown file at:

```
docs/implementation-plans/IP-<YYYY-MM-DD>-<slug-kebab-case>.md
```

- `<YYYY-MM-DD>` MUST come from a real terminal call to:
  `Get-Date -AsUTC -Format 'yyyy-MM-dd'`
  Never invent or estimate the date.
- `<slug-kebab-case>` is derived from the analysis document title.

---

## Step 0 — Skill Identification

When the BSA agent invokes this skill, prepend to its response:

```
🛠️  **SKILL: Implementation_Plan_Generator**
📄 **SOURCE: <analysis_path>**
---
```

Always address the user as **"My Lord"** (BSA addressing protocol applies).

---

## Step 1 — Mandatory Discovery (before writing the plan)

Execute these reads/calls in order. If any fails, stop and report.

1. **Read** the full analysis document at `analysis_path`.
2. **Read** the frontend project's dependency/manifest file to detect framework, build tooling, UI component library, etc.
3. **List** the top-level structure of the frontend source directory.
4. **Identify** the affected backend modules/projects from the analysis.
5. **Obtain** the current UTC date via terminal:
   ```powershell
   Get-Date -AsUTC -Format 'yyyy-MM-dd'
   ```
   Use the exact returned string. If the command is blocked, ask the user — never fabricate a date.

---

## Step 1.5 — UX/UI Requirements Audit (frontend features only)

**Trigger:** Run when the analysis document mentions UI features, pages, components, forms, dashboards, or any user-facing surface.
**Skip when:** The plan is purely backend, database-only, or infrastructure with no UI surface.

Read `.dev-agents/skills/UX_Booster/SKILL.md` in FULL and execute in `plan` mode:

```
mode:          plan
target:        <analysis_path>   ← same file read in Step 1
feature_name:  <derived from analysis title>
caller_agent:  Implementation_Plan_Generator
```

**Incorporate the results as follows:**

| UX_Booster output | Where it goes in the plan |
| --- | --- |
| `ux_requirements_block` | Append to **§8 Testing Strategy** under a new sub-heading `### UX/UI Validation` |
| `ux_gaps` (missing states) | Add one bullet per gap to **§11 Definition of Done** |
| Missing loading/error/empty states | Add explicit step to each frontend phase's **Validation** field |
| Accessibility requirement | Add to **§8 Testing Strategy** under `### Frontend` |
| Mobile/responsive requirement | Add to **§3 Scope → In scope (Frontend)** |
| Performance threshold (LCP/CLS) | Add to **§9 Configuration & Deployment** notes |

**Hard rule:** If UX_Booster returns any Critical or Major findings in `plan` mode, each one MUST appear as a risk row in **§10 Risks & Mitigations** (Probability: M, Impact: H, Stack: FE).

---

## Step 2 — Generate the Plan (strict structure)

> **Canonical structure source:** [`.dev-agents/template-docs/implementation-plan-template.md`](.dev-agents/template-docs/implementation-plan-template.md). The 12-section breakdown below mirrors that template and remains the binding shape for this skill's output.

Create the output file with EXACTLY these 12 sections, in this order:

### 1. Metadata
Plan ID · Real date · Source analysis (relative link) · Author · Status: `Draft` · Version: `1.0` · Impacted stacks · Linked ticket (if provided).

### 2. Executive Summary
3–6 bullets: change, motivation, backend impact, frontend impact, global risk (`L/M/H`), total effort in hours.

### 3. Scope
In scope (Backend, Frontend, Contracts) · Out of scope · Assumptions.

### 4. Architecture Impact
Mermaid or ASCII diagram (before → after) · API Contract Changes table · Frontend State / Routing changes · Backend interface changes.

### 5. Pre-flight Checklist
Branch, build, dependency, test suite, secrets, migrations, analysis review.

### 6. Implementation Phases (core)
For EACH phase use this exact template:

```markdown
### Phase N — <Short title> [Stack: Backend | Frontend | DB | Cross]

- **Goal:** one sentence.
- **Affected files:** list of `[file](relative/path)` links.
- **Steps:** numbered, atomic, imperative.
- **Validation:** how to confirm success.
- **Rollback:** command / commit / script that reverts ONLY this phase.
- **Estimated effort:** hours.
- **Dependencies:** previous phase numbers required.
```

Phase rules:
- Every phase MUST leave both builds green (backend AND frontend).
- A cross-stack change must be split into sub-phases using stubs / mocks / feature flags.
- Frontend MUST NOT call an endpoint until the corresponding backend phase is complete.

### 7. Database Changes
Table: Object · Type · Full DDL/DML (idempotent) · Associated migration · Performance impact · Rollback plan.
If none: `No database changes required.`

### 8. Testing Strategy
Backend (unit, integration, mocks, coverage ≥80%) · Frontend (unit, integration, a11y, coverage ≥80%) · Cross-cutting (contract tests, performance, regression areas).

### 9. Configuration & Deployment
Backend env config · Frontend env files · Pipelines · Deployment order · Feature flags.

### 10. Risks & Mitigations
Table: Risk · Probability (L/M/H) · Impact (L/M/H) · Mitigation · Owner · Stack (BE/FE/DB).

### 11. Definition of Done
Checklist covering backend code, frontend code, tests, a11y, API docs, shared types, migrations, docs, PR approval, CI, deployment, smoke test, work-item updated.
For frontend features, also include UX_Booster-derived checklist items: all UI states implemented (loading / error / empty / success), UX Score ≥7, WCAG 2.1 AA verified, mobile breakpoints tested, performance thresholds met (LCP ≤2.5 s, CLS ≤0.1).

### 12. References
Source analysis · Key files · Related ADRs / BRDs / User Stories · API contract URL.

---

## Hard Rules (non-negotiable)

1. **Never invent** paths, component names, hooks, endpoints, columns, methods. Read first or mark as `[TBD — verify]`.
2. **Never add** features outside the source analysis.
3. **Never use** calendar estimates (days/weeks). Hours only.
4. Snippets must compile / run as-is for both stacks. No pseudocode.
5. Relative links must be valid from `docs/implementation-plans/`.
6. SQL and repeatable scripts must be idempotent.
7. No secrets in the plan. Reference secret-store / env var names only.
8. Every snippet must comply with OWASP Top 10.

---

## Step 3 — Self-Validation (before writing the file)

- [ ] 12 sections present and non-empty.
- [ ] Every phase has Goal / Files / Steps / Validation / Rollback / Effort / Dependencies / Stack tag.
- [ ] Backend AND frontend coverage in each relevant phase.
- [ ] Real date obtained via `Get-Date -AsUTC` (not invented).
- [ ] Nothing outside the source analysis scope.
- [ ] **UX check (frontend plans only):** UX_Booster was run in Step 1.5; its requirements appear in §8, its gaps appear in §11, and any Critical/Major UX gaps appear as risks in §10.

---

## Step 4 — Persist and Report

1. Create the file at `docs/implementation-plans/IP-<YYYY-MM-DD>-<slug>.md`.
2. Respect `feedback_level`:
   - `full` → echo full plan summary + per-phase highlights.
   - `limited` (default) → report file path, total phases, hours split (BE / FE / DB), top 3 risks.
   - `minimal` → single line: `Implementation plan created at <path>`.
3. Respect `execution_mode`:
   - `unattended` → finish without asking for approval.
   - `supervised` → after writing, ask: _"Plan created. Please review. Should I notify the Orchestrator?"_
   - `semi` (default) → finish autonomously unless Open Questions exist; in that case, pause.
