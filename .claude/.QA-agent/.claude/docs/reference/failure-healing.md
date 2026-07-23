# Failure Healing — Canonical Standard

> **Single source of truth** for diagnosing and fixing failing Playwright /
> playwright-bdd tests. Applies to every lane style. Locator fixes defer to
> [locator-strategy.md](locator-strategy.md).

## Diagnosis categories

Read the full error + stack trace, then classify:

| Code | Symptom | Fix |
|------|---------|-----|
| **LOC** | `strict mode violation` / `locator resolved to N elements` | Narrow the locator: add role, name, or scope. See [locator-strategy.md](locator-strategy.md). |
| **STR** | `expected ... to have text` / assertion text mismatch | Re-inspect the UI; update the locator or the assertion to the real text/state. |
| **TIME** | `TimeoutError: waiting for ...` | Wait for the right state (`waitForLoadState` / `waitForAppReady`) **before** the action; or raise the element timeout. Never `waitForTimeout()`. |
| **MISS** | `No step definition found` / `Undefined step` *(BDD only)* | Implement the missing step, then re-run `bddgen`. |
| **MTH** | `Cannot find module` / TypeScript error | Fix the import path; check the page object export name. |
| **IMP** | Passes alone but fails in the suite | Add proper `beforeEach`/`afterEach` teardown — remove cross-test state. |
| **IMP** | `bddgen` fails with a parse error *(BDD only)* | Fix Gherkin syntax (indentation, keyword casing). |

## Healing protocol

1. Read the full error message and stack trace.
2. **Group failures by root cause** before fixing anything — one underlying cause
   often surfaces as many failures. Fix the cause once; never apply the same fix
   N times in cascade.
3. Identify the category from the table above.
4. Apply the **minimum fix** — never rewrite working code around the failure.
5. **Validate the proposed fix against the golden master** (`golden-master/README.md`)
   before applying. If the fix would introduce a golden-master violation, rewrite it
   — never present or apply a non-compliant fix.
6. Re-run **only the failing test** to confirm the fix.
7. Re-run the **full suite** to confirm no regressions.
8. If a fix causes a regression in a previously passing test → **revert** it and try a
   different approach.

## When healing triggers automatically

Beyond an explicit failing run, healing is triggered when a test's flakiness rate
exceeds `agents_config.flakiness_threshold_pct` in `docs/qa-config.yaml` (surfaced by
the metrics lane), and only auto-applies when `agents_config.healer_auto_trigger`
is true. Otherwise propose the fix and wait for sign-off.

## Forbidden healing actions

- ❌ `page.waitForTimeout()` as a fix — diagnose the real cause (usually TIME → wait for state).
- ❌ Changing assertions to make a test pass — fix the implementation instead.
- ❌ Commenting out assertions or scenarios.
- ❌ Changing step text to dodge a mismatch — fix the implementation.
- ❌ Skipping the failing step.

## Escalation

After **3** failed attempts on one test, stop and record an escalation with: exact error,
what was tried (category + each attempt), the likely root cause (e.g. element in an
iframe / shadow DOM — outside diagnostic scope), and a recommended manual action.
