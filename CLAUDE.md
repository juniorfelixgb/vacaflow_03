# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**VacaFlow_03** is an absence request management MVP for IGS Solutions. It demonstrates an Employee-to-Manager absence request workflow: Employees create and submit leave requests, Managers review and approve/reject them. The project implements the complete business logic specified in `documentation/` to validate architectural fitness against a Reduced Onion Architecture.

This repository contains:
- Comprehensive specification and architecture documents in `documentation/`
- A clickable UI prototype in `guidelines/VacaFlow.dc.html` (reference design, not production code)
- Guidelines for recreating the UI in the target stack

**Current Status**: MVP specification phase — no production code committed yet. Future work will implement the backend (ASP.NET Core API) and frontend (Next.js SPA) following the patterns documented here.

---

## Technology Stack

| Layer | Tech | Version | Port |
|-------|------|---------|------|
| Frontend | Next.js + React + TypeScript | 14/18/5 | 3000 |
| Backend API | ASP.NET Core Minimal API | .NET 8 | 5000 |
| Database | SQLite (file-based, auto-provisioned) | 3.x | (in-process) |
| ORM | Entity Framework Core | 8.x | — |
| Auth | ASP.NET Core Cookies (HttpOnly, SameSite=Strict) | Built-in | — |
| Password Hashing | BCrypt.Net-Next | 4.x | — |

---

## Architecture Pattern

VacaFlow_03 uses a **Reduced Onion Architecture** (five layers, strict inward-only dependencies):

```
vacaflow-web (Next.js SPA — browser)
    ↓ fetch + credentials: include
VacaFlow.Api (ASP.NET Core 8 Minimal API)
    ↓ DI / method calls
VacaFlow.Application (Use case services, zero framework dependencies)
    ↓ Via interfaces
VacaFlow.Infrastructure (EF Core, repositories, transaction service)
    ↓ ADO.NET
VacaFlow.Domain (Entities, state machine, domain exceptions — BCrypt only)
    ↓
vacaflow.db (SQLite file)
```

**Key Constraint**: The Application layer must have ZERO ASP.NET Core or Entity Framework dependencies — verify this by checking `using` directives. This is a mandatory architectural boundary.

---

## Development Commands

### Backend (ASP.NET Core API)

```bash
# Navigate to API directory
cd VacaFlow.Api

# Run the API (watch mode, auto-rebuild on file changes)
dotnet watch run
# Listens on http://localhost:5000
# Swagger UI available at http://localhost:5000/swagger

# Run unit tests (if test projects exist)
dotnet test

# Apply migrations (if needed)
dotnet ef database update

# Create a migration
dotnet ef migrations add [MigrationName]
```

### Frontend (Next.js SPA)

```bash
# Navigate to frontend directory
cd vacaflow-web

# Install dependencies (first time)
npm install

# Run dev server (watch mode)
npm run dev
# Listens on http://localhost:3000

# Build for production
npm run build

# Start production build
npm run start

# Run linting
npm run lint

# Run tests (if test suite exists)
npm test
```

### Both Together

Open two terminal tabs/windows:

1. **Terminal 1 (API)**:
   ```bash
   cd VacaFlow.Api
   dotnet watch run
   ```

2. **Terminal 2 (Frontend)**:
   ```bash
   cd vacaflow-web
   npm run dev
   ```

Then navigate to http://localhost:3000 in your browser.

---

## Key Development Constraints

These are **mandatory** — do not work around them:

1. **No Docker, no external services** — Everything runs locally from source.
2. **No MediatR, CQRS, generic repositories, or messaging frameworks** — Explicitly excluded. Keep the implementation simple.
3. **Application layer isolation** — No ASP.NET Core or Entity Framework imports in `VacaFlow.Application/`.
4. **Cookie-based auth only** — No JWT in sessionStorage. Server-side authentication via secure cookies.
5. **Business rules enforced server-side** — Never trust the client for state transitions or authorization decisions.
6. **Self-approval guard** — A user cannot approve their own request (BR-ROLE-003).
7. **Session identity enforcement** — Employee ID and approver ID come from the authenticated session, never from the request body (BR-IDEN-001, BR-IDEN-002).

---

## Project Structure

```
VacaFlow_03/
├── documentation/          # All specification documents (see below)
├── guidelines/             # UI prototype and design reference
│   ├── VacaFlow.dc.html    # Clickable prototype (start here for UI reference)
│   ├── README.md           # Detailed UI handoff document
│   └── screenshots/        # Reference screenshots of all 5 screens
├── VacaFlow.Domain/        # Domain entities, state machine, domain exceptions
├── VacaFlow.Application/   # Use case services, interface declarations
├── VacaFlow.Infrastructure/# EF Core context, repositories, transaction service
├── VacaFlow.Api/           # ASP.NET Core Minimal API, middleware, DI
├── vacaflow-web/           # Next.js SPA (frontend)
├── CLAUDE.md               # This file
└── .claude/                # Claude Code settings (project-scoped)
```

### Key Documentation Files

Read these in order when onboarding:

1. **[guidelines/README.md](guidelines/README.md)** — UI design, screens, interactions, design tokens, business rules the UI enforces.
2. **[documentation/software-architecture-document.md](documentation/software-architecture-document.md)** — Why the Reduced Onion Architecture was chosen, the five layers, and architectural decision records (ADRs).
3. **[documentation/tech-doc.md](documentation/tech-doc.md)** — Complete technical setup, runtime dependencies, ports, communication flow.
4. **[documentation/code-standards.md](documentation/code-standards.md)** — Naming conventions, file organization, Onion boundary rules, testing standards.
5. **[documentation/business-rules.md](documentation/business-rules.md)** — All business rules (e.g., date validation, state transitions, approval guards).
6. **[documentation/functional-spec.md](documentation/functional-spec.md)** — User workflows and requirements.

---

## Database & Migrations

SQLite database is auto-provisioned on first run:

1. EF Core will create `VacaFlow.Api/Data/vacaflow.db` automatically using `EnsureCreated` or migrations.
2. Seeded data (demo employees, managers, sample requests) is inserted on first run.
3. To reset the database, delete `VacaFlow.Api/Data/vacaflow.db` and restart the API.
4. Database file is gitignored; do not commit it.

---

## Authentication & Sessions

- **Flow**: Login form submits email + password → API validates against hashed password in database → Server issues `HttpOnly` cookie (SameSite=Strict) → Client includes cookie with every request.
- **Server-side verification**: Every protected endpoint reads the authenticated user from the cookie claim, never from request body.
- **Current user context**: Injected via `ICurrentUserContext` interface (implemented in Infrastructure layer).
- **No token in storage**: Frontend JavaScript never has access to credentials.

---

## Business Rules (Enforcement Points)

All of these **must** be enforced server-side in the API:

| Rule | Category | Enforcement |
|------|----------|-------------|
| Draft requests are editable only | Lifecycle | API checks RequestStatus == Draft before allowing edits |
| End date ≥ start date; start date ≥ today | Date Validation | Domain layer `RequestStateMachine` validation |
| Only Submitted requests can be approved/rejected | Lifecycle | API checks RequestStatus == Submitted |
| Approved/Rejected/Cancelled are terminal | Lifecycle | State machine prevents invalid transitions |
| No self-approval | Authorization | `SelfApprovalGuard` in Domain layer + API middleware |
| Identity from session only | Authorization | `ICurrentUserContext` reads cookie, never request body |

---

## UI Reference

Start with the prototype: Open `guidelines/VacaFlow.dc.html` in a browser to see the clickable prototype with all 5 screens:

1. **Login** — Email + password, error banner for invalid credentials.
2. **Register** — Self-service employee signup only (role is fixed, not selectable).
3. **Employee Request List** — View own requests, create/edit/submit/cancel.
4. **Request Form** — Create or edit a draft request (date validation, textarea for reason).
5. **Manager Review Queue** — Review submitted requests, approve/reject with optional comment.

The prototype has seeded demo accounts for testing the workflow. See `guidelines/README.md` for full design specs, colors, spacing, and business rule details.

---

## State Machine Reference

The `RequestStateMachine` (Domain layer) models the absence request lifecycle:

```
Draft
  ├─→ Submitted (via "submit" action)
  └─→ Cancelled (via "cancel" action)

Submitted
  ├─→ Approved (via Manager approval)
  ├─→ Rejected (via Manager rejection)
  └─→ Cancelled (via employee or manager cancel)

Approved (terminal)
Rejected (terminal)
Cancelled (terminal)
```

Only Draft requests are editable. Only Submitted requests can be approved/rejected. Terminal states prevent further transitions.

---

## Testing Strategy

- **Unit tests** (Application layer): Use in-memory fakes of `ICurrentUserContext` and `ITransactionService` — no database required.
- **Integration tests**: Exercise the full workflow (register → create → submit → approve) against an in-memory SQLite database.
- **UI testing**: Manual end-to-end validation through the frontend per the smoke test checklist in `documentation/deployment-runbook.md`.

---

## Common Tasks

### Add a new API endpoint

1. Add the business logic method to an Application service (e.g., `ApprovalService`).
2. Call the service from a new minimal API handler in `VacaFlow.Api/Program.cs`.
3. Apply authentication/authorization middleware attributes as needed.
4. Test the endpoint with an HTTP client (curl, Postman, browser fetch).

### Modify the database schema

1. Update the Entity Framework model in `VacaFlow.Infrastructure/VacaFlowDbContext.cs`.
2. Create a migration: `dotnet ef migrations add [MigrationName]`.
3. Apply the migration: `dotnet ef database update`.
4. If resetting: delete `vacaflow.db` and restart the API.

### Fix a business rule violation

1. **Identify the rule** in `documentation/business-rules.md`.
2. **Add domain validation** in the Domain layer (e.g., `RequestStateMachine.CanApprove()`).
3. **Add API guard** in the Infrastructure/Application layer (e.g., middleware or service method check).
4. **Add UI feedback** in the Next.js component (disable buttons, show error banners).
5. **Add a test** in the test project.

### Debug state transitions

Enable logging in `VacaFlow.Api/Program.cs` to see domain state machine transitions. Check the database directly with a SQLite client to verify persisted state.

---

## Debugging Tips

1. **Ports in use**: If port 3000 or 5000 is in use, kill the process or change the port in configuration.
2. **CORS issues**: Frontend fetch calls must include `credentials: 'include'` to send cookies across origins.
3. **Database locked**: If SQLite complains about a locked database, ensure no other processes have the file open. Restart the API.
4. **Migrations fail**: Check that EF Core CLI is up to date: `dotnet tool update -g dotnet-ef`.
5. **Authentication loops**: Verify the cookie is being set (check browser DevTools → Application → Cookies) and that middleware order is correct (auth before authorization).

---

## Performance Considerations

For the local MVP:

- SQLite is sufficient; no optimization required.
- Next.js dev server is acceptable; production build tested separately.
- No caching layer needed unless load testing shows bottlenecks.
- API response times should be < 100ms for typical operations.

---

## Security Checklist

- [ ] No hardcoded credentials in code.
- [ ] Cookies are HttpOnly and SameSite=Strict.
- [ ] User identity read from `ICurrentUserContext` (authenticated session), never from request body.
- [ ] All state transitions validated in the Domain layer.
- [ ] SQL injection prevented via Entity Framework parameterized queries.
- [ ] No sensitive data in URLs or query strings.
- [ ] Password hashing via BCrypt (never plaintext comparison).
- [ ] Self-approval prevented at Domain and API layers.

---

## When Things Go Wrong

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `Cannot open database file` | Permission or path issue | Check the path in `appsettings.Development.json`; ensure directory exists |
| API crashes on startup | Missing EF Core CLI | `dotnet tool install -g dotnet-ef` |
| Frontend can't reach API | CORS or port mismatch | Check `localhost:5000` is running; verify `fetch` includes `credentials: 'include'` |
| State transition failing | Business rule violation | Check the Domain layer guard; add logging to see which rule failed |
| Database out of sync | Stale migration | Delete `vacaflow.db`, restart API |

---

## Reference Links in This Repo

- **UI Design**: [guidelines/README.md](guidelines/README.md)
- **Architecture**: [documentation/software-architecture-document.md](documentation/software-architecture-document.md)
- **Business Rules**: [documentation/business-rules.md](documentation/business-rules.md)
- **Setup & Config**: [documentation/env-config.md](documentation/env-config.md)
- **Code Standards**: [documentation/code-standards.md](documentation/code-standards.md)
- **Deployment**: [documentation/deployment-runbook.md](documentation/deployment-runbook.md)

---

## Future Phases (Out of Scope for MVP)

Phase 2 and Phase 3 are deferred:

- **Phase 2**: Add resilience patterns, integration tests, hardened transaction handling.
- **Phase 3**: Multi-machine deployment, distributed identity provider (Azure AD/Entra), production database (PostgreSQL/SQL Server), Docker containerization, CI/CD pipeline.

Do not implement Phase 2/3 features during MVP delivery. Keep the codebase focused and simple.

