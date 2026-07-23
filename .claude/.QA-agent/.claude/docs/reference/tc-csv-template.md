# Test Case CSV Template — Canonical Standard

> **Single source of truth** for the **mandatory CSV export format** of manual test cases,
> aligned to the Azure DevOps Test Plan structure. The project's ADO plan/suite/area and
> upload defaults come from `docs/qa-config.yaml` (`project_identity`, `ado_test_management`).
> The TC *content* rules (one AC per TC, action-only steps, observable expected results,
> AC-analysis/CP-AC gating) live in [manual-test-design.md](manual-test-design.md) and apply
> unchanged — this document fixes the **column contract, naming, and file conventions** so the
> format never drifts between test-case creation sessions.
>
> **Policy:** the Markdown analysis file is canonical for the *analysis*; the **14-column CSV below is the
> design/traceability artifact** for the test cases. To actually load TCs into ADO you must generate the
> **ADO import CSV (§8)** from it (a row-per-step file) and ensure every uploaded case gets a **test point**
> (§8.2) — otherwise the CSV won't import and/or the cases won't be executable. Both files are **English**.
>
> **Wave splitting does NOT apply here.** `quality_gates.max_tcs_per_wave` governs **automation**
> work — batching it into PR-sized waves for QA review and pull requests to the repo. A manual TC
> CSV may contain **all** the test cases for a story.

## 1. Test Case naming convention

Every test case has a composite name (this becomes the ADO `System.Title`):

```
{WorkItemID}_TC_{TCNo}_{MODULE}_{FEATURE}_{VALIDATION}
```

Example: `12345_TC_001_ACCOUNTS_CREATE USER PROFILE_Validate profile creation for the associated user profile`

| Segment | Meaning |
|---------|---------|
| `WorkItemID` | ADO work item id of the **PBI / User Story** this TC traces to (e.g. `12345`) |
| `TC` | fixed prefix |
| `TCNo` | sequential number, **unique within the user story**, **3 digits**, starts at `001` |
| `MODULE` | application / product / functional area under test (e.g. `ACCOUNTS`, `BILLING`, `INTEGRATION`) |
| `FEATURE` | feature / business action under test — *what action is executed* (e.g. `CREATE USER PROFILE`) |
| `VALIDATION` | expected behavior / what the TC verifies (e.g. `Validate profile creation...`) |

Separator is the underscore `_`. The numbering resets per user story.

## 2. Column contract (exact order, exact headers)

The header row is **mandatory** and must match these names and order exactly:

```
Work Item ID,TC No,Module,Feature,Validation,Test Case Name,AC Ref,Priority,Type,Preconditions,Test Data,Steps,Expected Result,Automation Status
```

| # | Column | Required | Allowed values / format |
|---|--------|----------|--------------------------|
| 1 | `Work Item ID` | yes | PBI/User Story id this TC tests (e.g. `12345`) |
| 2 | `TC No` | yes | 3-digit sequential within the story (`001`, `002`, …) |
| 3 | `Module` | yes | Functional area / product (`ACCOUNTS`, `BILLING`, `INTEGRATION`, …) |
| 4 | `Feature` | yes | Feature / business action under test (e.g. `CREATE USER PROFILE`) |
| 5 | `Validation` | yes | What the TC verifies (e.g. `Validate profile creation...`) |
| 6 | `Test Case Name` | yes | **Generated** = `{Work Item ID}_TC_{TC No}_{Module}_{Feature}_{Validation}` → ADO Title |
| 7 | `AC Ref` | yes | One AC id per row by default (e.g. `AC2`). **May list several** comma-separated (`AC1,AC2`) only under the in-place grouping exception (§6). Internal traceability (not an ADO field) |
| 8 | `Priority` | yes | ADO numeric **1–4** (1 = highest). Map legacy P1/P2/P3 → 1/2/3 |
| 9 | `Type` | yes | `functional` · `negative` · `boundary` · `usability`. Internal (imported as a tag) |
| 10 | `Preconditions` | yes | State required before step 1. Use `N/A` if none |
| 11 | `Test Data` | yes | Data the TC needs; reference `test-data` rules — **no real PII**. `N/A` if none |
| 12 | `Steps` | yes | Actions only, numbered `1. 2. 3.`, one action per line (newlines inside the quoted cell). A step that is validated is referenced by its number in `Expected Result` |
| 13 | `Expected Result` | yes | Observable, specific outcome. Never "works correctly". Single by default; under §6 may hold **several, each numbered to the step** it validates (e.g. `2. ...` / `3. ...`), max 4 |
| 14 | `Automation Status` | yes | ADO values: `Not Automated` · `Planned` · `Automated` |

Rules carried from [manual-test-design.md](manual-test-design.md): **one AC per row**, steps are
actions only (expectations live in `Expected Result`), no step may require knowledge absent from
`Preconditions`, and unresolved AC ambiguity is raised as a CP-AC doubt in the analysis `.md` —
never invented as coverage.

## 3. CSV technical rules (RFC 4180)

- **Encoding:** UTF-8. (When opening in Excel, import as UTF-8 so accents render correctly.)
- **Quoting:** wrap any field containing a comma, double-quote, or newline in double quotes;
  escape an internal double-quote by doubling it (`""`).
- **Multiline `Steps`/`Expected Result`:** allowed — keep the newlines inside the quoted cell.
- **One row per test case.** First row is the header above; no blank leading rows.
- **Validation gate:** every data row must have exactly **14 fields**, and `Test Case Name` must
  equal the concatenation of its component columns. Each number in `Expected Result` must reference
  an existing step number, with **≤4** expected results per TC; an `[AUTOMATE]`-equivalent
  (`Automation Status` = `Planned`/`Automated`) TC must have exactly **one** expected result.
  Validate with a CSV parser before declaring done.

## 4. File naming & location

- One CSV per work item, named `{workItemId}-{kebab-title}.csv`.
- Lives **next to its analysis `.md`** in the project's test-cases folder — the path from
  `docs/qa-config.yaml` → `structure.test_cases_dir` (e.g. `docs/{project}/test-cases/{workItemId}-{kebab-title}.csv`
  + the matching `.md`).
- Build the coverage matrix in the analysis `.md` **before** writing the CSV (see
  [coverage-matrix.md](coverage-matrix.md)); every AC maps to ≥1 TC.

## 5. ADO Test Plan mapping

Observed from the ADO Test Plan (Test Case work item type). The CSV is built to import deterministically:

| CSV column | ADO field / behavior |
|------------|----------------------|
| `Test Case Name` | `System.Title` |
| `Work Item ID` | **TestedBy** link: `Microsoft.VSTS.Common.TestedBy-Reverse` → the PBI |
| `Priority` | `Microsoft.VSTS.Common.Priority` (1–4) |
| `Automation Status` | `Microsoft.VSTS.TCM.AutomationStatus` |
| `Preconditions` | first `ActionStep` in `Microsoft.VSTS.TCM.Steps`, prefixed `Precondition:` |
| `Steps` + `Expected Result` | `Microsoft.VSTS.TCM.Steps` — each action is an `ActionStep`; a step that has a numbered expected result becomes a `ValidateStep` carrying it (one or more per §6) |
| `AC Ref`, `Type` | internal traceability — import as tags (no native ADO field) |

**Import defaults** (set at upload, not per-row): `System.WorkItemType = Test Case`,
`System.AreaPath` = `ado_test_management.area_path` (empty → `project_identity.ado_project`),
`System.IterationPath` = target sprint, `System.State = Design`, `System.AssignedTo` = the owning QA.

Keep the CSV column contract stable even as the ADO importer evolves — the importer adapts to the
columns, not the other way around.

## 6. In-place validation grouping (manual only) — exception to "one AC per TC"

By default a TC verifies **one AC / one validation**. **Exception:** when several related checks are
verified on the **same screen/state without navigating away**, a single **manual** TC may group
them with paired step↔expected-result entries.

Conditions (all required):
- **Manual only.** Never for automation candidates — when a grouped TC is automated it is split into
  atomic specs (one assertion each, per [spec-authoring-aaa.md](spec-authoring-aaa.md)). So a TC
  using this exception keeps `Automation Status = Not Automated`.
- All validations happen on the **same screen/state**; no navigation between them.
- **Max 4 expected results** per TC.
- `AC Ref` lists **every** AC the TC covers (comma-separated); the coverage matrix credits each.
- Each expected result is **numbered to the step** it validates; those steps map to `ValidateStep`s.

Two flavors:
- **Behavioral form validation** — e.g. a field that accepts valid input and rejects
  non-numeric / negative / over-max, all on one form.
- **Data-mapping verification** — verifying a record's fields against the source on one screen.
  Split a large field group into **blocks of ≤4 fields** (one TC per block).

## 7. Step structure (team pattern, matches the ADO suite)

TCs follow the structure used by the team's reference suite (one action per step, module-level
navigation — no pixel-level clicks):

1. **Step 1 — `Precondition:`** then a numbered list (`1 - ...`, `2 - ...`) built from the
   `Preconditions` column (the `Test Data` column is appended as a `Test Data:` line). ActionStep, no expected.
2. **Login step** — explicit, e.g. `Login to the application under test`.
3. **Setup actions** — one action per step, referencing prior steps (e.g. `Create a new record
   ... and enable the relevant flag`).
4. **Verification** — `Login to <module> ...` / the checking action as a **ValidateStep**, with its
   expected result phrased `Validate ...`. Multiple verifications → multiple ValidateSteps (§6).

The `Validation` segment of the Test Case Name is phrased `Validate ...` to match the suite.

## 8. Upload to ADO — import format + test points (MANDATORY)

The 14-column CSV above is the **design/traceability artifact**. It **does not import** into ADO as-is
(its custom headers mis-map and the UI blocks) and REST uploads that skip test points leave cases
**not executable**. Both failures are prevented by the two rules below.

### 8.1 ADO import CSV (row-per-step) — the upload deliverable

Generate this from the canonical CSV (a converter). Exact schema (matches the team's working export),
**one row per step**:

```
ID,Work Item Type,Title,Test Step,Step Action,Step Expected,Area Path,Assigned To,State
```

- **UTF-8 with BOM**; quote non-empty fields, leave empty fields bare.
- Per TC: a **header row** `,"Test Case","<Test Case Name>",,,,"<Area Path>","<Name <email>>","Design"`,
  then **one row per step** `,,,"<n>","<Step Action>","<Step Expected>",,,`.
- **Step 1 = Precondition** (`Precondition:` + the numbered preconditions + a `Test Data:` line). Action
  steps leave `Step Expected` empty; each **verified** step is a row whose `Step Expected` holds its
  `Validate ...` text.
- `Title` = `Test Case Name`. `AC Ref`, `Type`, `Priority`, `Automation Status` are **not** in the import
  file — they stay in the canonical CSV for traceability. `State = Design`; `Area Path` per project.
- File lives beside the canonical CSV, suffix `-ado-import.csv`.

### 8.2 Test points are mandatory (executability)

A test case is executable only when it has a **test point** in its suite. Whatever the method:
- **UI import** of the §8.1 file creates the work items **and** test points automatically — **preferred**.
- **REST** must add each case with `pointAssignments:[{configurationId:<defaultConfigId>}]`. Use
  `ado_test_management.test_point_config_id` from `qa-config.yaml`, or discover it via
  `GET /_apis/testplan/configurations`. Adding a case to a suite **without** `pointAssignments`
  produces **0 points → Execute stays empty**.

### 8.3 Upload verification (every time — not optional)

- `GET /_apis/testplan/Plans/{plan}/Suites/{suite}/TestPoint` → **count == number of TCs** (verifying the
  *test-case* count is NOT enough). Confirm the **Execute** tab lists them.
- A fresh §8.1 CSV auto-maps in the UI import with **no "required fields" warning**.
- Diff the generated import CSV against a known-good export from the project → same column/row shape.
