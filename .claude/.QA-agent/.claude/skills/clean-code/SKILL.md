---
name: clean-code
description: Refactoring test-automation code at the end of an implementation cycle. Use after the reviewer passes a build, around sprint close, or when the reviewer flags auto-fixable findings. Improves readability, removes duplication, and enforces naming/folder conventions while preserving behaviour. Proposal-only — never applies changes without HITL approval.
---

# Clean Code

The canonical rules live in **[.claude/docs/reference/clean-code.md](../../docs/reference/clean-code.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Read `structure.root_dir`, `structure.naming_conventions`, `structure.folders`, and `stack.language` from `docs/qa-config.yaml`. Scope is **test code inside `root_dir` only**.
- Improve readability, remove duplication, enforce conventions, relocate misplaced files, drop dead code. Each change set must be independently reversible and behaviour-preserving.
- Gate the full change set to HITL at **CP-CLEAN** before applying; on approval, apply and route back to the **reviewer** to re-validate.
- **Never apply without CP-CLEAN, never change test semantics, never touch production code / pipeline files / the contract.**
