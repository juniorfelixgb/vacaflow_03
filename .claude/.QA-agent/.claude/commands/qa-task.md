---
description: Run any QA prompt (question, task, improvement, or bug) as short human-reviewable blocks — intake → clarify → approve a ToDo list → execute point-by-point → summarize, with a human gate at each step
argument-hint: "[the request — a question, task, improvement, or bug]"
allowed-tools: Read, Glob, Grep, Edit, Write, TodoWrite, AskUserQuestion, Bash(git status:*), Bash(git log:*)
---

# QA Task — Short-Block HITL Runner

You run the user's request as one or more **short, reviewable blocks** so the team stays in
the loop on small increments. You **orchestrate and gate** — the cadence rules live in
[.claude/docs/reference/hitl-workflow.md](../docs/reference/hitl-workflow.md) and the
presentation rules in [.claude/docs/reference/visual-presentation.md](../docs/reference/visual-presentation.md).
Do not restate those rules here; read and apply them.

Request: $ARGUMENTS

## How to run

Apply the five-step loop from `hitl-workflow.md` for every block:

1. **INTAKE** — restate the prompt's goal in one plain sentence and classify it. Keep it
   light; a `STATUS` block is optional, plain prose is fine for this audience.
2. **CLARIFY** — one batched `AskUserQuestion` using the intake checklist (goal / scope /
   constraints / done-criteria). Skip only when unambiguous, and say so.
3. **PLAN (CP-TODO)** — write the ToDo list to `TodoWrite` **and** present it with the
   **plain-language approval gate** in `visual-presentation.md`: a short "what I'll do" list
   (`# · Qué voy a hacer` only) ending in **"¿Qué quieres hacer?"** with **Aprobar / Editar
   / Rechazar** in plain words. **No box-drawing, no exposed CP-id, no jargon columns.** Say
   in one sentence when you'll pause. Wait for the answer.
4. **EXECUTE** — work item by item; mark each `TodoWrite` item `in_progress` → `completed`;
   give a **plain one-line progress update** per item. Pause after each **write** item;
   auto-advance **read-only** items; honor "continue all" / "continúa". Raise any
   newly-discovered destructive action explicitly — approval of the list does not authorize it.
5. **SUMMARY (CP-BLOCK)** — close with the **plain-language summary gate** ("what changed" +
   **"¿Qué quieres hacer?"** / Aprobar / Editar / Rechazar). If more blocks remain, start the
   next at step 3.

## Routing

This command runs the cadence; it does **not** own QA rules. When a step needs lane work,
delegate to the owning skill/command and keep running the cadence around it:

- Implementation (any lane style — pom-spec / bdd-gherkin / api-request) → `/qa-lane {name}`
  or `qa-orchestrator` routing.
- A bug to report → `bug-reporting` (**CP-5**).
- A formal SDLC document → `/qa-docs` or `qa-testing-strategy-architect`.
- Lane checkpoints (CP-1, CP-AC, CP-3, …) still apply **inside** a block — raise them in place.

## Guardrails

- One ToDo list = one block. Split large work into multiple blocks; never grow a list past
  what fits one screen.
- Never default or skip `CP-TODO` / `CP-BLOCK`; wait for an explicit decision.
- English in all artifacts and ToDo items; chat may be Spanish.
- Trivial questions/one-line fixes: answer directly and skip the ceremony (the cadence
  serves the human, it is not a ritual).

## Output contract

This command uses the **plain-language HITL blocks** in
[visual-presentation.md](../docs/reference/visual-presentation.md) (progress update /
approval gate / summary gate) — **not** the box-drawing STATUS/CHECKPOINT/SUMMARY shapes,
which stay for the technical lane commands. Checkpoint ids (CP-TODO / CP-BLOCK) are recorded
in the audit trail but never shown to the user. Every gate ends in "¿Qué quieres hacer?"
with Aprobar / Editar / Rechazar in plain words.
