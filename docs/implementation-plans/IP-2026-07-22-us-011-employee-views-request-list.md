# Implementation Plan — US-011: Employee Views Request List and Final Decision

## 1. Metadata

| Field | Value |
|---|---|
| **Plan ID** | IP-2026-07-22-us-011-employee-views-request-list |
| **Date** | 2026-07-22 |
| **Source analysis** | [backlog.md §US-011](../../documentation/05-planning/backlog.md) |
| **Author** | Bsa (AI Assisted) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Impacted stacks** | Backend (VacaFlow.Application, VacaFlow.Infrastructure, VacaFlow.Api), Frontend (vacaflow-web) |
| **Linked ticket** | US-011 |
| **Sprint** | Sprint 4 |

---

## 2. Executive Summary

- **Change:** Add a read-only, owner-scoped query capability so an authenticated Employee can list their own absence requests in every lifecycle state and see the final manager decision (approver identity, decision, comment) for Approved/Rejected requests.
- **Motivation:** Close the feedback loop (FR-ARM-011, FR-LSE-006) — employees learn the outcome of their requests without out-of-band communication.
- **Backend impact:** Two read endpoints (`GET /api/requests` employee branch, `GET /api/requests/{id}`), two read-optimized repository methods on the existing `IRequestRepository`, two query methods on `RequestService`, and two read DTOs. No writes, no state transitions, no new tables.
- **Frontend impact:** A new client page `app/requests/page.tsx` (loading / empty / error / success states) and a presentational `components/RequestCard.tsx` (status badge + decision block), plus two `lib/api.ts` client functions and shared TypeScript types.
- **Global risk:** **L** — read-only slice on an already-scaffolded stack; the only real hazards are cross-employee data leakage and N+1 query shape, both mitigated below.
- **Total effort:** **~19.5 hours** (Backend 10h · Frontend 9.5h · DB 0h).

---

## 3. Scope

### In scope — Backend
- `IRequestRepository.ListByEmployeeAsync(Guid employeeId, CancellationToken)` — `AsNoTracking`, **server-side (SQL `WHERE`) filter** by `employeeId`, joins `AbsenceTypes` (type name) and `LEFT JOIN ApprovalRecords` + `Employees` (approver name) in a single query. Satisfies **AC-001, AC-002, AC-003, BR-IDEN-001**.
- `IRequestRepository.GetDetailByIdAsync(Guid id, CancellationToken)` — single-request projection including `RequestorId` so the service can enforce ownership. Satisfies **AC-004**.
- `RequestService.ListMyRequestsAsync()` / `GetMyRequestAsync(Guid id)` — resolve `employeeId` **exclusively** from `ICurrentUserContext.CurrentUserId` (never from the request body/query), map to the client DTO, and enforce ownership on the detail path.
- `GET /api/requests` — **employee branch**: dispatches on `ICurrentUserContext.CurrentUserRole`; `Employee → ListMyRequestsAsync()`. (The `Manager → queue` branch is owned by US-008.)
- `GET /api/requests/{id}` — owner-scoped detail: `404 NOT_FOUND` when the id does not exist, `403 FORBIDDEN` when it exists but is not owned by the caller (**BR-ROLE-002**), `200` with the request + decision block when owned.

### In scope — Frontend
- `app/requests/page.tsx` — authenticated client page that calls `GET /api/requests` with `credentials:'include'` and renders **loading, empty, error, and success** states; redirects to `/login` on `401`.
- `components/RequestCard.tsx` — presentational card: status badge (text + colour, never colour-only) and a decision block shown only for Approved/Rejected.
- `lib/api.ts` — add `listMyRequests()` and `getRequest(id)`.
- `types/index.ts` — add `RequestStatus`, `Decision`, `RequestSummary`.
- Responsive layout (mobile ≥360 px, tablet ≥768 px, desktop ≥1024 px); WCAG 2.1 AA.

### In scope — Contracts
- `GET /api/requests` (employee role) → `200 RequestResponse[]`.
- `GET /api/requests/{id}` → `200 RequestResponse` | `401` | `403` | `404`.

### Out of scope
- Manager queue branch of `GET /api/requests` (US-008) and manager-scoped detail access.
- Any state mutation (create/edit/submit/cancel/approve/reject) — US-004 … US-010.
- A dedicated request-detail page (`app/requests/[id]/page.tsx`); decision details are shown inline in the list card for this story. The detail endpoint is delivered to satisfy AC-004 and to back a future detail view.
- Pagination / server-side search / sorting UI (not required by MVP; default ordering `CreatedAt DESC`).
- Absence-type list endpoint (US-012), current-user endpoint (US-013).

### Assumptions
- **A-1 (prerequisites exist, do NOT re-scaffold):** The solution, five projects, `VacaFlowDbContext`, cookie auth, `AddInfrastructure()`, `ICurrentUserContext`/`HttpContextCurrentUserContext`, `ITransactionService`, `ExceptionHandlingMiddleware`, `IRequestRepository`/`EfCoreRequestRepository`, the `Employees`/`AbsenceRequests`/`AbsenceTypes`/`ApprovalRecords` tables, and `lib/api.ts` all exist after **US-001 (scaffold), US-002 (login), US-004 (create request)**, and the `ApprovalRecords` table + `ApprovalRecord` are populated after **US-009 / US-010**.
- **A-2 (403 mechanism):** `ForbiddenAccessException` and its `403 FORBIDDEN` mapping in `ExceptionHandlingMiddleware` are introduced with the first ownership check in **US-005**. If this branch is built independently, Phase 2 includes the compilable snippet to create it.
- **A-3 (shared endpoint):** `GET /api/requests` is a shared surface; the `Manager → queue` arm and `RequestService.ListSubmittedForManagerAsync()` exist after **US-008**. US-011 only adds/owns the `Employee` arm.
- **A-4 (enumeration trade-off):** Per AC-004 and BR-ROLE-002, the detail endpoint returns `403` for an existing-but-not-owned request. This reveals id existence. A stricter anti-enumeration alternative (uniform `404`) is documented in §10 as an accepted, low-priority hardening option.
- **A-5 (BR-APPR-003 not applicable here):** The manager-assignment scoping rule (`Employee.AssignedManagerId == currentManagerId`) applies to the manager queue (US-008) and approve/reject (US-009/010), not to this employee-owner-scoped read. Noted for consistency across the 13-plan set.
- **A-6:** JSON is serialized camelCase by the API default (`System.Text.Json`); `DateOnly` serializes as `yyyy-MM-dd`.

---

## 4. Architecture Impact

### Before → After (component view)

```
BEFORE (after US-002/US-004/US-009/US-010)          AFTER (US-011 additions marked *)
────────────────────────────────────────           ──────────────────────────────────────────────
vacaflow-web                                         vacaflow-web
  app/(login|register|requests/new)/page.tsx           app/requests/page.tsx                 *  (list)
  components/(RequestForm|ApprovalQueue).tsx            components/RequestCard.tsx            *
  lib/api.ts  (auth + create)                           lib/api.ts  + listMyRequests/getRequest *
                                                        types/index.ts + RequestSummary/Decision *
        │  fetch (credentials:'include')                        │
        ▼                                                       ▼
VacaFlow.Api                                          VacaFlow.Api
  RequestEndpoints.cs (POST /api/requests)             RequestEndpoints.cs
                                                         GET  /api/requests      (employee arm) *
                                                         GET  /api/requests/{id}                *
        │                                                       │
        ▼                                                       ▼
VacaFlow.Application                                  VacaFlow.Application
  IRequestService / RequestService                     RequestService.ListMyRequestsAsync()   *
  IRequestRepository (Get/Create/Update)               RequestService.GetMyRequestAsync(id)    *
                                                        IRequestRepository.ListByEmployeeAsync  *
                                                        IRequestRepository.GetDetailByIdAsync   *
                                                        DTOs: RequestResponse, DecisionResponse *
        │                                                       │
        ▼                                                       ▼
VacaFlow.Infrastructure                               VacaFlow.Infrastructure
  EfCoreRequestRepository (Get/Create/Update)          EfCoreRequestRepository + 2 read queries *
        │                                                       │
        ▼                                                       ▼
SQLite: Employees, AbsenceRequests,                   (unchanged — read-only; no migration)
        AbsenceTypes, ApprovalRecords
```

### API Contract Changes

| Method | Path | Auth | Role | Request | Success | Errors | Owner |
|---|---|---|---|---|---|---|---|
| GET | `/api/requests` | Cookie | Employee arm | none | `200` `RequestResponse[]` | `401` | US-011 (Manager arm US-008) |
| GET | `/api/requests/{id}` | Cookie | any (owner-scoped) | none | `200` `RequestResponse` | `401`, `403 FORBIDDEN`, `404 NOT_FOUND` | US-011 |

**`RequestResponse` (camelCase on the wire):**

```json
{
  "id": "0f1c…",
  "requestorId": "8ab2…",
  "absenceType": "Vacation",
  "startDate": "2026-08-03",
  "endDate": "2026-08-07",
  "status": "Approved",
  "reason": "Family trip",
  "createdAt": "2026-07-20T14:02:11Z",
  "updatedAt": "2026-07-21T09:15:44Z",
  "decision": {
    "decision": "Approved",
    "approverId": "c93d…",
    "approverName": "María Manager",
    "comment": "Enjoy!",
    "decisionDate": "2026-07-21T09:15:44Z"
  }
}
```
`decision` is `null` for `Draft`, `Submitted`, and `Cancelled` requests.

### Frontend State / Routing changes
- New route `/requests` (App Router, client component). Explicit finite state machine: `loading → (ready | error)`; `ready` renders `success` (non-empty list) or `empty`.
- `401` from the API → `router.replace('/login')` (aligns with US-003 AC-003).

### Backend interface changes
- `IRequestRepository` gains two **read** methods (query side). Existing command methods (`GetByIdAsync`, `CreateAsync`, `UpdateAsync`) are unchanged. Rationale (documented decision): list/detail views use a read-optimized projection returning a DTO in a single joined query, avoiding N+1 and over-fetching; write paths keep returning domain entities.

---

## 5. Pre-flight Checklist

- [ ] **Branch:** create `feature/us-011-employee-request-list` from the integration branch.
- [ ] **Backend build green:** `dotnet build VacaFlow.sln` succeeds.
- [ ] **Frontend build green:** `cd vacaflow-web && npm ci && npm run build` succeeds.
- [ ] **Prerequisite US present (do NOT re-scaffold — verify only):**
  - US-001 — solution/projects, `VacaFlowDbContext`, cookie auth, `AddInfrastructure()`, `ExceptionHandlingMiddleware`, `ICurrentUserContext`.
  - US-002 — login establishes the HttpOnly session cookie; `lib/api.ts` + `useCurrentUser` exist; `HttpContextCurrentUserContext` resolves `CurrentUserId`/`CurrentUserRole`.
  - US-004 — `AbsenceRequests` table + `AbsenceRequest` entity + `IRequestRepository`/`EfCoreRequestRepository`; `RequestEndpoints.cs` exists.
  - US-005 — `ForbiddenAccessException` + its `403` mapping in `ExceptionHandlingMiddleware` (assumption A-2; snippet provided in Phase 2 if absent).
  - US-008 — `GET /api/requests` manager arm + `ListSubmittedForManagerAsync()` (assumption A-3; do not modify).
  - US-009 / US-010 — `ApprovalRecords` table + `ApprovalRecord` (Id, RequestId, ApproverId, Decision, Comment?, DecisionDate); required for the decision join (AC-003).
- [ ] **Dependencies:** no new NuGet/npm packages required (EF Core 8, `Microsoft.EntityFrameworkCore.Sqlite`, Next 14 already present).
- [ ] **Test suite baseline:** `dotnet test` and `npm test` pass before changes.
- [ ] **Migrations:** none expected (read-only story); confirm `dotnet ef migrations list` shows no pending model diff after changes.
- [ ] **Analysis reviewed:** [backlog §US-011](../../documentation/05-planning/backlog.md), [business-rules.md](../../documentation/03-requirements/business-rules.md), [tech-doc.md](../../documentation/07-development/tech-doc.md).

---

## 6. Implementation Phases

### Phase 1 — Read DTOs + repository read methods [Stack: Backend]

- **Goal:** Expose a single-query, owner-filtered read path returning request + decision data.
- **Affected files:**
  - [RequestResponse.cs](../../VacaFlow.Application/DTOs/RequestResponse.cs) *(new)*
  - [IRequestRepository.cs](../../VacaFlow.Application/Interfaces/IRequestRepository.cs) *(edit — add 2 methods)*
  - [EfCoreRequestRepository.cs](../../VacaFlow.Infrastructure/Persistence/Repositories/EfCoreRequestRepository.cs) *(edit — implement 2 methods)*
- **Steps:**
  1. Create the read DTOs in `VacaFlow.Application/DTOs/RequestResponse.cs`:
     ```csharp
     namespace VacaFlow.Application.DTOs;

     public sealed record DecisionResponse(
         string Decision,
         Guid ApproverId,
         string ApproverName,
         string? Comment,
         DateTime DecisionDate);

     public sealed record RequestResponse(
         Guid Id,
         Guid RequestorId,
         string AbsenceType,
         DateOnly StartDate,
         DateOnly EndDate,
         string Status,
         string? Reason,
         DateTime CreatedAt,
         DateTime UpdatedAt,
         DecisionResponse? Decision);
     ```
  2. Add the read methods to `IRequestRepository` (keep existing command methods intact):
     ```csharp
     using VacaFlow.Application.DTOs;

     Task<IReadOnlyList<RequestResponse>> ListByEmployeeAsync(
         Guid employeeId, CancellationToken cancellationToken = default);

     Task<RequestResponse?> GetDetailByIdAsync(
         Guid id, CancellationToken cancellationToken = default);
     ```
  3. Implement both in `EfCoreRequestRepository` as a **single joined, projected, no-tracking** query (server-side filter + LEFT JOIN to the append-only `ApprovalRecords`, LEFT JOIN to `Employees` for the approver name):
     ```csharp
     using Microsoft.EntityFrameworkCore;
     using VacaFlow.Application.DTOs;

     public async Task<IReadOnlyList<RequestResponse>> ListByEmployeeAsync(
         Guid employeeId, CancellationToken cancellationToken = default)
     {
         return await BuildProjection()
             .Where(r => r.RequestorId == employeeId)          // BR-IDEN-001: server-side owner filter
             .OrderByDescending(r => r.CreatedAt)
             .ToListAsync(cancellationToken);
     }

     public async Task<RequestResponse?> GetDetailByIdAsync(
         Guid id, CancellationToken cancellationToken = default)
     {
         return await BuildProjection()
             .Where(r => r.Id == id)
             .FirstOrDefaultAsync(cancellationToken);
     }

     // Single translated SQL query: 1 filter + 2 LEFT JOINs, no N+1, AsNoTracking.
     private IQueryable<RequestResponse> BuildProjection() =>
         from r in _db.AbsenceRequests.AsNoTracking()
         join t in _db.AbsenceTypes on r.AbsenceTypeId equals t.Id
         join arj in _db.ApprovalRecords on r.Id equals arj.RequestId into recs
         from ar in recs.DefaultIfEmpty()
         join apj in _db.Employees on ar.ApproverId equals apj.Id into apprs
         from approver in apprs.DefaultIfEmpty()
         select new RequestResponse(
             r.Id,
             r.RequestorId,
             t.Name,
             r.StartDate,
             r.EndDate,
             r.Status,
             r.Reason,
             r.CreatedAt,
             r.UpdatedAt,
             ar == null
                 ? null
                 : new DecisionResponse(
                     ar.Decision, ar.ApproverId, approver.FullName, ar.Comment, ar.DecisionDate));
     ```
     > `_db` is the injected `VacaFlowDbContext` field already present on the repository. If the entity uses a `Reason` column named `Notes`, map `r.Notes` instead (verify against the US-004 model). DbSet names (`AbsenceRequests`, `AbsenceTypes`, `ApprovalRecords`, `Employees`) per the shared data model.
- **Validation:** `dotnet build` green; add a repository integration test (Phase 4) proving the query filters by `employeeId` and populates `Decision` only for Approved/Rejected. Manually inspect the translated SQL via `--verbose` logging (single `SELECT`, two `LEFT JOIN`s).
- **Rollback:** `git checkout -- VacaFlow.Application/DTOs/RequestResponse.cs VacaFlow.Application/Interfaces/IRequestRepository.cs VacaFlow.Infrastructure/Persistence/Repositories/EfCoreRequestRepository.cs` (or revert the phase commit).
- **Estimated effort:** 3h.
- **Dependencies:** none (prerequisite US per Pre-flight).

---

### Phase 2 — RequestService query methods + ownership guard [Stack: Backend]

- **Goal:** Add identity-scoped read operations that never trust caller-supplied ids and enforce ownership on the detail path.
- **Affected files:**
  - [IRequestService.cs](../../VacaFlow.Application/Interfaces/IRequestService.cs) *(edit)*
  - [RequestService.cs](../../VacaFlow.Application/Services/RequestService.cs) *(edit)*
  - [ForbiddenAccessException.cs](../../VacaFlow.Application/Exceptions/ForbiddenAccessException.cs) *(verify from US-005; create only if absent — A-2)*
- **Steps:**
  1. If `ForbiddenAccessException` does **not** already exist (A-2), create `VacaFlow.Application/Exceptions/ForbiddenAccessException.cs` and add the mapping `ForbiddenAccessException → 403 { "code": "FORBIDDEN" }` to `ExceptionHandlingMiddleware` (do not duplicate if US-005 already added it):
     ```csharp
     namespace VacaFlow.Application.Exceptions;

     public sealed class ForbiddenAccessException : Exception
     {
         public ForbiddenAccessException(string message = "You are not allowed to access this resource.")
             : base(message) { }
     }
     ```
  2. Extend `IRequestService`:
     ```csharp
     using VacaFlow.Application.DTOs;

     Task<IReadOnlyList<RequestResponse>> ListMyRequestsAsync(
         CancellationToken cancellationToken = default);

     Task<RequestResponse> GetMyRequestAsync(
         Guid id, CancellationToken cancellationToken = default);
     ```
  3. Implement in `RequestService` (constructor-injected `IRequestRepository _requestRepository` and `ICurrentUserContext _currentUser` already present):
     ```csharp
     using VacaFlow.Application.DTOs;
     using VacaFlow.Application.Exceptions;

     public Task<IReadOnlyList<RequestResponse>> ListMyRequestsAsync(
         CancellationToken cancellationToken = default) =>
         // BR-IDEN-001: employee id comes ONLY from the validated session context.
         _requestRepository.ListByEmployeeAsync(_currentUser.CurrentUserId, cancellationToken);

     public async Task<RequestResponse> GetMyRequestAsync(
         Guid id, CancellationToken cancellationToken = default)
     {
         var request = await _requestRepository.GetDetailByIdAsync(id, cancellationToken);
         if (request is null)
             throw new NotFoundException($"Request '{id}' was not found.");        // AC-004 → 404

         if (request.RequestorId != _currentUser.CurrentUserId)
             throw new ForbiddenAccessException();                                  // AC-004 / BR-ROLE-002 → 403

         return request;
     }
     ```
     > `NotFoundException` is the existing domain exception (mapped to `404` by the middleware). The list path needs no ownership check because the SQL `WHERE` already restricts rows to the caller.
- **Validation:** `dotnet build` green; Application unit tests (Phase 4) with in-memory fakes prove: (a) `ListMyRequestsAsync` passes `CurrentUserId` unchanged; (b) `GetMyRequestAsync` throws `NotFoundException` for missing id, `ForbiddenAccessException` for another owner, and returns the DTO for the owner.
- **Rollback:** revert the phase commit; delete `ForbiddenAccessException.cs` **only if** this phase created it.
- **Estimated effort:** 2h.
- **Dependencies:** Phase 1.

---

### Phase 3 — API endpoints (list employee arm + detail) [Stack: Backend]

- **Goal:** Surface the two read endpoints without disturbing the US-008 manager arm.
- **Affected files:**
  - [RequestEndpoints.cs](../../VacaFlow.Api/Endpoints/RequestEndpoints.cs) *(edit)*
- **Steps:**
  1. Add the employee arm to the shared `GET /api/requests` handler. Dispatch on role; leave the manager arm (US-008) untouched:
     ```csharp
     using VacaFlow.Application.Interfaces;
     using VacaFlow.Domain.ValueObjects; // UserRole

     group.MapGet("/", async (
             IRequestService requestService,
             ICurrentUserContext currentUser,
             CancellationToken ct) =>
         {
             // US-011 employee arm; Manager arm delegates to US-008 service method.
             return currentUser.CurrentUserRole == UserRole.Manager
                 ? Results.Ok(await requestService.ListSubmittedForManagerAsync(ct)) // [US-008]
                 : Results.Ok(await requestService.ListMyRequestsAsync(ct));         // US-011
         })
         .RequireAuthorization();
     ```
     > If US-008 is not yet merged on this branch, temporarily return only the employee arm (`Results.Ok(await requestService.ListMyRequestsAsync(ct))`) and add the manager dispatch when US-008 lands. Do not implement `ListSubmittedForManagerAsync` here.
  2. Add the owner-scoped detail endpoint:
     ```csharp
     group.MapGet("/{id:guid}", async (
             Guid id,
             IRequestService requestService,
             CancellationToken ct) =>
         {
             var request = await requestService.GetMyRequestAsync(id, ct);
             return Results.Ok(request);
         })
         .RequireAuthorization();
     ```
     > `group` is the existing `/api/requests` route group created in US-004. `RequireAuthorization()` guarantees `401` for missing/invalid cookies (BR-IDEN-002); `403`/`404` come from the service exceptions via `ExceptionHandlingMiddleware`. No id is ever read from the body/query for identity.
- **Validation:** `dotnet build` green; API integration tests (Phase 4) using `WebApplicationFactory` assert: unauthenticated → `401`; employee with 0 requests → `200 []`; employee with mixed states → own requests only; detail of a foreign request → `403`; detail of a non-existent id → `404`.
- **Rollback:** revert the phase commit (removes the two `MapGet` registrations only).
- **Estimated effort:** 2h.
- **Dependencies:** Phase 2.

---

### Phase 4 — Backend tests (unit + integration) [Stack: Backend]

- **Goal:** Prove business rules and ownership scoping; reach ≥80% coverage on changed backend code.
- **Affected files:**
  - [RequestServiceReadTests.cs](../../VacaFlow.Tests/Application/RequestServiceReadTests.cs) *(new)*
  - [FakeRequestRepository.cs](../../VacaFlow.Tests/Fakes/FakeRequestRepository.cs) *(edit — implement the 2 read methods)*
  - [FakeCurrentUserContext.cs](../../VacaFlow.Tests/Fakes/FakeCurrentUserContext.cs) *(verify — reuse)*
  - [RequestListEndpointTests.cs](../../VacaFlow.Tests/Api/RequestListEndpointTests.cs) *(new, integration)*
- **Steps:**
  1. Extend the hand-written `FakeRequestRepository` (no Moq) to serve in-memory `RequestResponse` lists filtered by `employeeId` and a keyed detail lookup.
  2. Add Application unit tests (AAA, `Method_ExpectedBehavior_WhenCondition`):
     - `ListMyRequestsAsync_ReturnsOnlyCallerRequests_WhenMultipleOwnersExist` (AC-001).
     - `ListMyRequestsAsync_ReturnsAllStates_WhenRequestsInEachState` (AC-002).
     - `ListMyRequestsAsync_IncludesDecision_WhenApprovedOrRejected` and `…_DecisionIsNull_WhenDraftSubmittedCancelled` (AC-003).
     - `ListMyRequestsAsync_ReturnsEmpty_WhenNoRequests` (AC-005).
     - `GetMyRequestAsync_Throws404_WhenIdMissing`, `GetMyRequestAsync_Throws403_WhenNotOwner`, `GetMyRequestAsync_ReturnsRequest_WhenOwner` (AC-004).
  3. Add integration tests over the real endpoints (in-memory SQLite + seeded data + authenticated cookie) covering the same matrix plus `401` when unauthenticated.
  4. Run coverage:
     ```powershell
     dotnet test VacaFlow.sln --collect:"XPlat Code Coverage"
     ```
- **Validation:** all tests green; changed-line coverage ≥80% for the new DTO/repository/service/endpoint code.
- **Rollback:** revert the phase commit (test-only; no production impact).
- **Estimated effort:** 3h.
- **Dependencies:** Phases 1–3.

---

### Phase 5 — Shared TypeScript types + API client functions [Stack: Frontend]

- **Goal:** Type the contract and add fetch helpers with correct auth and error handling.
- **Affected files:**
  - [index.ts](../../vacaflow-web/src/types/index.ts) *(edit)*
  - [api.ts](../../vacaflow-web/src/lib/api.ts) *(edit)*
- **Steps:**
  1. Add types to `types/index.ts`:
     ```ts
     export type RequestStatus =
       | 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Cancelled';

     export type DecisionOutcome = 'Approved' | 'Rejected';

     export interface Decision {
       decision: DecisionOutcome;
       approverId: string;
       approverName: string;
       comment: string | null;
       decisionDate: string; // ISO-8601
     }

     export interface RequestSummary {
       id: string;
       requestorId: string;
       absenceType: string;
       startDate: string; // yyyy-MM-dd
       endDate: string;   // yyyy-MM-dd
       status: RequestStatus;
       reason: string | null;
       createdAt: string;
       updatedAt: string;
       decision: Decision | null;
     }
     ```
  2. Add client functions to `lib/api.ts` (reuse the existing `API_BASE_URL`/`ApiError`; the minimal `ApiError` below is included only if it does not already exist):
     ```ts
     import { RequestSummary } from '@/types';

     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

     export class ApiError extends Error {
       constructor(public code: string, public status: number, message?: string) {
         super(message ?? code);
         this.name = 'ApiError';
       }
     }

     async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
       const res = await fetch(`${API_BASE_URL}${path}`, {
         method: 'GET',
         credentials: 'include',                 // send the HttpOnly session cookie
         headers: { Accept: 'application/json' },
         signal,
       });
       if (!res.ok) {
         const body = await res.json().catch(() => null);
         throw new ApiError(body?.code ?? 'REQUEST_FAILED', res.status, body?.message);
       }
       return res.json() as Promise<T>;
     }

     export const listMyRequests = (signal?: AbortSignal) =>
       getJson<RequestSummary[]>('/api/requests', signal);

     export const getRequest = (id: string, signal?: AbortSignal) =>
       getJson<RequestSummary>(`/api/requests/${encodeURIComponent(id)}`, signal);
     ```
     > `encodeURIComponent` prevents path injection (OWASP A03). No identity is stored client-side; the cookie is the sole credential.
- **Validation:** `npm run build` (type-check) green; `listMyRequests`/`getRequest` type-resolve against `RequestSummary`.
- **Rollback:** revert the phase commit.
- **Estimated effort:** 1.5h.
- **Dependencies:** Phase 3 (endpoints live) for runtime; type work is contract-only.

---

### Phase 6 — RequestCard component (badge + decision block) [Stack: Frontend]

- **Goal:** Accessible, presentational card rendering one request and its decision.
- **Affected files:**
  - [RequestCard.tsx](../../vacaflow-web/src/components/RequestCard.tsx) *(new)*
- **Steps:**
  1. Create `components/RequestCard.tsx` (pure presentational — no fetching):
     ```tsx
     import { RequestSummary, RequestStatus } from '@/types';

     const STATUS_LABEL: Record<RequestStatus, string> = {
       Draft: 'Draft', Submitted: 'Submitted', Approved: 'Approved',
       Rejected: 'Rejected', Cancelled: 'Cancelled',
     };

     // Colour is redundant to the text label (WCAG 1.4.1 — never colour-only).
     const STATUS_CLASS: Record<RequestStatus, string> = {
       Draft: 'badge badge--neutral', Submitted: 'badge badge--info',
       Approved: 'badge badge--success', Rejected: 'badge badge--danger',
       Cancelled: 'badge badge--muted',
     };

     export function RequestCard({ request }: { request: RequestSummary }) {
       const { absenceType, startDate, endDate, status, reason, decision } = request;
       return (
         <li className="request-card">
           <div className="request-card__header">
             <h3 className="request-card__title">{absenceType}</h3>
             <span className={STATUS_CLASS[status]} aria-label={`Status: ${STATUS_LABEL[status]}`}>
               {STATUS_LABEL[status]}
             </span>
           </div>

           <dl className="request-card__meta">
             <div><dt>From</dt><dd>{startDate}</dd></div>
             <div><dt>To</dt><dd>{endDate}</dd></div>
             {reason ? <div><dt>Reason</dt><dd>{reason}</dd></div> : null}
           </dl>

           {decision ? (
             <section className="request-card__decision" aria-label="Manager decision">
               <p>
                 <strong>{decision.decision}</strong> by {decision.approverName}
                 {' '}on {new Date(decision.decisionDate).toLocaleDateString()}
               </p>
               {decision.comment ? <p className="decision__comment">“{decision.comment}”</p> : null}
             </section>
           ) : null}
         </li>
       );
     }
     ```
     > Content is rendered as text (React auto-escapes) — no `dangerouslySetInnerHTML` (OWASP A03/XSS). The decision block renders only when `decision !== null`, i.e. Approved/Rejected (AC-003).
- **Validation:** Storybook/unit render (Phase 8) with each status and with/without comment; axe reports no violations.
- **Rollback:** delete the new file / revert the phase commit.
- **Estimated effort:** 2.5h.
- **Dependencies:** Phase 5 (types).

---

### Phase 7 — Requests list page with all UI states [Stack: Frontend]

- **Goal:** Authenticated list page rendering loading / empty / error / success and redirecting on `401`.
- **Affected files:**
  - [requests/page.tsx](../../vacaflow-web/src/app/requests/page.tsx) *(new)*
- **Steps:**
  1. Create `app/requests/page.tsx` as a client component with an explicit state machine:
     ```tsx
     'use client';

     import { useEffect, useState } from 'react';
     import { useRouter } from 'next/navigation';
     import { listMyRequests, ApiError } from '@/lib/api';
     import { RequestSummary } from '@/types';
     import { RequestCard } from '@/components/RequestCard';

     type View =
       | { status: 'loading' }
       | { status: 'error'; message: string }
       | { status: 'ready'; data: RequestSummary[] };

     export default function RequestsPage() {
       const router = useRouter();
       const [view, setView] = useState<View>({ status: 'loading' });
       const [reloadKey, setReloadKey] = useState(0);

       useEffect(() => {
         const controller = new AbortController();
         setView({ status: 'loading' });
         listMyRequests(controller.signal)
           .then((data) => setView({ status: 'ready', data }))
           .catch((err: unknown) => {
             if (controller.signal.aborted) return;
             if (err instanceof ApiError && err.status === 401) {
               router.replace('/login');           // session expired/absent → login (US-003 AC-003)
               return;
             }
             setView({ status: 'error', message: 'We could not load your requests. Please try again.' });
           });
         return () => controller.abort();
       }, [router, reloadKey]);

       if (view.status === 'loading') {
         return <p role="status" aria-live="polite" aria-busy="true">Loading your requests…</p>;
       }
       if (view.status === 'error') {
         return (
           <div role="alert">
             <p>{view.message}</p>
             <button type="button" onClick={() => setReloadKey((k) => k + 1)}>Retry</button>
           </div>
         );
       }
       if (view.data.length === 0) {
         return (
           <section aria-label="Your requests">
             <h1>My requests</h1>
             <p>You have no requests yet.</p>
             <a href="/requests/new">Create your first request</a>
           </section>
         );
       }
       return (
         <section aria-label="Your requests">
           <h1>My requests</h1>
           <ul className="request-list">
             {view.data.map((r) => <RequestCard key={r.id} request={r} />)}
           </ul>
         </section>
       );
     }
     ```
     > `aria-live`/`role="status"` announce loading; `role="alert"` announces errors; the empty state offers a next action; `AbortController` prevents state updates after unmount. Identity is never read from `localStorage` — the cookie carries it.
- **Validation:** manual run (§9) shows all four states; keyboard-only navigation reaches the Retry button and the create link; Lighthouse a11y ≥ 90.
- **Rollback:** delete the new file / revert the phase commit.
- **Estimated effort:** 3h.
- **Dependencies:** Phases 5, 6.

---

### Phase 8 — Frontend tests + accessibility [Stack: Frontend]

- **Goal:** Cover the page state machine and the card; verify a11y; reach ≥80% on changed frontend code.
- **Affected files:**
  - [RequestCard.test.tsx](../../vacaflow-web/src/components/RequestCard.test.tsx) *(new)*
  - [requests-page.test.tsx](../../vacaflow-web/src/app/requests/requests-page.test.tsx) *(new)*
- **Steps:**
  1. `RequestCard` tests: renders badge label per status; shows decision block with approver name + comment only for Approved/Rejected; hides it for Draft/Submitted/Cancelled; `jest-axe` reports zero violations.
  2. Page tests (mock `lib/api`): loading rendered first; success renders one card per item; empty renders the empty state + CTA; error renders the alert + working Retry; `401` triggers `router.replace('/login')`.
  3. Run:
     ```powershell
     cd vacaflow-web; npm test -- --coverage
     ```
- **Validation:** all tests green; coverage ≥80% on changed files; no axe violations.
- **Rollback:** revert the phase commit (test-only).
- **Estimated effort:** 2.5h.
- **Dependencies:** Phases 6, 7.

---

## 7. Database Changes

**No database changes required.** US-011 is read-only over tables created by prior stories (`Employees`, `AbsenceRequests`, `AbsenceTypes` — US-001/US-004; `ApprovalRecords` — US-009/US-010). No new columns, tables, or migrations.

**Optional, non-blocking performance note (0 h in this plan):** the list query filters `AbsenceRequests.RequestorId` and joins `ApprovalRecords.RequestId`. If earlier stories did not already index these foreign keys, a future migration may add covering indexes. Idempotent DDL for reference only (do **not** apply as part of this read-only story unless profiling on real volumes warrants it):

```sql
CREATE INDEX IF NOT EXISTS IX_AbsenceRequests_RequestorId ON AbsenceRequests (RequestorId);
CREATE INDEX IF NOT EXISTS IX_ApprovalRecords_RequestId  ON ApprovalRecords  (RequestId);
```
At MVP data volumes (single-digit users, local SQLite) these are unnecessary; SQLite already indexes primary keys.

---

## 8. Testing Strategy

### Backend
- **Unit (Application, in-memory fakes — no `DbContext`/`HttpContext`):** ownership scoping, all-states inclusion, decision presence/absence, empty result, `404`/`403` on detail (see Phase 4). AAA, `Method_ExpectedBehavior_WhenCondition`.
- **Integration (`WebApplicationFactory` + in-memory/temp SQLite + seeded fixtures + authenticated cookie):** endpoint status codes for `401`/`403`/`404`/`200`, cross-employee isolation, decision join correctness.
- **Mocks:** hand-written fakes in `VacaFlow.Tests/Fakes/` (no Moq/NSubstitute).
- **Coverage:** ≥80% on changed lines (org gate); Domain+Application ≥70% overall.
- **Boundary check:** `grep -r "using Microsoft" VacaFlow.Application/` must return zero (DTOs and service must stay framework-free).

### Frontend
- **Unit/integration (React Testing Library + Jest):** `RequestCard` per status; page state machine (loading/empty/error/success) and `401` redirect (Phase 8).
- **Accessibility:** `jest-axe` on card and page (zero violations); WCAG 2.1 AA; status conveyed by text + colour (1.4.1); loading via `role="status"`/`aria-live`; errors via `role="alert"`; keyboard reachability of Retry and CTA.
- **Coverage:** ≥80% on changed files.

### Cross-cutting
- **Contract test:** the JSON shape returned by `GET /api/requests` matches `RequestSummary` (camelCase; `DateOnly` as `yyyy-MM-dd`; `decision` nullable). A single fixture consumed by both a backend serialization assertion and the frontend type.
- **Regression areas:** confirm the US-008 manager arm of `GET /api/requests` still returns the queue (role dispatch untouched); confirm auth middleware still `401`s unauthenticated calls.

### UX/UI Validation
- **Loading:** `role="status"` + `aria-busy` message shown before data resolves; no layout shift when content replaces it (CLS ≤0.1).
- **Empty:** distinct “You have no requests yet.” copy + a “Create your first request” CTA (never a bare empty list or an error).
- **Error:** `role="alert"` message + working **Retry** that re-runs the fetch; network/5xx never surfaces a stack trace.
- **Success:** semantic `<ul>/<li>` list; each card shows type, dates, status badge (text+colour), and — for Approved/Rejected — approver name, decision, timestamp, and optional comment.
- **Responsive:** single-column ≤767 px, multi-column grid ≥768 px; tap targets ≥44 px.
- **Performance:** LCP ≤2.5 s, CLS ≤0.1 on the list route (local run).

---

## 9. Configuration & Deployment

- **Backend env keys (already defined by US-001; no new keys):** `ConnectionStrings:VacaFlow`, `CookieAuth:*` (HttpOnly, SameSite=Strict, sliding 120 min), `Cors:AllowedOrigin` (must include the web origin so `credentials:'include'` succeeds).
- **Frontend env (`vacaflow-web/.env.local`):** `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000` (existing).
- **Local run order:** start the API first (`dotnet run --project VacaFlow.Api`), then the web app (`cd vacaflow-web && npm run dev`). Log in (US-002) to obtain the session cookie, then open `/requests`.
- **Pipelines:** none (local MVP; no CI/CD, no Docker, no cloud).
- **Feature flags:** none.
- **Performance note:** the list route must meet LCP ≤2.5 s / CLS ≤0.1; keep the loading placeholder the same height as the first card to avoid shift.

---

## 10. Risks & Mitigations

| # | Risk | Prob | Impact | Mitigation | Owner | Stack |
|---|---|---|---|---|---|---|
| R-1 | Cross-employee data leakage (an employee sees another's requests) | L | H | Owner id sourced only from `ICurrentUserContext.CurrentUserId`; SQL `WHERE RequestorId = @caller` on list; explicit ownership guard (`403`) on detail; integration test asserts isolation (AC-001/AC-004, BR-IDEN-001). | BE | BE |
| R-2 | N+1 / slow query from per-request decision + approver lookups | L | M | Single projected query with two `LEFT JOIN`s (Phase 1); assert one `SELECT` in translated SQL; optional FK indexes documented in §7. | BE | BE |
| R-3 | Enumeration via `403` distinguishing existing vs missing ids (A-4) | L | L | Accepted per AC-004/BR-ROLE-002; generic message, no resource detail leaked. Stricter uniform-`404` available if hardening is required later. | BE | BE |
| R-4 | Merge conflict on the shared `GET /api/requests` handler with US-008 | M | M | Role-dispatch pattern that adds only the employee arm; fallback single-arm handler documented in Phase 3; coordinate merge order (US-008 first). | BE | Cross |
| R-5 | Status conveyed by colour only (WCAG 1.4.1 failure) | M | H | Badge always renders the text label alongside colour; `jest-axe` gate in Phase 8. | FE | FE |
| R-6 | Missing UI states (blank screen on empty/error) degrade UX | M | H | Explicit finite state machine in the page with dedicated loading/empty/error/success branches (Phase 7); state coverage in Phase 8. | FE | FE |
| R-7 | CORS/cookie misconfig blocks `credentials:'include'` locally | L | M | Verify `Cors:AllowedOrigin` includes the web origin and cookie `SameSite`/`Secure` suit `http://localhost`; smoke test after login. | BE | Cross |

---

## 11. Definition of Done

- [ ] **Backend code:** `RequestResponse`/`DecisionResponse` DTOs; `IRequestRepository.ListByEmployeeAsync`/`GetDetailByIdAsync` + EF impl (single joined `AsNoTracking` query); `RequestService.ListMyRequestsAsync`/`GetMyRequestAsync` with session-derived identity and ownership guard; `GET /api/requests` employee arm + `GET /api/requests/{id}`.
- [ ] **Frontend code:** `RequestSummary`/`Decision` types; `listMyRequests`/`getRequest` client fns (`credentials:'include'`); `RequestCard.tsx`; `app/requests/page.tsx`.
- [ ] **Business rules verified:** BR-IDEN-001 (identity from session), BR-ROLE-002 (owner-only access → `403`); list returns own requests in all states with decision details for Approved/Rejected (AC-001…AC-005).
- [ ] **Tests:** backend unit + integration and frontend unit + a11y green; ≥80% coverage on changed code (BE and FE).
- [ ] **Accessibility:** WCAG 2.1 AA; `jest-axe` zero violations; status not colour-only; loading `role="status"`, error `role="alert"`; keyboard reachable.
- [ ] **All UI states implemented:** loading, empty, error (with Retry), success; UX score ≥7.
- [ ] **Performance:** LCP ≤2.5 s and CLS ≤0.1 on `/requests` (local).
- [ ] **API docs:** endpoint table + `RequestResponse` schema updated (this plan §4); OpenAPI/Swagger reflects both GET routes.
- [ ] **Shared TS types:** `types/index.ts` matches the server contract (camelCase; `DateOnly` as `yyyy-MM-dd`).
- [ ] **Migrations:** none added; `dotnet ef migrations list` shows no pending model diff.
- [ ] **Boundary grep:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- [ ] **Docs updated;** PR reviewed and approved by ≥1 peer.
- [ ] **Acceptance criteria AC-001 … AC-005 satisfied** and verified in the local environment.

---

## 12. References

- **Source backlog:** [documentation/05-planning/backlog.md §US-011](../../documentation/05-planning/backlog.md)
- **Business rules:** [documentation/03-requirements/business-rules.md](../../documentation/03-requirements/business-rules.md) — BR-IDEN-001, BR-ROLE-002, BR-APPR-001/002 (context for decision records)
- **Functional spec:** [documentation/02-define/functional-spec.md](../../documentation/02-define/functional-spec.md) — FR-ARM-011, FR-LSE-006
- **Architecture (SAD):** [documentation/04-architecture/software-architecture-document.md](../../documentation/04-architecture/software-architecture-document.md) — Reduced Onion (Alt C), `ICurrentUserContext`, cookie auth
- **Tech doc:** [documentation/07-development/tech-doc.md](../../documentation/07-development/tech-doc.md)
- **Code standards:** [documentation/07-development/code-standards.md](../../documentation/07-development/code-standards.md)
- **Non-functional spec:** [documentation/03-requirements/nonfunctional-spec.md](../../documentation/03-requirements/nonfunctional-spec.md)
- **Related user stories:** US-002 (login), US-004 (create request), US-005 (`ForbiddenAccessException` origin), US-008 (manager queue arm of `GET /api/requests`), US-009 / US-010 (ApprovalRecords for the decision join)
- **API base (local):** `http://localhost:5000`

---

*Plan generated by Bsa (AI Assisted) via the Implementation_Plan_Generator skill — 2026-07-22.*
