# Testing Strategy Document Template

> **STRATEGY-SHAPE** · Phase 4 (DOCUMENT) of `qa-testing-strategy-architect`.
> Gives you: the final document structure and its quality bar. Read this before
> writing the document; fill every section with the project's actual modules,
> risks, providers, NFR targets, and team realities from Phases 1–2. Delete
> sections that genuinely don't apply, but don't pad with boilerplate. Companion
> files: WHAT-TO-EXTRACT (phase 1), RISK-RULES (phase 2), OPTION-SCORING
> (phase 3) — see the reference map in the skill.

Default output is Markdown. For a `.docx` deliverable, use a `docx` skill if one
is available. If the project's other artifacts use a document-ID/version
convention, match it.

---

## Recommended structure

```
# Testing Strategy — <Project>

Document ID · Stage · Author · Date · Status · Version
(match the project's existing convention if one exists)

## 1. Purpose & scope
- What this strategy covers and the release it targets (e.g., v1).
- Explicitly: what is out of scope for this version.

## 2. Source artifacts & references
- The business case, functional/non-functional specs, business rules,
  traceability matrix, architecture/design docs, quality-attribute weights that
  this strategy is derived from. Cite internal IDs — never external/personal
  links; every numeric claim cites the document where the number actually lives.

## 3. Quality principles & AI operating model
- 3–5 short principles (e.g., quality is engineered not inspected; automation is
  the default; deterministic and repeatable runs).
- AI usage per lifecycle stage, as a table: test generation · test maintenance/
  healing · defect analysis · data generation · risk prioritization — each with
  the human review gate that governs it.

## 4. Chosen architecture & justification
- The approved option, in one paragraph.
- Why it was chosen: tie to the highest-weighted quality attributes, team
  capacity, timeline, and budget. State the decisive factor.
- Assumptions carried forward (each with a one-line reason).

## 5. Risk-based scope
- The risk-zone classification from Phase 2 as a table (zone · risk · dominant
  test type). This is what justifies where coverage is deep vs thin.

## 6. Test levels & types
- In scope: the test types this strategy uses and what each covers.
- Automation-first: every level states its automated implementation and execution
  cadence (sanity per deploy, smoke per PR, regression nightly/pre-release).
  Manual execution appears only as a justified exception with an automation
  backlog item.
- The sanity suite is scoped at **behavior level** (the critical money-path
  behaviors: e.g., payment success/failure, record creation, audit entry), not
  just infrastructure pings.
- Include the non-deferrable layers from RISK-RULES (provider contract harness,
  CI security baseline) or state explicitly who owns them instead.
- Out of scope (this version): types deliberately excluded, with rationale.

## 7. Test pyramid & coverage targets
- The concrete ratio with justification, and an **owner per layer** (dev team vs
  SDET) — a dominant layer without an owner is a fantasy ratio.
- Coverage targets per layer/zone as numbers (be realistic, not aspirational).

## 8. Tooling & frameworks
- Per layer: unit, API/integration, E2E, performance, security, contract,
  accessibility — only those in scope. Note why each fits the stack.
- Decide, don't enumerate: "Playwright / Cypress" is not a decision. If a choice
  is genuinely open, name who decides it and by when.

## 9. Environments & test data strategy
- Environments used for testing and their constraints.
- Test data: synthetic data, sandbox credentials, and any rules forbidding real
  PII/cardholder data in non-prod. Call out provider sandbox dependencies.

## 10. CI/CD quality gates & execution cadence
- PR-merge gate, deploy gate (sanity), nightly regression, release gate: exactly
  what runs and what blocks what, with time budgets per gate.

## 11. Observability-driven testing
- How production/staging signals feed testing: log validation, audit-trail
  verification, transaction trace checks; what runs as automated assertions vs
  monitored signals, and how anomalies become new coverage requests.

## 12. Entry / exit & done criteria
- When testing starts, when a build can promote, definition of "tested/done"
  for automation (coverage ≠ quality — be specific). Include the review gate for
  AI-generated tests before they enter the regression set.

## 13. Metrics & reporting
- What you measure and **a numeric target for every metric** (e.g., automation
  rate, pass rate by zone, flaky rate, defect escape rate, gate execution time).
  A metric without a number is a sentiment, not a gate.

## 14. Roles & responsibilities
- Who owns what. For a tiny team, include the explicit time-allocation agreement
  needed to keep automation alive, and the pre-agreed scope-cut order.

## 15. Defect workflow
- Severity/priority definitions, triage, and the path from found to verified.
  Adopt the project's existing taxonomy when one exists.

## 16. Risks & mitigations
- Strategy-level risks (capacity, undocumented external contract, environment
  gaps) and how each is mitigated. Every accepted risk carries its decision date
  and countersigners. Note the accepted trade-offs of the chosen option.

## 17. Roadmap & evolution
- Phase/sprint-by-sprint rollout from setup to full coverage at release, matching
  the chosen option's coverage roadmap.
- Evolution mapped to the project's own architecture evolution stages (e.g.,
  v1 monolith → v2 async/event validation → v3 service decomposition), not a
  flat wishlist.

## 18. Approval
- Sign-off table (PO/BSA/Architect/QA Lead/Security as relevant) and the decision
  provenance: which options were compared, who chose, when.
```

---

## Quality bar for the document

- Concrete over generic: name the actual modules, providers, NFR numbers, and
  business rules. A reader should not be able to tell it was templated.
- Every assumption and every out-of-scope item is explicit.
- The justification ties to the project's own quality-attribute priorities.
- It is executable: a new engineer could start Sprint 1 from it. Schedule,
  entry/exit criteria, environments, and ownership are all present.
- Capacity-honest: promised scope fits the stated team and timeline, or the gap
  is flagged (see OPTION-SCORING capacity reality check). Never ship shelfware.
- Citations verified: every number points to the internal artifact where it
  actually lives; no external or personal links.
- Document control present: ID, status, version history, approval table, and the
  decision provenance (options compared, who chose, when).
- Every metric has a numeric target; every pyramid layer has an owner.
- Save it to disk and present it. Offer a `.docx` version if the user wants a
  client-facing deliverable.
