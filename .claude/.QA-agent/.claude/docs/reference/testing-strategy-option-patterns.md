# Testing Strategy — Option Patterns & Scoring

> **OPTION-SCORING** · Phase 3 (OPTIONS) of `qa-testing-strategy-architect`.
> Gives you: the differentiation rubric, the /60 scorecard, the capacity reality
> check, and per-stack tooling shortlists. Companion files: WHAT-TO-EXTRACT
> (phase 1), RISK-RULES (phase 2), STRATEGY-SHAPE (phase 4) — see the reference
> map in the skill.

## Differentiation rubric

Three options must be **different architectural bets**, not three tool flavors of the
same plan. Default spectrum (adapt to the project):

| Option | Core bet | Best for | Honest weakness |
|---|---|---|---|
| 1. Conservative / Essential | Proven stack, deep coverage only where risk concentrates, NFR automation deferred | Small/junior teams, tight timelines | Weak NFR coverage; deferral must be a recorded accepted risk |
| 2. Balanced | API-first coverage + only the NFR layers the top quality attributes demand | Most projects — usually the recommended baseline | More setup than 1; needs at least one experienced QA |
| 3. Advanced / Modern | Contract testing, observability-driven, maximum shift-left | Mature pipeline + capacity, long horizon | Highest upfront cost; wrong for 1-person teams or short timelines — say so |

Validity checks:
- If two options would score within ~5 points of each other on every dimension,
  they are not differentiated — redesign one.
- Each option's stack must be **native to the project's languages** — never force a
  foreign runtime just for the test framework.
- Every option must define both gates: **what blocks a PR merge** and **what blocks
  a release** — they are different lists.
- Every option includes the **non-deferrable layers** from RISK-RULES (provider
  contract harness when a payment/webhook provider exists; CI security baseline) —
  even the conservative one.
- Each option includes: one-line philosophy, stack per layer, its own pyramid,
  phased coverage roadmap, scorecard, honest pros/cons including any blocking risk.

## Capacity reality check (mandatory per option)

Every option states **required effort vs available capacity**: rough person-days per
layer against the real team (size, seniority, % dedication) and the real timeline.
If promised scope exceeds capacity, the option must either cut scope explicitly or
be flagged: **"shelfware risk — this option will be abandoned mid-delivery as
written."** A strategy that ignores capacity is not ambitious, it is fiction — and
presenting it without the flag is a scoring violation (cap Skill/team match at 3
and Time to value at 3 for unflagged aspirational options).

## Six-dimension scorecard (each /10, total /60)

| Dimension | 8–10 means | 1–3 means |
|---|---|---|
| Coverage depth | Critical zones covered at multiple layers | Smoke-only on critical paths |
| Maintenance cost (inverted: 10 = cheap) | Stable selectors/contracts, low flake surface | Heavy E2E, brittle suites, high churn |
| CI/CD fit | Gates run in existing pipeline within time budget | Needs infra the team doesn't have |
| Skill/team match | Team can own it from week 1 | Requires hiring or long ramp-up |
| Time to value | First useful signal within days | Value only after multi-sprint setup |
| NFR coverage | Stated SLAs/compliance verified automatically | NFRs unverified (must be listed as accepted risk) |

Scoring rules: score against **this project's** constraints, not in the abstract;
justify any 9–10 or 1–2 in one line; the decision matrix names the **decisive factor**,
a runner-up, and the condition under which the runner-up would win.

## Cross-cutting checks (include in every comparison when relevant)

- **Test data strategy** — synthetic data, sandbox credentials, rules forbidding real
  PII/cardholder data in non-prod.
- **External-provider contract gap** — exact webhook/payload/signature/idempotency
  behavior; frequently undocumented and a Sprint-1 blocker.
- **Team-capacity reality** — if one person also does manual testing, UAT, and dev
  support, recommend an explicit time-allocation agreement or the strategy dies in
  sprint 3.

## Tooling shortlists per stack

Pick what is native; list alternatives only when a real trade-off exists.

| Stack | Unit | API/integration | E2E | Performance | Security | Contract |
|---|---|---|---|---|---|---|
| Node/TS (React, Express) | Vitest / Jest | Playwright request, Supertest | Playwright | k6, Artillery | OWASP ZAP, npm audit/Snyk | Pact |
| JVM (Spring) | JUnit 5 | RestAssured, Testcontainers | Playwright / Selenium | Gatling, JMeter | ZAP, OWASP DC | Pact JVM |
| .NET | xUnit/NUnit | WebApplicationFactory, RestSharp | Playwright .NET | k6, NBomber | ZAP, dotnet audit | PactNet |
| Python (Django/FastAPI) | pytest | pytest + httpx/requests | Playwright Python | Locust, k6 | ZAP, pip-audit | Pact Python |
| Go | testing + testify | httptest, Testcontainers-go | Playwright (separate) | k6, vegeta | govulncheck, ZAP | Pact Go |
| Mobile native | XCTest / JUnit+Espresso | — | XCUITest / Espresso / Appium / Maestro | — | MobSF | — |
| Frontend-heavy (any SPA) | Vitest/Jest + Testing Library | MSW for API mocking | Playwright / Cypress | Lighthouse CI (perf budget) | — | — |

Accessibility (when WCAG is in scope): axe-core integrations (e.g. axe + Playwright),
Lighthouse. Email/notification flows: provider sandbox + capture inbox (e.g. Mailosaur,
MailHog) — never real recipient addresses.
