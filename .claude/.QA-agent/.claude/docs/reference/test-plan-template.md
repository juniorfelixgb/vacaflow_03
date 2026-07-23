# Test Plan Document Template

> Canonical template for a release/cycle **Test Plan**. The Test Plan operationalizes
> an approved Testing Strategy for one release: what is tested, when, by whom, with
> which entry/exit criteria. Tool-agnostic — tooling comes from the project's approved
> strategy or is marked "pending decision". Written by `qa-testing-strategy-architect`.
> Match the target project's document-ID/versioning convention. Test cases themselves
> belong to `manual-test-design` / `coverage-matrix` — the plan references them.

---

## Recommended structure

```
# Test Plan — <Project> <release>

Document ID · Stage · Author · QA Lead · Date · Status · Version
Related: <Testing Strategy ID>, <backlog/roadmap/governance/defect-log IDs>

## 1. Purpose & scope
- The release/cycle this plan covers and the strategy it executes (cite its ID).
- In scope: stories/epics/modules under test (cite backlog IDs).
- Out of scope: deferred items, with the reason and where the risk is recorded.

## 2. Test items & features to be tested
- Table: item/story ID · title · risk zone (from strategy §4) · test depth
  (deep / standard / smoke-only) · test-case file reference.

## 3. Test approach per cycle
- How each level/type from the strategy applies in this release: which cycles run
  (system functional, integration, E2E flows, exploratory, UAT support, smoke).
- Regression scope if applicable.

## 4. Schedule
- Test cycles mapped to the project's real milestones/blocks (cite roadmap IDs).
- Per cycle: scope entering, environment needed, owner, gate it feeds.

## 5. Entry / exit / suspension criteria
- Entry per cycle: build deployed, environment healthy, data loaded, blockers clear.
- Exit per cycle: planned TCs executed, coverage threshold met, open-defect rules
  (e.g. no Sev-1/Sev-2 on cycle scope).
- Suspension/resumption: what stops testing (environment down, blocking defect) and
  what must happen to resume.

## 6. Environments & test data
- Environments per cycle and their constraints; provider sandboxes.
- Data needs per cycle (synthetic only where mandated); reference the project's
  data rules — never real PII/cardholder data in non-prod.

## 7. Roles & responsibilities
- Who designs, executes, triages, approves each cycle (use the project's governance
  roles; cite the governance doc).

## 8. Defect management
- Adopt the project's existing defect taxonomy/workflow (cite it — e.g. a defect-log
  standard). Do not invent a parallel severity model.
- Triage cadence and escalation path during the test window.

## 9. Deliverables
- Coverage matrix, executed TC evidence, defect reports, cycle summaries, final
  test report (cite the test-report template/ID convention).

## 10. Risks & contingencies
- Plan-level risks (schedule compression, environment instability, data gaps,
  unresolved AC questions) with mitigation and owner.

## 11. Approval
- Sign-off table per the project's governance (QA Lead, PO, Technical Lead as relevant).
```

---

## Quality bar

- Every test item traces to a backlog/story ID and to a risk zone — no orphan scope.
- Criteria are measurable (counts, severities, thresholds) — never "testing complete".
- The schedule uses the project's own milestones, not an invented calendar.
- Defect taxonomy is inherited from the project, not duplicated.
- Open AC ambiguities are listed as blocking questions (CP-AC), never silently resolved.
