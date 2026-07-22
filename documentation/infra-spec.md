# Infrastructure Specification: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-22
**Version:** 1.0
**Status:** Draft — Awaiting Approval
**Project:** VacaFlow_03 — IGS Solutions
**References:** SAD-001 (Software Architecture Document), NFR-001 (Non-Functional Requirements Specification)

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Infrastructure Scope Statement](#2-infrastructure-scope-statement)
- [3. Execution Environment](#3-execution-environment)
- [4. Runtime Prerequisites](#4-runtime-prerequisites)
- [5. Process Architecture](#5-process-architecture)
- [6. Local Storage Requirements](#6-local-storage-requirements)
- [7. Network Configuration (Localhost)](#7-network-configuration-localhost)
- [8. Security Requirements](#8-security-requirements)
- [9. Data Management](#9-data-management)
- [10. Developer Setup Procedure](#10-developer-setup-procedure)
- [11. Known Constraints and Limitations](#11-known-constraints-and-limitations)
- [12. Out-of-Scope Items](#12-out-of-scope-items)
- [Approval](#approval)
- [Version History](#version-history)

---

## 1. Overview

### 1.1 Purpose

This document specifies the infrastructure requirements for VacaFlow_03 across all environments defined for the current project scope. VacaFlow_03 is a locally executable absence request management MVP built for IGS Solutions. Its purpose is to validate the complete absence request lifecycle (Draft → Submitted → Approved / Rejected / Cancelled) before any broader deployment decision is made.

This specification provides the authoritative reference for environment setup, runtime dependencies, local process architecture, storage allocation, and network configuration for the MVP phase. It serves as the foundation for the Deployment Runbook (`deployment-runbook`) and Environment Configuration (`env-config`) documents that follow in the Infrastructure phase.

### 1.2 Scope

This document covers the single environment defined for VacaFlow_03 Phase 1:

| In Scope | Out of Scope |
|----------|-------------|
| Local development environment (source-code execution on developer / reviewer machines) | Cloud environments (Azure, AWS, GCP) |
| On-premises / local machine infrastructure specification | Docker containers or container orchestration |
| Runtime prerequisites and version constraints | CI/CD pipelines |
| Local SQLite database provisioning | Production hosting infrastructure |
| Localhost networking between API and frontend | High availability, load balancing, auto-scaling |
| File system storage layout | Automated backups |
| Security requirements applicable to local execution | Monitoring and alerting infrastructure |

### 1.3 Environment Summary

VacaFlow_03 defines one operational environment for the MVP:

| Environment | Hosting Model | Purpose | Availability Target |
|-------------|--------------|---------|---------------------|
| Local Development | On-premises (developer / reviewer machine) | Source-code validation and MVP review | Best effort — no SLA |

No cloud, staging, or production environments are provisioned for this phase. Infrastructure decisions for any future environment are deferred per SI-001 §4 (Out of Scope) and SAD-001 §1.5 (Strategic Path Forward — Phase 3).

### 1.4 Governing Constraints

The following project-level constraints from SI-001 and NFR-001 directly shape this specification:

| Constraint Source | Constraint |
|-------------------|-----------|
| SI-001 §5 — Technical Constraints | Application must run locally from source code; no Docker, no cloud |
| NFR-COMPAT-001 | Must run on Windows, macOS, and Linux with documented prerequisites |
| NFR-AVAIL-001 | Blocking defects in the core workflow must be resolved; no uptime SLA |
| NFR-AVAIL-002 | SQLite file location and reset instructions must be documented |
| NFR-SEC-004 | SQLite database file must not be exposed via the web server or committed to source control |
| SAD-001 §1.5 | Phase 1 is Local MVP Delivery; production migration is Phase 3 and is not in scope |

---

## 2. Infrastructure Scope Statement

VacaFlow_03 Phase 1 infrastructure is entirely local and on-premises. No network infrastructure beyond localhost loopback communication is provisioned. No cloud accounts, container registries, managed databases, or external services are required or used.

The infrastructure consists of:

1. A **developer or reviewer machine** running a compatible operating system with the required runtime software installed.
2. Two **local processes**: the ASP.NET Core 8 API process and the Next.js 14 development server, started manually from source code.
3. A **SQLite database file** (`vacaflow.db`) auto-provisioned by EF Core 8 on first API startup within the application's configured data directory.
4. **Loopback network communication** on two localhost ports: `5000` for the API and `3000` for the web frontend.

This infrastructure profile is consistent with the architecture decision recorded in ADR-004 (SAD-001 §4.2) which selected SQLite via EF Core for zero-configuration, file-based, cross-platform persistence, and with the Usability & Compatibility score rationale in the Architecture Evaluation that prioritized a sub-15-minute reviewer setup.

---

## 3. Execution Environment

### 3.1 Supported Operating Systems

| Operating System | Versions | Support Level |
|-----------------|----------|---------------|
| Windows | 10 (21H2+), 11 | Fully supported |
| macOS | 12 Monterey, 13 Ventura, 14 Sonoma | Fully supported |
| Linux | Ubuntu 20.04 LTS, 22.04 LTS; Debian 11, 12; Fedora 38+ | Fully supported |

Any operating system that supports .NET 8 SDK and Node.js 20.x LTS is functionally compatible. The three families above are the validated environments for MVP review.

### 3.2 Hardware Requirements

These are minimum requirements for running VacaFlow_03 locally from source code. No performance headroom beyond single-user interactive use is required.

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores, 1.6 GHz | 4 cores, 2.0 GHz+ |
| RAM | 4 GB | 8 GB |
| Disk (free space) | 2 GB | 4 GB |
| Network | Loopback only (no external network required at runtime) | — |

The 2 GB free disk minimum accounts for: .NET 8 SDK (~900 MB), Node.js 20 (~200 MB), npm dependencies for the frontend (~300 MB), NuGet packages (~200 MB), and the SQLite database file plus application binaries (~100 MB overhead).

### 3.3 Runtime Software

The following software must be installed on the developer or reviewer machine before setup. All items are freely available and cross-platform.

| Software | Required Version | Distribution / Download |
|---------|-----------------|------------------------|
| .NET SDK | 8.0.x (latest patch) | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js | 20.x LTS | https://nodejs.org/en/download |
| npm | 9.x or 10.x (bundled with Node.js 20) | Bundled with Node.js |
| Git | 2.x | https://git-scm.com/downloads |

**Verification commands:**

```bash
dotnet --version    # Expected: 8.0.x
node --version      # Expected: v20.x.x
npm --version       # Expected: 9.x or 10.x
git --version       # Expected: 2.x.x
```

No additional system packages, database servers, message brokers, or cloud SDKs are required. SQLite is embedded within the `Microsoft.Data.Sqlite` NuGet package and requires no separate installation.

---

## 4. Runtime Prerequisites

### 4.1 .NET 8 SDK

The .NET 8 SDK is the primary runtime and build toolchain for the backend. The `dotnet` CLI is used for dependency restoration, compilation, migration execution, and process startup.

| Attribute | Value |
|-----------|-------|
| Required version | .NET 8.0 (latest LTS patch at time of setup) |
| Installation scope | User-level or system-level |
| Build tools included | `dotnet restore`, `dotnet build`, `dotnet run`, `dotnet ef` |
| EF Core CLI tool | `dotnet-ef` — install globally: `dotnet tool install --global dotnet-ef` |

### 4.2 Node.js 20 LTS

Node.js is the runtime for the Next.js 14 development server. It is required exclusively for the frontend (`vacaflow-web`) and is not used by the backend.

| Attribute | Value |
|-----------|-------|
| Required version | Node.js 20.x LTS |
| Package manager | npm (bundled) |
| Usage | `npm install`, `npm run dev` |
| Port | 3000 (configurable via `PORT` environment variable) |

### 4.3 EF Core CLI (dotnet-ef)

The EF Core CLI tool is used to apply database migrations at setup time and to manage the schema throughout development.

| Attribute | Value |
|-----------|-------|
| Tool name | `dotnet-ef` |
| Install command | `dotnet tool install --global dotnet-ef` |
| Version | 8.0.x (match the EF Core package version in the solution) |
| Usage at setup | `dotnet ef database update --project VacaFlow.Infrastructure` |

---

## 5. Process Architecture

### 5.1 Process Overview

VacaFlow_03 runs as two separate, independently started processes on the local machine. There is no process supervisor, container runtime, or orchestration layer.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Developer / Reviewer Machine                      │
│                                                                          │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │  Process 1: ASP.NET Core 8 — VacaFlow.Api                        │ │
│   │  Started by: dotnet run --project VacaFlow.Api                   │ │
│   │  Listening:  http://localhost:5000                                │ │
│   │  Components: Minimal API endpoints, Cookie Auth middleware,       │ │
│   │              EF Core 8 → vacaflow.db (SQLite)                    │ │
│   └───────────────────────────────────────────────────────────────────┘ │
│                │                          ▲                             │
│                │ HTTP JSON (localhost)     │ HTTP JSON (localhost)       │
│                ▼                          │                             │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │  Process 2: Next.js 14 Dev Server — vacaflow-web                 │ │
│   │  Started by: npm run dev                                          │ │
│   │  Listening:  http://localhost:3000                                │ │
│   │  Role:       Browser-based SPA; calls API with credentials:include│ │
│   └───────────────────────────────────────────────────────────────────┘ │
│                │                                                         │
│                │ Browser access                                          │
│                ▼                                                         │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │  Browser (Chrome / Firefox / Edge / Safari)                       │ │
│   │  URL: http://localhost:3000                                        │ │
│   └───────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│   ┌───────────────────────────────────────────────────────────────────┐ │
│   │  SQLite Database File: vacaflow.db                                │ │
│   │  Location: {repo-root}/VacaFlow.Api/Data/vacaflow.db              │ │
│   │  Access:   EF Core 8 (in-process, Process 1 only)                │ │
│   └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Process Details

#### Process 1 — VacaFlow.Api (ASP.NET Core 8 Minimal API)

| Attribute | Value |
|-----------|-------|
| Project | `VacaFlow.Api` |
| Framework | ASP.NET Core 8 Minimal API |
| Start command | `dotnet run --project VacaFlow.Api` (from repository root) |
| Listening address | `http://localhost:5000` |
| HTTPS | Not configured for MVP (HTTPS is a production concern per SAD-001 §1.5) |
| Authentication | ASP.NET Core Cookie Authentication (`HttpOnly`, `SameSite=Strict`) |
| Database access | EF Core 8 → `Microsoft.Data.Sqlite` → `vacaflow.db` |
| Auto-provisioning | `EnsureCreated()` or pending migrations applied at startup; seed data applied via EF Core `HasData` |
| DI scope | All six infrastructure bindings registered as Scoped: `HttpContextCurrentUserContext`, `EfCoreTransactionService`, and four EF Core repository implementations |

**Middleware pipeline (in order):**

1. `ExceptionHandlingMiddleware` — outermost; catches domain and authorization exceptions
2. `CookieAuthenticationMiddleware` — validates `HttpOnly` session cookie; populates `HttpContext.User`
3. `RoleAuthorizationMiddleware` — enforces `[Authorize(Roles)]` policies
4. Endpoint routing — maps `/auth`, `/requests`, `/requests/{id}/approve`, `/requests/{id}/reject`, `/me`, `/health`

#### Process 2 — vacaflow-web (Next.js 14 Development Server)

| Attribute | Value |
|-----------|-------|
| Project | `vacaflow-web` |
| Framework | Next.js 14 (App Router), React 18, TypeScript 5 |
| Start command | `npm run dev` (from `vacaflow-web/` directory) |
| Listening address | `http://localhost:3000` |
| API communication | `fetch()` with `credentials: 'include'` to `http://localhost:5000` |
| No backend dependencies | The Next.js dev server has no direct database or file system access |

### 5.3 Startup Order

The API process must be started and fully initialized before the frontend is used. The recommended startup sequence is:

```
Step 1: Start VacaFlow.Api
        dotnet run --project VacaFlow.Api
        → Wait for: "Now listening on: http://localhost:5000"
        → Database auto-provisioned at this point

Step 2: Start vacaflow-web (in a separate terminal)
        cd vacaflow-web && npm run dev
        → Wait for: "ready started server on localhost:3000"

Step 3: Open browser
        Navigate to http://localhost:3000
```

There is no dependency between the frontend dev server and the database; the frontend communicates exclusively through the API.

---

## 6. Local Storage Requirements

### 6.1 File System Layout

The following directories and files are created during setup and runtime:

```
{repository-root}/
├── VacaFlow.Api/
│   ├── Data/
│   │   └── vacaflow.db                  ← Auto-created by EF Core on first run
│   └── appsettings.Development.json     ← Local configuration (connection string, cookie settings)
├── VacaFlow.Infrastructure/
│   └── Migrations/                      ← EF Core migration files (committed to source control)
├── vacaflow-web/
│   └── node_modules/                    ← npm dependencies (generated by npm install, ~300 MB)
├── .gitignore                           ← Excludes vacaflow.db and node_modules
└── README.md
```

### 6.2 SQLite Database File

| Attribute | Value |
|-----------|-------|
| File name | `vacaflow.db` |
| Default location | `{repository-root}/VacaFlow.Api/Data/vacaflow.db` |
| Creation | Automatic on first `dotnet run` via EF Core `EnsureCreated()` or migration apply |
| Initial size | Approximately 100–200 KB (seed data only) |
| Growth | Approximately 1–5 KB per absence request record during MVP review |
| Max expected size | Less than 5 MB for the entire MVP review window |
| Access control | Operating system file permissions (no database server authentication) |
| Source control | Excluded via `.gitignore` — must never be committed to the repository |
| Reset procedure | Delete `vacaflow.db`; restart the API to auto-provision a fresh database |
| Backup procedure | Copy `vacaflow.db` to a safe location using the operating system file copy command |

### 6.3 .gitignore Requirements

The repository `.gitignore` must include the following entries to prevent accidental credential exposure (NFR-SEC-004):

```
# SQLite database file
*.db
*.db-shm
*.db-wal
VacaFlow.Api/Data/

# Node.js dependencies
vacaflow-web/node_modules/

# .NET build outputs
**/bin/
**/obj/

# User secrets and local configuration overrides
appsettings.*.json
!appsettings.Development.json.example
```

### 6.4 Disk Space Allocation

| Item | Approximate Size |
|------|-----------------|
| .NET 8 SDK (system install) | ~900 MB |
| NuGet package cache (solution restore) | ~200 MB |
| Node.js (system install) | ~200 MB |
| npm packages (`node_modules`) | ~300 MB |
| Repository source files | ~10 MB |
| SQLite database (`vacaflow.db`) | < 5 MB |
| EF Core build outputs (`bin/`, `obj/`) | ~100 MB |
| **Total** | **~1.7 GB** |

A minimum of 2 GB free disk space is required; 4 GB is recommended to accommodate future growth without maintenance intervention during the review window.

---

## 7. Network Configuration (Localhost)

### 7.1 Port Assignments

All network communication is confined to the localhost loopback interface (`127.0.0.1`). No external network access is required at runtime.

| Service | Protocol | Port | Bound Address | Purpose |
|---------|----------|------|---------------|---------|
| VacaFlow.Api | HTTP | 5000 | `localhost:5000` | REST API for all frontend and direct API calls |
| vacaflow-web (dev server) | HTTP | 3000 | `localhost:3000` | Next.js development server serving the browser SPA |

### 7.2 CORS Configuration

The API must be configured with an explicit CORS policy to allow the frontend to send credentialed requests. This configuration is implemented in `Program.cs` within `VacaFlow.Api`.

| Attribute | Value |
|-----------|-------|
| Allowed origin | `http://localhost:3000` (explicit, not wildcard) |
| Allow credentials | `true` — required for `HttpOnly` cookie transmission |
| Allowed HTTP methods | `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` |
| Allowed headers | `Content-Type`, `Authorization` |
| Exposed headers | None beyond defaults |

**Configuration note:** `AllowAnyOrigin()` and `AllowCredentials()` cannot be used together in ASP.NET Core. The CORS policy must specify the exact origin `http://localhost:3000`. An incorrect CORS configuration causes silent 401 errors on credentialed requests; the health-check endpoint (`GET /health`) can be used to verify API reachability before diagnosing CORS issues (as documented in SAD-001 ADR-002 risks).

### 7.3 Cookie Configuration

Authentication cookies are issued by `VacaFlow.Api` and transmitted by the browser to the API on all subsequent requests.

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| `HttpOnly` | `true` | Prevents JavaScript access — eliminates XSS token-theft surface (NFR-SEC-002, ADR-002) |
| `SameSite` | `Strict` | CSRF protection at no additional cost (ADR-002) |
| `Secure` | `false` (development) | HTTP only for local execution; set to `true` for any future HTTPS deployment |
| Sliding expiration | 120 minutes | Sufficient for a reviewer walkthrough session (ADR-002 risk mitigation) |
| Cookie name | `vacaflow.auth` | Descriptive; avoids collision with other local development cookies |

### 7.4 Firewall and External Access

No inbound firewall rules are required. All communication is loopback-only. The API and frontend must not be exposed to external network interfaces during the MVP phase. If the developer machine's firewall prompts for network access when starting the API, the request should be denied or restricted to Private networks only.

---

## 8. Security Requirements

The security requirements documented here apply within the local execution context and are derived from NFR-001 §2 (Security Requirements) and the architectural decisions recorded in SAD-001 §4.

### 8.1 Credential Security

| Requirement | Implementation | Source |
|-------------|---------------|--------|
| Passwords hashed with BCrypt | `BCrypt.Net-Next` 4.x used in `Employee` domain entity factory method | NFR-SEC-001, SAD-001 §3.2.1 |
| Raw passwords never persisted or logged | Validation enforced in `AuthService` and Infrastructure logging configuration | NFR-SEC-001 |
| Seeded credentials are placeholder values only | Manager and Employee seed accounts use example passwords documented in README; no organizational passwords committed | NFR-SEC-004 |
| Database file excluded from source control | `.gitignore` entry (§6.3 above) | NFR-SEC-004 |

### 8.2 Authentication and Authorization

| Requirement | Implementation | Source |
|-------------|---------------|--------|
| `HttpOnly` cookie authentication | ASP.NET Core Cookie Authentication middleware; `HttpOnly=true`, `SameSite=Strict` | NFR-SEC-002, ADR-002 |
| Server-side identity derivation | `HttpContextCurrentUserContext` reads `ClaimTypes.NameIdentifier` from validated cookie — frontend cannot inject identity | NFR-SEC-002, SAD-001 §3.2.4 |
| Role-based access control | `RoleAuthorizationMiddleware`; `[Authorize(Roles = "Manager")]` on approval endpoints | NFR-SEC-003 |
| Self-approval prevention | `SelfApprovalGuard` in `VacaFlow.Domain`; throws `DomainException` when `ApproverId == RequestorId` | NFR-SEC-003, NFR-REL-001 |
| Manager role not self-assignable | Public registration endpoint creates `Employee` accounts only; Manager accounts exist only via seeding | NFR-SEC-003 |

### 8.3 Data Protection

| Requirement | Implementation | Source |
|-------------|---------------|--------|
| Cross-user data isolation | Employee endpoints filter results by authenticated user identity; Managers see all pending requests | NFR-SEC-005 |
| Stack trace suppression | `ExceptionHandlingMiddleware` returns structured JSON error responses; no internal detail exposed | NFR-SEC-005, SAD-001 §3.2.3 |
| Database file not web-accessible | SQLite file stored in `VacaFlow.Api/Data/` — not within the web server's static file serving path | NFR-SEC-004 |

### 8.4 Local Security Limitations (Acknowledged)

The following security properties are explicitly not enforced in the MVP local execution context and are accepted as known limitations consistent with SI-001 §4 (Out of Scope):

| Limitation | Reason |
|------------|--------|
| No HTTPS (TLS) on localhost | HTTP is sufficient for local execution; TLS required for any non-loopback deployment |
| No rate limiting or brute-force protection on login | MVP scope; single reviewer machine; not a production attack surface |
| No multi-factor authentication | Explicitly deferred per NFR-001 §2 (Security deferred items) |
| No account lockout | Deferred per MVP scope |
| Cookie `Secure` flag disabled | Required for HTTP-only local execution; must be enabled for any HTTPS deployment |

---

## 9. Data Management

### 9.1 Database Schema Overview

The SQLite database is managed exclusively by EF Core 8 Code-First migrations. The schema is defined by `VacaFlowDbContext` in `VacaFlow.Infrastructure`.

| Table | Description | Key Fields |
|-------|-------------|-----------|
| `Employees` | User accounts for both roles | `Id` (Guid), `Email`, `PasswordHash`, `Role` (enum), `Name` |
| `AbsenceTypes` | Reference data for request categories | `Id` (Guid), `Name`, `Description` |
| `AbsenceRequests` | Absence request lifecycle records | `Id` (Guid), `EmployeeId` (FK), `AbsenceTypeId` (FK), `StartDate`, `EndDate`, `Status` (enum), `Reason` |
| `ApprovalRecords` | Immutable record of approval or rejection decisions | `Id` (Guid), `RequestId` (FK), `ApproverId` (FK), `Decision`, `Comment`, `DecidedAt` |

### 9.2 Seed Data

The following seed data is applied automatically by EF Core at database provisioning time:

| Data Set | Contents | Mechanism |
|----------|----------|-----------|
| Absence types | Standard absence categories (e.g., Vacation, Sick Leave, Personal Leave, Unpaid Leave) | EF Core `HasData` in `AbsenceTypeSeeder` |
| Manager account | One seeded Manager account with a hashed placeholder password | EF Core `HasData` in `ManagerAccountSeeder` |

Seeded account credentials (email and placeholder password) are documented in the repository README. These are example values for review use only and do not represent organizational credentials.

### 9.3 Database Lifecycle Operations

| Operation | Procedure |
|-----------|----------|
| Initial provisioning | Automatic on first `dotnet run` via `EnsureCreated()` or `dotnet ef database update` |
| Schema migration | `dotnet ef database update --project VacaFlow.Infrastructure` from repository root |
| Database reset (full) | Delete `vacaflow.db` file → restart API → database re-provisioned with seed data |
| Manual backup | Copy `vacaflow.db` to a designated backup location using OS file copy |
| Restore from backup | Stop the API → replace `vacaflow.db` with the backup copy → restart API |

### 9.4 Data Integrity

| Requirement | Implementation | Source |
|-------------|---------------|--------|
| Atomic approval writes | `ITransactionService.ExecuteInTransactionAsync` wraps `AbsenceRequest` state update and `ApprovalRecord` insert in a single explicit SQLite transaction | NFR-REL-002, ADR-003 |
| Input validation before persistence | `NFR-REL-003` — all inputs validated at API boundary before business logic executes | NFR-REL-003 |
| State transition enforcement | `RequestStateMachine` in `VacaFlow.Domain` guards all transitions before persistence | NFR-REL-001 |
| Nested transaction guard | `EfCoreTransactionService` throws `InvalidOperationException` on nested transaction detection (SQLite limitation) | ADR-003 |

---

## 10. Developer Setup Procedure

This section provides the authoritative setup procedure for the local environment. The README in the repository root expands on these steps with additional context and troubleshooting notes (per NFR-MAINT-002).

### 10.1 Prerequisites Verification

```bash
# Verify .NET 8 SDK
dotnet --version
# Expected output: 8.0.x

# Verify Node.js 20 LTS
node --version
# Expected output: v20.x.x

# Verify npm
npm --version
# Expected output: 9.x.x or 10.x.x

# Install EF Core CLI (if not already installed)
dotnet tool install --global dotnet-ef
dotnet ef --version
# Expected output: 8.0.x
```

### 10.2 Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd vacaflow

# Restore .NET dependencies
dotnet restore

# Restore Node.js dependencies
cd vacaflow-web
npm install
cd ..
```

### 10.3 Database Initialization

```bash
# Apply EF Core migrations (creates vacaflow.db with seed data)
dotnet ef database update --project VacaFlow.Infrastructure --startup-project VacaFlow.Api
```

Alternatively, if the application is configured to call `EnsureCreated()` at startup, the database is provisioned automatically on first `dotnet run` without a separate migration step.

### 10.4 Application Startup

```bash
# Terminal 1: Start the API
dotnet run --project VacaFlow.Api
# Wait for: Now listening on: http://localhost:5000

# Terminal 2: Start the frontend
cd vacaflow-web
npm run dev
# Wait for: ready started server on localhost:3000
```

### 10.5 Verification

```bash
# Verify API health
curl http://localhost:5000/health
# Expected: HTTP 200 with health status payload

# Open browser
# Navigate to: http://localhost:3000
# Verify: Login screen is rendered
```

### 10.6 Database Reset

```bash
# Stop the API (Ctrl+C in Terminal 1)
# Delete the database file
rm VacaFlow.Api/Data/vacaflow.db     # macOS / Linux
del VacaFlow.Api\Data\vacaflow.db    # Windows

# Restart the API — database is re-provisioned with seed data
dotnet run --project VacaFlow.Api
```

---

## 11. Known Constraints and Limitations

The following constraints are acknowledged characteristics of the VacaFlow_03 MVP infrastructure profile. They are not defects; they reflect deliberate scope decisions documented in SI-001 and SAD-001.

| Constraint | Impact | Source | Resolution Path |
|------------|--------|--------|----------------|
| SQLite serializes writes | Concurrent write operations may experience brief locking under simultaneous multi-user load | NFR-PERF-002, ADR-004 | Replace with PostgreSQL or SQL Server in Phase 3 per SAD-001 §1.5 |
| No nested transactions in SQLite | `EfCoreTransactionService` must not be called within an existing EF Core transaction scope | ADR-003 | Guard implemented; throws descriptive `InvalidOperationException` |
| HTTP only (no TLS) | Communications between browser and API are unencrypted on localhost | NFR-SEC-004, ADR-002 | Enable HTTPS and set `Secure` cookie flag for any non-localhost deployment |
| Single database file | No read replicas; no horizontal database scaling | NFR-PERF-002 | Replace with production database in Phase 3 |
| Manual process startup | No process supervisor, service manager, or health-check auto-restart | NFR-AVAIL-001 | Add process management for any persistent deployment |
| No automated backups | SQLite file must be manually copied | NFR-AVAIL-002 | Implement automated backup strategy before production deployment |
| Cookie `Secure` flag disabled | Cookies transmitted over HTTP; acceptable only for loopback | ADR-002 | Enable `Secure=true` for any HTTPS deployment |
| Development server for frontend | `npm run dev` is not suitable for production use | SI-001 §4 | Build with `npm run build` and serve statically for production |

---

## 12. Out-of-Scope Items

The following infrastructure items are explicitly out of scope for VacaFlow_03 Phase 1 and are deferred to future phases contingent on the decision described in SAD-001 §1.5 (Phase 3 — Production Migration):

| Item | Deferred To |
|------|------------|
| Cloud infrastructure (Azure, AWS, GCP) | Phase 3 — Production Migration |
| Docker containerization and container registry | Phase 3 |
| Kubernetes or any container orchestration | Phase 3 |
| CI/CD pipelines (GitHub Actions, Azure DevOps) | Phase 3 |
| TLS certificates and HTTPS configuration | Phase 3 |
| Load balancing and auto-scaling | Phase 3 |
| Managed database (Azure SQL, PostgreSQL on Azure) | Phase 3 |
| Distributed caching (Redis) | Phase 3 |
| Centralized logging and monitoring (Application Insights, ELK) | Phase 3 |
| Automated database backups | Phase 3 |
| Secrets management (Azure Key Vault, HashiCorp Vault) | Phase 3 |
| Staging environment | Phase 3 |
| Production environment | Phase 3 |
| Disaster recovery infrastructure | Phase 3 |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| DevOps Lead | Yeuri Jessel Reyes | | ⏳ Pending |
| Operations Lead | | | ⏳ Pending |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | Yeuri Jessel Reyes (AI Assisted) | Initial draft — Local MVP infrastructure specification |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | DevOps Lead (PM_OVERRIDE — bypassed DevOps Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-22 13:32:58 UTC |

*— End of document —*
