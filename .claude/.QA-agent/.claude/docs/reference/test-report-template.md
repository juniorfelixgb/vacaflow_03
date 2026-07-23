# Test Report Document Template

> Canonical template for the **document-level Test Report** (test summary report):
> the consolidated record of manual + UAT execution for a release/cycle, feeding the
> project's go/no-go decision. Written by `qa-testing-strategy-architect`.
> Complementary to `/qa-release-report`, which aggregates **automation run artifacts**
> when the toolkit lanes are configured — this template works for documentation-only
> or manual-first projects. Match the project's document-ID/versioning convention.
> Never invent a metric — every number cites its evidence; missing data is reported
> as "no data" and treated as a risk.

---

## Recommended structure

```
# Test Report — <Project> <release/cycle>

Document ID · Stage · Author · QA Lead · Date · Status · Version
Related: <Test Plan ID>, <UAT Plan ID>, <coverage matrix>, <defect log>

## 1. Executive summary
- One paragraph, plain language: what was tested, the outcome, and the
  recommendation (GO / GO WITH RISKS / NO-GO). Risks first, never buried.

## 2. Scope executed vs planned
- Table: cycle · planned TCs · executed · passed · failed · blocked · not run
  (with reason). Deviations from the test plan called out explicitly.

## 3. Coverage results
- AC/requirement coverage from the coverage matrix: covered / not covered, with
  the list of uncovered items and why.
- UAT scenarios: executed / accepted / rejected.

## 4. Defect summary
- Open and closed defects by severity (use the project's taxonomy — cite it).
- Sev-1/Sev-2 detail: ID, title, status, workaround, owner.
- Defects deferred with PO acceptance, listed individually.

## 5. Quality assessment per risk zone
- For each risk zone from the strategy: tested depth, result, residual risk.

## 6. Accepted risks & untested areas
- Every accepted risk (e.g. deferred performance testing) with its decision record
  and countersigners.
- Anything untested, stated plainly — never silently omitted.

## 7. Open questions carried forward
- Unresolved AC ambiguities/contradictions and their owners.

## 8. Go/no-go recommendation
- The recommendation mapped to the project's governance gate (cite the
  decision-authority matrix: who decides, who escalates).
- The recommendation is advisory — the human gate decides.

## 9. Sign-off record
- Decision, who, when, notes — recorded here after the gate.

## Appendix
- Evidence links: executed TC files, defect log entries, UAT records, environment
  notes, exploratory session charters and outcomes.
```

---

## Hybrid mode — full structure always, real data when it exists

The report is generated in **hybrid mode**: the full structure above is always produced;
each section is filled with real execution data when the artifact exists, and an explicit
placeholder when it does not.

- **Every number cites a named artifact** next to it (`source: defect-log DL-001`,
  `repo:{path}`, matrix row). A metric with no source becomes
  `NO DATA — to be filled from {expected source}`, never a guessed value.
- **Nothing executed yet** (new project / pre-execution): the report is a complete,
  structured **shell** — scope tables prefilled from the Test Plan, every result field a
  `NO DATA` placeholder naming its future source. The Executive summary states plainly that
  no execution cycle has run, and the recommendation is `Not assessable yet — pending {data}`.
- **Partial data**: fill only what the artifacts support; report the rest as partial
  ("defects from DL-001; run results: NO DATA").
- **Never compute a verdict from invented data.** GO / GO-WITH-RISKS / NO-GO is given only
  when the Test Plan exit criteria can actually be evaluated; otherwise state
  "Not assessable yet". The recommendation is advisory; the human decides at sign-off.

After the first execution cycle, re-run the report step to move it out of `NO DATA` mode and
reissue it as the next version.

## Quality bar

- Every number traces to evidence (TC file, defect ID, matrix row) — no invented
  metrics; "no data" is itself a finding.
- Failures and risks lead the document; successes follow.
- Severity language matches the project's defect taxonomy exactly.
- The report is self-sufficient: a stakeholder who reads nothing else understands
  the release quality and what they are signing.
