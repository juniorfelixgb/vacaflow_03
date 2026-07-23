---
name: memory-protocol
version: "2.0.0"
last_updated: "2026-05-13"
inherits: ../../AGENTS.md
description: >
  Universal persistent session memory for AI agents. Load this skill at the
  START of every session, DURING work to save discoveries, and at the END to
  write a session summary. Provides a complete Engram-inspired memory lifecycle:
  session_start → proactive saves → session_close → context recovery.
  Any agent that declares "Memory skill: Memory_Protocol" with its agent_name
  MUST follow this skill for ALL memory operations. Triggers: every session
  start, every significant discovery or decision, every session end, and every
  context reset or compaction. Replaces ad-hoc RECOVERY_NOTE.md files.
---

# Memory Protocol Skill — Universal Edition

Persistent memory for AI agents.
**One skill. Any agent. Isolated memory per agent, per project.**

---

## Core Principle

> The agent decides what is worth remembering.
> Memory is built from **curated summaries**, never raw tool call dumps.
> Token budget is preserved through **progressive loading**, not full reads.

---

## Step 0 — Resolve Memory Paths (FIRST action on every invocation)

Before anything else, resolve the memory paths from the calling agent's declared `agent_name`.

```
FORMULA (updated by ADR-2026-05-13):
  memory_root    = .dev-agents/memory-bank/
  memory_path    = .dev-agents/memory-bank/20-agents/{agent_name}/      ← per-agent (writable)
  shared_path    = .dev-agents/memory-bank/00-shared/                    ← read-only at runtime
  learnings_path = .dev-agents/memory-bank/30-learnings/                 ← promoted insights (gated)

EXAMPLES:
  agent_name = coder         →  .dev-agents/memory-bank/20-agents/coder/
  agent_name = reviewer      →  .dev-agents/memory-bank/20-agents/reviewer/
  agent_name = bsa           →  .dev-agents/memory-bank/20-agents/bsa/
  agent_name = orchestrator  →  .dev-agents/memory-bank/20-agents/orchestrator/
  agent_name = qa            →  .dev-agents/memory-bank/20-agents/qa/

  Sub-namespaces for skill-scoped memory:
    bsa/work-items     (used by WorkItem_Operations skill)
    coder/ui-components (used by UI_Component_Lookup skill)
    qa/test-runner     (used by Test_Runner skill)

NORMALIZATION:
  - {agent_name} is lowercase.
  - Map agent identifiers (Camel/Pascal in chat) to memory folder names:
      Orchestrator      ->  orchestrator
      Bsa               ->  bsa
      Coder             ->  coder
      Reviewer          ->  reviewer
      QA_Orchestrator   ->  qa
  - Legacy identifiers MUST be normalized:
      Coder_Checklist       ->  coder
      BSA                   ->  bsa
      Tester                ->  qa
      TestRunner            ->  coder
      DbaRev                ->  reviewer
      Bsa_Ado / BSA_ADO     ->  bsa

RULE: Every file read/write by this skill uses {memory_path} as root for
      per-agent memory, or one of the other tier paths for shared content.
      Never hardcode a path. Always derive from agent_name and tier.
```

---

## Step 0.5 — Resolve Author (silent, once per session)

Immediately after Step 0, resolve the human author behind this session **silently** — do not ask the user, do not announce it.

```
COMMAND:  git config user.email
CACHE AS: {author_email}    ← hold for the entire session

FALLBACK: if the command fails or returns empty:
  {author_email} = "unknown"
  Also append to {memory_path}/decision_history.json a type="config" entry titled
  "Session without git author" (one per session, max).
```

RULE: EVERY entry written by this skill — in any file under `.dev-agents/memory-bank/` —
MUST carry its own `"author": "{author_email}"` field. **Per-entry, not per-file.**

This applies to **every kind of entry**, including:
- Items inside `session_log.json`, `decision_history.json`, `learned_patterns.json`, `business_rules.json`, `naming_conventions.json`, `knowledge_index.json`.
- **Every entry of every `_index.json`** under `00-shared/`, `20-agents/`, and `30-learnings/`.
- Every object inside an array (`entries[]`, `decisions[]`, `patterns[]`, `sessions[]`, `rules[]`, `violations[]`, `corrections[]`, etc.) gets its own `author`.
- Schema/meta fragments (single-key objects, or objects whose keys start with `_`) are exempt.

---

## Memory Structure

```
{memory_path}/
├── session_log.json          ← Session lifecycle — START here every invocation
├── project_context.json      ← Language / framework / build (cached)
├── project_structure.json    ← Architecture layers and patterns (cached)
├── naming_conventions.json   ← Naming rules detected from codebase
├── learned_patterns.json     ← Code patterns with confidence levels
├── business_rules.json       ← Domain business rules (separate from code patterns)
└── decision_history.json     ← Every significant decision with rationale
```

> ⚠️ **ABSOLUTE RULE:** ALL files written by the agent go ONLY to `{memory_path}`.
> NEVER write to repo root, project root, or any other location.

---

## Phase 1 — SESSION START (MANDATORY on every invocation)

Run immediately after resolving `{memory_path}`. Before any task work.

```
STEP 1 — Migrate legacy files (run once if found, then never again):
  Does {memory_path}/RECOVERY_NOTE.md exist?
  → YES: Read its full content → Create session_log entry → Append → DELETE the file

STEP 2 — Check for existing session memory:
  Does {memory_path}/session_log.json exist?
  → YES (returning session): Read LAST entry only → Extract "next_session_hint" and "open_items" → Inject both
  → NO (first time): Proceed to agent's Discovery phase → After discovery, create all memory files from templates

STEP 3 — Register session start:
  APPEND to {memory_path}/session_log.json:
  {
    "session_id": "[ISO timestamp]",
    "agent": "[agent_name]",
    "status": "active",
    "task": "[one-line description of what the user requested]",
    "context_loaded": ["files actually read this session"]
  }
```

### Recovery after context reset or compaction

```
IF context was lost or agent was compacted:
  1. Re-resolve: memory_path = .dev-agents/memory-bank/20-agents/{agent_name}/
  2. Check for RECOVERY_NOTE.md → migrate if found (Step 1 above)
  3. Read session_log.json → find last entry with "status": "active"
  4. Read project_context.json → recover language/framework
  5. Read learned_patterns.json → load LAST 10 ENTRIES ONLY
  6. Resume from "next_session_hint" of last completed session

  NEVER re-run full discovery if memory files already exist.
  NEVER load all memory files in full — use targeted reads only.
```

---

## Phase 2 — PROACTIVE SAVES (during work)

Save proactively after significant work. Do NOT wait to be asked.

### Mandatory save triggers

| Event                                    | File to update                          |
| ---------------------------------------- | --------------------------------------- |
| Bug fixed                                | `{memory_path}/decision_history.json`   |
| Architecture or design decision made     | `{memory_path}/decision_history.json`   |
| New pattern discovered in codebase       | `{memory_path}/learned_patterns.json`   |
| New business rule discovered             | `{memory_path}/business_rules.json`     |
| Config or dependency changed             | `{memory_path}/decision_history.json`   |
| Security measure applied                 | `{memory_path}/decision_history.json`   |
| Naming convention confirmed or corrected | `{memory_path}/naming_conventions.json` |

### Save format — all entries use this structure

```json
{
  "id": "[ISO timestamp]",
  "agent": "[agent_name]",
  "author": "[author_email resolved in Step 0.5]",
  "type": "bugfix | decision | pattern | config | security | naming",
  "title": "[short descriptive title — max 10 words]",
  "what": "What was done or discovered",
  "why": "Why this approach was chosen",
  "where": ["path/to/file.ts"],
  "learned": "What the next session should know about this",
  "confidence": "low | medium | high",
  "session_id": "[same id as current session_log entry]"
}
```

### Confidence rules

- `low` — seen in fewer than 3 files → apply conservatively
- `medium` — seen in 3–9 files → apply with awareness
- `high` — seen in 10+ files consistently → apply freely

---

## Phase 3 — SESSION CLOSE (MANDATORY before finishing any task)

Write this before delivering the final response. **This is not optional.**
Skipping means the next session starts blind.

Update the active entry in `{memory_path}/session_log.json`:

```json
{
  "session_id": "[same id registered at session start]",
  "agent": "[agent_name]",
  "status": "completed",
  "task": "[original task description]",
  "goal": "What was requested in plain language",
  "accomplished": ["path/to/file.ts: what changed and why"],
  "discoveries": ["pattern or issue found during this session"],
  "files_touched": ["complete list of modified files"],
  "open_items": ["anything left pending or unresolved"],
  "next_session_hint": "One sentence: what the next session must know first to continue effectively"
}
```

---

## Progressive Loading — 3-Layer Pattern

Never load all memory files at once. Drill in only as needed.

```
Layer 1 (always):    session_log.json      → last entry only          (~50 tokens)
Layer 2 (on need):   learned_patterns.json → grep by keyword          (~100 tokens/match)
Layer 3 (on demand): decision_history.json → load by session_id only  (~150 tokens/entry)
```

---

## Memory Refresh

Triggered when user runs: `@[AgentName] Refresh your knowledge`

```
1. Re-resolve memory_path from agent_name
2. Re-scan reference folders for new or modified files
3. Re-detect project structure if folders changed
4. Update project_context.json and project_structure.json
5. Preserve ALL entries in learned_patterns.json — NEVER wipe, only append
6. Append a refresh entry to session_log.json
7. Report: files added / structure changes / patterns preserved
```

---

## Privacy

Wrap sensitive values in `<private>` tags — stripped before writing to disk.

```
Input:  "Connected to <private>server=prod;password=abc123</private>"
Stored: "Connected to [REDACTED]"
```

---

## How to Add This Skill to Any Agent

Add these **two lines** to the agent's Memory section:

```markdown
## Memory

Skill: .dev-agents/skills/Memory_Protocol/SKILL.md
Agent name: [exact name matching folder convention]
```

### Naming convention

| Agent file (`.dev-agents/agents/`) | `agent_name` to declare | Resolved memory path                     |
| --------------------------------- | ----------------------- | ---------------------------------------- |
| `Orchestrator.md`                 | `orchestrator`          | `.dev-agents/memory-bank/20-agents/orchestrator/` |
| `Bsa.md`                          | `bsa`                   | `.dev-agents/memory-bank/20-agents/bsa/`          |
| `Coder.md`                        | `coder`                 | `.dev-agents/memory-bank/20-agents/coder/`        |
| `Reviewer.md`                     | `reviewer`              | `.dev-agents/memory-bank/20-agents/reviewer/`     |
| `QA_Orchestrator.md`              | `qa`                    | `.dev-agents/memory-bank/20-agents/qa/`           |

---

## Quick Reference Card

```
STEP 0   → resolve: memory_path = .dev-agents/memory-bank/20-agents/{agent_name}/
MIGRATE  → if RECOVERY_NOTE.md exists → absorb into session_log.json → delete it
PHASE 1  → read session_log.json (last entry) → inject hint → register active entry
PHASE 2  → save after: bugfix / decision / pattern / config / security / naming
PHASE 3  → update session entry: accomplished + discoveries + hint  ← NEVER SKIP
RESET    → re-resolve path → migrate note if found → session_log → context → resume
REFRESH  → re-scan refs → update context/structure → preserve all patterns
```
