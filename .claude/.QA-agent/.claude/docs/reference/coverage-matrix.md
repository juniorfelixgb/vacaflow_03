# Coverage Matrix — Canonical Standard

> **Single source of truth** for mapping acceptance criteria (AC) to tests and for the
> coverage quality gate. Build the matrix **before writing any test code**.
> The numeric thresholds (`ac_coverage`, `max_tcs_per_wave`) come from
> `docs/qa-config.yaml` → `quality_gates` — **never hardcode them here.**
> **The matrix and any derived artifact are written in English** regardless of chat
> language — same convention as `hitl-workflow.md` (repo stays English, chat may differ).

The format depends on the lane's `style` (`docs/qa-config.yaml` → `lanes.<name>.style`), not
its name. See [lane-styles.md](lane-styles.md).

## `pom-spec` style format

```
COVERAGE MATRIX
─────────────────────────────────────────────────────
| AC Item | Test ID | Assertion | Status |
|---------|---------|-----------|--------|
| AC 1.1  | TC-001  | ...       | ⬜     |
| AC 1.2  | TC-002  | ...       | ⬜     |
─────────────────────────────────────────────────────
Total: {n} ACs → {n} TCs planned
```

## `bdd-gherkin` style format

```
COVERAGE MATRIX
─────────────────────────────────────────────────────
| AC Item | Scenario # | Tags  | Status |
|---------|------------|-------|--------|
| AC 1.1  | 1.1        | @mod  | ⬜     |
| AC 1.2  | 1.2        | @mod  | ⬜     |
─────────────────────────────────────────────────────
```

## `api-request` style format

```
COVERAGE MATRIX
─────────────────────────────────────────────────────
| AC Item | Test ID | Endpoint      | Assertion | Status |
|---------|---------|---------------|-----------|--------|
| AC 1.1  | TC-001  | POST /orders  | ...       | ⬜     |
| AC 1.2  | TC-002  | GET /orders/1 | ...       | ⬜     |
─────────────────────────────────────────────────────
```

## Before building the matrix — AC analysis

Run this on the source work item / PBI before mapping anything:

1. **Completeness check.** Score how complete the acceptance criteria are. If the AC
   is empty or too vague to design a test against, **block** and raise clarification
   questions to HITL — do not invent coverage. This is the design equivalent of the
   CP-AC checkpoint.
2. **Duplicate detection.** Compare each candidate test/scenario against existing
   tests in the lane. If an equivalent test already exists, link to it instead of
   creating a duplicate.
3. **Classification.** Tag each test by type (UI / API / e2e / smoke) and category
   (functional / negative / boundary / regression) so the pyramid in
   `docs/qa-config.yaml` → `test_strategy.pyramid` stays balanced.
4. **Data requirements.** For each test, record the data it needs (entities, states)
   and hand that list to the **test-data** lane — never hardcode data inline.

## Quality gate

- **Every AC item must map to at least one test/scenario.** Hard-stop if coverage is
  below `quality_gates.ac_coverage` (%) from `docs/qa-config.yaml`.
- One test/scenario per AC — never merge ACs; never have one test cover two ACs.
  **Manual exception:** the in-place grouping rule ([manual-test-design.md](manual-test-design.md),
  [tc-csv-template.md](tc-csv-template.md) §6) lets one **manual** TC cover several ACs verified on
  the same screen; it must list every AC it covers and coverage credits each. Automation is unaffected.
- Update the `Status` to ✅ as each test/scenario is implemented and passing.

## Wave splitting

If a task would exceed `quality_gates.max_tcs_per_wave` TCs/scenarios, split into waves
and inform the user before proceeding:

```
WAVE LIMIT
─────────────────────────────────────────
This task has {n} TCs — max per wave is {max_tcs_per_wave}.
Wave 1 will cover: {TC-001 to TC-0NN}
After PR review, continue with Wave 2.
```

Wait for user confirmation before implementing. If
`quality_gates.pr_checkpoint_required` is true, a PR review happens between waves.
