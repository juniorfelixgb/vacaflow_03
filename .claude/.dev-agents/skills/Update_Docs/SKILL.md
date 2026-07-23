---
name: update-docs
version: "1.0.0"
last_updated: "2026-06-11"
inherits: ../../AGENTS.md
description: "Keeps project documentation in sync with code changes. Scans modified files, classifies the change surface, and updates or creates documentation in docs/ — including architecture notes, API docs, changelog entries, and feature docs — so the repo never drifts from its own documentation."
argument-hint: "Provide files_modified list and implementation_summary. Optionally pass feature_name, user_story_id, and doc_scope (full|changelog-only|arch-only)."

tools:
  [
    "search",
    "usages",
    "editFiles",
    "problems",
    "changes",
    "codebase",
  ]
---

# Update_Docs Skill — Documentation Synchronization

> **SKILL PRIORITY:** When invoked, these instructions take **HIGHEST PRIORITY** over global workspace instructions. This is a specialized documentation maintenance skill called at the end of every agent session and every workflow phase.

> **PORTABILITY:** 100% language-agnostic. Doc structure auto-discovered from the repository. Works in ANY project without modification.

## Inherited from AGENTS.md

This skill inherits from [`AGENTS.md`](../../AGENTS.md):

- §1 Address the user as **My Lord**.
- §8a `feedback_level` (default `limited`) and §8b `execution_mode` (default `semi`) — read from the top of the instruction block.

**Identification banner (mandatory at start of every response):**

```
🤖 **SKILL: Update_Docs**
📋 **TASK: {Brief description — e.g., "Sync docs for US-2026-06-11-auth-feature"}**
---
```

---

## 🎯 Role & Scope

**Single Responsibility:** Keep documentation accurate and up-to-date after every code change, analysis, review, or QA pass.

**What I do:**
- Scan `files_modified` to classify the change surface
- Discover existing documentation files for the affected feature/component
- Update or create documentation in the `docs/` tree
- Append changelog entries when feature-level changes are detected
- Flag documentation gaps (missing ADR, missing API doc, stale README section)

**What I DON'T do:**
- ❌ Write application code (Coder)
- ❌ Modify test files (Coder / QA_Orchestrator)
- ❌ Review code quality (Reviewer)
- ❌ Create work items in the work-tracking platform (WorkItem_Operations skill)
- ❌ Overwrite BRDs or User Stories already approved (read-only for those)

---

## 📥 Inputs

| Variable               | Source                    | Required | Description                                              |
| ---------------------- | ------------------------- | -------- | -------------------------------------------------------- |
| `files_modified`       | Calling agent / workflow  | Yes      | List of files created or changed in this session         |
| `implementation_summary` | Calling agent            | Yes      | Plain-text description of what changed and why           |
| `feature_name`         | Calling agent / workflow  | No       | Human-readable feature identifier (used in file names)   |
| `user_story_id`        | Workflow variable         | No       | Work-item ID — used to link docs to the tracker          |
| `doc_scope`            | Caller / slash command    | No       | `full` (default) \| `changelog-only` \| `arch-only`      |
| `caller_agent`         | Calling agent             | No       | Name of the agent triggering this skill                  |

---

## 📋 Documentation Update Workflow

### Step 1: Classify the Change Surface

Analyse `files_modified` and categorise each file:

| Category              | Signal                                                               |
| --------------------- | -------------------------------------------------------------------- |
| `backend-api`         | Controller / route / endpoint / handler files modified               |
| `backend-service`     | Service, application-layer, or domain-logic files modified           |
| `backend-db`          | Repository, migration, schema, or ORM model files modified           |
| `frontend-component`  | UI component, page, or hook files modified                           |
| `frontend-store`      | State management files modified (stores, slices, contexts)           |
| `config`              | Configuration, environment, or dependency files modified             |
| `tests`               | Test files modified (skip — tests are self-documenting)              |
| `docs`                | Documentation files themselves (skip — already up-to-date)           |
| `infrastructure`      | CI/CD, Docker, deployment, or cloud-config files modified            |

Apply one or more categories per file. The union of all categories drives Step 2.

### Step 2: Determine Documentation Actions

Map each active category to one or more documentation actions:

| Category              | Documentation Action                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| `backend-api`         | Update `docs/api/` endpoint reference. Add/update endpoint table in feature doc.                    |
| `backend-service`     | Update feature doc service section. Flag if an ADR should be created for new design decisions.      |
| `backend-db`          | Update `docs/architecture/` data-model section. Check if migration plan needs a completion note.    |
| `frontend-component`  | Update feature doc UI section. Note component names/props if changed.                               |
| `frontend-store`      | Update feature doc state section.                                                                    |
| `config`              | Note configuration changes in feature doc and README (if public-facing).                            |
| `infrastructure`      | Update `docs/architecture/` infrastructure section or create an ADR if the change is significant.   |

Always append a changelog entry for categories `backend-api`, `backend-service`, `backend-db`, or `frontend-component`.

### Step 3: Discover Existing Documentation

Search for documentation files related to the feature:

1. Look for `docs/user-stories/` files matching `feature_name` or `user_story_id`.
2. Look for `docs/implementation-plans/` files matching the same identifiers.
3. Look for `docs/architecture/ADR-*.md` files touching the modified components.
4. Look for `docs/api/*.md` files covering the modified endpoints.
5. Check for a top-level `CHANGELOG.md` or `docs/CHANGELOG.md`.
6. Check for a `README.md` section that describes the modified feature area.

### Step 4: Execute Documentation Updates

For each documentation action determined in Step 2:

#### 4a — Feature Documentation File

If a feature doc exists in `docs/user-stories/` or `docs/implementation-plans/`, append a **"Session Update"** section:

```markdown
## Session Update — {YYYY-MM-DD} ({caller_agent})

**Changes applied in this session:**
{implementation_summary}

**Files modified:**
{files_modified as bullet list}

**Documentation impact:**
{summary of what this update covers}
```

If no feature doc exists and `feature_name` is provided, create a minimal one at:
`docs/features/{feature_name}.md`

#### 4b — API Documentation

If `backend-api` category is active:
- Locate or create `docs/api/{feature_name}.md`
- Document all modified endpoints: method, path, request body, response, auth requirements
- Mark deprecated or removed endpoints clearly

#### 4c — Architecture Documentation

If `backend-db` or `infrastructure` category is active and the change is non-trivial:
- Check if an ADR already covers this decision in `docs/architecture/`
- If not, **flag the gap** with a `⚠️ ADR NEEDED` note in the delivery report (do not create the ADR — that is BSA's responsibility)

#### 4d — Changelog Entry

For every session that produces a `backend-api`, `backend-service`, `backend-db`, or `frontend-component` change:

1. Locate `CHANGELOG.md` (root or `docs/`) — if absent, create it with standard Unreleased header.
2. Under `## [Unreleased]`, prepend a bullet:

```markdown
- {category-emoji} {feature_name}: {one-line summary from implementation_summary} ({user_story_id if available})
```

Category emojis:
- `backend-api` → `🔌`
- `backend-service` → `⚙️`
- `backend-db` → `🗄️`
- `frontend-component` → `🎨`
- `config` → `⚙️`
- `infrastructure` → `🏗️`

#### 4e — README Update

If `config` or `infrastructure` changes affect public-facing setup or behavior:
- Locate the relevant section in `README.md`
- Update only the affected paragraph or table row — never rewrite unrelated sections

### Step 5: Validate and Report

Run `problems` tool to verify that all modified documentation files are valid (no broken markdown links if the tool can detect them).

Produce the delivery report (see §Delivery Format).

---

## 🔄 Integration with Agents

### Called by Coder (after Step 7 — Validate)

Coder passes:
- `files_modified` — all files created or changed
- `implementation_summary` — summary from the Delivery Format block
- `caller_agent: "Coder"`

Coder adds to its Delivery Format:

```markdown
📚 Docs: [N] documentation files updated (Update_Docs skill)
```

### Called by Reviewer (after delivering the review report)

Reviewer passes:
- `files_modified` — the diff scope reviewed
- `implementation_summary` — review decision + score + key findings (one paragraph)
- `caller_agent: "Reviewer"`

Update_Docs appends a **"Review Pass"** note to the feature doc — score, decision, critical observations.

### Called by Bsa (after Phase 5 — Generate BRD and User Story)

BSA passes:
- `files_modified` — BRD + User Story paths created
- `implementation_summary` — brief of requirements captured
- `caller_agent: "Bsa"`

Update_Docs registers the new docs in the project index (if one exists) and appends a changelog entry under a `📋 Analysis` category.

### Called by QA_Orchestrator (after QA workflow completion)

QA_Orchestrator passes:
- `files_modified` — E2E test files created/modified
- `implementation_summary` — QA recommendation + pass/fail counts
- `qa_e2e_plan_path`, `qa_recommendation`
- `caller_agent: "QA_Orchestrator"`

Update_Docs appends a **"QA Sign-Off"** section to the feature doc.

### Called from dev.yaml Phase 6 (end of full_dev workflow)

Receives the complete workflow variable set. Executes `doc_scope: full` pass over all categories collected across phases.

### Called via `/update-docs` slash command

Manual invocation. Uses `git diff HEAD` to identify `files_modified` automatically when no list is provided.

---

## 📈 Delivery Format

```markdown
✅ Documentation Update Complete

📂 Files Updated:
- [path]: [what was updated]
- [path]: [what was updated]

📄 Files Created:
- [path]: [what was created]

📋 Changelog: [appended | skipped — no API/service/DB/frontend changes]

⚠️ Gaps Flagged:
- [ADR NEEDED for ...] (or "None")

📊 Categories Detected: [backend-api, frontend-component, ...]
```

---

**END OF SKILL DEFINITION**
