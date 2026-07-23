# QA Decisions Log — Canonical Rules

> **DECISIONS-RECORD** · the auditable record of every testing decision behind the
> Testing Strategy and its derived documents. Produced by `qa-testing-strategy-architect`
> (and orchestrated by `/qa-docs`) alongside the strategy, never instead of it.
> Technology-agnostic. Output in English. Match the project's document-ID / versioning
> convention.
>
> Why it exists: the Testing Strategy says *what* was decided; this log says *why*, *from
> which source*, *who decided*, and *which alternatives were scored*. It is the single
> traceable artifact a reviewer reads to audit the strategy without re-running intake.

---

## When to write it

Write the decisions log while running `qa-testing-strategy-architect`:

- **Phase 1 (INTAKE)** — every classified gap/assumption becomes a row or an open question.
- **Phase 2 (ANALYSIS)** — risk-zone and pyramid decisions become rows.
- **Phase 3 (OPTIONS)** — the chosen option and its `/60` scorecard are recorded as the
  primary evaluation (`EV-01`); any other strategic decision gets its own `EV-NN`.
- **Phase 4 (DOCUMENT)** — the strategy and every derived document cite this log as `QD-NN`.

The log is generated **with** the strategy, not as a separate interview. The decisions
already made through the four phases are recorded here so they are auditable; nothing new
is invented at write time.

## Document header

Use the project's standard document header (ID, stage, author, date, version, status).
Suggested ID: `QD-001`. Status mirrors the strategy: `Draft` until the strategy option is
approved, then `Approved`.

## Structure

```markdown
## Decision log

| ID | Topic | Decision | Options considered (sources) | Basis | Decided by | Date |
|----|-------|----------|------------------------------|-------|------------|------|
| QD-01 | Target platforms | Web + API | Web+API (SAD-001 §2) / +Mobile / Others | architecture scope | {architect} | {date} |
| QD-02 | Automation architecture | Option 2 — Balanced | Conservative / Balanced / Advanced (see EV-01) | risk + capacity | {architect} | {date} |

## Evaluations

{EV-NN: one weighted scoring table per strategic decision —
 alternatives × criteria (weights), scores, weighted totals, winner, decisive factor}

## Assumptions carried forward

| ID | Assumption | Justification | Impact (H/M/L) |
|----|------------|---------------|----------------|

## Documentation inventory

{the artifacts read during intake — Doc | ID | what it fed — plus the gap list}

## Open questions

{deferrable items no source could answer; each with an owner}
```

## Rules

- **Every strategy/plan/UAT/report number traces back here or to a source doc.** Downstream
  documents cite decisions as `QD-NN` and evaluations as `EV-NN`. A decision with no row is
  not citable and must not appear downstream.
- **A *strategic* decision gets an `EV-NN` weighted evaluation** — one where no source
  artifact constrains the choice and it has lasting impact (automation architecture, CI/CD
  platform, NFR-testing scope, framework selection). The Phase-3 `/60` six-dimension
  scorecard from `testing-strategy-option-patterns.md` **is** the evaluation for the
  architecture choice — record it as `EV-01`; do not invent a second, parallel scoring.
- **Constrained decisions keep the plain row** — never score what an upstream doc already
  fixes; cite the source and move on.
- **Never fabricate.** A decision no source covers and the architect did not make becomes an
  open question, not a guessed row.
- **The architect declaration is the role gate.** The "Decided by" name recorded here (and
  echoed in each document's sign-off) is the authority record — there is no technical auth.
- **Re-run behavior.** If the log already exists, show the decision table and ask **reuse vs
  re-decide**. On re-decide, bump the version and keep the prior table under a `## Superseded`
  heading — never silently overwrite a recorded decision.

## Boundaries

- This log records **decisions**, not test design. Test cases belong to `manual-test-design`;
  defect taxonomy belongs to `bug-reporting` (adopt the project's existing scheme — cite it).
- This log never writes `docs/qa-config.yaml` — `/qa-setup` owns that (CP-1). When the
  project adopts the automation lanes, the recorded option/pyramid/gates/data-policy become
  the defaults handed to `/qa-setup` Part B (contract intake).
