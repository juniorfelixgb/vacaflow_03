# Pull Request

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Orchestrator / Coder may **add, remove, or rename sections** for clarity; note deviations under "Notes".

## Title

`<type>(<scope>): <imperative short description>`

> Type: feat | fix | refactor | docs | test | chore | perf | build | ci  
> Scope: api | application | domain | infrastructure | web | rules | file-processing | staging-db | service-db | isolated-functions | docs | agents | etc.

---

## Summary

[2–4 sentences. What this PR does and why. Business framing first, technical detail second.]

**Notes (template deviations):** [Standard | added/removed sections because…]

---

## Linked work

- **User Story / Bug:** AB#[ID]
- **Implementation Plan:** [docs/implementation-plans/IP-...md]
- **BRD (if applicable):** [docs/brds/BRD-...md]
- **ADR (if applicable):** [docs/architecture/ADR-...md]

---

## Changes

### What changed

- [Bullet 1 — high level]
- [Bullet 2 — high level]
- [Bullet 3 — high level]

### Files of interest (reviewer guidance)

| Path | Why it matters |
| ---- | -------------- |
| [path/to/backend-file] | [reason to look here first] |
| [path/to/frontend-file] | [reason] |

---

## How to test

### Automated

- `[the project's backend test command]` (or scoped to the affected suite)
- `[the project's frontend test command]`
- E2E: `[the project's command to run the E2E suite for <feature>]`

### Manual

1. [Step]
2. [Step]
3. [Expected result]

---

## Acceptance Criteria

- [ ] AC-001: [description]
- [ ] AC-002: [description]
- [ ] AC-003: [description]

---

## Quality gates

- [ ] Build green
- [ ] Unit tests added/updated and passing
- [ ] Coverage on changed files ≥ 80%
- [ ] Lint / format clean
- [ ] No new secrets, credentials, or env-specific values in code
- [ ] `ILogger<T>` calls cover new operations and error paths
- [ ] Documentation updated (`README.md`, ADRs, user docs)
- [ ] Reviewer report (CR-…) attached or referenced
- [ ] DB migrations reversible (if applicable)
- [ ] Backward compatibility considered

---

## Security checklist (OWASP)

- [ ] Input validation at boundaries
- [ ] Output encoding where appropriate
- [ ] No injection vectors (parameterized queries / safe data-access layer)
- [ ] AuthN/Z enforced on new endpoints
- [ ] Secrets in Key Vault / env, not in code
- [ ] Audit logging present for sensitive ops

---

## Database changes

- [ ] None
- [ ] Migration(s): [migration names]
- [ ] Rollback plan: [docs/.../rollback-plan-...md] or inline below
- [ ] Backward compatible: [yes/no — explain]

---

## Risk & rollback

- **Risk level:** [Low | Medium | High]
- **Blast radius:** [tenant-scoped | region-scoped | global]
- **Rollback strategy:** [revert commit | feature flag off | DB rollback migration X]

---

## Screenshots / recordings (UI changes only)

[Before / after — drag images or link]

---

## Reviewer focus areas

- [Specific concern 1 — e.g. "verify multi-tenant filter on Repository X"]
- [Specific concern 2]
