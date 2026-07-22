# Deployment Runbook: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-22
**Version:** 1.0
**Project:** VacaFlow_03 — IGS Solutions
**Target Environment:** Local (On-Premises Developer / Reviewer Machine)
**Deployment Method:** Canary (Progressive validation across reviewer sessions)
**References:** INFRA-SPEC-001 (Infrastructure Specification), SAD-001 (Software Architecture Document)

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Deployment Team](#2-deployment-team)
- [3. Pre-Deployment Checklist](#3-pre-deployment-checklist)
- [4. Deployment Steps](#4-deployment-steps)
- [5. Smoke Test Checklist](#5-smoke-test-checklist)
- [6. Rollback Procedure](#6-rollback-procedure)
- [7. Post-Deployment Tasks](#7-post-deployment-tasks)
- [8. Communication Templates](#8-communication-templates)
- [9. Troubleshooting Guide](#9-troubleshooting-guide)
- [10. Appendix: Reference Commands](#10-appendix-reference-commands)
- [Version History](#version-history)

---

## 1. Overview

### 1.1 Purpose

This runbook provides the step-by-step procedures required to deploy VacaFlow_03 v1.0 to a local development machine. It covers the complete deployment lifecycle: preparation, execution, canary validation, and rollback, including all verification steps necessary to confirm a healthy deployment before marking the release as complete.

VacaFlow_03 is a locally executed absence request management MVP built for IGS Solutions. Because the infrastructure is entirely on-premises (no cloud, no containers, no CI/CD pipeline), this runbook addresses manual execution of all deployment steps on the target developer or reviewer machine.

### 1.2 Scope

| In Scope | Out of Scope |
|----------|-------------|
| Local setup and first-run deployment | Cloud or hosted environment deployment |
| Canary validation sequence for local MVP review | Docker / container deployment |
| Database provisioning and migration application | CI/CD pipeline automation |
| Rollback to a clean database state | Staging or production deployment |
| Smoke testing of the full absence request lifecycle | Performance or load testing |

### 1.3 Application Components

The following components are deployed as part of this runbook:

| Component | Technology | Deployment Unit | Port |
|-----------|-----------|-----------------|------|
| Backend API | ASP.NET Core 8 Minimal API | Source code — `dotnet run` | 5000 |
| Frontend Web App | Next.js 14 (App Router), React 18, TypeScript 5 | Source code — `npm run dev` | 3000 |
| Database | SQLite via EF Core 8 | File — `vacaflow.db` (auto-provisioned) | N/A (in-process) |

### 1.4 Canary Deployment Strategy

For a local MVP, the canary strategy is implemented as a **progressive reviewer session validation**:

| Canary Stage | Description | Success Criteria |
|--------------|-------------|-----------------|
| Stage 1 — Employee workflow | One reviewer validates the Employee role end-to-end (login, submit request, view status) | Zero critical errors; all Employee screens render correctly |
| Stage 2 — Manager workflow | One reviewer validates the Manager role end-to-end (login, view pending requests, approve/reject) | Zero critical errors; approval and rejection flows complete |
| Stage 3 — Full lifecycle | Combined review of the complete Draft → Submitted → Approved / Rejected / Cancelled state machine | All state transitions correct; data persisted accurately |
| Promote | Deployment declared successful | All three stages pass without rollback triggers |

If any stage fails its success criteria, the rollback procedure in Section 6 is executed before proceeding to the next stage.

### 1.5 Deployment Window

| Attribute | Value |
|-----------|-------|
| Scheduled Date | 2026-07-22 |
| Window Start | Defined by team lead at time of execution |
| Expected Duration | 30–45 minutes (initial setup); 5–10 minutes per subsequent deployment |
| Maximum Window | 2 hours before rollback is declared |

---

## 2. Deployment Team

| Role | Name | Contact / Slack |
|------|------|----------------|
| Deployment Lead / DevOps Lead | Yeuri Jessel Reyes | [Slack / contact per team directory] |
| Application Owner / Product Owner | [Product Owner] | [Slack / contact per team directory] |
| QA Lead | [QA Lead] | [Slack / contact per team directory] |
| Operations Lead | [Operations Lead] | [Slack / contact per team directory] |

> **Note:** For this local MVP deployment, a single technical reviewer may fulfill multiple roles. Each Stage 1–3 canary review should be performed by a user representative of the role being tested (Employee or Manager).

---

## 3. Pre-Deployment Checklist

Complete all items before beginning Section 4. Do not proceed if any item cannot be checked.

### 3.1 Approvals

- [ ] Deployment approved by Deployment Lead (Yeuri Jessel Reyes)
- [ ] Application Owner notified of deployment window
- [ ] QA Lead has confirmed test cases are ready (reference: test-report)
- [ ] Pre-deployment communication sent to reviewers (use template in Section 8.1)

### 3.2 Technical Readiness

- [ ] Repository is accessible and up-to-date (`git pull` completed from main branch)
- [ ] .NET 8 SDK installed and verified (`dotnet --version` returns `8.0.x`)
- [ ] Node.js 20 LTS installed and verified (`node --version` returns `v20.x.x`)
- [ ] npm 9.x or 10.x available (`npm --version` returns `9.x` or `10.x`)
- [ ] EF Core CLI installed (`dotnet ef --version` returns `8.0.x`)
- [ ] Git 2.x available (`git --version` returns `2.x.x`)
- [ ] Ports 3000 and 5000 are free on the target machine (no conflicting processes)
- [ ] At least 2 GB free disk space available on target machine (4 GB recommended)
- [ ] `.gitignore` confirmed to exclude `*.db`, `*.db-shm`, `*.db-wal`, `VacaFlow.Api/Data/`, and `vacaflow-web/node_modules/`

### 3.3 Database Readiness

- [ ] No existing `vacaflow.db` file in `VacaFlow.Api/Data/` (fresh deployment), OR
- [ ] Existing `vacaflow.db` backed up if preserving data (see Section 3.4)
- [ ] EF Core migration scripts reviewed and confirmed current with application version
- [ ] Seeded account credentials (Manager email and placeholder password) confirmed in README

### 3.4 Backup (if re-deploying over an existing instance)

| Step | Action | Command | Verify |
|------|--------|---------|--------|
| B.1 | Stop the running API process | `Ctrl+C` in the API terminal | Process exits cleanly |
| B.2 | Back up existing database | `cp VacaFlow.Api/Data/vacaflow.db backups/vacaflow.db.$(date +%Y%m%d%H%M%S)` (macOS/Linux) or `copy VacaFlow.Api\Data\vacaflow.db backups\vacaflow.db.%DATE%` (Windows) | Backup file exists in `backups/` |
| B.3 | Verify backup integrity | Confirm the backup file size matches the source | File sizes match |

### 3.5 Environment Readiness

- [ ] Target machine operating system confirmed compatible (Windows 10/11, macOS 12–14, or supported Linux distribution — see INFRA-SPEC-001 §3.1)
- [ ] Firewall or antivirus software confirmed to allow localhost connections on ports 3000 and 5000
- [ ] Browser available for smoke testing (Chrome, Firefox, Edge, or Safari — latest stable)
- [ ] Two terminal windows (or tabs) available for parallel API and frontend processes

### 3.6 Communication

- [ ] Pre-deployment notification sent to all reviewers (Section 8.1)
- [ ] Slack channel / communication bridge established for deployment coordination
- [ ] Rollback decision contacts identified (Section 6.3)

---

## 4. Deployment Steps

### Phase 1: Repository Preparation (T-30 minutes)

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 1.1 | Navigate to repository root | `cd <path-to-vacaflow-repository>` | Working directory is repository root | Deployment Lead |
| 1.2 | Pull latest code from main branch | `git pull origin main` | "Already up to date" or list of updated files | Deployment Lead |
| 1.3 | Confirm current commit hash | `git rev-parse --short HEAD` | Record the commit hash for rollback reference | Deployment Lead |
| 1.4 | Verify solution structure | `ls` / `dir` | `VacaFlow.Api/`, `VacaFlow.Infrastructure/`, `vacaflow-web/`, `VacaFlow.Domain/`, `VacaFlow.Application/` visible | Deployment Lead |

### Phase 2: Backend Build and Dependency Restoration (T-25 minutes)

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 2.1 | Restore .NET NuGet packages | `dotnet restore` | "Restore completed" with no errors | Deployment Lead |
| 2.2 | Build the solution | `dotnet build --configuration Release` | "Build succeeded. 0 Error(s)" | Deployment Lead |
| 2.3 | Verify EF Core CLI availability | `dotnet ef --version` | Version `8.0.x` displayed | Deployment Lead |

### Phase 3: Frontend Dependency Restoration (T-20 minutes)

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 3.1 | Navigate to frontend directory | `cd vacaflow-web` | Working directory is `vacaflow-web/` | Deployment Lead |
| 3.2 | Install Node.js dependencies | `npm install` | `node_modules/` populated; no `npm ERR!` messages | Deployment Lead |
| 3.3 | Return to repository root | `cd ..` | Working directory is repository root | Deployment Lead |

### Phase 4: Database Provisioning (T-15 minutes)

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 4.1 | Apply EF Core migrations | `dotnet ef database update --project VacaFlow.Infrastructure --startup-project VacaFlow.Api` | "Done." with migration list displayed; `vacaflow.db` created in `VacaFlow.Api/Data/` | Deployment Lead |
| 4.2 | Confirm database file created | `ls VacaFlow.Api/Data/` (macOS/Linux) or `dir VacaFlow.Api\Data\` (Windows) | `vacaflow.db` present; size 100–200 KB | Deployment Lead |
| 4.3 | Confirm seed data applied | Check output for seeder execution messages | Absence types and Manager account seeded (check migration output or API logs at startup) | Deployment Lead |

> **Note:** If the application is configured to call `EnsureCreated()` at startup, Step 4.1 may be skipped; the database will be provisioned automatically during Phase 5, Step 5.1. Confirm the configuration in `VacaFlow.Infrastructure` before deciding.

### Phase 5: Application Startup (T-0)

> Open two separate terminal windows (Terminal 1 and Terminal 2) for this phase.

#### Terminal 1 — Start the API

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 5.1 | Start the ASP.NET Core API | `dotnet run --project VacaFlow.Api` | Console output ends with: `Now listening on: http://localhost:5000` | Deployment Lead |
| 5.2 | Confirm database auto-provisioned (if using EnsureCreated) | Read startup logs | No migration errors; seeder logs visible (absence types, manager account) | Deployment Lead |
| 5.3 | Confirm middleware pipeline initialized | Read startup logs | No unhandled exceptions; `ExceptionHandlingMiddleware`, `CookieAuthenticationMiddleware`, and `RoleAuthorizationMiddleware` registered | Deployment Lead |

#### Terminal 2 — Start the Frontend

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 5.4 | Navigate to frontend directory | `cd vacaflow-web` | Working directory is `vacaflow-web/` | Deployment Lead |
| 5.5 | Start the Next.js development server | `npm run dev` | Console output includes: `ready started server on localhost:3000` | Deployment Lead |
| 5.6 | Confirm no compilation errors | Read startup output | No `ERROR` lines; TypeScript compilation successful | Deployment Lead |

### Phase 6: Initial Health Verification (T+5 minutes)

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| 6.1 | Verify API health endpoint | `curl http://localhost:5000/health` (or browser `http://localhost:5000/health`) | HTTP 200 response with health status payload | Deployment Lead |
| 6.2 | Verify frontend accessible | Open browser → `http://localhost:3000` | Login screen renders without console errors | Deployment Lead |
| 6.3 | Verify CORS configuration | Open browser DevTools → Network tab → attempt login | No CORS policy errors in browser console | Deployment Lead |
| 6.4 | Verify cookie issuance | Open browser DevTools → Application → Cookies | `vacaflow.auth` cookie present after login attempt; `HttpOnly` and `SameSite=Strict` flags set | Deployment Lead |

---

## 5. Smoke Test Checklist

Execute all smoke tests after Phase 6 health verification is complete. Record actual results and pass/fail status for each test.

### 5.1 Infrastructure Smoke Tests

| Test ID | Test | Expected Result | Actual Result | Pass / Fail |
|---------|------|-----------------|---------------|-------------|
| SMK-001 | API health endpoint responds | `GET /health` returns HTTP 200 | | |
| SMK-002 | Frontend home page loads in under 3 seconds | Browser renders login screen; no JavaScript errors | | |
| SMK-003 | API CORS headers present for credentialed request | `Access-Control-Allow-Origin: http://localhost:3000` in response headers | | |
| SMK-004 | SQLite database file exists and is non-zero | `vacaflow.db` present in `VacaFlow.Api/Data/`; size 100–200 KB | | |

### 5.2 Authentication Smoke Tests

| Test ID | Test | Expected Result | Actual Result | Pass / Fail |
|---------|------|-----------------|---------------|-------------|
| SMK-005 | Employee login with seeded account | Login succeeds; `vacaflow.auth` cookie issued; user redirected to Employee dashboard | | |
| SMK-006 | Manager login with seeded Manager account | Login succeeds; `vacaflow.auth` cookie issued; user redirected to Manager dashboard | | |
| SMK-007 | Invalid credentials rejected | Login returns error message; no cookie issued | | |
| SMK-008 | Unauthenticated access to protected route redirects to login | Browser redirected to login screen; no data exposed | | |

### 5.3 Employee Workflow Smoke Tests (Canary Stage 1)

| Test ID | Test | Expected Result | Actual Result | Pass / Fail |
|---------|------|-----------------|---------------|-------------|
| SMK-009 | Employee can submit a new absence request | Request created with status `Draft` or `Submitted` per workflow design | | |
| SMK-010 | Employee can view their own absence requests | Request list displays only the authenticated employee's records | | |
| SMK-011 | Absence types populated in request form | Vacation, Personal Leave, Sick Leave visible in dropdown | | |
| SMK-012 | Employee cannot view other employees' requests | Cross-user data isolation enforced; no unauthorized records returned | | |

### 5.4 Manager Workflow Smoke Tests (Canary Stage 2)

| Test ID | Test | Expected Result | Actual Result | Pass / Fail |
|---------|------|-----------------|---------------|-------------|
| SMK-013 | Manager can view all pending absence requests | All submitted requests visible in Manager dashboard | | |
| SMK-014 | Manager can approve an absence request | Request status transitions to `Approved`; `ApprovalRecord` created | | |
| SMK-015 | Manager can reject an absence request | Request status transitions to `Rejected`; `ApprovalRecord` created | | |
| SMK-016 | Manager cannot approve their own request | Self-approval attempt returns error; `SelfApprovalGuard` enforced | | |

### 5.5 Full Lifecycle Smoke Tests (Canary Stage 3)

| Test ID | Test | Expected Result | Actual Result | Pass / Fail |
|---------|------|-----------------|---------------|-------------|
| SMK-017 | Complete Draft → Submitted → Approved flow | All state transitions persist correctly; correct status shown in Employee view | | |
| SMK-018 | Complete Draft → Submitted → Rejected flow | All state transitions persist correctly; rejection reason recorded | | |
| SMK-019 | Cancellation of a submitted request | Request status transitions to `Cancelled` per state machine rules | | |
| SMK-020 | Data persists after API restart | Stop and restart API; previously created requests remain in database | | |

### 5.6 Smoke Test Sign-Off

| Canary Stage | Reviewer | All Tests Passed? | Date / Time | Notes |
|--------------|----------|-------------------|-------------|-------|
| Stage 1 — Employee Workflow | | | | |
| Stage 2 — Manager Workflow | | | | |
| Stage 3 — Full Lifecycle | | | | |
| **Overall Deployment** | Deployment Lead | | | |

---

## 6. Rollback Procedure

### 6.1 Rollback Decision Criteria

Initiate rollback immediately if ANY of the following conditions are observed:

- [ ] API health endpoint (`GET /health`) returns non-200 status after startup
- [ ] Frontend fails to render the login screen
- [ ] CORS errors prevent the browser from communicating with the API
- [ ] Any smoke test in the SMK-005 to SMK-020 range returns a critical failure (incorrect data, authentication bypass, or state machine violation)
- [ ] Self-approval guard (`SMK-016`) does not enforce correctly — this is a security-critical failure requiring immediate rollback
- [ ] Database file not provisioned after startup sequence
- [ ] Data loss detected (records missing after API restart — `SMK-020` fails)
- [ ] Maximum deployment window exceeded (2 hours from Phase 5 start)

### 6.2 Rollback Decision Authority

| Scenario | Authority to Declare Rollback |
|----------|-------------------------------|
| Critical security failure (SMK-016) | Any reviewer — immediate; no escalation required |
| Functional test failure (SMK-009 to SMK-020) | QA Lead or Deployment Lead |
| Infrastructure failure (SMK-001 to SMK-008) | Deployment Lead |
| Window exceeded | Deployment Lead |

### 6.3 Rollback Contact Chain

1. **Deployment Lead / DevOps Lead:** Yeuri Jessel Reyes — [contact per team directory]
2. **Application Owner / Product Owner:** [Name] — [contact per team directory]
3. **Operations Lead:** [Name] — [contact per team directory] (escalate if rollback is not complete within 30 minutes)

### 6.4 Rollback Steps

> Record the commit hash of the deployment being rolled back (captured in Step 1.3) before executing these steps.

| Step | Action | Command / Procedure | Expected Result | Owner |
|------|--------|---------------------|-----------------|-------|
| R.1 | Declare rollback | Announce in team communication channel | Team notified; all canary reviewers stop active sessions | Deployment Lead |
| R.2 | Stop the API process | `Ctrl+C` in Terminal 1 (API terminal) | API process exits cleanly | Deployment Lead |
| R.3 | Stop the frontend process | `Ctrl+C` in Terminal 2 (frontend terminal) | Next.js process exits cleanly | Deployment Lead |
| R.4 | Restore database from backup (if data must be preserved) | `cp backups/vacaflow.db.{timestamp} VacaFlow.Api/Data/vacaflow.db` (macOS/Linux) or equivalent Windows command | `vacaflow.db` replaced with backup copy | Deployment Lead |
| R.5 | Alternatively: reset database to clean state | `rm VacaFlow.Api/Data/vacaflow.db` (macOS/Linux) or `del VacaFlow.Api\Data\vacaflow.db` (Windows) | Database file deleted | Deployment Lead |
| R.6 | Revert to previous commit (if applicable) | `git checkout <previous-commit-hash>` | Repository reverted to last known good state | Deployment Lead |
| R.7 | Restore .NET dependencies | `dotnet restore` | Packages restored for reverted version | Deployment Lead |
| R.8 | Re-provision database | `dotnet ef database update --project VacaFlow.Infrastructure --startup-project VacaFlow.Api` | Fresh `vacaflow.db` provisioned with seed data | Deployment Lead |
| R.9 | Restart the API | `dotnet run --project VacaFlow.Api` | API listening on `http://localhost:5000` | Deployment Lead |
| R.10 | Restart the frontend | `cd vacaflow-web && npm run dev` | Frontend listening on `http://localhost:3000` | Deployment Lead |
| R.11 | Run health verification | `curl http://localhost:5000/health` and open `http://localhost:3000` | Both services healthy | Deployment Lead |
| R.12 | Run critical smoke tests | Execute SMK-001 through SMK-008 | All infrastructure tests pass | QA Lead |
| R.13 | Notify team of rollback completion | Send rollback notification (Section 8.3) | Team informed; reviewers aware of current state | Deployment Lead |
| R.14 | Create incident ticket | Log incident in project tracking system | Ticket created with rollback reason, steps taken, and impact | Deployment Lead |

### 6.5 Post-Rollback State

After rollback is complete:

- The database is in a clean seed-data-only state (unless a backup was restored)
- All reviewer sessions must be re-authenticated
- A post-mortem must be scheduled within one business day (see Section 7.2)

---

## 7. Post-Deployment Tasks

### 7.1 Immediate (within 1 hour of successful smoke test sign-off)

- [ ] Record final deployment completion time and duration
- [ ] Send deployment completion notification to all reviewers (Section 8.2)
- [ ] Confirm all three canary stages are signed off (Section 5.6)
- [ ] Log deployment outcome in project tracking system
- [ ] Retain a copy of the smoke test results (Section 5) for QA records

### 7.2 Next Business Day

- [ ] Review any warnings or non-critical errors observed in API terminal output during deployment
- [ ] Confirm `vacaflow.db` is excluded from any accidental `git add` (verify `.gitignore` is effective)
- [ ] Document any deviations from this runbook encountered during execution
- [ ] Update this runbook with lessons learned from the deployment
- [ ] If a rollback occurred: conduct post-mortem meeting and document root cause and preventive actions
- [ ] Archive smoke test sign-off records with project documentation

### 7.3 Ongoing Reviewer Access

During the MVP review window, the following maintenance procedures are available to reviewers:

| Action | Procedure | Reference |
|--------|-----------|-----------|
| Reset database to clean state | Stop API → delete `vacaflow.db` → restart API | INFRA-SPEC-001 §10.6 |
| Add a reviewer user | Log in as Manager and use available user management endpoint, or re-run setup from seed | INFRA-SPEC-001 §9.2 |
| Restart API after crash | `dotnet run --project VacaFlow.Api` from repository root | INFRA-SPEC-001 §10.4 |
| Restart frontend after crash | `cd vacaflow-web && npm run dev` | INFRA-SPEC-001 §10.4 |

---

## 8. Communication Templates

### 8.1 Pre-Deployment Notification

```
Subject: [Scheduled] VacaFlow_03 v1.0 Deployment — 2026-07-22

Team,

VacaFlow_03 version 1.0 will be deployed to local reviewer environments starting on 2026-07-22.

Deployment Method: Canary (progressive reviewer session validation)
Expected Duration: 30–45 minutes for initial setup
Expected Impact: Local machine only — no shared service downtime

Components being deployed:
- Backend API: ASP.NET Core 8 Minimal API (localhost:5000)
- Frontend: Next.js 14 Application (localhost:3000)
- Database: SQLite via EF Core 8 (auto-provisioned)

Reviewer instructions will be shared separately.

Deployment Lead: Yeuri Jessel Reyes
```

### 8.2 Deployment Complete Notification

```
Subject: [Complete] VacaFlow_03 v1.0 Deployed Successfully

Team,

The deployment of VacaFlow_03 version 1.0 has been completed successfully.

Deployment Date: 2026-07-22
Status: Successful — all canary stages passed

Reviewer Access:
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/health

Seeded credentials: See project README for Manager and Employee account details.

If you experience any issues, contact the Deployment Lead: Yeuri Jessel Reyes
```

### 8.3 Rollback Notification

```
Subject: [ALERT] VacaFlow_03 v1.0 Deployment Rolled Back

Team,

The deployment of VacaFlow_03 version 1.0 has been rolled back.

Rollback Reason: [Brief description of failure — e.g., critical smoke test failure SMK-016]
Rollback Completed: [Time]
Current State: Database reset to clean seed state; previous version active

Investigation is in progress. A post-mortem will be scheduled.

Deployment Lead: Yeuri Jessel Reyes
```

---

## 9. Troubleshooting Guide

### 9.1 Common Issues and Resolutions

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Port 5000 already in use | API fails to start: `Address already in use` or `EADDRINUSE` | Identify and stop conflicting process: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows). Terminate the conflicting process or change the API port in `appsettings.Development.json`. |
| Port 3000 already in use | Next.js fails to start or binds to a different port | Same as above but for port 3000. Or set `PORT=3001` environment variable before `npm run dev`. If port changes, update the API CORS allowed origin accordingly. |
| CORS errors in browser console | `Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:3000' has been blocked by CORS policy` | Verify API `Program.cs` CORS policy specifies exact origin `http://localhost:3000` with `AllowCredentials()`. `AllowAnyOrigin()` cannot be combined with `AllowCredentials()` in ASP.NET Core. |
| Login returns 401 but credentials are correct | Authentication cookie not transmitted | Verify the frontend fetch calls use `credentials: 'include'`. Verify cookie `SameSite=Strict` and `HttpOnly` flags. Verify the browser is not blocking third-party cookies (not applicable for localhost-to-localhost). |
| Database not provisioned after API start | `vacaflow.db` not present in `VacaFlow.Api/Data/` | Run `dotnet ef database update --project VacaFlow.Infrastructure --startup-project VacaFlow.Api` manually. Check API startup logs for migration errors. |
| EF Core migration fails | `Your target project 'VacaFlow.Api' doesn't match your migrations assembly` | Verify the `--project` and `--startup-project` flags are correct. Confirm the `VacaFlow.Infrastructure` project is referenced by `VacaFlow.Api`. |
| `dotnet ef` command not found | `'dotnet-ef' is not recognized` | Install globally: `dotnet tool install --global dotnet-ef`. If already installed, run `dotnet tool update --global dotnet-ef`. |
| `npm install` fails with permission errors | `EACCES: permission denied` | On macOS/Linux, avoid using `sudo npm install`. Fix npm directory permissions or use a Node version manager (nvm). |
| API starts but health check returns 404 | `curl http://localhost:5000/health` returns 404 | Verify the `/health` endpoint is mapped in `VacaFlow.Api/Program.cs`. The endpoint must be registered before `app.Run()`. |
| Self-approval not rejected (SMK-016 fails) | Manager can approve their own request — critical failure | Immediate rollback. Verify `SelfApprovalGuard` is wired in the Application layer approval handler and that `HttpContextCurrentUserContext` correctly resolves the authenticated user from `ClaimTypes.NameIdentifier`. |
| SQLite nested transaction error | `InvalidOperationException: A transaction is already in progress` | The application called `ITransactionService.ExecuteInTransactionAsync` within an existing EF Core transaction scope. Review the call site. This is a guard enforced by `EfCoreTransactionService` per ADR-003. |
| `vacaflow.db` accidentally staged for commit | `git status` shows `VacaFlow.Api/Data/vacaflow.db` as modified or new | Run `git rm --cached VacaFlow.Api/Data/vacaflow.db` and verify `.gitignore` contains `VacaFlow.Api/Data/`. Never commit the database file. |
| Frontend shows blank page after login | No visible errors but dashboard does not render | Open browser DevTools console. Check for JavaScript runtime errors or failed API fetch calls. Verify API is running and CORS is correctly configured. |

### 9.2 Log Inspection

**API Logs (Terminal 1):**

The ASP.NET Core API writes logs to the terminal. Key patterns to look for:

```
# Successful startup
Now listening on: http://localhost:5000

# Database provisioned
Applying migration '...'
Done.

# Authentication error (expected for invalid credentials)
warn: ... Authentication failed

# Domain exception (business rule violation)
ExceptionHandlingMiddleware: DomainException - [message]

# Unhandled error (triggers rollback consideration)
fail: ... Unhandled exception
```

**Frontend Logs (Terminal 2):**

```
# Successful startup
ready started server on localhost:3000

# TypeScript compilation error (triggers rollback consideration)
error - ./src/...
Type error: ...
```

---

## 10. Appendix: Reference Commands

### 10.1 Full Deployment Command Sequence (Happy Path)

```bash
# Step 1: Repository preparation
cd <path-to-vacaflow-repository>
git pull origin main
git rev-parse --short HEAD   # Record commit hash

# Step 2: Backend restore and build
dotnet restore
dotnet build --configuration Release

# Step 3: Frontend restore
cd vacaflow-web
npm install
cd ..

# Step 4: Database provisioning
dotnet ef database update --project VacaFlow.Infrastructure --startup-project VacaFlow.Api

# Step 5a: Start API (Terminal 1)
dotnet run --project VacaFlow.Api
# → Wait for: "Now listening on: http://localhost:5000"

# Step 5b: Start frontend (Terminal 2)
cd vacaflow-web
npm run dev
# → Wait for: "ready started server on localhost:3000"

# Step 6: Health verification
curl http://localhost:5000/health
# → Expected: HTTP 200

# Open browser: http://localhost:3000
```

### 10.2 Database Reset Command Sequence

```bash
# Stop API (Ctrl+C in Terminal 1)

# Delete database — macOS / Linux
rm VacaFlow.Api/Data/vacaflow.db

# Delete database — Windows
del VacaFlow.Api\Data\vacaflow.db

# Restart API — database re-provisioned with seed data
dotnet run --project VacaFlow.Api
```

### 10.3 Port Conflict Resolution

```bash
# macOS / Linux — find process on port 5000
lsof -i :5000

# macOS / Linux — find process on port 3000
lsof -i :3000

# macOS / Linux — kill process by PID
kill -9 <PID>

# Windows — find process on port 5000
netstat -ano | findstr :5000

# Windows — kill process by PID
taskkill /PID <PID> /F
```

### 10.4 Prerequisite Verification Commands

```bash
dotnet --version    # Expected: 8.0.x
node --version      # Expected: v20.x.x
npm --version       # Expected: 9.x or 10.x
git --version       # Expected: 2.x.x
dotnet ef --version # Expected: 8.0.x
```

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | Yeuri Jessel Reyes (AI Assisted) | Initial release — Local MVP deployment runbook for VacaFlow_03 v1.0 with canary validation strategy |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | DevOps Lead (PM_OVERRIDE — bypassed DevOps Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-22 13:36:23 UTC |

*— End of document —*
