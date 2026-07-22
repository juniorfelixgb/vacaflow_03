# Environment Configuration: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-22
**Version:** 1.0
**Status:** Draft — Awaiting Approval
**Project:** VacaFlow_03 — IGS Solutions
**References:** INFRA-001 (Infrastructure Specification), SAD-001 (Software Architecture Document)

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Environment Summary](#2-environment-summary)
- [3. Configuration Sources and Priority](#3-configuration-sources-and-priority)
- [4. Application Configuration](#4-application-configuration)
- [5. Database Configuration](#5-database-configuration)
- [6. Network and CORS Configuration](#6-network-and-cors-configuration)
- [7. Authentication and Cookie Configuration](#7-authentication-and-cookie-configuration)
- [8. Frontend Configuration](#8-frontend-configuration)
- [9. Configuration Files](#9-configuration-files)
- [10. Secrets and Credential Management](#10-secrets-and-credential-management)
- [11. Configuration Validation](#11-configuration-validation)
- [12. Environment Reset and Troubleshooting](#12-environment-reset-and-troubleshooting)
- [13. Out-of-Scope Configuration Items](#13-out-of-scope-configuration-items)
- [Approval](#approval)
- [Version History](#version-history)

---

## 1. Overview

### 1.1 Purpose

This document specifies the environment configuration for VacaFlow_03 — the absence request management MVP built for IGS Solutions. It defines all configuration variables, file-based settings, credential management practices, and environment-specific values required to run the application correctly in the single environment defined for this phase.

This document is the authoritative reference for configuring the local execution environment and is intended to be read in conjunction with the Infrastructure Specification (INFRA-001) and the Deployment Runbook (`deployment-runbook`).

### 1.2 Scope

VacaFlow_03 Phase 1 defines one environment: **Local**. The application runs locally from source code on a developer or reviewer machine. There are no cloud, staging, or production environments provisioned for this phase.

As a consequence of this scope:

- There are no per-environment variable matrices with differing cloud endpoints, connection strings to managed databases, or environment-specific secrets vaults.
- All configuration is static and file-based, managed through `appsettings.Development.json` for the backend and `.env.local` for the frontend.
- No secrets management service (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault) is required or used.
- No feature flags are defined; all MVP features are included unconditionally.

### 1.3 Application Components

VacaFlow_03 consists of two independently configured processes:

| Component | Technology | Configuration Mechanism |
|-----------|-----------|------------------------|
| `VacaFlow.Api` | ASP.NET Core 8 Minimal API | `appsettings.json` / `appsettings.Development.json` |
| `vacaflow-web` | Next.js 14 (App Router), React 18 | `.env.local` file in the `vacaflow-web/` directory |

---

## 2. Environment Summary

### 2.1 Defined Environments

| Environment | Hosting Model | Purpose | Availability Target |
|-------------|--------------|---------|---------------------|
| Local | On-premises (developer / reviewer machine) | Source-code execution, MVP validation | Best effort — no SLA |

No additional environments (Development-cloud, QA, Staging, Production) are defined or provisioned for Phase 1. All future environments are deferred to Phase 3 per SAD-001 §1.5.

### 2.2 Environment Identifier

The active environment is identified at runtime by the `ASPNETCORE_ENVIRONMENT` variable for the backend and `NODE_ENV` for the frontend.

| Component | Variable | Value (Local) |
|-----------|----------|---------------|
| `VacaFlow.Api` | `ASPNETCORE_ENVIRONMENT` | `Development` |
| `vacaflow-web` | `NODE_ENV` | `development` (set automatically by `npm run dev`) |

Setting `ASPNETCORE_ENVIRONMENT=Development` causes ASP.NET Core to load `appsettings.Development.json` in addition to the base `appsettings.json`, with the development file taking precedence on overlapping keys. This is the standard ASP.NET Core configuration layering behavior.

---

## 3. Configuration Sources and Priority

### 3.1 Backend Configuration Priority (ASP.NET Core 8)

Configuration values are resolved in the following order. A value from a higher-priority source overrides the same key from a lower-priority source.

| Priority | Source | Notes |
|----------|--------|-------|
| 1 (highest) | Environment variables (shell / OS) | Override any file-based value; useful for CI and future cloud deployments |
| 2 | `appsettings.Development.json` | Present in repository as an example; active when `ASPNETCORE_ENVIRONMENT=Development` |
| 3 | `appsettings.json` | Base configuration; committed to repository; contains safe defaults and non-sensitive settings |
| 4 (lowest) | Default values in code | Fallback constants defined in `Program.cs` or configuration classes |

### 3.2 Frontend Configuration Priority (Next.js 14)

| Priority | Source | Notes |
|----------|--------|-------|
| 1 (highest) | Shell environment variables | Rarely needed for local execution |
| 2 | `.env.local` | Local-only file; not committed to source control; holds runtime API URL |
| 3 | `.env` | Committed base defaults (if present); safe, non-sensitive values only |
| 4 (lowest) | Next.js build-time defaults | Applied during `next build`; not relevant for `npm run dev` |

### 3.3 Source Control Inclusion

| File | Committed to Source Control | Reason |
|------|-----------------------------|--------|
| `appsettings.json` | Yes | Contains safe, non-sensitive defaults |
| `appsettings.Development.json.example` | Yes | Template for local configuration — devs copy and rename |
| `appsettings.Development.json` | No (`.gitignore`) | May contain local credentials or overrides |
| `.env.local` | No (`.gitignore`) | Contains local configuration not suitable for shared repositories |
| `.env.example` | Yes | Documents required frontend variables with placeholder values |
| `vacaflow.db` | No (`.gitignore`) | Runtime data file — must never be committed (NFR-SEC-004) |

---

## 4. Application Configuration

### 4.1 Backend Environment Variables

The following variables affect the backend runtime. For local execution, most are set via `appsettings.Development.json` rather than shell environment variables, but all can be overridden by exporting them in the shell before running `dotnet run`.

#### 4.1.1 ASP.NET Core Runtime

| Variable | Description | Required | Local Value |
|----------|-------------|----------|-------------|
| `ASPNETCORE_ENVIRONMENT` | Activates the environment-specific configuration file and enables Developer Exception Page | Yes | `Development` |
| `ASPNETCORE_URLS` | Overrides the listen address specified in `appsettings.json` | No | Not set (defaults to `http://localhost:5000` via config) |

#### 4.1.2 Application Settings

These values are read from `appsettings.json` / `appsettings.Development.json` using the ASP.NET Core `IConfiguration` abstraction. They are listed here using their dot-notation configuration key.

| Configuration Key | Description | Required | Local Value |
|-------------------|-------------|----------|-------------|
| `App:Name` | Application display name used in log messages and responses | No | `VacaFlow` |
| `App:Version` | Application semantic version | No | `1.0.0` |
| `Kestrel:Endpoints:Http:Url` | Kestrel listen URL | Yes | `http://localhost:5000` |
| `Logging:LogLevel:Default` | Default log level for all categories | No | `Information` |
| `Logging:LogLevel:Microsoft.AspNetCore` | ASP.NET Core framework log level | No | `Warning` |
| `Logging:LogLevel:Microsoft.EntityFrameworkCore.Database.Command` | EF Core SQL query logging | No | `Information` (Dev only) |

### 4.2 Logging Configuration

VacaFlow_03 uses the built-in ASP.NET Core logging infrastructure writing to the console. No external logging sink (Application Insights, Serilog with remote targets, ELK) is configured for Phase 1.

| Log Level | Category | Local Value | Rationale |
|-----------|----------|-------------|-----------|
| `Information` | Default | `Information` | Adequate visibility for local debugging |
| `Warning` | `Microsoft.AspNetCore` | `Warning` | Reduces framework noise in the console |
| `Information` | `Microsoft.EntityFrameworkCore.Database.Command` | `Information` | SQL query visibility aids development |

EF Core SQL logging is appropriate for local development. In any future environment where SQL logs may contain sensitive data, this level must be raised to `Warning` or higher.

---

## 5. Database Configuration

### 5.1 SQLite Connection String

The database connection is configured via the `ConnectionStrings:DefaultConnection` key in `appsettings.Development.json`. SQLite requires no database server, username, or password; the connection string specifies only the file path.

| Configuration Key | Description | Required | Local Value |
|-------------------|-------------|----------|-------------|
| `ConnectionStrings:DefaultConnection` | SQLite connection string pointing to the `vacaflow.db` file | Yes | `Data Source=Data/vacaflow.db` |

**Notes on the connection string:**

- The path `Data/vacaflow.db` is relative to the working directory of the `VacaFlow.Api` process. When started with `dotnet run --project VacaFlow.Api` from the repository root, the working directory is `VacaFlow.Api/`, so the resolved absolute path is `{repository-root}/VacaFlow.Api/Data/vacaflow.db`.
- An absolute path may be substituted if the application is started from a different working directory.
- The `Data/` subdirectory must exist before first startup; it is either created by the application at startup or must be created manually with `mkdir VacaFlow.Api/Data`.

### 5.2 EF Core and SQLite Behavior Settings

| Configuration Key | Description | Local Value | Notes |
|-------------------|-------------|-------------|-------|
| `Database:AutoMigrateOnStartup` | Whether to call `database.Migrate()` automatically at application startup | `true` | Enables zero-manual-step setup for reviewers |
| `Database:SeedDataOnStartup` | Whether to apply seed data if none exists | `true` | Inserts absence types and manager account on fresh database |

If `AutoMigrateOnStartup` is not implemented as a configurable key, the application applies migrations unconditionally via `dbContext.Database.Migrate()` in `Program.cs` as documented in INFRA-001 §10.3.

### 5.3 Connection Pool Settings

SQLite embedded via `Microsoft.Data.Sqlite` uses EF Core's built-in connection pooling. No external pool configuration is required. The default settings are appropriate for the single-user local execution context.

| Setting | Value | Notes |
|---------|-------|-------|
| Minimum pool size | 1 (EF Core default) | No manual configuration needed |
| Maximum pool size | Not constrained | Bounded by SQLite's single-writer concurrency model |
| Command timeout | 30 seconds (EF Core default) | Sufficient for all MVP operations |
| WAL mode | Not enabled by default | Not required for single-user local use |

---

## 6. Network and CORS Configuration

### 6.1 Listen Addresses

| Component | Configuration Key | Local Value |
|-----------|-------------------|-------------|
| `VacaFlow.Api` | `Kestrel:Endpoints:Http:Url` (or `ASPNETCORE_URLS`) | `http://localhost:5000` |
| `vacaflow-web` | `PORT` (Next.js) | `3000` (default; set in `.env.local` only if overriding) |

### 6.2 CORS Policy Configuration

CORS is configured in `Program.cs` of `VacaFlow.Api`. The policy must be explicit and consistent with the frontend origin. Wildcard origins are incompatible with `AllowCredentials()` in ASP.NET Core.

| Configuration Key | Description | Required | Local Value |
|-------------------|-------------|----------|-------------|
| `Cors:AllowedOrigins:0` | The single allowed frontend origin | Yes | `http://localhost:3000` |
| `Cors:AllowCredentials` | Permits cookies to be sent cross-origin (loopback to loopback) | Yes | `true` |
| `Cors:AllowedMethods` | HTTP methods permitted for cross-origin requests | Yes | `GET, POST, PUT, DELETE, OPTIONS` |
| `Cors:AllowedHeaders` | Headers permitted in cross-origin requests | Yes | `Content-Type, Authorization` |

**Critical constraint:** If the frontend port is changed from `3000`, `Cors:AllowedOrigins:0` must be updated to match. A mismatch causes silent 401 errors on all credentialed requests. The health endpoint (`GET /health`) bypasses authentication and can be used to verify basic API reachability before diagnosing CORS issues.

### 6.3 Frontend API URL Configuration

The Next.js frontend must know the API base URL to construct fetch requests. This is configured via an environment variable in `.env.local`.

| Variable | Description | Required | Local Value |
|----------|-------------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the `VacaFlow.Api` process | Yes | `http://localhost:5000` |

This variable is prefixed with `NEXT_PUBLIC_` so Next.js exposes it to the browser bundle at build time. It must not contain trailing slashes. All API calls in the frontend are constructed as `${NEXT_PUBLIC_API_URL}/path`.

---

## 7. Authentication and Cookie Configuration

### 7.1 ASP.NET Core Cookie Authentication

Cookie authentication behavior is configured in `Program.cs` via `services.AddAuthentication().AddCookie(...)` and reflected in `appsettings.Development.json` for the values that should be adjustable without code changes.

| Configuration Key | Description | Required | Local Value | Rationale |
|-------------------|-------------|----------|-------------|-----------|
| `Auth:CookieName` | Name of the authentication cookie | Yes | `vacaflow.auth` | Unique name prevents collision with other local cookies |
| `Auth:HttpOnly` | Prevents JavaScript from reading the cookie | Yes | `true` | Eliminates XSS token-theft surface (NFR-SEC-002, ADR-002) |
| `Auth:SameSite` | Controls cross-site cookie sending | Yes | `Strict` | CSRF protection at no additional cost (ADR-002) |
| `Auth:Secure` | Restricts cookie to HTTPS connections | Yes | `false` | HTTP only for loopback; must be `true` for any HTTPS deployment |
| `Auth:SlidingExpiration` | Whether session TTL resets on activity | No | `true` | Keeps active reviewers authenticated |
| `Auth:ExpireTimeSpan` | Session duration (sliding window) | Yes | `02:00:00` (2 hours) | Sufficient for a complete reviewer walkthrough (ADR-002) |
| `Auth:LoginPath` | Path the middleware redirects unauthenticated requests to | Yes | `/login` | Used by the frontend redirect flow |

### 7.2 JWT — Not Applicable

VacaFlow_03 uses cookie-based session authentication exclusively. JSON Web Tokens (JWT) are not issued and no `JWT_SECRET` or signing key is required for Phase 1. This decision is documented in SAD-001 ADR-002. Should a future phase require stateless token authentication, a secret key must be introduced and managed via a secrets service.

---

## 8. Frontend Configuration

### 8.1 `.env.local` File

The `.env.local` file is placed in the `vacaflow-web/` directory and is not committed to source control. A documented template (`.env.example`) is committed in its place.

**File:** `vacaflow-web/.env.local`

```
# VacaFlow Web — Local Environment Configuration
# Copy this file to .env.local and adjust values if your ports differ.

# Base URL of the VacaFlow API process
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 8.2 Frontend Variable Reference

| Variable | Description | Required | Local Value | Notes |
|----------|-------------|----------|-------------|-------|
| `NEXT_PUBLIC_API_URL` | VacaFlow API base URL | Yes | `http://localhost:5000` | Must match the Kestrel listen address |

No other frontend environment variables are required for Phase 1. All feature behavior is unconditionally included in the MVP build.

### 8.3 Next.js Development Server Settings

| Setting | Value | Notes |
|---------|-------|-------|
| `PORT` | `3000` | Default; override by setting `PORT=<n>` before `npm run dev` if port is occupied |
| `NODE_ENV` | `development` | Set automatically by Next.js `dev` script; enables Hot Module Replacement and detailed error overlays |
| `NEXT_TELEMETRY_DISABLED` | `1` (recommended) | Disables Next.js anonymous telemetry; set in `.env.local` or shell if preferred |

---

## 9. Configuration Files

### 9.1 `appsettings.json` (Base — Committed)

This file contains safe defaults that apply across all environments. It is committed to source control. It must not contain passwords, secrets, or values that differ between environments.

**File:** `VacaFlow.Api/appsettings.json`

```json
{
  "App": {
    "Name": "VacaFlow",
    "Version": "1.0.0"
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5000"
      }
    }
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 9.2 `appsettings.Development.json.example` (Template — Committed)

This template is committed to source control so every developer knows exactly which keys to configure. Developers copy it to `appsettings.Development.json` and fill in their local values.

**File:** `VacaFlow.Api/appsettings.Development.json.example`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=Data/vacaflow.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000"
    ],
    "AllowCredentials": true,
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "AllowedHeaders": ["Content-Type", "Authorization"]
  },
  "Auth": {
    "CookieName": "vacaflow.auth",
    "HttpOnly": true,
    "SameSite": "Strict",
    "Secure": false,
    "SlidingExpiration": true,
    "ExpireTimeSpan": "02:00:00",
    "LoginPath": "/login"
  },
  "Database": {
    "AutoMigrateOnStartup": true,
    "SeedDataOnStartup": true
  }
}
```

### 9.3 `appsettings.Development.json` (Active Local — Not Committed)

This file is the active local configuration. It is generated by copying `appsettings.Development.json.example` and is excluded from source control via `.gitignore`. Its content for a standard local setup is identical to the example above.

### 9.4 `.env.example` (Frontend Template — Committed)

**File:** `vacaflow-web/.env.example`

```
# VacaFlow Web — Environment Variables Template
# Copy to .env.local and adjust if your API runs on a different port.

NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 9.5 `.env.local` (Frontend Active — Not Committed)

**File:** `vacaflow-web/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 10. Secrets and Credential Management

### 10.1 Overview

VacaFlow_03 Phase 1 does not integrate with any secrets management service. The application's security perimeter is the local developer machine. There are no production credentials, API keys to external services, or cloud service credentials in scope.

| Item | Status | Notes |
|------|--------|-------|
| Secrets management service (Azure Key Vault, AWS Secrets Manager) | Not used | Deferred to Phase 3 |
| External API keys | None | No external APIs are integrated in Phase 1 |
| Database password | Not applicable | SQLite uses file-based access; no username/password authentication |
| JWT signing key | Not applicable | Cookie authentication used; no JWT issued |
| Email service credentials | Not applicable | No email service integrated |
| Payment gateway credentials | Not applicable | No payment integration in scope |

### 10.2 Seeded Account Credentials

The only credentials managed in Phase 1 are those for the seeded development accounts. These are example placeholder values used exclusively for MVP review and must not represent organizational credentials.

| Account | Role | Email | Password |
|---------|------|-------|----------|
| Seeded Manager | Manager | Documented in repository README | Documented in repository README (hashed via BCrypt at seed time) |

The seeded passwords are hashed using `BCrypt.Net-Next` at the time EF Core seed data is applied. The plaintext values appear only in the README for reviewer reference and in the EF Core seeder implementation. They are not stored in any configuration file.

### 10.3 .gitignore Requirements

The following `.gitignore` entries prevent accidental credential or database exposure (NFR-SEC-004):

```gitignore
# SQLite database and WAL files
*.db
*.db-shm
*.db-wal
VacaFlow.Api/Data/

# Local configuration overrides (may contain developer-specific values)
appsettings.Development.json
!appsettings.Development.json.example

# Frontend local environment
vacaflow-web/.env.local
vacaflow-web/.env.*.local
!vacaflow-web/.env.example

# Node.js dependencies
vacaflow-web/node_modules/

# .NET build outputs
**/bin/
**/obj/

# User secrets (dotnet user-secrets)
%APPDATA%/Microsoft/UserSecrets/
~/.microsoft/usersecrets/
```

### 10.4 ASP.NET Core User Secrets (Optional)

For developers who prefer to keep credentials out of all tracked configuration files, ASP.NET Core's user secrets mechanism provides a machine-local secrets store outside the repository tree.

```bash
# Initialize user secrets for the API project
dotnet user-secrets init --project VacaFlow.Api

# Set a value (example — only needed if overriding a default)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Data Source=/custom/path/vacaflow.db" --project VacaFlow.Api
```

User secrets are stored at `%APPDATA%\Microsoft\UserSecrets\<userSecretsId>\secrets.json` (Windows) or `~/.microsoft/usersecrets/<userSecretsId>/secrets.json` (macOS/Linux) and are never committed to source control. User secrets are applied automatically when `ASPNETCORE_ENVIRONMENT=Development`.

---

## 11. Configuration Validation

### 11.1 Required Configuration Checklist

The following checklist verifies that the local environment is correctly configured before starting the application.

#### Backend Checklist

```bash
#!/bin/bash
# validate-backend-config.sh
# Run from the repository root before starting VacaFlow.Api

echo "=== VacaFlow Backend Configuration Validation ==="

# Check ASPNETCORE_ENVIRONMENT
if [ -z "$ASPNETCORE_ENVIRONMENT" ]; then
  echo "INFO:  ASPNETCORE_ENVIRONMENT not set in shell — ASP.NET Core will use 'Production' by default."
  echo "       Set it to 'Development' for local use: export ASPNETCORE_ENVIRONMENT=Development"
else
  echo "OK:    ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT"
fi

# Check appsettings.Development.json exists
if [ ! -f "VacaFlow.Api/appsettings.Development.json" ]; then
  echo "ERROR: VacaFlow.Api/appsettings.Development.json not found."
  echo "       Copy VacaFlow.Api/appsettings.Development.json.example to appsettings.Development.json"
  exit 1
else
  echo "OK:    appsettings.Development.json found"
fi

# Check Data directory exists
if [ ! -d "VacaFlow.Api/Data" ]; then
  echo "INFO:  VacaFlow.Api/Data/ directory does not exist — creating..."
  mkdir -p VacaFlow.Api/Data
  echo "OK:    Created VacaFlow.Api/Data/"
else
  echo "OK:    VacaFlow.Api/Data/ directory exists"
fi

echo "=== Backend configuration validation complete ==="
```

#### Frontend Checklist

```bash
#!/bin/bash
# validate-frontend-config.sh
# Run from the repository root before starting vacaflow-web

echo "=== VacaFlow Frontend Configuration Validation ==="

# Check .env.local exists
if [ ! -f "vacaflow-web/.env.local" ]; then
  echo "ERROR: vacaflow-web/.env.local not found."
  echo "       Copy vacaflow-web/.env.example to vacaflow-web/.env.local"
  exit 1
else
  echo "OK:    vacaflow-web/.env.local found"
fi

# Check NEXT_PUBLIC_API_URL is set in .env.local
if ! grep -q "NEXT_PUBLIC_API_URL" vacaflow-web/.env.local; then
  echo "ERROR: NEXT_PUBLIC_API_URL is not defined in vacaflow-web/.env.local"
  exit 1
else
  echo "OK:    NEXT_PUBLIC_API_URL defined"
fi

# Check node_modules installed
if [ ! -d "vacaflow-web/node_modules" ]; then
  echo "ERROR: vacaflow-web/node_modules not found. Run: cd vacaflow-web && npm install"
  exit 1
else
  echo "OK:    node_modules present"
fi

echo "=== Frontend configuration validation complete ==="
```

### 11.2 Runtime Verification Commands

After starting both processes, the following commands verify that the configuration is applied correctly.

```bash
# 1. Verify API is listening on the correct port
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health
# Expected: 200

# 2. Verify API returns a structured health response
curl http://localhost:5000/health
# Expected: JSON body with status "Healthy" or equivalent

# 3. Verify CORS preflight succeeds from the frontend origin
curl -X OPTIONS http://localhost:5000/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -E "(Access-Control|HTTP/)"
# Expected: Access-Control-Allow-Origin: http://localhost:3000
#           Access-Control-Allow-Credentials: true

# 4. Verify SQLite database file was created
ls -lh VacaFlow.Api/Data/vacaflow.db
# Expected: File exists, size > 0

# 5. Verify frontend dev server is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
```

### 11.3 Configuration Issue Diagnosis Table

| Symptom | Likely Cause | Resolution |
|---------|-------------|------------|
| API fails to start with "Unable to open database file" | `VacaFlow.Api/Data/` directory does not exist | Create the directory: `mkdir VacaFlow.Api/Data` |
| API starts but returns 500 on all requests | `ASPNETCORE_ENVIRONMENT` not set to `Development`; incorrect config loaded | Export `ASPNETCORE_ENVIRONMENT=Development` and restart |
| Frontend shows network error on login | `NEXT_PUBLIC_API_URL` points to wrong port or host | Verify `.env.local` value matches Kestrel listen address; restart `npm run dev` |
| Login request returns 401 immediately | Cookie not transmitted; CORS misconfiguration | Check `CORS:AllowedOrigins` matches frontend origin exactly; verify `AllowCredentials: true` |
| Seed data absent (no absence types, no manager account) | Migrations applied but seed data not inserted | Delete `vacaflow.db` and restart API; seed data is applied on fresh database |
| "Port 5000 already in use" on API startup | Another process occupies port 5000 | Stop the conflicting process or change `Kestrel:Endpoints:Http:Url` to use an alternate port and update `NEXT_PUBLIC_API_URL` accordingly |
| "Port 3000 already in use" on frontend startup | Another process occupies port 3000 | Set `PORT=3001` before `npm run dev`; update `CORS:AllowedOrigins` and `NEXT_PUBLIC_API_URL` to match |
| EF Core migration error on startup | `dotnet-ef` tool version mismatch with package version | Run `dotnet tool update --global dotnet-ef` and retry |

---

## 12. Environment Reset and Troubleshooting

### 12.1 Full Environment Reset

A complete reset restores the application to a clean state with only seed data, as if it were being run for the first time.

```bash
# Step 1: Stop both processes (Ctrl+C in each terminal)

# Step 2: Delete the SQLite database file
# macOS / Linux:
rm -f VacaFlow.Api/Data/vacaflow.db
# Windows (PowerShell):
Remove-Item -Force VacaFlow.Api\Data\vacaflow.db

# Step 3: Restart the API — database is auto-provisioned with seed data
dotnet run --project VacaFlow.Api

# Step 4: Restart the frontend (in a separate terminal)
cd vacaflow-web && npm run dev
```

### 12.2 Dependency Refresh

If npm or NuGet dependencies become outdated or corrupted:

```bash
# Refresh .NET dependencies
dotnet restore

# Refresh Node.js dependencies
cd vacaflow-web
rm -rf node_modules package-lock.json    # macOS / Linux
# Windows: Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### 12.3 Configuration File Reset

If local configuration files become inconsistent:

```bash
# Reset backend configuration
cp VacaFlow.Api/appsettings.Development.json.example \
   VacaFlow.Api/appsettings.Development.json

# Reset frontend configuration
cp vacaflow-web/.env.example vacaflow-web/.env.local
```

---

## 13. Out-of-Scope Configuration Items

The following configuration categories are explicitly not part of VacaFlow_03 Phase 1 and are deferred to Phase 3 (Production Migration) as documented in SAD-001 §1.5 and INFRA-001 §12.

| Configuration Category | Deferred To |
|-----------------------|-------------|
| Cloud database connection strings (Azure SQL, PostgreSQL) | Phase 3 |
| Secrets management service integration (Azure Key Vault, AWS Secrets Manager) | Phase 3 |
| Redis / distributed cache configuration | Phase 3 |
| HTTPS / TLS certificate configuration | Phase 3 |
| Container environment variables (Docker, Kubernetes ConfigMap / Secret) | Phase 3 |
| CI/CD pipeline environment variables | Phase 3 |
| Email service configuration (SMTP, SendGrid, Mailgun) | Phase 3 |
| Microsoft Entra ID / corporate SSO configuration | Phase 3 |
| Application Insights / centralized logging configuration | Phase 3 |
| Multi-environment variable matrices (Dev-cloud, QA, Staging, Prod) | Phase 3 |
| Feature flags | Not planned for Phase 1; architecture to be evaluated before Phase 3 |
| Azure Deployment / Docker / CI/CD toggles | Deferred backlog items |
| Password reset / email verification settings | Deferred backlog items |
| Teams / email notification service keys | Deferred backlog items |
| Holiday calendar / payroll system integration settings | Deferred backlog items |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| DevOps Lead | Yeuri Jessel Reyes | | ⏳ Pending |
| Security Lead | | | ⏳ Pending |
| Application Owner | | | ⏳ Pending |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | Yeuri Jessel Reyes (AI Assisted) | Initial release — Local MVP environment configuration |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | DevOps Lead (PM_OVERRIDE — bypassed DevOps Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-22 13:39:00 UTC |

*— End of document —*
