# CLAUDE.md — QA Multiagent Toolkit

This repo is a **portable Claude Code QA toolkit**: commands, skills, subagents, and
canonical reference docs for QA automation with **Playwright + TypeScript + playwright-bdd**
(Page Object Model). It contains **no test code** — the toolkit is copied into target
projects (see `.claude/README.md`) and configured there by running `/qa-setup`.

## Repo map

| Path | What it is |
|------|------------|
| `.claude/commands/` | Slash commands — thin orchestrators |
| `.claude/skills/` | Skills — thin wrappers over canonical rules |
| `.claude/agents/` | Subagents (`qa-reviewer`, `qa-healer`) — verbose batch work in isolated context; same canonical rules |
| `.claude/docs/reference/` | **Canonical rules — the only place rules live** |
| `.claude/qa-config.yaml` | Template → generated as the single `docs/qa-config.yaml` in target projects (lane config + architecture contract; contract sections approved at CP-1) |
| `docs/QA-AGENTS-GUIDE.md` | User-facing guide for the QA team |

## Architecture invariant (never break it)

**Rules live in `.claude/docs/reference/` only.** Skills are thin wrappers that point to
them; commands are thin orchestrators that route and gate. Never copy a rule into a
command or a skill. When a rule changes, change it in the reference doc — nowhere else.

## Config files — never hardcode

`docs/qa-config.yaml` (generated in the target project) is the **single** config file. It has
two groups of sections:

- **Lane/runtime sections** (`project_identity`, `automation`, `lanes`,
  `environment_variables`, `quality_gates`, `locator_strategy`): paths, Playwright project
  names, commands, env-var lists, quality-gate thresholds. Lane commands and lane skills read these.
- **Contract sections** (`stack`, `test_strategy`, `structure`, `test_data`, `agents_config`,
  `cicd`), generated at CP-1: stack, test strategy, structure, data policy, enabled agents,
  CI/CD. Cross-lane stack-neutral skills (`reviewer`, `cicd`, `test-data`,
  `security-accessibility`, `metrics`, `observability`, `clean-code`) read these and only
  activate for agent ids in `agents_config.enabled_agents`.

## Where the standards live

| Topic | Reference (canonical) | Skill |
|-------|----------------------|-------|
| Locators | `.claude/docs/reference/locator-strategy.md` | `locator-strategy` |
| Page objects | `.claude/docs/reference/page-object-standards.md` | `page-object-authoring` |
| Specs (AAA) | `.claude/docs/reference/spec-authoring-aaa.md` | `spec-authoring` |
| Gherkin | `.claude/docs/reference/gherkin-standards.md` | `gherkin-authoring` |
| Step defs | `.claude/docs/reference/step-definition-standards.md` | `gherkin-authoring` |
| API tests (request fixture) | `.claude/docs/reference/api-testing.md` | `api-testing` |
| Coverage & gates | `.claude/docs/reference/coverage-matrix.md` | `coverage-matrix` |
| Manual TCs & exploratory charters | `.claude/docs/reference/manual-test-design.md` | `manual-test-design` |
| Manual-TC CSV export + ADO Test Plan upload | `.claude/docs/reference/tc-csv-template.md` | `manual-test-design` |
| Hotfix / deployment QA certificate | `.claude/docs/reference/deployment-certificate-template.md` | (via `/qa-release-report` certificate mode) |
| Test strategy (SDLC doc) | `.claude/docs/reference/testing-strategy-template.md` + `testing-strategy-{intake-checklist,analysis-framework,option-patterns}.md` | `qa-testing-strategy-architect` |
| Test plan / UAT plan / test report (SDLC docs) | `.claude/docs/reference/{test-plan,uat-plan,test-report}-template.md` | `qa-testing-strategy-architect` |
| QA decisions log (QD-NN / EV-NN, auditable record) | `.claude/docs/reference/qa-decisions-log.md` | `qa-testing-strategy-architect` |
| Bug reports (manual + CP-5) | `.claude/docs/reference/bug-report-standard.md` | `bug-reporting` |
| ADO fetch | `.claude/docs/reference/ado-integration.md` | `ado-fetch` |
| Failure healing | `.claude/docs/reference/failure-healing.md` | `failure-healing` |
| Reviewer / merge gate | `.claude/docs/reference/reviewer.md` | `reviewer` |
| CI/CD pipeline | `.claude/docs/reference/cicd.md` | `cicd` |
| Test data / fixtures / PII | `.claude/docs/reference/test-data.md` | `test-data` |
| Security & accessibility | `.claude/docs/reference/security-accessibility.md` | `security-accessibility` |
| Metrics & reporting | `.claude/docs/reference/metrics.md` | `metrics` |
| Observability (shift-right) | `.claude/docs/reference/observability.md` | `observability` |
| Clean code / refactor | `.claude/docs/reference/clean-code.md` | `clean-code` |
| qa-loop log format | `.claude/docs/reference/log-format.md` | (reference only) |
| Output & checkpoint format (chat) | `.claude/docs/reference/output-style.md` | (reference only) |
| HITL short-block cadence (intake→ToDo→execute→summary) | `.claude/docs/reference/hitl-workflow.md` | `hitl-workflow` |
| Visual presentation (terminal-first tables/badges/bars) | `.claude/docs/reference/visual-presentation.md` | `sdlc-visual-docs` |

## Commands

- `/qa-task` — run any prompt as short human-reviewable blocks (intake → ToDo approval → execute point-by-point → summary)

- `/qa-orchestrator` — route work to a lane + enforce gates (start every session here)
- `/qa-lane <name>` — implement tests for a lane end-to-end; the lane's `style` (`pom-spec` |
  `bdd-gherkin` | `api-request`), not its name, selects the pipeline and authoring skills
  (ADO → coverage → author → run → heal). See `.claude/docs/reference/lane-styles.md`.
- `/qa-loop` — autonomous 3-phase pipeline with review gates
- `/qa-docs` — SDLC documentation pipeline (discover → decisions log → strategy → plan → cases → UAT → report), one human gate per artifact
- `/qa-setup` — onboarding + environment verification + single `qa-config.yaml` generation (CP-1)
- `/qa-release-report` — release quality report (aggregates via `metrics`) OR hotfix/deployment QA certificate (`certificate|hotfix|deployment` first arg) + CP-SIGNOFF go/no-go

## Target project layout (what /qa-setup creates/expects in consumer repos)

The paths below describe the **target project**, not this repo. A lane's **name** is a free
purpose label; its **`style`** decides the layout. The example lanes below use purpose names
(`regression`, `acceptance`, `api`) — a lane named `regression` could carry any style.

| Lane (example name) | Style | Owns | Project | Page objects |
|------|-------|------|---------|--------------|
| `regression` | `pom-spec` | `src/tests/ui-tests` (`*.spec.ts`) | `UI-Tests` | shared |
| `acceptance` | `bdd-gherkin` | `features/acceptance` + `src/step-defination` | `BDD-Acceptance` | shared |
| `api` (opt-in) | `api-request` | `src/tests/api-tests` (`*.api.spec.ts`) + `src/api-helpers` | `API-Tests` | none — `request` fixture only |

Page objects live at `automation.page_object_dir` (`src/pageObjects`) and are **shared** by
every `pom-spec` and `bdd-gherkin` lane. A lane must not edit another lane's owned zone; all
POM-using lanes may edit the shared page objects. `/qa-lane` derives these zones from each
lane's `style` — never from its name.

Code conventions enforced in target projects:

- Page objects **extend `BasePage`**; use fixtures (`authenticatedPage`, page-object
  fixtures) instead of `new XPage(page)` in tests/steps.
- Locators follow `.claude/docs/reference/locator-strategy.md`: getByRole → getByLabel →
  getByTestId → getByText → CSS. **Never** XPath, `nth()`, `first()`.
- Credentials/URLs via `process.env.*` (prefer the `src/test-data` credential sets).
  Never hardcode credentials.
- Never `page.waitForTimeout()`; wait for state via `src/utils/waits.ts` (`waitForAppReady`).
- One `test()`/scenario per AC item; tests independent (no shared state).

Known quirk: `src/step-defination` is misspelled but is the **configured** step dir (wired
into `playwright.config.ts` and `docs/qa-config.yaml`). Leave it; renaming is a separate
config-only follow-up since all paths are read from `qa-config.yaml`.

## GitHub Copilot (planned / maintained externally)

A parallel Copilot agent set (`.github/agents/`) is planned and maintained outside this
repo. The canonical standards in `.claude/docs/reference/` are tool-neutral and meant to be
shared — when a rule changes, change it there, not in a command/skill/Copilot copy.
