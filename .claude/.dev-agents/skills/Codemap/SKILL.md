---
name: codemap
version: "1.0.0"
last_updated: "2026-06-11"
inherits: ../../AGENTS.md
description: "Builds and maintains a structured index of the codebase so agents can navigate directly to the right file, class, or endpoint without running codebase-wide searches. Produces four JSON artefacts: structure, symbols, dependency graph, and API index. Supports full rebuild, incremental update, and direct query modes."
argument-hint: "Mode: 'full' (rebuild all), 'incremental files_modified=[...]' (update changed files only), 'query <term>' (answer where-is without rebuilding)"

tools:
  [
    "search",
    "usages",
    "codebase",
    "problems",
    "changes",
    "editFiles",
  ]
---

# Codemap Skill — Codebase Navigation Index

> **SKILL PRIORITY:** When invoked, these instructions take **HIGHEST PRIORITY** over global workspace instructions. This is a specialized indexing skill called by Coder after implementation and by any agent that needs fast codebase navigation.

> **PORTABILITY:** 100% language-agnostic with auto-detection. Adapts to any project layout, naming convention, or tech stack without modification.

## Inherited from AGENTS.md

This skill inherits from [`AGENTS.md`](../../AGENTS.md):

- §1 Address the user as **My Lord**.
- §8a `feedback_level` (default `limited`) and §8b `execution_mode` (default `semi`) — read from the top of the instruction block.

**Identification banner (mandatory at start of every response):**

```
🤖 **SKILL: Codemap**
📋 **TASK: {mode} — {brief description}**
---
```

---

## 🎯 Role & Scope

**Single Responsibility:** Build, update, and query a structured navigation index of the codebase so every agent can resolve "where is X?" in one lookup instead of a full codebase search.

**What I produce:**
- `.dev-agents/memory-bank/00-shared/codemap/_index.json` — entry point with metadata and file manifest
- `.dev-agents/memory-bank/00-shared/codemap/structure.json` — file tree classified by architectural layer and domain
- `.dev-agents/memory-bank/00-shared/codemap/symbols.json` — classes, public methods, endpoints, components, hooks
- `.dev-agents/memory-bank/00-shared/codemap/dependency_graph.json` — module-level import/dependency graph
- `.dev-agents/memory-bank/00-shared/codemap/api_index.json` — all HTTP endpoints with method, path, handler, auth requirement
- `.dev-agents/memory-bank/00-shared/codemap/test_map.json` — maps every source file to its corresponding test file(s)

**What I DON'T do:**
- ❌ Read or write application code (Coder)
- ❌ Code review (Reviewer)
- ❌ Update documentation prose (Update_Docs)
- ❌ Modify database schemas or memory files outside `codemap/`

---

## 📥 Inputs

| Variable         | Source                  | Required | Description                                            |
| ---------------- | ----------------------- | -------- | ------------------------------------------------------ |
| `mode`           | Caller / slash command  | Yes      | `full` \| `incremental` \| `query`                     |
| `files_modified` | Calling agent           | For `incremental` | List of files created or changed this session |
| `query`          | Caller / slash command  | For `query` | Search term: class name, endpoint path, domain, etc. |
| `caller_agent`   | Calling agent           | No       | Agent name that triggered this skill                   |

---

## 🗂️ Codemap File Schemas

### `_index.json`

```json
{
  "$schema_version": "1.0",
  "last_full_build": "ISO-8601 timestamp",
  "last_incremental": "ISO-8601 timestamp",
  "built_by": "agent-name",
  "tech_stack": {
    "backend": "detected language/framework",
    "frontend": "detected framework or null",
    "database": "detected engine or null",
    "test_framework": "detected framework"
  },
  "files": {
    "structure": "codemap/structure.json",
    "symbols":   "codemap/symbols.json",
    "dependency_graph": "codemap/dependency_graph.json",
    "api_index": "codemap/api_index.json",
    "test_map":  "codemap/test_map.json"
  },
  "stats": {
    "total_files_indexed": 0,
    "total_symbols": 0,
    "total_endpoints": 0,
    "domains": []
  }
}
```

### `structure.json`

```json
{
  "layers": {
    "api":            ["relative/path/Controller.ext"],
    "application":    ["relative/path/Service.ext"],
    "domain":         ["relative/path/Entity.ext"],
    "infrastructure": ["relative/path/Repo.ext"],
    "frontend":       ["relative/path/Component.ext"],
    "tests":          ["relative/path/ServiceTests.ext"],
    "migrations":     ["relative/path/001_init.ext"],
    "config":         ["relative/path/appsettings.json"],
    "other":          []
  },
  "domains": {
    "domain-name": {
      "layer_files": {
        "api":         ["Controller path"],
        "application": ["Service path"],
        "domain":      ["Entity path"],
        "infrastructure": ["Repo path"],
        "frontend":    ["Component path"],
        "tests":       ["Test file path"]
      }
    }
  }
}
```

### `symbols.json`

```json
{
  "classes": {
    "ClassName": {
      "file": "relative/path",
      "layer": "application",
      "domain": "domain-name",
      "public_methods": ["MethodA", "MethodB"],
      "implements": ["IInterfaceName"],
      "inherits": "BaseClass or null"
    }
  },
  "interfaces": {
    "IName": {
      "file": "relative/path",
      "implemented_by": ["ClassName"]
    }
  },
  "functions": {
    "functionName": {
      "file": "relative/path",
      "exported": true
    }
  },
  "components": {
    "ComponentName": {
      "file": "relative/path",
      "props": ["prop1", "prop2"],
      "hooks_used": ["useState", "useEffect"]
    }
  },
  "hooks": {
    "useHookName": {
      "file": "relative/path",
      "returns": "description"
    }
  }
}
```

### `dependency_graph.json`

```json
{
  "ClassName": {
    "file": "relative/path",
    "layer": "application",
    "depends_on": ["Dep1", "Dep2"],
    "depended_by": ["Consumer1"],
    "test_file": "relative/test/path or null"
  }
}
```

### `api_index.json`

```json
{
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/resource",
      "handler": "ControllerClass.MethodName",
      "file": "relative/path",
      "auth_required": true,
      "request_body": "TypeName or null",
      "response_type": "TypeName or null",
      "domain": "domain-name"
    }
  ]
}
```

### `test_map.json`

```json
{
  "relative/source/path": {
    "test_files": ["relative/test/path"],
    "coverage_status": "covered | partial | missing"
  }
}
```

---

## 📋 Execution Workflow by Mode

### Mode: `full` — Complete rebuild

**Use when:** First run, major refactor, tech-stack change, or index is stale (>7 days since last full build).

**Step 1: Detect Tech Stack**

Scan root for manifest files to identify languages and frameworks:

| File found        | Inference                         |
| ----------------- | --------------------------------- |
| `*.csproj`        | .NET / C#                         |
| `package.json`    | Node.js / TypeScript / JavaScript |
| `pom.xml`         | Java / Spring                     |
| `build.gradle`    | Kotlin / Java                     |
| `go.mod`          | Go                                |
| `requirements.txt` / `pyproject.toml` | Python             |
| `Cargo.toml`      | Rust                              |
| `vite.config.*` / `next.config.*` | React/Next.js frontend |
| `angular.json`    | Angular frontend                  |

Record findings in `_index.json.tech_stack`.

**Step 2: Discover Project Structure**

List all source files recursively, excluding:
- `node_modules/`, `bin/`, `obj/`, `.git/`, `dist/`, `build/`, `coverage/`
- Binary files (images, fonts, compiled assets)
- Lock files (`package-lock.json`, `yarn.lock`, `*.lock`)

**Step 3: Classify Files into Layers**

Apply heuristics for the detected language:

*Name-based signals (universal):*
- `*Controller*`, `*Router*`, `*Handler*`, `*Endpoint*` → `api`
- `*Service*`, `*UseCase*`, `*Interactor*`, `*Command*`, `*Query*` → `application`
- `*Repository*`, `*Repo*`, `*Store*`, `*Dao*`, `*Mapper*` → `infrastructure`
- `*Entity*`, `*Model*`, `*Domain*`, `*Value*`, `*Aggregate*` → `domain`
- `*Component*`, `*Page*`, `*View*`, `*Screen*`, `*.tsx`, `*.jsx`, `*.vue` → `frontend`
- `*Test*`, `*Spec*`, `*.test.*`, `*.spec.*` → `tests`
- `*Migration*`, `*Schema*`, `db/migrate/*` → `migrations`
- `appsettings*`, `*.config.*`, `*.env*`, `Dockerfile`, `*.yaml` CI/CD files → `config`

*Path-based signals (override name when clearer):*
- `src/api/`, `controllers/`, `routes/` → `api`
- `src/services/`, `application/`, `use-cases/` → `application`
- `src/domain/`, `core/`, `models/` → `domain`
- `src/infrastructure/`, `data/`, `repositories/` → `infrastructure`
- `frontend/`, `client/`, `web/`, `app/` (when separate folder) → `frontend`
- `tests/`, `__tests__/`, `spec/` → `tests`
- `migrations/`, `db/` → `migrations`

**Step 4: Infer Domains**

Group files into domains by shared name prefix or directory name:

- Files containing `Auth*`, `Login*`, `Token*` → domain `auth`
- Files in `src/*/Users/` or named `User*` → domain `user`
- Files in `src/*/Orders/` or named `Order*` → domain `order`
- If no clear grouping → domain `core` or `shared`

Write `structure.json`.

**Step 5: Extract Symbols**

For each non-test source file, extract:

*Backend (C# / Java / Go / Python / TS/JS):*
- Class/struct/interface declarations
- Public method names (signature only, not body)
- Implemented interfaces / base classes
- Constructor-injected dependencies (DI parameters)

*Frontend (React / Angular / Vue):*
- Component name and its props
- Custom hooks and their return types
- Named exports

Use `search` tool with patterns like:
- `public class (\w+)` / `class (\w+) implements`
- `@Controller\(` / `@Route\(`
- `export (default )?function (\w+)` / `export const (\w+)`
- `\[HttpGet\|HttpPost\|HttpPut\|HttpDelete\]` (C# attributes)
- `@app.route\(` / `@router.get\(` (Python)
- `router.(get|post|put|delete)\(` (Express/Node)

Write `symbols.json`.

**Step 6: Build Dependency Graph**

For each class/module, scan its import/using statements to record what it depends on:

- `using NamespaceName;` / `import { X } from './path'` / `from module import X`
- Match imported names against the symbols index to resolve to known classes
- Record forward (depends_on) and reverse (depended_by) edges

Write `dependency_graph.json`.

**Step 7: Index API Endpoints**

Scan the `api` layer files for route/endpoint declarations:

- C#: `[HttpGet("path")]`, `[HttpPost("path")]`, `[Route("path")]`
- NestJS: `@Get()`, `@Post()`, `@Put()`, `@Delete()`
- Express: `router.get('/path', handler)`
- FastAPI/Flask: `@app.get('/path')`, `@router.post('/path')`
- Spring: `@GetMapping`, `@PostMapping`
- Go Gin/Echo: `r.GET("/path", handler)`

For each endpoint, extract method, path, handler name, and auth decorators (if any).

Write `api_index.json`.

**Step 8: Build Test Map**

For each source file, find its corresponding test file using these conventions:

- `src/X.cs` → `tests/XTests.cs`, `tests/X.Tests.cs`
- `src/services/x.ts` → `src/services/__tests__/x.test.ts`, `src/services/x.spec.ts`
- `src/components/Foo.tsx` → `src/components/Foo.test.tsx`, `__tests__/Foo.test.tsx`

Mark coverage_status as `covered` (match found), `partial` (test file exists but doesn't cover all public methods), or `missing` (no test file).

Write `test_map.json`.

**Step 9: Write `_index.json`**

Populate stats: count total files, symbols, endpoints, domain list.
Set `last_full_build` to current UTC timestamp (run `Get-Date -AsUTC -Format 'yyyy-MM-ddTHH:mm:ssZ'`).

---

### Mode: `incremental` — Update changed files only

**Use when:** Called by Coder after implementation. Only re-indexes `files_modified`.

**Step 1:** Read current `_index.json` to verify the index exists. If missing → fall back to `full` mode.

**Step 2:** For each file in `files_modified`:
- Re-classify the file's layer and domain (it may have moved or been renamed)
- Re-extract its symbols (classes, methods, endpoints)
- Re-compute its dependency edges
- If it's an endpoint file, re-scan its routes

**Step 3:** Patch the four JSON files in place:
- `structure.json`: update the file's entry in `layers` and `domains`
- `symbols.json`: replace all entries keyed to this file
- `dependency_graph.json`: replace the file's node; update `depended_by` on its dependencies
- `api_index.json`: remove old endpoints for this file; add new ones
- `test_map.json`: update the mapping for this file

**Step 4:** Update `_index.json.last_incremental` and `stats`.

---

### Mode: `query` — Answer navigation questions

**Use when:** An agent needs to find a specific file, class, or endpoint without rebuilding.

**Step 1:** Read `_index.json` to confirm index exists. If stale (>7 days) → warn and suggest `full` rebuild.

**Step 2:** Load `symbols.json`, `structure.json`, `api_index.json` in parallel.

**Step 3:** Match `query` string against:
- Symbol names (exact and fuzzy prefix match)
- File paths (substring match)
- Endpoint paths (substring match)
- Domain names

**Step 4:** Return structured answer:

```markdown
### 🗺️ Codemap Query: "{query}"

**Matches found:**

| Type     | Name       | File             | Layer       | Domain |
| -------- | ---------- | ---------------- | ----------- | ------ |
| Class    | AuthService | src/.../Auth.cs | application | auth   |
| Endpoint | POST /api/auth/login | AuthController.Login | api | auth |

**Direct dependencies of AuthService:**
- IUserRepository (infrastructure/auth)
- ITokenService (application/auth)

**Depended on by:**
- AuthController (api/auth)
```

---

## 🔄 Integration with Agents

### Called by Coder (after Step 7 — Validate)

Coder calls immediately after build validation passes, before Update_Docs:

```
mode: incremental
files_modified: {{files_modified}}
caller_agent: Coder
```

Coder adds to its Delivery Format:
```
🗺️ Codemap: updated (N files indexed)
```

### Called by Orchestrator (Phase 0 — Pre-flight, query mode)

Before delegating to Bsa/Coder, Orchestrator runs a query to understand the impact area:

```
mode: query
query: "{{feature_domain_keyword}}"
caller_agent: Orchestrator
```

### Called by Reviewer (before Pattern Discovery)

Reviewer uses query mode to quickly locate all files in the review scope:

```
mode: query
query: "{{files_modified domain keywords}}"
caller_agent: Reviewer
```

### Called via `/codemap` slash command

- No arguments or `full` → full rebuild
- `incremental` → reads `git diff HEAD --name-only` as `files_modified`
- `query <term>` → direct query mode

---

## ⚡ Performance Budget

| Mode          | Max token spend | Expected wall time |
| ------------- | --------------- | ------------------ |
| `full`        | ~8K tokens      | First run only     |
| `incremental` | ~1K tokens      | After every Coder session |
| `query`       | ~500 tokens     | On-demand by any agent |

Full rebuild should be triggered only on first run or when the `_index.json.last_full_build` is older than 7 days or when the tech stack changes.

---

## 📈 Delivery Format

### Full / Incremental

```markdown
✅ Codemap Updated

🗂️ Mode: full | incremental
📁 Files Indexed: [N]
🔣 Symbols Extracted: [N classes, N functions, N components]
🔌 Endpoints Indexed: [N]
🧪 Test Coverage Map: [N covered, N partial, N missing]
🌐 Domains: [domain1, domain2, ...]

📄 Artefacts:
- .dev-agents/memory-bank/00-shared/codemap/_index.json ✅
- .dev-agents/memory-bank/00-shared/codemap/structure.json ✅
- .dev-agents/memory-bank/00-shared/codemap/symbols.json ✅
- .dev-agents/memory-bank/00-shared/codemap/dependency_graph.json ✅
- .dev-agents/memory-bank/00-shared/codemap/api_index.json ✅
- .dev-agents/memory-bank/00-shared/codemap/test_map.json ✅
```

### Query

Direct table answer — see query step output format above.

---

**END OF SKILL DEFINITION**
