# Technical Documentation: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Draft — Awaiting Approval
**Project:** VacaFlow_03 — IGS Solutions
**References:** SAD-001 (Software Architecture Document), AO-001 (Architecture Overview), AE-001 (Architecture Evaluation), NFR-001 (Non-Functional Requirements Specification)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version |

---

## 1. Introduction

### 1.1 Purpose

This document provides comprehensive technical guidance for developers working on VacaFlow_03, an absence request management system built for IGS Solutions. It covers environment setup, project structure, architectural patterns, coding conventions, and troubleshooting procedures. The document is intended to enable any qualified developer to clone the repository and run the full application from source within 15 minutes.

### 1.2 Audience

- Backend developers (ASP.NET Core / C#)
- Frontend developers (Next.js / TypeScript)
- New team members onboarding to VacaFlow_03
- Technical reviewers evaluating architectural compliance
- Technical support staff maintaining the application

### 1.3 Scope

This document covers the local MVP delivery scope of VacaFlow_03 (Phase 1). It does not cover cloud deployment, CI/CD pipelines, Docker containerisation, or external integrations — all of which are explicitly deferred to future phases per the Architecture Decision Records (SAD-001, ADR-001 through ADR-005).

### 1.4 Prerequisites

- Familiarity with C# and .NET 8 development
- Familiarity with React and TypeScript
- Working knowledge of REST APIs and HTTP cookie-based authentication
- Access to the VacaFlow_03 source code repository
- A code editor or IDE of choice (VS Code recommended)

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

VacaFlow_03 follows a **Reduced Onion Architecture** with five named layers. Dependencies flow strictly inward: outer layers depend on inner layers; inner layers have no knowledge of outer layers.

```
┌──────────────────────────────────────────────────────────────────────┐
│  vacaflow-web  (Next.js 14 / React 18 / TypeScript)                 │
│  Browser SPA — state-driven UI, fetch with credentials: include     │
├──────────────────────────────────────────────────────────────────────┤
│  VacaFlow.Api  (ASP.NET Core 8 Minimal API)                         │
│  HTTP host — middleware pipeline, DI registration, cookie auth      │
├──────────────────────────────────────────────────────────────────────┤
│  VacaFlow.Infrastructure  (EF Core 8 / Microsoft.Data.Sqlite)       │
│  Repositories, EfCoreTransactionService, HttpContextCurrentUserCtx  │
├──────────────────────────────────────────────────────────────────────┤
│  VacaFlow.Application  (Pure C# — zero framework dependencies)      │
│  Use case services, interface declarations (ICurrentUserContext,    │
│  ITransactionService, repository interfaces)                        │
├──────────────────────────────────────────────────────────────────────┤
│  VacaFlow.Domain  (Pure C# — BCrypt.Net-Next only)                  │
│  AbsenceRequest aggregate, RequestStateMachine, SelfApprovalGuard,  │
│  Employee entity, domain exceptions                                 │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  vacaflow.db    │
                    │  (SQLite 3)     │
                    │  Auto-created   │
                    └─────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | Next.js | 14.x | React-based SPA with server-side rendering capability |
| Frontend UI | React | 18.x | Component model and state management |
| Frontend Language | TypeScript | 5.x | Type-safe JavaScript for the web layer |
| API Framework | ASP.NET Core Minimal API | .NET 8 | Lightweight HTTP host with built-in cookie auth |
| Backend Language | C# | 12 | Application, Domain, Infrastructure, and API layers |
| ORM | Entity Framework Core | 8.x | Code-First migrations, repository pattern |
| Database | SQLite | 3.x | Zero-configuration, file-based, auto-provisioned |
| Auth | ASP.NET Core Cookie Authentication | Built-in (.NET 8) | HttpOnly, SameSite=Strict, no external key management |
| Password Hashing | BCrypt.Net-Next | 4.x | Adaptive hashing in the Domain layer |
| Frontend Runtime | Node.js | 20.x | Next.js development server |

### 2.3 Key Components

| Component | Description | Project / Location |
|-----------|-------------|-------------------|
| VacaFlow.Domain | Business entities, state machine, domain guards | `VacaFlow.Domain/` |
| VacaFlow.Application | Use case services, interface declarations | `VacaFlow.Application/` |
| VacaFlow.Infrastructure | EF Core context, repository implementations, seeders | `VacaFlow.Infrastructure/` |
| VacaFlow.Api | Minimal API host, middleware, DI wiring | `VacaFlow.Api/` |
| vacaflow-web | Next.js SPA, request list, approval queue, forms | `vacaflow-web/` |
| vacaflow.db | Auto-provisioned SQLite database file | Repository root (gitignored) |

### 2.4 Communication Flow

```
Browser
  │
  │  HTTP (localhost:3000)
  ▼
vacaflow-web  (Next.js dev server)
  │
  │  HTTP fetch + credentials: 'include' (localhost:5000)
  ▼
VacaFlow.Api  (ASP.NET Core Minimal API)
  │
  ├── ExceptionHandlingMiddleware (outermost)
  ├── CookieAuthenticationMiddleware
  ├── RoleAuthorizationMiddleware
  │
  │  In-process DI / method calls
  ▼
VacaFlow.Application  (Use Case Services)
  │
  ├── Reads domain entities and calls state machine
  │
  │  Via injected interfaces (resolved from VacaFlow.Infrastructure)
  ▼
VacaFlow.Infrastructure  (EF Core repositories + services)
  │
  │  ADO.NET / Microsoft.Data.Sqlite
  ▼
vacaflow.db  (SQLite 3 file)
```

---

## 3. Technical Constraints

> **Source:** Extracted from `software-architecture-document` (SAD-001, Technical Constraints sections and ADR-001 through ADR-005) and `architecture-overview` (AO-001, architectural principles and design decisions). These constraints are mandatory and must guide all implementation decisions without exception.

### 3.1 Technical Constraints (from Software Architecture Document — SAD-001)

| Constraint | Category | Impact on Implementation |
|------------|----------|--------------------------|
| No Docker, no external services, no cloud accounts for MVP | Deployment | All services must run from source; no container orchestration scripts may be added |
| SQLite does not support nested transactions | Database | `EfCoreTransactionService` must detect and throw a descriptive `InvalidOperationException` if `ExecuteInTransactionAsync` is called within an active EF Core transaction scope |
| No MediatR, CQRS, generic repositories, or unit-of-work | Architecture | Use case orchestration must be direct service-to-repository calls; no mediator bus, command/query objects, or generic `IRepository<T>` interfaces |
| `vacaflow.db` must not be committed to source control | Security | The `.gitignore` must exclude `*.db` and `*.db-journal`; a startup warning must log if the file exists outside the expected path |
| Cookie `HttpOnly; SameSite=Strict` is mandatory | Security | JavaScript must never have access to the session credential; `document.cookie` access to the auth cookie is architecturally prohibited |
| Application layer must carry zero EF Core or ASP.NET Core `PackageReference` entries | Maintainability | `VacaFlow.Application.csproj` may only reference `VacaFlow.Domain` and standard .NET 8 framework libraries; build will fail if violated |
| Reviewer setup must complete in ≤ 15 minutes on a fresh clone | Usability | No environment variable secrets, no signing keys, and no manual database creation steps may be required |
| CORS `AllowCredentials` requires an explicit, non-wildcard origin | Security / CORS | The CORS policy must specify `http://localhost:3000` explicitly; wildcard origins with `AllowCredentials` are rejected by browsers |

### 3.2 Architectural Constraints (from Architecture Overview — AO-001)

| Constraint | Origin | Implication |
|------------|--------|-------------|
| Reduced Onion Architecture — exactly five named layers (Domain, Application, Infrastructure, Api, Web) | NFR-MAINT-001 / AO-001 | No new layers, no cross-layer bypass. Each layer's project references must be reviewed before adding any dependency |
| Dependencies flow inward only | NFR-MAINT-002 / AO-001 | Domain and Application must never reference Infrastructure or Api projects; violations must be caught at build time via project reference audit |
| Application layer interfaces must use only `System.*` types in their signatures | ADR-005 / AO-001 | `ICurrentUserContext`, `ITransactionService`, and all repository interfaces must expose no EF Core, ASP.NET Core, or third-party types in method parameters or return types |
| Approver identity is derived server-side from the validated cookie claim — never from the request body | ADR-002 / AO-001 | No endpoint may accept an `approverId` field in the JSON body for approval or rejection operations |
| The `RequestStateMachine` is the single authority for all state transitions | AO-001 / Domain design | No code outside `VacaFlow.Domain` may directly set `AbsenceRequest.Status`; all transitions must go through `request.Submit()`, `request.Approve()`, `request.Reject()`, or `request.Cancel()` |
| Atomic approval writes must be explicitly bounded via `ITransactionService` | ADR-003 / NFR-REL-002 | The `ApprovalService.ApproveAsync` and `RejectAsync` methods must wrap all persistence calls inside `ITransactionService.ExecuteInTransactionAsync` |

### 3.3 Implementation Guidelines Derived from Constraints

Based on the constraints above, all developers MUST:

- Verify that `VacaFlow.Application.csproj` contains no `<PackageReference>` entries to `Microsoft.AspNetCore.*` or `Microsoft.EntityFrameworkCore.*` before opening a pull request
- Ensure that any new endpoint performing identity-sensitive operations reads caller identity exclusively from `ICurrentUserContext.CurrentUserId`, never from request body parameters
- Run `grep -r "using Microsoft" VacaFlow.Application/` and confirm zero results before every merge to main
- Implement all new repository operations as concrete classes in `VacaFlow.Infrastructure` that implement pure interfaces declared in `VacaFlow.Application`
- Route all `AbsenceRequest` state transitions through the domain entity's methods — direct status property assignment is forbidden
- Wrap any operation requiring atomic multi-table persistence in `ITransactionService.ExecuteInTransactionAsync` rather than relying on implicit EF Core `SaveChanges` batching
- Add `*.db` and `*.db-journal` to `.gitignore` immediately if a new database file path is introduced

> **Note:** Any deviation from these constraints requires written approval from the Solution Architect and must be documented as an Architecture Decision Record (ADR) appended to the Software Architecture Document (SAD-001).

---

## 4. Development Environment Setup

### 4.1 Prerequisites

| Tool | Minimum Version | Purpose | Download |
|------|-----------------|---------|----------|
| .NET SDK | 8.0 | Build and run the ASP.NET Core API and all C# class libraries | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| Node.js | 20.x LTS | Run the Next.js development server | [nodejs.org](https://nodejs.org) |
| npm | 10.x (bundled with Node 20) | Install JavaScript dependencies | Included with Node.js |
| Git | 2.x | Clone the repository | [git-scm.com](https://git-scm.com) |
| IDE / Code Editor | Any | VS Code recommended for polyglot workspace | [code.visualstudio.com](https://code.visualstudio.com) |

No Docker, no containerisation tooling, and no external database server are required. The application is designed to run entirely from source.

**Recommended VS Code Extensions:**

| Extension | Purpose |
|-----------|---------|
| C# Dev Kit | C# IntelliSense, debugging, project management |
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting for the web layer |
| SQLite Viewer | Inspect `vacaflow.db` without external tooling |

### 4.2 Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd VacaFlow_03

# Verify .NET SDK version
dotnet --version
# Expected: 8.x.x

# Verify Node.js version
node --version
# Expected: v20.x.x
```

### 4.3 Backend Setup (VacaFlow.Api)

```bash
# Navigate to the solution root
cd VacaFlow_03

# Restore all NuGet packages for the solution
dotnet restore

# Build the entire solution to verify no compilation errors
dotnet build

# Run the API (from the solution root or from the Api project folder)
dotnet run --project VacaFlow.Api
```

On the first run, the API will:

1. Create `vacaflow.db` automatically in the configured path (via `EnsureCreated` or pending EF Core migrations)
2. Apply the `AbsenceTypeSeeder` to populate reference data (absence type categories)
3. Apply the `ManagerAccountSeeder` to provision at least one manager account

The API will be available at `http://localhost:5000` by default.

### 4.4 Frontend Setup (vacaflow-web)

```bash
# In a separate terminal, navigate to the web project
cd VacaFlow_03/vacaflow-web

# Install Node.js dependencies
npm install

# Start the Next.js development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 4.5 Environment Variables

**Backend (`VacaFlow.Api/appsettings.Development.json`):**

The API uses ASP.NET Core's built-in configuration system. No manual secret generation is required for MVP. The defaults in `appsettings.Development.json` are sufficient for local operation.

| Configuration Key | Description | Default Value |
|-------------------|-------------|---------------|
| `ConnectionStrings:VacaFlow` | SQLite database file path | `Data Source=vacaflow.db` |
| `CookieAuth:SlidingExpiration` | Session sliding expiration in minutes | `120` |
| `CookieAuth:SecurePolicy` | Secure cookie flag (`Always` / `SameAsRequest`) | `SameAsRequest` (HTTP allowed in development) |
| `Cors:AllowedOrigin` | Frontend origin for CORS | `http://localhost:3000` |
| `Logging:LogLevel:Default` | Log verbosity | `Information` |

> **Security note:** The cookie encryption key is derived automatically by ASP.NET Core's Data Protection API from the machine key ring. No manual key generation is required. In production, the Data Protection key ring must be persisted to a durable store (deferred to Phase 3 per ADR-001).

**Frontend (`vacaflow-web/.env.local`):**

```bash
# Copy the environment template
cp vacaflow-web/.env.local.example vacaflow-web/.env.local
```

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for all API calls | `http://localhost:5000` |

### 4.6 Verifying the Setup

After both processes are running:

1. Open `http://localhost:3000` in a browser
2. Navigate to the registration page and create an employee account
3. Log in with the seeded manager account credentials (see seed data documentation in `VacaFlow.Infrastructure/Seeders/README.md`)
4. Verify that the request list loads and that role-based action buttons render correctly

You can also verify the API directly:

```bash
# Health check endpoint
curl http://localhost:5000/health
# Expected: 200 OK

# Unauthenticated request to protected endpoint
curl http://localhost:5000/api/requests
# Expected: 401 Unauthorized
```

### 4.7 Resetting the Database

Because the database is a local file, a full reset requires only deleting and recreating it:

```bash
# Stop the API process first
# Then delete the database file
rm vacaflow.db

# Restart the API — the database will be recreated and reseeded automatically
dotnet run --project VacaFlow.Api
```

> **Caution:** Deleting `vacaflow.db` is irreversible. All data including registered users and absence requests will be lost.

---

## 5. Project Structure

### 5.1 Solution Structure

```
VacaFlow_03/
├── VacaFlow.Domain/                    # Innermost Onion layer — pure business logic
│   ├── Entities/
│   │   ├── AbsenceRequest.cs           # Aggregate root with lifecycle methods
│   │   ├── Employee.cs                 # User entity with factory method
│   │   └── AbsenceType.cs             # Reference entity
│   ├── ValueObjects/
│   │   ├── UserRole.cs                 # Enum: Employee, Manager
│   │   └── ApprovalRecord.cs          # Immutable approval/rejection record
│   ├── StateMachine/
│   │   └── RequestStateMachine.cs     # Transition guard table
│   ├── Guards/
│   │   └── SelfApprovalGuard.cs       # Throws DomainException if approverId == requestorId
│   ├── Exceptions/
│   │   └── DomainException.cs         # Base domain exception
│   └── VacaFlow.Domain.csproj         # References: BCrypt.Net-Next only
│
├── VacaFlow.Application/               # Use case orchestration — zero framework deps
│   ├── Services/
│   │   ├── AuthService.cs             # IAuthService implementation
│   │   ├── RequestService.cs          # IRequestService implementation
│   │   └── ApprovalService.cs         # IApprovalService — uses ITransactionService
│   ├── Interfaces/
│   │   ├── IAuthService.cs
│   │   ├── IRequestService.cs
│   │   ├── IApprovalService.cs
│   │   ├── ICurrentUserContext.cs     # Pure interface: CurrentUserId, CurrentUserRole
│   │   ├── ITransactionService.cs     # Pure interface: ExecuteInTransactionAsync(Func<Task>)
│   │   ├── IUserRepository.cs
│   │   ├── IRequestRepository.cs
│   │   ├── IApprovalRepository.cs
│   │   └── IAbsenceTypeRepository.cs
│   └── VacaFlow.Application.csproj    # References: VacaFlow.Domain only — NO framework packages
│
├── VacaFlow.Infrastructure/            # Concrete implementations of Application interfaces
│   ├── Persistence/
│   │   ├── VacaFlowDbContext.cs       # EF Core context with all entity configurations
│   │   ├── Migrations/                # EF Core migration files
│   │   └── Repositories/
│   │       ├── EfCoreUserRepository.cs
│   │       ├── EfCoreRequestRepository.cs
│   │       ├── EfCoreApprovalRepository.cs
│   │       └── EfCoreAbsenceTypeRepository.cs
│   ├── Services/
│   │   ├── EfCoreTransactionService.cs    # Implements ITransactionService
│   │   └── HttpContextCurrentUserContext.cs  # Implements ICurrentUserContext
│   ├── Seeders/
│   │   ├── AbsenceTypeSeeder.cs
│   │   ├── ManagerAccountSeeder.cs
│   │   └── README.md                  # Seeded account credentials for local dev
│   ├── Extensions/
│   │   └── InfrastructureServiceExtensions.cs  # AddInfrastructure() DI extension
│   └── VacaFlow.Infrastructure.csproj # References: Application, Domain, EF Core, Sqlite
│
├── VacaFlow.Api/                       # ASP.NET Core Minimal API host
│   ├── Endpoints/
│   │   ├── AuthEndpoints.cs           # POST /auth/register, POST /auth/login
│   │   ├── RequestEndpoints.cs        # GET/POST/PUT/DELETE /requests
│   │   └── ApprovalEndpoints.cs       # POST /requests/{id}/approve|reject
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs  # Translates domain exceptions to HTTP errors
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Program.cs                     # Middleware pipeline + DI + endpoint mapping
│   └── VacaFlow.Api.csproj            # References: Application, Infrastructure, Domain
│
├── vacaflow-web/                       # Next.js 14 frontend
│   ├── src/
│   │   ├── app/                       # Next.js App Router pages
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── requests/page.tsx      # Employee request list
│   │   │   ├── requests/new/page.tsx  # Create request form
│   │   │   └── manager/page.tsx       # Manager approval queue
│   │   ├── components/
│   │   │   ├── RequestCard.tsx        # State-driven action button rendering
│   │   │   ├── RequestForm.tsx
│   │   │   └── ApprovalQueue.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                 # fetch wrapper with credentials: 'include'
│   │   │   └── useCurrentUser.ts      # Hook: GET /api/me on mount
│   │   └── types/
│   │       └── index.ts               # Shared TypeScript interfaces
│   ├── .env.local.example
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── VacaFlow.sln                        # .NET solution file
├── .gitignore                          # Must include: *.db, *.db-journal, .env.local
└── README.md                           # Quick-start guide
```

### 5.2 Key Files Reference

| File | Purpose |
|------|---------|
| `VacaFlow.Api/Program.cs` | Application host: middleware pipeline, DI registration, endpoint mapping |
| `VacaFlow.Infrastructure/Extensions/InfrastructureServiceExtensions.cs` | Single `AddInfrastructure()` call binding all six interface implementations |
| `VacaFlow.Infrastructure/Persistence/VacaFlowDbContext.cs` | EF Core context: entity configurations, seeding hooks |
| `VacaFlow.Domain/StateMachine/RequestStateMachine.cs` | Single authority for all AbsenceRequest state transitions |
| `VacaFlow.Application/Interfaces/ICurrentUserContext.cs` | Contract for reading caller identity — no ASP.NET Core types |
| `VacaFlow.Application/Interfaces/ITransactionService.cs` | Contract for explicit transaction wrapping |
| `VacaFlow.Application/Services/ApprovalService.cs` | Demonstrates correct usage of ICurrentUserContext + ITransactionService |
| `vacaflow-web/src/lib/api.ts` | All frontend HTTP calls go through this module with `credentials: 'include'` |
| `.gitignore` | Must include `*.db` and `*.db-journal` |

---

## 6. Development Guide

### 6.1 Onion Architecture — Layer Dependency Rules

Before writing any code, understand the layer dependency rules. Violations cause build errors:

```
VacaFlow.Domain        → no project references (innermost)
VacaFlow.Application   → VacaFlow.Domain only
VacaFlow.Infrastructure → VacaFlow.Application + VacaFlow.Domain + NuGet (EF Core, Sqlite)
VacaFlow.Api           → VacaFlow.Infrastructure + VacaFlow.Application + VacaFlow.Domain
vacaflow-web           → no .NET project references (separate runtime)
```

**Verification command (run before every PR):**

```bash
grep -r "using Microsoft" VacaFlow.Application/
# Expected: zero output
```

### 6.2 Adding a New Use Case

Follow these steps to add a new use case that respects the Onion boundary:

**Step 1 — Define the interface in VacaFlow.Application:**

```csharp
// VacaFlow.Application/Interfaces/IMyNewService.cs
namespace VacaFlow.Application.Interfaces;

public interface IMyNewService
{
    Task<MyResult> DoSomethingAsync(Guid requestId, CancellationToken cancellationToken = default);
}
```

**Step 2 — Implement the service in VacaFlow.Application:**

```csharp
// VacaFlow.Application/Services/MyNewService.cs
namespace VacaFlow.Application.Services;

public sealed class MyNewService : IMyNewService
{
    private readonly IRequestRepository _requests;
    private readonly ICurrentUserContext _currentUser;

    public MyNewService(IRequestRepository requests, ICurrentUserContext currentUser)
    {
        _requests = requests;
        _currentUser = currentUser;
    }

    public async Task<MyResult> DoSomethingAsync(Guid requestId, CancellationToken cancellationToken = default)
    {
        var request = await _requests.GetByIdAsync(requestId, cancellationToken)
            ?? throw new DomainException($"Request {requestId} not found.");

        // Business logic using domain methods only
        // Do NOT call EF Core or HttpContext here
        return new MyResult(request.Id, request.Status);
    }
}
```

**Step 3 — Register in VacaFlow.Infrastructure (DI extension):**

```csharp
// VacaFlow.Infrastructure/Extensions/InfrastructureServiceExtensions.cs
public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
{
    // ... existing registrations ...
    services.AddScoped<IMyNewService, MyNewService>();
    return services;
}
```

**Step 4 — Map the endpoint in VacaFlow.Api:**

```csharp
// VacaFlow.Api/Endpoints/MyNewEndpoints.cs
public static class MyNewEndpoints
{
    public static IEndpointRouteBuilder MapMyNewEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/my-resource/{id}/action", async (
            Guid id,
            IMyNewService service,
            CancellationToken ct) =>
        {
            var result = await service.DoSomethingAsync(id, ct);
            return Results.Ok(result);
        })
        .RequireAuthorization();

        return app;
    }
}
```

### 6.3 Approval Service Pattern (Canonical Example)

The `ApprovalService` is the canonical example of correct Application layer service implementation, demonstrating the combined use of `ICurrentUserContext` and `ITransactionService`:

```csharp
// VacaFlow.Application/Services/ApprovalService.cs
namespace VacaFlow.Application.Services;

/// <summary>
/// Executes approve and reject operations atomically.
/// Caller identity is read exclusively from ICurrentUserContext (server-side cookie claim).
/// The atomic write boundary is declared explicitly via ITransactionService.
/// See: ADR-003 (ITransactionService), ADR-005 (Application layer purity), NFR-REL-002.
/// </summary>
public sealed class ApprovalService : IApprovalService
{
    private readonly ICurrentUserContext _currentUser;
    private readonly ITransactionService _transaction;
    private readonly IRequestRepository _requests;
    private readonly IApprovalRepository _approvals;

    public ApprovalService(
        ICurrentUserContext currentUser,
        ITransactionService transaction,
        IRequestRepository requests,
        IApprovalRepository approvals)
    {
        _currentUser = currentUser;
        _transaction = transaction;
        _requests = requests;
        _approvals = approvals;
    }

    public async Task ApproveAsync(Guid requestId, CancellationToken cancellationToken = default)
    {
        // Identity is derived from server-validated cookie claim — never from request body
        var approverId = _currentUser.CurrentUserId;

        var request = await _requests.GetByIdAsync(requestId, cancellationToken)
            ?? throw new DomainException($"Request {requestId} not found.");

        // Domain state machine + SelfApprovalGuard execute before any persistence
        request.Approve(approverId);

        var record = new ApprovalRecord(requestId, approverId, ApprovalOutcome.Approved, DateTimeOffset.UtcNow);

        // Explicit atomic boundary: both writes succeed or both are rolled back
        await _transaction.ExecuteInTransactionAsync(async () =>
        {
            await _requests.UpdateAsync(request, cancellationToken);
            await _approvals.InsertAsync(record, cancellationToken);
        });
    }

    public async Task RejectAsync(Guid requestId, string reason, CancellationToken cancellationToken = default)
    {
        var approverId = _currentUser.CurrentUserId;

        var request = await _requests.GetByIdAsync(requestId, cancellationToken)
            ?? throw new DomainException($"Request {requestId} not found.");

        request.Reject(approverId, reason);

        var record = new ApprovalRecord(requestId, approverId, ApprovalOutcome.Rejected, DateTimeOffset.UtcNow, reason);

        await _transaction.ExecuteInTransactionAsync(async () =>
        {
            await _requests.UpdateAsync(request, cancellationToken);
            await _approvals.InsertAsync(record, cancellationToken);
        });
    }
}
```

### 6.4 Domain State Machine

All `AbsenceRequest` state transitions must go through the domain entity methods. The `RequestStateMachine` guards every transition:

```csharp
// VacaFlow.Domain/StateMachine/RequestStateMachine.cs

// Valid transitions:
// Draft      → Submitted  (via request.Submit())
// Draft      → Cancelled  (via request.Cancel())
// Submitted  → Approved   (via request.Approve(approverId))
// Submitted  → Rejected   (via request.Reject(approverId, reason))
// Submitted  → Cancelled  (via request.Cancel())

// AbsenceRequest aggregate — example of a domain method
public void Approve(Guid approverId)
{
    // Guard: self-approval is forbidden at the domain level
    SelfApprovalGuard.Check(approverId, RequestorId);

    // Guard: only Submitted requests can be approved
    RequestStateMachine.EnsureTransition(Status, RequestStatus.Approved);

    Status = RequestStatus.Approved;
}
```

> **Rule:** Never set `AbsenceRequest.Status` directly from outside the domain entity. All writes to the status field must flow through a domain method.

### 6.5 Infrastructure Implementation Pattern

```csharp
// VacaFlow.Infrastructure/Services/EfCoreTransactionService.cs
namespace VacaFlow.Infrastructure.Services;

/// <summary>
/// Implements ITransactionService using EF Core's explicit transaction API.
/// SQLite does not support nested transactions. A guard exception is thrown
/// if this service is called within an active transaction scope.
/// See: ADR-003.
/// </summary>
public sealed class EfCoreTransactionService : ITransactionService
{
    private readonly VacaFlowDbContext _dbContext;

    public EfCoreTransactionService(VacaFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task ExecuteInTransactionAsync(Func<Task> operation)
    {
        if (_dbContext.Database.CurrentTransaction is not null)
        {
            // SQLite does not support nested transactions — fail fast with a clear message
            throw new InvalidOperationException(
                "ExecuteInTransactionAsync cannot be called within an active transaction. " +
                "SQLite does not support nested transactions. See ADR-003.");
        }

        await using var tx = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            await operation();
            await _dbContext.SaveChangesAsync();
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }
}
```

```csharp
// VacaFlow.Infrastructure/Services/HttpContextCurrentUserContext.cs
namespace VacaFlow.Infrastructure.Services;

/// <summary>
/// Reads caller identity from the server-validated ASP.NET Core cookie claim.
/// Throws UnauthorizedAccessException if the claim is absent — this should
/// never occur on endpoints protected by RequireAuthorization(), but is
/// included as a defense-in-depth guard.
/// </summary>
public sealed class HttpContextCurrentUserContext : ICurrentUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpContextCurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid CurrentUserId
    {
        get
        {
            var claim = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (claim is null || !Guid.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("Authenticated user identity claim is missing or invalid.");
            return userId;
        }
    }

    public UserRole CurrentUserRole
    {
        get
        {
            var claim = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
            if (!Enum.TryParse<UserRole>(claim, out var role))
                throw new UnauthorizedAccessException("Authenticated user role claim is missing or invalid.");
            return role;
        }
    }
}
```

### 6.6 Frontend API Client Pattern

All frontend HTTP calls must use `credentials: 'include'` to send the session cookie:

```typescript
// vacaflow-web/src/lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include', // Always include the session cookie
  });

  if (response.status === 401) {
    // Redirect to login — session expired or not authenticated
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (response.status === 403) {
    throw new Error('Forbidden: insufficient role for this operation.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Typed API call helpers
export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string, role: 'Employee' | 'Manager') =>
      apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  },
  requests: {
    list: () => apiFetch<AbsenceRequest[]>('/api/requests'),
    create: (dto: CreateRequestDto) =>
      apiFetch<AbsenceRequest>('/api/requests', { method: 'POST', body: JSON.stringify(dto) }),
    submit: (id: string) =>
      apiFetch(`/api/requests/${id}/submit`, { method: 'POST' }),
    cancel: (id: string) =>
      apiFetch(`/api/requests/${id}/cancel`, { method: 'POST' }),
  },
  approvals: {
    approve: (id: string) =>
      apiFetch(`/api/requests/${id}/approve`, { method: 'POST' }),
    reject: (id: string, reason: string) =>
      apiFetch(`/api/requests/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  },
  me: {
    current: () => apiFetch<CurrentUser>('/api/me'),
  },
};
```

### 6.7 State-Driven UI Action Rendering

Action buttons are rendered based on the request status and the current user's role. No action must be sent to the API for a transition that the domain state machine would reject:

```typescript
// vacaflow-web/src/components/RequestCard.tsx

type RequestStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Cancelled';

interface RequestCardProps {
  request: AbsenceRequest;
  currentUser: CurrentUser;
  onAction: (action: string, requestId: string) => void;
}

export function RequestCard({ request, currentUser, onAction }: RequestCardProps) {
  const isOwner = request.requestorId === currentUser.id;
  const isManager = currentUser.role === 'Manager';

  return (
    <div className="request-card">
      <h3>{request.absenceType} — {request.startDate} to {request.endDate}</h3>
      <span className={`status status--${request.status.toLowerCase()}`}>{request.status}</span>

      {/* Employee actions — own requests only */}
      {isOwner && request.status === 'Draft' && (
        <>
          <button onClick={() => onAction('submit', request.id)}>Submit</button>
          <button onClick={() => onAction('cancel', request.id)}>Cancel</button>
        </>
      )}
      {isOwner && request.status === 'Submitted' && (
        <button onClick={() => onAction('cancel', request.id)}>Cancel</button>
      )}

      {/* Manager actions — submitted requests, self-approval blocked at domain level */}
      {isManager && request.status === 'Submitted' && (
        <>
          <button onClick={() => onAction('approve', request.id)}>Approve</button>
          <button onClick={() => onAction('reject', request.id)}>Reject</button>
        </>
      )}
    </div>
  );
}
```

### 6.8 Exception Handling

The `ExceptionHandlingMiddleware` translates domain and authorization exceptions into structured HTTP error responses, preventing stack trace leakage:

```csharp
// VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs
namespace VacaFlow.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            _logger.LogWarning("Domain rule violation: {Message}", ex.Message);
            context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message, code = "DOMAIN_RULE_VIOLATION" });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Authorization failure: {Message}", ex.Message);
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { error = "Unauthorized.", code = "UNAUTHORIZED" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred.", code = "INTERNAL_ERROR" });
        }
    }
}
```

---

## 7. API Reference

### 7.1 Base URL

```
http://localhost:5000
```

All requests that operate on protected resources require an active session cookie obtained via `POST /api/auth/login`.

### 7.2 Authentication Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| `POST` | `/api/auth/register` | No | Create a new employee or manager account |
| `POST` | `/api/auth/login` | No | Authenticate and receive the session cookie |
| `POST` | `/api/auth/logout` | Yes | Invalidate the session cookie |
| `GET` | `/api/me` | Yes | Return the current user's identity and role |

**POST /api/auth/register — Request Body:**

```json
{
  "email": "employee@example.com",
  "password": "MinimumLength8!",
  "role": "Employee"
}
```

**POST /api/auth/login — Request Body:**

```json
{
  "email": "employee@example.com",
  "password": "MinimumLength8!"
}
```

**GET /api/me — Response (200 OK):**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "employee@example.com",
  "role": "Employee"
}
```

### 7.3 Absence Request Endpoints

| Method | Path | Auth Required | Role | Description |
|--------|------|---------------|------|-------------|
| `GET` | `/api/requests` | Yes | Any | List requests (employees see own; managers see all pending) |
| `POST` | `/api/requests` | Yes | Employee | Create a new absence request in Draft status |
| `GET` | `/api/requests/{id}` | Yes | Any | Retrieve a single request by ID |
| `POST` | `/api/requests/{id}/submit` | Yes | Employee (owner) | Submit a Draft request for manager review |
| `POST` | `/api/requests/{id}/cancel` | Yes | Employee (owner) | Cancel a Draft or Submitted request |

**POST /api/requests — Request Body:**

```json
{
  "absenceTypeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "startDate": "2026-08-01",
  "endDate": "2026-08-05",
  "notes": "Family vacation"
}
```

**Absence Request — Response Schema:**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "requestorId": "...",
  "absenceTypeId": "...",
  "absenceTypeName": "Annual Leave",
  "startDate": "2026-08-01",
  "endDate": "2026-08-05",
  "status": "Draft",
  "notes": "Family vacation",
  "createdAt": "2026-07-21T10:00:00Z",
  "updatedAt": "2026-07-21T10:00:00Z"
}
```

### 7.4 Approval Endpoints

| Method | Path | Auth Required | Role | Description |
|--------|------|---------------|------|-------------|
| `POST` | `/api/requests/{id}/approve` | Yes | Manager | Approve a Submitted request |
| `POST` | `/api/requests/{id}/reject` | Yes | Manager | Reject a Submitted request |

> **Security note:** The approver identity is read exclusively from the server-validated session cookie claim via `ICurrentUserContext`. These endpoints do not accept an `approverId` field in the request body. Self-approval is enforced by `SelfApprovalGuard` in the Domain layer and will return `422 Unprocessable Entity`.

**POST /api/requests/{id}/reject — Request Body:**

```json
{
  "reason": "Insufficient notice period."
}
```

### 7.5 Utility Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| `GET` | `/health` | No | API health check — returns `200 OK` |
| `GET` | `/api/absence-types` | Yes | List all available absence type categories |

### 7.6 Error Response Schema

All error responses follow a consistent structure:

```json
{
  "error": "Human-readable error description.",
  "code": "ERROR_CODE_CONSTANT"
}
```

| HTTP Status | Code | Cause |
|-------------|------|-------|
| `400` | `VALIDATION_ERROR` | Invalid request body (missing required fields, bad format) |
| `401` | `UNAUTHORIZED` | Missing or expired session cookie |
| `403` | `FORBIDDEN` | Authenticated but insufficient role for this operation |
| `404` | `NOT_FOUND` | Resource with the given ID does not exist |
| `422` | `DOMAIN_RULE_VIOLATION` | Domain guard rejected the operation (e.g., self-approval, invalid state transition) |
| `500` | `INTERNAL_ERROR` | Unhandled server error — check API logs |

---

## 8. Data Model

### 8.1 Database Tables

The SQLite database `vacaflow.db` contains four tables managed by EF Core:

| Table | Description |
|-------|-------------|
| `Employees` | Registered users with roles (Employee or Manager) |
| `AbsenceTypes` | Reference data for absence categories (seeded on startup) |
| `AbsenceRequests` | Absence request lifecycle records |
| `ApprovalRecords` | Immutable audit log of approve/reject decisions |

### 8.2 Entity Relationship Overview

```
Employees (1) ──── (*) AbsenceRequests
                          │
                          └──── (*) ApprovalRecords (*) ──── (1) Employees
                                                         [Approver]

AbsenceTypes (1) ──── (*) AbsenceRequests
```

### 8.3 AbsenceRequest Status Values

| Status | Meaning | Valid Next Statuses |
|--------|---------|---------------------|
| `Draft` | Created but not yet submitted | `Submitted`, `Cancelled` |
| `Submitted` | Awaiting manager review | `Approved`, `Rejected`, `Cancelled` |
| `Approved` | Approved by a manager | — (terminal) |
| `Rejected` | Rejected by a manager | — (terminal) |
| `Cancelled` | Cancelled by the employee | — (terminal) |

### 8.4 EF Core Configuration Notes

- All primary keys are `Guid` type, generated by the application (not the database)
- `AbsenceRequest.Status` is stored as a `string` column with a check constraint enforcing the valid values above
- `Employee.PasswordHash` stores the BCrypt hash — never the plaintext password
- `ApprovalRecord` is an append-only table; update operations are not permitted

---

## 9. Testing

### 9.1 Test Strategy

VacaFlow_03 uses a two-tier testing approach aligned with the Onion Architecture:

| Tier | Scope | Tools | Location |
|------|-------|-------|----------|
| Unit Tests | Application layer services and Domain logic | xUnit, in-memory fakes (no EF Core, no HttpContext) | `VacaFlow.Tests.Unit/` |
| Integration Tests | Infrastructure + Application round-trip against in-memory SQLite | xUnit, EF Core InMemory or SQLite file | `VacaFlow.Tests.Integration/` |

No external services or Docker are required to run the test suite.

### 9.2 Unit Test Pattern (Application Layer)

Application layer services can be tested with simple in-memory interface fakes — no `DbContext`, no `HttpContext`:

```csharp
// VacaFlow.Tests.Unit/Services/ApprovalServiceTests.cs
namespace VacaFlow.Tests.Unit.Services;

public sealed class ApprovalServiceTests
{
    [Fact]
    public async Task ApproveAsync_SelfApproval_ThrowsDomainException()
    {
        // Arrange
        var requestorId = Guid.NewGuid();
        var request = AbsenceRequestFactory.CreateSubmitted(requestorId: requestorId);

        var currentUser = new FakeCurrentUserContext(userId: requestorId, role: UserRole.Manager);
        var transaction = new PassThroughTransactionService();
        var requests = new InMemoryRequestRepository(request);
        var approvals = new InMemoryApprovalRepository();

        var service = new ApprovalService(currentUser, transaction, requests, approvals);

        // Act + Assert
        await Assert.ThrowsAsync<DomainException>(() => service.ApproveAsync(request.Id));
    }

    [Fact]
    public async Task ApproveAsync_ValidManager_UpdatesStatusAndInsertsRecord()
    {
        // Arrange
        var requestorId = Guid.NewGuid();
        var managerId = Guid.NewGuid(); // Different from requestor
        var request = AbsenceRequestFactory.CreateSubmitted(requestorId: requestorId);

        var currentUser = new FakeCurrentUserContext(userId: managerId, role: UserRole.Manager);
        var transaction = new PassThroughTransactionService();
        var requests = new InMemoryRequestRepository(request);
        var approvals = new InMemoryApprovalRepository();

        var service = new ApprovalService(currentUser, transaction, requests, approvals);

        // Act
        await service.ApproveAsync(request.Id);

        // Assert
        Assert.Equal(RequestStatus.Approved, request.Status);
        Assert.Single(approvals.Records);
        Assert.Equal(managerId, approvals.Records[0].ApproverId);
    }
}

// Minimal in-memory fake — no framework dependencies
file sealed class FakeCurrentUserContext : ICurrentUserContext
{
    public FakeCurrentUserContext(Guid userId, UserRole role)
    {
        CurrentUserId = userId;
        CurrentUserRole = role;
    }
    public Guid CurrentUserId { get; }
    public UserRole CurrentUserRole { get; }
}

// Pass-through transaction fake — executes the operation synchronously
file sealed class PassThroughTransactionService : ITransactionService
{
    public async Task ExecuteInTransactionAsync(Func<Task> operation) => await operation();
}
```

### 9.3 Running Tests

```bash
# Run all tests in the solution
dotnet test

# Run only unit tests
dotnet test VacaFlow.Tests.Unit/

# Run only integration tests
dotnet test VacaFlow.Tests.Integration/

# Run with detailed output
dotnet test --verbosity normal

# Run with coverage report (requires coverlet)
dotnet test --collect:"XPlat Code Coverage"
```

---

## 10. Build and Local Startup

### 10.1 Starting the Full Application

Two terminal windows are required. There is no Docker, no docker-compose, and no CI/CD pipeline for the MVP.

**Terminal 1 — API:**

```bash
cd VacaFlow_03
dotnet run --project VacaFlow.Api
# API available at http://localhost:5000
# Database auto-created and seeded on first run
```

**Terminal 2 — Web:**

```bash
cd VacaFlow_03/vacaflow-web
npm run dev
# Frontend available at http://localhost:3000
```

### 10.2 Build for Verification

```bash
# Build the entire .NET solution without running
dotnet build --configuration Release

# Type-check the frontend without starting the dev server
cd vacaflow-web
npm run build
```

### 10.3 Startup Sequence

On `dotnet run`, the API performs the following startup steps in order:

1. Load configuration from `appsettings.json` and `appsettings.Development.json`
2. Register the middleware pipeline (ExceptionHandlingMiddleware → CookieAuthentication → Authorization)
3. Call `services.AddInfrastructure()` to bind all six interface implementations
4. Map all endpoint groups (`/auth`, `/requests`, `/me`, `/health`, `/absence-types`)
5. Call `VacaFlowDbContext.Database.EnsureCreated()` (or apply pending migrations)
6. Run `AbsenceTypeSeeder` and `ManagerAccountSeeder` if tables are empty
7. Log the configured CORS origin and cookie expiration at startup for verification

---

## 11. Troubleshooting

### 11.1 Common Issues

| Issue | Likely Cause | Resolution |
|-------|-------------|------------|
| `Connection refused` on `http://localhost:5000` | API not running | Start the API with `dotnet run --project VacaFlow.Api` |
| `Connection refused` on `http://localhost:3000` | Frontend not running | Start the frontend with `npm run dev` in `vacaflow-web/` |
| `401 Unauthorized` on all API calls from the browser | CORS `AllowCredentials` misconfiguration | Verify `NEXT_PUBLIC_API_BASE_URL` matches the API URL exactly (no trailing slash) and that the CORS policy in `Program.cs` specifies `http://localhost:3000` |
| Cookies not being sent by the browser | `credentials: 'include'` missing | Verify that all calls go through `vacaflow-web/src/lib/api.ts` and not raw `fetch` without credentials |
| `dotnet build` fails with missing packages | NuGet restore not run | Run `dotnet restore` from the solution root |
| `npm: command not found` | Node.js not installed or not on PATH | Install Node.js 20.x and restart the terminal |
| `vacaflow.db` not created on startup | Permissions issue or wrong working directory | Verify the API is run from the solution root or that the connection string path is absolute |
| `DomainException: Self-approval is not allowed` | Manager attempted to approve their own request | This is correct domain behavior — use a different manager account for testing self-approval scenarios |
| `InvalidOperationException: nested transaction` | `ExecuteInTransactionAsync` called inside an existing transaction | Review the call stack — a service is invoking a transactional operation inside another `ExecuteInTransactionAsync` block |
| Application layer build references ASP.NET Core types | A developer added a forbidden package reference | Remove the `PackageReference` from `VacaFlow.Application.csproj` and move the code to `VacaFlow.Infrastructure` |

### 11.2 Viewing Logs

**API Logs (console output):**

```bash
# Increase log verbosity for EF Core SQL queries (development only)
# In appsettings.Development.json:
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

**Frontend Logs:**

Browser developer tools (`F12`) → Console tab. Network tab shows all API requests and response status codes.

### 11.3 Inspecting the Database

Use any SQLite browser tool (VS Code SQLite Viewer extension, DB Browser for SQLite, or `sqlite3` CLI) to inspect `vacaflow.db` at the repository root:

```bash
# Using the sqlite3 CLI
sqlite3 vacaflow.db

# List all tables
.tables

# Query absence requests
SELECT Id, Status, RequestorId FROM AbsenceRequests;

# Query approval records
SELECT * FROM ApprovalRecords;

# Exit
.quit
```

### 11.4 Resetting to a Clean State

```bash
# Stop both running processes (Ctrl+C in each terminal)
# Delete the database file
rm vacaflow.db   # macOS/Linux
del vacaflow.db  # Windows

# Restart the API — database will be auto-created and reseeded
dotnet run --project VacaFlow.Api
```

---

## 12. Additional Resources

### 12.1 Project Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Software Architecture Document (SAD-001) | `projects/VacaFlow_03/documentation/05-architecture/software-architecture-document.md` | Full architectural specification including C4 diagrams, ADRs, and component details |
| Architecture Overview (AO-001) | `projects/VacaFlow_03/documentation/05-architecture/architecture-overview.md` | Principles, style decisions, and constraints |
| Architecture Evaluation (AE-001) | `projects/VacaFlow_03/documentation/05-architecture/architecture-evaluation.md` | Weighted scoring across three alternatives |
| Non-Functional Requirements (NFR-001) | `projects/VacaFlow_03/documentation/04-requirements/nonfunctional-spec.md` | Quality attribute requirements |
| Functional Specification (FS-001) | `projects/VacaFlow_03/documentation/03-define/functional-spec.md` | Use cases and business rules |
| Code Standards | `projects/VacaFlow_03/documentation/07-development/code-standards.md` | Naming conventions, formatting rules, review checklist |
| Seeded Account Credentials | `VacaFlow.Infrastructure/Seeders/README.md` | Manager account email and password for local development |

### 12.2 External References

| Resource | URL |
|----------|-----|
| .NET 8 Documentation | [docs.microsoft.com/dotnet/core/whats-new/dotnet-8](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-8) |
| ASP.NET Core Minimal API | [docs.microsoft.com/aspnet/core/fundamentals/minimal-apis](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis) |
| ASP.NET Core Cookie Authentication | [docs.microsoft.com/aspnet/core/security/authentication/cookie](https://learn.microsoft.com/aspnet/core/security/authentication/cookie) |
| Entity Framework Core 8 | [learn.microsoft.com/ef/core](https://learn.microsoft.com/ef/core) |
| Next.js 14 Documentation | [nextjs.org/docs](https://nextjs.org/docs) |
| BCrypt.Net-Next | [github.com/BcryptNet/bcrypt.net](https://github.com/BcryptNet/bcrypt.net) |
| C4 Model | [c4model.com](https://c4model.com) |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Technical Lead | | | ⏳ Pending |
| Solution Architect | | | ⏳ Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Technical Lead (PM_OVERRIDE — bypassed Technical Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:06:42 UTC |

*— End of document —*
