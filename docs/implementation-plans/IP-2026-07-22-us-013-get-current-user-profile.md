# Implementation Plan — US-013 Get Current User Profile

## 1. Metadata

| Field | Value |
|---|---|
| **Plan ID** | IP-2026-07-22-us-013-get-current-user-profile |
| **Date** | 2026-07-22 |
| **Source analysis** | [backlog.md §US-013](../../documentation/05-planning/backlog.md) |
| **Author** | Bsa (AI Assisted) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Impacted stacks** | Backend (VacaFlow.Application, VacaFlow.Infrastructure, VacaFlow.Api), Frontend (vacaflow-web) |
| **Linked ticket** | US-013 |
| **Priority** | Should Have (Sprint 4) |
| **Source requirement** | FR-AUTH-007 |

---

## 2. Executive Summary

- **Change:** Add a read-only `GET /api/me` endpoint that returns the authenticated caller's name, email, and role derived exclusively from the validated session cookie, plus a `useCurrentUser` React Context hook that fetches it once on mount and exposes identity to the whole frontend.
- **Motivation:** Eliminate frontend-trusted identity state. The web app currently would rely on the login response payload; `GET /api/me` makes the server the single source of truth for identity and directly supports the `ICurrentUserContext` design (FR-AUTH-007, BR-IDEN-001 / BR-011).
- **Backend impact:** One new endpoint (`RequireAuthorization()`), one new `IAuthService.GetCurrentUserProfileAsync` method, one new `CurrentUserResponse` DTO, and a `GetByIdAsync` method on the existing `IUserRepository`/`EfCoreUserRepository`. No new tables, no schema change.
- **Frontend impact:** New `CurrentUser` type, a `fetchCurrentUser` client in `lib/api.ts`, and `src/lib/useCurrentUser.ts` (React Context + provider + hook) wired at the app root and consumed by a small identity display; enables state-driven UI across the app.
- **Global risk:** **Low.** Additive, read-only feature on top of existing auth (US-002); no destructive changes; no migration.
- **Total effort:** **~11 hours** (Backend ~6h, Frontend ~5h, DB 0h).

---

## 3. Scope

### In scope — Backend
- New endpoint `GET /api/me` in `AuthEndpoints.cs`, protected with `RequireAuthorization()`.
- `IAuthService.GetCurrentUserProfileAsync(CancellationToken)` + implementation in `AuthService`.
- New `CurrentUserResponse` DTO record (`Name`, `Email`, `Role`).
- New `IUserRepository.GetByIdAsync(Guid, CancellationToken)` + `EfCoreUserRepository` implementation (read-only, `AsNoTracking`).
- Identity (`CurrentUserId`, `CurrentUserRole`) resolved through the existing `ICurrentUserContext`; name/email resolved by repository lookup keyed on the session-derived id — never on request input.

### In scope — Frontend
- `CurrentUser` / `UserRole` types in `src/types/index.ts`.
- `fetchCurrentUser` in `src/lib/api.ts` (sends `credentials: 'include'`; treats `401` as unauthenticated → `null`).
- `src/lib/useCurrentUser.ts`: `CurrentUserProvider` (React Context) + `useCurrentUser()` hook — one fetch on mount, exposes `{ user, isLoading, isAuthenticated, error, refresh }`.
- Root wiring via `src/app/providers.tsx` mounted in `src/app/layout.tsx`.
- Minimal identity display `src/components/UserBadge.tsx` demonstrating state-driven consumption (loading / unauthenticated / authenticated).
- Responsive/mobile: identity display legible at the 375px breakpoint and up.

### In scope — Contracts
- Add `GET /api/me` → `200 CurrentUserResponse` | `401 UNAUTHORIZED` to the API contract.
- Shared TS `CurrentUser` mirrors the C# `CurrentUserResponse`.

### Out of scope
- Editing/updating profile fields (read-only only).
- Any change to login/logout/registration flows (US-001, US-002, US-003).
- Manager-assignment data (`AssignedManagerId`) or password material in the payload.
- Vacation balances, avatars, preferences (Won't v1: W-008, W-013).
- New database columns, tables, or migrations.

### Assumptions
- **A1 (prerequisite):** US-002 login establishes an HttpOnly session cookie whose claims carry at least the user id (`NameIdentifier`) and role; `HttpContextCurrentUserContext` (bound in `AddInfrastructure()`) already exposes these via `ICurrentUserContext`. `[will exist after US-002]`
- **A2 (interface shape frozen by brief):** `ICurrentUserContext` exposes only `{ Guid CurrentUserId; UserRole CurrentUserRole; }`. It is **not** extended. Because name/email are not on that interface, they are fetched via `IUserRepository.GetByIdAsync(CurrentUserId)` — a lookup keyed by the session-derived id, so the returned identity remains session-authoritative (satisfies AC-003 / BR-IDEN-001 / BR-011). `role` in the response is taken from `ICurrentUserContext.CurrentUserRole` so it always mirrors the session claim.
- **A3:** If the validated session id does not resolve to an `Employee` (e.g. a deleted account), the service throws `UnauthorizedAccessException` → `401 UNAUTHORIZED`, consistent with BR-IDEN-001 ("401 if identity unresolved").
- **A4 (BR-APPR-003 context):** Not directly applicable to US-013 (no manager/assignee scoping in a self-profile read); noted for consistency with sibling plans.
- **A5:** CORS (`Cors:AllowedOrigin`) and cookie policy from US-001/US-002 already permit credentialed cross-origin requests from the Next.js origin.

---

## 4. Architecture Impact

### Before → After

```
BEFORE (US-002 complete):
  vacaflow-web ──login──▶ POST /api/auth/login ──▶ AuthService ──▶ IUserRepository
       │                                                │
   identity taken from login response payload      cookie issued (id + role claims)

AFTER (US-013):
  vacaflow-web
     └─ CurrentUserProvider (mount) ──GET /api/me (cookie)──▶ AuthEndpoints[.RequireAuthorization]
                                                                     │
                                              IAuthService.GetCurrentUserProfileAsync
                                                   ├─ ICurrentUserContext (id + role from cookie)
                                                   └─ IUserRepository.GetByIdAsync(id) ─▶ Employees (read-only)
                                                                     │
                                                        200 { name, email, role }  | 401
     useCurrentUser() ◀── identity is server-authoritative, consumed app-wide
```

### API Contract Changes

| Method | Path | Auth | Request body | Success | Errors |
|---|---|---|---|---|---|
| GET | `/api/me` | Yes (cookie) | none | `200` `CurrentUserResponse { name, email, role }` | `401 UNAUTHORIZED` (no/invalid cookie or unresolved identity) |

### Frontend State / Routing changes
- New global React Context (`CurrentUserProvider`) mounted once at `src/app/layout.tsx`; no route changes.
- Identity state (`user`, `isLoading`, `isAuthenticated`, `error`, `refresh`) available to any client component via `useCurrentUser()`.
- Action buttons/UI elsewhere may key visibility off `isAuthenticated`/`user.role` (state-driven, mirrors server authz — final enforcement stays server-side).

### Backend interface changes
- `IAuthService`: **+** `Task<CurrentUserResponse> GetCurrentUserProfileAsync(CancellationToken cancellationToken = default);`
- `IUserRepository`: **+** `Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);` (if not already added by US-002).
- New DTO record `CurrentUserResponse` (Application layer).
- No change to `ICurrentUserContext` or `ITransactionService`.

---

## 5. Pre-flight Checklist

- [ ] Branch `feature/yreyes/us013` created from the integration branch (do **not** work on `0-setup-inicial`).
- [ ] **Prerequisite US-001 present** (solution scaffolding): `VacaFlow.sln`, five projects, `VacaFlowDbContext`, `Employee` entity + `UserRole` enum, `Program.cs` cookie-auth config, `AddInfrastructure()`, `ExceptionHandlingMiddleware`, `/health`. `[will exist after US-001]` — **do NOT re-scaffold.**
- [ ] **Prerequisite US-002 present** (login + session): `POST /api/auth/login` issuing the HttpOnly cookie with id + role claims; `HttpContextCurrentUserContext` bound so `ICurrentUserContext` resolves `CurrentUserId`/`CurrentUserRole`; `IUserRepository` + `EfCoreUserRepository` exist. `[will exist after US-002]`
- [ ] `dotnet build VacaFlow.sln` green; `npm run build` in `vacaflow-web` green.
- [ ] Existing test suite green: `dotnet test` and `npm test`.
- [ ] Dependencies: no new NuGet/npm packages required.
- [ ] No migration required (verified — read-only over existing `Employees` table).
- [ ] Source analysis reviewed: [backlog.md §US-013](../../documentation/05-planning/backlog.md) AC-001..AC-003, BR-011.
- [ ] `ICurrentUserContext` binding confirmed registered in `AddInfrastructure()`.

---

## 6. Implementation Phases

### Phase 1 — Application: profile service + DTO + repository contract [Stack: Backend]

- **Goal:** Provide a session-derived current-user profile through the Application layer, testable with in-memory fakes.
- **Affected files:**
  - [`VacaFlow.Application/Contracts/CurrentUserResponse.cs`](../../VacaFlow.Application/Contracts/CurrentUserResponse.cs) *(new; place with the auth DTOs created by US-002)*
  - [`VacaFlow.Application/Interfaces/IAuthService.cs`](../../VacaFlow.Application/Interfaces/IAuthService.cs) *(edit — `[will exist after US-002]`)*
  - [`VacaFlow.Application/Interfaces/IUserRepository.cs`](../../VacaFlow.Application/Interfaces/IUserRepository.cs) *(edit — `[will exist after US-001/US-002]`)*
  - [`VacaFlow.Application/Services/AuthService.cs`](../../VacaFlow.Application/Services/AuthService.cs) *(edit — `[will exist after US-002]`)*
- **Steps:**
  1. Add the DTO record:
     ```csharp
     namespace VacaFlow.Application.Contracts;

     /// <summary>Session-derived identity of the authenticated caller.</summary>
     public sealed record CurrentUserResponse(string Name, string Email, string Role);
     ```
  2. Add the read method to `IUserRepository` (skip if US-002 already added it):
     ```csharp
     Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
     ```
  3. Add the method to `IAuthService`:
     ```csharp
     Task<CurrentUserResponse> GetCurrentUserProfileAsync(CancellationToken cancellationToken = default);
     ```
  4. Ensure `AuthService` receives `ICurrentUserContext` and `IUserRepository` via its constructor (add `ICurrentUserContext` if absent — constructor injection only), then implement:
     ```csharp
     public async Task<CurrentUserResponse> GetCurrentUserProfileAsync(
         CancellationToken cancellationToken = default)
     {
         // BR-IDEN-001 / BR-011: identity comes only from the validated session,
         // never from request input.
         var userId = _currentUserContext.CurrentUserId;

         var employee = await _userRepository.GetByIdAsync(userId, cancellationToken)
             ?? throw new UnauthorizedAccessException(
                 "The session does not map to a known user.");

         return new CurrentUserResponse(
             Name: employee.FullName,
             Email: employee.Email,
             Role: _currentUserContext.CurrentUserRole.ToString());
     }
     ```
  5. Add hand-written fakes in `VacaFlow.Tests/Fakes/` if missing: `FakeCurrentUserContext` (settable `CurrentUserId`/`CurrentUserRole`) and `FakeUserRepository` (in-memory dictionary with `GetByIdAsync`).
- **Validation:** `dotnet build VacaFlow.sln` green; `grep -r "using Microsoft" VacaFlow.Application/` returns zero; new xUnit tests (Phase-local) pass — profile returns FullName/Email + session role; missing user throws `UnauthorizedAccessException`.
- **Rollback:** `git checkout -- VacaFlow.Application VacaFlow.Tests` (revert the four edited files + new fakes/tests); no data or schema touched.
- **Estimated effort:** 3 hours.
- **Dependencies:** Pre-flight (US-001, US-002).

---

### Phase 2 — Infrastructure + API: repository read + protected endpoint [Stack: Backend]

- **Goal:** Expose `GET /api/me` returning the session identity as JSON, `401` when unauthenticated, without leaking internals.
- **Affected files:**
  - [`VacaFlow.Infrastructure/Persistence/Repositories/EfCoreUserRepository.cs`](../../VacaFlow.Infrastructure/Persistence/Repositories/EfCoreUserRepository.cs) *(edit — `[will exist after US-001/US-002]`)*
  - [`VacaFlow.Api/Endpoints/AuthEndpoints.cs`](../../VacaFlow.Api/Endpoints/AuthEndpoints.cs) *(edit — `[will exist after US-001/US-002]`)*
- **Steps:**
  1. Implement the repository read (read-only, no tracking):
     ```csharp
     public async Task<Employee?> GetByIdAsync(
         Guid id, CancellationToken cancellationToken = default)
         => await _dbContext.Employees
             .AsNoTracking()
             .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
     ```
  2. Map the endpoint inside the existing `MapAuthEndpoints` method (`RequireAuthorization()` enforces AC-002; the handler accepts **no** body, guaranteeing AC-003):
     ```csharp
     app.MapGet("/api/me", async (IAuthService authService, CancellationToken ct) =>
     {
         var profile = await authService.GetCurrentUserProfileAsync(ct);
         return Results.Ok(profile);
     })
     .RequireAuthorization()
     .WithName("GetCurrentUser")
     .Produces<CurrentUserResponse>(StatusCodes.Status200OK)
     .Produces(StatusCodes.Status401Unauthorized);
     ```
  3. Confirm `ExceptionHandlingMiddleware` maps `UnauthorizedAccessException` → `401 { "code": "UNAUTHORIZED", ... }` (added by US-001); no new mapping needed.
  4. Do not log the response body (email is PII) beyond a structured "profile requested" event keyed by user id.
- **Validation:** `dotnet build` green; integration test (`WebApplicationFactory`) — authenticated request (login → reuse `Set-Cookie`) returns `200` with `{ name, email, role }` matching the seeded user; request with no cookie returns `401` and empty body; returned `role` equals the session role.
- **Rollback:** `git checkout -- VacaFlow.Infrastructure VacaFlow.Api`; endpoint removed, DB untouched.
- **Estimated effort:** 3 hours.
- **Dependencies:** Phase 1.

---

### Phase 3 — Frontend: current-user context, hook, and identity display [Stack: Frontend]

- **Goal:** Fetch identity once on mount from `GET /api/me` and expose it app-wide via context, with explicit loading / unauthenticated / authenticated states.
- **Affected files:**
  - [`vacaflow-web/src/types/index.ts`](../../vacaflow-web/src/types/index.ts) *(edit)*
  - [`vacaflow-web/src/lib/api.ts`](../../vacaflow-web/src/lib/api.ts) *(edit — `[will exist after US-002]`)*
  - [`vacaflow-web/src/lib/useCurrentUser.ts`](../../vacaflow-web/src/lib/useCurrentUser.ts) *(new)*
  - [`vacaflow-web/src/app/providers.tsx`](../../vacaflow-web/src/app/providers.tsx) *(new)*
  - [`vacaflow-web/src/app/layout.tsx`](../../vacaflow-web/src/app/layout.tsx) *(edit)*
  - [`vacaflow-web/src/components/UserBadge.tsx`](../../vacaflow-web/src/components/UserBadge.tsx) *(new)*
- **Steps:**
  1. Add shared types (mirror `CurrentUserResponse`):
     ```ts
     export type UserRole = 'Employee' | 'Manager';

     export interface CurrentUser {
       name: string;
       email: string;
       role: UserRole;
     }
     ```
  2. Add the API client (credentialed; `401` → `null`, never throws for the unauthenticated case):
     ```ts
     import type { CurrentUser } from '@/types';

     const API_BASE_URL =
       process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

     export async function fetchCurrentUser(
       signal?: AbortSignal,
     ): Promise<CurrentUser | null> {
       const res = await fetch(`${API_BASE_URL}/api/me`, {
         method: 'GET',
         credentials: 'include',
         headers: { Accept: 'application/json' },
         signal,
       });
       if (res.status === 401) return null;
       if (!res.ok) throw new Error(`Failed to load current user (${res.status})`);
       return (await res.json()) as CurrentUser;
     }
     ```
  3. Create the context + provider + hook in `src/lib/useCurrentUser.ts`:
     ```tsx
     'use client';

     import {
       createContext,
       useCallback,
       useContext,
       useEffect,
       useMemo,
       useState,
       type ReactNode,
     } from 'react';
     import { fetchCurrentUser } from '@/lib/api';
     import type { CurrentUser } from '@/types';

     interface CurrentUserState {
       user: CurrentUser | null;
       isLoading: boolean;
       isAuthenticated: boolean;
       error: string | null;
       refresh: () => Promise<void>;
     }

     const CurrentUserContext = createContext<CurrentUserState | undefined>(undefined);

     export function CurrentUserProvider({ children }: { children: ReactNode }) {
       const [user, setUser] = useState<CurrentUser | null>(null);
       const [isLoading, setIsLoading] = useState(true);
       const [error, setError] = useState<string | null>(null);

       const load = useCallback(async (signal?: AbortSignal) => {
         setIsLoading(true);
         setError(null);
         try {
           setUser(await fetchCurrentUser(signal));
         } catch (err) {
           if (signal?.aborted) return;
           setUser(null);
           setError(err instanceof Error ? err.message : 'Unknown error');
         } finally {
           if (!signal?.aborted) setIsLoading(false);
         }
       }, []);

       useEffect(() => {
         const controller = new AbortController();
         void load(controller.signal); // single fetch on mount
         return () => controller.abort();
       }, [load]);

       const value = useMemo<CurrentUserState>(
         () => ({
           user,
           isLoading,
           isAuthenticated: user !== null,
           error,
           refresh: () => load(),
         }),
         [user, isLoading, error, load],
       );

       return (
         <CurrentUserContext.Provider value={value}>
           {children}
         </CurrentUserContext.Provider>
       );
     }

     export function useCurrentUser(): CurrentUserState {
       const ctx = useContext(CurrentUserContext);
       if (ctx === undefined) {
         throw new Error('useCurrentUser must be used within a CurrentUserProvider');
       }
       return ctx;
     }
     ```
  4. Add the client providers wrapper `src/app/providers.tsx`:
     ```tsx
     'use client';

     import type { ReactNode } from 'react';
     import { CurrentUserProvider } from '@/lib/useCurrentUser';

     export function Providers({ children }: { children: ReactNode }) {
       return <CurrentUserProvider>{children}</CurrentUserProvider>;
     }
     ```
  5. Wire it into `src/app/layout.tsx` (wrap `children` once):
     ```tsx
     import { Providers } from './providers';

     export default function RootLayout({
       children,
     }: {
       children: React.ReactNode;
     }) {
       return (
         <html lang="en">
           <body>
             <Providers>{children}</Providers>
           </body>
         </html>
       );
     }
     ```
  6. Add the identity display `src/components/UserBadge.tsx` (state-driven consumption + a11y):
     ```tsx
     'use client';

     import { useCurrentUser } from '@/lib/useCurrentUser';

     export function UserBadge() {
       const { user, isLoading } = useCurrentUser();

       if (isLoading) {
         return <span aria-live="polite">Loading your profile…</span>;
       }
       if (!user) {
         return null; // unauthenticated: nothing to show
       }
       return (
         <span aria-label={`Signed in as ${user.name}, role ${user.role}`}>
           {user.name} · {user.role}
         </span>
       );
     }
     ```
- **Validation:** `npm run build` and `npm run lint` green (no `any`, strict mode); unit tests pass (200 → `user` set + `isAuthenticated` true; 401 → `user` null; loading transitions); `UserBadge` renders loading, hidden-when-null, and name·role states; a11y check passes (`aria-live` on loading, `aria-label` on badge).
- **Rollback:** delete `useCurrentUser.ts`, `providers.tsx`, `UserBadge.tsx`; revert edits to `types/index.ts`, `api.ts`, `layout.tsx` via `git checkout --`.
- **Estimated effort:** 5 hours.
- **Dependencies:** Phase 2 (endpoint live before the frontend calls it).

---

## 7. Database Changes

**No database changes required.** US-013 is a read-only projection of the existing `Employees` table (created by US-001). No new object, column, index, or migration. `GetByIdAsync` reads with `AsNoTracking()`.

---

## 8. Testing Strategy

### Backend (coverage ≥80% on changed code; Domain+Application min bar 70%, MVP floor 50%)
- **Unit (Application, in-memory fakes — no `DbContext`/`HttpContext`):**
  - `GetCurrentUserProfileAsync_ReturnsSessionIdentity_WhenUserResolved` — `FakeCurrentUserContext` id/role + `FakeUserRepository` seeded; asserts `Name`/`Email` from entity and `Role` from the session context (AC-001, AC-003).
  - `GetCurrentUserProfileAsync_ThrowsUnauthorized_WhenUserNotFound` — repository returns null → `UnauthorizedAccessException` (A3, BR-IDEN-001).
  - Naming per convention `Method_ExpectedBehavior_WhenCondition`, AAA layout.
- **Integration (`WebApplicationFactory` + SQLite):**
  - Authenticated round-trip: login → reuse session cookie → `GET /api/me` returns `200` with the seeded user's `name`/`email`/`role` (AC-001).
  - No cookie → `401 UNAUTHORIZED`, empty/no body (AC-002).
  - Response never contains `passwordHash`, `assignedManagerId`, or any body-supplied field (AC-003).
- **Mocks/fakes:** hand-written fakes only (no Moq/NSubstitute), placed in `VacaFlow.Tests/Fakes/`.

### Frontend (coverage ≥80% on changed code)
- **Unit:** `useCurrentUser` with `fetch` mocked — `200` sets `user` + `isAuthenticated=true`; `401` sets `user=null` + `isAuthenticated=false`; non-2xx (500) sets `error` and `user=null`; `isLoading` starts true then resolves.
- **Component:** `UserBadge` renders loading state, renders nothing when unauthenticated, renders `name · role` when authenticated; `refresh()` re-invokes the fetch.
- **a11y:** loading uses `aria-live="polite"`; badge exposes an `aria-label`; automated axe check on the rendered badge has zero violations.

### Cross-cutting
- **Contract:** shared `CurrentUser` TS interface matches `CurrentUserResponse` field-for-field (`name`, `email`, `role`).
- **Regression:** login/logout (US-002/US-003) unaffected; single fetch on mount (assert `fetch` called once per provider mount).

### UX/UI Validation
- **Loading state:** provider mounts with `isLoading=true`; `UserBadge` shows an accessible "Loading your profile…" indicator until `/api/me` resolves.
- **Error state:** transient/`5xx` failure sets `error` and leaves `user=null`; UI degrades gracefully (badge hidden), no crash, no redirect loop; `refresh()` allows recovery.
- **Empty / unauthenticated state:** `401` → `user=null` → badge renders nothing; public pages (login/register) remain fully usable.
- **Success state:** authenticated user sees `name · role`; identity available app-wide for state-driven UI.
- **Responsive:** badge legible and non-truncated at 375px width and up.

---

## 9. Configuration & Deployment

- **Backend env keys (reused; no new keys):** `ConnectionStrings:VacaFlow` (SQLite), `CookieAuth:*` (HttpOnly, SameSite=Strict, sliding 120 min — US-001), `Cors:AllowedOrigin` — **must allow credentials** for the Next.js origin so the cookie flows on `GET /api/me`.
- **Frontend `.env.local`:** `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000` (reused).
- **Local run order:** start `VacaFlow.Api` first (`dotnet run --project VacaFlow.Api`), then `vacaflow-web` (`npm run dev`). The provider fetches `/api/me` on first client render.
- **Feature flags:** none.
- **Performance note:** identity fetch is a single lightweight GET on mount; no measurable impact on LCP; badge must not cause layout shift (reserve space for the loading text to keep CLS ≤0.1).

---

## 10. Risks & Mitigations

| Risk | Prob | Impact | Mitigation | Owner | Stack |
|---|---|---|---|---|---|
| Prerequisite drift from US-002: cookie missing the id/role claim or `ICurrentUserContext` not bound → `/api/me` returns wrong/empty identity or `401` for valid sessions | M | H | Confirm `ICurrentUserContext` binding + claim set in Pre-flight; integration test asserts a full login→`/api/me` round-trip before merge | BE | BE |
| Frontend `401` mishandled → error banner / redirect loop / crash on public pages | M | M | `fetchCurrentUser` treats `401` as `null` (not an exception); provider tolerates `user=null`; unit tests cover the unauthenticated path; single-flight fetch with `AbortController` | FE | FE |
| CORS/credentials misconfig → browser drops the cookie on the cross-origin GET (works via curl, fails in browser) | M | M | Ensure API CORS allows the exact web origin **with credentials**; `fetch` uses `credentials: 'include'`; verify in-browser during Phase 3 validation | FE/BE | Cross |

*(Secondary: stale role between cookie and DB after an out-of-band role change — Prob L; acceptable because AC-003 requires the response to reflect the session claim, refreshed on next login/slide.)*

---

## 11. Definition of Done

- [ ] **Backend code:** `GET /api/me` with `RequireAuthorization()`; `IAuthService.GetCurrentUserProfileAsync`; `CurrentUserResponse` DTO; `IUserRepository.GetByIdAsync` + EF implementation (`AsNoTracking`); constructor injection only; files <250 lines, methods <30 lines.
- [ ] **Frontend code:** `CurrentUser`/`UserRole` types; `fetchCurrentUser` (`credentials:'include'`, `401`→`null`); `useCurrentUser` context+hook (single fetch on mount); provider mounted in `layout.tsx`; `UserBadge` consumes it; strict TS, no `any`.
- [ ] **Tests:** backend unit + integration and frontend unit + component tests pass; ≥80% coverage on changed code.
- [ ] **All UI states implemented:** loading, error, empty/unauthenticated, success.
- [ ] **a11y:** WCAG 2.1 AA on the identity display (aria-live loading, aria-label badge); axe zero violations.
- [ ] **API docs:** `GET /api/me` (200 `CurrentUserResponse` / 401) documented in the API contract.
- [ ] **Shared TS types:** `CurrentUser` matches `CurrentUserResponse` field-for-field.
- [ ] **Migrations:** none (confirmed read-only).
- [ ] **Boundary check:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- [ ] **Security:** no PII (email) in logs beyond a user-id-keyed event; no stack traces leaked; identity is session-derived only (BR-IDEN-001 / BR-011); request body never influences the response (AC-003).
- [ ] **Docs:** CHANGELOG/analysis updated via Update_Docs; plan referenced.
- [ ] **PR approved** by at least one reviewer; both builds green.
- [ ] **Acceptance criteria satisfied:** AC-001 (authenticated profile returned), AC-002 (unauthenticated → 401, no data), AC-003 (identity matches session claims, not request body).

---

## 12. References

- **Source analysis:** [backlog.md §US-013 Get Current User Profile](../../documentation/05-planning/backlog.md) (AC-001..AC-003; Deferral Justification — Should Have)
- **Functional requirement:** FR-AUTH-007 (current-user endpoint returning identity from session)
- **Business rules:** BR-011 / BR-IDEN-001 (identity derived from session cookie), BR-IDEN-002, FR-AUTH-008 (API derives identity; frontend supplies no trusted identifier)
- **Prerequisite stories:** US-001 (Registration + solution scaffolding), US-002 (User Login + session cookie + `ICurrentUserContext`), US-003 (Logout)
- **Architecture / standards:** Reduced Onion (Alternative C) — `VacaFlow.Api → VacaFlow.Application → VacaFlow.Domain`, `VacaFlow.Infrastructure` implements Application interfaces; HttpOnly cookie auth; specific repositories (no generic `IRepository<T>`)
- **API surface:** `GET /api/me` (Yes / any role), base `http://localhost:5000`
- **Error contract:** `{ "code", "message" }` via single `ExceptionHandlingMiddleware`; `UnauthorizedAccessException` → `401 UNAUTHORIZED`
