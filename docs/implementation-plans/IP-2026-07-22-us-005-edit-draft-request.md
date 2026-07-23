# Implementation Plan — US-005: Edit Draft Request

## 1. Metadata

| Field | Value |
|---|---|
| **Plan ID** | IP-2026-07-22-us-005-edit-draft-request |
| **Date** | 2026-07-22 |
| **Source analysis** | [`../../documentation/05-planning/backlog.md` §US-005](../../documentation/05-planning/backlog.md) |
| **Author** | Bsa (AI Assisted) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Impacted stacks** | Backend (Domain, Application, API), Frontend (Next.js) |
| **Linked ticket** | US-005 |
| **Prerequisite US** | US-004 (Create Draft Request) — provides the `AbsenceRequest` aggregate, `RequestService`, `IRequestRepository`, the `AbsenceRequests` table, and `RequestForm.tsx`. **Not re-scaffolded here.** |

---

## 2. Executive Summary

- **Change:** Add the ability for an Employee to edit their own **Draft** absence request (absence type, start/end dates, reason) via `PUT /api/requests/{id}`, reusing the existing create-flow `RequestForm` in an edit mode.
- **Motivation:** Employees must be able to correct a Draft before submission (FR-ARM-004, FR-ARM-005, FR-LSE-004) without deleting and recreating it.
- **Backend impact:** New domain method `AbsenceRequest.UpdateDetails(...)`, new `IRequestService.UpdateAsync(...)` / `RequestService.UpdateAsync(...)`, new `UpdateRequestDto`, one new `PUT` endpoint, one new `ForbiddenAccessException` (403 mapping). No schema change — the `AbsenceRequests` table and its `UpdatedAt` column already exist from US-004.
- **Frontend impact:** Extend `RequestForm.tsx` with an edit mode (`mode`/`initialValues`), add `updateRequest()` to `lib/api.ts`, add the edit route `src/app/requests/[id]/edit/page.tsx`.
- **Global risk:** **Medium** — no data-model change; risk concentrated in reusing US-004 internals (exact member names / exception taxonomy) and in the edit-page pre-fill data source (GET-by-id belongs to US-011).
- **Total effort:** **24 hours** (Backend 13h · Frontend 8h · DB 0h · Cross-cutting verification 3h).

---

## 3. Scope

### In scope — Backend
- `AbsenceRequest.UpdateDetails(absenceTypeId, startDate, endDate, reason, today)` domain method enforcing:
  - **BR-LIFE-003** — only a `Draft` request is editable → `InvalidStateTransitionException` (HTTP **422** `DOMAIN_RULE_VIOLATION`). Satisfies **AC-002**.
  - **BR-DATE-001** — `endDate >= startDate` and **BR-DATE-002** — `startDate >= today` → `ValidationException` (HTTP **400** `INVALID_DATE_RANGE`). Satisfies **AC-004** and re-applies the same rules as create (AC-001).
  - Request **remains in `Draft`** after a successful edit (no state transition).
- `IRequestService.UpdateAsync` / `RequestService.UpdateAsync` enforcing:
  - **BR-ROLE-002 / BR-IDEN-001** — owner-only; the owner is resolved from `ICurrentUserContext.CurrentUserId`, and any employee id in the body is ignored → `ForbiddenAccessException` (HTTP **403** `FORBIDDEN`) for another employee's request. Satisfies **AC-003**.
  - `NotFoundException` (HTTP **404**) when the request id does not exist.
  - Persist inside `ITransactionService.ExecuteInTransactionAsync`.
- `UpdateRequestDto` record (no employee id — BR-IDEN-001).
- `PUT /api/requests/{id}` endpoint in `RequestEndpoints.cs` (auth required).
- `ForbiddenAccessException` + its `ExceptionHandlingMiddleware` 403 branch (added idempotently — reuse if US-004 already introduced role-based 403).

### In scope — Frontend
- `lib/api.ts` → `updateRequest(id, payload)` helper (`PUT`, `credentials: 'include'`).
- `components/RequestForm.tsx` → add `mode: 'create' | 'edit'`, optional `requestId`, `initialValues`, and success callback; reuse the same accessible markup.
- `src/app/requests/[id]/edit/page.tsx` → edit route rendering `RequestForm` in edit mode with loading / empty / error / success states.
- Responsive: the edit form reuses US-004's responsive layout (mobile breakpoint ≥ 375px).

### In scope — Contracts
- One new REST operation `PUT /api/requests/{id}` (see §4).
- One new shared TS type `UpdateRequestPayload`.

### Out of scope
- Editing a **Submitted / Approved / Rejected / Cancelled** request (explicitly rejected via 422/403 — no edit path exists).
- Submit / cancel actions (US-006 / US-007).
- `GET /api/requests/{id}` and the employee request list (US-011) — see Assumptions.
- Any change to absence-type catalog, approval, or manager flows.
- Any database schema change.

### Assumptions
- **A-1 (US-004 internals):** `AbsenceRequest` exposes `RequestorId`, `AbsenceTypeId`, `StartDate`/`EndDate` (`DateOnly`), `Reason`, `Status` (a `RequestStatus` enum), `CreatedAt`, `UpdatedAt`, and the create path validates dates via a reusable `ValidationException`-throwing guard. **Verify these exact members in US-004 before coding** (see Pre-flight and Risk R-3). If US-004 named the field `Notes` instead of `Reason`, or represented `Status` as a string, adjust the snippets accordingly.
- **A-2 (exception taxonomy):** The scaffolded `ExceptionHandlingMiddleware` (US-001) already maps `NotFoundException`→404, `InvalidStateTransitionException`/`DomainException`→422, and the canonical **403 `FORBIDDEN`** row (SHARED-TECH-BRIEF §4). US-005 is the first owner-scoped write, so it introduces `ForbiddenAccessException` if US-004 has not already; the middleware branch is added only if absent.
- **A-3 (edit pre-fill source):** For this Sprint-2 slice the edit page pre-fills from a client-side draft cache (`sessionStorage`) set when the user opens a Draft from the create-success screen. Robust deep-link / page-refresh pre-fill via `GET /api/requests/{id}` is delivered by **US-011** (later sprint). This keeps US-005 within its declared dependency (US-004 only) and never calls an endpoint that does not yet exist.
- **A-4 (403 vs 404 disclosure):** AC-003 mandates **403** for another employee's request; the ownership check therefore runs before any state/date guard, and the plan accepts that 403 confirms resource existence within the internal MVP (OWASP note in §10).

---

## 4. Architecture Impact

### Before → After (request-edit path)

```
BEFORE (after US-004)
vacaflow-web ──POST /api/requests──▶ RequestEndpoints ─▶ IRequestService.CreateAsync
                                                          └▶ AbsenceRequest.Create(...)  (Draft)

AFTER (US-005 adds the edit path)
vacaflow-web ──PUT  /api/requests/{id}──▶ RequestEndpoints ─▶ IRequestService.UpdateAsync
   (RequestForm mode="edit")                                   ├─ ownership check (403)          [BR-ROLE-002]
                                                               └▶ AbsenceRequest.UpdateDetails(...)
                                                                   ├─ Draft-only guard (422)     [BR-LIFE-003]
                                                                   └─ date guards (400)          [BR-DATE-001/002]
                                                                   → stays Draft, UpdatedAt set
```

### API Contract Changes

| Method | Path | Auth | Role | Request body | Success | Errors |
|---|---|---|---|---|---|---|
| `PUT` | `/api/requests/{id}` | Yes (cookie) | Employee (owner) | `UpdateRequestDto { absenceTypeId, startDate, endDate, reason }` | `200 OK` + `RequestResponse` (status = `Draft`) | `400 INVALID_DATE_RANGE`/`VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `422 DOMAIN_RULE_VIOLATION` |

Error body shape (unchanged, from the single middleware): `{ "code": "STABLE_CODE", "message": "human text" }`. No employee/owner id is accepted in the body (BR-IDEN-001).

### Frontend state / routing changes
- **New route:** `/requests/[id]/edit` (client component).
- **`RequestForm` state:** gains `mode`, `requestId`, `initialValues`; branches submit between `createRequest` (US-004) and `updateRequest` (US-005).
- **No identity in client state** — identity stays server-derived (US-013 `GET /api/me`); only the editable Draft fields are cached for pre-fill.

### Backend interface changes
- `IRequestService` gains `Task<RequestResponse> UpdateAsync(Guid requestId, UpdateRequestDto request);`
- `AbsenceRequest` gains `public void UpdateDetails(Guid absenceTypeId, DateOnly startDate, DateOnly endDate, string reason, DateOnly today);`
- New `VacaFlow.Domain/Exceptions/ForbiddenAccessException.cs` (standalone `Exception`, **not** a `DomainException`, so it maps to 403 rather than 422).
- `IRequestRepository.GetByIdAsync` / `UpdateAsync` are reused (exist after US-004 — no signature change).

---

## 5. Pre-flight Checklist

- [ ] **Branch:** work on `feature/yreyes/us005` (or the active US-005 branch); do not commit to a shared base.
- [ ] **Prerequisite US-004 present:** `VacaFlow.Domain/Entities/AbsenceRequest.cs`, `VacaFlow.Application/Services/RequestService.cs`, `VacaFlow.Application/Interfaces/IRequestService.cs` + `IRequestRepository`, `VacaFlow.Api/Endpoints/RequestEndpoints.cs` (with the `/api/requests` route group and `POST`), `vacaflow-web/src/components/RequestForm.tsx`, `lib/api.ts` (`createRequest`, `ApiError`), `types/index.ts` (`AbsenceRequest`).
- [ ] **Verify US-004 members (Risk R-3):** confirm `AbsenceRequest` property names (`Reason` vs `Notes`), `Status` type (`RequestStatus` enum), and **where create validates dates** (domain factory vs service). Reuse that exact validation routine; do not duplicate it.
- [ ] **Verify exception taxonomy (Risk R-2):** confirm whether `ForbiddenAccessException` / a 403 branch and a 400 `ValidationException` already exist from US-004; add only what is missing.
- [ ] **Build baseline green:** `dotnet build VacaFlow.sln` and `npm --prefix vacaflow-web run build` both succeed before starting.
- [ ] **Test suite baseline green:** `dotnet test` and `npm --prefix vacaflow-web test` pass.
- [ ] **Dependencies:** no new NuGet or npm packages required.
- [ ] **Migrations:** none required (see §7); confirm `AbsenceRequests.UpdatedAt` column already exists from US-004's migration.
- [ ] **Analysis reviewed:** backlog §US-005 (AC-001…AC-004) and SHARED-TECH-BRIEF §4/§5 read.

---

## 6. Implementation Phases

### Phase 1 — Domain: `UpdateDetails` method + `ForbiddenAccessException` [Stack: Backend]

- **Goal:** Encode the Draft-only and date invariants for editing inside the `AbsenceRequest` aggregate and add the 403 exception type.
- **Affected files:**
  - [`VacaFlow.Domain/Entities/AbsenceRequest.cs`](../../VacaFlow.Domain/Entities/AbsenceRequest.cs)
  - [`VacaFlow.Domain/Exceptions/ForbiddenAccessException.cs`](../../VacaFlow.Domain/Exceptions/ForbiddenAccessException.cs) *(new)*
  - [`VacaFlow.Tests/Domain/AbsenceRequestUpdateDetailsTests.cs`](../../VacaFlow.Tests/Domain/AbsenceRequestUpdateDetailsTests.cs) *(new)*
- **Steps:**
  1. Add `ForbiddenAccessException` (standalone `Exception` so it maps to 403, not 422):
     ```csharp
     namespace VacaFlow.Domain.Exceptions;

     /// <summary>
     /// Thrown when an authenticated user acts on a resource they do not own
     /// or lack the role for. Mapped to HTTP 403 (FORBIDDEN) by the API
     /// ExceptionHandlingMiddleware. Intentionally does NOT derive from
     /// DomainException (which maps to 422).
     /// </summary>
     public sealed class ForbiddenAccessException : Exception
     {
         public ForbiddenAccessException(string message) : base(message)
         {
         }
     }
     ```
  2. Add the `UpdateDetails` method to `AbsenceRequest`, reusing the **same** date guard the US-004 create path uses (throwing the existing `ValidationException` → 400). State guard first (422), then dates (400):
     ```csharp
     /// <summary>
     /// Applies edits to a Draft request. BR-LIFE-003: only Draft is editable.
     /// BR-DATE-001/002: end &gt;= start and start not in the past. The request
     /// stays in Draft; no state transition occurs.
     /// </summary>
     public void UpdateDetails(
         Guid absenceTypeId,
         DateOnly startDate,
         DateOnly endDate,
         string reason,
         DateOnly today)
     {
         if (Status != RequestStatus.Draft)
         {
             throw new InvalidStateTransitionException(
                 $"A request in '{Status}' state cannot be edited; only Draft requests are editable.");
         }

         if (endDate < startDate)
         {
             throw new ValidationException("The end date cannot be earlier than the start date.");
         }

         if (startDate < today)
         {
             throw new ValidationException("The start date cannot be in the past.");
         }

         AbsenceTypeId = absenceTypeId;
         StartDate = startDate;
         EndDate = endDate;
         Reason = reason;
         UpdatedAt = DateTime.UtcNow;
     }
     ```
     > If US-004 factored the date checks into a private helper (e.g. `EnsureDatesValid(startDate, endDate, today)`), call that helper here instead of inlining, to avoid divergence.
  3. Add domain unit tests (AAA, `Method_ExpectedBehavior_WhenCondition`): success from Draft; `InvalidStateTransitionException` for each non-Draft status (`Submitted`, `Approved`, `Rejected`, `Cancelled`); `ValidationException` when `endDate < startDate`; `ValidationException` when `startDate < today`; `UpdatedAt` is set; status stays `Draft`.
- **Validation:** `dotnet build VacaFlow.sln` green; new `AbsenceRequestUpdateDetailsTests` pass; `grep -r "using Microsoft" VacaFlow.Domain/` returns zero.
- **Rollback:** revert this phase's commit (delete `ForbiddenAccessException.cs`, remove `UpdateDetails` + its tests).
- **Estimated effort:** 4h.
- **Dependencies:** none (US-004 aggregate present).

---

### Phase 2 — Application: `UpdateAsync` service + `UpdateRequestDto` [Stack: Backend]

- **Goal:** Orchestrate load → ownership check (403) → domain edit (422/400) → transactional persist, returning the updated request.
- **Affected files:**
  - [`VacaFlow.Application/Interfaces/IRequestService.cs`](../../VacaFlow.Application/Interfaces/IRequestService.cs)
  - [`VacaFlow.Application/Services/RequestService.cs`](../../VacaFlow.Application/Services/RequestService.cs)
  - [`VacaFlow.Application/Services/UpdateRequestDto.cs`](../../VacaFlow.Application/Services/UpdateRequestDto.cs) *(new — place beside US-004's request DTOs)*
  - [`VacaFlow.Tests/Application/RequestServiceUpdateAsyncTests.cs`](../../VacaFlow.Tests/Application/RequestServiceUpdateAsyncTests.cs) *(new)*
  - [`VacaFlow.Tests/Fakes/FakeRequestRepository.cs`](../../VacaFlow.Tests/Fakes/FakeRequestRepository.cs) *(reuse/extend from US-004)*
- **Steps:**
  1. Add the DTO (no employee/owner id — BR-IDEN-001):
     ```csharp
     namespace VacaFlow.Application.Services;

     public sealed record UpdateRequestDto(
         Guid AbsenceTypeId,
         DateOnly StartDate,
         DateOnly EndDate,
         string Reason);
     ```
  2. Extend the interface:
     ```csharp
     Task<RequestResponse> UpdateAsync(Guid requestId, UpdateRequestDto request);
     ```
  3. Implement `UpdateAsync` in `RequestService` (reuses the constructor-injected `IRequestRepository`, `ICurrentUserContext`, `ITransactionService` from US-004). Ownership is checked **before** the domain guards so a non-owner always receives 403:
     ```csharp
     public async Task<RequestResponse> UpdateAsync(Guid requestId, UpdateRequestDto request)
     {
         var absenceRequest = await _requestRepository.GetByIdAsync(requestId)
             ?? throw new NotFoundException($"Absence request '{requestId}' was not found.");

         // BR-ROLE-002 / BR-IDEN-001 — owner resolved from the session; body ids are never trusted.
         if (absenceRequest.RequestorId != _currentUser.CurrentUserId)
         {
             throw new ForbiddenAccessException("You may only edit your own requests.");
         }

         var today = DateOnly.FromDateTime(DateTime.UtcNow);

         // BR-LIFE-003 (Draft-only, 422) + BR-DATE-001/002 (dates, 400) enforced in the aggregate.
         absenceRequest.UpdateDetails(
             request.AbsenceTypeId,
             request.StartDate,
             request.EndDate,
             request.Reason,
             today);

         await _transactionService.ExecuteInTransactionAsync(
             () => _requestRepository.UpdateAsync(absenceRequest));

         return RequestResponse.FromEntity(absenceRequest);
     }
     ```
     > `RequestResponse` and its `FromEntity` mapper are reused from US-004. If US-004 exposed a different mapping (e.g. a manual constructor), call that instead of `FromEntity`.
  4. Add application unit tests with hand-written fakes (no Moq, no `DbContext`/`HttpContext`): success updates + returns response with `Status == Draft`; `NotFoundException` when repository returns null; `ForbiddenAccessException` when `CurrentUserId != RequestorId`; body-supplied employee id is ignored (owner still from `ICurrentUserContext`); domain exceptions propagate (non-Draft → `InvalidStateTransitionException`; past date → `ValidationException`); `UpdateAsync` calls `ExecuteInTransactionAsync` exactly once on success.
- **Validation:** `dotnet build` green; new application tests pass; `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- **Rollback:** revert this phase's commit (remove `UpdateAsync`, the interface member, `UpdateRequestDto`, and the new tests).
- **Estimated effort:** 5h.
- **Dependencies:** Phase 1.

---

### Phase 3 — API: `PUT /api/requests/{id}` endpoint + 403 middleware mapping [Stack: Backend]

- **Goal:** Expose the edit operation over HTTP and ensure `ForbiddenAccessException` maps to `403 FORBIDDEN`.
- **Affected files:**
  - [`VacaFlow.Api/Endpoints/RequestEndpoints.cs`](../../VacaFlow.Api/Endpoints/RequestEndpoints.cs)
  - [`VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs`](../../VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs)
  - [`VacaFlow.Tests/Application/RequestEndpointsUpdateTests.cs`](../../VacaFlow.Tests/Application/RequestEndpointsUpdateTests.cs) *(new — integration, optional per MVP coverage)*
- **Steps:**
  1. In the existing `/api/requests` route group (created by US-004), map the `PUT` operation. Identity is never read from the body; the model binder only supplies the DTO:
     ```csharp
     group.MapPut("/{id:guid}", async (
             Guid id,
             UpdateRequestDto body,
             IRequestService requestService) =>
         {
             var updated = await requestService.UpdateAsync(id, body);
             return Results.Ok(updated);
         })
         .WithName("UpdateRequest")
         .RequireAuthorization();
     ```
  2. In `ExceptionHandlingMiddleware`, add the 403 branch to the exception→(status, code) mapping **only if it is not already present** (US-004 may have introduced it for role checks). Example switch arm:
     ```csharp
     ForbiddenAccessException => (StatusCodes.Status403Forbidden, "FORBIDDEN"),
     ```
     Ensure the arm precedes any broad `DomainException` arm so ownership 403 is not shadowed by 422. Never emit stack traces (OWASP A05) — only `{ code, message }`.
  3. Add a light integration test (in-memory `WebApplicationFactory`, authenticated cookie): `PUT` a valid Draft edit → `200` + `Status="Draft"`; another user's request → `403`; unknown id → `404`; non-Draft → `422`; past start date → `400`.
- **Validation:** `dotnet build` + `dotnet test` green; manual `curl -b <cookie> -X PUT http://localhost:5000/api/requests/<id>` returns the expected codes; unauthenticated call returns `401`.
- **Rollback:** revert this phase's commit (remove the `MapPut` block and, if newly added, the 403 switch arm).
- **Estimated effort:** 4h.
- **Dependencies:** Phase 2.

---

### Phase 4 — Frontend contract: `updateRequest` helper + types [Stack: Frontend]

- **Goal:** Add the typed client call for the new endpoint (backend now live after Phase 3).
- **Affected files:**
  - [`vacaflow-web/src/lib/api.ts`](../../vacaflow-web/src/lib/api.ts)
  - [`vacaflow-web/src/types/index.ts`](../../vacaflow-web/src/types/index.ts)
  - [`vacaflow-web/src/lib/api.updateRequest.test.ts`](../../vacaflow-web/src/lib/api.updateRequest.test.ts) *(new)*
- **Steps:**
  1. Add the payload type to `types/index.ts` (dates as ISO `yyyy-MM-dd` strings to match `DateOnly`):
     ```typescript
     export interface UpdateRequestPayload {
       absenceTypeId: string;
       startDate: string; // ISO yyyy-MM-dd
       endDate: string;   // ISO yyyy-MM-dd
       reason: string;
     }
     ```
  2. Add the helper to `lib/api.ts`, reusing US-004's `ApiError` and `AbsenceRequest` type and the `API_BASE_URL`/error-parsing pattern. `credentials: 'include'` is mandatory (BR-IDEN-001; the session cookie is HttpOnly and never read in JS):
     ```typescript
     import { AbsenceRequest, UpdateRequestPayload } from "@/types";

     export async function updateRequest(
       id: string,
       payload: UpdateRequestPayload,
     ): Promise<AbsenceRequest> {
       const response = await fetch(`${API_BASE_URL}/api/requests/${encodeURIComponent(id)}`, {
         method: "PUT",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });

       if (!response.ok) {
         const error = (await response.json().catch(() => null)) as
           | { code: string; message: string }
           | null;
         throw new ApiError(
           response.status,
           error?.code ?? "UNKNOWN",
           error?.message ?? "Unable to update the request.",
         );
       }

       return (await response.json()) as AbsenceRequest;
     }
     ```
     > `API_BASE_URL` and `ApiError` are declared in US-004's `api.ts`; reuse them (do not redeclare).
  3. Add a unit test asserting: correct URL/method/body, `credentials: 'include'`, and that a non-OK response with `{ code, message }` throws a typed `ApiError` carrying `status`/`code`.
- **Validation:** `npm --prefix vacaflow-web run build` green; `npm --prefix vacaflow-web test` green; TypeScript strict — no `any`.
- **Rollback:** revert this phase's commit (remove `updateRequest`, `UpdateRequestPayload`, and the test).
- **Estimated effort:** 2h.
- **Dependencies:** Phase 3 (endpoint must exist before the client calls it).

---

### Phase 5 — Frontend UI: `RequestForm` edit mode + edit route [Stack: Frontend]

- **Goal:** Reuse `RequestForm` in an edit mode and add the `/requests/[id]/edit` route with all UI states.
- **Affected files:**
  - [`vacaflow-web/src/components/RequestForm.tsx`](../../vacaflow-web/src/components/RequestForm.tsx)
  - [`vacaflow-web/src/app/requests/[id]/edit/page.tsx`](../../vacaflow-web/src/app/requests/[id]/edit/page.tsx) *(new)*
  - [`vacaflow-web/src/components/RequestForm.edit.test.tsx`](../../vacaflow-web/src/components/RequestForm.edit.test.tsx) *(new)*
- **Steps:**
  1. Extend `RequestForm` props and submit logic (keep US-004's existing accessible markup — labeled inputs, `aria-live` error region, `disabled` while submitting). The submit branches between create and update:
     ```tsx
     "use client";

     import { useState } from "react";
     import { createRequest, updateRequest } from "@/lib/api";
     import { UpdateRequestPayload } from "@/types";

     export interface RequestFormValues {
       absenceTypeId: string;
       startDate: string;
       endDate: string;
       reason: string;
     }

     export interface RequestFormProps {
       mode: "create" | "edit";
       requestId?: string; // required when mode === "edit"
       initialValues?: RequestFormValues;
       onSuccess: (id: string) => void;
     }

     const EMPTY: RequestFormValues = { absenceTypeId: "", startDate: "", endDate: "", reason: "" };

     export function RequestForm({ mode, requestId, initialValues, onSuccess }: RequestFormProps) {
       const [values, setValues] = useState<RequestFormValues>(initialValues ?? EMPTY);
       const [submitting, setSubmitting] = useState(false);
       const [error, setError] = useState<string | null>(null);

       async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
         event.preventDefault();
         setSubmitting(true);
         setError(null);
         try {
           const payload: UpdateRequestPayload = { ...values };
           const result =
             mode === "edit" && requestId
               ? await updateRequest(requestId, payload)
               : await createRequest(payload);
           onSuccess(result.id);
         } catch (e) {
           // 400/403/422 messages surfaced inline (aria-live); re-validation errors (AC-004) land here.
           setError(e instanceof Error ? e.message : "Unable to save the request.");
         } finally {
           setSubmitting(false);
         }
       }

       // Render US-004's existing form fields bound to `values`/`setValues`,
       // an aria-live error region showing `error`, and a submit button
       // disabled while `submitting` (label "Save changes" in edit mode).
       return null; // replace with the existing RequestForm JSX wired to the state above
     }
     ```
     > The `return null` line is a placeholder marker only — wire in US-004's existing JSX (this file already renders the create form). `createRequest`'s payload shape from US-004 matches `UpdateRequestPayload`'s fields; align the call if US-004 used a distinct create type.
  2. Add the edit route. For this Sprint-2 slice it pre-fills from the client draft cache (Assumption A-3); it renders explicit **loading**, **empty**, and **success** (redirect) states:
     ```tsx
     "use client";

     import { useEffect, useState } from "react";
     import { useRouter } from "next/navigation";
     import { RequestForm, RequestFormValues } from "@/components/RequestForm";

     export default function EditRequestPage({ params }: { params: { id: string } }) {
       const router = useRouter();
       const [initialValues, setInitialValues] = useState<RequestFormValues | undefined>();
       const [loaded, setLoaded] = useState(false);

       useEffect(() => {
         const cached = sessionStorage.getItem(`draft:${params.id}`);
         if (cached) {
           setInitialValues(JSON.parse(cached) as RequestFormValues);
         }
         setLoaded(true);
       }, [params.id]);

       if (!loaded) {
         return <p role="status">Loading draft…</p>;
       }

       if (!initialValues) {
         return (
           <p role="alert">
             Open this draft from your requests list to edit it.
           </p>
         );
       }

       return (
         <RequestForm
           mode="edit"
           requestId={params.id}
           initialValues={initialValues}
           onSuccess={() => router.push("/requests")}
         />
       );
     }
     ```
     > When US-011 lands, replace the `sessionStorage` read with `getRequest(params.id)` (`GET /api/requests/{id}`) for deep-link/refresh support.
  3. Add component tests: edit mode pre-fills `initialValues`; submit calls `updateRequest` with the current values; a rejected `updateRequest` (400/403/422) renders the message in the `aria-live` region and leaves the form editable; submit button disabled while submitting.
- **Validation:** `npm --prefix vacaflow-web run build` + `test` green; keyboard-only tab order verified; error region announced by screen readers (`role="alert"`/`aria-live`).
- **Rollback:** revert this phase's commit (delete the edit route + test; revert `RequestForm` prop/logic changes to the US-004 create-only version).
- **Estimated effort:** 6h.
- **Dependencies:** Phase 4.

---

### Phase 6 — Cross-stack verification & coverage gate [Stack: Cross]

- **Goal:** Confirm both builds green, coverage met, boundary intact, and all AC exercised end-to-end.
- **Affected files:** none (verification only).
- **Steps:**
  1. Run `dotnet build VacaFlow.sln` and `dotnet test` (with coverage) — Domain+Application changed code ≥ 80%.
  2. Run `npm --prefix vacaflow-web run build`, `npm --prefix vacaflow-web test` (with coverage) — changed FE ≥ 80%, and the a11y assertions pass.
  3. Run `grep -r "using Microsoft" VacaFlow.Application/` and confirm **zero** matches.
  4. Manual end-to-end (API on :5000, web on :3000): create a Draft (US-004) → open edit route → edit type/dates/reason → save → confirm still Draft (AC-001); try past start date → 400 inline (AC-004); (via a second account/cookie) attempt to edit another employee's Draft → 403 (AC-003); submit the draft (US-006 if present) or force a non-Draft record and attempt edit → 422 (AC-002).
- **Validation:** all four AC scenarios pass; both builds and test suites green; coverage and boundary checks pass.
- **Rollback:** n/a (no artifacts produced).
- **Estimated effort:** 3h.
- **Dependencies:** Phases 1–5.

---

## 7. Database Changes

**No database changes required.**

The `AbsenceRequests` table and its `UpdatedAt` column already exist from US-004. `UpdateDetails` writes to existing columns only (`AbsenceTypeId`, `StartDate`, `EndDate`, `Reason`, `UpdatedAt`); `Status` is unchanged (stays `Draft`). No new EF Core migration is generated. Verify at Pre-flight that US-004's migration includes `UpdatedAt`; if (unexpectedly) absent, that is a US-004 defect to be fixed in US-004, not here.

---

## 8. Testing Strategy

### Backend (coverage ≥ 80% on changed code)
- **Unit — Domain (`AbsenceRequestUpdateDetailsTests`):** success from Draft (fields set, status stays Draft, `UpdatedAt` set); `InvalidStateTransitionException` for Submitted/Approved/Rejected/Cancelled (parametrized) → 422; `ValidationException` for `endDate < startDate` and `startDate < today` → 400.
- **Unit — Application (`RequestServiceUpdateAsyncTests`):** happy path returns `RequestResponse` with `Draft`; `NotFoundException` when repo returns null → 404; `ForbiddenAccessException` when caller ≠ owner → 403; body employee id ignored (owner from `ICurrentUserContext`); `ExecuteInTransactionAsync` invoked once; domain exceptions propagate unchanged. Uses hand-written fakes in `VacaFlow.Tests/Fakes/` — no `DbContext`/`HttpContext`.
- **Integration (`RequestEndpointsUpdateTests`, optional per MVP):** `WebApplicationFactory` with authenticated cookie asserts 200/400/403/404/422 and the `{ code, message }` body; unauthenticated → 401.

### Frontend (coverage ≥ 80% on changed code)
- **Unit — `api.updateRequest.test.ts`:** URL/method/body correct, `credentials: 'include'`, typed `ApiError` on non-OK.
- **Unit — `RequestForm.edit.test.tsx`:** pre-fill from `initialValues`; submit calls `updateRequest`; error path renders inline message; disabled-while-submitting.
- **Accessibility:** all inputs have associated `<label>`; error region uses `role="alert"`/`aria-live="assertive"`; full keyboard operability; visible focus states (WCAG 2.1 AA).

### Cross-cutting
- Contract alignment: FE `UpdateRequestPayload` field names/casing match the `UpdateRequestDto` JSON contract.
- Regression: US-004 create flow still works (shared `RequestForm` not broken by the new props — defaults keep create mode intact).
- Boundary: `grep -r "using Microsoft" VacaFlow.Application/` → zero.

### UX/UI Validation
UX requirements applied inline per SHARED-TECH-BRIEF §7 (the edit surface reuses US-004's `RequestForm`; no net-new UX component). The edit route must implement all four states:
- **Loading:** `role="status"` "Loading draft…" while the pre-fill source resolves.
- **Error:** inline `role="alert"` region rendering 400 (date), 403 (ownership), and 422 (state) messages; the form stays editable so the user can correct and retry (covers AC-004 re-validation UX).
- **Empty:** when no draft data is available (direct URL/refresh without cache), a clear `role="alert"` directing the user to open the draft from their list (pending US-011 deep-link support).
- **Success:** on save, redirect to `/requests`; the submit button is disabled and labeled "Save changes" during the request to prevent double submits.

---

## 9. Configuration & Deployment

- **Backend env keys (unchanged, from US-001 scaffolding):** `ConnectionStrings:VacaFlow`, `CookieAuth:*` (HttpOnly, SameSite=Strict, sliding 120 min), `Cors:AllowedOrigin` (must include the web origin so `credentials:'include'` PUT is honored). No new keys.
- **Frontend env (`vacaflow-web/.env.local`, unchanged):** `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`.
- **Local run order:** start the API (`dotnet run --project VacaFlow.Api`, :5000) **before** the web app (`npm --prefix vacaflow-web run dev`, :3000).
- **Feature flags:** none.
- **Performance note:** the edit page pre-fills from client state (no fetch), so first render has no network latency; once US-011 supplies GET-by-id, target LCP ≤ 2.5 s / CLS ≤ 0.1 for the edit route.

---

## 10. Risks & Mitigations

| # | Risk | Prob | Impact | Mitigation | Owner | Stack |
|---|---|---|---|---|---|---|
| R-1 | Edit pre-fill depends on `GET /api/requests/{id}` (US-011, later sprint); refresh/deep-link without the client cache shows the empty-state fallback | M | M | Sprint-2 `sessionStorage` bridge (A-3) + explicit empty state; swap to `getRequest()` when US-011 lands; documented as scope boundary | FE | FE |
| R-2 | 400 (`ValidationException`) and 403 (`ForbiddenAccessException`) mappings not enumerated in the scaffolded domain-exception list → duplicate or shadowed middleware branch | M | M | Verify existing exceptions/middleware at Pre-flight; add idempotently; order the 403 arm before any broad `DomainException`→422 arm; integration test asserts each code | BE | BE |
| R-3 | `AbsenceRequest` member names / `Status` type / date-validation location assumed from US-004 → snippet drift, compile break | M | M | Read US-004's `AbsenceRequest` and `RequestService` before coding; reuse the existing date guard rather than duplicating; adjust snippet identifiers to match | BE | BE |
| R-4 | Returning 403 (not 404) for another employee's request confirms resource existence (OWASP A01 disclosure) | L | L | Accepted for internal MVP per AC-003; generic message ("You may only edit your own requests."); no request details leaked in the body | BE | BE |
| R-5 | Shared `RequestForm` changes regress the US-004 create flow | L | M | New props default to create mode; regression test keeps create path covered; both build+test suites gate the phase | FE | FE |

---

## 11. Definition of Done

- [ ] **Backend code:** `AbsenceRequest.UpdateDetails`, `ForbiddenAccessException`, `IRequestService.UpdateAsync` + `RequestService.UpdateAsync`, `UpdateRequestDto`, `PUT /api/requests/{id}`, and the 403 middleware branch implemented per §6.
- [ ] **Frontend code:** `updateRequest` helper, `UpdateRequestPayload` type, `RequestForm` edit mode, and the `/requests/[id]/edit` route implemented per §6.
- [ ] **Acceptance criteria satisfied:** AC-001 (edit Draft, stays Draft), AC-002 (non-Draft → 422), AC-003 (other owner → 403), AC-004 (past date → 400) all verified.
- [ ] **Business rules enforced:** BR-LIFE-003 (422), BR-ROLE-002/BR-IDEN-001 (403, identity from session), BR-DATE-001/002 (400).
- [ ] **Tests:** Domain + Application unit tests and FE unit/a11y tests pass; changed-code coverage ≥ 80% on both stacks; optional API integration test green.
- [ ] **UI states:** loading, error, empty, and success states implemented on the edit route; error region uses `aria-live`.
- [ ] **Accessibility:** WCAG 2.1 AA — labeled inputs, announced errors, keyboard operable, visible focus.
- [ ] **Mobile:** edit form usable at ≥ 375px (reuses US-004 responsive layout).
- [ ] **Performance:** no client-blocking fetch on edit render; LCP ≤ 2.5 s / CLS ≤ 0.1 target recorded for when US-011 adds GET-by-id.
- [ ] **API docs / contract:** `PUT /api/requests/{id}` documented (OpenAPI/README) with the `{ code, message }` error shape.
- [ ] **Shared TS types:** `UpdateRequestPayload` field names match the `UpdateRequestDto` JSON contract.
- [ ] **Migrations:** none (confirmed no schema change).
- [ ] **Boundary check:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- [ ] **No secrets** introduced; no employee/owner id trusted from the request body.
- [ ] **Docs updated** (Update_Docs) and **PR approved** by at least one reviewer.

---

## 12. References

- **Source analysis:** [`../../documentation/05-planning/backlog.md` §US-005](../../documentation/05-planning/backlog.md) (AC-001…AC-004; FR-ARM-004, FR-ARM-005, FR-LSE-004).
- **Business rules (SHARED-TECH-BRIEF §5):** BR-LIFE-003 (Draft-only editable → 422), BR-ROLE-002 (owner-only → 403), BR-IDEN-001 (identity from session), BR-DATE-001 (end ≥ start → 400), BR-DATE-002 (start not past → 400).
- **Error contract:** SHARED-TECH-BRIEF §4 (single `ExceptionHandlingMiddleware`; `{ code, message }`; exception→HTTP mapping table).
- **Architecture:** SHARED-TECH-BRIEF §2 (Reduced Onion, 5 layers), §2.2 (canonical project structure), §2.3 (Application interfaces), §6 (conventions & OWASP boundary).
- **Data model:** SHARED-TECH-BRIEF §3 (`AbsenceRequests` columns incl. `UpdatedAt`).
- **Related user stories:** US-004 (Create Draft Request — prerequisite; provides aggregate, service, repository, table, `RequestForm`), US-006 (Submit), US-007 (Cancel), US-011 (Employee views request list / `GET /api/requests/{id}` — supplies deep-link edit pre-fill).
