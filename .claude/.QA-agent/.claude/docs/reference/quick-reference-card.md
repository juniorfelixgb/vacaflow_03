# Quick Reference Card — Canonical Template

> **Single source of truth** for the personalized card `/qa-setup` prints at the end of
> onboarding. Fill every placeholder from `docs/qa-config.yaml` and the onboarding answers.
> Read only when Phase 3 (card generation) is reached.

```
════════════════════════════════════════════════════════
 QUICK REFERENCE CARD
 {Name} — {Role} — {today's date}
════════════════════════════════════════════════════════

PROJECT: {project_identity.display_name}
FRAMEWORK: {automation.test_runner} + {automation.language} + {automation.bdd_framework}

YOUR LANE(S): {selected lane(s), each as  name · style}
FIRST TASK: {what they said}

────────────────────────────────────────────────────────
 KEY COMMANDS FOR YOUR LANE(S)
────────────────────────────────────────────────────────

  /qa-orchestrator       Start or continue a session
  /qa-lane {name}        End-to-end implementation for a lane (pipeline by its style)

[For each selected lane, by its style:]
  {name} · pom-spec      Run: {lane.run_command}   Smoke: {lane.smoke_command}   Report: {lane.report_command}
  {name} · bdd-gherkin   Generate: {lane.gen_command}   Run: {lane.run_command}   Report: {lane.report_command}
  {name} · api-request   Run: {lane.run_command}   Smoke: {lane.smoke_command}   Report: {lane.report_command}

────────────────────────────────────────────────────────
 KEY FILES TO KNOW
────────────────────────────────────────────────────────
  {automation.page_object_dir}/    Page Object classes (shared: pom-spec + bdd-gherkin lanes)
  [per pom-spec / api-request lane]  {lane.test_dir}/   test specs
  [per bdd-gherkin lane]  {lane.step_dir}/   step implementations · {lane.feature_dir}/   feature files
  .env                             Environment variables (never commit)
  docs/qa-config.yaml              Single config for all agents (lanes + contract)
  {automation.config_file}         Test runner configuration

────────────────────────────────────────────────────────
 LOCATOR PRIORITY  (full rules: .claude/docs/reference/locator-strategy.md)
────────────────────────────────────────────────────────
  1. getByRole()     2. getByLabel()    3. getByTestId()
  4. getByText()     5. CSS attribute
  Never: XPath, nth(), first()

────────────────────────────────────────────────────────
 QUALITY GATES  (full rules: .claude/docs/reference/coverage-matrix.md)
────────────────────────────────────────────────────────
  {quality_gates.ac_coverage}% AC coverage before implementation
  Max {quality_gates.max_tcs_per_wave} TCs per wave — PR review before next wave
  No hardcoded credentials — always use process.env.*
  Each test must be independent (no shared state between tests)

────────────────────────────────────────────────────────
 WHERE THE STANDARDS LIVE
────────────────────────────────────────────────────────
  .claude/docs/reference/   Canonical rules (locators, page objects, specs,
                    gherkin, steps, coverage, ADO, healing, output, logs)
  .claude/skills/   Skills that surface those rules on demand
  docs/qa-config.yaml Single config source (paths, commands, thresholds, contract)

────────────────────────────────────────────────────────
 YOUR FIRST 3 STEPS
────────────────────────────────────────────────────────

[Adapt based on first task answer and the chosen lane's style:]

If ADO work item + a bdd-gherkin lane:
  1. Run: /qa-lane {name} {ADO-ID}
  2. Review the generated .feature file
  3. Run: {lane.gen_command}

If ADO work item + a pom-spec or api-request lane:
  1. Run: /qa-lane {name} {ADO-ID}
  2. Review the coverage matrix
  3. Run: {lane.run_command}

If module name provided:
  1. Run: /qa-orchestrator → type "Start"
  2. Select lane and scope
  3. Follow orchestrator routing

If exploring:
  1. Run: {any lane's run_command}
  2. Browse {automation.page_object_dir}/ for POM structure
  3. Browse a bdd-gherkin lane's {lane.feature_dir}/ for feature structure

════════════════════════════════════════════════════════
 To re-run setup: /qa-setup
════════════════════════════════════════════════════════
```

Rules: if Phase 1 verification left any ❌ failure, its fix is **step 1** on the card.
Omit lane blocks whose lane is `enabled: false` or not selected.
