# `.dev-agents/skills/` — Procedural skills (Canonical Source)

> **Fuente canónica.** Thin stubs in `.github/agents/Skills/` reference these files.
> Claude Code slash commands in `.claude/commands/` also reference these files.
> Edit here only.

> **Skill** = a deterministic procedure invokable by one or more agents.
> Unlike agents, skills have no independent reasoning, no autonomous decisions, no persistent identity.

## Skills inventory

| Skill                           | Purpose                                                                     | Typical caller(s)      |
| ------------------------------- | --------------------------------------------------------------------------- | ---------------------- |
| `Memory_Protocol`               | Persistent memory lifecycle (session_start, proactive saves, session_close) | All agents             |
| `Implementation_Plan_Generator` | Turn an analysis doc into a 12-section executable implementation plan       | Bsa                    |
| `WorkItem_Operations`           | Work-tracking platform work item / wiki / PR operations                     | Bsa, Orchestrator      |
| `UI_Component_Lookup`           | UI component library documentation lookup via MCP                           | Coder, Reviewer        |
| `Db_Review`                     | Database / schema / migration review checklist                              | Reviewer, Coder        |
| `Test_Runner`                   | Run the project's test suites; report coverage                              | Coder, QA_Orchestrator |
| `E2E_Plan`                      | Plan E2E test scenarios from acceptance criteria                            | QA_Orchestrator        |
| `E2E_Generate`                  | Generate E2E test code from a plan                                          | QA_Orchestrator        |
| `E2E_Heal`                      | Debug and fix failing E2E tests                                             | QA_Orchestrator        |

## Canonical skill structure

```markdown
---
name: Skill_Name
description: One-line purpose statement.
inherits: ../../AGENTS.md
inputs: [list of inputs]
outputs: [list of outputs]
invoked_by: [agent names]
---

# Skill_Name

## Mission
(1 paragraph)

## Inputs
- ...

## Outputs
- ...

## Procedure
1. ...
2. ...

## Failure modes
- ...
```
