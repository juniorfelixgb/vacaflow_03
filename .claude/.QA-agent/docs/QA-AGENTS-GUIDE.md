# QA Automation Agents — User Guide

**Toolkit:** Portable Claude Code QA agent set (works on any Playwright + TypeScript project)
**Tool:** Claude Code
**Last updated:** 2026-07-16

---

## What Are These Agents?

This project uses **Claude Code slash commands** — AI agents you activate by typing `/command-name` directly in the Claude Code chat. Each command runs a full automated pipeline, from reading your work item to writing and executing tests.

There are **7 commands** available:

| Command | Purpose | When to use |
|---|---|---|
| `/qa-setup` | Environment verification + team onboarding | First time on the project |
| `/qa-orchestrator` | Session entry + routing + quality gate | Every session start |
| `/qa-task` | Run any request as short, approve-as-you-go blocks | Any task/improvement you want planned and approved before work starts |
| `/qa-lane <name>` | Full lane pipeline (ADO → coverage → author → run → heal). The lane's `style` — not its name — decides whether it authors POM specs, Gherkin scenarios, or API request tests | Automating test cases for a specific lane, step by step |
| `/qa-loop` | **Autonomous 3-phase pipeline with log + review gates** | Full end-to-end automation of a work item with minimal intervention |
| `/qa-docs` | SDLC documentation pipeline (strategy → plan → cases → UAT → report) | Producing the formal QA document set, one human gate per artifact |
| `/qa-release-report` | Release quality report + sign-off gate (CP-SIGNOFF) | Sprint close or release readiness — executive summary + technical appendix |

---

## Where This Fits in the SDLC

This toolkit doesn't own the whole delivery process — it owns QA's phase inside it. In this
organization's SDLC (**Velocity**), that's a 9-phase numbered tree:

```
documentation/
├── 00-business/       the business case
├── 01-understand/     discovery, stakeholders
├── 02-define/         scope, vision
├── 03-requirements/   FRs, business rules, NFRs, traceability
├── 04-architecture/   the stack, quality-attribute weights
├── 05-planning/       backlog, roadmap, dates
├── 06-governance/     gates, who approves what
├── 07-development/    tech decisions, defect log
└── 08-testing/        ← QA owns this phase. /qa-docs writes here.
```

The agents split into two connected pipelines that live in phase 08 but read upstream from
phases 00–07.

### 1. Documentation — `/qa-docs`

`/qa-docs`'s first step, **DISCOVER**, inventories upstream artifacts *by type*, not by a
hardcoded folder name (the extraction sources live in
`.claude/docs/reference/testing-strategy-intake-checklist.md`) — so the same pipeline works
regardless of what your org calls its phases. In this project's Velocity tree, that lookup
maps to:

| Artifact type `/qa-docs` looks for | Velocity phase |
|---|---|
| Business case / strategic intake | `00-business/`, `01-understand/` |
| Functional spec, business rules, NFRs, traceability | `03-requirements/` |
| Architecture docs, quality-attribute weights | `04-architecture/` |
| Backlog / roadmap | `05-planning/` |
| Governance / approval gates | `06-governance/` |
| Tech decisions, defect log | `07-development/` |

From there `/qa-docs` runs DECISIONS (scored strategy options, `qa-decisions.md`) and then
GENERATE (Testing Strategy → Test Plan → manual test cases → UAT Plan → Test Report), one
human checkpoint per artifact, all written into `08-testing/`.

### 2. Automation-Implementation — `/qa-setup` → `/qa-orchestrator`

The automation side picks up the **approved** Testing Strategy once, at a single hop — it
never re-reads phase documents directly:

1. **`/qa-setup` Part B** (contract intake) uses the approved Testing Strategy's chosen
   option (approach, pyramid, gates, data policy) as the defaults for the architecture
   contract; you confirm any deviations. Part C then assembles the whole `qa-config.yaml`
   draft and writes it only after you approve it at **CP-1**.
2. From then on, **`/qa-orchestrator`, `/qa-lane`, and every skill read only
   `docs/qa-config.yaml`** — never the raw Testing Strategy or any other phase document.
   One source of truth means two commands can never disagree about what the strategy says.

```
00-business/ … 07-development/ ──DISCOVER──▶ /qa-docs ──▶ 08-testing/ (Testing Strategy, approved)
                                                                  │
                                                                  ▼
                                                    /qa-setup Part B → Part C (CP-1)
                                                                  │
                                                                  ▼
                                                        docs/qa-config.yaml
                                                                  │
                                                                  ▼
                                              /qa-orchestrator, /qa-lane, every skill
```

If the Testing Strategy changes after CP-1, re-run `/qa-setup` so the change is recorded as
a `CP-AMEND-n` — don't hand-edit `qa-config.yaml`, and don't expect `/qa-orchestrator` to
pick up a strategy-doc edit on its own.

---

## How Claude Commands Work

The toolkit has **three layers**, all inside `.claude/`:

```
.claude/
  commands/        ← slash commands you type (/qa-setup, /qa-orchestrator, ...)
  skills/          ← knowledge Claude activates automatically (locators, gherkin, ...)
  agents/          ← subagents for heavy batch work (qa-reviewer, qa-healer)
  docs/reference/  ← the canonical rules everything else points to
```

- The **filename** (without `.md`) becomes the **command name**
- `$ARGUMENTS` in the file is replaced by whatever you type after the command
- **Skills** activate on their own when the topic comes up (e.g. you mention a flaky
  locator → the `locator-strategy` skill kicks in)
- **Subagents** run verbose work (reviews, batch healing) in a separate context and
  return only a compact report — your conversation stays clean
- All rules live in `.claude/docs/reference/` — commands, skills, and subagents all read
  the same standards, so a rule changed there changes everywhere
- No special configuration needed — just type `/command-name` in Claude Code chat

---

## Project Configuration Files

The agents read **one** runtime file, `docs/qa-config.yaml`, generated by `/qa-setup`. It has
two groups of sections:

| File | Holds | Used by |
|---|---|---|
| `docs/qa-config.yaml` lane sections | Lanes, paths, npm commands, env vars, quality gates, locator strategy | Lane commands (`/qa-lane`, `/qa-loop`) |
| `docs/qa-config.yaml` contract sections | Stack, test strategy, test-data policy (PII), CI/CD platform + gates, which cross-lane agents are enabled | Cross-lane skills (reviewer, cicd, test-data, metrics, etc.) |

The contract sections are approved by **you** at checkpoint **CP-1** during setup — no
cross-lane agent runs until a human approves them. Later changes are recorded as
amendments (`CP-AMEND-n`) in `hitl_log`, so every decision stays auditable.

**Never hardcode** project-specific data inside command files. Change it in the config
files and every agent adapts automatically. Both files are tool-agnostic.

---

## Project Structure

A target project using this toolkit looks like this. This is the layout produced by the 3
worked-example lanes shipped in `.claude/qa-config.yaml` — your own project may have
different lane names, but the same shape (each lane owns a zone; `pom-spec` and
`bdd-gherkin` lanes share page objects; the actual paths always come from
`docs/qa-config.yaml`):

```
your-project/
├── docs/
│   ├── qa-config.yaml            ← single config: lanes + contract (generated by /qa-setup, contract at CP-1)
│   └── QA-AGENTS-GUIDE.md        ← this guide
│
├── src/
│   ├── pageObjects/              ← Page Object classes (shared — every pom-spec/bdd-gherkin lane)
│   ├── tests/
│   │   ├── ui-tests/             ← lane `regression` (style pom-spec) — AAA spec files
│   │   └── api-tests/            ← lane `api` (style api-request, opt-in) — request-fixture specs
│   ├── api-helpers/               ← lane `api` — auth/headers/payload factories
│   ├── step-defination/          ← lane `acceptance` (style bdd-gherkin) — step implementations
│   └── fixtures/
│       └── users.fixture.ts      ← Pre-authenticated page fixture
│
├── features/
│   └── acceptance/               ← lane `acceptance` — Gherkin .feature files
│
├── .features-gen/                ← Auto-generated by bddgen (do not edit manually)
├── .claude/                      ← the toolkit (commands, skills, agents, rules)
│
├── playwright.config.ts          ← Playwright configuration
├── .env                          ← Secrets and URLs (never commit this file)
└── .env.example                  ← Template for required environment variables
```

---

## First-Time Setup

### Step 1 — Clone and install

```bash
git clone <repository-url>
cd your-project
npm install
```

### Step 2 — Create your .env file

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:
```
URL=https://your-app-under-test/login
USERNAME=your-test-user
PASSWORD=your-password
```

If you plan to use ADO integration, also add:
```
AZURE_DEVOPS_PAT=your-personal-access-token
```
Get your PAT from: **Azure DevOps → User Settings → Personal Access Tokens**

### Step 3 — Verify your environment with Claude

Open Claude Code and type:
```
/qa-setup
```

**On a brand-new project** (no `docs/qa-config.yaml` yet), Claude first asks 7 setup
questions (project name, stack, BDD, lane paths, env vars, ADO) and a short architecture
intake, then generates the single `docs/qa-config.yaml` — the whole file (including the
contract sections) waits for your **CP-1 approval** before being written.

**On an already-configured project**, Claude will automatically check:
- Project structure (required folders and files)
- npm dependencies (`package.json`)
- Playwright configuration
- Environment variables (`.env` vs expected list from `docs/qa-config.yaml`)
- BDD test generation status (`.features-gen/`)

It will print a report like this:
```
════════════════════════════════════════════════════════
 QA ENVIRONMENT VERIFICATION REPORT
════════════════════════════════════════════════════════
PROJECT STRUCTURE
  ✅  src/pageObjects/
  ✅  src/tests/ui-tests/
  ✅  .env
  ...
SUMMARY: 17 checks passed | 1 warning | 0 failures
════════════════════════════════════════════════════════
```

After the report, Claude will ask you 4 onboarding questions and generate a **personalized Quick Reference Card** with the commands and first steps relevant to your role and lane.

---

## Daily Workflow

### Starting a session

Always start with the orchestrator. It reads the project config, checks the repo state, and routes you to the right lane:

```
/qa-orchestrator
```

Or go directly if you already know your task:

```
/qa-orchestrator 6628938          ← with an ADO work item ID
/qa-orchestrator "Login module"   ← with a module name
```

The orchestrator enforces the **quality gates** before any implementation starts:
- 100% AC coverage required
- Maximum 10 test cases per wave
- PR checkpoint before next wave

### When to use `/qa-task` vs `/qa-orchestrator`

Both are entry points, but they solve different needs — and they complement each other.

| | `/qa-orchestrator` | `/qa-task` |
|---|---|---|
| What it does | Routes your work to the right lane (its `style` decides POM specs, Gherkin scenarios, or API request tests) and enforces the quality gates | Runs *any* request as short, approve-as-you-go blocks (plan → approve → do point by point → summarize) |
| Best for | You already know it's a test-automation job and want the right pipeline | A task, improvement, or question where you want to plan and approve **before** any work starts |
| How you stay in control | Approving at the lane checkpoints (CP-1, CP-AC, CP-3, …) | Approving the ToDo list, then each write step, then the final summary |

They are not exclusive: `/qa-orchestrator` can route an open-ended request to `/qa-task`, and
a `/qa-task` block can hand a step off to `/qa-lane`.

**Two quick examples:**

- *"Automate the test cases from ADO 6628938"* → use **`/qa-orchestrator 6628938`**. It's a
  clear automation job, so the orchestrator routes it straight to the matching lane
  (e.g. `regression` or `acceptance`).
- *"Improve our login page object and add a logout helper"* → use **`/qa-task`**. It's an
  open-ended change, so you'll see a short ToDo list, approve it, and review each edit as it
  happens.

---

## What the Output Looks Like

Every command uses the same three blocks (defined in
`.claude/docs/reference/output-style.md`), so you always know where to look:

**STATUS** — printed at every phase transition:
```
── STATUS ────────────────────────────────────────────
Command: /qa-lane acceptance   Phase: 4/11 — Coverage matrix
Done:    All 5 acceptance criteria are mapped to scenarios.
Next:    Generating the .feature file for your approval.
──────────────────────────────────────────────────────
```

**CHECKPOINT** — whenever a human decision is needed, the agent stops and explains the
decision in plain English before listing your options:
```
── CHECKPOINT CP-4 ───────────────────────────────────
Decision: Approve the fixes applied to 2 failing tests.
Why it matters: these fixes change locators in a shared page object —
other tests use it too, so a wrong fix could break them.

  | TC | Failure class | Fix applied | Result |
  |----|---------------|-------------|--------|
  | TC-03 | LOC (locator broke) | switched to getByRole | ✅ |

Options:
  APPROVE          → keep the fixes and finish the run
  REJECT: {notes}  → revert and retry with your guidance
  STOP             → end here, keep all files
──────────────────────────────────────────────────────
```

**SUMMARY** — every run ends with the files touched, a gates table with a plain-English
"Meaning" column, and the exact next command to type. Failures always appear first —
never buried at the bottom.

---

## Manual QA Workflows

Not everything needs automation — two skills support manual testers directly (just
describe what you need in the chat, no slash command required):

- **Manual test design** — say *"design manual test cases for story 6628938"* or
  *"create an exploratory charter for the login module"*. Claude analyzes the AC (same
  coverage gates as automation, including blocking on ambiguous AC), writes TCs to
  `docs/test-cases/{module}.md` with preconditions/steps/expected results, and tags
  automation candidates `[AUTOMATE]` for later.
- **Bug reporting** — say *"I found a bug: ..."* or *"report this as a defect"*. Claude
  drafts a complete severity-classified report (repro steps, expected vs actual,
  evidence), shows it to you at checkpoint **CP-5**, and only after your approval creates
  the ADO Bug (or hands you the markdown if ADO isn't configured).

---

## Understanding Lanes — style decides the pipeline

A lane's **name** is a free purpose label (`regression`, `acceptance`, `checkout`,
anything). Its **`style`**, set per lane in `docs/qa-config.yaml`, decides everything: the
skills that run, the pipeline steps, and which folders the lane owns. The style never
comes from the name — canonical definition:
`.claude/docs/reference/lane-styles.md`.

| style | Authoring | Uses POM (page objects) |
|---|---|---|
| `pom-spec` | Playwright spec files, Arrange-Act-Assert | yes |
| `bdd-gherkin` | Gherkin `.feature` files + step definitions | yes |
| `api-request` | Playwright `request` fixture, no browser | no |

**Command for any lane:**
```
/qa-lane <lane-name> [ADO-ID | module name | feature description | file path]
```

The template `.claude/qa-config.yaml` ships 3 worked-example lanes — use this as the
pattern when configuring your own project.

### `regression` — style `pom-spec`

**Use when:** Automating existing manual test cases, sprint regression, smoke tests.

**Files you work with:**
- `src/pageObjects/{ModuleName}Page.ts` — page object classes (shared)
- `src/tests/ui-tests/{module}/{feature}.spec.ts` — test spec files (owned by this lane)

**Pipeline:** context load → ADO fetch → coverage matrix (**CP-AC**) → page objects →
spec files (AAA pattern, one test per AC) → run → heal (**CP-4**) → review (**CP-3**) →
wave complete.

**Examples:**
```
/qa-lane regression 6628938            ← implement TCs from ADO work item 6628938
/qa-lane regression "User Management"  ← implement TCs for User Management module
```

**Run tests manually:**
```bash
npx playwright test --project=UI-Tests                 # all regression tests
npx playwright test --project=UI-Tests --grep @smoke   # smoke tests only
npx playwright show-report                              # open HTML report
```

### `acceptance` — style `bdd-gherkin`

**Use when:** Automating new user stories in sprint, BDD collaboration with Business Analysts.

**Files you work with:**
- `features/acceptance/{Module}/{file}.feature` — Gherkin feature files (owned by this lane)
- `src/step-defination/{module}-{slug}.steps.ts` — step implementations (owned by this lane)
- `src/pageObjects/{ModuleName}Page.ts` — page objects (shared with `regression`)

**Pipeline:** context load → ADO fetch → coverage matrix (**CP-AC**) → Gherkin (generate +
optimize) → page objects → step definitions → coverage check (no MISSING steps) →
`npx bddgen` + run → heal (**CP-4**) → review (**CP-3**) → wave complete.

**Examples:**
```
/qa-lane acceptance 6628938                       ← from ADO work item
/qa-lane acceptance "Login authentication"        ← from description
/qa-lane acceptance features/auth/login.feature   ← optimize existing feature
```

**Run tests manually:**
```bash
npx bddgen                                    # regenerate .features-gen/ from .feature files
npx playwright test --project=BDD-Acceptance  # run BDD tests
npx playwright show-report                     # open HTML report
```

### `api` — style `api-request` (opt-in, disabled by default)

**Use when:** Testing endpoints, contracts, and error responses. No browser, no page objects.

**Files you work with:**
- `src/tests/api-tests/{module}.api.spec.ts` — test spec files (owned by this lane)
- `src/api-helpers/` — auth, headers, payload factories (owned by this lane)

**Pipeline:** context load → ADO fetch → coverage matrix (**CP-AC**, incl. negative/auth
cases) → API specs (`request` fixture) → run → heal (**CP-4**) → review (**CP-3**) →
wave complete. A contract mismatch escalates as a potential app bug (CP-5), never a
weakened assertion.

**Examples:**
```
/qa-lane api 6628938             ← requires lanes.api.enabled: true in qa-config.yaml
/qa-lane api "POST /users"       ← API pipeline from endpoint description
```

**Run tests manually:**
```bash
npx playwright test --project=API-Tests
npx playwright show-report
```

### Isolation

A lane may edit **its own owned zone** and the **shared** `automation.page_object_dir`
(unless its style is `api-request`, which uses no page objects). A lane must **never**
edit another lane's owned zone. `/qa-lane` computes the forbidden zones dynamically from
the `style` of every enabled lane — there are no hardcoded lane-name exceptions.

---

## /qa-loop — Autonomous End-to-End Pipeline

**Use when:** You want to hand off a complete work item to Claude and receive a fully implemented, tested, and healed result with minimal intervention — only reviewing at the end of each phase.

**How it differs from `/qa-lane`:**
- `/qa-lane <name>` executes a pipeline **once**, reporting back to you after each major step
- `/qa-loop` executes **iteratively and autonomously**, retrying within each phase, writing detailed logs to disk, and only pausing for a human review gate between phases

**Command:**
```
/qa-loop [ADO-ID or description]
```

**The 3 phases:**

```
PHASE 1 — TC Generation (autonomous, max 5 iterations)
  Claude generates scenarios from the PBI, self-validates coverage,
  fills gaps, and runs a self-check. Stops when 100% of ACs are covered.
  → Writes log: logs/qa-loop/{date}-{id}/phase1-generation.md
  → YOU REVIEW and type APPROVE / REJECT / STOP

PHASE 2 — Implementation (autonomous, max 3 iterations per wave)
  Claude implements page objects, spec files or step definitions, runs
  the tests, and autonomously fixes failures within the iteration limit.
  → Writes log: logs/qa-loop/{date}-{id}/phase2-implementation.md
  → YOU REVIEW and type APPROVE / REJECT / SKIP / STOP

PHASE 3 — Healing (autonomous, max 3 attempts per failing test)
  Claude diagnoses each remaining failure (LOC/STR/TIME/MISS/MTH/IMP),
  applies fixes, and re-executes. Escalates to you if unresolvable.
  → Writes log: logs/qa-loop/{date}-{id}/phase3-healing.md
  → YOU REVIEW and type APPROVE / REJECT / STOP
```

**Your role during the loop:**

| When | What you do |
|---|---|
| Within a phase | Nothing — Claude works autonomously |
| At each phase gate | Read the log, type APPROVE / REJECT / STOP |
| If Claude escalates | Investigate the specific issue described and provide guidance |

**Review gate commands:**

| Command | Effect |
|---|---|
| `APPROVE` | Accept the phase result, advance to the next phase |
| `REJECT: {your notes}` | Claude applies your feedback in one revision pass, re-shows the gate |
| `SKIP` | Accept failures as-is (Phase 2 only), skip healing |
| `STOP` | End the loop immediately, keep all generated files |

**Log structure:**
```
logs/qa-loop/
  20260524-6628938/
    ado-workitem.json          ← ADO data (if fetched)
    phase1-generation.md       ← iteration-by-iteration generation log
    phase2-implementation.md   ← wave-by-wave implementation log
    phase3-healing.md          ← per-failure healing log
    summary.md                 ← final summary (written on APPROVE)
```

Logs are written **to disk during the loop** — not kept in Claude's memory. This keeps token usage predictable and lets you review exactly what Claude did at each iteration.

**Subagents keep the loop lean:** wave reviews are delegated to the **qa-reviewer**
subagent and batch healing to the **qa-healer** subagent (`.claude/agents/`). They do the
verbose work (stack traces, mutation runs, retries) in a separate context and return only
a compact report — so a long loop doesn't drown the conversation, and all approval
checkpoints still happen with you in the main chat.

**Estimated token cost:** 100,000–290,000 tokens per work item (~$0.65–$2.70 at Sonnet pricing).

**Examples:**
```
/qa-loop 6628938                    ← full pipeline from ADO work item
/qa-loop "Login authentication"     ← full pipeline from description
```

---

## Quality Gates

These are enforced automatically by `/qa-orchestrator` and `/qa-lane`. They are non-negotiable:

| Gate | Rule |
|---|---|
| AC Coverage | 100% of Acceptance Criteria must be covered before any code is written |
| Wave limit | Maximum 10 test cases per wave — stop and do a PR before continuing |
| PR checkpoint | Required after each wave before starting the next |
| No hardcoded credentials | Always use `process.env.VAR_NAME` — never paste passwords in test files |
| Test independence | Each test must be able to run alone — no dependencies between tests |

If a gate is violated, the agent stops and tells you exactly what's missing before continuing.

---

## Locator Strategy

When writing page objects and step definitions, always use locators in this priority order:

| Priority | Strategy | Example |
|---|---|---|
| 1st | `getByRole()` | `page.getByRole('button', { name: 'Login' })` |
| 2nd | `getByLabel()` | `page.getByLabel('Username')` |
| 3rd | `getByTestId()` | `page.getByTestId('submit-btn')` |
| 4th | `getByText()` | `page.getByText('Invalid credentials', { exact: true })` |
| 5th | CSS attribute | `page.locator('[data-id="save"]')` |
| Never | XPath | — |
| Never | `nth()` / `first()` | — |

The agents enforce this order automatically when generating page objects and steps.

---

## ADO Integration

`/qa-lane` (any style) can fetch work items directly from Azure DevOps.

**Requirements:**
1. Set `ado_organization` and `ado_project` in `docs/qa-config.yaml`
2. Set `AZURE_DEVOPS_PAT` in your `.env` file

**If ADO is not configured**, the agents will ask you to paste the acceptance criteria manually — ADO is optional, not required.

**How the fetch works:**

```powershell
# The agent runs this automatically (PowerShell REST API)
$uri = "https://dev.azure.com/{org}/{project}/_apis/wit/workitems/{ID}?api-version=7.1"
```

The agent extracts: Title, Description, Acceptance Criteria, Tags, Parent ID.

---

## Configuration Guide — Adapting to a New Project

To use these agents on a different project:

1. Copy the **whole `.claude/` folder** to the new project (commands, skills, agents, and
   rules travel together).
2. Add a minimal `CLAUDE.md` at the new project's root (template in `.claude/README.md`,
   Step 2).
3. Open Claude Code in the new project and run `/qa-setup` — it detects there is no
   `docs/qa-config.yaml`, asks the 7 setup questions plus the architecture intake, and
   generates the single config file (the contract sections after your CP-1 approval).

The agents adapt automatically — no changes needed to the command files. Full
portability details: `.claude/README.md`.

---

## Troubleshooting

### `/qa-setup` shows ❌ for .env

Create your `.env` file from the template:
```bash
cp .env.example .env
```
Then fill in `URL`, `USERNAME`, and `PASSWORD`.

### `/qa-setup` shows ⚠️ for .features-gen/

Run bddgen to generate the test files from your feature files:
```bash
npm run bddgen
```

### Tests fail with "No step definition found"

A Gherkin step doesn't have an implementation. Run:
```
/qa-lane acceptance features/your-module/your-file.feature
```
The agent will find and implement the missing steps, then re-run bddgen.

### ADO fetch fails with 401

Your PAT is expired or missing. Get a new one from:
**Azure DevOps → User Settings → Personal Access Tokens → New Token**

Then update your `.env`:
```
AZURE_DEVOPS_PAT=your-new-pat
```

### Test passes alone but fails in the suite

Test interdependency — one test is leaving state that affects another. The healing phase
of `/qa-lane` will diagnose this (category IMP) and add proper `beforeEach`/`afterEach` cleanup.

---

## Command Summary

```
/qa-setup                                       → Environment verification + onboarding
/qa-orchestrator                                → Session start + routing
/qa-orchestrator 6628938                        → Route ADO work item directly

/qa-lane regression                             → Regression pipeline (interactive)
/qa-lane regression 6628938                     → Regression pipeline from ADO ID
/qa-lane regression "Login module"              → Regression pipeline from module name

/qa-lane acceptance                             → BDD pipeline (interactive)
/qa-lane acceptance 6628938                     → BDD pipeline from ADO ID
/qa-lane acceptance features/auth/login.feature → Optimize existing feature file

/qa-lane api 6628938                            → API pipeline from ADO ID (requires lanes.api.enabled: true)
/qa-lane api "POST /users"                      → API pipeline from endpoint description

/qa-loop 6628938                    → Autonomous 3-phase pipeline (Generation → Implementation → Healing)
/qa-loop "Login authentication"     → Autonomous pipeline from description

/qa-release-report "Sprint 14"      → Release quality report + CP-SIGNOFF go/no-go

```

```bash
# npm/npx commands (run in terminal) — actual project/command names come from docs/qa-config.yaml
npx playwright test --project=UI-Tests                 # run all regression tests
npx playwright test --project=UI-Tests --grep @smoke   # run smoke tests only
npx bddgen                                              # regenerate .features-gen/ from .feature files
npx playwright test --project=BDD-Acceptance            # run BDD tests
npx playwright show-report                              # open Playwright HTML report
```

---

## File Quick Reference

| File | What it is | Edit? |
|---|---|---|
| `docs/qa-config.yaml` | Single config — lane sections (paths, commands, gates) + contract sections (stack/policy) | Lane sections: yes; contract sections via CP-1 / CP-AMEND only |
| `.env` | Secrets — URLs, credentials, PAT | Yes — your local values |
| `.env.example` | Template for .env | Yes — when adding new vars |
| `playwright.config.ts` | Playwright runner config | Rarely |
| `src/pageObjects/` | Page Object classes | Yes — add locators/methods |
| `src/tests/ui-tests/` | Regression spec files | Yes — add/fix tests |
| `features/` | Gherkin feature files | Yes — add/fix scenarios |
| `src/step-defination/` | Step implementations | Yes — add/fix steps |
| `.features-gen/` | Auto-generated specs | Never — regenerated by bddgen |
| `logs/qa-loop/` | Iteration logs from /qa-loop runs | Read — never edit manually |
| `.claude/commands/` | Command orchestrators | Rarely — only to change agent behavior |
| `.claude/skills/` | Auto-activating knowledge wrappers | Rarely |
| `.claude/agents/` | Subagents (qa-reviewer, qa-healer) | Rarely |
| `.claude/docs/reference/` | **Canonical rules — the only place rules live** | Yes — when a standard changes |
