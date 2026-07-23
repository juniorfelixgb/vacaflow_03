# Commit Message Template (Conventional Commits, project scopes)

> **Canonical template** — owned by `.dev-agents/template-docs/`.
> Coder may **adjust** type/scope vocabulary when justified; new scopes should be proposed via PR to this file.

## Format

```
<type>(<scope>): <imperative subject — max 72 chars, lowercase, no period>

<body — wrap at 100 chars. Explain WHAT and WHY, not HOW.
Reference the user story, plan, or BRD.>

<footer — breaking changes, work item links, co-authors>
```

## Allowed `<type>` values

| Type       | Use for                                                                |
| ---------- | ---------------------------------------------------------------------- |
| `feat`     | A new feature visible to users or other code                           |
| `fix`      | A bug fix                                                              |
| `refactor` | Code change that neither fixes a bug nor adds a feature                |
| `perf`     | Performance improvement                                                |
| `docs`     | Documentation only (README, ADRs, user docs, agentic system files)     |
| `test`     | Adding / updating tests only (no production code change)               |
| `build`    | Build system, dependencies, package manifests                          |
| `ci`       | CI/CD pipeline changes                                                 |
| `chore`    | Routine maintenance with no functional impact                          |
| `style`    | Formatting / whitespace / lint-only changes                            |
| `revert`   | Revert a previous commit                                               |

## Allowed `<scope>` values (project-specific)

> Define the scope vocabulary for this project. Scopes typically map to the
> project's layers/modules and to the agentic-system areas. Example shape:

`api`, `application`, `domain`, `infrastructure`, `web`,
`migrations`, `tests`, `docs`, `agents`, `quickstart`, `workflows`,
`skills`, `templates`, plus any module-specific scopes the project needs.

> Multi-scope: use the most affected one; mention others in the body.

## Subject line rules

- Imperative mood: "add", not "added" / "adds"
- Lowercase first letter
- No trailing period
- Max 72 chars including `<type>(<scope>): `

## Body rules

- Blank line between subject and body
- Explain motivation, not implementation detail
- Reference work items: `AB#1234`, `Closes AB#1234`
- Reference plan/BRD when applicable

## Breaking changes

Add `!` after type/scope **and** a `BREAKING CHANGE:` footer:

```
feat(api)!: drop /v1/reports endpoint

BREAKING CHANGE: callers must migrate to /v2/reports.
See ADR-2026-04-12-reports-api-versioning.
```

## Examples

```
feat(reports): add column customization for report views

Implements US-2026-02-27 — users can now persist column visibility per
view. Adds the supporting entity, repository, and API endpoint.

Closes AB#5421
```

```
fix(migrations): prevent destructive cleanup on tenant-shared data

Resolves Bug-2026-02-26 multi-tenant data loss risk in the cleanup
routine. Filters by the tenant column before deleting.

Refs AB#5733
```

```
docs(agents): centralize templates under .dev-agents/template-docs/

Closes follow-up of refactor/agentic-restructure-2026-05-13.
```
