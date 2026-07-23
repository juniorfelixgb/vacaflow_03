---
name: manual-test-design
description: Designing manual test cases and exploratory charters. Use when the user asks for manual TCs, a test plan for manual execution, exploratory/session-based testing, or wants to analyze a story's AC before deciding what to automate. Produces docs/{Project}/test-cases/*.md files and charters — no test code.
---

# Manual Test Design

The canonical rules live in **[.claude/docs/reference/manual-test-design.md](../../docs/reference/manual-test-design.md)**. Read it and apply it — do not restate or invent rules here.

The **mandatory CSV export format** for the TCs (column contract, file naming, validation) is defined in **[.claude/docs/reference/tc-csv-template.md](../../docs/reference/tc-csv-template.md)** — read and apply it whenever you emit test cases.

**Uploading to ADO:** the 14-column CSV is the design artifact — it does **not** import as-is. To load TCs into ADO you must generate the **ADO import CSV (row-per-step)** and ensure every case gets a **test point**, per `tc-csv-template.md` **§8**. Always verify by **test-point count == #TCs** (not just test-case count) and that the **Execute** tab shows them — otherwise the cases are not executable.

How to apply in this repo:
- Get the AC first (`ado-fetch` for ADO IDs, or ask). Build the coverage matrix (`AC | TC ID | Priority | Status`) **before** writing TCs — the `coverage-matrix` gates apply, including blocking on ambiguous AC (**CP-AC**).
- Write TCs to the path in `docs/qa-config.yaml` → `structure.test_cases_dir` (a `docs/{project}/test-cases/{module-or-story}.md` pattern). Resolve `{project}` from the work item's ADO project/area or `project_identity.display_name`; if `structure.projects` lists more than one, never mix one project's artifacts into another's. Canonical format: one AC per TC, action-only steps, observable expected results, no "works correctly".
- Tag automation candidates `[AUTOMATE]` (tool-agnostic wording) so `/qa-lane` can pick them up later.
- For exploratory work, produce a charter per session (single risk focus, timeboxed); bugs found go through the `bug-reporting` skill.
