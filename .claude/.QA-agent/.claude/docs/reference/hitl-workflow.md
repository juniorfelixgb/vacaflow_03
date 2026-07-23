# HITL Working Cadence — Short-Block Methodology

> **Single source of truth** for *how a session is paced*: the order of blocks, when to
> pause for a human, and how big a unit of work is before it must be reviewed. It **composes**
> the block shapes defined in [output-style.md](output-style.md) and the presentation rules
> in [visual-presentation.md](visual-presentation.md) — it never restates either. When the
> *shape* of a block changes, change `output-style.md`; when the *cadence* changes, change
> this file.

The audience is a **mixed QA team** (manual QAs and automation engineers). The goal of this
cadence is to keep the human in the loop on **short, reviewable increments**: small enough
to read and verify, never a large change dropped all at once.

---

## The loop — five steps per block

Every prompt (a question, a task, an improvement, a bug) is run as one or more **blocks**.
A block is one ToDo list taken from approval through to a reviewed summary. Each block runs
these five steps in order:

| Step | Name | What happens | Block / tool (from `output-style.md`) |
|------|------|--------------|----------------------------------------|
| 0 | **INTAKE** | Classify the prompt (question / task / improvement / bug) and restate the understood goal in one sentence. | `STATUS` |
| 1 | **CLARIFY** | Ask focused questions in **one batch** (`AskUserQuestion`), driven by the intake checklist below. Skip only if the request is already unambiguous — and say so. | `AskUserQuestion` |
| 2 | **PLAN** | Propose the ToDo list: write it to native `TodoWrite` **and** render it as a markdown table inside a `CHECKPOINT` (**CP-TODO**). Wait for APPROVE / EDIT / REJECT. | `TodoWrite` + `CHECKPOINT` |
| 3 | **EXECUTE** | Work the list **item by item**. Mark each `TodoWrite` item `in_progress` → `completed`. Pause after each *write* item; auto-advance read-only items. | `STATUS` per item |
| 4 | **SUMMARY** | End-of-block recap: what changed (files + one-line why), a gate table, and the next step. Wait for APPROVE / EDIT / REJECT. | `SUMMARY` + `CHECKPOINT` (**CP-BLOCK**) |

---

## Step 0 — INTAKE

Print a `STATUS` block. Classify the prompt and state the goal in one plain sentence so the
user can confirm you understood:

- **question** — answer-only; usually no ToDo list, no write steps. Answer, then stop.
- **task** — new work to implement (tests, page objects, docs, config).
- **improvement** — change to something that already exists.
- **bug** — a defect to reproduce/report (route through `bug-reporting` / **CP-5**).

If the classification is obvious and the work is trivial (a one-line answer, a typo fix),
say so and skip straight to doing it — the cadence serves the human, it is not a ritual.

## Step 1 — CLARIFY

Ask everything you need in **one** `AskUserQuestion` batch (not a drip of questions). Use
this intake checklist to decide what to ask — ask only the items that are actually unclear:

1. **Goal** — what outcome does "done" look like?
2. **Scope** — which lane / files / modules are in and out of scope?
3. **Constraints** — stack, config, thresholds, anything that must not change.
4. **Done-criteria** — how will the user verify the result (run, test, read)?

Skip this step when the request is already unambiguous; when you skip, state in the INTAKE
`STATUS` line that no clarification was needed.

## Step 2 — PLAN (gate **CP-TODO**)

Turn the clarified request into a ToDo list and present it for approval:

1. Write the list to native `TodoWrite` (live tracking the user sees as it runs).
2. Present the **same** list to the user with the **plain-language approval gate** in
   [visual-presentation.md](visual-presentation.md) — a short "what I'll do" list ending in
   **"¿Qué quieres hacer?"** with **Aprobar / Editar / Rechazar** in plain words. **No
   box-drawing, no exposed `CP-TODO` id, no jargon columns** — the gate is read by
   non-technical users.
3. Keep `read-only` vs `write` type and the touched artifact as **internal** metadata (they
   drive the execution cadence in Step 3); do **not** put them in the user-facing table,
   which shows only `# · Qué voy a hacer`.
4. Tell the user in one plain sentence when you will pause (see "Execution cadence" below).
5. On **Editar**, revise the list and re-present it showing only what changed. The `CP-TODO`
   id is recorded in the audit trail but never shown as a header.

Keep it short — one block = one screen.

## Step 3 — EXECUTE (one `STATUS` per item)

Work the approved list top to bottom:

- Mark the current `TodoWrite` item `in_progress`, do it, mark it `completed`.
- After each item, print a **plain one-line progress update** (the format in
  [visual-presentation.md](visual-presentation.md) → "Progress update") showing what that
  item produced — a file changed, a count, a finding. No box-drawing.
- **Pause after every *write* item** and wait for the user before the next write item.
  **Read-only items auto-advance** (no pause) so inspection never adds friction.
- The user can say **"continue all"** to switch the rest of the block to batch mode (no
  per-item pause); honor it for the remainder of the block only.
- If an item turns out to be irreversible or risky (deletes, overwrites, force-push,
  external calls), pause and raise it explicitly — approval of the ToDo list does **not**
  authorize a destructive action discovered mid-flight.

### Execution cadence (default)

The default balances "point by point" against friction:

- **Pause** after each item that **writes or changes state**, or is irreversible.
- **Auto-advance** read-only items (reads, searches, status).
- **"continue all"** → batch the remainder of the current block.

State this cadence at PLAN time. If the user prefers a different cadence (e.g. pause on
every item, or only at the end), follow it and record the choice for the block.

## Step 4 — SUMMARY (gate **CP-BLOCK**)

Close the block with the **plain-language summary gate** in
[visual-presentation.md](visual-presentation.md): a short "what changed" list (file + what
changed), a concrete next step, ending in **"¿Qué quieres hacer?"** with **Aprobar / Editar
/ Rechazar** in plain words — no box-drawing, no exposed `CP-BLOCK` id.

- **Aprobar** → block accepted; if more blocks remain, start the next one at Step 2.
- **Editar** → apply the change and re-present the summary showing only the diff.
- **Rechazar** → stop; record the reason.

The `CP-BLOCK` id is recorded in the audit trail but never shown to the user as a header.

---

## Block sizing

- **One ToDo list = one reviewable block.** If the work is large, split it into several
  blocks, each with its own PLAN → EXECUTE → SUMMARY. Do not grow a single list past what a
  human can review on one screen.
- A block should aim for a small number of items (a handful, not dozens). When a plan
  exceeds that, the first block's job is often to slice the work into later blocks.

## Checkpoints introduced here

| Checkpoint | Raised at | Decision |
|---|---|---|
| **CP-TODO** | end of Step 2 (PLAN) | Approve / edit the ToDo list before any work starts |
| **CP-BLOCK** | end of Step 4 (SUMMARY) | Approve / edit a completed block before the next one |

`CLARIFY` (Step 1) uses `AskUserQuestion`, **not** a checkpoint. Both new checkpoints follow
the `CHECKPOINT` shape and `OPTION → consequence` convention in
[output-style.md](output-style.md).

## Conventions

- **English in the repo, chat may be Spanish.** All artifacts, ToDo items, file content, and
  commit text are English; the conversation can be in the user's language (see
  [[workflow-phase-gates]]).
- **Result first.** Failures and blockers appear in the first lines of any block, per
  `output-style.md`.
- **Never default a gate.** Wait for an explicit decision at `CP-TODO` and `CP-BLOCK` — never
  auto-approve, never time out, never pre-select.
- **One message per gate (token-efficient).** Put the question **inside the same message** as
  the list/summary it refers to — never a separate turn. Recurring gates (CP-TODO, CP-BLOCK,
  per-item updates) use **plain inline text**, which costs one roundtrip and renders the same
  in terminal or chat. Reserve the interactive `AskUserQuestion` picker for **CLARIFY** (Step
  1), which runs **once per block** and has genuine multiple-choice options — using it on
  every recurring gate adds a roundtrip and tokens each time.
- This cadence layers **on top of** the lane checkpoints (CP-1, CP-AC, CP-3, …) enforced by
  `qa-orchestrator`; it does not replace them. When a lane checkpoint applies inside a block,
  raise it in place.
