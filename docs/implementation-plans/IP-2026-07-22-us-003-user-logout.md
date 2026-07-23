# Implementation Plan — US-003 User Logout

## 1. Metadata

| Field | Value |
|---|---|
| **Plan ID** | IP-2026-07-22-us-003-user-logout |
| **Date** | 2026-07-22 |
| **Source analysis** | [backlog §US-003](../../documentation/05-planning/backlog.md) |
| **Author** | Bsa (AI Assisted) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Impacted stacks** | Backend (VacaFlow.Api), Frontend (vacaflow-web) |
| **Linked ticket** | US-003 |
| **Prerequisite US** | US-001 (scaffolding + cookie auth), US-002 (login + `lib/api.ts` + `ICurrentUserContext`) |

---

## 2. Executive Summary

- **Change:** Add session termination — a `POST /api/auth/logout` endpoint plus a frontend logout action so an authenticated user can end their session.
- **Motivation:** Satisfy FR-AUTH-006 (terminate session on logout) and US-003 AC-001..AC-003; without it a session persists until the 120-minute sliding cookie expiry.
- **Backend impact:** One Minimal-API endpoint in the existing `AuthEndpoints` group calling `HttpContext.SignOutAsync` to clear the auth cookie. **No** Application/Domain/Infrastructure change — session lifecycle is a transport concern in the Api layer only.
- **Frontend impact:** A `logout()` helper in `lib/api.ts` (idempotent — treats 401 as an already-terminated session) and a `LogoutButton` component mounted on the authenticated landing page; navigation to `/login` after sign-out.
- **Global risk:** **L** (small, additive, no data model or interface change; residual stateless-cookie replay window is the only notable security nuance).
- **Total effort:** **6 hours** (Backend 2h / Frontend 4h / DB 0h).

---

## 3. Scope

### In scope — Backend
- `POST /api/auth/logout` added to the existing `AuthEndpoints` group, protected with `.RequireAuthorization()`.
- Handler calls `HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme)` → emits a `Set-Cookie` that expires/clears the auth cookie; returns `204 No Content` (AC-001).
- Backend integration test proving logout clears the cookie and that a subsequent request without a valid session to a `[RequireAuthorization]` endpoint returns `401` (AC-002).

### In scope — Frontend
- `logout()` helper in `vacaflow-web/src/lib/api.ts` (POST, `credentials:'include'`, idempotent 401 handling).
- New `vacaflow-web/src/components/LogoutButton.tsx` client component (loading / error / success states).
- Mount `<LogoutButton />` on the post-login landing page (`app/requests/page.tsx`).
- Responsive/mobile: the button and its states render correctly at the 375 px and 768 px breakpoints.

### In scope — Contracts
- New endpoint `POST /api/auth/logout` (no request body; `204` success; `401` when unauthenticated). No new shared TypeScript types (no request/response payload).

### Out of scope
- Server-side session revocation / `ITicketStore` / token-version stamping (true raw-cookie revocation). MVP uses stateless cookie clearing — see Assumptions and §10.
- Cookie-auth configuration itself (scheme, HttpOnly, `SameSite=Strict`, sliding 120 min, `OnRedirectToLogin`→401) — delivered by **US-001**; only verified here.
- The global `401 → /login` fetch interceptor in `lib/api.ts` — delivered by **US-002**; relied upon by AC-003, not modified here.
- Mounting the button on `app/manager/page.tsx` — that page is created in **US-008**; it should render `<LogoutButton />` when built (forward reference, not implemented here).

### Assumptions
- **A1 — Stateless cookie logout (MVP).** The task and brief specify session termination via `SignOutAsync`, which clears the client cookie. ASP.NET Core cookie auth is stateless by default, so `SignOutAsync` does not revoke an already-captured raw cookie server-side. In the normal browser flow the cookie is removed, so the next request is unauthenticated → 401, satisfying AC-002. True raw-cookie replay protection (server-side session store) is out of MVP scope and tracked as R-1.
- **A2 — API returns 401, not 302.** US-001 configured the cookie scheme so that unauthenticated calls to `/api/*` return `401` (via `Events.OnRedirectToLogin`) instead of a `302` redirect. AC-002/AC-003 depend on this; verified in Pre-flight (R-2).
- **A3 — Post-login landing page exists.** US-002 login redirects an authenticated user to `/requests`, so `app/requests/page.tsx` exists as the mount point. If absent at implementation time, Phase 3 creates a minimal authenticated stub page there.
- **A4 — Path alias `@/*` → `src/*`** is configured in the US-001 `tsconfig.json` (Next.js default with `src/`).

---

## 4. Architecture Impact

### Before → After

```
BEFORE (after US-002)                         AFTER (US-003)
─────────────────────                         ──────────────
POST /api/auth/register  (US-001)             POST /api/auth/register  (US-001)
POST /api/auth/login     (US-002) ──sets──▶   POST /api/auth/login     (US-002) ──sets──▶ auth cookie
                                              POST /api/auth/logout    (US-003) ──clears─▶ auth cookie   ◀── NEW

vacaflow-web/src/lib/api.ts                   vacaflow-web/src/lib/api.ts
  ├─ base fetch wrapper (US-002)                ├─ base fetch wrapper (US-002)
  └─ 401 → /login interceptor (US-002)          ├─ 401 → /login interceptor (US-002)
                                                └─ logout()                          ◀── NEW
                                              vacaflow-web/src/components/
                                                └─ LogoutButton.tsx                  ◀── NEW  → mounted on /requests
```

### API Contract Changes

| Method | Path | Auth | Request | Success | Errors |
|---|---|---|---|---|---|
| POST | `/api/auth/logout` | Cookie (`RequireAuthorization`) | *(empty body)* | `204 No Content` + `Set-Cookie` clearing the auth cookie | `401 UNAUTHORIZED` (no/invalid session); `500 INTERNAL_ERROR` (unhandled, via `ExceptionHandlingMiddleware`) |

### Frontend state / routing changes
- New exported `logout()` in the API client module.
- `LogoutButton` local state: `pending` (loading) and `error`; on success calls `router.replace('/login')` (replace, not push — no back-navigation into an authenticated view).
- No route added; no global store change; the existing `401 → /login` interceptor is unchanged.

### Backend interface changes
- **None.** No new Application interface, service, repository, DTO, entity, or migration. `SignOutAsync` operates on `HttpContext` in the Api layer, preserving the onion boundary (`grep -r "using Microsoft" VacaFlow.Application/` stays zero).

---

## 5. Pre-flight Checklist

- [ ] On a feature branch off the integration branch (e.g. `feature/yreyes/us003`); working tree clean.
- [ ] `dotnet build VacaFlow.sln` is green; `npm run build` (in `vacaflow-web`) is green.
- [ ] **US-001 complete:** `VacaFlow.sln` + 5 projects, `VacaFlowDbContext`, `AddInfrastructure()`, `ExceptionHandlingMiddleware`, `/health`, and cookie auth configured in `Program.cs` — `AddAuthentication().AddCookie(...)` with `HttpOnly`, `SameSite=Strict`, sliding 120 min, **and** `Events.OnRedirectToLogin` → `401` / `OnRedirectToAccessDenied` → `403` for `/api/*` (verify — required by AC-002/AC-003; see R-2).
- [ ] **US-002 complete:** `POST /api/auth/login` establishes the cookie via `SignInAsync`; `ICurrentUserContext` + `HttpContextCurrentUserContext`; `lib/api.ts` base fetch wrapper with `credentials:'include'` + global `401 → /login` interceptor; login page; `useCurrentUser.ts`.
- [ ] Post-login landing page `app/requests/page.tsx` exists (US-002 redirect target); if not, Phase 3 creates a minimal authenticated stub.
- [ ] CORS allows the frontend origin **with credentials** (`.WithOrigins("http://localhost:3000").AllowCredentials()`, never `*`) — from US-001; verify (logout must send the cookie cross-origin).
- [ ] Test suites runnable: `dotnet test VacaFlow.Tests` (xUnit) and the frontend test runner.
- [ ] No pending EF Core migrations; this US adds none.
- [ ] Analysis reviewed: [backlog §US-003](../../documentation/05-planning/backlog.md) + shared technical brief.

---

## 6. Implementation Phases

### Phase 1 — Logout endpoint [Stack: Backend]

- **Goal:** Expose `POST /api/auth/logout` that clears the session cookie for an authenticated caller and returns `204`.
- **Affected files:** [AuthEndpoints.cs](../../VacaFlow.Api/Endpoints/AuthEndpoints.cs) *(exists after US-001/US-002 — add to it)*; [LogoutEndpointTests.cs](../../VacaFlow.Tests/Api/LogoutEndpointTests.cs) *(new)*.
- **Steps:**
  1. In `AuthEndpoints.MapAuthEndpoints`, add the `using` directives `Microsoft.AspNetCore.Authentication;` and `Microsoft.AspNetCore.Authentication.Cookies;`.
  2. Register the endpoint on the existing `/api/auth` group with `.RequireAuthorization()` so an unauthenticated call returns `401`:
     ```csharp
     // Inside MapAuthEndpoints(this IEndpointRouteBuilder app):
     //   var auth = app.MapGroup("/api/auth");
     //   auth.MapPost("/register", ...);   // US-001
     //   auth.MapPost("/login", ...);      // US-002
     auth.MapPost("/logout", LogoutAsync)
         .RequireAuthorization()
         .WithName("Logout")
         .WithTags("Auth");
     ```
  3. Add the handler. Session lifecycle is a transport concern — no Application/Domain call:
     ```csharp
     private static async Task<IResult> LogoutAsync(HttpContext httpContext)
     {
         // SignOutAsync emits a Set-Cookie that expires the auth cookie,
         // clearing it from the browser (AC-001). No response body is returned,
         // so no session state leaks to the client.
         await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
         return Results.NoContent();
     }
     ```
  4. Write `LogoutEndpointTests` using `WebApplicationFactory<Program>` and a shared `CookieContainer`/handler: (a) register+login to obtain the cookie; (b) `POST /api/auth/logout` → assert `204` and a `Set-Cookie` header that expires the auth cookie; (c) issue a follow-up request **without** the auth cookie to a `[RequireAuthorization]` endpoint (the logout endpoint itself, or `GET /api/me` once US-013 exists) → assert `401`; (d) unauthenticated `POST /api/auth/logout` → assert `401`.
- **Validation:** `dotnet build` green; `dotnet test --filter LogoutEndpointTests` all pass; manual `curl -i -b cookies.txt -X POST http://localhost:5000/api/auth/logout` returns `204` with a cookie-clearing `Set-Cookie`.
- **Rollback:** Revert the added mapping + handler in `AuthEndpoints.cs` and delete `LogoutEndpointTests.cs` (`git revert`/`git checkout -- <files>`); no data or migration to undo.
- **Estimated effort:** 2 hours.
- **Dependencies:** US-001 cookie auth, US-002 login (to obtain a cookie in tests). No prior phase.

### Phase 2 — `logout()` API client helper [Stack: Frontend]

- **Goal:** Add an idempotent `logout()` helper to `lib/api.ts` that terminates the session and treats a `401` as an already-ended session (AC-003).
- **Affected files:** [api.ts](../../vacaflow-web/src/lib/api.ts) *(exists after US-002 — add to it)*; [api.logout.test.ts](../../vacaflow-web/src/lib/api.logout.test.ts) *(new)*.
- **Steps:**
  1. Add `logout()` to the module (reuse the US-002 base-URL constant; shown standalone so it compiles as-is):
     ```typescript
     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

     /**
      * Terminates the current session.
      * Idempotent: a 401 means the session was already gone (expired or cleared),
      * which is treated as a successful logout (AC-003) — no error is surfaced.
      * Throws only on unexpected failures (5xx / network).
      */
     export async function logout(): Promise<void> {
       const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
         method: "POST",
         credentials: "include",
       });

       // 204 = signed out; 401 = session already terminated → treat as success.
       if (!response.ok && response.status !== 401) {
         throw new Error(`Logout failed with status ${response.status}`);
       }
     }
     ```
  2. Write `api.logout.test.ts` mocking `fetch`: (a) `204` → resolves; (b) `401` → resolves (idempotent, no throw); (c) `500`/network error → rejects; assert every call uses `credentials:'include'` and `method:'POST'`.
- **Validation:** `npm run build` and `npm run lint` green (no `any`, strict); `logout()` unit tests pass.
- **Rollback:** Remove the `logout()` export and delete `api.logout.test.ts`.
- **Estimated effort:** 1.5 hours.
- **Dependencies:** Phase 1 (endpoint must exist before the frontend calls it).

### Phase 3 — `LogoutButton` component + mount [Stack: Frontend]

- **Goal:** Provide an accessible logout control on the authenticated landing page with loading / error / success states.
- **Affected files:** [LogoutButton.tsx](../../vacaflow-web/src/components/LogoutButton.tsx) *(new)*; [LogoutButton.test.tsx](../../vacaflow-web/src/components/LogoutButton.test.tsx) *(new)*; [requests/page.tsx](../../vacaflow-web/src/app/requests/page.tsx) *(exists after US-002 — edit; create minimal stub if absent per A3)*.
- **Steps:**
  1. Create the client component:
     ```tsx
     "use client";

     import { useState } from "react";
     import { useRouter } from "next/navigation";
     import { logout } from "@/lib/api";

     export function LogoutButton() {
       const router = useRouter();
       const [pending, setPending] = useState(false);
       const [error, setError] = useState<string | null>(null);

       async function handleLogout(): Promise<void> {
         setPending(true);
         setError(null);
         try {
           await logout();
           router.replace("/login"); // replace: no back-nav into an authenticated view
         } catch {
           setError("Could not log out. Please try again.");
           setPending(false);
         }
       }

       return (
         <div>
           <button
             type="button"
             onClick={handleLogout}
             disabled={pending}
             aria-busy={pending}
           >
             {pending ? "Signing out…" : "Log out"}
           </button>
           {error && (
             <p role="alert" aria-live="assertive">
               {error}
             </p>
           )}
         </div>
       );
     }
     ```
  2. Mount `<LogoutButton />` on `app/requests/page.tsx` (import from `@/components/LogoutButton`). If the page does not yet exist, create a minimal authenticated stub that renders a heading and `<LogoutButton />` so the control is reachable at end of Sprint 1.
  3. Write `LogoutButton.test.tsx` (React Testing Library) mocking `@/lib/api` and `next/navigation`: (a) click → shows "Signing out…", button disabled/`aria-busy`; (b) resolved → `router.replace('/login')` called; (c) rejected → `role="alert"` message shown and button re-enabled; (d) keyboard: control is focusable and activates on Enter/Space.
- **Validation:** `npm run build`/`npm run lint` green; component tests pass; manual: log in, click **Log out**, confirm redirect to `/login` and that navigating back to `/requests` redirects to `/login` (session gone, AC-002/AC-003). Verify at 375 px and 768 px.
- **Rollback:** Delete `LogoutButton.tsx` + test; revert the `app/requests/page.tsx` edit (or delete the stub if this US created it).
- **Estimated effort:** 2.5 hours.
- **Dependencies:** Phase 2 (`logout()` helper).

---

## 7. Database Changes

**No database changes required.** Logout is a stateless cookie operation (`SignOutAsync`); no table, column, seed, or migration is added or altered.

---

## 8. Testing Strategy

### Backend (coverage ≥80% on changed code)
- **Integration (`WebApplicationFactory<Program>`):**
  - AC-001: authenticated `POST /api/auth/logout` → `204` and `Set-Cookie` expires the auth cookie.
  - AC-002: after logout, a request without a valid session to a `[RequireAuthorization]` endpoint → `401`.
  - Guard: unauthenticated `POST /api/auth/logout` → `401` (proves `RequireAuthorization` + the US-001 `OnRedirectToLogin`→401 behavior).
- **Mocks:** none needed — the endpoint has no Application dependency; tests run through the real HTTP pipeline.

### Frontend (coverage ≥80% on changed code)
- **Unit — `logout()`:** `204` resolves; `401` resolves (idempotent); `500`/network rejects; every request uses `POST` + `credentials:'include'`.
- **Component — `LogoutButton`:** loading, success-navigation, and error-recovery paths (see Phase 3).
- **a11y:** button has an accessible name, `aria-busy` during the request, error surfaced via `role="alert"`; fully keyboard-operable (axe/jest-axe assertion with zero violations).

### Cross-cutting
- **Contract:** the frontend `logout()` targets exactly `POST /api/auth/logout` and depends only on `2xx`/`401` semantics defined in Phase 1.
- **Regression:** confirm the US-002 `401 → /login` interceptor and the login flow still pass; confirm `grep -r "using Microsoft" VacaFlow.Application/` returns zero.

### UX/UI Validation
UX requirements are inlined here (trivial single-control surface; no separate UX_Booster pass warranted for one button):
- **Loading state:** button disabled + label "Signing out…" + `aria-busy="true"` while the request is in flight (prevents double-submit).
- **Error state:** on unexpected failure, a `role="alert"` message "Could not log out. Please try again." appears and the button re-enables for retry.
- **Empty state:** not applicable (action control, no data list).
- **Success state:** immediate `router.replace('/login')`; no stale authenticated view remains reachable via Back.
- **Responsive:** control and states render correctly at 375 px (mobile) and 768 px (tablet) without overflow.

---

## 9. Configuration & Deployment

### Backend environment
- `ConnectionStrings:VacaFlow` — unchanged (US-001).
- `CookieAuth:*` (name, HttpOnly, `SameSite=Strict`, sliding 120 min, `OnRedirectToLogin`→401) — unchanged (US-001); logout depends on it.
- `Cors:AllowedOrigin` — must permit the frontend origin **with credentials** (`AllowCredentials()` + explicit origin, never `*`); required for the browser to send/clear the cookie cross-origin.

### Frontend environment
- `vacaflow-web/.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`.

### Local run order
1. Start the API (`dotnet run --project VacaFlow.Api`) — listens on `http://localhost:5000`.
2. Start the web app (`npm run dev` in `vacaflow-web`).

### Feature flags
None.

---

## 10. Risks & Mitigations

| # | Risk | Prob | Impact | Mitigation | Owner | Stack |
|---|---|---|---|---|---|---|
| R-1 | Stateless cookie: `SignOutAsync` clears the browser cookie but does not revoke an already-captured raw cookie server-side, so a replayed cookie stays valid until the 120-min sliding expiry (OWASP A07 — session management). | L | M | `HttpOnly` + `SameSite=Strict` limit capture/CSRF; short sliding cap; document as accepted MVP limitation; future `ITicketStore`/server-side session store for true revocation. | BSA / Coder | BE |
| R-2 | If US-001 did not configure `OnRedirectToLogin`→401, unauthenticated `/api/*` calls return a `302` redirect instead of `401`, breaking AC-002/AC-003. | M | H | Verify in Pre-flight; the Phase 1 integration test asserting `401` on the unauthenticated call fails fast if misconfigured; fix belongs to US-001. | Coder | BE |
| R-3 | Landing page `app/requests/page.tsx` may not exist at Sprint-1 sequencing, leaving nowhere to mount the button. | M | M | A3 + Phase 3 create a minimal authenticated stub if absent; button also re-mounted on `/manager` when US-008 builds it. | Coder | FE |
| R-4 | Logout via a cross-site GET could be forced (CSRF logout) if a GET variant existed. | L | L | Endpoint is `POST`-only; `SameSite=Strict` blocks cross-site cookie send. | Coder | BE |

---

## 11. Definition of Done

- [ ] **Backend code:** `POST /api/auth/logout` added with `.RequireAuthorization()`; handler calls `SignOutAsync` and returns `204`; no Application/Domain change.
- [ ] **Frontend code:** `logout()` helper (idempotent 401) in `lib/api.ts`; `LogoutButton.tsx` created and mounted on the authenticated landing page.
- [ ] **Tests:** backend integration (AC-001/AC-002 + unauthenticated 401) and frontend unit + component tests pass; ≥80% coverage on changed code (Domain+Application unaffected).
- [ ] **a11y:** WCAG 2.1 AA — accessible button name, `aria-busy` during request, `role="alert"` errors, keyboard-operable; jest-axe zero violations.
- [ ] **UI states:** loading, error, and success implemented (empty N/A); UX score ≥7; verified at 375 px and 768 px; button interaction well under LCP ≤2.5 s / CLS ≤0.1.
- [ ] **API docs:** endpoint annotated (`WithName`/`WithTags`); appears in the OpenAPI/Swagger surface `[TBD — verify OpenAPI generation configured in US-001]`.
- [ ] **Shared TS types:** none required (logout has no request/response payload) — confirmed.
- [ ] **Migrations:** none (verified).
- [ ] **Docs:** `Update_Docs` run for the changed surface; CHANGELOG updated.
- [ ] **Boundary check:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- [ ] **PR approval:** peer-reviewed and approved.
- [ ] **Acceptance criteria satisfied:** AC-001 (session terminated, cookie cleared, success response), AC-002 (subsequent authenticated request → 401), AC-003 (already-expired session → redirect to `/login` with no secondary error, via the US-002 interceptor and the idempotent `logout()`).

---

## 12. References

- [backlog §US-003](../../documentation/05-planning/backlog.md) — acceptance criteria AC-001..AC-003.
- [functional-spec](../../documentation/02-define/functional-spec.md) — FR-AUTH-006 (terminate session on logout).
- [business-rules](../../documentation/03-requirements/business-rules.md) — BR-IDEN-001 (identity derived from session cookie only).
- [software-architecture-document](../../documentation/04-architecture/software-architecture-document.md) — Reduced Onion (Alternative C); cookie-auth + `ICurrentUserContext`.
- [tech-doc](../../documentation/07-development/tech-doc.md) — cookie auth (HttpOnly, `SameSite=Strict`, sliding 120 min).
- [code-standards](../../documentation/07-development/code-standards.md) — C#/TS conventions, boundary rule, coverage gate.
- Related user stories: US-001 (Registration / scaffolding), US-002 (Login / `lib/api.ts` / `ICurrentUserContext`), US-013 (Current-user endpoint — later protected-route probe for AC-002).
- Shared technical brief: VacaFlow_03 Implementation-Plan brief §4 (API surface), §5 (business rules), §7 (output contract).
