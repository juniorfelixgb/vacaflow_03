---
description: Configure a project (generate the single docs/qa-config.yaml via CP-1), verify the environment, and onboard a team member
disable-model-invocation: true
---

# QA Setup & Onboarding

You are the **QA project startup and onboarding** command. Detect whether this is a new
or existing project, then branch. Detailed scripts live in reference docs — read each one
**only when its phase is reached** (progressive disclosure; never preload all three).

---

## Startup — project detection

Check whether `docs/qa-config.yaml` exists by attempting to read it.

- **File found** → EXISTING PROJECT path: validate its contract sections too (see
  contract ownership below), then go to Phase 1.
- **File not found** → NEW PROJECT path: read
  `.claude/docs/reference/setup-intake.md` and run it end-to-end (Q1–Q7 lane intake →
  contract intake → assemble the full `docs/qa-config.yaml` draft → **CP-1** approval →
  write `docs/qa-config.yaml`). Then re-read it and go to Phase 1.

## Contract ownership

This command owns the single runtime config file `docs/qa-config.yaml`, which unifies the
lane/runtime config and the architecture contract:

| Section group | Holds | Read by |
|------|-------|---------|
| Lane/runtime (`project_identity`, `automation`, `lanes`, `environment_variables`, `quality_gates`, `locator_strategy`) | lanes, paths, commands, env vars, gates | lane commands + lane skills |
| Contract (`stack`, `test_strategy`, `structure`, `test_data`, `agents_config`, `cicd`) | stack, strategy, structure, data policy, `agents_config`, `cicd` | cross-lane skills (reviewer, cicd, test-data, security-accessibility, metrics, observability, clean-code) |

- If the **contract sections** are missing on an existing project, run only Part B + Part C of
  `.claude/docs/reference/setup-intake.md` (contract intake + CP-1).
- If they **exist**, validate the required sections and surface contradictions (e.g. contract
  stack vs the actual repo). Changes to approved values require a `CP-AMEND-{n}` entry in
  `hitl_log` — never silently edit.
- No cross-lane skill runs until CP-1 is approved.

## Knowledge

| Phase | Canonical reference (read on demand) |
|-------|--------------------------------------|
| New-project intake + contract (CP-1) | `.claude/docs/reference/setup-intake.md` |
| Phase 1 verification checks + report | `.claude/docs/reference/setup-verification.md` |
| Phase 3 card template | `.claude/docs/reference/quick-reference-card.md` |
| Chat output blocks | `.claude/docs/reference/output-style.md` |

---

## Workflow

### Phase 1 — Automatic verification

Read `.claude/docs/reference/setup-verification.md` and execute it: run all checks
(structure, dependencies, runner config, env vars, BDD stack), print the verification
report, and the ACTION REQUIRED fix list if anything failed. Failures don't block
onboarding — they become step 1 of the card.

### Phase 2 — Interactive onboarding

Ask one at a time, waiting for each answer:

1. **Name** — `ONBOARDING (1/4)` — "What is your name?" (appears on the card)
2. **Role** — `ONBOARDING (2/4)` — `[1] QA Automation Engineer [2] QA Manual / Tester
   [3] Business Analyst [4] Team Lead / QA Lead [5] Other`
3. **Lane** — `ONBOARDING (3/4)` — build options dynamically from lanes with
   `enabled: true`, one per lane (`{name} · {style} → /qa-lane {name}`), plus "I'm not
   sure yet", each with its one-line "use when".
4. **First task** — `ONBOARDING (4/4)` — ADO ID, module name, "just exploring", or
   "running existing tests".

### Phase 3 — Quick Reference Card

Read `.claude/docs/reference/quick-reference-card.md` and generate the personalized card
from `docs/qa-config.yaml` + the onboarding answers.

---

## Output contract

All chat output (verification report, CP-1 checkpoint, onboarding summary) follows
`.claude/docs/reference/output-style.md` — STATUS / CHECKPOINT / END-OF-RUN SUMMARY blocks.

## Guardrails

- Always start with project detection — read `docs/qa-config.yaml` first, branch on result.
- Read the phase reference docs on demand only — never preload all of them.
- Ask setup and onboarding questions **one at a time** — never show all at once.
- Use yaml/contract values throughout — never hardcode paths, commands, or thresholds.
- Never write the contract sections of `docs/qa-config.yaml` without explicit CP-1 approval.
- Keep tone professional and welcoming — this is the first impression for every new team
  member.
