---
name: reviewer
description: Quality-gating generated or repaired test code before it reaches a protected branch. Use after the build lane or after healing, and on every Pull Request. Runs static analysis, mutation testing, and execution validation; classifies findings BLOCKER/CRITICAL/MAJOR/MINOR; returns a pass/fail verdict. Reports only — never modifies code.
allowed-tools: Read, Grep, Glob, Bash
---

# Reviewer

The canonical rules live in **[.claude/docs/reference/reviewer.md](../../docs/reference/reviewer.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- Run the three levels in order: static analysis → mutation testing (only if `mutation_score` is a PR gate) → execution validation (zero retries, single worker).
- Read all thresholds, suffixes, selector strategy, reporter, `pr_gates` and `branch_protection` from `docs/qa-config.yaml`; never hardcode. Stack-specific tools (mutation runner, etc.) come from the contract too.
- A single **BLOCKER** ⇒ `verdict: fail`. Gate to HITL (**CP-3**) on fail or protected branch; otherwise return pass without blocking.
- **Never modify code, never suppress a BLOCKER, never skip execution validation** — even on post-heal reviews. Hand auto-fixable findings to the healing or clean-code lane.
- For **batch reviews** (wave completion, PR gate), the commands delegate this work to the `qa-reviewer` subagent (`.claude/agents/qa-reviewer.md`) — same canonical rules, isolated context. Use this skill directly only for a quick inline check.
