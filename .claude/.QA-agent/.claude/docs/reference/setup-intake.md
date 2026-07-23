# Setup Intake — Canonical Standard

> **Single source of truth** for the `/qa-setup` NEW PROJECT path: the 7-question intake,
> the contract intake, and the **single `docs/qa-config.yaml`** generation template (which
> unifies the former lane config and architecture contract into one file). The whole file is presented
> once at **CP-1** before it is written. Read by `/qa-setup` **only when
> `docs/qa-config.yaml` is missing** — never loaded for existing projects.

Ask questions **one at a time**, waiting for each answer before showing the next.

Print this header first:

```
════════════════════════════════════════════════════════
 NEW PROJECT DETECTED
════════════════════════════════════════════════════════
 docs/qa-config.yaml not found.
 I'll ask you a few questions to configure this project.
 This file is the single source of truth for all QA agents.
────────────────────────────────────────────────────────
```

---

## Part A — identity & lanes intake (Q1–Q7)

### Q1 — Project identity

```
SETUP (1/7) — Project Identity

What is the display name of this project?
(This will appear in reports and the Quick Reference Card)

Example: "MyShop QA Automation" or "MyApp E2E Tests"
```

Store as SETUP_DISPLAY_NAME.

### Q2 — Tech stack

```
SETUP (2/7) — Tech Stack

Which test runner does this project use?

[1] Playwright (recommended)
[2] Cypress
[3] WebdriverIO
[4] Other (type it)
```

After their answer, ask immediately (same turn):

```
Which language?

[1] TypeScript (recommended)
[2] JavaScript
```

Store as SETUP_RUNNER and SETUP_LANGUAGE.

### Q3 — Lanes & styles

A **lane** is a track of automation. Its **name is a free purpose label** (e.g. `regression`,
`acceptance`, `checkout`); its **`style`** decides the pipeline — the name never does. Styles
(see [lane-styles.md](lane-styles.md)):

- `pom-spec` — Playwright spec files (Arrange-Act-Assert), uses page objects (POM)
- `bdd-gherkin` — Gherkin `.feature` files + step definitions, uses page objects (POM)
- `api-request` — Playwright `request` fixture, no browser, no page objects

```
SETUP (3/7) — Lanes

List the lanes you want. For each: a short purpose name and a style.
Example:  regression = pom-spec,  acceptance = bdd-gherkin,  api = api-request

Your lanes (name = style, comma-separated): ___
```

Store as SETUP_LANES = ordered list of `{ name, style }`. Then, **only if at least one lane is
`bdd-gherkin`**, ask the framework:

```
Which BDD framework?  [1] playwright-bdd  [2] @cucumber/cucumber  [3] other (type it)
```

Store as SETUP_BDD_FRAMEWORK (use "none" if no `bdd-gherkin` lane).

### Q4 — Shared page objects (skip if every lane is `api-request`)

```
SETUP (4/7) — Page Objects (POM, shared)

Where do the shared page objects live? Every pom-spec and bdd-gherkin lane uses this one dir.
Page objects directory: [default: src/pageObjects]
```

Store as SETUP_PAGE_OBJECT_DIR.

### Q5 — Lane paths (ask per lane, fields driven by its style)

```
SETUP (5/7) — Lane paths

For each lane in SETUP_LANES, ask only the fields its style requires:

pom-spec lane:      test_dir [default: src/tests/ui-tests]
                    project_name, run_command
bdd-gherkin lane:   feature_dir [default: features/{lane-name}]
                    step_dir [default: src/step-defination]
                    generated_dir [default: .features-gen]
                    gen_command [default: npx bddgen]
                    project_name, run_command
api-request lane:   test_dir [default: src/tests/api-tests]
                    helper_dir [default: src/api-helpers]
                    base_url_env_var [default: API_URL]
                    project_name, run_command
```

Store per lane as SETUP_LANE_{name}_*.

### Q6 — Environment variables

```
SETUP (6/7) — Environment Variables

What environment variables does this project require?

Required (tests will fail without these — e.g. URL, USERNAME, PASSWORD):
Type them comma-separated: ___

Optional (tests warn if missing — e.g. AZURE_DEVOPS_PAT):
Type them comma-separated (or press Enter to skip): ___
```

Store as SETUP_ENV_REQUIRED and SETUP_ENV_OPTIONAL.

### Q7 — ADO integration

```
SETUP (7/7) — Azure DevOps Integration

Does this project connect to Azure DevOps for work items?

[1] Yes — I have an ADO organization and project
[2] No — we use PBI docs or another tracker
```

If Yes, ask:
```
ADO Organization name: ___
ADO Project name:      ___

Optional — ADO Test Plan (for uploading manual test cases; Enter to skip any):
Test Plan id:                 ___
Test Suite id:                ___
Test-point configuration id:  ___
Area path:                    [default: the ADO project name]

Optional — ADO wiki page for release/hotfix certificates:
Releases wiki path:           [default: /Releases]
```

If No, store empty strings. Store as SETUP_ADO_ORG, SETUP_ADO_PROJECT, SETUP_ADO_TM_*
and SETUP_WIKI_RELEASES_PATH. All Test Plan / wiki values are optional — when blank, the
consumers (`tc-csv-template.md` §8, `/qa-release-report` certificate mode) fall back to
REST discovery or ask the user.

---

## Part B — contract intake (feeds the CP-1 sections)

The architecture-contract sections of `docs/qa-config.yaml` feed the cross-lane skills.
Collect them with this short intake, asking the blocks **one at a time** (the answers from
Part A — runner, language, BDD, paths — are reused, not re-asked):

> **If an approved Testing Strategy document exists** (produced by the
> `qa-testing-strategy-architect` skill), use its chosen option as the source of the
> defaults below (approach, pyramid, gates, data policy) and only confirm deviations.
> `/qa-setup` remains the sole writer of `docs/qa-config.yaml` (CP-1).

```
CONTRACT (1/4) — Test strategy
  Approach: [1] BDD  [2] TDD          Regression schedule: [default: nightly]
  Smoke budget in minutes:            [default: 10]
```

```
CONTRACT (2/4) — Test data policy
  Data mode: [1] synthetic  [2] anonymized production  [3] mixed
  Does any test data contain PII (personal data)? [y/N]
  Cleanup policy: [default: after_suite]
```

```
CONTRACT (3/4) — CI/CD
  Platform: [1] Azure DevOps  [2] GitHub Actions  [3] other
  PR gates: [default: smoke, static_analysis]
  QA environment URL env-var name: [default: URL]
```

```
CONTRACT (4/4) — Enabled cross-lane agents
  Which agents should be active? (comma-separated or Enter for default)
  [default: reviewer, cicd, test-data, metrics, clean-code]
  (security-accessibility and observability are opt-in)
```

Store as CONTRACT_* (approach, schedule, smoke_minutes, data_mode, has_pii, cleanup,
platform, pr_gates, url_env_var, enabled_agents).

---

## Part C — Generate `docs/qa-config.yaml` (single file, CP-1)

There is **one** config file now — the lane sections (Part A) and the contract sections
(Part B) live together. Build the **whole draft first**, present it once at **CP-1**, and
write it only on approval.

Assemble the draft from `.claude/qa-config.yaml`, filling every value from SETUP_* and
CONTRACT_* (fill `meta.created_at` / `last_updated` with today, `meta.owner` with the user's
name if known, `meta.project_id` = `project_identity.project_key`):

```yaml
version: 3
status: active
updated_at: '{today}'

meta:
  project_id: '{slugified SETUP_DISPLAY_NAME}'
  schema_version: '2.0.0'
  created_at: '{today}'
  last_updated: '{today}'
  owner: '{user name if known}'

project_identity:
  project_key: '{slugified SETUP_DISPLAY_NAME — lowercase, hyphens}'
  display_name: '{SETUP_DISPLAY_NAME}'
  ado_organization: '{SETUP_ADO_ORG}'   # blank = ADO disabled
  ado_project: '{SETUP_ADO_PROJECT}'

ado_test_management:                    # optional — blank values fall back to REST discovery
  area_path: '{SETUP_ADO_TM_AREA_PATH}'
  test_plan_id: '{SETUP_ADO_TM_PLAN_ID}'
  test_suite_id: '{SETUP_ADO_TM_SUITE_ID}'
  test_point_config_id: '{SETUP_ADO_TM_POINT_CONFIG_ID}'

wiki:                                   # optional — /qa-release-report certificate publishing
  releases_path: '{SETUP_WIKI_RELEASES_PATH}'

automation:
  test_runner: '{SETUP_RUNNER}'
  language: '{SETUP_LANGUAGE}'
  bdd_framework: '{SETUP_BDD_FRAMEWORK}'          # 'none' if no bdd-gherkin lane
  config_file: 'playwright.config.ts'
  page_object_dir: '{SETUP_PAGE_OBJECT_DIR}'      # omit if every lane is api-request

# One entry per lane in SETUP_LANES. Emit only the fields the lane's style requires
# (see lane-styles.md). The lane KEY is its purpose name; `style` drives everything else.
lanes:
  {for each lane in SETUP_LANES}:
    enabled: true
    style: '{lane.style}'                          # pom-spec | bdd-gherkin | api-request
    # pom-spec →
    test_dir: '{SETUP_LANE_test_dir}'
    fixture_file: 'src/fixtures/users.fixture.ts'
    # bdd-gherkin →
    feature_dir: '{SETUP_LANE_feature_dir}'
    step_dir: '{SETUP_LANE_step_dir}'
    generated_dir: '{SETUP_LANE_generated_dir}'
    gen_command: '{SETUP_LANE_gen_command}'
    # api-request →
    test_dir: '{SETUP_LANE_test_dir}'
    helper_dir: '{SETUP_LANE_helper_dir}'
    base_url_env_var: '{SETUP_LANE_base_url_env_var}'
    openapi_spec: ''
    # all styles →
    project_name: '{SETUP_LANE_project_name}'
    run_command: '{SETUP_LANE_run_command}'
    smoke_command: 'npx playwright test --project={SETUP_LANE_project_name} --grep @smoke'
    report_command: 'npx playwright show-report'

environment_variables:
  required: [{SETUP_ENV_REQUIRED as yaml list}]
  optional: [{SETUP_ENV_OPTIONAL as yaml list}]
  custom: []

quality_gates:
  ac_coverage: 100
  max_tcs_per_wave: 10
  pr_checkpoint_required: true

locator_strategy:
  priority:
    - getByRole()
    - getByLabel()
    - getByTestId()
    - getByText()
    - CSS attribute
  forbidden:
    - XPath
    - nth()
    - first()

stack:
  language: '{SETUP_LANGUAGE}'
  ui_framework: ''
  backend_language: ''
  db_type: ''
  cloud_provider: ''
  mobile_platform: null

test_strategy:
  approach: '{CONTRACT_APPROACH}'          # bdd | tdd
  pyramid: { unit: 60, api: 25, ui: 15 }
  regression_schedule: '{CONTRACT_SCHEDULE}'
  smoke_max_minutes: {CONTRACT_SMOKE_MINUTES}

structure:
  root_dir: 'src/'
  folders: { pages: '', fixtures: '', helpers: '', data: '', reports: '' }
  naming_conventions:
    spec_suffix: '.spec.ts'
    step_suffix: '.steps.ts'
    page_object_suffix: 'Page.ts'
  selector_strategy: 'role-first'
  reporter: 'html'

test_data:
  mode: '{CONTRACT_DATA_MODE}'
  isolation_strategy: { e2e: 'tenant_prefix', api: 'transaction_rollback' }
  has_pii: {CONTRACT_HAS_PII}
  pii_fields: []
  pii_anonymization_approved: false
  cleanup_policy: '{CONTRACT_CLEANUP}'
  credential_source: '.env'
  tenant_prefix_pattern: 'qa-{run_id}-'

agents_config:
  enabled_agents: [{CONTRACT_ENABLED_AGENTS as yaml list}]
  mutation_score_threshold: 70
  flakiness_threshold_pct: 5
  healer_auto_trigger: false
  security_scan: { tools: [], blocking_severity: 'critical' }
  accessibility: { standard: 'WCAG 2.1 AA', blocking: false }
  observability_provider: 'none'

cicd:
  platform: '{CONTRACT_PLATFORM}'
  pr_gates: [{CONTRACT_PR_GATES as yaml list}]
  branch_protection: { main: [all_gates] }
  environments:
    - name: 'qa'
      url_env_var: '{CONTRACT_URL_ENV_VAR}'
      allowed_operations: [read, write, reset]
      production_like: false
  canary_config: null

synthetic_monitoring: null
production_feedback: null
hitl_log: []
```

Then:
1. Validate the draft has all required sections (`meta`, `project_identity`, `automation`,
   `lanes`, `quality_gates`, `stack`, `test_strategy`, `structure`, `test_data`,
   `agents_config`, `cicd`).
2. Present the **whole file** for **CP-1 approval** as a CHECKPOINT block per
   [output-style.md](output-style.md). No lane or cross-lane skill runs until CP-1 is approved.
3. On approval, append to `hitl_log`:
   `{ id: CP-1, decision: approved, by: '{user}', at: '{ISO date}' }`, write
   `docs/qa-config.yaml`, and print `✅ docs/qa-config.yaml created successfully.`

**Amendments:** to change an approved contract value later, append a `CP-AMEND-{n}` entry to
`hitl_log` with what changed and why — never silently edit the file.
