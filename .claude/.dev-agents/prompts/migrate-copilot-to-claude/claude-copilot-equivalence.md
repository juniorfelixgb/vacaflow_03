# Claude Code ↔ Copilot Equivalence Reference

> Complete mapping of agents, skills, slash commands, MCP servers, configuration files,
> and behavioral differences between the two platforms.
> Canonical system definitions live in `.dev-agents/` — shared by both platforms.

---

## Agents

| Agent (canonical in `.dev-agents/agents/`) | Copilot invocation | Claude Code invocation | Copilot stub | Claude Code stub |
|---|---|---|---|---|
| **Orchestrator** | `@Orchestrator full_dev <desc>` | `/workflow full_dev <desc>` or `@orchestrator full_dev <desc>` | `.github/agents/Orchestrator.md` | `.claude/agents/orchestrator.md` |
| **Bsa** | `@Bsa Analyze: <request>` | `@bsa Analyze: <request>` | `.github/agents/Bsa.md` | `.claude/agents/bsa.md` |
| **Coder** | `@Coder Implement: <task>` | `@coder Implement: <task>` | `.github/agents/Coder.md` | `.claude/agents/coder.md` |
| **Reviewer** | `@Reviewer Review pending changes` | `/review my changes` or `@reviewer Review pending changes` | `.github/agents/Reviewer.md` | `.claude/agents/reviewer.md` |
| **QA_Orchestrator** | `@QA_Orchestrator qa_only` | `/qa <feature>` or `@qa-orchestrator qa_only` | `.github/agents/QA_Orchestrator.md` | `.claude/agents/qa-orchestrator.md` |

---

## Skills

| Skill (canonical in `.dev-agents/skills/`) | Copilot invocation | Claude Code slash command | Copilot stub | Claude Code command file |
|---|---|---|---|---|
| **Memory_Protocol** | Automatic (embedded in agents) | Automatic (embedded in agents) | `.github/agents/Skills/Memory_Protocol/` | N/A (automatic) |
| **Implementation_Plan_Generator** | `@Bsa Execute Implementation_Plan_Generator skill on <analysis_path>` | `/gen-plan <analysis_path> [ticket_id]` | `.github/agents/Skills/Implementation_Plan_Generator/` | `.claude/commands/gen-plan.md` |
| **WorkItem_Operations** | `@Bsa Create User Story in the work-tracking platform from <US-file>` | `/work-item <US-file or description>` | `.github/agents/Skills/WorkItem_Operations/` | `.claude/commands/work-item.md` |
| **UI_Component_Lookup** | Triggered inline by Coder/Reviewer | `/ui-lookup <component or question>` | `.github/agents/Skills/UI_Component_Lookup/` | `.claude/commands/ui-lookup.md` |
| **Db_Review** | Triggered inline by Reviewer/Coder | `/db-review <SQL file or migration>` | `.github/agents/Skills/Db_Review/` | `.claude/commands/db-review.md` |
| **Test_Runner** | Triggered inline by Coder/QA | `/test-run [all\|backend\|frontend]` | `.github/agents/Skills/Test_Runner/` | `.claude/commands/test-run.md` |
| **E2E_Plan** | Triggered by QA_Orchestrator | `/e2e-plan <feature URL or doc>` | `.github/agents/Skills/E2E_Plan/` | `.claude/commands/e2e-plan.md` |
| **E2E_Generate** | Triggered by QA_Orchestrator | `/e2e-gen <plan file path>` | `.github/agents/Skills/E2E_Generate/` | `.claude/commands/e2e-gen.md` |
| **E2E_Heal** | Triggered by QA_Orchestrator | `/e2e-heal [all\|spec path]` | `.github/agents/Skills/E2E_Heal/` | `.claude/commands/e2e-heal.md` |
| **Update_Docs** | Triggered inline by all agents at session end | `/update-docs [feature\|user_story_id\|'all changes']` | `.github/agents/Skills/Update_Docs/` | `.claude/commands/update-docs.md` |
| **Codemap** | Triggered inline by Coder after impl | `/codemap [full\|incremental\|query <term>]` | `.github/agents/Skills/Codemap/` | `.claude/commands/codemap.md` |
| **UX_Booster** | Triggered inline by Bsa/Reviewer | `/ux-booster [live <URL>\|code <path>\|plan <path>]` | `.github/agents/Skills/UX_Booster/` | `.claude/commands/ux-booster.md` |

---

## Workflows

| Workflow | Copilot invocation | Claude Code invocation | Phases |
|---|---|---|---|
| **full_dev** | `@Orchestrator full_dev <desc or US #id>` | `/workflow full_dev <desc or US #id>` | preflight → story → impl → review → unit_tests → e2e → doc_update |
| **hotfix** | `@Orchestrator hotfix <desc>` | `/workflow hotfix <desc>` | preflight → impl → review → unit_tests → doc_update |
| **review_only** | `@Orchestrator review_only` | `/workflow review_only` or `/review my changes` | preflight → review |
| **qa_only** | `@QA_Orchestrator qa_only` | `/qa <feature reference>` | preflight → e2e |
| **selftest** | `@Orchestrator selftest` | `/selftest` | selftest_checks |

---

## Execution mode flags

| Mode | Copilot | Claude Code | Behavior |
|---|---|---|---|
| `semi` (default) | `@Orchestrator full_dev <desc> semi` | `/workflow full_dev <desc> semi` | Proceed autonomously, pause on ambiguity |
| `supervised` | `@Orchestrator full_dev <desc> supervised` | `/workflow full_dev <desc> supervised` | Pause and confirm after every phase |
| `unattended` | `@Orchestrator full_dev <desc> unattended` | `/workflow full_dev <desc> unattended` | Run end-to-end, stop only on hard errors |

## Feedback level flags

| Level | Copilot | Claude Code | Output |
|---|---|---|---|
| `limited` (default) | `limited feedback` | `limited feedback` | Phase summary + key decisions |
| `full` | `full feedback` | `full feedback` | Every step, full reasoning, code excerpts |
| `minimal` | `minimal feedback` | `minimal feedback` | Final result + critical alerts only |

---

## Configuration files

| Purpose | Copilot file | Claude Code file | Notes |
|---|---|---|---|
| Global agent rules | `.github/AGENTS.md` (stub → `.dev-agents/AGENTS.md`) | `CLAUDE.md` (includes the same protocol) | `.dev-agents/AGENTS.md` is the canonical source |
| Project instructions | `.github/copilot-instructions.md` | `CLAUDE.md` | Memory protocol same in both; project context only in `CLAUDE.md` |
| MCP server config | `.vscode/mcp.json` | `.claude/settings.json` → `mcpServers` | Different format; same servers |
| MCP tool permissions | `.vscode/settings.json` → `chat.mcp.serverSampling.allowedModels` | `.claude/settings.json` → `permissions.allow` | No direct equivalent for `allowedModels` in Claude Code |
| Lifecycle hooks | N/A | `.claude/settings.json` → `hooks` | `Stop` hook reminds about Memory Protocol Phase 3 |
| Quick-start guide | `.github/QUICKSTART.md` | `.claude/QUICKSTART.md` | Same content, different invocation syntax |
| Agent definitions | `.github/agents/<Name>.md` (stub) | `.claude/agents/<name>.md` (stub) | Both read from `.dev-agents/agents/<Name>.md` |
| Skill definitions | `.github/agents/Skills/<Name>/SKILL.md` (stub) | `.claude/commands/<name>.md` (slash command) | Both read from `.dev-agents/skills/<Name>/SKILL.md` |

---

## MCP servers

| Server | Copilot ID (`.vscode/mcp.json`) | Claude Code ID (`.claude/settings.json`) | Used by | Purpose |
|---|---|---|---|---|
| Azure DevOps / Work-tracking platform | `ado` | `ado` | WorkItem_Operations, Orchestrator | Work items, PRs, wiki, repos, pipelines |
| Browser / E2E testing | `chrome-devtools` | `chrome-devtools` | E2E_Plan, E2E_Generate, E2E_Heal | Drive browser, snapshots, network capture |
| UI Component Library | `Ant Design Components` | `antd` | UI_Component_Lookup (Coder, Reviewer) | Component docs, examples, changelog |
| Library documentation | `context7` | `context7` | All agents on demand | Up-to-date docs for any library |

> **Note:** In Copilot, `allowedModels` per MCP server controls which models can use it. In Claude Code, `permissions.allow` (e.g., `mcp__ado__*`) controls which MCP tools run without confirmation prompts — there is no per-model filtering equivalent.

---

## Shared resources (used by both platforms unchanged)

| Resource | Location | Description |
|---|---|---|
| Memory bank (runtime) | `.dev-agents/memory-bank/` | Session logs, patterns, learnings — read/written by both Copilot and Claude Code agents |
| Document templates | `.dev-agents/template-docs/` | 13 canonical templates — BRD, User Story, Implementation Plan, etc. |
| Workflows (YAML) | `.dev-agents/workflows/` | master.yaml, dev.yaml, qa.yaml — executed by Orchestrator on both platforms |
| Agent definitions | `.dev-agents/agents/` | 5 agent definitions — stubs in both `.github/agents/` and `.claude/agents/` point here |
| Skill definitions | `.dev-agents/skills/` | 12 skill definitions — stubs in both `.github/agents/Skills/` and `.claude/commands/` point here |
| Codemap index | `.dev-agents/memory-bank/00-shared/codemap/` | Navigation index (structure, symbols, dependency graph, API index, test map) — shared by both platforms |

---

## Behavioral differences

| Feature | Copilot | Claude Code | Impact |
|---|---|---|---|
| Agent invocation syntax | `@Orchestrator`, `@Bsa`, etc. (PascalCase) | `@orchestrator`, `@bsa`, etc. (kebab-case) | Casing change — identical semantics |
| Skill invocation | Inline instruction to the agent | `/gen-plan`, `/work-item`, etc. (slash commands) | Slash commands add discoverability and are callable standalone |
| Workflow invocation | `@Orchestrator full_dev <desc>` | `/workflow full_dev <desc>` | Slash command is shorter; both work via agent too |
| Timestamps (`Get-Date`) | PowerShell native in VS Code terminal | Requires `Bash(Get-Date*)` permission in `.claude/settings.json` | Already configured in `permissions.allow` |
| Memory Protocol Phase 3 (session close) | Embedded in agent/skill definitions | Embedded in agents + `Stop` hook reminder in `.claude/settings.json` | Functionally equivalent |
| Long workflows (context) | Single agent with one long context | Multiple subagents each with their own context window | Claude Code is more efficient for large multi-phase workflows |
| `feedback_level` / `execution_mode` | Detected by Orchestrator, propagated to all sub-agents | Same detection and propagation mechanism | No behavioral difference |
| MCP `allowedModels` | Per-server list of permitted Copilot models | Not applicable — Claude Code always uses Claude | No equivalent; Claude Code uses `permissions.allow` for tool authorization |
| Selftest | `@Orchestrator selftest` | `/selftest` | Identical checks; different invocation |

---

## Memory Protocol lifecycle (identical on both platforms)

```
Step 0   → resolve: memory_path = .dev-agents/memory-bank/20-agents/{agent_name}/
Step 0.5 → resolve author: git config user.email  (silent)
Phase 1  → SESSION START: load session_log (last entry) → inject hint → register active entry
Phase 1.5→ REF DISCOVERY: read 00-shared indices → tag-match → load matched patterns
Phase 2  → PROACTIVE SAVES: save after bugfix / decision / pattern / config / security / naming
Phase 3  → SESSION CLOSE: update session entry with accomplished + discoveries + next_session_hint
           (Claude Code: also triggered by Stop hook reminder in .claude/settings.json)
RESET    → re-resolve path → migrate RECOVERY_NOTE if found → session_log → context → resume
```

---

## File-by-file status

| Canonical file (`.dev-agents/`) | Copilot file (`.github/`) | Claude Code file (`.claude/`) | Status |
|---|---|---|---|
| `.dev-agents/AGENTS.md` | `.github/AGENTS.md` (stub + fallback) | `CLAUDE.md` (protocol embedded) | ✅ Both operational |
| `.dev-agents/agents/Orchestrator.md` | `.github/agents/Orchestrator.md` (stub) | `.claude/agents/orchestrator.md` (stub) | ✅ Both operational |
| `.dev-agents/agents/Bsa.md` | `.github/agents/Bsa.md` (stub) | `.claude/agents/bsa.md` (stub) | ✅ Both operational |
| `.dev-agents/agents/Coder.md` | `.github/agents/Coder.md` (stub) | `.claude/agents/coder.md` (stub) | ✅ Both operational |
| `.dev-agents/agents/Reviewer.md` | `.github/agents/Reviewer.md` (stub) | `.claude/agents/reviewer.md` (stub) | ✅ Both operational |
| `.dev-agents/agents/QA_Orchestrator.md` | `.github/agents/QA_Orchestrator.md` (stub) | `.claude/agents/qa-orchestrator.md` (stub) | ✅ Both operational |
| `.dev-agents/skills/Memory_Protocol/` | `.github/agents/Skills/Memory_Protocol/` (stub) | Automatic (embedded in CLAUDE.md + hooks) | ✅ Both operational |
| `.dev-agents/skills/Implementation_Plan_Generator/` | `.github/agents/Skills/Implementation_Plan_Generator/` (stub) | `.claude/commands/gen-plan.md` → `/gen-plan` | ✅ Both operational |
| `.dev-agents/skills/WorkItem_Operations/` | `.github/agents/Skills/WorkItem_Operations/` (stub) | `.claude/commands/work-item.md` → `/work-item` | ✅ Both operational |
| `.dev-agents/skills/UI_Component_Lookup/` | `.github/agents/Skills/UI_Component_Lookup/` (stub) | `.claude/commands/ui-lookup.md` → `/ui-lookup` | ✅ Both operational |
| `.dev-agents/skills/Db_Review/` | `.github/agents/Skills/Db_Review/` (stub) | `.claude/commands/db-review.md` → `/db-review` | ✅ Both operational |
| `.dev-agents/skills/Test_Runner/` | `.github/agents/Skills/Test_Runner/` (stub) | `.claude/commands/test-run.md` → `/test-run` | ✅ Both operational |
| `.dev-agents/skills/E2E_Plan/` | `.github/agents/Skills/E2E_Plan/` (stub) | `.claude/commands/e2e-plan.md` → `/e2e-plan` | ✅ Both operational |
| `.dev-agents/skills/E2E_Generate/` | `.github/agents/Skills/E2E_Generate/` (stub) | `.claude/commands/e2e-gen.md` → `/e2e-gen` | ✅ Both operational |
| `.dev-agents/skills/E2E_Heal/` | `.github/agents/Skills/E2E_Heal/` (stub) | `.claude/commands/e2e-heal.md` → `/e2e-heal` | ✅ Both operational |
| `.dev-agents/workflows/master.yaml` | Referenced by Orchestrator stub | `/workflow` command | ✅ Both operational |
| `.dev-agents/workflows/qa.yaml` | Referenced by QA_Orchestrator stub | `/qa` command | ✅ Both operational |
| `.dev-agents/memory-bank/` | 🔁 Shared runtime (no stub) | 🔁 Shared runtime (no stub) | ✅ Shared |
| `.dev-agents/template-docs/` (13 templates) | 🔁 Shared runtime (no stub) | 🔁 Shared runtime (no stub) | ✅ Shared |
| `.vscode/mcp.json` | Used by Copilot (unchanged) | `.claude/settings.json` → `mcpServers` | ✅ Both configured |
| `.vscode/settings.json` (`allowedModels`) | Used by Copilot (unchanged) | No equivalent — `permissions.allow` used instead | ⚠️ Documented — no functional gap |
| `.dev-agents/skills/Update_Docs/` | `.github/agents/Skills/Update_Docs/` (stub) | `.claude/commands/update-docs.md` → `/update-docs` | ✅ Both operational |
| `.dev-agents/skills/Codemap/` | `.github/agents/Skills/Codemap/` (stub) | `.claude/commands/codemap.md` → `/codemap` | ✅ Both operational |
| `.dev-agents/skills/UX_Booster/` | `.github/agents/Skills/UX_Booster/` (stub) | `.claude/commands/ux-booster.md` → `/ux-booster` | ✅ Both operational |
| — | — | `/selftest` | ✅ New in Claude Code (equivalent: `@Orchestrator selftest`) |
| — | — | `/review` | ✅ New shorthand in Claude Code |
