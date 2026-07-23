# KT-002 — Open Items

Items removed from `qa-docs-kt.html` (KT-002) to keep the deck presentation-clean. Each
was a real gap, not invented data — tracked here instead of shown as `[FALTA]` on slides.

## 1. Automation stack not confirmed for Contoso

No `docs/qa-config.yaml` exists for Contoso — `/qa-setup` hasn't run yet, so no framework
choice is on record for this project.

The toolkit's own `.claude/qa-config.yaml` is a generic template that defaults to
Playwright + TypeScript + playwright-bdd. That is a toolkit default, not a confirmed Contoso
decision — do not present it as Contoso's stack until `/qa-setup` (CP-1) actually runs and
writes the contract sections of `docs/qa-config.yaml`.

**Resolves when:** `/qa-setup` runs for Contoso and `docs/qa-config.yaml` exists with an
approved `stack` section (CP-1).

## 2. CI/CD for the QA test suite not confirmed

`project/01-understand/strategic-intake.md` (SI-001) §5 names Azure DevOps Pipelines as a
technical constraint — but that's documented for **Contoso's own application deployment**,
not confirmed as the pipeline that will run the QA automation suite.

**Resolves when:** the approved Testing Strategy (`test-strategy.md`, CP-STRATEGY) or the
`docs/qa-config.yaml` contract's `cicd` section states the QA suite's own pipeline.

---

Related, already reported separately (not repeated here): the `project/` folder-naming
inconsistencies (`00-business` referenced by some guides but not present; last phase named
`08-quality` in `project/` vs `08-testing` in `docs/QA-AGENTS-GUIDE.md`) — see the
"Inconsistencias detectadas" delivered in chat for KT-002.
