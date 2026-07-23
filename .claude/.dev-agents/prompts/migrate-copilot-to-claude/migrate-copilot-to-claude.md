# TASK: Migrate multi-agent system from Copilot to Claude Code (dual compatibility)

You are an expert architect in multi-agent systems and Claude Code. This repo has a complete
agentic system built for GitHub Copilot: 5 reasoning agents, 12 procedural skills, 4 YAML
workflows, a 3-tier memory bank, and 13 canonical templates. The goal is to migrate EVERYTHING
to a generic and agnostic folder `.dev-agents`, modify Copilot so it **keeps working exactly the
same**, and create new Claude Code artifacts. **Both Claude Code and Copilot must use the agnostic
files as their single source of truth.**

---

## Language rule (non-negotiable)

**ALL generated content — agent stubs, skill stubs, slash command files, CLAUDE.md, equivalence
docs, QUICKSTART, hook messages — must be written in English.** Only user-facing conversation
follows the user's language (per AGENTS.md §3). Never generate Spanish in any of the produced files.

---

## System context to migrate

Before any phase, understand this architecture:

| Layer | Current location | Description |
|-------|-----------------|-------------|
| Global instructions | `.github/copilot-instructions.md` | Memory read/write protocol, stack, standards |
| Cross-cutting rules | `.github/AGENTS.md` | Addressing, timestamps, language, gates, frontmatter |
| Agents (5) | `.github/agents/*.md` | Orchestrator, Bsa, Coder, Reviewer, QA_Orchestrator |
| Skills (12) | `.github/agents/Skills/*/SKILL.md` | Memory_Protocol, Implementation_Plan_Generator, WorkItem_Operations, UI_Component_Lookup, Db_Review, Test_Runner, E2E_Plan, E2E_Generate, E2E_Heal, Update_Docs, Codemap, UX_Booster |
| Workflows (4+1) | `.github/workflows-agentic/` | master.yaml + dev.yaml + qa.yaml (full_dev, hotfix, review_only, qa_only, selftest) |
| Templates (13) | `.github/template-docs/` | BRD, User Story, Implementation Plan, Code Review, Test Plan, ADR, etc. |
| Memory | `.github/memory/` | 00-shared (patterns read-only), 20-agents (per-agent), 30-learnings (promoted) |
| MCP servers | `.vscode/mcp.json` | ado, chrome-devtools, antd, context7 |
| MCP permissions | `.vscode/settings.json` | allowedModels per server |

**After the migration, the consolidated locations will be:**

| Resource | Post-migration location | Used by |
|----------|------------------------|---------|
| Memory bank (runtime) | `.dev-agents/memory-bank/` | Both Copilot and Claude Code |
| Document templates | `.dev-agents/template-docs/` | Both Copilot and Claude Code |
| Agents, skills, workflows | `.dev-agents/agents/`, `.dev-agents/skills/`, `.dev-agents/workflows/` | Both (via stubs) |

`.github/template-docs/`, `.github/memory/`, and `.github/workflows-agentic/` **will be deleted** after migration.

---

## Architectural objective

```
.dev-agents/                  <- SINGLE source of truth (canonical, agnostic)
├── AGENTS.md
├── agents/                  <- 5 complete agent definitions
├── skills/                  <- 9 skills with their folder structure
├── workflows/               <- master.yaml, dev.yaml, qa.yaml + diagrams
├── template-docs/           <- 13 canonical templates (moved from .github/template-docs/)
└── memory-bank/             <- runtime memory + init schemas (moved from .github/memory/)

.github/                     <- thin stubs for Copilot (routing only)
├── copilot-instructions.md  <- delegates to CLAUDE.md and .dev-agents/
├── AGENTS.md                <- stub -> .dev-agents/AGENTS.md
├── agents/*.md              <- stubs -> .dev-agents/agents/
└── agents/Skills/*/SKILL.md <- stubs -> .dev-agents/skills/

CLAUDE.md                    <- Claude Code global instructions (equivalent to copilot-instructions.md)
.claude/
├── agents/*.md              <- Claude Code subagents -> .dev-agents/agents/
├── commands/*.md            <- slash commands for each skill and workflow
├── QUICKSTART.md            <- Claude Code equivalent of .github/QUICKSTART.md
└── settings.json            <- MCP servers + hooks + permissions
```

---

## PHASE 1 — Inventory (read-only — generate nothing yet)

Scan the repo and build a table with EVERY artifact found:

**Paths to scan:**
- `.github/copilot-instructions.md`
- `.github/AGENTS.md`
- `.github/QUICKSTART.md`
- `.github/agents/` (all files, including Skills/ subdirectories)
- `.github/memory/` (full structure — only directories and `_index.json` index files)
- `.github/template-docs/` (all files)
- `.github/workflows-agentic/` (all files)
- `.vscode/mcp.json`
- `.vscode/settings.json`

**For each artifact report:**
| Path | Type | Purpose (1 line) | Claude Code equivalent | Migration notes |
|------|------|-----------------|------------------------|-----------------|

**Types:** `agent` / `skill` / `workflow` / `template` / `memory-tier` / `mcp-config` / `global-instructions` / `docs`

Wait for OK before Phase 2.

---

## PHASE 2 — Create `.dev-agents/` (canonical agnostic source)

Create the `.dev-agents/` folder with this exact structure. Files are **faithful copies** of the
originals with path updates — do NOT change any logic or instructions.

### 2.1 Path update strategy in `.dev-agents/`

| Original reference | Reference in `.dev-agents/` | Reason |
|--------------------|-----------------------------|--------|
| `../AGENTS.md` (from `agents/`) | `../AGENTS.md` | Same relative depth |
| `Skills/` (from `agents/`) | `../skills/` | Skills moved to sibling folder |
| `../template-docs/` (from `agents/`) | `.dev-agents/template-docs/` | Canonical location |
| `../memory/` (from `agents/`) | `.dev-agents/memory-bank/` | Canonical location |
| `../workflows-agentic/` (from `agents/`) | `../workflows/` | Workflows moved |
| `../../../AGENTS.md` (from `skills/X/`) | `../../AGENTS.md` | One level less deep |
| `../../../template-docs/` (from `skills/X/`) | `.dev-agents/template-docs/` | Canonical location |
| `../../../memory/` (from `skills/X/`) | `.dev-agents/memory-bank/` | Canonical location |

### 2.2 Files to create

**`.dev-agents/AGENTS.md`**
Copy of `.github/AGENTS.md`. Add this header at the top (in English):
```
> **Canonical source.** Edit here only. Files in `.github/` and `.claude/` are
> thin stubs that reference this file. All global rule changes must be made here.
```
Update internal references: `.github/agents/` → `.dev-agents/agents/` and `.github/agents/Skills/` → `.dev-agents/skills/`.
Update the "lives in" column in the Agent vs Skill table to point to `.dev-agents/agents/{Name}.md` and `.dev-agents/skills/{Name}/SKILL.md`.

**`.dev-agents/agents/`** — 5 agents (Orchestrator, Bsa, Coder, Reviewer, QA_Orchestrator) + README
Copies from `.github/agents/` with paths updated per table 2.1.

**`.dev-agents/skills/`** — 9 skills with their subfolders + README
Copies from `.github/agents/Skills/` with paths updated per table 2.1.

**`.dev-agents/workflows/`** — all files from `.github/workflows-agentic/`
Exact copy. No path changes needed (YAMLs use paths relative to the executing agent, not to the YAML file).

**`.dev-agents/template-docs/`** — all 13 templates + `_index.json` + `README.md`
Copy of `.github/template-docs/`. No path changes needed.

**`.dev-agents/memory-bank/`** — full content from `.github/memory/` + `README.md`
Copy the entire `.github/memory/` directory tree to `.dev-agents/memory-bank/`. The `README.md`
describes the 3-tier structure, agent → memory folder mapping, Memory Protocol lifecycle,
and new-project initialization guide.

### 2.3 Global path replacement (run after creating all files)

After all files are created in `.dev-agents/`, run a **global find-replace** across ALL files in
the repo (all `.md`, `.yaml`, `.json`, `.mmd` — excluding `.git/` and the folders about to be
deleted):

| Find | Replace |
|------|---------|
| `.github/template-docs/` | `.dev-agents/template-docs/` |
| `.github/template-docs` | `.dev-agents/template-docs` |
| `.github/memory/` | `.dev-agents/memory-bank/` |
| `.github/memory` | `.dev-agents/memory-bank` |
| `.github/workflows-agentic/` | `.dev-agents/workflows/` |
| `.github/workflows-agentic` | `.dev-agents/workflows` |

This replacement must cover: `.dev-agents/`, `.claude/`, `CLAUDE.md`, `.github/AGENTS.md`,
`.github/copilot-instructions.md`, `.github/agents/`, `.dev-agents/workflows/`,
`.github/QUICKSTART.md`, and any other project files that reference these paths.

Verify that zero old-path references remain before continuing.

### 2.4 Delete superseded folders

After the global replacement is verified:

```
DELETE: .github/template-docs/       (content now lives in .dev-agents/template-docs/)
DELETE: .github/memory/              (content now lives in .dev-agents/memory-bank/)
DELETE: .github/workflows-agentic/   (content now lives in .dev-agents/workflows/)
```

Confirm deletion before proceeding to Phase 3.

---

## PHASE 3 — Update `.github/` as thin stubs for Copilot

Replace the content of `.github/` files with minimal English stubs that instruct Copilot
to read from `.dev-agents/`.

### 3.1 Stub format for agents (in English)

Each `.github/agents/{Name}.md` becomes:

```markdown
---
name: {Name}
version: "{current version}"
inherits: ../AGENTS.md
description: "{current description — do not change}"
argument-hint: "{current hint — do not change}"
tools: [{current tools list — do not change}]
---

> **Canonical definition at:** `.dev-agents/agents/{Name}.md`
>
> **MANDATORY FIRST ACTION:** Read `.dev-agents/agents/{Name}.md` in FULL before responding to any request.
> This file is a routing stub for Copilot only.
>
> After reading the canonical definition, follow its instructions exactly.
> This agent's memory is at: `.dev-agents/memory-bank/20-agents/{agent_name}/`
> Global rules are at: `.dev-agents/AGENTS.md`
```

**Important — tools list:** Set `tools` to the full set for ALL agents (no per-agent restriction):
```yaml
tools:
  [
    vscode, codebase, editFiles, runCommands, runTasks, runTests,
    fetch, search, usages, problems, changes, agent, runSubagent, todo,
    'work-tracking-platform/*', 'library-docs/*', 'ui-component-library/*',
    'browser-devtools/*', 'database-mcp/*', 'diagram-tools/*', 'e2e-test/*',
  ]
```
This matches Claude Code's behavior (all tools available) so both platforms behave identically.

**Important — critical context block:** After the routing instruction, add a `**Critical context**`
block with 6-8 bullet points of the agent's most important rules. This ensures the agent behaves
correctly even if the model does not follow through with reading the canonical file. Include:
- Identity (what this agent does / does NOT do)
- Addressing rule (My Lord)
- The single most critical constraint (e.g., Orchestrator never writes code)
- Memory path
- Most important behavioral rule (e.g., build validation, pattern discovery)

Keep the full YAML frontmatter (name, version, description, argument-hint, tools) because Copilot
uses it for routing. Only the body changes to the stub + critical context block.

### 3.2 Stub format for skills (in English)

Each `.github/agents/Skills/{Name}/SKILL.md` becomes:

```markdown
---
name: {current-name}
version: "{current version}"
inherits: ../../AGENTS.md
description: "{current description}"
tools: [{current tools}]
---

> **Canonical definition at:** `.dev-agents/skills/{Name}/SKILL.md`
>
> **MANDATORY FIRST ACTION:** Read `.dev-agents/skills/{Name}/SKILL.md` in FULL before executing any step of this skill.
> This file is a routing stub for Copilot only.
```

### 3.3 Update `.github/copilot-instructions.md`

Replace with a stub that (all in English):
1. Keeps the `## AUTOMATIC MEMORY READ` section complete — update paths to `.dev-agents/memory-bank/`
2. Keeps the `## AUTOMATIC MEMORY WRITE` section complete — update paths to `.dev-agents/memory-bank/`
3. Replaces the stack/structure/commands sections with a pointer to `CLAUDE.md`
4. Adds a pointer to `.dev-agents/AGENTS.md` for global rules

### 3.4 Update `.github/AGENTS.md`

Routing stub with fallback (in English):
```markdown
# `.github/AGENTS.md` — Copilot routing stub

> **Canonical definition at:** `.dev-agents/AGENTS.md`
> Read that file in FULL. This stub exists only for Copilot path compatibility.
> The complete content below is a fallback if reading the canonical file fails.

---

[full content of .dev-agents/AGENTS.md pasted here as fallback]
```

---

## PHASE 4 — Generate native Claude Code configuration

### 4.1 `CLAUDE.md` (repo root — equivalent to `copilot-instructions.md`)

Contains the automatic memory protocol adapted for Claude Code and pointers to the system.
All content in English:

```markdown
# Project Instructions

> **Multi-agent system:** Canonical definitions for all agents, skills, and workflows
> are in `.dev-agents/`. Global rules are in `.dev-agents/AGENTS.md`.
>
> **Invoke agents:** @orchestrator, @bsa, @coder, @reviewer, @qa-orchestrator
> **Invoke skills:** /workflow, /qa, /review, /gen-plan, /work-item, /db-review,
> /ui-lookup, /test-run, /e2e-plan, /e2e-gen, /e2e-heal, /selftest

## AUTOMATIC MEMORY READ — MANDATORY ON EVERY INVOCATION
[Exact copy of the read protocol from .github/copilot-instructions.md
 with paths updated: .dev-agents/memory-bank/ instead of .github/memory/]

## AUTOMATIC MEMORY WRITE — MANDATORY ON EVERY TASK COMPLETION
[Exact copy of the write protocol — paths updated to .dev-agents/memory-bank/]

## Project context
[Stack placeholders — same as copilot-instructions.md]

## Build & test commands
[Command placeholders]

## Code standards
[Standards copied from copilot-instructions.md]

## Pointers
- **Canonical system source:** .dev-agents/
- **Global agent rules:** .dev-agents/AGENTS.md
- **Agentic system map:** .dev-agents/agents/README.md
- **Workflows:** .dev-agents/workflows/master.yaml
- **Document templates:** .dev-agents/template-docs/
- **Memory bank:** .dev-agents/memory-bank/
- **Project context:** CLAUDE.md (repo root)
- **Architecture decisions:** docs/architecture/
```

### 4.2 `.claude/agents/` — Claude Code subagents (in English)

Each agent generates a file in `.claude/agents/{name}.md`:

```markdown
---
name: {kebab-case-name}
description: >
  {Agent description — used by Claude to decide when to activate it}.
  Invocation example: "@{name} [full|limited|minimal feedback] [unattended|supervised|semi] {request}"
---

Your full definition is in `.dev-agents/agents/{Name}.md`.

**MANDATORY FIRST ACTION:** Read `.dev-agents/agents/{Name}.md` in FULL before responding to any request.
Do not produce any output before reading that file.

Your memory system is at: `.dev-agents/memory-bank/20-agents/{agent_name}/`
Global rules are at: `.dev-agents/AGENTS.md`

---

**Critical context (active even before reading the canonical file):**

- Identity: {one-line role statement — what this agent does and does NOT do}
- Address the user as **"My Lord"** in every response.
- {Most critical constraint for this agent — e.g., Orchestrator: NEVER writes code}
- Memory: `.dev-agents/memory-bank/20-agents/{agent_name}/` — read session_log.json on every invocation.
- {Key behavioral rule — e.g., Coder: build validation mandatory; Reviewer: always show full report}
- {Most important reference to read — e.g., Orchestrator: read master.yaml; Coder: read patterns index}
```

**Claude Code translation note (for Orchestrator and QA_Orchestrator only):** Add a translation
table after the critical context explaining how Copilot-style `@workspace /runSubagent {Name}`
maps to Claude Code sub-agent invocation:

```markdown
**Claude Code translation note:** When the canonical definition or YAML workflows reference
`@workspace /runSubagent {Name}`, in Claude Code this means `@{name}`:

| Copilot syntax | Claude Code equivalent |
|---|---|
| `@workspace /runSubagent Bsa` | `@bsa` |
| `@workspace /runSubagent Coder` | `@coder` |
| `@workspace /runSubagent Reviewer` | `@reviewer` |
| `@workspace /runSubagent QA_Orchestrator` | `@qa-orchestrator` |
| skill invocations in YAML | load the SKILL.md file inline and execute |

Apply this translation automatically when reading and executing any workflow YAML step.
```

Files to create:
| File | `name` in frontmatter | `agent_name` in memory |
|------|-----------------------|------------------------|
| `.claude/agents/orchestrator.md` | `orchestrator` | `orchestrator` |
| `.claude/agents/bsa.md` | `bsa` | `bsa` |
| `.claude/agents/coder.md` | `coder` | `coder` |
| `.claude/agents/reviewer.md` | `reviewer` | `reviewer` |
| `.claude/agents/qa-orchestrator.md` | `qa-orchestrator` | `qa` |

### 4.3 `.claude/commands/` — Slash commands for skills and workflows (in English)

Each skill and each main workflow gets a slash command invoked as `/command-name [args]`.
The argument is available as `$ARGUMENTS` inside the command file.

| File | Command | Invokes | User-facing description |
|------|---------|---------|------------------------|
| `.claude/commands/workflow.md` | `/workflow` | Orchestrator + master.yaml | `[full_dev\|hotfix\|review_only\|qa_only] [User Story ID or description]` |
| `.claude/commands/qa.md` | `/qa` | QA_Orchestrator + qa.yaml | `[feature/folder/doc reference]` |
| `.claude/commands/review.md` | `/review` | Reviewer agent | `[PR# \| "my changes" \| file path]` |
| `.claude/commands/gen-plan.md` | `/gen-plan` | Implementation_Plan_Generator skill | `[analysis_path] [ticket_id?]` |
| `.claude/commands/work-item.md` | `/work-item` | WorkItem_Operations skill | `[US file path \| "describe work item"]` |
| `.claude/commands/db-review.md` | `/db-review` | Db_Review skill | `[SQL file, migration, or PR diff]` |
| `.claude/commands/ui-lookup.md` | `/ui-lookup` | UI_Component_Lookup skill | `[component name or "list all"]` |
| `.claude/commands/test-run.md` | `/test-run` | Test_Runner skill | `["all" \| "backend" \| "frontend" \| test name]` |
| `.claude/commands/e2e-plan.md` | `/e2e-plan` | E2E_Plan skill | `[feature URL or doc reference]` |
| `.claude/commands/e2e-gen.md` | `/e2e-gen` | E2E_Generate skill | `[plan file path]` |
| `.claude/commands/e2e-heal.md` | `/e2e-heal` | E2E_Heal skill | `["all" \| spec file path]` |
| `.claude/commands/selftest.md` | `/selftest` | Selftest workflow | No arguments — system diagnostic |
| `.claude/commands/update-docs.md` | `/update-docs` | Update_Docs skill | `[feature_name \| user_story_id \| 'all changes']` |
| `.claude/commands/codemap.md` | `/codemap` | Codemap skill | `[full \| incremental \| query <term>]` |
| `.claude/commands/ux-booster.md` | `/ux-booster` | UX_Booster skill | `[live <URL> \| code <path> \| plan <path>]` |

**Format for each command file (all content in English):**
```markdown
---
description: {short description shown in Claude Code autocomplete}
---

Read `.dev-agents/skills/{Name}/SKILL.md` (or the corresponding agent) in FULL
and execute its instructions with the following parameters:

$ARGUMENTS

Before executing: apply Memory Protocol Phase 1 (SESSION START).
After completing: execute Memory Protocol Phase 3 (SESSION CLOSE).
Skill reference: `.dev-agents/skills/Memory_Protocol/SKILL.md`
```

### 4.4 `.claude/settings.json` — MCP, hooks and permissions

```json
{
  "mcpServers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp@latest", "[organization-name]"],
      "env": {}
    },
    "chrome-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    },
    "antd": {
      "type": "stdio",
      "command": "npx",
      "args": ["@jzone-mcp/antd-components-mcp"]
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  },
  "permissions": {
    "allow": [
      "mcp__ado__*",
      "mcp__chrome-devtools__*",
      "mcp__antd__*",
      "mcp__context7__*",
      "Bash(git config user.email:*)",
      "Bash(Get-Date*)",
      "Bash(pwsh -Command \"Get-Date*\")"
    ]
  },
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[Memory Protocol] REMINDER: Execute Phase 3 (SESSION CLOSE) before finishing — update session_log.json with: accomplished, discoveries, next_session_hint. Skill: .dev-agents/skills/Memory_Protocol/SKILL.md\""
          }
        ]
      }
    ]
  }
}
```

**Critical MCP migration notes:**
- The `[organization-name]` in `ado` is taken from the current value in `.vscode/mcp.json` (third argument of the `args` array)
- The `allowedModels` from `.vscode/settings.json` have no direct equivalent in Claude Code — Claude Code uses `permissions.allow` to control which MCP tools run without confirmation
- MCP `chrome-devtools` maps to `browser-devtools/*` in agents and `e2e-test/*` in E2E skills
- MCP `antd` maps to `ui_component_library/*` in agents
- MCP `context7` maps to `library-docs/*` in agents

### 4.5 `.claude/QUICKSTART.md` — Claude Code user guide

Create `.claude/QUICKSTART.md` as the Claude Code equivalent of `.github/QUICKSTART.md`.
Use the same structure (invocations, flags, recipes, agents, skills, workflows, memory, MCP,
conventions, troubleshooting, where things live, architecture diagram) with these adaptations:

- Replace Copilot syntax with Claude Code syntax:
  - `@Orchestrator full_dev <desc>` → `/workflow full_dev <desc>`
  - `@Bsa <feature>` → `@bsa <feature>`
  - `@QA_Orchestrator qa_only` → `/qa <feature>`
  - `@Orchestrator selftest` → `/selftest`
  - `@Orchestrator review_only` → `/review my changes`
- Add a "Copilot equivalent" column to all invocation tables for cross-reference
- Update all paths to `.dev-agents/` locations (memory-bank, template-docs, workflows)
- Update MCP server names to the IDs in `.claude/settings.json` (`ado`, `antd`, `context7`, `chrome-devtools`)
- Add Claude Code–specific troubleshooting (e.g., `Get-Date` permission, MCP settings location)
- All content in English

---

## PHASE 5 — Update `.vscode/settings.json`

Leave all existing Copilot entries in `.vscode/settings.json` unchanged.
Claude Code's MCP configuration lives in `.claude/settings.json`.

No changes needed to `.vscode/mcp.json` — it stays intact for Copilot.

---

## PHASE 6 — Verification and status report

### 6.1 File tree of created/modified files

List in tree all generated or modified files, grouped by phase:
```
.dev-agents/           (Phase 2 — N new files)
.github/              (Phase 3 — N modified files)
CLAUDE.md             (Phase 4 — new)
.claude/              (Phase 4 — N new files)
```

### 6.2 Complete mapping table

| Generic artifact | Copilot artifact | Claude Code artifact | Status |
|------------------|-----------------|----------------------|--------|
| `.dev-agents/AGENTS.md` | `.github/AGENTS.md` (stub + fallback) | `CLAUDE.md` (protocol embedded) | OK |
| `.dev-agents/agents/Orchestrator.md` | `.github/agents/Orchestrator.md` (stub) | `.claude/agents/orchestrator.md` | OK |
| `.dev-agents/agents/Bsa.md` | `.github/agents/Bsa.md` (stub) | `.claude/agents/bsa.md` | OK |
| `.dev-agents/agents/Coder.md` | `.github/agents/Coder.md` (stub) | `.claude/agents/coder.md` | OK |
| `.dev-agents/agents/Reviewer.md` | `.github/agents/Reviewer.md` (stub) | `.claude/agents/reviewer.md` | OK |
| `.dev-agents/agents/QA_Orchestrator.md` | `.github/agents/QA_Orchestrator.md` (stub) | `.claude/agents/qa-orchestrator.md` | OK |
| `.dev-agents/skills/Memory_Protocol/` | `.github/agents/Skills/Memory_Protocol/` (stub) | Embedded in CLAUDE.md + Stop hook | OK |
| `.dev-agents/skills/Implementation_Plan_Generator/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/gen-plan.md` -> /gen-plan | OK |
| `.dev-agents/skills/WorkItem_Operations/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/work-item.md` -> /work-item | OK |
| `.dev-agents/skills/UI_Component_Lookup/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/ui-lookup.md` -> /ui-lookup | OK |
| `.dev-agents/skills/Db_Review/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/db-review.md` -> /db-review | OK |
| `.dev-agents/skills/Test_Runner/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/test-run.md` -> /test-run | OK |
| `.dev-agents/skills/E2E_Plan/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/e2e-plan.md` -> /e2e-plan | OK |
| `.dev-agents/skills/E2E_Generate/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/e2e-gen.md` -> /e2e-gen | OK |
| `.dev-agents/skills/E2E_Heal/` | `.github/agents/Skills/.../` (stub) | `.claude/commands/e2e-heal.md` -> /e2e-heal | OK |
| `.dev-agents/skills/Update_Docs/` | `.github/agents/Skills/Update_Docs/` (stub) | `.claude/commands/update-docs.md` -> /update-docs | OK |
| `.dev-agents/skills/Codemap/` | `.github/agents/Skills/Codemap/` (stub) | `.claude/commands/codemap.md` -> /codemap | OK |
| `.dev-agents/skills/UX_Booster/` | `.github/agents/Skills/UX_Booster/` (stub) | `.claude/commands/ux-booster.md` -> /ux-booster | OK |
| `.dev-agents/workflows/master.yaml` | Referenced by Orchestrator stub | /workflow command | OK |
| `.dev-agents/workflows/qa.yaml` | Referenced by QA_Orchestrator stub | /qa command | OK |
| `.dev-agents/memory-bank/` | Shared runtime (no stub needed) | Shared runtime (no stub needed) | Shared |
| `.dev-agents/template-docs/` (13 templates) | Shared runtime (no stub needed) | Shared runtime (no stub needed) | Shared |
| `.vscode/mcp.json` | Used by Copilot unchanged | `.claude/settings.json` (mcpServers) | OK |
| `.vscode/settings.json` (`allowedModels`) | Used by Copilot unchanged | No equivalent — `permissions.allow` used | Documented |
| — | — | `.claude/QUICKSTART.md` | New in Claude Code |
| — | — | /selftest command | New in Claude Code |

### 6.3 Functional differences Copilot vs Claude Code

| Feature | Copilot | Claude Code | Impact |
|---------|---------|-------------|--------|
| Agent invocation syntax | `@Orchestrator`, `@Bsa` (PascalCase) | `@orchestrator`, `@bsa` (kebab-case) | Syntax change — identical semantics |
| Skill invocation | Inline instruction inside agent | `/gen-plan`, `/work-item`, etc. (slash commands) | Slash commands add discoverability; callable standalone |
| Workflow invocation | `@Orchestrator full_dev <desc>` | `/workflow full_dev <desc>` | Shorter; agent syntax also works |
| Sub-agent invocation in YAML | `@workspace /runSubagent {Name}` | `@{name}` — translation table in Orchestrator/QA stubs | Handled by translation note in `.claude/agents/orchestrator.md` |
| Tool access per agent | Full tools (all tools in stub) | Full tools (all tools by default) | Identical — both use full tool set |
| Timestamps (`Get-Date`) | PowerShell native in VS Code terminal | Requires `Bash(Get-Date*)` in `permissions.allow` | Already configured in `.claude/settings.json` |
| Memory Protocol Phase 3 | Embedded in agent/skill definitions | Embedded in agents + Stop hook reminder | Functionally equivalent |
| Long workflows (context) | Single agent with one long context | Multiple subagents with their own context | Claude Code more token-efficient for large workflows |
| `feedback_level` / `execution_mode` | Detected by Orchestrator, propagated | Same detection and propagation | No behavioral difference |
| MCP `allowedModels` | Per-server list of permitted Copilot models | Not applicable — Claude Code always uses Claude | No equivalent — documented |

### 6.4 Post-migration selftest

Instruct the user to run `/selftest` after the migration to verify:
- All system files exist (agents, skills, memory paths, template-docs)
- MCPs are configured and respond
- `master.yaml` parses correctly
- Workflow aliases resolve to valid phases

### 6.5 Equivalence reference document

Generate `claude-copilot-equivalence.md` at the repo root with:
- **Agents table**: canonical file -> Copilot invocation -> Claude Code invocation -> stub files
- **Skills table**: canonical file -> Copilot invocation -> Claude Code slash command -> file paths
- **Workflows table**: workflow name -> Copilot invocation -> Claude Code invocation -> phases
- **Execution flags table**: mode/feedback flags for both platforms
- **Configuration files table**: purpose -> Copilot file -> Claude Code file
- **MCP servers table**: server ID -> tools prefix -> `permissions.allow` pattern -> used by
- **Behavioral differences table**: feature -> Copilot behavior -> Claude Code behavior -> impact
- **Shared resources table**: resource -> location -> used by both platforms
- **File-by-file status table**: canonical -> Copilot -> Claude Code -> OK / Shared / Documented

---

## Golden rules for this migration

1. **Do NOT change any agent or skill logic** — only paths and wrappers
2. **Do NOT duplicate content** — one canonical file in `.dev-agents/`, stubs in `.github/` and `.claude/`
3. **`.dev-agents/memory-bank/`, `.dev-agents/template-docs/`, and `.dev-agents/workflows/` are the single source** — delete `.github/memory/`, `.github/template-docs/`, and `.github/workflows-agentic/` after Phase 2.4
4. **The Memory Protocol does not change** — only where stubs reference it changes
5. **Copilot must keep working exactly the same** after Phase 3
6. **All generated content must be in English** — agent stubs, skill stubs, commands, CLAUDE.md, QUICKSTART, equivalence doc, hook messages
7. **Wait for confirmation** after Phase 1 (inventory) and Phase 2 (canonical creation) before continuing
