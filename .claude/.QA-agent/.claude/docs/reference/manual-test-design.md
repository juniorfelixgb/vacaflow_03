# Manual Test Design — Canonical Standard

> **Single source of truth** for designing manual test cases and exploratory charters.
> The AC-analysis and coverage rules from [coverage-matrix.md](coverage-matrix.md) apply
> unchanged (CP-AC included) — this standard only defines the **manual** artifacts.
> Output lives in the target project's own folder, at the path configured in
> `docs/qa-config.yaml` → `structure.test_cases_dir` (a `docs/{project}/test-cases/` pattern).
> Resolve `{project}` from the work item's ADO project/area or `project_identity.display_name`;
> when `structure.projects` lists more than one, never mix one project's artifacts into another's.
> Unless the team specifies another location.
> **Artifact content is written in English** (TCs, charters, and any CSV/Excel/Markdown
> export) regardless of chat language — same convention as `hitl-workflow.md`: the repo
> stays English, only the conversation may be in the user's language.

## Manual test case format

> **CSV export is mandatory** for the test cases themselves — the exact column contract and
> file conventions live in [tc-csv-template.md](tc-csv-template.md). This Markdown format below
> remains canonical for the **analysis** of a work item; the CSV is the required export of its TCs.

One file per module/story under the project's folder: `docs/{Project}/test-cases/{module-or-story}.md`. Each TC:

```markdown
### TC-M-{NN}: {short behavior-focused title}

| Field | Value |
|---|---|
| AC | {AC id this TC covers — one AC per TC} |
| Priority | P1 (critical) / P2 (major) / P3 (minor) |
| Type | functional / negative / boundary / usability |
| Preconditions | {state required before step 1 — user, data, config} |
| Test data | {what data is needed; reference test-data rules — no real PII} |

**Steps:**
1. {one action per step, written as an instruction: "Click...", "Enter..."}
2. ...

**Expected result:**
- {observable outcome per step or at the end — specific, verifiable}
```

Rules:
- **One AC per TC** — same coverage rule as automation; the matrix
  (`AC | TC ID | Priority | Status`) is built **before** writing TCs and gates apply
  (block on AC ambiguity → raise CP-AC questions).
  **Exception (manual + in-place only):** a single manual TC may group several validations done on
  the same screen/state without navigating, with paired step↔expected-result entries (max 4),
  listing every AC it covers. Conditions and CSV encoding are defined in
  [tc-csv-template.md](tc-csv-template.md) §6. Does not apply to automation candidates (those stay
  atomic — one assertion per test).
- Steps are **actions only**; expectations live in Expected result. No step may require
  knowledge that isn't in the preconditions.
- Expected results are observable and specific ("a red inline error 'Email is required'
  appears under the field"), never "works correctly".
- Negative/boundary TCs follow the same risk list as automation (missing/invalid input,
  permissions, duplicates) — raise gaps as CP-AC questions, don't invent ACs.
- Mark TCs that are good automation candidates with `[AUTOMATE]` so an automation lane
  can pick them up later — write them tool-agnostic (no selectors, no tool names).

## Exploratory charter format

For session-based exploratory testing, one charter per session:

```markdown
## Charter: {target} — {date}

**Explore** {the module/flow}
**With** {resources/personas/data}
**To discover** {risk focus: e.g. concurrency issues, validation gaps}

Timebox: {30–90 min}   Tester: {name}

### Session notes
- {timestamped observations}

### Outcomes
- Bugs raised: {ids — per bug-report-standard.md}
- New TC candidates: {list}
- Questions for the team: {list}
```

A charter has a **single risk focus** — split broad targets into multiple sessions.
Every bug found goes through [bug-report-standard.md](bug-report-standard.md); every
repeatable check found becomes a TC candidate in the matrix.
