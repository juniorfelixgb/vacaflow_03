---
name: failure-healing
description: Diagnosing and fixing failing Playwright / playwright-bdd tests. Use when a test fails, a run reports errors, a TimeoutError or strict-mode violation appears, an assertion mismatches, or bddgen fails. Classifies failures into LOC/STR/TIME/MISS/MTH/IMP, applies the minimum fix, and enforces the forbidden-fix rules (no waitForTimeout, no weakened assertions).
---

# Failure Healing

The canonical rules live in **[.claude/docs/reference/failure-healing.md](../../docs/reference/failure-healing.md)**. Read it and apply it — do not restate or invent rules here.

How to apply in this repo:
- **Group failures by root cause first** — fix the cause once, never cascade the same fix. Read the full error + stack trace; classify as **LOC / STR / TIME / MISS / MTH / IMP**; apply the **minimum** fix; re-run the failing test, then the full suite; revert any fix that causes a regression.
- Validate every proposed fix against the **golden master** before applying. Auto-trigger on flakiness over `agents_config.flakiness_threshold_pct` only when `healer_auto_trigger` is true; otherwise propose and wait.
- LOC → narrow the locator ([locator-strategy]). TIME → wait for state (`waitForAppReady`), never `waitForTimeout()`. MISS → implement the step + re-run `bddgen`.
- Forbidden: weakening/commenting assertions, dodging step text, skipping steps. Escalate with detail after 3 failed attempts on one test.
- For **batch heals**, the commands delegate this work to the `qa-healer` subagent (`.claude/agents/qa-healer.md`) — same canonical rules, isolated context. Use this skill directly only for a single quick inline fix.
