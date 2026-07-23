---
name: coverage-matrix
description: Building and maintaining the AC→TC/Scenario coverage matrix and enforcing the coverage quality gate. Use whenever mapping acceptance criteria to tests, before writing any test code, when splitting work into waves, or when checking the AC-coverage / max-TCs-per-wave gates from qa-config.yaml.
---

# Coverage Matrix

The canonical rules live in **[.claude/docs/reference/coverage-matrix.md](../../docs/reference/coverage-matrix.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- First analyze the AC: score completeness (**block + raise questions if empty/vague**), detect duplicates vs existing tests, classify by type/category, and record data requirements for the **test-data** lane.
- Build the matrix **before** any test code. The format follows the lane's `style` (see [lane-styles.md](../../docs/reference/lane-styles.md)): `pom-spec` → `AC | Test ID | Assertion | Status`; `bdd-gherkin` → `AC | Scenario # | Tags | Status`; `api-request` → `AC | Test ID | Endpoint | Assertion | Status`.
- Read thresholds from `docs/qa-config.yaml` → `quality_gates` (`ac_coverage`, `max_tcs_per_wave`). **Never hardcode them.**
- Every AC maps to ≥1 test; one test per AC. Hard-stop below the coverage gate. Split into waves above the wave limit and wait for confirmation. Mark ✅ as tests pass.
