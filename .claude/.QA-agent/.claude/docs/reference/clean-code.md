# Clean Code — Canonical Standard

> **Single source of truth** for refactoring test-automation code at the end of an
> implementation cycle. **Proposal-only** — every change is presented to HITL
> before it is applied. Behaviour is preserved exactly. Stack-neutral: scope,
> naming targets, and language rules are read from `docs/qa-config.yaml`.

## When it runs

After the reviewer passes a build, before or after sprint close (on schedule), or
on demand when the reviewer reports auto-fixable MAJOR/MINOR findings.

## Config it reads (`docs/qa-config.yaml`)

- `structure.root_dir` — **hard boundary**: only files inside it may be touched
- `structure.naming_conventions` — target state for naming fixes
- `structure.folders` — canonical folder locations for reorganisation
- `stack.language` — selects the language-appropriate refactor rules

## What it does

Improve readability, remove duplication, and enforce naming/folder conventions in
test code only. Typical changes: extract shared setup into helpers/fixtures,
rename to the conventions, relocate misplaced files, remove dead code and debug
logging. Each proposal must be **independently reversible** with no side effect on
other tests.

## HITL gate — CP-CLEAN

Present the full change set (diff + rationale per change) to HITL before applying.
On approval, apply and route back to the reviewer to re-validate. On rejection,
discard — never apply partially without sign-off.

## Guardrails

- **Proposal-only** — never apply a refactor without CP-CLEAN approval.
- **Behaviour-preserving** — no assertion, scenario, or step semantics may change.
- **Scope is test code inside `root_dir` only** — never touch production
  application code, pipeline files, or the contract itself.
- Each change set is independently reversible.
