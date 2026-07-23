# `00-shared/` — Stable shared reference

Read-only at runtime for agents (except via PR review). Updated through pull requests, not by agent writes.

## Contents

- **`project/`** — project-wide facts and references.
  - `quick-reference.md` · `references.md` · `priorities.md`
- **`patterns/`** — approved implementation patterns. See `_index.json`.
- **`anti-patterns/`** — cross-agent lessons learned (orchestrator, cross-agent, core). See `_index.json`. QA-specific lessons live in `memory/20-agents/qa/`.

## Provenance

Created in ADR-2026-05-13 agentic restructure. Files were relocated from:

- `Shared_documentation/PATTERN_*.md` and `QUICK_REF_*.md` → `patterns/`
- `Shared_documentation/Cross_Agent_Learnings.md` + `Appendix_Patterns_and_lessons.md` → `anti-patterns/`
- `Orchestrator_references/lessons-learned.md` → `memory/20-agents/orchestrator/lessons-learned.md` (staged in `anti-patterns/orchestrator.md` first, moved in G4 on 2026-05-13)
- `Shared_documentation/Quick_Reference.md` · `References.md` · `Priorities_and_conflict_resolution.md` → `project/`

QA-specific anti-patterns (qa-healer, qa-generator, qa-planner, qa-test-anti-patterns) were temporarily staged here and later moved to `memory/20-agents/qa/` (F4, 2026-05-13).
