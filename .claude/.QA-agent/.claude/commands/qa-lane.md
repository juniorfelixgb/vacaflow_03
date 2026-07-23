---
description: Implement automated tests for a lane end-to-end — dispatches by the lane's style (pom-spec | bdd-gherkin | api-request) → ADO fetch → coverage → author → run → heal
argument-hint: "<lane-name> [ADO ID | module name | feature description]"
---

# QA Lane — End-to-End Lane Agent (style-driven)

You implement automated tests for **one lane**. You are a **thin orchestrator**: the lane's
`style` — not its name — decides the pipeline and the authoring skills. All style rules live in
`.claude/docs/reference/lane-styles.md`; never restate them here.

Arguments: `<lane-name> [ADO work item ID | module name | feature description]` → $ARGUMENTS

---

## Startup

1. Read `docs/qa-config.yaml`. Resolve the **first argument** to a lane under `lanes.<name>`.
   - If the lane is missing → stop and list the enabled lanes.
   - If `lanes.<name>.enabled: false` → stop: "Lane '{name}' is not enabled — run /qa-setup."
   - If no lane name is given → list the enabled lanes (name → style) and ask which to run.
2. Read `lanes.<name>.style` and load its **profile** from
   [lane-styles.md](../docs/reference/lane-styles.md): required fields, skills, pipeline,
   coverage-matrix format, and owned/shared zones. If a required field for that style is
   missing from the lane, stop and say which field.
3. Read `quality_gates`, `project_identity`, `locator_strategy`, and — for a `bdd-gherkin`
   lane — `automation.bdd_framework`. Any `pom-spec`/`bdd-gherkin` lane also reads
   `automation.page_object_dir`. Never hardcode these values.

Print the header:
```
QA LANE
─────────────────────────────────────────
Project: {display_name}
Lane:    {name}  ·  style: {style}
Input:   {remaining args or "interactive"}
─────────────────────────────────────────
```

---

## Knowledge

Rules are NOT in this file — they live in `.claude/docs/reference/` and are surfaced by skills.
The lane's `style` selects which authoring skills apply (per `lane-styles.md`):

| Topic | Skill | Canonical reference |
|-------|-------|---------------------|
| ADO work items | `ado-fetch` | `.claude/docs/reference/ado-integration.md` |
| AC→test mapping & gates | `coverage-matrix` | `.claude/docs/reference/coverage-matrix.md` |
| Page objects *(pom-spec, bdd-gherkin)* | `page-object-authoring` | `.claude/docs/reference/page-object-standards.md` |
| Locators *(pom-spec, bdd-gherkin)* | `locator-strategy` | `.claude/docs/reference/locator-strategy.md` |
| Spec files, AAA *(pom-spec)* | `spec-authoring` | `.claude/docs/reference/spec-authoring-aaa.md` |
| Feature files + step defs *(bdd-gherkin)* | `gherkin-authoring` | `.claude/docs/reference/gherkin-standards.md`, `.claude/docs/reference/step-definition-standards.md` |
| API specs, request fixture *(api-request)* | `api-testing` | `.claude/docs/reference/api-testing.md` |
| Test data / isolation / PII *(api-request)* | `test-data` | `.claude/docs/reference/test-data.md` |
| Failures | `failure-healing` | `.claude/docs/reference/failure-healing.md` |

---

## Workflow (orchestration only — the style profile fills in the authoring steps)

1. **CONTEXT LOAD** — Glob the lane's owned zone and (for pom-spec/bdd-gherkin) the shared
   `automation.page_object_dir`. Report what exists and note gaps.
2. **INPUT TYPE** — ADO ID → Phase 3. Module/feature/endpoint name → ask user for AC. Existing
   file path → analyze it, jump to authoring. No further args → ask what to automate.
3. **ADO FETCH** (skip if no ADO ID) — apply `ado-fetch`.
4. **COVERAGE MATRIX** — apply `coverage-matrix` in the **format for this style** (see the
   profile). Hard-stop below the gate (**CP-AC**); split waves above `max_tcs_per_wave`. Wait
   for confirmation before coding.
5. **AUTHOR** — run the **authoring steps of the style profile**:
   - `pom-spec` → page objects (`page-object-authoring` + `locator-strategy`) → spec files
     (`spec-authoring`), one `test()` per AC.
   - `bdd-gherkin` → Gherkin (`gherkin-authoring`, generate + optimize) → page objects → step
     definitions (`gherkin-authoring`, pattern for `automation.bdd_framework`) → coverage
     check (no MISSING steps).
   - `api-request` → API specs (`api-testing` + `test-data`), one `test()` per AC, request
     fixture only.
   Reuse/extend existing artifacts; never recreate. Update the matrix to ✅ as each test lands.
6. **RUN** — for `bdd-gherkin` first `{lane.gen_command}` and verify `{lane.generated_dir}/`
   is populated; then `{lane.run_command}` (or scope to the module/resource). Report pass/fail.
7. **HEAL** (only if failures) — delegate to the **qa-healer** subagent: pass the failing test
   list (for bdd-gherkin include `bddgen` parse + MISS-step rows), the lane paths/commands from
   `docs/qa-config.yaml`, and max 3 attempts/test. Record its report, then present **CP-4**. For
   `api-request`, a contract mismatch escalates as a potential app bug (CP-5 flow), never a
   weakened assertion. A single quick inline fix may apply `failure-healing` directly.
8. **WAVE COMPLETE** — print the summary below.

```
WAVE COMPLETE
─────────────────────────────────────────
Project: {display_name}   Lane: {name} ({style})   Wave: {n}
Tests: {n} implemented, {n} passing
Files: {created/modified}
─────────────────────────────────────────
COVERAGE MATRIX — FINAL  (style format, all ✅)
─────────────────────────────────────────
{If quality_gates.pr_checkpoint_required:} PR CHECKPOINT — submit a PR before the next wave.
Next: /qa-lane {name} {next scope}
```

---

## Output contract

All chat output follows `.claude/docs/reference/output-style.md`: print a **STATUS** block at
every phase transition, format every gate as a **CHECKPOINT** block, and end with the
**END-OF-RUN SUMMARY** (the WAVE COMPLETE block above is its lane instance — include the Gates
table and plain-English meanings from the standard).

---

## Guardrails

- **Dispatch by `style`, never by the lane name.** A lane named `regression` with
  `style: bdd-gherkin` runs the Gherkin pipeline, not specs.
- **Isolation is derived, not hardcoded.** Edit only this lane's owned zone (per its style in
  `lane-styles.md`) and — unless the style is `api-request` — the shared
  `automation.page_object_dir`. Never edit another enabled lane's owned zone.
- `api-request` lanes never touch page objects, UI fixtures, feature files, or step
  definitions, and never weaken a contract assertion to make a test pass.
- Never mark a wave complete while any AC item is uncovered (or any step is MISSING for
  `bdd-gherkin`).
- Never skip the coverage matrix or implement before the quality-gate confirmation.
