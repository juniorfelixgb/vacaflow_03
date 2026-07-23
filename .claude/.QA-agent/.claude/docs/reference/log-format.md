# Log Format — Canonical Standard

> **Single source of truth** for the phase logs written by `/qa-loop` to disk.
> Every phase log follows the same 3-section structure. Never deviate from it.
> Chat output (STATUS / CHECKPOINT / SUMMARY blocks) is governed separately by
> [output-style.md](output-style.md) — the two standards never conflict.

## Structure

```
════════════════════════════════════════════════════════
PHASE {N}: {PHASE NAME}
════════════════════════════════════════════════════════
PBI:    {work item id or file}
Lane:   {lane name · style}
Date:   {YYYY-MM-DD}
Result: {✅ COMPLETE | ⚠️ PARTIAL | ❌ FAILED} — {summary line}

────────────────────────────────────────────────────────
{PHASE-SPECIFIC TABLE}   ← see each phase for the table format
────────────────────────────────────────────────────────

────────────────────────────────────────────────────────
ITERATIONS
────────────────────────────────────────────────────────
 Iter 1  {what ran}  {outcome}  → {DONE | RETRY: reason | MAX ITER}
 Iter 2  Fix {TC-ID}: {what changed}  {outcome}  → {DONE | RETRY | MAX ITER}
 ...
 {If only 1 iteration and no failures: "Iter 1  → DONE — no retries needed"}

────────────────────────────────────────────────────────
FILES CHANGED
────────────────────────────────────────────────────────
 {relative/path/to/file.ts}       {what changed — e.g. "+3 locators, +1 method"}
 {relative/path/to/file.feature}  {what changed — e.g. "+4 scenarios"}
 {None — if no files were changed this phase}
```

## Content rules

- **Result line is always first** — the reviewer sees the outcome without scrolling.
- **Tables use fixed columns** — one row per TC or AC, no sub-rows, no nested text.
- **ITERATIONS** shows only what *changed* per iteration, not what was read or scanned.
- Each iteration line ends with → `DONE` / `RETRY: {reason}` / `MAX ITER` — always explicit.
- **FILES CHANGED** lists every file touched, with a one-line description.
- No internal reasoning, no "I decided to…", no analysis paragraphs — facts and data only.

## Log integrity

- **Overwrite the full phase log file each iteration** (not append) — the file always
  shows the current state.
- The **Result line** at the top always reflects the state after the latest iteration.
- The **ITERATIONS** section is cumulative — all iterations appear, newest at the bottom.
- **FILES CHANGED** is cumulative — every file touched across all iterations.
