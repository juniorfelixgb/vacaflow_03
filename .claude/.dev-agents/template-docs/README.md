# `.dev-agents/template-docs/` — Canonical document templates

This folder is the **single source of truth** for the structure of every document the agentic system produces. Change the corporate format here once; agents and skills pick it up automatically.

## Why this folder exists

- **Decouples format from logic.** Agents (`.github/agents/`) own the _process_ of generating documents; this folder owns the _shape_ of those documents.
- **One place to please your boss / org standards.** Reformat the BRD template here — no agent file changes required.
- **Discoverability.** New contributors and new agents find every artifact template in one place.

## Policy (binding for all agents and skills)

1. **Agents MUST reference templates from this folder.** No embedded duplicates allowed in agent files or skill SKILL.md.
2. **Agents MAY add, remove, or rename sections per generated document** when the change improves clarity — for example, dropping a "Database Changes" section when the feature has none.
3. **Deviations MUST be noted in the generated document itself** in its `§1 Notes on template usage` section (or equivalent first section). Default value when no changes: `"Standard template, no deviations"`.
4. **Structural changes to a template itself** (i.e. changing the canonical shape) must happen via PR to this folder.

## Index

The machine-readable catalogue lives in [`_index.json`](./_index.json). Human-readable summary:

| Template                                 | Produces                             | Owner agent     |
| ---------------------------------------- | ------------------------------------ | --------------- |
| `brd-template.md`                        | `docs/brds/BRD-...md`                | Bsa             |
| `user-story-template.md`                 | `docs/user-stories/US-...md`         | Bsa             |
| `implementation-plan-template.md`        | `docs/implementation-plans/IP-...md` | Bsa             |
| `work-item-description-template.md` | work-tracking platform work item Description HTML       | Bsa             |
| `code-review-report-template.md`         | `docs/reviews/CR-...md`              | Reviewer        |
| `test-plan-template.md`                  | `docs/test-plans/TP-...md`           | QA_Orchestrator |
| `adr-template.md`                        | `docs/architecture/ADR-...md`        | Bsa             |
| `bug-report-template.md`                 | `docs/analysis/Bug-...md`            | Bsa             |
| `pull-request-description-template.md`   | PR description body on the work-tracking platform           | Orchestrator    |
| `commit-message-template.md`             | Conventional Commit message          | Coder           |
| `risk-assessment-template.md`            | `docs/risks/RA-...md`                | Bsa             |
| `rollback-plan-template.md`              | `docs/rollback-plans/RB-...md`       | Coder           |
| `migration-plan-template.md`             | `docs/migration/MIG-...md`           | Bsa             |

## How agents discover templates

Each owner agent loads `_index.json` (or hardcodes the canonical path) and reads the relevant `*.md` file as a skeleton before producing the deliverable. The skill `implementation-plan-generator` and `ado-operations` reference these paths explicitly.

## Adding a new template

1. Create `<artifact>-template.md` here following the section header style of existing templates (numbered sections starting at `## 1.`).
2. Add the entry to `_index.json`.
3. Add a row to the table above.
4. Update the owner agent's file to declare it as one of its outputs.
5. (Optional) Add a Recipe to [`.github/QUICKSTART.md`](../QUICKSTART.md) §3.1.

## Related

- [`.github/QUICKSTART.md`](../QUICKSTART.md) — user-facing manual.
- [`.dev-agents/memory-bank/00-shared/references/`](../memory/00-shared/references/) — shared agent reference docs (analysis checklists, best practices, agent usage guides). NOT templates.
