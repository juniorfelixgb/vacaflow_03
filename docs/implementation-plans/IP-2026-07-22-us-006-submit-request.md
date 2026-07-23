# Implementation Plan — US-006: Submit Request

> 🛠️ **SKILL: Implementation_Plan_Generator**
> 📄 **SOURCE:** [`../../documentation/05-planning/backlog.md` §US-006](../../documentation/05-planning/backlog.md)

---

## 1. Metadata

| Field | Value |
|---|---|
| **Plan ID** | IP-2026-07-22-us-006-submit-request |
| **Date** | 2026-07-22 |
| **Source analysis** | [`../../documentation/05-planning/backlog.md` §US-006](../../documentation/05-planning/backlog.md) |
| **Author** | Bsa (AI Assisted) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Impacted stacks** | Backend (Domain, Application, Api), Frontend (Next.js) |
| **Linked ticket** | US-006 |
| **Depends on** | US-004 (Create Draft Request — aggregate/service/repo/table). US-005 (Edit Draft Request) provides the Draft-only edit guard that AC-004 relies upon. |

---

## 2. Executive Summary

- **Change:** Add the `Draft → Submitted` lifecycle transition. An owner Employee submits a Draft absence request via a new `POST /api/requests/{id}/submit` endpoint, driven by a `AbsenceRequest.Submit()` domain method and `RequestService.SubmitAsync`.
- **Motivation:** FR-ARM-006 / FR-ARM-007 / FR-LSE-001 — a Draft has no visibility to a manager until it is submitted; submission is the hand-off that makes the request read-only for the employee and available for a manager decision (US-008/009/010).
- **Backend impact:** New domain transition (state machine + `Submit()`), new service method with ownership + lifecycle enforcement, one new endpoint, and (idempotent) middleware mapping for the ownership-forbidden case.
- **Frontend impact:** A state-driven **Submit** button in the existing `RequestCard.tsx` (rendered only for the owner's own **Draft**) plus a `submitRequest` helper in `api.ts`. Once submitted, the card exposes no Submit/Edit action (read-only, AC-004).
- **Global risk:** **Low** — small, well-bounded slice on top of an existing aggregate; primary risk is cross-US sequencing (US-005 edit guard, `UpdateAsync` availability).
- **Total effort:** **13 hours** (Backend 8h · Frontend 5h · DB 0h).

---

## 3. Scope

### In scope — Backend
- `RequestStateMachine.EnsureCanTransition(Draft → Submitted)` in the Domain (canonical transition table).
- `AbsenceRequest.Submit()` domain method (delegates to the state machine; never sets `Status` directly).
- `IRequestService.SubmitAsync(Guid requestId)` + `RequestService.SubmitAsync` implementation:
  - **BR-ROLE-002** owner-only → `ForbiddenException` → **403** (AC-003).
  - **BR-LIFE-001** non-Draft submit rejected → `InvalidStateTransitionException` → **422** (AC-002).
  - Missing request → `NotFoundException` → **404**.
- `POST /api/requests/{id}/submit` endpoint (authenticated; identity from session cookie only).
- Idempotent `ForbiddenException → 403 FORBIDDEN` arm in `ExceptionHandlingMiddleware` (added only if absent).

### In scope — Frontend
- `submitRequest(id)` helper in `lib/api.ts` (`credentials: 'include'`, typed error handling).
- State-driven **Submit** button in `components/RequestCard.tsx`: visible only when the card's `status === 'Draft'` and the card belongs to the current user; hidden for every other state (AC-004 read-only).
- Loading / error / success feedback on the button (accessible).
- Responsive/mobile: the action row wraps on narrow breakpoints (no horizontal overflow).

### In scope — Contracts
- New route: `POST /api/requests/{id}/submit` → `204 No Content` on success; `403 | 422 | 404 | 401` per error contract.
- Shared TS status literal type includes `'Submitted'` (already present from US-004 status union).

### Out of scope
- Editing logic and the `PUT /api/requests/{id}` edit guard itself (US-005). This plan only *verifies* that a Submitted request is no longer editable.
- Cancel transition (US-007), manager queue (US-008), approve/reject (US-009/010).
- Absence-type list endpoint (US-012) and `GET /me` (US-013).
- Any notification/email on submission (Won't-v1 W-004).

### Assumptions
- **A1 (prerequisite exists):** US-004 has created `AbsenceRequest` (with `RequestStatus` status property, private setter, `RequestorId`, `UpdatedAt`), `RequestService`, `IRequestRepository` (+ `EfCoreRequestRepository`), the `AbsenceRequests` table (with a `Status` CHECK constraint that already lists `Submitted`), `RequestEndpoints.cs`, `RequestCard.tsx`, `lib/api.ts`, and `types/index.ts`. **These are NOT re-scaffolded here.**
- **A2 (edit guard for AC-004):** US-005 has introduced the Draft-only edit guard (`AbsenceRequest.Update(...)` / `RequestService.UpdateAsync` rejects non-Draft with 422, BR-LIFE-003/FR-ARM-005/FR-LSE-004). AC-004 ("Submitted request is read-only") is satisfied by *this* transition combined with that guard. If US-005 is not yet merged, AC-004 cannot be end-to-end verified until it is — sequence US-005 before US-006 (both Sprint 2, and the backlog orders US-005 before US-006).
- **A3 (`UpdateAsync`):** Persisting the submitted status requires `IRequestRepository.UpdateAsync(AbsenceRequest)`. It is introduced by US-005; this plan **reuses** it if present, otherwise adds it (signature + snippet provided in Phase 2). No re-scaffolding of existing members.
- **A4 (403 exception):** The brief maps "role/ownership forbidden" to 403 but does not enumerate the exception type. This plan names it `ForbiddenException` (in `VacaFlow.Domain/Exceptions/`, **not** a `DomainException` subclass so it does not fall into the 422 mapping) and reuses it if US-005 already introduced it.
- **A5 (BR-APPR-003 manager scoping):** Not directly exercised by US-006 (submission is employee-owner scoped, no manager action here). Recorded for cross-plan consistency: the manager queue/approve/reject (US-008/009/010) scope to `Employee.AssignedManagerId == currentManagerId` per BR-APPR-003 + backlog US-008 AC-001, overriding the `tech-doc` "all pending requests" wording.

---

## 4. Architecture Impact

### Before → After (request-submission slice)

```
BEFORE (after US-004/US-005)                     AFTER (US-006)
────────────────────────────                     ─────────────────────────────
POST /api/requests            (create Draft)      POST /api/requests            (unchanged)
PUT  /api/requests/{id}       (edit Draft)        PUT  /api/requests/{id}       (unchanged; now rejects Submitted)
                                                  POST /api/requests/{id}/submit  ← NEW

AbsenceRequest.Create()                           AbsenceRequest.Create()
AbsenceRequest.Update()  [US-005]                 AbsenceRequest.Update()  [US-005]
                                                  AbsenceRequest.Submit()   ← NEW (Draft→Submitted via state machine)

RequestService.CreateDraftAsync / UpdateAsync     + RequestService.SubmitAsync   ← NEW

RequestCard: [Edit] (Draft only)                  RequestCard: [Edit][Submit] (Draft only) ← Submit NEW
```

Dependency flow is unchanged (strictly inward): `vacaflow-web → Api → Application → Domain`, with `Infrastructure` implementing Application interfaces. No new project references.

### API Contract Changes

| Method | Path | Auth | Role | Request body | Success | Errors |
|---|---|---|---|---|---|---|
| POST | `/api/requests/{id}/submit` | Yes (cookie) | Owner (Employee acting on own request) | *none* | `204 No Content` | `401 UNAUTHORIZED` (no/invalid cookie) · `403 FORBIDDEN` (not owner, BR-ROLE-002) · `404 NOT_FOUND` (unknown id) · `422 DOMAIN_RULE_VIOLATION` (not Draft, BR-LIFE-001) |

Error body shape (existing middleware): `{ "code": "STABLE_CODE", "message": "human text" }` — never a stack trace.

### Frontend state / routing changes
- No new route. `RequestCard.tsx` gains a `status`-driven **Submit** action and local optimistic status update on success (`Draft → Submitted`), which removes the Submit/Edit actions (read-only, AC-004).
- Identity/authorization is mirrored from server state (card only renders for the owner's own requests, and Submit only for `status === 'Draft'`).

### Backend interface changes
- `IRequestService`: **+** `Task SubmitAsync(Guid requestId);`
- `IRequestRepository`: `Task UpdateAsync(AbsenceRequest request);` — **reuse** (from US-005) or add if absent.
- `RequestStateMachine`: ensure `Draft → Submitted` transition present.
- `VacaFlow.Domain/Exceptions/ForbiddenException.cs`: **reuse or add** (403 mapping).

---

## 5. Pre-flight Checklist

- [ ] **Branch:** work on `feature/yreyes/us006-submit-request` cut from the integration branch (do not commit to `main`/`0-setup-inicial`).
- [ ] **Prerequisite US-004 present (do NOT re-scaffold):** confirm the following exist and build —
  - `VacaFlow.Domain/Entities/AbsenceRequest.cs` (with `RequestStatus Status { get; private set; }`, `Guid RequestorId`, `DateTime UpdatedAt { get; private set; }`).
  - `VacaFlow.Domain/ValueObjects/RequestStatus.cs` (enum `Draft, Submitted, Approved, Rejected, Cancelled`) *(or wherever US-004 placed it)*.
  - `VacaFlow.Application/Interfaces/IRequestService.cs`, `IRequestRepository.cs`, `ICurrentUserContext.cs`.
  - `VacaFlow.Application/Services/RequestService.cs` (constructor already injects `IRequestRepository`, `ICurrentUserContext`).
  - `VacaFlow.Infrastructure/Persistence/Repositories/EfCoreRequestRepository.cs` and the `AbsenceRequests` table/migration.
  - `VacaFlow.Api/Endpoints/RequestEndpoints.cs`, `VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs`.
  - `vacaflow-web/src/components/RequestCard.tsx`, `vacaflow-web/src/lib/api.ts`, `vacaflow-web/src/types/index.ts`.
- [ ] **Prerequisite US-005 recommended (AC-004 + `UpdateAsync`):** confirm the Draft-only edit guard and `IRequestRepository.UpdateAsync` exist; if not, note the deviations flagged in §3 A2/A3.
- [ ] **Build green (baseline):** `dotnet build VacaFlow.sln` and `npm --prefix vacaflow-web run build` both succeed before starting.
- [ ] **Dependencies:** no new NuGet/npm packages required.
- [ ] **Test suite baseline:** `dotnet test VacaFlow.sln` and `npm --prefix vacaflow-web test` pass before changes.
- [ ] **Migrations:** none expected (see §7). Confirm the `AbsenceRequests.Status` CHECK constraint already permits `'Submitted'` (created by US-004); if it does not, that is a US-004 defect — raise separately, do not silently alter here.
- [ ] **Analysis reviewed:** backlog §US-006 (AC-001..AC-004) and business rules BR-ROLE-002, BR-LIFE-001, BR-LIFE-003, BR-010 read.

---

## 6. Implementation Phases

### Phase 1 — Domain: `Draft → Submitted` transition + `Submit()` [Stack: Backend]

- **Goal:** Introduce the state-machine transition and the `Submit()` domain method so status changes flow only through the domain.
- **Affected files:**
  - [`VacaFlow.Domain/StateMachine/RequestStateMachine.cs`](../../VacaFlow.Domain/StateMachine/RequestStateMachine.cs)
  - [`VacaFlow.Domain/Entities/AbsenceRequest.cs`](../../VacaFlow.Domain/Entities/AbsenceRequest.cs)
  - [`VacaFlow.Domain/Exceptions/InvalidStateTransitionException.cs`](../../VacaFlow.Domain/Exceptions/InvalidStateTransitionException.cs) (reuse)
  - [`VacaFlow.Domain/Exceptions/ForbiddenException.cs`](../../VacaFlow.Domain/Exceptions/ForbiddenException.cs) (reuse or add)
- **Steps:**
  1. Ensure `RequestStateMachine` exposes the canonical transition table. If the class already exists from an earlier US, only confirm the `Draft → { Submitted, Cancelled }` entry is present; otherwise create it exactly as below.

     ```csharp
     using VacaFlow.Domain.Exceptions;
     using VacaFlow.Domain.ValueObjects;

     namespace VacaFlow.Domain.StateMachine;

     public static class RequestStateMachine
     {
         private static readonly IReadOnlyDictionary<RequestStatus, IReadOnlySet<RequestStatus>> Allowed =
             new Dictionary<RequestStatus, IReadOnlySet<RequestStatus>>
             {
                 [RequestStatus.Draft] = new HashSet<RequestStatus> { RequestStatus.Submitted, RequestStatus.Cancelled },
                 [RequestStatus.Submitted] = new HashSet<RequestStatus> { RequestStatus.Approved, RequestStatus.Rejected, RequestStatus.Cancelled },
                 [RequestStatus.Approved] = new HashSet<RequestStatus>(),
                 [RequestStatus.Rejected] = new HashSet<RequestStatus>(),
                 [RequestStatus.Cancelled] = new HashSet<RequestStatus>(),
             };

         public static bool CanTransition(RequestStatus from, RequestStatus to)
             => Allowed.TryGetValue(from, out var targets) && targets.Contains(to);

         public static void EnsureCanTransition(RequestStatus from, RequestStatus to)
         {
             if (!CanTransition(from, to))
             {
                 throw new InvalidStateTransitionException(from.ToString(), to.ToString());
             }
         }
     }
     ```
  2. Confirm `InvalidStateTransitionException` exists (foundational). Reference definition (do not duplicate if present):

     ```csharp
     namespace VacaFlow.Domain.Exceptions;

     public sealed class InvalidStateTransitionException : DomainException
     {
         public InvalidStateTransitionException(string from, string to)
             : base($"Cannot transition request from '{from}' to '{to}'.") { }
     }
     ```
  3. Add `ForbiddenException` (reuse if US-005 added it). It is a plain `Exception` (NOT a `DomainException`) so the middleware maps it to 403, not 422:

     ```csharp
     namespace VacaFlow.Domain.Exceptions;

     public sealed class ForbiddenException : Exception
     {
         public ForbiddenException(string message) : base(message) { }
     }
     ```
  4. Add the `Submit()` method to `AbsenceRequest` (append inside the entity; `Status`/`UpdatedAt` keep their existing private setters):

     ```csharp
     public void Submit()
     {
         RequestStateMachine.EnsureCanTransition(Status, RequestStatus.Submitted);
         Status = RequestStatus.Submitted;
         UpdatedAt = DateTime.UtcNow;
     }
     ```
- **Validation:** `dotnet build VacaFlow.Domain` succeeds; boundary check `grep -r "using Microsoft" VacaFlow.Domain/` returns zero. Domain unit tests added in Phase 4 pass.
- **Rollback:** Revert the commit for this phase (`git revert <sha>`), or remove `Submit()` and the `Draft→Submitted` entry; the state machine/exception files fall back to their prior state.
- **Estimated effort:** 2h.
- **Dependencies:** none (US-004 aggregate + `RequestStatus` enum already exist).

---

### Phase 2 — Application: `SubmitAsync` (ownership + lifecycle) [Stack: Backend]

- **Goal:** Orchestrate submission — resolve identity from session, enforce owner-only, invoke the domain transition, persist.
- **Affected files:**
  - [`VacaFlow.Application/Interfaces/IRequestService.cs`](../../VacaFlow.Application/Interfaces/IRequestService.cs)
  - [`VacaFlow.Application/Services/RequestService.cs`](../../VacaFlow.Application/Services/RequestService.cs)
  - [`VacaFlow.Application/Interfaces/IRequestRepository.cs`](../../VacaFlow.Application/Interfaces/IRequestRepository.cs) (reuse/ensure `UpdateAsync`)
  - [`VacaFlow.Infrastructure/Persistence/Repositories/EfCoreRequestRepository.cs`](../../VacaFlow.Infrastructure/Persistence/Repositories/EfCoreRequestRepository.cs) (reuse/ensure `UpdateAsync`)
- **Steps:**
  1. Add to `IRequestService`:

     ```csharp
     Task SubmitAsync(Guid requestId);
     ```
  2. Ensure `IRequestRepository` declares (reuse from US-005 if present):

     ```csharp
     Task<AbsenceRequest?> GetByIdAsync(Guid id);
     Task UpdateAsync(AbsenceRequest request);
     ```
  3. If `EfCoreRequestRepository.UpdateAsync` is absent, add it (parameterized via EF — no raw SQL, OWASP A03):

     ```csharp
     public async Task UpdateAsync(AbsenceRequest request)
     {
         _dbContext.AbsenceRequests.Update(request);
         await _dbContext.SaveChangesAsync();
     }
     ```
  4. Implement `SubmitAsync` in `RequestService` (identity strictly from `ICurrentUserContext`; body carries no ids — OWASP A01/BR-ROLE-002):

     ```csharp
     public async Task SubmitAsync(Guid requestId)
     {
         var request = await _requestRepository.GetByIdAsync(requestId)
             ?? throw new NotFoundException(nameof(AbsenceRequest), requestId);

         // BR-ROLE-002: only the owner may submit (403). Identity comes from the session, never the body.
         if (request.RequestorId != _currentUser.CurrentUserId)
         {
             throw new ForbiddenException("You may only submit your own requests.");
         }

         // BR-LIFE-001: Draft -> Submitted only; throws InvalidStateTransitionException (422) otherwise.
         request.Submit();

         await _requestRepository.UpdateAsync(request);
     }
     ```
     > Single-row update ⇒ no explicit `ITransactionService` wrapping (it is reserved for multi-entity atomic writes in US-009/010, avoiding the nested-transaction 500 path). `_requestRepository` and `_currentUser` are the constructor-injected fields created by US-004.
- **Validation:** `dotnet build VacaFlow.Application VacaFlow.Infrastructure` succeeds; boundary check `grep -r "using Microsoft" VacaFlow.Application/` returns zero. Application tests (Phase 4) pass.
- **Rollback:** `git revert <sha>`; remove `SubmitAsync` from the interface + service (and `UpdateAsync` only if this phase added it).
- **Estimated effort:** 2h.
- **Dependencies:** Phase 1.

---

### Phase 3 — API: `POST /api/requests/{id}/submit` + 403 mapping [Stack: Backend]

- **Goal:** Expose the submit action over HTTP and ensure ownership-forbidden maps to 403.
- **Affected files:**
  - [`VacaFlow.Api/Endpoints/RequestEndpoints.cs`](../../VacaFlow.Api/Endpoints/RequestEndpoints.cs)
  - [`VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs`](../../VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs)
- **Steps:**
  1. Register the route on the existing authenticated `requests` group (transport only — no business logic in the endpoint):

     ```csharp
     // inside the existing MapRequestEndpoints(...) group builder `requests`
     requests.MapPost("/{id:guid}/submit", async (Guid id, IRequestService requestService) =>
     {
         await requestService.SubmitAsync(id);
         return Results.NoContent();
     })
     .RequireAuthorization()
     .WithName("SubmitRequest");
     ```
     > `{id:guid}` route constraint rejects malformed ids (400 before the handler). No id is read from the body (BR-IDEN-001). `.RequireAuthorization()` yields 401 for missing/invalid cookie.
  2. Ensure `ExceptionHandlingMiddleware` maps `ForbiddenException` to 403 (add the arm only if absent; keep the single stable-code contract, never leak stack traces — OWASP A05/A09):

     ```csharp
     var (status, code) = exception switch
     {
         VacaFlow.Domain.Exceptions.NotFoundException              => (StatusCodes.Status404NotFound,   "NOT_FOUND"),
         VacaFlow.Domain.Exceptions.ForbiddenException             => (StatusCodes.Status403Forbidden,  "FORBIDDEN"),
         VacaFlow.Domain.Exceptions.DomainException                => (StatusCodes.Status422UnprocessableEntity, "DOMAIN_RULE_VIOLATION"),
         UnauthorizedAccessException                               => (StatusCodes.Status401Unauthorized, "UNAUTHORIZED"),
         ArgumentException                                         => (StatusCodes.Status400BadRequest,  "VALIDATION_ERROR"),
         _                                                         => (StatusCodes.Status500InternalServerError, "INTERNAL_ERROR"),
     };
     // response body: new { code, message = status == 500 ? "An unexpected error occurred." : exception.Message }
     ```
     > `ForbiddenException` is matched **before** `DomainException` (it does not inherit it), and both are matched before the `_` fallthrough. `InvalidStateTransitionException : DomainException` therefore correctly yields 422.
- **Validation:** `dotnet build VacaFlow.Api` succeeds. Manual smoke (after `dotnet run --project VacaFlow.Api`): submitting an owned Draft returns `204`; another user's Draft returns `403`; a Submitted request returns `422`; an unknown id returns `404`; no cookie returns `401`. No stack trace in any body.
- **Rollback:** `git revert <sha>`; remove the `MapPost(".../submit")` line (and the `ForbiddenException` arm only if this phase added it).
- **Estimated effort:** 1.5h.
- **Dependencies:** Phase 2.

---

### Phase 4 — Backend tests (Domain + Application) [Stack: Backend]

- **Goal:** Prove the transition and the authorization/lifecycle rules with hermetic unit tests (xUnit + hand-written fakes, no Moq).
- **Affected files:**
  - [`VacaFlow.Tests/Domain/AbsenceRequestSubmitTests.cs`](../../VacaFlow.Tests/Domain/AbsenceRequestSubmitTests.cs)
  - [`VacaFlow.Tests/Application/RequestServiceSubmitTests.cs`](../../VacaFlow.Tests/Application/RequestServiceSubmitTests.cs)
  - [`VacaFlow.Tests/Fakes/FakeRequestRepository.cs`](../../VacaFlow.Tests/Fakes/FakeRequestRepository.cs) (reuse/extend)
  - [`VacaFlow.Tests/Fakes/FakeCurrentUserContext.cs`](../../VacaFlow.Tests/Fakes/FakeCurrentUserContext.cs) (reuse)
- **Steps:**
  1. Domain tests (AAA, `Method_ExpectedBehavior_WhenCondition`):

     ```csharp
     [Fact]
     public void Submit_TransitionsToSubmitted_WhenDraft()
     {
         var request = AbsenceRequestTestFactory.NewDraft();   // reuse US-004/US-005 test factory
         request.Submit();
         Assert.Equal(RequestStatus.Submitted, request.Status);
     }

     [Theory]
     [InlineData(RequestStatus.Submitted)]
     [InlineData(RequestStatus.Approved)]
     [InlineData(RequestStatus.Rejected)]
     [InlineData(RequestStatus.Cancelled)]
     public void Submit_ThrowsInvalidStateTransition_WhenNotDraft(RequestStatus initial)
     {
         var request = AbsenceRequestTestFactory.InState(initial);
         Assert.Throws<InvalidStateTransitionException>(() => request.Submit());
     }
     ```
  2. Application tests (fakes only — no `DbContext`/`HttpContext`):

     ```csharp
     [Fact]
     public async Task SubmitAsync_TransitionsAndPersists_WhenOwnerAndDraft()   // AC-001
     {
         var ownerId = Guid.NewGuid();
         var draft = AbsenceRequestTestFactory.NewDraft(requestorId: ownerId);
         var repo = new FakeRequestRepository(draft);
         var sut = new RequestService(repo, new FakeCurrentUserContext(ownerId, UserRole.Employee));

         await sut.SubmitAsync(draft.Id);

         Assert.Equal(RequestStatus.Submitted, repo.Saved.Single().Status);
     }

     [Fact]
     public async Task SubmitAsync_ThrowsForbidden_WhenNotOwner()               // AC-003 -> 403
     {
         var draft = AbsenceRequestTestFactory.NewDraft(requestorId: Guid.NewGuid());
         var repo = new FakeRequestRepository(draft);
         var sut = new RequestService(repo, new FakeCurrentUserContext(Guid.NewGuid(), UserRole.Employee));

         await Assert.ThrowsAsync<ForbiddenException>(() => sut.SubmitAsync(draft.Id));
     }

     [Fact]
     public async Task SubmitAsync_ThrowsInvalidStateTransition_WhenNotDraft()  // AC-002 -> 422
     {
         var ownerId = Guid.NewGuid();
         var submitted = AbsenceRequestTestFactory.InState(RequestStatus.Submitted, requestorId: ownerId);
         var repo = new FakeRequestRepository(submitted);
         var sut = new RequestService(repo, new FakeCurrentUserContext(ownerId, UserRole.Employee));

         await Assert.ThrowsAsync<InvalidStateTransitionException>(() => sut.SubmitAsync(submitted.Id));
     }

     [Fact]
     public async Task SubmitAsync_ThrowsNotFound_WhenRequestMissing()          // -> 404
     {
         var repo = new FakeRequestRepository();
         var sut = new RequestService(repo, new FakeCurrentUserContext(Guid.NewGuid(), UserRole.Employee));

         await Assert.ThrowsAsync<NotFoundException>(() => sut.SubmitAsync(Guid.NewGuid()));
     }
     ```
  3. AC-004 read-only assertion (requires US-005 edit path; keep in a US-005-aware test, skip-guard if edit method absent): after `Submit()`, calling `RequestService.UpdateAsync` on the now-Submitted request throws `InvalidStateTransitionException` (422).
- **Validation:** `dotnet test VacaFlow.sln` green; changed-code coverage ≥80% (Domain+Application). Constructor args in snippets match US-004's `RequestService` signature — adjust order if US-004 differs.
- **Rollback:** `git revert <sha>`; delete the added test files.
- **Estimated effort:** 2.5h.
- **Dependencies:** Phases 1–2.

---

### Phase 5 — Frontend: `submitRequest` API helper [Stack: Frontend]

- **Goal:** Add a typed client helper for the submit endpoint (backend already live after Phase 3).
- **Affected files:**
  - [`vacaflow-web/src/lib/api.ts`](../../vacaflow-web/src/lib/api.ts)
  - [`vacaflow-web/src/types/index.ts`](../../vacaflow-web/src/types/index.ts) (confirm `AbsenceRequest.status` union includes `'Submitted'`)
- **Steps:**
  1. Add the helper (reusing the existing `API_BASE_URL` and error-parsing convention from US-004; `credentials: 'include'` per §6):

     ```ts
     // src/lib/api.ts
     export async function submitRequest(id: string): Promise<void> {
       const res = await fetch(`${API_BASE_URL}/api/requests/${id}/submit`, {
         method: 'POST',
         credentials: 'include',
       });
       if (!res.ok) {
         const body = (await res.json().catch(() => null)) as { code?: string; message?: string } | null;
         throw new Error(body?.message ?? 'Failed to submit the request.');
       }
     }
     ```
     > No identity is sent in the body (identity is the session cookie). If US-004 already exposes a shared `handleError(res)` helper, use it instead of the inline parse.
  2. Confirm `AbsenceRequest['status']` in `types/index.ts` includes `'Submitted'` (it should, from US-004). No new type needed otherwise.
- **Validation:** `npm --prefix vacaflow-web run build` and `tsc --noEmit` succeed with no `any`. Helper unused until Phase 6 (no runtime behavior change yet).
- **Rollback:** `git revert <sha>`; remove `submitRequest`.
- **Estimated effort:** 1h.
- **Dependencies:** Phase 3 (endpoint live).

---

### Phase 6 — Frontend: state-driven Submit button in `RequestCard` [Stack: Frontend]

- **Goal:** Render a Submit action only for the owner's own Draft; on success transition the card to read-only (AC-004).
- **Affected files:**
  - [`vacaflow-web/src/components/RequestCard.tsx`](../../vacaflow-web/src/components/RequestCard.tsx)
- **Steps:**
  1. Extend `RequestCard` with a status-gated Submit action (mirrors server authorization; the card already renders only the owner's own requests). Additions shown; keep existing card markup:

     ```tsx
     'use client';
     import { useState } from 'react';
     import type { AbsenceRequest } from '@/types';
     import { submitRequest } from '@/lib/api';

     interface RequestCardProps {
       request: AbsenceRequest;
       onChanged?: (id: string, status: AbsenceRequest['status']) => void;
     }

     export function RequestCard({ request, onChanged }: RequestCardProps) {
       const [status, setStatus] = useState<AbsenceRequest['status']>(request.status);
       const [busy, setBusy] = useState(false);
       const [error, setError] = useState<string | null>(null);

       const canSubmit = status === 'Draft'; // Submit/Edit hidden for every non-Draft state (read-only, AC-004)

       async function handleSubmit() {
         setBusy(true);
         setError(null);
         try {
           await submitRequest(request.id);
           setStatus('Submitted');          // optimistic; server confirmed 204
           onChanged?.(request.id, 'Submitted');
         } catch (e) {
           setError(e instanceof Error ? e.message : 'Failed to submit the request.');
         } finally {
           setBusy(false);
         }
       }

       return (
         <article aria-busy={busy}>
           {/* existing card fields (type, dates, reason, status badge = {status}) */}
           {canSubmit && (
             <button type="button" onClick={handleSubmit} disabled={busy}>
               {busy ? 'Submitting…' : 'Submit'}
             </button>
           )}
           {error && <p role="alert">{error}</p>}
         </article>
       );
     }
     ```
     > When `status !== 'Draft'` neither Submit nor Edit renders (Edit gating is US-005's; this card composes with it). The status badge reflects the local `status`, so the card is visibly read-only immediately after submission.
- **Validation:** `npm --prefix vacaflow-web run build` succeeds; manual check with API running — Submit appears only for Draft, disappears after a successful submit, error line renders on a forced failure; no console errors; action row wraps on a 375px viewport (no horizontal scroll).
- **Rollback:** `git revert <sha>`; restore the prior `RequestCard.tsx`.
- **Estimated effort:** 2h.
- **Dependencies:** Phase 5.

---

### Phase 7 — Frontend tests + accessibility [Stack: Frontend]

- **Goal:** Cover the Submit interaction and its states with unit tests and an a11y assertion.
- **Affected files:**
  - [`vacaflow-web/src/components/__tests__/RequestCard.test.tsx`](../../vacaflow-web/src/components/__tests__/RequestCard.test.tsx)
- **Steps:**
  1. Add tests (mock `submitRequest`):
     - `shows Submit button when status is Draft`.
     - `hides Submit button when status is Submitted/Approved/Rejected/Cancelled` (parameterized).
     - `calls submitRequest and flips card to Submitted on success` (Submit disappears, badge reads Submitted).
     - `renders an alert with the error message when submit fails` (button re-enabled).
     - `disables the button and sets aria-busy while the request is in flight`.
  2. Accessibility: assert the button has an accessible name ("Submit"), the error uses `role="alert"`, and `aria-busy` toggles. Run the project's axe/jest-axe check on the rendered card (0 serious/critical violations).
- **Validation:** `npm --prefix vacaflow-web test` green; changed-code coverage ≥80%; jest-axe reports no serious/critical violations.
- **Rollback:** `git revert <sha>`; delete the test file.
- **Estimated effort:** 2h.
- **Dependencies:** Phase 6.

---

## 7. Database Changes

**No database changes required.**

Submission only mutates existing columns on an existing row (`AbsenceRequests.Status` `Draft → Submitted`, and `UpdatedAt`). The table, the `Status` CHECK constraint (which already includes `'Submitted'`), and all foreign keys were created by US-004. No new table, column, index, or migration is introduced. Persistence goes through EF Core change-tracking (`Update` + `SaveChangesAsync`) — parameterized, no raw SQL.

> Pre-flight guard: if the US-004 `Status` CHECK constraint does **not** list `'Submitted'`, submission will fail at the DB. That is a US-004 defect to fix in US-004's migration — do not add a corrective migration inside US-006.

---

## 8. Testing Strategy

### Backend
- **Unit — Domain** (`VacaFlow.Tests/Domain`): `Submit()` transitions Draft→Submitted; throws `InvalidStateTransitionException` from every non-Draft state (parameterized). State machine `CanTransition`/`EnsureCanTransition` truth table for the `Draft` row.
- **Unit — Application** (`VacaFlow.Tests/Application`): `SubmitAsync` success (owner+Draft → persisted Submitted, AC-001), not-owner → `ForbiddenException` (AC-003/403), non-Draft → `InvalidStateTransitionException` (AC-002/422), missing id → `NotFoundException` (404). Hand-written fakes for `IRequestRepository` and `ICurrentUserContext` — no `DbContext`/`HttpContext`.
- **Integration (optional for MVP)**: `WebApplicationFactory` smoke of `POST /api/requests/{id}/submit` asserting the 204/403/404/422/401 status mapping and the `{ code, message }` body shape (no stack trace). Add if the suite already has API integration harness from US-001; otherwise the manual smoke in Phase 3 covers it.
- **Coverage:** ≥80% on changed Domain+Application code (org gate; exceeds the MVP 70% floor).

### Frontend
- **Unit/interaction** (`RequestCard.test.tsx`): button visibility per status, success path (flips to Submitted + `onChanged`), error path (alert + button re-enabled), in-flight disabled state. Mock `submitRequest`.
- **Accessibility:** jest-axe on the card — 0 serious/critical; button has an accessible name; error uses `role="alert"`; `aria-busy` reflects in-flight.
- **Coverage:** ≥80% on the changed component surface; no `any`, strict TS.

### Cross-cutting
- **Contract:** frontend `submitRequest` targets `POST /api/requests/{id}/submit` only after Phase 3; success is `204` (helper resolves `void`). Keep the TS `status` union and the backend enum in lockstep (`'Submitted'`).
- **Regression:** verify US-004 create and US-005 edit paths still pass (edit-after-submit now returns 422 — that is the intended AC-004 behavior, update any US-005 test expectation only if it wrongly assumed Submitted was editable).
- **Security (OWASP):** A01 broken access control — ownership enforced server-side, identity from cookie, no body ids; A03 injection — EF parameterized, no string SQL; A05/A09 — stable error codes, no stack traces in responses.

### UX/UI Validation
- **Loading state:** button shows `Submitting…`, is `disabled`, and `aria-busy="true"` while in flight.
- **Error state:** failed submission renders a `role="alert"` message; the button re-enables so the user can retry.
- **Empty state:** N/A at the card level (empty-list handling belongs to the list page, US-011); a card with no actionable transition simply renders no action buttons.
- **Success state:** card immediately reflects the `Submitted` badge and removes Submit/Edit (read-only) — no full-page reload required.
- **Responsive:** action row wraps at ≤375px with no horizontal overflow.
- **Accessibility:** WCAG 2.1 AA — accessible button name, visible focus ring, alert announced, color-independent status indication.

---

## 9. Configuration & Deployment

- **Backend env keys (unchanged):** `ConnectionStrings:VacaFlow` (SQLite path), `CookieAuth:*` (HttpOnly, SameSite=Strict, sliding 120 min), `Cors:AllowedOrigin` (must permit the web origin so the session cookie is accepted on the cross-origin POST). No new keys introduced.
- **Frontend env (unchanged):** `NEXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:5000`) drives `API_BASE_URL` in `api.ts`.
- **Local run order:** start the API first (`dotnet run --project VacaFlow.Api`), then the web app (`npm --prefix vacaflow-web run dev`). The frontend Submit action must not be exercised before the API is up (Phase 3 precedes Phases 5–6).
- **Feature flags:** none.
- **Performance thresholds (frontend):** card interaction budget — LCP ≤ 2.5s, CLS ≤ 0.1 on the requests view; the optimistic status update must not cause layout shift (reserve the badge/action row space).

---

## 10. Risks & Mitigations

| # | Risk | Probability | Impact | Mitigation | Owner | Stack |
|---|------|-------------|--------|------------|-------|-------|
| R1 | **AC-004 depends on US-005** Draft-only edit guard; if US-005 is not merged, "read-only after submit" cannot be verified end-to-end. | M | M | Sequence US-005 before US-006 (both Sprint 2; backlog orders US-005 first). Mark the AC-004 edit-after-submit test as US-005-gated. Document in §3 A2. | BE | BE |
| R2 | **`ForbiddenException` / 403 mapping missing** (not enumerated in the brief), producing 500 instead of 403 for ownership violations (AC-003). | M | M | Add `ForbiddenException` (Phase 1) + idempotent middleware arm (Phase 3), matched before `DomainException`; assert 403 in tests. | BE | BE |
| R3 | **`IRequestRepository.UpdateAsync` absent** (a US-005 artifact) → submit cannot persist / build breaks. | M | M | Reuse if present; otherwise add the method + EF impl in Phase 2 (snippet provided). | BE | BE |
| R4 | `RequestStatus` enum / `RequestStateMachine` location or `RequestService` constructor signature differs from assumptions, breaking snippets. | L | M | Pre-flight confirms US-004 artifacts and namespaces before coding; adjust `using`/ctor order to match — no re-scaffolding. | BE | BE |
| R5 | CORS/cookie misconfig rejects the cross-origin POST (401 despite valid login). | L | M | Verify `Cors:AllowedOrigin` + `credentials:'include'`; covered by Phase 3 manual smoke. | Cross | Cross |

---

## 11. Definition of Done

- [ ] **Backend code:** `AbsenceRequest.Submit()`, `RequestStateMachine` Draft→Submitted, `IRequestService.SubmitAsync` + `RequestService.SubmitAsync`, `POST /api/requests/{id}/submit`, `ForbiddenException` + 403 mapping — all implemented; `Status` never set outside a domain method.
- [ ] **Frontend code:** `submitRequest` helper + state-driven Submit button in `RequestCard`; card becomes read-only (no Submit/Edit) once Submitted.
- [ ] **Tests:** Domain + Application unit tests pass; frontend interaction tests pass; changed-code coverage ≥80% on both stacks.
- [ ] **Acceptance criteria satisfied:** AC-001 (Draft→Submitted, read-only), AC-002 (non-Draft → 422), AC-003 (non-owner → 403), AC-004 (Submitted not editable — with US-005 guard).
- [ ] **Accessibility:** WCAG 2.1 AA verified on the card (jest-axe 0 serious/critical); button has accessible name; error `role="alert"`; `aria-busy` while loading.
- [ ] **All UI states implemented:** loading, error, success (empty N/A at card level).
- [ ] **Performance:** LCP ≤ 2.5s, CLS ≤ 0.1 on the requests view; no layout shift on optimistic update.
- [ ] **API contract:** endpoint returns 204/401/403/404/422 per §4; `{ code, message }` body; no stack traces leaked.
- [ ] **Shared TS types:** `AbsenceRequest.status` union includes `'Submitted'`; no `any`.
- [ ] **Migrations:** none (confirmed — §7).
- [ ] **Boundary check:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- [ ] **Docs:** Update_Docs run for touched surfaces; backlog US-006 acceptance criteria mapped.
- [ ] **PR approved** by at least one reviewer; both builds green (`dotnet build` + `npm run build`).

---

## 12. References

- **Backlog:** [`../../documentation/05-planning/backlog.md` §US-006](../../documentation/05-planning/backlog.md) (AC-001..AC-004; source FR-ARM-006, FR-ARM-007, FR-LSE-001).
- **Related FRs:** FR-ARM-005 (only Draft editable — read-only-after-submit), FR-LSE-004 (only Draft editable), FR-ARM-009/FR-LSE-006 (owner-only actions).
- **Business rules:** BR-ROLE-002 (owner-only edit/submit/cancel → 403), BR-LIFE-001 (valid transitions only → 422), BR-LIFE-003/FR-ARM-005 (only Draft editable), BR-LIFE-002 (final states immutable), BR-IDEN-001/002 (identity from session), BR-010 (Submitted is not final).
- **Related User Stories:** US-004 (Create Draft Request — prerequisite aggregate/service/repo/table), US-005 (Edit Draft Request — Draft-only edit guard, `UpdateAsync`), US-007 (Cancel), US-008 (Manager queue — consumes Submitted requests).
- **API contract:** `POST http://localhost:5000/api/requests/{id}/submit` (base from `NEXT_PUBLIC_API_BASE_URL`).
- **Architecture/standards:** Reduced Onion (5 layers), Application layer free of `Microsoft.*`; C#/TS conventions and prohibited patterns per the project code standards.

---

*Plan generated by Bsa (AI Assisted) on 2026-07-22. Status: Draft · Version 1.0.*
