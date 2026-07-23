# Testing Strategy — Intake Checklist

> **WHAT-TO-EXTRACT** · Phase 1 (INTAKE) of `qa-testing-strategy-architect`.
> Gives you: the extraction checklist and the gap-classification rubric. Extract
> answers from project artifacts first; ask the user only for what cannot be found.
> Every unanswered item becomes an explicit, classified assumption. Companion files:
> RISK-RULES (phase 2), OPTION-SCORING (phase 3), STRATEGY-SHAPE (phase 4) — see
> the reference map in the skill.

## Extraction sources (read before asking anything)

Look for these artifact types in the project's documentation and pull answers out:

| Artifact | Typically answers |
|---|---|
| Business case / strategic intake | Criticality, budget, timeline, success metrics |
| Functional spec / PRD | Critical flows, actors, functional scope, AC summary |
| Non-functional spec | Performance SLAs, security/compliance, availability |
| Business rules | Boundary values, state machines, validation rules |
| Architecture docs (SAD, design) | Frontend/backend shape, integrations, data stores |
| Quality-attribute weights | What the project itself says matters most |
| Backlog / roadmap | Release scope, MoSCoW priorities, milestones, team |
| Governance doc | Roles, gates, go/no-go authority, defect ownership |
| Tech/dev docs, code standards | Stack, environments, CI conventions |
| Defect log / test artifacts | Existing taxonomy and QA history (adopt, don't reinvent) |

## Checklist

### Critical — nothing is reliable without these

- [ ] What the app does and its **single most critical business flow**.
- [ ] Frontend type: SPA / MPA / mobile (native, hybrid) / desktop / API-only.
- [ ] Backend style: REST / GraphQL / gRPC / event-driven; monolith vs microservices.
- [ ] Tech stack and languages (defines native vs forced test frameworks).
- [ ] CI/CD: pipeline exists? Which platform? Or none yet?
- [ ] QA team: size, seniority mix, automation experience.
- [ ] Existing automation: greenfield vs brownfield (what exists, what state).

### Important — defines NFR scope

- [ ] Performance targets: response-time SLA, concurrent users, throughput.
- [ ] Security/compliance: OWASP, PCI-DSS, HIPAA, SOC2, WCAG, regional data law.
- [ ] External integrations (payments, email, identity, third-party APIs) and how
      they behave in test: mocks / stubs / sandbox / real.
- [ ] Auth mechanism: OAuth / SAML / JWT / session; MFA requirements.
- [ ] Browser/device support matrix.
- [ ] Test data constraints: PII rules, synthetic-data mandates, sandbox-only rules.

### Context — affects tooling and viability

- [ ] Project phase: discovery / active development / legacy in production.
- [ ] Timeline and release cadence (compressed timelines force risk-based scope).
- [ ] Budget / licensing constraints (open-source-only?).
- [ ] Client-mandated frameworks or regulated-industry requirements.
- [ ] Environments available (dedicated QA/staging? resetable DB?).
- [ ] Who approves quality gates and release sign-off (names/roles if documented).

## Gap classification rubric

Classify every item you could not extract:

| Class | Meaning | Action |
|---|---|---|
| **Blocker** | Strategy would be guesswork without it (critical-tier items) | Ask the user — batch the questions, keep them tight |
| **Assumable** | A defensible default exists | Record an assumption: value + one-line justification + impact (high/medium/low) |
| **Deferrable** | Doesn't change the strategy choice, only later detail | List under "open questions" in the document |

Rules:
- Never silently guess — an assumption without a stated justification is a guess.
- The three questions that most change a strategy are usually **backend stack,
  external integrations / payment-or-key providers, and QA team size** — resolve
  those first.
- If artifacts contradict each other (e.g., two documents state different SLAs),
  surface the contradiction as a blocker question — do not pick a side silently.
