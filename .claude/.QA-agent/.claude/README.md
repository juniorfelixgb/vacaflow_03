# Claude QA Agents — Portable Toolkit

This `.claude/` folder contains all the QA agents, commands, and standards for Claude Code.
It is **self-contained**: copy and paste it into any Playwright + TypeScript project and it works.

---

## What's in here?

```
.claude/
├── commands/           Claude Code slash commands (thin orchestrators)
│   ├── qa-orchestrator.md   Central orchestrator — start here
│   ├── qa-task.md           Short-block HITL runner (intake → ToDo → execute → summary)
│   ├── qa-lane.md           Implement tests for a lane — pipeline chosen by the lane's style
│   │                        (pom-spec | bdd-gherkin | api-request)
│   ├── qa-loop.md           Autonomous 3-phase pipeline with review gates
│   ├── qa-docs.md           SDLC documentation pipeline (strategy → plan → cases → UAT → report)
│   ├── qa-setup.md          Setup and onboarding for a new project
│   └── qa-release-report.md Release quality report OR hotfix/deployment certificate + CP-SIGNOFF
│
├── skills/             Skills that Claude activates automatically (thin wrappers)
│   ├── hitl-workflow/       Short-block HITL cadence (intake → ToDo → execute → summary)
│   ├── sdlc-visual-docs/    Terminal-first visual presentation (tables, badges, bars)
│   ├── gherkin-authoring/   Writing and optimizing .feature files
│   ├── page-object-authoring/ Creating Page Objects (POM)
│   ├── spec-authoring/      Writing specs (AAA pattern)
│   ├── locator-strategy/    Locator strategy (getByRole, etc.)
│   ├── coverage-matrix/     Coverage matrix, AC analysis, quality gates
│   ├── api-testing/         API specs with the request fixture (contracts, schemas)
│   ├── manual-test-design/  Manual TCs + exploratory charters (no code)
│   ├── bug-reporting/       Severity-classified bug proposals (CP-5)
│   ├── failure-healing/     Diagnosing and repairing failed tests
│   ├── ado-fetch/           Azure DevOps integration
│   ├── qa-testing-strategy-architect/ 4-phase Testing Strategy definition (scored options)
│   │                        — cross-lane, stack-neutral (read docs/qa-config.yaml contract sections):
│   ├── reviewer/            Merge gate: static analysis + mutation + execution
│   ├── cicd/                Pipeline gen, PR gates, failure classification, canary
│   ├── test-data/           Data lifecycle, isolation, PII, cleanup
│   ├── security-accessibility/ Dep scan, DAST, WCAG checks
│   ├── metrics/             Quality aggregation, dashboard, sprint summary
│   ├── observability/       Shift-right: prod feedback, canary thresholds
│   └── clean-code/          End-of-cycle test-code refactor (proposal-only)
│
├── agents/             Subagents — verbose work in isolated context
│   ├── qa-reviewer.md       3-level quality review; returns a compact verdict
│   └── qa-healer.md         Batch diagnose→fix→re-run loop; returns a heal report
│
├── docs/
│   ├── qa_templates/   Concrete file samples (non-canonical)
│   │   └── test_cases_azure_template.csv   ADO row-per-step import example (tc-csv-template.md §8.1)
│   └── reference/      Canonical rules — the ONLY place rules live
│       ├── gherkin-standards.md
│       ├── step-definition-standards.md
│       ├── page-object-standards.md
│       ├── locator-strategy.md
│       ├── spec-authoring-aaa.md
│       ├── api-testing.md
│       ├── manual-test-design.md
│       ├── tc-csv-template.md              Manual-TC CSV contract + ADO Test Plan upload
│       ├── bug-report-standard.md
│       ├── coverage-matrix.md
│       ├── failure-healing.md
│       ├── ado-integration.md
│       ├── log-format.md
│       ├── output-style.md
│       ├── hitl-workflow.md
│       ├── visual-presentation.md
│       ├── setup-intake.md
│       ├── setup-verification.md
│       ├── quick-reference-card.md
│       ├── reviewer.md
│       ├── cicd.md
│       ├── test-data.md
│       ├── security-accessibility.md
│       ├── metrics.md
│       ├── observability.md
│       ├── clean-code.md
│       ├── qa-decisions-log.md             QD-NN / EV-NN auditable decision record
│       ├── testing-strategy-template.md    ┐ 4-phase Testing Strategy set
│       ├── testing-strategy-intake-checklist.md   │ (qa-testing-strategy-architect,
│       ├── testing-strategy-analysis-framework.md │  shared by /qa-docs DISCOVER)
│       ├── testing-strategy-option-patterns.md    ┘
│       ├── test-plan-template.md           ┐ SDLC document templates
│       ├── test-report-template.md         │
│       ├── uat-plan-template.md            │
│       └── deployment-certificate-template.md ┘ hotfix/release QA certificate
│
├── qa-config.yaml      TEMPLATE → generated as the single docs/qa-config.yaml by /qa-setup
│                        (lane config + architecture contract; contract approved at CP-1)
├── settings.json       Shared Claude Code settings (portable — committed)
├── settings.local.json Machine-specific settings (gitignored — never committed)
├── CLAUDE.md           Token-discipline rules for Claude Code
└── README.md           This file
```

### settings.json vs settings.local.json

- `settings.json` holds only **portable** configuration (e.g. env defaults) and ships
  with the toolkit.
- `settings.local.json` holds **machine-specific** entries (absolute paths, personal
  permission grants). It is gitignored — Claude Code creates/extends it per machine.
  Never put absolute paths in `settings.json`.

---

## How to use in a new project

### Step 1 — Copy this folder
```
cp -r .claude/ /path/to/your/new-project/
```

### Step 2 — Add CLAUDE.md to the root
Claude Code requires a `CLAUDE.md` file at the project root. Minimum content:

```markdown
# CLAUDE.md — <Project Name> QA Automation

## Config — never hardcode
All paths, commands, env-var lists, thresholds, stack and policy come from the single
`docs/qa-config.yaml`. Lane skills read the lane sections; cross-lane skills read the
contract sections.

## Architecture invariant
Rules live in `.claude/docs/reference/` only. Skills are thin wrappers;
commands are thin orchestrators. Never copy a rule into a command or skill.

## Commands
Start every session with `/qa-orchestrator`. Use `/qa-setup` for onboarding.
```

Adjust stack details as needed.

### Step 3 — Configure the project
Open Claude Code in the new project and run:
```
/qa-setup
```
The agent detects that `docs/qa-config.yaml` does not exist, asks you the intake questions,
and generates the **single** runtime config file:
- `docs/qa-config.yaml` — lane sections (lanes, paths, commands, thresholds) **and** contract
  sections (stack, strategy, data policy, enabled agents), the contract approved at checkpoint **CP-1**

### Step 4 — Start working
```
/qa-orchestrator
```

---

## Information flow

```
docs/qa-config.yaml        ← single config: lane sections (paths, commands, thresholds)
                             + contract sections (stack, policy, enabled agents)
    ↓ read by
.claude/commands/          ← orchestrate the workflow
    ↓ activate                          ↓ delegate batch work
.claude/skills/            ← thin     .claude/agents/  ← subagents (reviewer,
   wrappers that point to the rules      healer) run in isolated context
    ↓ read                               ↓ read (same rules)
.claude/docs/reference/    ← canonical rules (ONLY changed here)
```

**Golden rule:** If a rule changes (e.g. a new locator strategy),
update it only in `.claude/docs/reference/` — never in commands or skills.

---

## Where does project information go?

| Type of information | Where it goes |
|---|---|
| Paths, commands, thresholds, lanes | `docs/qa-config.yaml` lane sections (target project) |
| Stack, strategy, data policy, enabled agents | `docs/qa-config.yaml` contract sections (target project) |
| PBIs / user stories / acceptance criteria | `docs/pbi/` (target project) |
| Credentials, URLs, PATs | `.env` (target project, never in git) |
| QA rules (locators, gherkin, etc.) | `.claude/docs/reference/` |
| Claude agents | `.claude/commands/`, `.claude/skills/`, `.claude/agents/` |

The agents look for `docs/qa-config.yaml` at the project root. If it doesn't exist,
`/qa-setup` creates it by guiding the user through questions.

---

## GitHub Copilot (planned / maintained externally)

A parallel Copilot agent set (`.github/agents/`) is planned and maintained outside this
repo. When it exists, it should consume the same canonical rules in
`.claude/docs/reference/` — the standards are tool-neutral. `.claude/` and
`.github/agents/` can move independently without breaking each other.
