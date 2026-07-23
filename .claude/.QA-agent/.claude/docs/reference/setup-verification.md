# Setup Verification — Canonical Standard

> **Single source of truth** for the `/qa-setup` Phase 1 environment verification:
> what to check and the exact report format. Used on **both** paths (new and existing
> projects). All paths/names come from `docs/qa-config.yaml` — never hardcode.

Run all checks immediately. Do not ask questions during verification.

Read `docs/qa-config.yaml` and store: `project_identity.display_name` → PROJECT_NAME;
`automation.*` → STACK; every enabled lane (`name`, `style`, paths);
`environment_variables` → EXPECTED_ENV_VARS. Each lane's `style` (see
[lane-styles.md](lane-styles.md)) decides which fields to verify.

## Checks

### 1. Project structure
Read each path (from the yaml when available) and mark ✅ EXISTS / ❌ MISSING:
`{automation.page_object_dir}/` (if any pom-spec/bdd-gherkin lane), `docs/qa-config.yaml`,
`{automation.config_file}`, `.env`, and per enabled lane by its style —
pom-spec: `{lane.test_dir}/`, `{lane.fixture_file}`;
bdd-gherkin: `{lane.feature_dir}/`, `{lane.step_dir}/`;
api-request: `{lane.test_dir}/`, `{lane.helper_dir}/`.

### 2. Dependencies
Read `package.json` devDependencies: `@playwright/test`, `playwright-bdd` (only if any
bdd-gherkin lane exists), `dotenv`, `@types/node` → ✅/❌ each.

### 3. Test-runner config
Read `{automation.config_file}` and verify: for each enabled lane, a project matching
`{lane.project_name}` with the correct `testDir`/`bddTestDir` → ✅/❌; `dotenv.config()`
called → ✅/❌; `defineBddConfig` imported from `playwright-bdd` (only if a bdd-gherkin
lane exists) → ✅/❌.

### 4. Environment variables
Compare `.env` against EXPECTED_ENV_VARS: each `required` var set → ✅/❌; each
`optional`/`custom` var set → ✅/⚠️ (warning only).

### 5. BDD stack (only if a bdd-gherkin lane exists)
For each bdd-gherkin lane, `{lane.generated_dir}` exists → ✅ (bddgen run) / ⚠️ (run
`gen_command` first).

## Report format

```
════════════════════════════════════════════════════════
 QA ENVIRONMENT VERIFICATION — {PROJECT_NAME}
════════════════════════════════════════════════════════

PROJECT STRUCTURE
  ✅/❌  {each path checked}

DEPENDENCIES (package.json)
  ✅/❌  {each package}

TEST RUNNER CONFIGURATION
  ✅/❌  Project {lane.project_name} ({lane name} · {style})   [one line per enabled lane]
  ✅/❌  dotenv loaded
  ✅/❌  BDD configured with defineBddConfig

ENVIRONMENT VARIABLES
  ✅/❌  {VAR_NAME}  (required)
  ✅/⚠️  {VAR_NAME}  (optional)

BDD STACK
  ✅/⚠️  {generated_dir} (generated test files)

────────────────────────────────────────────────────────
SUMMARY:  {n} checks passed | {n} warnings | {n} failures
════════════════════════════════════════════════════════
```

If any ❌ exist, follow with a prioritized fix list:

```
ACTION REQUIRED
───────────────────────────────────────
[1] {specific fix instruction}
[2] {specific fix instruction}
```

If all ✅ (warnings acceptable): print `Environment is ready. Starting onboarding...`

Proceed to onboarding regardless of warnings. ❌ failures are noted (and become the first
step on the Quick Reference Card) but do not block onboarding.
