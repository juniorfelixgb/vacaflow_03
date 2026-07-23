# Output Style — Chat Output Contract

> **Single source of truth** for how every QA command formats its chat output. Commands
> keep only their lane-specific content (column names, phase names); the block shapes and
> conventions below are canonical and never restated elsewhere.
> Scope: **chat output only.** Disk logs written by `/qa-loop` follow
> [log-format.md](log-format.md) — the two standards cross-reference, never conflict.

The audience is a **mixed QA team**: manual QAs and automation engineers. Every block must
be readable by someone who does not know the internals — explain gates and decisions in
plain English, one sentence each.

---

## 1. STATUS block — print at every phase transition

```
── STATUS ────────────────────────────────────────────
Command: /{command}   Phase: {n}/{total} — {phase name}
Done:    {one plain-English sentence — what just finished}
Next:    {one plain-English sentence — what happens now}
──────────────────────────────────────────────────────
```

Rules:
- `Done`/`Next` are full sentences, no jargon, no abbreviations the team hasn't seen.
- Never skip the STATUS block, even when a phase is skipped — say why it was skipped.

## 2. CHECKPOINT block — every HITL gate uses this shape

```
── CHECKPOINT {CP-id} ────────────────────────────────
Decision: {what is being decided, one sentence}
Why it matters: {plain-English consequence of this decision}

{the payload to review: table, diff summary, or file list}

Options:
  APPROVE          → {what happens next, one line}
  REJECT: {notes}  → {what happens next, one line}
  SKIP             → {what happens next, one line — omit if not applicable}
  STOP             → {what happens next, one line}
──────────────────────────────────────────────────────
```

Rules:
- Always name the checkpoint id (CP-1, CP-AC, CP-3, CP-4, CP-5, CP-6, CP-PII, CP-CLEAN, CP-CANARY, CP-SIGNOFF).
- A command may add a command-specific option (e.g. `APPROVE WITH RISKS` in CP-SIGNOFF) — it must follow the same `OPTION → consequence` one-line shape.
- "Why it matters" is written for a manual QA — no internal jargon (say "test that
  deliberately injects bugs to measure assertion quality", not just "mutation testing").
- Wait for an explicit answer. Never default, never time out, never pre-select.

### 2b. Document verification gate — for generated SDLC documents

When the payload is a generated document (Test Strategy, Test Plan, Test Cases, UAT Plan,
Test Report — e.g. the gates of `/qa-docs`), the gate must let the human **verify, not just
confirm**. Use the CHECKPOINT shape with a content digest instead of a bare file list:

```
── CHECKPOINT {CP-id} ────────────────────────────────
Decision: approve {document} (v{n} draft) to continue to {next artifact}
Why it matters: {what downstream artifacts depend on this one}

VERIFY — content digest:
  {key sections summarized; every line carries its inline citation (DOC-ID §x / QD-NN)}

SELF-CHECKS (already validated by the agent):
  ✅/❌ all output in English · every claim cited · contract fulfilled (with counts)

DOWNSTREAM IMPACT: {what approving THIS locks in for the next artifacts}
Open questions: {list, or "none"}
Artifact: {clickable file link}

Options:
  APPROVE          → mark Status: Approved, continue to {next step}
  EDIT: {notes}    → revise per notes, re-present showing ONLY the diff (before → after)
  REJECT: {why}    → stop the pipeline, record the reason
  SHOW FULL        → render the complete document in chat, then re-present this gate
──────────────────────────────────────────────────────
```

Rules: always offer **SHOW FULL**; every digest line cites its source; on **EDIT**,
re-present the same gate showing only the changed sections, not the whole document.

## 3. END-OF-RUN SUMMARY — every command run ends with this

```
── SUMMARY ───────────────────────────────────────────
Created/Modified:
  {file path} — {one-line description of what/why}

Gates:
  | Gate | Threshold | Result | Meaning |
  |------|-----------|--------|---------|
  | {gate} | {value} | ✅/⚠️/❌ | {one plain-English sentence} |

Next step: {the exact command to type, e.g. /qa-lane regression 12345}
──────────────────────────────────────────────────────
```

Rules:
- Every gate row gets a plain-English "Meaning" — aimed at a manual QA.
- `Next step` is always a concrete, typeable command (or "none — work complete").

## 4. Conventions (apply everywhere)

| Symbol | Meaning |
|--------|---------|
| ✅ | Passed / complete / covered |
| ⚠️ | Passed with warnings / needs attention soon |
| ❌ | Failed / blocked / uncovered |

- **Result first.** Never bury a failure below the fold — failures and blockers appear in
  the first lines of any block, details after (consistent with `log-format.md`).
- **No unexplained jargon.** First use of a technical term in a session gets a
  parenthetical one-line explanation.
- Separator lines use `─` box-drawing characters, as in the templates above.
- Keep blocks compact: payload tables show what changed/failed, not everything that exists.
