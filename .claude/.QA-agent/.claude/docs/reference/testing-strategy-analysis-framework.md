# Testing Strategy — Analysis Framework

> **RISK-RULES** · Phase 2 (ANALYSIS) of `qa-testing-strategy-architect`.
> Gives you: the risk-zone rubric, pyramid-adjustment heuristics, the test-type
> catalog, and the non-deferrable-layers rule. Companion files: WHAT-TO-EXTRACT
> (phase 1), OPTION-SCORING (phase 3), STRATEGY-SHAPE (phase 4) — see the
> reference map in the skill.

## Risk-zone classification rubric

Score each module/area on two axes, then map to a zone:

| | Changes rarely | Changes often |
|---|---|---|
| **High business impact** (money, auth, legal, data loss) | HIGH — deep coverage, automate once, guard with regression | **CRITICAL** — dominant share of automation effort, gate every change |
| **Low business impact** (cosmetic, internal, reversible) | LOW — exploratory/manual only | MEDIUM — thin automated smoke + targeted manual |

Anchors:
- Money paths, authentication/authorization, and external integrations are almost
  always CRITICAL — justify explicitly if you classify them lower.
- Use the project's own quality-attribute weighting when it exists; do not override
  a signed prioritization with generic judgment.
- Compliance-mandated behavior (tax capture, audit trails, retention) is at least
  HIGH regardless of change frequency — failure cost is regulatory, not just UX.

Output format (goes into the strategy document §4):

| Zone | Modules/flows | Risk | Dominant test type |
|---|---|---|---|

## Automation surface map

For each zone answer, in order (cheapest layer that catches the risk wins):

1. Pure business logic → **unit** tests.
2. Verifiable without a browser (status, contract, state transition, idempotency,
   validation) → **API/integration** tests.
3. Genuinely needs browser/native interaction (rendering, navigation, UX-critical
   journeys) → **E2E** — keep to the few flows where UI itself is the risk.
4. Contract risk with an external provider (webhooks, payloads, signatures,
   idempotency semantics) → **contract/sandbox** tests; flag undocumented provider
   behavior as a Sprint-1 blocker.
5. Load-sensitive paths with stated SLAs → **performance** simulation (only if SLAs
   exist and are in scope — otherwise record the deferral as an accepted risk).

## Non-deferrable layers

Some layers may never be deferred to a later version, regardless of option tier:

- **External payment/webhook provider in scope → contract layer is mandatory in v1.**
  Minimum acceptable form: a signature-validation + replay/tamper harness inside the
  API suite. A full consumer-driven contract suite (Pact-style) may be the v1.1
  evolution, but shipping v1 with zero contract verification of a money path is not
  an option.
- **Security baseline is in every option, even the conservative one:** dependency
  audit + static analysis (SAST/lint-security) wired into CI. These are cheap and
  automated; only DAST/pentest may be deferred or owned outside QA (e.g. a CISO
  checkpoint) — record where it lives.

## Pyramid-adjustment heuristics

State the ratio as numbers with a one-paragraph justification derived from the
architecture — never from dogma. Every layer in the pyramid declares its **owner**
(who writes and maintains it — dev team vs SDET); a dominant layer without an owner
is a fantasy ratio:

| Signal | Pull |
|---|---|
| API-first / service-heavy system | Weight down into API/integration (API share ≥ 50%) |
| Async / event-driven / webhook flows | More integration tests around state + idempotency |
| Legacy monolith, poor seams | More E2E than ideal — say so and plan to migrate down |
| Regulated domain (PCI, tax, health) | Add a mandatory compliance verification layer |
| Heavy SPA with complex client state | More component/UI tests than a server-rendered app |
| Tiny QA team / short timeline | Fewer layers done well beats full pyramid done badly |

## Test-type catalog

Automation-first: every type below defaults to an automated implementation run on
a defined cadence (sanity per deploy, smoke per PR, regression nightly/pre-release).

| Type | Catches | Typical gate |
|---|---|---|
| Sanity (automated, cross-layer) | Deploy is testable: app up, critical config/wiring/integrations alive | Every deploy, ≤3 min |
| Unit | Logic errors, calculation/boundary bugs | PR merge |
| API / integration | Contract, status, state, idempotency, validation | PR merge (smoke) / nightly (full) |
| E2E (UI) | Broken journeys, wiring, navigation | PR (smoke) / nightly (full) |
| AI-generated edge-case suites | Unknown unknowns: negative/boundary cases derived from business rules by AI, reviewed by the SDET | Nightly / each cycle |
| Contract (provider) | Webhook/payload/signature drift | Nightly or provider change |
| Performance | SLA breach, degradation under load | Release gate |
| Security (DAST/deps) | Injection, known CVEs, misconfig | Release gate / scheduled |
| Accessibility (automated checks) | WCAG violations | Release gate (if required) |
| Manual scripted — **exception only** | AC verification where automation is genuinely not yet feasible; requires a stated justification + an automation backlog item | Test cycle exit |
| UAT | Business acceptance vs real intent (business reviews automated-run evidence + guided session) | Release sign-off |
