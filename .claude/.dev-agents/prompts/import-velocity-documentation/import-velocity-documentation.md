# Master Prompt — Import Velocity Documentation into Agent Memory

> **Parameter:** `INPUT_FOLDER` — absolute path to the folder that contains (or IS) the
> Velocity-generated documentation tree. Velocity documentation is organized into numbered
> SDLC phase subfolders (`01-understand`, `02-define`, … `11-operations`, `12-closure` /
> `13-closure`). Each subfolder may also contain a `references/` subfolder with
> supplementary input documents.
>
> **Who runs this:** Any agent with `read_file` + `write_file` access.
>
> **Pre-condition:** `.dev-agents/` agentic system is already in place. This prompt is
> idempotent — running it again updates existing entries rather than duplicating them.
>
> **Language:** Documentation may be in any language (English, Spanish, etc.).
> Extract the knowledge regardless of language; write memory entries in English.

---

## Step 0 — Prepare session (run in parallel)

1. **Resolve author:** run `git config user.email` → cache as `{author}`.
   If the command fails, use `"unknown"`.
2. **Resolve timestamp:** run `Get-Date -AsUTC -Format 'yyyy-MM-ddTHH:mm:ssZ'` →
   cache as `{now}`.
3. **Read memory protocol:** read `.dev-agents/skills/Memory_Protocol/SKILL.md` in full
   to confirm exact file schemas before writing anything.
4. **Read existing indexes:** read every `_index.json` that exists in the target
   directories listed in Step 4 to avoid duplicating entries.

---

## Step 1 — Auto-detect documentation root

`INPUT_FOLDER` may point to the SDLC root directly **or** to a parent folder that
contains the SDLC root as a subfolder. Resolve automatically:

```
1. List the direct children of INPUT_FOLDER.
2. IF any child folder name matches the pattern /^\d{2}-/  (e.g. "01-understand")
   → DOC_ROOT = INPUT_FOLDER   (it is already the SDLC root)
3. ELSE list one level deeper; find the first subfolder whose children match /^\d{2}-/
   → DOC_ROOT = that subfolder
4. IF still not found → stop and report:
   "Could not locate SDLC phase folders under INPUT_FOLDER. Verify the path."
```

---

## Step 2 — Discover and inventory all documentation files

Starting from `DOC_ROOT`, enumerate **every file** (read-only):

```
For each direct subfolder of DOC_ROOT:
  1. Record the phase number and slug  (e.g. phase=04, slug="architecture")
  2. List all *.md files directly in the folder
  3. If a "references/" subfolder exists, list all *.md files inside it too
  4. Record each file as: { phase, slug, path, is_reference: bool }
```

Build a flat `FILE_LIST` of all discovered files. Log the count.

> Do **not** read file contents yet — just build the inventory.

---

## Step 3 — Read all files and extract knowledge

Read every file in `FILE_LIST` (parallelize within each phase). For each file:

### 3.1 Universal extraction fields

Regardless of document type, extract:

| Field | How to find it |
|---|---|
| `doc_id` | YAML frontmatter `id:`, first-line heading matching `^#\s+[A-Z]{2,}-\d{3}`, or an approval table row with "Document ID" / "ID" label. If absent, derive from filename. |
| `doc_version` | Frontmatter `version:`, approval table "Version" row, or heading suffix `(v1.2)`. |
| `doc_title` | First `# Heading` or frontmatter `title:`. |
| `doc_language` | Detect from content (Spanish keywords: "Resumen", "Alcance", "Objetivo", "Descripción"). |
| `section_headers` | All `##` and `###` headings, in order. |
| `approval_table` | Any table whose columns include Author/Approver/Date/Role — extract all rows. |

### 3.2 Knowledge classification by SDLC phase

Use the phase folder slug to focus extraction. The table below defines **what to look for**
in each phase and **where the result goes** in the memory bank.

> If a file has content that fits a category NOT listed for its phase (common in richer
> documents), classify it anyway — the content takes priority over the folder position.

---

#### Phase 01 — understand (`01-understand/`)

**Look for:**
- Project name, client name, product name
- Business problem statement and consequences of inaction
- Value proposition and ROI / financial impact
- Success KPIs (numeric targets preferred: from X to Y)
- Stakeholders and their roles / sponsors
- Strategic objectives and alignment

**Extract to extraction map key:** `UNDERSTAND`

---

#### Phase 02 — define (`02-define/`)

**Look for:**
- System name and one-paragraph description
- User roles / personas (ID, name, description, access level, primary actions)
- Functional capabilities and high-level features
- Scope IN list and Scope OUT list
- Key system interactions and workflows
- Authentication / authorization mechanism mentioned

**Extract to extraction map key:** `DEFINE`

---

#### Phase 03 — requirements (`03-requirements/`)

**Look for:**
- Business rules catalog (tables with Rule ID, Category, Description, Condition, Action,
  Enforcement layer, Priority — extract ALL rows)
- Non-functional requirements grouped by quality attribute (with measurable thresholds)
- Quality attribute weights / priorities (percentages or ordinal ranking)
- Validation rules (field-level: mandatory fields, max lengths, allowed values, formats)
- Integrity rules (referential constraints, state machine transitions, uniqueness rules)
- Architectural constraints listed as rules (e.g., "no raw SQL", "no business logic in controllers")
- Traceability matrix (FR ↔ NFR ↔ BR cross-references)

**Extract to extraction map key:** `REQUIREMENTS`

---

#### Phase 04 — architecture (`04-architecture/`)

**Look for:**
- Selected architecture style / pattern (e.g., Clean Architecture, Layered Monolith,
  Microservices, Event-driven)
- Architecture decision rationale (why this style was chosen over alternatives)
- Component/layer topology (which layers exist, what each owns, dependency directions)
- Technology stack selections (language, framework, database, message bus, external services)
- Quality attribute weights used for evaluation (percentages)
- Alternative architectures considered and rejected (with reasons)
- ADRs (Architecture Decision Records) with date, decision, rationale, consequences
- C4 diagram descriptions (if present): Context, Container, Component levels
- API surface (endpoints, HTTP methods, request/response shapes if documented here)
- External service integrations (names, purpose, boundaries)
- Anti-patterns explicitly prohibited in this project

**Extract to extraction map key:** `ARCHITECTURE`

---

#### Phase 05 — planning (`05-planning/`)

**Look for:**
- Epics (ID, title, description)
- User stories / backlog items (ID, title, priority/MoSCoW, sprint assignment, story points,
  source FR/requirements, acceptance criteria, dependencies)
- Won't Have / deferred items (list with rationale)
- Sprint plan (sprint number, date range, story IDs included, SP total)
- Milestones (ID, name, date, acceptance criteria)
- Velocity targets and assumptions
- Go-live date and release plan

**Extract to extraction map key:** `PLANNING`

---

#### Phase 06 — governance (`06-governance/`)

**Look for:**
- Quality gates per milestone (acceptance criteria, approvers)
- Change management policy (what triggers a change request, who approves)
- Risk register (risk ID, description, likelihood, impact, mitigation)
- Decision authority matrix (who can approve what)
- Scope enforcement rules (what is explicitly NOT allowed in this version)

**Extract to extraction map key:** `GOVERNANCE`

---

#### Phase 07 — development (`07-development/`)

**Look for:**
- Full technology stack with exact versions (language, framework, ORM/data access,
  package manager, build tool, test framework, UI library, etc.)
- Build commands (build, run, test, lint, migrate)
- Port / URL assignments (API port, frontend port, docs URL, DB connection string pattern)
- Solution / project structure (file tree with folder responsibilities)
- Code standards and guiding principles (explicit DO and DO NOT lists)
- Naming conventions by category (classes, methods, variables, files, DB objects, tests,
  API endpoints, env vars, infra resources)
- Implementation patterns mandated by the project (with DO / DO NOT examples)
- API endpoint contracts (method, route, request body, response body, status codes)
- Authentication flow description
- Error handling pattern (response envelope format, error codes)
- Data access pattern (ORM, query style, transaction handling, no-raw-SQL rules)
- Background / async processing pattern (queues, workers, retry policies)

**Extract to extraction map key:** `DEVELOPMENT`

---

#### Phase 08 — quality (`08-quality/`)

**Look for:**
- Test strategy and scope (what is in/out of scope for testing)
- Test types employed (unit, integration, E2E, UAT, performance, security)
- Test naming convention (ID format like `TC-MODULE-TYPE-###`)
- Test cases (ID, title, preconditions, steps, expected result, category) — extract ALL
- Acceptance criteria per user story or use case
- Quality gates (pass/fail thresholds for go-live)
- Performance acceptance thresholds (p95 latency, render times, bundle size)
- UAT scenarios and use cases (UC-ID, title, actor, flow)
- Test results summary (pass/fail counts, defects found, severity breakdown)

**Extract to extraction map key:** `QUALITY`

---

#### Phase 09 — security (`09-security/`)

**Look for:**
- Security assessment scope and risk profile
- Data classification levels (PII, CONFIDENTIAL, INTERNAL labels used)
- OWASP Top 10 coverage status (per item: compliant / partially / not applicable)
- Authentication and authorization controls (mechanisms, JWT configuration, RBAC design)
- Accepted security risks / exceptions (explicitly deferred to post-MVP)
- Compliance frameworks referenced (ISO 27001, NIST, SOC2, GDPR, etc.)
- Security controls implemented (input validation, output encoding, TLS, key management)
- Attack surface analysis (exposed endpoints, external integrations, trust boundaries)
- Vulnerability findings and remediation status

**Extract to extraction map key:** `SECURITY`

---

#### Phase 10 — infrastructure (`10-infrastructure/`)

**Look for:**
- Cloud provider / hosting platform
- Infrastructure topology (services, tiers, regions, availability zones)
- Resource naming conventions (patterns with examples — extract ALL)
- Environment names and their purposes (dev, staging, prod, local)
- Required environment variables / secrets (names and descriptions, NOT values)
- Connection string patterns and configuration injection method
- IaC tool and file naming conventions
- Cost constraints / budget caps (hard limits, alert thresholds)
- Deployment method (CI/CD pipeline, manual steps, IaC commands)
- Deployment runbook summary (ordered steps, rollback procedure)

**Extract to extraction map key:** `INFRASTRUCTURE`

---

#### Phase 11 — operations (`11-operations/`)

**Look for:**
- Operational runbook procedures
- Monitoring strategy (tools, dashboards, alert thresholds)
- SLA targets (uptime percentage, RTO, RPO)
- Incident response procedures (severity levels, escalation matrix, communication plan)
- On-call rotation details
- Log aggregation and observability approach

**Extract to extraction map key:** `OPERATIONS`

---

#### Phase 12 / 13 — closure (`12-closure/` or `13-closure/`)

**Look for:**
- Project outcome vs. objectives (were KPIs met?)
- Lessons learned (categorized: what worked, what didn't, what to improve)
- Deferred items (known gaps, post-MVP backlog, tech debt)
- Key decisions that proved correct or incorrect in retrospect
- Knowledge transfer checklist and target recipients

**Extract to extraction map key:** `CLOSURE`

---

#### `references/` subfolder (any phase)

Read every file in `references/` subfolders and apply the same phase extraction rules
as the parent folder. Treat them as supplementary sources for the same extraction map key.

---

## Step 4 — Write `.dev-agents/memory-bank/00-shared/` files

Use the extraction map built in Step 3. All entries carry `"author": "{author}"` and
`"last_updated": "{now}"`.

### 4.1 `00-shared/project/project_context.json`

Create or overwrite. Populate every field you can resolve; use `null` for fields with
no evidence in the documentation.

```json
{
  "project_name":          "[UNDERSTAND: product/project name]",
  "client":                "[UNDERSTAND: client or business unit — null if internal]",
  "project_description":   "[DEFINE: one-paragraph system description]",
  "business_problem":      ["[UNDERSTAND: bullet points from problem statement]"],
  "value_proposition":     ["[UNDERSTAND: KPIs with before→after targets]"],
  "scope_in":              ["[DEFINE + PLANNING: Must-Have capabilities and stories]"],
  "scope_out":             ["[DEFINE + PLANNING: Won't Have items with rationale]"],
  "user_roles":            [
    {
      "id":          "[role ID from DEFINE]",
      "name":        "[role name]",
      "description": "[one-line summary]",
      "access":      "system-wide | project-level | read-only"
    }
  ],
  "tech_stack": {
    "backend":      "[language + framework + version from DEVELOPMENT]",
    "frontend":     "[framework + version]",
    "database":     "[DB engine + version]",
    "auth":         "[auth mechanism from DEFINE/DEVELOPMENT]",
    "cloud":        "[cloud provider and key services from INFRASTRUCTURE]",
    "other":        ["[any other significant technology]"]
  },
  "architecture_style":    "[ARCHITECTURE: selected style name]",
  "architecture_rationale":"[ARCHITECTURE: one sentence on why this style was chosen]",
  "solution_layers":       ["[ARCHITECTURE: layer names and one-line responsibilities]"],
  "api_base_url_dev":      "[DEVELOPMENT: API base URL / port for local dev]",
  "frontend_base_url_dev": "[DEVELOPMENT: frontend URL / port for local dev]",
  "api_docs_url":          "[DEVELOPMENT: Swagger/Scalar/OpenAPI URL if documented]",
  "go_live_date":          "[PLANNING: target go-live date ISO 8601]",
  "project_status":        "[CLOSURE if exists, else PLANNING: current status]",
  "budget_constraint":     "[INFRASTRUCTURE: hard cost cap if any — null otherwise]",
  "key_documents":         [
    { "id": "[doc_id]", "path": "[relative path from DOC_ROOT]", "phase": "[phase slug]" }
  ],
  "author":        "{author}",
  "last_updated":  "{now}"
}
```

### 4.2 `00-shared/project/priorities.md`

Rewrite (do not append). Derive from `REQUIREMENTS` quality attribute weights and
guiding principles. Use this structure:

```
# Project Priorities

> Source: [doc IDs from REQUIREMENTS phase]
> Last updated: {now}

## Priority Stack (highest → lowest)

For each quality attribute found (ordered by weight/rank):

### Priority N — [Quality Attribute Name]
- Weight: [percentage or ordinal rank from quality-attribute-weights document]
- Source: [doc ID and section]
- Binding rules:
  - [Specific measurable rule from NFR/BR — e.g., "API p95 < 100ms"]
  - [...]

## Architectural Principles (non-negotiable)

For each guiding principle found in DEVELOPMENT phase code-standards:

- **[Principle ID / Name]:** [Description] — Source: [doc ID]

## Hard Boundaries (Scope Out)

What is explicitly NOT allowed in this version:
- [item from Scope Out list]
- [...]

## Conflict Resolution

When two priorities conflict, higher number wins. Within the same priority:
- [any project-specific tie-breaking rules found in governance or architecture docs]
```

### 4.3 `00-shared/patterns/` files

Create one file per logical pattern cluster extracted from `ARCHITECTURE` and
`DEVELOPMENT`. For each cluster, create a Markdown file and add an entry to
`00-shared/patterns/_index.json`.

**Clusters to create (create only those with evidence in the documentation):**

| File name | Evidence to look for |
|---|---|
| `architecture-patterns.md` | Architecture style, layer topology, dependency rules, ADRs |
| `domain-model.md` | Domain entities with fields, types, constraints, enumerations, state machines |
| `api-design-patterns.md` | Endpoint contracts, HTTP status codes, error response format, CORS config |
| `validation-patterns.md` | Validation library placement, mandatory fields, max lengths, enum validation |
| `data-access-patterns.md` | ORM / query patterns, transaction boundaries, no-raw-SQL rules, DbContext lifetime |
| `async-patterns.md` | Message queue config, worker patterns, retry/DLQ policies, idempotency rules |
| `auth-patterns.md` | Auth flow, token validation, RBAC enforcement, session handling |
| `frontend-patterns.md` | Component structure, state management, routing, API client patterns |
| `naming-conventions.md` | All naming rules: classes, methods, variables, DB objects, infra resources, test IDs |

**Format for each pattern file:**

```markdown
---
source: "[doc IDs this was extracted from]"
last_updated: "{now}"
author: "{author}"
---

# [Pattern Cluster Name]

## DO
- [Concrete rule with example — copy from source document]

## DO NOT
- [Explicit prohibition — from BR-ARCH-XXX, code-standards, or architecture constraints]

## Details

[Structured content: tables, code examples, decision rationale — extracted verbatim or
summarized from source. Cite source doc ID and section inline.]
```

**`00-shared/patterns/_index.json` entry schema:**

```json
{
  "id":           "[kebab-case slug matching filename without .md]",
  "name":         "[Human-readable cluster name]",
  "file":         "[filename.md]",
  "tags":         ["[keyword]", "..."],
  "source_docs":  ["[doc_id]", "..."],
  "author":       "{author}",
  "last_updated": "{now}"
}
```

### 4.4 `00-shared/anti-patterns/project-anti-patterns.md`

Extract all explicitly prohibited patterns. Populate with:
- Architectural prohibitions from `REQUIREMENTS` (BR-ARCH-XXX or equivalent)
- Code standard "DO NOT" rules from `DEVELOPMENT`
- Scope-out items that represent hard boundaries (no auth, no X feature, etc.)
- Accepted-risk items that define regression boundaries (what must not be introduced)
- Security exceptions listed as known risks

```markdown
---
source: "[doc IDs]"
last_updated: "{now}"
author: "{author}"
---

# Project Anti-Patterns

## Architectural Violations
- **[Rule ID]:** [Description] — Source: [doc ID §section]

## Code Anti-Patterns
- **[Principle]:** [What to never do] — Source: [doc ID]

## Hard Scope Boundaries
The following are explicitly out of scope. Never implement:
- [item]

## Security Regression Boundaries
The following must NOT be introduced by any future change:
- [item from accepted-risk or security-assessment]
```

Add entry to `00-shared/anti-patterns/_index.json`.

### 4.5 `00-shared/references/` files

Create one reference file per major knowledge domain. Copy full decision/reference
content (not a summary) so agents can load it progressively. Add all entries to
`00-shared/references/_index.json`.

**Files to create (create only those with source evidence):**

| File | Source phases | Primary tags |
|---|---|---|
| `functional-requirements.md` | `02-define`, `03-requirements` | `requirements`, `user-stories`, `scope`, `roles` |
| `business-rules.md` | `03-requirements` business-rules doc | `validation`, `integrity`, `domain`, `constraints` |
| `nonfunctional-requirements.md` | `03-requirements` nfr doc | `performance`, `security`, `reliability`, `availability` |
| `architecture-decisions.md` | `04-architecture` all docs | `architecture`, `ADR`, `decisions`, `tradeoffs` |
| `test-cases.md` | `08-quality` | `testing`, `qa`, `acceptance-criteria` |
| `security-boundaries.md` | `09-security` | `security`, `owasp`, `compliance`, `accepted-risk` |
| `environment-config.md` | `10-infrastructure` | `config`, `env-vars`, `connection-strings`, `deployment` |
| `infrastructure-and-deployment.md` | `10-infrastructure`, `11-operations` | `infrastructure`, `deployment`, `ops`, `runbook` |
| `lessons-learned.md` | `12-closure` or `13-closure` | `retrospective`, `learnings`, `deferred` |

**Format for each reference file:**

```markdown
---
source: "[doc_id(s)]"
phase: "[phase slug(s)]"
tags: ["[tag]"]
last_updated: "{now}"
author: "{author}"
---

# [Title]

[Full structured content extracted from source document(s).
Use the original section headers. Preserve tables, bullet lists, and rule IDs.
Translate to English if source is in another language.
Do not summarize — copy the structured facts verbatim.]
```

**`00-shared/references/_index.json` entry schema:**

```json
{
  "id":           "[kebab-case slug]",
  "name":         "[Human-readable title]",
  "file":         "[filename.md]",
  "tags":         ["[tag]"],
  "source_docs":  ["[doc_id]"],
  "author":       "{author}",
  "last_updated": "{now}"
}
```

### 4.6 `00-shared/project/PROJECT_ANALYSIS_PROMPT.md`

Create or overwrite. This is an agent-executable analysis prompt scoped to THIS project.

```markdown
# Project Analysis Prompt — [Project Name]

> Generated from Velocity documentation. Last updated: {now}

## Solution Entry Points
[From DEVELOPMENT tech-doc: exact file paths for API entry point, frontend entry point,
solution/project file]

## Architecture Layers
[From ARCHITECTURE: layer name → folder path → responsibility — one row per layer]

## API Surface
[From DEVELOPMENT or ARCHITECTURE: method | route | request | response | status codes
— one row per endpoint]

## Domain Model
[From ARCHITECTURE or REQUIREMENTS: entity name → fields → types → constraints
— one section per entity]

## User Stories
[From PLANNING: ID | Title | Priority | Sprint | SP — one row per story]

## Test Layout
[From QUALITY + DEVELOPMENT: test project name → test type → location]

## Build & Run Commands
[From DEVELOPMENT: every command found — build, run-api, run-frontend, test-backend,
test-frontend, migrate, lint, deploy]

## External Integrations
[From ARCHITECTURE + INFRASTRUCTURE: service name → purpose → trust boundary]
```

---

## Step 5 — Write per-agent memory files

For each of the 5 agents, write all 7 files into
`.dev-agents/memory-bank/20-agents/{agent}/`.
Each file uses the exact schema from the template already in that folder.
Fill every field you can; leave empty string / null / `[]` for fields with no evidence.

Every written entry MUST carry `"author": "{author}"`.

---

### 5.1 `orchestrator/`

| File | Extract from |
|---|---|
| `project_context.json` | Same fields as 4.1. Add: sprint structure from PLANNING (Sprint N → date range → story IDs), milestone list (ID → name → date → acceptance criteria). |
| `project_structure.json` | Solution layout from DEVELOPMENT: solution file → project/module list → test projects. Map folder names to the architecture layer names. |
| `business_rules.json` | Scope enforcement from GOVERNANCE: won't-have list, change management policy, quality gate definitions per milestone. |
| `learned_patterns.json` | Orchestration lessons from PLANNING + CLOSURE: sprint cadence, pre-sprint checklist items, risk log entries, go-live criteria. |
| `decision_history.json` | Architecture selection decision from ARCHITECTURE phase: alternative chosen, score/rationale, date from approval table. |
| `session_log.json` | Empty `"sessions": []`. Set `"next_session_hint"` to: `"Begin with [first sprint stories from PLANNING]. Read [primary architecture doc ID] and [primary tech doc ID] before issuing Coder instructions."` |
| `naming_conventions.json` | Any naming rules applicable at orchestration level (story ID format, doc ID format, milestone ID format). |

---

### 5.2 `bsa/`

| File | Extract from |
|---|---|
| `project_context.json` | Business context from UNDERSTAND (problem, consequences, value proposition, success criteria). User roles from DEFINE. All Must-Have user stories from PLANNING with source FRs and sprint assignments. |
| `business_rules.json` | Complete business rules catalog from REQUIREMENTS: all rule IDs, descriptions, categories, enforcement layer, source FR. |
| `naming_conventions.json` | Requirement ID format, user story ID format, document ID format, rule ID format — from REQUIREMENTS traceability doc. |
| `learned_patterns.json` | User story template structure from PLANNING backlog. Acceptance criteria format from QUALITY UAT use cases. |
| `project_structure.json` | Documentation folder map: every phase folder → files it contains → document IDs. |
| `decision_history.json` | MoSCoW decisions from PLANNING: which stories are Must Have, which are deferred, rationale. |
| `session_log.json` | `"next_session_hint"`: `"All Must-Have stories are in [backlog doc ID]. Use [traceability doc ID] to verify cross-references before creating any new work item."` |

---

### 5.3 `coder/`

| File | Extract from |
|---|---|
| `project_context.json` | Full tech stack from DEVELOPMENT: language + version, framework + version, test framework, build tool, key dependencies. Build/run commands. Ports. |
| `project_structure.json` | Exact folder tree from DEVELOPMENT: each folder → layer name → what it owns → what it is NOT allowed to reference. Dependency direction rules. |
| `business_rules.json` | Code standards guiding principles + validation rules mapped to implementation layer: Domain vs. Application vs. Infrastructure responsibilities. |
| `naming_conventions.json` | Complete naming conventions from DEVELOPMENT code-standards: classes, interfaces, DTOs, methods, private fields, local vars, DB objects, API routes, env vars, test names, file names. |
| `learned_patterns.json` | From DEVELOPMENT + ARCHITECTURE: dependency rule pattern, validation library placement, error response format, data access pattern, async processing pattern, frontend component structure, auth flow. |
| `decision_history.json` | ADRs from ARCHITECTURE: each ADR as a decision entry with title, chosen option, rationale, consequences, date. |
| `session_log.json` | `"next_session_hint"`: `"Read [architecture doc ID] → [tech doc ID] → [code-standards doc ID] → [current story from backlog] before writing any code. Run build + test commands after each story."` |

---

### 5.4 `reviewer/`

| File | Extract from |
|---|---|
| `project_context.json` | Reviewer scope: architecture style to enforce, error response format, validation library placement, data access pattern, frontend patterns. Source doc IDs. |
| `project_structure.json` | Layer boundaries to enforce (same as coder) + test project structure. |
| `business_rules.json` | Review checklist: code standard principles, architectural constraint rules, NFR thresholds (performance targets), security requirements, accepted-risk items (do NOT flag these as defects). |
| `naming_conventions.json` | Same as coder — reviewer enforces the same rules. |
| `learned_patterns.json` | From QUALITY test-report (if exists): what passed/failed. From QUALITY test-cases: the test case list as a review reference. From CLOSURE lessons learned if applicable. |
| `decision_history.json` | Architecture evaluation rationale from ARCHITECTURE: why selected option is correct. Accepted-risk list so reviewer does not flag by-design gaps as defects. |
| `session_log.json` | `"next_session_hint"`: `"Before reviewing any PR: (1) Check dependency rule. (2) Verify validation is in the correct layer. (3) Check error response format on all error paths. (4) Run test cases from [test-cases doc ID] relevant to changed endpoints."` |

---

### 5.5 `qa/`

| File | Extract from |
|---|---|
| `project_context.json` | QA scope from QUALITY test-plan: what is in scope (endpoints, UI flows, validation, performance, security), test environment, tools. |
| `project_structure.json` | Test file layout from DEVELOPMENT + QUALITY: unit test project, integration test location, E2E test location. |
| `business_rules.json` | Quality gates from GOVERNANCE (milestone acceptance criteria) + test-plan pass/fail thresholds + test-report baseline results if available. |
| `naming_conventions.json` | Test naming convention from QUALITY: ID format, module codes, type codes (Positive/Negative/Edge). |
| `learned_patterns.json` | From QUALITY: Arrange-Act-Assert structure, boundary/equivalence partitioning approach, OWASP checks applicable, performance assertion method, UAT scenario format. |
| `decision_history.json` | Go-live decision from QUALITY test-report (if exists): defect count by severity, acceptance rationale. Or from GOVERNANCE go-live criteria. |
| `session_log.json` | `"next_session_hint"`: `"Before writing E2E tests: read [test-cases doc ID] for baseline test cases. Follow [naming convention format] for new tests. Check [NFR doc ID] §performance and §security for thresholds."` |

---

## Step 6 — Update all `_index.json` files

After writing each new file, update the `_index.json` in the same directory.

Rules:
- Never duplicate an entry that already exists — update it instead.
- Every entry carries: `"id"`, `"name"`, `"file"`, `"tags"`, `"source_docs"`,
  `"author": "{author}"`, `"last_updated": "{now}"`.
- If `_index.json` does not exist yet, create it with `{ "entries": [] }` structure
  and add the entries.

---

## Step 7 — Write `.dev-agents/memory-bank/30-learnings/` (conditional)

If `CLOSURE` extraction map has entries (lessons learned or retrospective data):

Create `.dev-agents/memory-bank/30-learnings/{project_slug}-lessons.md` where
`{project_slug}` is the project name lowercased and hyphenated.

```markdown
---
source_agent: "import-velocity"
project: "[project name]"
source_doc: "[closure doc ID(s)]"
author: "{author}"
created_at: "{now}"
---

# Lessons Learned — [Project Name]

## What Worked
[From closure/lessons-learned: positive retrospective items]

## What Didn't Work
[From closure/lessons-learned: negative retrospective items]

## Deferred Items (Post-MVP / Tech Debt)
[From closure or planning Won't Have list]

## Process Improvements for Next Project
[From closure: process-level recommendations]
```

---

## Step 8 — Validate completeness

After all writes, verify each item. Fix any failure before reporting.

- [ ] `.dev-agents/memory-bank/00-shared/project/project_context.json` — exists,
  contains `project_name`, `tech_stack`, `architecture_style`, `scope_in`, `scope_out`
- [ ] `.dev-agents/memory-bank/00-shared/project/priorities.md` — rewritten with
  project-specific quality attribute weights and principles
- [ ] `.dev-agents/memory-bank/00-shared/patterns/_index.json` — has an entry for every
  pattern file created
- [ ] `.dev-agents/memory-bank/00-shared/anti-patterns/_index.json` — has entry for
  `project-anti-patterns.md`
- [ ] `.dev-agents/memory-bank/00-shared/references/_index.json` — has entries for all
  reference files created
- [ ] `.dev-agents/memory-bank/00-shared/project/PROJECT_ANALYSIS_PROMPT.md` — created
- [ ] All 5 agent directories contain all 7 files:
  `project_context.json`, `project_structure.json`, `business_rules.json`,
  `learned_patterns.json`, `naming_conventions.json`, `decision_history.json`,
  `session_log.json`
- [ ] Every `_index.json` updated
- [ ] No writes outside `.dev-agents/memory-bank/`
- [ ] No modifications to any file under `DOC_ROOT` (read-only)

---

## Step 9 — Report

Output this report when all writes are complete:

```
## Memory Import Complete

**Project:**          [project_name]
**Input folder:**     [INPUT_FOLDER]
**Doc root:**         [DOC_ROOT resolved in Step 1]
**Files discovered:** [count]
**Files read:**       [count]
**Memory files written / updated:** [count]
**_index.json files updated:** [count]

### Files written per location
- .dev-agents/memory-bank/00-shared/project/         [N files]
- .dev-agents/memory-bank/00-shared/patterns/        [N files]
- .dev-agents/memory-bank/00-shared/anti-patterns/   [N files]
- .dev-agents/memory-bank/00-shared/references/      [N files]
- .dev-agents/memory-bank/20-agents/orchestrator/    [N files]
- .dev-agents/memory-bank/20-agents/bsa/             [N files]
- .dev-agents/memory-bank/20-agents/coder/           [N files]
- .dev-agents/memory-bank/20-agents/reviewer/        [N files]
- .dev-agents/memory-bank/20-agents/qa/              [N files]
- .dev-agents/memory-bank/30-learnings/              [N files]

### Phases found in documentation
[List phase slugs found: e.g., 01-understand ✅  04-architecture ✅  08-quality ⚠️ (partial)]

### Knowledge gaps (documentation not found for)
[List any extraction map key that had no source evidence]

### Validation
[Step 8 checklist — all ✅ or flag ❌ with the specific issue]

### Next steps for agents
- Orchestrator: ready to run Sprint 1 — first story: [US-001 title from PLANNING]
- Bsa:          ready to create work items from [backlog doc ID]
- Coder:        begin with [tech setup story]. Read [arch doc ID] and [code-standards doc ID] first
- Reviewer:     loaded with [code-standards doc ID] checklist and [test-cases doc ID] reference
- QA:           loaded with [test-cases count] test cases; read [NFR doc ID] for thresholds
```

---

## Hard Constraints

- **Read-only on `DOC_ROOT`** — never modify any source file under INPUT_FOLDER.
- **Memory-only writes** — all output goes exclusively to `.dev-agents/memory-bank/`.
- **No raw dumps** — do not copy entire documents verbatim into a single JSON value.
  Summarise and structure. Use `source_docs` references for full content.
- **No hardcoded assumptions** — do not assume any specific technology, architecture
  style, naming scheme, or document title. Derive everything from the actual files found.
- **Consistency rule** — when the same fact appears in multiple documents, prefer the
  highest-authority source in this order:
  `01-understand > 02-define > 03-requirements > 04-architecture > 07-development`
- **Language** — source documents may be in any language. Always write memory entries
  in English.
- **Silent execution** — do not announce each write step. Execute fully, then report in
  Step 9 format only.
