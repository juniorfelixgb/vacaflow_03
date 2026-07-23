---
description: Run the full QA pipeline autonomously for one work item — 3 phases (TC generation, implementation, healing) with human review gates
argument-hint: "[ADO ID | PBI path | path/to/file.feature]"
disable-model-invocation: true
---

# QA Loop — Autonomous Multi-Phase Pipeline

You run the complete QA automation pipeline autonomously for a single work item.
The pipeline has 3 phases. Within each phase you iterate until completion criteria are
met, then pause for a single human review gate before advancing.

Arguments (ADO work item ID, PBI file path, or feature file path): $ARGUMENTS

---

## Knowledge

Rules are NOT in this file — they live in `.claude/docs/reference/` and are surfaced by skills.
This command owns only the **loop machinery, gates, and log orchestration**.

| Topic | Skill / reference |
|-------|-------------------|
| Log format (the 3-section template + integrity rules) | `.claude/docs/reference/log-format.md` |
| ADO fetch | skill `ado-fetch` → `.claude/docs/reference/ado-integration.md` |
| Coverage & gates | skill `coverage-matrix` → `.claude/docs/reference/coverage-matrix.md` |
| Gherkin / steps (bdd-gherkin style) | skill `gherkin-authoring` |
| Page objects / specs | skills `page-object-authoring`, `spec-authoring`, `locator-strategy` |
| Failure diagnosis & fixes (LOC/STR/TIME/MISS/MTH/IMP) | skill `failure-healing` → `.claude/docs/reference/failure-healing.md` |

Every phase log MUST follow `.claude/docs/reference/log-format.md` exactly.

---

## Startup

1. **Read `docs/qa-config.yaml`.** Store `project_identity`, every lane (name, `style`, paths,
   commands, `enabled` flags), `automation.page_object_dir`, `quality_gates.max_tcs_per_wave`,
   `automation.bdd_framework`. If the file is missing → stop: "Run /qa-setup first to configure
   this project."
2. **Determine lane:** pick which lane to run (by name, or infer the intended `style` from the
   input and match an enabled lane):

   | Argument | Pick |
   |---|---|
   | `.feature` file path | a `bdd-gherkin` lane |
   | "spec", "POM" | a `pom-spec` lane |
   | endpoint / contract | an `api-request` lane |
   | `docs/pbi/*.md` path, ADO ID, or plain description | list the enabled lanes (name · style) and ask which |

   The lane's `style` — not its name — drives the pipeline. If the selected lane is
   `enabled: false` → stop and inform the user.
3. **Create the log directory** `logs/qa-loop/{YYYYMMDD}-{work-item-id-or-slug}/` and
   empty `phase1-generation.md`, `phase2-implementation.md` (Write tool).
4. **Print the startup header:**
```
QA LOOP — STARTING
─────────────────────────────────────────────────────────
Project: {display_name}   Input: {$ARGUMENTS}   Lane: {name · style}
Log:     logs/qa-loop/{date}-{id}/
Pipeline: Phase 1 TC Generation (max 5)  ·  Phase 2 Implementation (max 3/wave)  ·  Phase 3 Healing (max 3/test)
─────────────────────────────────────────────────────────
Starting Phase 1...
```

---

## PHASE 1 — TC GENERATION LOOP

**Goal:** 100% of AC items covered by a scenario (BDD) or test case (Regression).
**Max iterations:** 5. **No user interaction during the loop — only at the gate.**

- **Init:** read the input (PBI markdown or feature file) and number all AC items. If an
  ADO ID was given, apply skill `ado-fetch` first (write JSON to the log dir). Scan the
  codebase once (feature/test dir, step dir, page object dir) for what already exists.
- **Each iteration (do the work first, then write the log):** apply skill
  `coverage-matrix` to generate/update the matrix and the feature file or TC list, close
  gaps, and run the self-check when coverage hits 100%.
- **Self-check at 100%:** re-verify the matrix against the rules in `coverage-matrix`
  (one test per AC, never merged) and, for BDD, the scenario rules in `gherkin-authoring`
  (business language, `@smoke` tagging, header matrix in sync). A failed self-check costs
  one more iteration.
- **Loop decision rules (no asking):** coverage < 100% and iter < 5 → close gaps, log,
  continue. Coverage = 100% → self-check, final log, stop. Iter 5 with coverage < 100% →
  final log with ❌, stop.
- **Write `phase1-generation.md` after each iteration** per `.claude/docs/reference/log-format.md`
  (table = COVERAGE: `AC | Description | Iter | Result`).

### Phase 1 review gate — print and WAIT for input
```
 PHASE 1 COMPLETE — REVIEW REQUIRED
 {AC | Description | Result table}
 Iterations used: {n}/5   ·   Full log: logs/qa-loop/{date}-{id}/phase1-generation.md
  APPROVE          → Phase 2 (Implementation)
  REJECT: {notes}  → revise once, update the log Result line + FILES CHANGED, re-show gate
  STOP             → end loop, keep files
```

---

## PHASE 2 — IMPLEMENTATION LOOP

**Goal:** all TCs in the coverage matrix implemented and passing.
**Max iterations:** 3 per wave. **No user interaction during the loop — only at the gate.**

- **Start:** re-read `phase1-generation.md` for the TC list (do NOT rely on conversation
  memory). Divide TCs into waves of `{quality_gates.max_tcs_per_wave}`; record the wave
  plan as the first entry in `phase2-implementation.md`.
- **Each iteration (work first, then log):**
  1. Check existing page objects / step defs — extend & reuse, never duplicate
     ([page-object-authoring], [gherkin-authoring]).
  2. Implement only what is missing (locators, methods, steps, spec blocks) per the
     authoring skills + [locator-strategy].
  3. bdd-gherkin lanes: run `{lane.gen_command}` before every test run. Then
     `npx playwright test --project={lane.project_name}`.
  4. On failure: apply skill `failure-healing` (minimum fix → re-run failing test →
     re-run the wave).
- **Loop decision rules:** all pass → delegate the wave's files to the **qa-reviewer**
  subagent (compact verdict + findings; record in the log; BLOCKER findings count as
  wave failures) → close wave, next wave. Failures and iter < 3 → fix, log, continue.
  3 iterations with failures → mark those TCs for Phase 3, final log, next wave.
- **Write `phase2-implementation.md` after each iteration** per the log standard
  (table = TEST RESULTS: `TC | Description | Iter | Result | Notes`).

### Phase 2 review gate — print and WAIT
```
 PHASE 2 COMPLETE — REVIEW REQUIRED
 {TC | Description | Result table}
 Full log: logs/qa-loop/{date}-{id}/phase2-implementation.md
  APPROVE          → Phase 3 (Healing) — or complete if all pass
  REJECT: {notes}  → re-attempt once with the guidance
  SKIP             → accept failures, skip healing, go to summary
  STOP             → end loop, keep files
```

---

## PHASE 3 — HEALING LOOP

**Goal:** all tests marked ❌ in Phase 2 pass.
**Max iterations:** 3 per failing test. **No user interaction during the loop — only at the final gate.**

- **Start:** re-read `phase2-implementation.md` for the failing TC list. Create
  `phase3-healing.md`.
- **Heal via the qa-healer subagent:** delegate the whole failing-TC list in one
  invocation — pass lane paths/commands from `docs/qa-config.yaml` and max 3 attempts/test.
  The subagent classifies, applies minimum fixes, re-runs, checks for regressions, and
  returns a compact per-TC report with ESCALATION DETAIL blocks for tests it could not
  heal. This keeps stack traces and retries out of the loop's context.
- **On return:** copy the per-TC results and escalation blocks into the phase log.
- **Write `phase3-healing.md` after each attempt** per the log standard (table = HEALING
  RESULTS: `TC | Description | Attempts | Result`, plus ESCALATION DETAIL for escalated TCs).

### Phase 3 final review gate — print and WAIT
```
 PHASE 3 COMPLETE — FINAL REVIEW
 {TC | Description | Result table}
 Full log: logs/qa-loop/{date}-{id}/phase3-healing.md
  APPROVE          → generate final summary and complete
  REJECT: {hint}   → one more pass with the guidance
  STOP             → end loop, keep files
```

---

## FINAL SUMMARY

On APPROVE at the last phase, write `logs/qa-loop/{date}-{id}/summary.md` per the log
standard with: FINAL TEST STATUS (`TC | Description | Status`), PIPELINE SUMMARY (per-phase
iterations/coverage/heal counts), and FILES CREATED/MODIFIED. End with the PR checkpoint
reminder if `quality_gates.pr_checkpoint_required` is true, and `Next: /qa-loop {next-id}`.

---

## Output contract

Chat output follows `.claude/docs/reference/output-style.md`: the startup header and
phase transitions are **STATUS** blocks; the three review gates are **CHECKPOINT**
instances (always show the gate id, the plain-English "why it matters" line, and the
option consequences); the final summary follows the **END-OF-RUN SUMMARY** shape.
Disk logs are governed separately by `.claude/docs/reference/log-format.md`.

---

## Guardrails — autonomous behavior contract

- **Within a phase:** do the work first (write, run, diagnose), then overwrite the full
  phase log. Make decisions and document them — do not stop to ask. Never exceed the max
  iterations — stop and report.
- **At gates:** always stop, print the formatted gate, and wait for
  APPROVE / REJECT / STOP / SKIP. On REJECT: apply feedback once, update the log, re-show
  the gate — do not restart the phase.
- **Log integrity:** follow `.claude/docs/reference/log-format.md` (overwrite each iteration;
  Result line current; ITERATIONS and FILES CHANGED cumulative).
- **Never:** push to git or open PRs; touch files outside the configured lane paths
  (except `logs/`); weaken assertions; use `page.waitForTimeout()` as a fix; loop beyond
  the per-phase maximum.
