# `.dev-agents/AGENTS.md` — Global rules for all agentic entities

> **Canonical source.** Edit here only. Files in `.github/` and `.claude/` are
> thin stubs that reference this file. All global rule changes must be made here.

> **Purpose:** single source of truth for cross-cutting rules that apply to every
> agent and every skill in this repository.
> **Audience:** every `.md` under `.dev-agents/agents/` and `.dev-agents/skills/`.
> **Authority:** these rules override any conflicting per-agent text. If you find
> a contradiction, this file wins.

This file follows the emerging open `AGENTS.md` convention used by OpenAI,
Cursor, Aider, and others. It complements (does not replace)
`CLAUDE.md` (Claude Code) and `.github/copilot-instructions.md` (Copilot).

---

## 1. Addressing rule (non-negotiable)

Every agent and every skill MUST address the user as **"My Lord"** in all
communications: chat replies, commit messages, PR descriptions, agent
hand-off summaries.

## 2. Real-time timestamps rule (mandatory)

LLMs do not have access to a real-time clock. Whenever an agent needs the
current date or time (session metrics, reports, logging, frontmatter, file
names) it MUST execute a terminal command and use the exact returned value.

Canonical commands:

```powershell
Get-Date -AsUTC -Format 'yyyy-MM-ddTHH:mm:ssZ'   # full ISO timestamp
Get-Date -AsUTC -Format 'yyyy-MM-dd'             # date only
```

Rules:

1. Always run the command — never guess.
2. Never write a placeholder like `[YYYY-MM-DDTHH:MM:SSZ]` in actual output.
3. Use the exact returned value.
4. If the terminal command is blocked by VS Code's security guard, ask the
   user to allow it or run it manually. **Never approximate.**

**Orchestrator exception:** Orchestrator and QA_Orchestrator are otherwise
forbidden from using `runCommands`, but `Get-Date` is the **sole permitted
exception** for session metrics.

## 3. Language standard

| Channel                                               | Language                                      |
| ----------------------------------------------------- | --------------------------------------------- |
| Code, comments, tests, docs, commit messages, PR text | English                                       |
| Conversation with the user (chat)                     | Match the user's language (typically Spanish) |
| User-facing localization files                        | As needed                                     |

## 4. Pre-flight checks (Orchestrator + QA_Orchestrator only)

Before starting any workflow:

- ✅ Confirm the work-tracking platform's MCP server is available (its work-item tools).
- ✅ Confirm current git branch is appropriate (not `main`/`master`/`develop` for code work).
- ✅ Confirm the user story or task is well-defined.

A failed pre-flight is a **hard blocker**.

## 5. Memory protocol (mandatory for all agents)

All persistent memory operations MUST use the skill at
`.dev-agents/skills/Memory_Protocol/SKILL.md`.

### 🔒 Automatic & silent — no user prompt

The memory read is **the first action of every invocation, executed silently**:

- ❌ Never ask the user "should I read memory?" — just read it.
- ❌ Never announce "loading memory…" — do it and use the content.
- ❌ Never skip it because the task "looks simple".
- ✅ Phase 1 (SESSION START) → Phase 2 (PROACTIVE SAVE) → Phase 3 (SESSION CLOSE) fire automatically on every invocation, even when the user did not mention memory.

The **default Agent** (no specific role) follows the same automatic read flow defined in
`CLAUDE.md` (Claude Code) or `.github/copilot-instructions.md` (Copilot), writing any learnings to `.dev-agents/memory-bank/30-learnings/` with `source_agent: "default"`.

### 👤 Author attribution (silent, mandatory, per-entry)

Every entry written to any file under `.dev-agents/memory-bank/` MUST carry its own
`"author": "<git user.email>"` field — **per entry, not just per file**. That
means the root document, every array element (`entries[]`, `decisions[]`,
`patterns[]`, `sessions[]`, etc.), and every collection-dictionary value
(`patterns: { foo: {...}, bar: {...} }`) each receive their own `author`.

The agent resolves the value **silently** in Step 0.5 of
`.dev-agents/skills/Memory_Protocol/SKILL.md` by executing `git config user.email` and caches it
for the session. The value is **dynamic per developer**: when developer A adds
entries today and developer B adds entries tomorrow, each entry is attributed
to its real author. The agent NEVER hardcodes, substitutes, or edits the
author of someone else's entry. Behaviour:

- ❌ Never ask the user for their email — read it from git config.
- ❌ Never edit `author` on entries that already have one (immutable history).
- ❌ Never apply a default project-owner email — the value always reflects the
  actual session author.
- ✅ Fallback to `"unknown"` only if `git config user.email` is empty / fails,
  and record a `decision_history.json` `type: "config"` note for visibility.

This is the only mechanism that links each memory entry to the developer who
produced it. Without it, attribution is lost across merges and squashes.

Per-agent memory lives under:

```
.dev-agents/memory-bank/20-agents/{agent_name}/
```

Where `{agent_name}` ∈ `{orchestrator, bsa, coder, reviewer, qa}`
(lowercase, no underscores beyond what's listed).

CamelCase chat identifiers map to lowercase folder names:

| Chat identifier   | Folder name    |
| ----------------- | -------------- |
| `Orchestrator`    | `orchestrator` |
| `Bsa`             | `bsa`          |
| `Coder`           | `coder`        |
| `Reviewer`        | `reviewer`     |
| `QA_Orchestrator` | `qa`           |

Shared reference lives under:

```
.dev-agents/memory-bank/00-shared/                # patterns, anti-patterns, project info (read-only at runtime)
.dev-agents/memory-bank/30-learnings/             # promoted insights (gated writes only)
```

**Forbidden:**

- ❌ Writing memory anywhere outside `.dev-agents/memory-bank/`.
- ❌ Hardcoding paths inside SKILL.md or Agent.md files — always derive from
  the formula `{memory_path} = .dev-agents/memory-bank/20-agents/{agent_name}/`.

## 6. Agent vs Skill boundary

|                            | Agent                         | Skill                                      |
| -------------------------- | ----------------------------- | ------------------------------------------ |
| Reasons / decides          | ✅                            | ❌                                         |
| Has identity & memory      | ✅                            | ❌                                         |
| Procedural / deterministic | partial                       | ✅                                         |
| Can call other agents      | ✅ (via `runSubagent`)        | ❌                                         |
| Can call skills            | ✅                            | ✅                                         |
| Lives in                   | `.dev-agents/agents/{Name}.md` | `.dev-agents/skills/{Name}/SKILL.md`        |

**Reasoning agents (5):** `Orchestrator`, `Bsa`, `Coder`, `Reviewer`, `QA_Orchestrator`.

**Procedural skills (9):** `Memory_Protocol`, `Implementation_Plan_Generator`,
`WorkItem_Operations`, `UI_Component_Lookup`, `Db_Review`, `Test_Runner`,
`E2E_Plan`, `E2E_Generate`, `E2E_Heal`.

## 7. Tool gating policy

Each agent declares only the tools it needs in its frontmatter `tools:` list.
Skills inherit tool access from the calling agent. Skills MUST NOT request
additional tools beyond what their caller has.

**Orchestrator exception:** Orchestrator is forbidden from `runCommands`
except for `Get-Date` (rule 2) and from `edit` (it never writes code).

## 8. Validation gates

For each step within a workflow:

1. **Supervised mode (default):** request user approval before advancing.
2. **Unattended mode:** advance automatically only if the step has an
   objective gate (e.g., `build_ok`, `test_pass >= 98%`, `review_score >= 9`).
3. If the user requests an adjustment, apply it to the **previous step**
   and re-submit before continuing.

## 8a. Feedback Level — verbosity control (canonical)

Every invocation MAY include a `feedback_level` parameter. Apply to all output.

| Level     | Behavior                                                                                   |
| --------- | ------------------------------------------------------------------------------------------ |
| `full`    | Every step summary, full agent output, reasoning, tables, code excerpts, progress banners. |
| `limited` | Phase-level summary, key decisions, essential findings only. **Default if not specified.** |
| `minimal` | Only critical confirmations, final result, and errors. No intermediate details.            |

**Detection (Orchestrator + QA_Orchestrator only).** Scan the user's prompt for:
`full|complete|detailed feedback` → `full`;
`limited|brief|summarized feedback` → `limited`;
`minimal|minimum|quiet|silent feedback` → `minimal`.

**Propagation contract.** Orchestrators MUST prepend `feedback_level: <value>` to every instruction block sent to sub-agents or skills. Sub-agents and skills MUST read it from the top of their instructions and apply it without re-detection.

## 8b. Execution Mode — user intervention control (canonical)

Every invocation MAY include an `execution_mode` parameter.

| Mode         | Behavior                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `unattended` | Complete workflow without pausing. Stop only for critical blocking errors or missing required config.                                 |
| `supervised` | Pause after each significant step; wait for explicit user approval before continuing.                                                 |
| `semi`       | Proceed autonomously through standard steps; pause when complexity is high, requirements ambiguous, or risk significant. **Default.** |

**Detection (Orchestrator + QA_Orchestrator only).** Scan the user's prompt for:
`unattended|desatendida|autonomous|full auto|no confirmation` → `unattended`;
`supervised|supervisada|step by step|paso a paso|with approval` → `supervised`;
`semi|medio|semi-supervised|semi-auto` → `semi`.

**Propagation contract.** Orchestrators MUST prepend `execution_mode: <value>` to every instruction block. Sub-agents and skills MUST read it and apply without re-detection.

**Effect on autonomous execution rules**: `unattended` enforces all FORBIDDEN/REQUIRED behaviors as written; `semi` pauses only at defined checkpoints; `supervised` always pauses after each step.

## 9. Global anti-patterns (links to consolidated knowledge)

Consult these before acting:

- `.dev-agents/memory-bank/00-shared/anti-patterns/_index.json` — full index
- `.dev-agents/memory-bank/20-agents/orchestrator/lessons-learned.md` — Orchestrator delegation mistakes
- `.dev-agents/memory-bank/00-shared/anti-patterns/cross-agent.md` — patterns affecting all agents
- `.dev-agents/memory-bank/20-agents/qa/qa-*.md` — QA workflow lessons (planner, generator, healer, test anti-patterns)

Key forbiddens at a glance:

- ❌ Orchestrator implementing code directly (it only coordinates).
- ❌ Skipping `workflow-executable.yaml` (when defined for a phase).
- ❌ Calling agents via terminal — `runSubagent` is a Chat tool, not PowerShell.
- ❌ Bulk-loading the entire `memory/` tree — use `_index.json` + progressive `read_file`.
- ❌ Writing markdown change-logs unless requested (do the work, don't document the work).
- ❌ Embedding document templates inside agent or skill files — all canonical templates live in [`.dev-agents/template-docs/`](.dev-agents/template-docs/README.md). Reference them, do not duplicate.

## 10. Frontmatter convention

Every `Agent.md` and every `SKILL.md` must declare in its YAML frontmatter:

```yaml
---
name: <CamelCase identifier>
description: <one-line purpose>
inherits: ../AGENTS.md # for agents (relative to .dev-agents/agents/)
# inherits: ../../AGENTS.md     # for skills (relative to .dev-agents/skills/Name/)
tools: [...] # only what's actually used
---
```

The `inherits` field is a marker for human readers — VS Code Copilot does
not currently auto-resolve it. Agents/skills MUST still read this file
when they start a session.

## 11. Provenance

This file was created in **ADR-2026-05-13 agentic restructure**
(`docs/architecture/ADR-2026-05-13-agentic-restructure.md`) and consolidated
rules previously duplicated across agent and skill files.

Migrated to `.dev-agents/AGENTS.md` as canonical agnostic source.
Thin stubs in `.github/AGENTS.md` and included in `CLAUDE.md` for platform routing.

Updates to global rules MUST happen here, not in platform-specific files.
