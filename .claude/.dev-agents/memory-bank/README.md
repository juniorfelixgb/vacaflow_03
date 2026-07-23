# `.dev-agents/memory-bank/` — Unified Agentic Memory Bank

> Created by ADR-2026-05-13. Replaces the 7 scattered `References/{Agent}_references/memory/` folders and consolidates `.dev-agents/memory-bank/00-shared/` patterns and lessons.

---

## Tier overview

| Tier            | Purpose                                                     | Lifecycle                          | Who writes                                |
| --------------- | ----------------------------------------------------------- | ---------------------------------- | ----------------------------------------- |
| `00-shared/`    | Stable reference: patterns, anti-patterns, project facts    | Permanent, versioned via PR        | Humans, or Reviewer on approved promotion |
| `20-agents/`    | Per-agent operational memory: session logs, decisions       | Rotates (30 days for session logs) | Each agent via `Memory_Protocol` skill    |
| `30-learnings/` | Cross-agent insights, promoted from `20-agents/` after gate | Permanent                          | Promotion only (manual or Reviewer-gated) |

Code-domain documentation lives in [`docs/architecture/`](../../docs/architecture/), not under `memory/`.

---

## Layout

```
.dev-agents/memory-bank/
├── 00-shared/
│   ├── project/               # stack.md, conventions.md, references, priorities
│   ├── patterns/              # Approved patterns + _index.json
│   └── anti-patterns/         # Consolidated lessons + _index.json
├── 20-agents/
│   ├── orchestrator/          # session_log.jsonl, decisions.json
│   ├── bsa/
│   ├── coder/
│   ├── reviewer/
│   └── qa/                    # includes nested test-runner/ if needed
└── 30-learnings/              # promoted insights with rationale
```

---

## Write rules (critical)

1. **`20-agents/<name>/session_log.jsonl`** — append-only, owner-only writes via `Memory_Protocol` skill. Rotation policy: entries older than 30 days are archived/dropped.
2. **`30-learnings/`** — write requires a gate: Reviewer score ≥9/10 OR explicit human approval.
3. **`00-shared/`** — read-only for agents at runtime. Updates only via PR.
4. **`_index.json`** in `patterns/` and `anti-patterns/` — must be updated whenever a file is added/removed. Enables progressive loading (search the index first, read individual files on demand).

---

## Path resolution (used by `Memory_Protocol` skill)

```
memory_root   = .dev-agents/memory-bank/
shared_path   = .dev-agents/memory-bank/00-shared/
agent_path    = .dev-agents/memory-bank/20-agents/{agent_name}/
learnings_path= .dev-agents/memory-bank/30-learnings/
```

`{agent_name}` is the lowercase, dash-free identifier (e.g., `coder`, `bsa`, `reviewer`, `orchestrator`, `qa`).

---

## Progressive loading policy

Agents MUST NOT bulk-load this tree on startup. The expected pattern is:

1. Read `20-agents/{name}/session_log.jsonl` — last entry only.
2. Read `00-shared/patterns/_index.json` (small, lookup only).
3. Read individual files on demand via `read_file` when relevant.

This keeps the per-invocation context budget bounded.
