# Reviewer — Canonical Standard

> **Single source of truth** for the quality gate that runs before generated or
> repaired test code reaches a protected branch. Stack-neutral: every concrete
> value (suffixes, thresholds, gates, tools) is read from `docs/qa-config.yaml`
> — never hardcoded. The Reviewer **never modifies code**;
> it only reports and gates.

## When it runs

- After the build lane finishes (standard review).
- After healing applies fixes (post-heal review — always re-validate).
- On every Pull Request, as a PR gate.

## Config it reads

| Source | Field | Use |
|--------|-------|-----|
| `docs/qa-config.yaml` | `structure.naming_conventions` | static naming checks (e.g. `spec_suffix`, `step_suffix`) |
| `docs/qa-config.yaml` | `structure.selector_strategy` | locator-compliance check |
| `docs/qa-config.yaml` | `structure.reporter` | required report annotations (e.g. Allure ids/severity) |
| `docs/qa-config.yaml` | `agents_config.mutation_score_threshold` | pass/fail bar for mutation testing |
| `docs/qa-config.yaml` | `cicd.pr_gates` | which checks are blocking vs advisory |
| `docs/qa-config.yaml` | `cicd.branch_protection` | which branches enforce which gates |

## Three review levels (in order)

1. **Static analysis** — no execution. Check each in-scope file against the
   contract conventions. Map each finding to a severity (table below).
2. **Mutation testing** — only if `mutation_score` is in `cicd.pr_gates`. Run the
   configured mutation tool for the stack (read from contract). Score below
   `mutation_score_threshold` → CRITICAL finding.
3. **Execution validation** — run the in-scope tests with **zero retries** and a
   single worker (deterministic). Any runtime failure → BLOCKER finding. Never
   skip this level, even for post-heal reviews.

## Severity classification

| Finding | Severity |
|---------|----------|
| Missing **required** report annotation (id, severity) | BLOCKER |
| Execution failure | BLOCKER |
| Selector violates `selector_strategy` | CRITICAL |
| Hard-coded wait (`waitForTimeout` and equivalents) | CRITICAL |
| Mutation score below threshold | CRITICAL |
| Naming-convention violation | MAJOR |
| Hardcoded test data (should come from the data lane) | MAJOR |
| Missing teardown / cleanup | MAJOR |
| Missing non-required annotations | MAJOR |
| Debug logging left in committed code | MINOR |

## Verdict

- A single **BLOCKER** → `verdict: fail`, no exceptions.
- A configured gate not met (e.g. `static_analysis` with a CRITICAL, or
  `mutation_score` below threshold) → `fail`.
- Otherwise → `pass`.

## HITL gate — CP-3 (merge approval)

Gate to HITL when `verdict == fail` **or** the target branch is protected. Present:
verdict + count by severity, all BLOCKER/CRITICAL findings (file, line,
suggestion), mutation score vs threshold, execution summary, and per-gate status.
On approval the pipeline proceeds to merge; on rejection the build or healing lane
is re-activated with the blocking findings tagged. If `verdict == pass` and no
BLOCKER exists on an unprotected branch, return success without blocking.

## Golden master

Static-analysis rules derive from the project golden-master checklist
(`golden-master/README.md` and its reference specs). Every checklist item has a
corresponding static check. The healing lane validates its proposals against the
same golden master before they reach a human.

## Guardrails

- **Never modify code** — report only.
- **Never suppress a BLOCKER** regardless of trigger or context.
- **Never merge findings across runs** — each review is independent.
- **Never skip execution validation**, including post-heal.
- `gate_status` keys must match the entries in `cicd.pr_gates`.
