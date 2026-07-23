---
name: hitl-workflow
description: Running any QA request as short, human-reviewable blocks — intake, clarify, propose a ToDo list for approval, execute point-by-point with a pause after each write step, then summarize for sign-off. Use when a prompt is a multi-step task or improvement, when the user wants to stay in the loop and verify increments, or when work should be planned and approved before it starts. The `/qa-task` command runs this explicitly; this skill applies the same cadence inside any session.
allowed-tools: Read, Glob, Grep, Edit, Write, TodoWrite, AskUserQuestion, Bash
---

# HITL Workflow

The canonical cadence lives in **[.claude/docs/reference/hitl-workflow.md](../../docs/reference/hitl-workflow.md)**.
Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Run the five steps in order: **INTAKE** (classify + restate goal) → **CLARIFY** (one
  batched `AskUserQuestion`, skip if unambiguous) → **PLAN / CP-TODO** (write the list to
  `TodoWrite` **and** render a markdown ToDo table in a `CHECKPOINT`) → **EXECUTE**
  (item-by-item, `STATUS` per item) → **SUMMARY / CP-BLOCK**.
- Block shapes come from [output-style.md](../../docs/reference/output-style.md); the ToDo
  table, badges, and bars come from [visual-presentation.md](../../docs/reference/visual-presentation.md).
  Never duplicate either.
- **Cadence:** pause after each *write* item, auto-advance *read-only* items, honor
  "continue all". Raise any newly-discovered destructive action explicitly — CP-TODO
  approval does not authorize it.
- One ToDo list = one block; split large work into multiple blocks. Never default or skip
  `CP-TODO` / `CP-BLOCK`.
- English in all artifacts and ToDo items; chat may be Spanish. This cadence layers on top
  of the lane checkpoints (CP-1, CP-AC, CP-3, …) — it does not replace them.
