# Implementation Plan — US-002 User Login

## 1. Metadata

| Field | Value |
|---|---|
| **Plan ID** | IP-2026-07-22-us-002-user-login |
| **Date** | 2026-07-22 |
| **Source analysis** | [backlog.md §US-002](../../documentation/05-planning/backlog.md) |
| **Author** | Bsa (AI Assisted) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Impacted stacks** | Backend (Domain, Application, Infrastructure, Api) · Frontend (Next.js) |
| **Linked ticket** | US-002 |
| **Story points** | 5 |
| **Global risk** | Medium |

---

## 2. Executive Summary

- **Change:** Add credential-based login for registered users — `POST /api/auth/login` verifies the submitted password against the stored BCrypt hash and, on success, issues an HttpOnly session cookie carrying the user's identity claims (`NameIdentifier` = Guid, `Role`).
- **Motivation:** US-001 lets users register; US-002 lets them authenticate so every subsequent business operation runs under a server-verified identity (FR-AUTH-004, FR-AUTH-008).
- **Backend impact:** New `AuthService.LoginAsync`; a domain password-verification method; the `ICurrentUserContext` abstraction (Application) with its `HttpContextCurrentUserContext` implementation (Infrastructure) registered scoped in `AddInfrastructure()`; one new anonymous endpoint. No schema change.
- **Frontend impact:** New `/login` route (`page.tsx`), a `login()` helper in `api.ts`, and a global `apiFetch` wrapper that redirects to `/login` on a `401` response.
- **Security posture:** Identical generic authentication-failure response for both wrong-password and non-existent-account cases (no account enumeration, OWASP A07), timing equalized with a dummy BCrypt verify; identity is derived exclusively server-side from the validated cookie (BR-IDEN-001/002).
- **Global risk:** Medium. **Total effort:** ~19 hours (Backend 11h · Frontend 8h · DB 0h).

---

## 3. Scope

### In scope — Backend
- Domain: `Employee.VerifyPassword(string)` wrapping `BCrypt.Verify` (keeps hashing/verification inside the Domain, consistent with the US-001 `Employee.Create` factory hash).
- Application: `LoginRequest` / `AuthenticatedUser` DTO records; extend `IAuthService` with `LoginAsync`; implement `AuthService.LoginAsync` (generic failure, timing-safe, no enumeration).
- Application: introduce `ICurrentUserContext` interface (`Guid CurrentUserId`, `UserRole CurrentUserRole`).
- Infrastructure: `HttpContextCurrentUserContext : ICurrentUserContext`; register it scoped and call `AddHttpContextAccessor()` inside the existing `AddInfrastructure()`.
- Api: `POST /api/auth/login` (anonymous) — verifies via `AuthService`, then issues the cookie via `HttpContext.SignInAsync` with the identity claims.

### In scope — Frontend
- `vacaflow-web/src/app/login/page.tsx` — client login form with loading, error (generic), and success (redirect) states.
- `vacaflow-web/src/lib/api.ts` — `login()` helper + `apiFetch` wrapper implementing redirect-on-`401`.
- Responsive layout (mobile ≥360px) and WCAG 2.1 AA form semantics.

### In scope — Contracts
- New endpoint `POST /api/auth/login` (see §4 table). Request `{ email, password }`; success `200` body `{ employeeId, fullName, email, role }` + `Set-Cookie` (HttpOnly); failure `401 UNAUTHORIZED` with generic message.

### Out of scope
- Logout / session termination (US-003).
- `GET /api/me` current-user endpoint and the `useCurrentUser` hook (US-013) — US-002 uses the login response body only for a one-time redirect decision, never persisting identity.
- Manager-account creation (seed/admin channel only, BR-AUTH-003).
- Password reset, lockout, MFA, "remember me" (Won't-v1 W-005/W-019).
- Any absence-request routes/pages (US-004+).

### Assumptions
- **[A-1]** US-001 is merged and its scaffolding exists — the solution, `VacaFlowDbContext`, `Employees` table, cookie-authentication scheme in `Program.cs`, `ExceptionHandlingMiddleware`, the `AddInfrastructure()` DI extension, `vacaflow-web/src/lib/api.ts`, the `Employee` entity + `UserRole` enum, `IAuthService`/`AuthService`, and `IUserRepository.GetByEmailAsync`. **These are NOT re-scaffolded here.**
- **[A-2]** US-001 configured the cookie as HttpOnly, `SameSite=Strict`, sliding 120 min, and configured CORS with `AllowCredentials()` for the Next.js origin. US-002 relies on that configuration unchanged.
- **[A-3]** BCrypt work factor is embedded in each stored hash, so `BCrypt.Verify` reads it automatically — no shared cost configuration is required between US-001 and US-002.
- **[A-4]** The post-login redirect targets (`/requests`, `/manager`) are delivered by later stories; until then they resolve to a Next.js 404 at runtime. This is non-blocking for US-002 (the build stays green and login itself succeeds).

---

## 4. Architecture Impact

### Before → After

```
BEFORE (after US-001)                          AFTER (US-002)
─────────────────────                          ──────────────
vacaflow-web                                   vacaflow-web
  lib/api.ts  register()                         lib/api.ts  register(), login(), apiFetch(401→/login)
                                                 app/login/page.tsx   ← NEW
        │ POST /api/auth/register                       │ POST /api/auth/login   ← NEW
        ▼                                               ▼
VacaFlow.Api                                   VacaFlow.Api
  AuthEndpoints  register                        AuthEndpoints  register, login (SignInAsync + claims) ← NEW
        │                                               │
        ▼                                               ▼
VacaFlow.Application                           VacaFlow.Application
  IAuthService.RegisterAsync                     IAuthService.LoginAsync            ← NEW
  AuthService                                    AuthService.LoginAsync             ← NEW
                                                 ICurrentUserContext (interface)    ← NEW
        │                                               │
        ▼                                               ▼
VacaFlow.Domain  Employee.Create (hash)        VacaFlow.Domain  Employee.VerifyPassword ← NEW
        ▲                                               ▲
VacaFlow.Infrastructure                        VacaFlow.Infrastructure
  AddInfrastructure() (repos, tx)                AddInfrastructure() + HttpContextCurrentUserContext (scoped) ← NEW
                                                 + AddHttpContextAccessor()
```

The sign-in mechanism (`SignInAsync`, `ClaimsPrincipal`, `CookieAuthenticationDefaults`) stays entirely inside `VacaFlow.Api`. `AuthService.LoginAsync` returns a plain DTO — the Application layer keeps **zero** `Microsoft.*` references.

### API Contract Changes

| Method | Path | Auth | Request body | Success | Failure |
|---|---|---|---|---|---|
| POST | `/api/auth/login` | Anonymous | `{ "email": string, "password": string }` | `200 OK` + `Set-Cookie: <auth>` (HttpOnly, SameSite=Strict) · body `{ "employeeId": guid, "fullName": string, "email": string, "role": "Employee"\|"Manager" }` | `401 UNAUTHORIZED` `{ "code": "UNAUTHORIZED", "message": "Invalid email or password." }` (identical for wrong password **and** non-existent account) |

### Frontend State / Routing changes
- New route segment `app/login/page.tsx` (client component).
- `api.ts` gains `login()`, `ApiError`, and `apiFetch` (adds `credentials:'include'` + `Content-Type` + `401`→`/login` redirect, guarded so it does not redirect while already on `/login`).
- Local component state only (`email`, `password`, `error`, `isSubmitting`); nothing persisted to `localStorage` (identity comes from the session cookie, per conventions).

### Backend interface changes
- `IAuthService` gains `Task<AuthenticatedUser> LoginAsync(LoginRequest request)`.
- New `ICurrentUserContext { Guid CurrentUserId { get; } UserRole CurrentUserRole { get; } }` (Application) implemented by `HttpContextCurrentUserContext` (Infrastructure), registered scoped.
- `Employee` gains `bool VerifyPassword(string plainTextPassword)` (Domain).

---

## 5. Pre-flight Checklist

- [ ] **Branch:** create `feature/us-002-user-login` from the branch containing merged US-001.
- [ ] **Prerequisite US (do NOT re-scaffold):** confirm the following US-001 artifacts already exist and build:
  - [ ] `VacaFlow.sln` and the five projects with correct references.
  - [ ] `VacaFlow.Infrastructure/Persistence/VacaFlowDbContext.cs` with the `Employees` table (Id, FullName, Email, PasswordHash, Role, AssignedManagerId?, CreatedAt).
  - [ ] Cookie-authentication scheme wired in `VacaFlow.Api/Program.cs` (HttpOnly, SameSite=Strict, sliding 120 min) + CORS `AllowCredentials()` for the web origin.
  - [ ] `VacaFlow.Api/Middleware/ExceptionHandlingMiddleware.cs` (maps `UnauthorizedAccessException`→`401 UNAUTHORIZED`).
  - [ ] `VacaFlow.Infrastructure/Extensions/InfrastructureServiceExtensions.cs` exposing `AddInfrastructure()`.
  - [ ] `VacaFlow.Domain/Entities/Employee.cs` (+ `ValueObjects/UserRole.cs`).
  - [ ] `VacaFlow.Application/Interfaces/IAuthService.cs`, `VacaFlow.Application/Services/AuthService.cs`, `VacaFlow.Application/Interfaces/IUserRepository.cs` with `GetByEmailAsync(string email)`.
  - [ ] `vacaflow-web/src/lib/api.ts` (with `register()`), `vacaflow-web/src/app/register/page.tsx`.
- [ ] **Build baseline:** `dotnet build VacaFlow.sln` green; `cd vacaflow-web && npm ci && npm run build` green.
- [ ] **Dependencies:** `BCrypt.Net-Next` already referenced by `VacaFlow.Domain` (from US-001); no new NuGet/npm packages required.
- [ ] **Test suite:** `dotnet test` and `npm test` pass on the baseline.
- [ ] **Migrations:** none needed — the `Employees` table is unchanged (confirm in §7).
- [ ] **Analysis reviewed:** [backlog §US-002](../../documentation/05-planning/backlog.md) AC-001…AC-004 and the shared technical brief read in full.

---

## 6. Implementation Phases

### Phase 1 — Domain: password verification method [Stack: Backend | DB: no]

- **Goal:** Encapsulate BCrypt verification inside the `Employee` entity so the Application layer never touches a crypto library directly.
- **Affected files:** [`VacaFlow.Domain/Entities/Employee.cs`](../../VacaFlow.Domain/Entities/Employee.cs)
- **Steps:**
  1. Add a public method to the existing `Employee` entity that verifies a plaintext password against the stored hash:
     ```csharp
     // VacaFlow.Domain/Entities/Employee.cs (add inside the existing Employee class)
     /// <summary>Verifies a plaintext password against the stored BCrypt hash.</summary>
     public bool VerifyPassword(string plainTextPassword)
     {
         if (string.IsNullOrEmpty(plainTextPassword) || string.IsNullOrEmpty(PasswordHash))
         {
             return false;
         }

         return BCrypt.Net.BCrypt.Verify(plainTextPassword, PasswordHash);
     }
     ```
  2. Keep `PasswordHash` set/hash logic exactly as US-001 left it (no changes to `Employee.Create`).
- **Validation:** `dotnet build VacaFlow.Domain` green; a unit test in Phase 3 proves a correct password returns `true` and a wrong one returns `false`.
- **Rollback:** revert the added method (single-method diff) in `Employee.cs`.
- **Estimated effort:** 1h.
- **Dependencies:** none (US-001 scaffolding).

---

### Phase 2 — Application: contracts (DTOs, `IAuthService.LoginAsync`, `ICurrentUserContext`) [Stack: Backend]

- **Goal:** Declare the login DTOs, extend the auth interface, and introduce the session-identity abstraction — all framework-free.
- **Affected files:**
  - [`VacaFlow.Application/Contracts/Auth/LoginRequest.cs`](../../VacaFlow.Application/Contracts/Auth/LoginRequest.cs) *(new)*
  - [`VacaFlow.Application/Contracts/Auth/AuthenticatedUser.cs`](../../VacaFlow.Application/Contracts/Auth/AuthenticatedUser.cs) *(new)*
  - [`VacaFlow.Application/Interfaces/IAuthService.cs`](../../VacaFlow.Application/Interfaces/IAuthService.cs) *(edit)*
  - [`VacaFlow.Application/Interfaces/ICurrentUserContext.cs`](../../VacaFlow.Application/Interfaces/ICurrentUserContext.cs) *(new)*
- **Steps:**
  1. Create the request DTO record:
     ```csharp
     // VacaFlow.Application/Contracts/Auth/LoginRequest.cs
     namespace VacaFlow.Application.Contracts.Auth;

     public sealed record LoginRequest(string Email, string Password);
     ```
  2. Create the result DTO record (carries the data the Api needs to build claims and the response body):
     ```csharp
     // VacaFlow.Application/Contracts/Auth/AuthenticatedUser.cs
     using VacaFlow.Domain.ValueObjects;

     namespace VacaFlow.Application.Contracts.Auth;

     public sealed record AuthenticatedUser(Guid EmployeeId, string FullName, string Email, UserRole Role);
     ```
  3. Extend the existing auth interface:
     ```csharp
     // VacaFlow.Application/Interfaces/IAuthService.cs (add to the existing interface)
     using VacaFlow.Application.Contracts.Auth;

     // ...existing RegisterAsync signature stays...
     Task<AuthenticatedUser> LoginAsync(LoginRequest request);
     ```
  4. Create the session-identity abstraction (matches the brief §2.3 signature exactly):
     ```csharp
     // VacaFlow.Application/Interfaces/ICurrentUserContext.cs
     using VacaFlow.Domain.ValueObjects;

     namespace VacaFlow.Application.Interfaces;

     /// <summary>Server-side identity of the current request, resolved from the validated session cookie.</summary>
     public interface ICurrentUserContext
     {
         Guid CurrentUserId { get; }
         UserRole CurrentUserRole { get; }
     }
     ```
- **Validation:** `dotnet build VacaFlow.Application` green; `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- **Rollback:** delete the three new files and revert the `IAuthService` addition.
- **Estimated effort:** 2h.
- **Dependencies:** Phase 1.

---

### Phase 3 — Application: `AuthService.LoginAsync` + unit tests [Stack: Backend]

- **Goal:** Implement credential verification with a single generic failure path (no enumeration, timing-equalized) and cover it with hermetic unit tests.
- **Affected files:**
  - [`VacaFlow.Application/Services/AuthService.cs`](../../VacaFlow.Application/Services/AuthService.cs) *(edit)*
  - [`VacaFlow.Tests/Application/AuthServiceLoginTests.cs`](../../VacaFlow.Tests/Application/AuthServiceLoginTests.cs) *(new)*
  - [`VacaFlow.Tests/Fakes/FakeUserRepository.cs`](../../VacaFlow.Tests/Fakes/FakeUserRepository.cs) *(new or extend the US-001 fake)*
- **Steps:**
  1. Add `LoginAsync` to the existing `sealed AuthService` (reuse the injected `IUserRepository`):
     ```csharp
     // VacaFlow.Application/Services/AuthService.cs (add to the existing sealed class)
     // A precomputed BCrypt hash (cost 11) of a random value. Verifying against it when the
     // account does not exist equalizes response time and prevents timing-based enumeration
     // (OWASP A07). Regenerate locally with: BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()).
     private const string DummyHash = "$2a$11$C6UzMDM.H6dfI/f/IKcEeO1IAd.o1nZ8Vp0y1oQ0m5eXqQd2Cwq6";

     public async Task<AuthenticatedUser> LoginAsync(LoginRequest request)
     {
         var email = request.Email?.Trim() ?? string.Empty;

         if (email.Length == 0 || string.IsNullOrEmpty(request.Password))
         {
             throw new UnauthorizedAccessException("Invalid email or password.");
         }

         var employee = await _userRepository.GetByEmailAsync(email);

         // Non-existent account: run a dummy verify so timing matches the wrong-password path,
         // then fail with the SAME generic message (no account enumeration — AC-003).
         if (employee is null)
         {
             _ = BCrypt.Net.BCrypt.Verify(request.Password, DummyHash);
             throw new UnauthorizedAccessException("Invalid email or password.");
         }

         if (!employee.VerifyPassword(request.Password))
         {
             throw new UnauthorizedAccessException("Invalid email or password.");
         }

         return new AuthenticatedUser(employee.Id, employee.FullName, employee.Email, employee.Role);
     }
     ```
     > `UnauthorizedAccessException` is mapped to `401 UNAUTHORIZED` by the US-001 `ExceptionHandlingMiddleware`. The identical message on all three failure branches satisfies AC-002 and AC-003.
  2. Ensure `IUserRepository` exposes `Task<Employee?> GetByEmailAsync(string email)` (added by US-001). If it currently only checks existence for register, extend it to return the entity — coordinate as a US-001 carry-over, do not duplicate the repository.
  3. Add/extend the hand-written fake (no Moq) to seed employees by email.
  4. Write unit tests (AAA, `Method_ExpectedBehavior_WhenCondition`):
     - `LoginAsync_ReturnsAuthenticatedUser_WhenCredentialsValid`
     - `LoginAsync_Throws401_WhenPasswordWrong`
     - `LoginAsync_Throws401_WhenAccountMissing`
     - `LoginAsync_Throws401_WhenEmailOrPasswordEmpty`
     - `LoginAsync_UsesSameMessage_ForWrongPasswordAndMissingAccount` (asserts identical exception message — anti-enumeration).
     ```csharp
     // VacaFlow.Tests/Application/AuthServiceLoginTests.cs (representative case)
     [Fact]
     public async Task LoginAsync_UsesSameMessage_ForWrongPasswordAndMissingAccount()
     {
         var repo = new FakeUserRepository();
         repo.Add(Employee.Create("Ann Lee", "ann@igs.com", "Correct-horse-1", UserRole.Employee));
         var sut = new AuthService(repo /*, other US-001 deps */);

         var wrongPassword = await Record.ExceptionAsync(
             () => sut.LoginAsync(new LoginRequest("ann@igs.com", "wrong")));
         var missingAccount = await Record.ExceptionAsync(
             () => sut.LoginAsync(new LoginRequest("nobody@igs.com", "wrong")));

         Assert.IsType<UnauthorizedAccessException>(wrongPassword);
         Assert.IsType<UnauthorizedAccessException>(missingAccount);
         Assert.Equal(wrongPassword!.Message, missingAccount!.Message);
     }
     ```
- **Validation:** `dotnet test VacaFlow.Tests` green; new tests cover ≥80% of the changed `AuthService` surface.
- **Rollback:** revert the `LoginAsync` method and delete the new test file.
- **Estimated effort:** 4h.
- **Dependencies:** Phase 2.

---

### Phase 4 — Infrastructure: `HttpContextCurrentUserContext` + DI registration [Stack: Backend]

- **Goal:** Provide the server-side identity implementation and register it scoped so any business operation reads identity from the cookie (AC-004, BR-IDEN-001/002).
- **Affected files:**
  - [`VacaFlow.Infrastructure/Services/HttpContextCurrentUserContext.cs`](../../VacaFlow.Infrastructure/Services/HttpContextCurrentUserContext.cs) *(new)*
  - [`VacaFlow.Infrastructure/Extensions/InfrastructureServiceExtensions.cs`](../../VacaFlow.Infrastructure/Extensions/InfrastructureServiceExtensions.cs) *(edit)*
- **Steps:**
  1. Implement the adapter over `IHttpContextAccessor`, reading the claims the login endpoint writes (Phase 5). Throw `UnauthorizedAccessException` when identity is unresolved (→ 401, BR-IDEN-002):
     ```csharp
     // VacaFlow.Infrastructure/Services/HttpContextCurrentUserContext.cs
     using System.Security.Claims;
     using Microsoft.AspNetCore.Http;
     using VacaFlow.Application.Interfaces;
     using VacaFlow.Domain.ValueObjects;

     namespace VacaFlow.Infrastructure.Services;

     public sealed class HttpContextCurrentUserContext : ICurrentUserContext
     {
         private readonly IHttpContextAccessor _httpContextAccessor;

         public HttpContextCurrentUserContext(IHttpContextAccessor httpContextAccessor)
             => _httpContextAccessor = httpContextAccessor;

         public Guid CurrentUserId
         {
             get
             {
                 var raw = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                 return Guid.TryParse(raw, out var id)
                     ? id
                     : throw new UnauthorizedAccessException("No authenticated user in the current context.");
             }
         }

         public UserRole CurrentUserRole
         {
             get
             {
                 var raw = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value;
                 return Enum.TryParse<UserRole>(raw, ignoreCase: false, out var role)
                     ? role
                     : throw new UnauthorizedAccessException("No authenticated role in the current context.");
             }
         }
     }
     ```
  2. Register the binding and the accessor inside the existing `AddInfrastructure()` (do not create a second extension):
     ```csharp
     // VacaFlow.Infrastructure/Extensions/InfrastructureServiceExtensions.cs (add inside AddInfrastructure)
     services.AddHttpContextAccessor();
     services.AddScoped<ICurrentUserContext, HttpContextCurrentUserContext>();
     ```
- **Validation:** `dotnet build VacaFlow.Infrastructure` green; the app resolves `ICurrentUserContext` at startup without DI errors (`dotnet run` boots, `GET /health` returns 200).
- **Rollback:** delete `HttpContextCurrentUserContext.cs` and revert the two `AddInfrastructure()` lines.
- **Estimated effort:** 2h.
- **Dependencies:** Phase 2.

---

### Phase 5 — Api: `POST /api/auth/login` endpoint [Stack: Backend]

- **Goal:** Verify credentials via `AuthService`, then issue the HttpOnly cookie with the identity claims — keeping all ASP.NET sign-in types in the Api layer.
- **Affected files:** [`VacaFlow.Api/Endpoints/AuthEndpoints.cs`](../../VacaFlow.Api/Endpoints/AuthEndpoints.cs) *(edit — add to the existing auth endpoint group)*
- **Steps:**
  1. Add the anonymous login endpoint alongside the US-001 register endpoint:
     ```csharp
     // VacaFlow.Api/Endpoints/AuthEndpoints.cs (add inside the existing mapping method)
     using System.Security.Claims;
     using Microsoft.AspNetCore.Authentication;
     using Microsoft.AspNetCore.Authentication.Cookies;
     using VacaFlow.Application.Contracts.Auth;
     using VacaFlow.Application.Interfaces;

     // group.MapPost(...) — 'group' is the existing "/api/auth" RouteGroupBuilder from US-001.
     group.MapPost("/login", async (LoginRequest request, IAuthService authService, HttpContext httpContext) =>
     {
         var user = await authService.LoginAsync(request); // throws UnauthorizedAccessException -> 401

         var claims = new[]
         {
             new Claim(ClaimTypes.NameIdentifier, user.EmployeeId.ToString()),
             new Claim(ClaimTypes.Role, user.Role.ToString()),
             new Claim(ClaimTypes.Name, user.FullName),
         };
         var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

         await httpContext.SignInAsync(
             CookieAuthenticationDefaults.AuthenticationScheme,
             new ClaimsPrincipal(identity));

         return Results.Ok(new
         {
             employeeId = user.EmployeeId,
             fullName = user.FullName,
             email = user.Email,
             role = user.Role.ToString(),
         });
     })
     .AllowAnonymous()
     .WithName("Login");
     ```
  2. Do **not** add any error-mapping code here — the US-001 `ExceptionHandlingMiddleware` already converts `UnauthorizedAccessException`→`401 { "code":"UNAUTHORIZED", ... }`.
- **Validation:** run the API; `curl -i -c cookies.txt -H "Content-Type: application/json" -d '{"email":"<seeded>","password":"<correct>"}' http://localhost:5000/api/auth/login` returns `200` + `Set-Cookie` (HttpOnly); a wrong password and an unknown email both return an identical `401` body. `grep -r "using Microsoft" VacaFlow.Application/` still returns zero.
- **Rollback:** revert the added `MapPost("/login", ...)` block.
- **Estimated effort:** 2h.
- **Dependencies:** Phases 3, 4.

---

### Phase 6 — Frontend: `api.ts` login helper + 401 redirect [Stack: Frontend]

- **Goal:** Add a typed `login()` client and a shared fetch wrapper that always sends the cookie and redirects to `/login` on `401`.
- **Affected files:** [`vacaflow-web/src/lib/api.ts`](../../vacaflow-web/src/lib/api.ts) *(edit)*
- **Steps:**
  1. Add the types, error class, wrapper, and helper (strict TS, no `any`, `credentials:'include'`):
     ```ts
     // vacaflow-web/src/lib/api.ts (additions)
     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

     export interface AuthenticatedUser {
       employeeId: string;
       fullName: string;
       email: string;
       role: 'Employee' | 'Manager';
     }

     export class ApiError extends Error {
       constructor(
         public readonly status: number,
         public readonly code: string,
         message: string,
       ) {
         super(message);
         this.name = 'ApiError';
       }
     }

     export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
       const response = await fetch(`${API_BASE_URL}${path}`, {
         ...init,
         credentials: 'include',
         headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
       });

       // Global session-expiry handling: bounce to /login, but never while already there
       // (prevents a redirect loop when a login attempt itself returns 401).
       if (
         response.status === 401 &&
         typeof window !== 'undefined' &&
         window.location.pathname !== '/login'
       ) {
         window.location.href = '/login';
       }

       return response;
     }

     export async function login(email: string, password: string): Promise<AuthenticatedUser> {
       const response = await apiFetch('/api/auth/login', {
         method: 'POST',
         body: JSON.stringify({ email, password }),
       });

       if (!response.ok) {
         const body = (await response.json().catch(() => null)) as
           | { code?: string; message?: string }
           | null;
         throw new ApiError(response.status, body?.code ?? 'UNKNOWN', body?.message ?? 'Login failed.');
       }

       return (await response.json()) as AuthenticatedUser;
     }
     ```
  2. If US-001's `register()` used a bare `fetch`, refactor it to call `apiFetch` for consistency (optional, keep the diff minimal).
- **Validation:** `npm run build` and `npm run lint` green; unit test (Phase 7) mocks `fetch` and asserts `credentials:'include'`, the `401`→redirect guard, and `ApiError` on non-ok.
- **Rollback:** revert the `api.ts` additions.
- **Estimated effort:** 3h.
- **Dependencies:** Phase 5 (endpoint must exist before the frontend calls it).

---

### Phase 7 — Frontend: `/login` page + UI states + tests [Stack: Frontend]

- **Goal:** Deliver an accessible login form with loading, generic-error, and success (role-based redirect) states.
- **Affected files:**
  - [`vacaflow-web/src/app/login/page.tsx`](../../vacaflow-web/src/app/login/page.tsx) *(new)*
  - [`vacaflow-web/src/app/login/page.test.tsx`](../../vacaflow-web/src/app/login/page.test.tsx) *(new)*
- **Steps:**
  1. Create the client component:
     ```tsx
     // vacaflow-web/src/app/login/page.tsx
     'use client';

     import { useState, type FormEvent } from 'react';
     import { useRouter } from 'next/navigation';
     import { login } from '@/lib/api';

     export default function LoginPage() {
       const router = useRouter();
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const [error, setError] = useState<string | null>(null);
       const [isSubmitting, setIsSubmitting] = useState(false);

       async function handleSubmit(event: FormEvent<HTMLFormElement>) {
         event.preventDefault();
         setError(null);
         setIsSubmitting(true);
         try {
           const user = await login(email, password);
           router.push(user.role === 'Manager' ? '/manager' : '/requests');
         } catch {
           // Generic message only — never reveal which field was wrong (AC-002 / AC-003).
           setError('Invalid email or password.');
         } finally {
           setIsSubmitting(false);
         }
       }

       return (
         <main style={{ maxWidth: 360, margin: '0 auto', padding: '2rem 1rem' }}>
           <h1>Sign in to VacaFlow</h1>
           <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
             <label htmlFor="email">Email</label>
             <input
               id="email"
               name="email"
               type="email"
               autoComplete="email"
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               aria-invalid={error !== null}
               aria-describedby={error ? 'login-error' : undefined}
             />

             <label htmlFor="password">Password</label>
             <input
               id="password"
               name="password"
               type="password"
               autoComplete="current-password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               aria-invalid={error !== null}
               aria-describedby={error ? 'login-error' : undefined}
             />

             {error !== null && (
               <p id="login-error" role="alert">
                 {error}
               </p>
             )}

             <button type="submit" disabled={isSubmitting}>
               {isSubmitting ? 'Signing in…' : 'Sign in'}
             </button>
           </form>
         </main>
       );
     }
     ```
  2. Write tests (React Testing Library): renders labelled fields; submit calls `login`; failure shows the generic `role="alert"` message and stays on `/login`; success calls `router.push('/requests')` (Employee) / `'/manager'` (Manager); the submit button is disabled while `isSubmitting`.
- **Validation:** `npm test` green; `npm run build` green; keyboard-only tab order reaches email → password → submit; axe/jest-axe reports no violations.
- **Rollback:** delete `app/login/page.tsx` and its test.
- **Estimated effort:** 5h.
- **Dependencies:** Phase 6.

---

## 7. Database Changes

**No database changes required.** US-002 reads the existing `Employees` table (created by US-001: `Id, FullName, Email, PasswordHash, Role, AssignedManagerId?, CreatedAt`). No columns, indexes, tables, or migrations are added. `Email` uniqueness and the `PasswordHash` (BCrypt) column already exist. Confirm no migration is generated: `dotnet ef migrations list` shows no new entry after US-002.

---

## 8. Testing Strategy

### Backend (coverage ≥80% on changed code)
- **Unit — `AuthService.LoginAsync` (hand-written fakes, no Moq, no `DbContext`/`HttpContext`):** valid credentials return `AuthenticatedUser`; wrong password → `UnauthorizedAccessException`; missing account → `UnauthorizedAccessException`; empty email/password → `UnauthorizedAccessException`; **identical message** across wrong-password and missing-account (anti-enumeration).
- **Unit — `Employee.VerifyPassword`:** correct password → `true`; wrong → `false`; empty inputs → `false`.
- **Unit — `HttpContextCurrentUserContext`:** resolves `CurrentUserId`/`CurrentUserRole` from seeded claims; throws `UnauthorizedAccessException` when the claim is absent or malformed.
- **Integration (`WebApplicationFactory`, optional but recommended):** `POST /api/auth/login` with valid creds → `200` + `Set-Cookie` HttpOnly; wrong creds → `401` generic body; a follow-up call carrying the cookie resolves identity server-side.
- **Boundary:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.

### Frontend (coverage ≥80% on changed code)
- **Unit — `api.ts`:** `login()` posts to `/api/auth/login` with `credentials:'include'`; non-ok throws `ApiError`; `apiFetch` redirects to `/login` on `401` **only** when `pathname !== '/login'` (no loop).
- **Unit — `LoginPage`:** renders accessible form; success redirects by role; failure renders the single generic error; submit disabled while pending.
- **a11y:** jest-axe on the login page → 0 violations.

### Cross-cutting
- **Contract:** frontend `AuthenticatedUser` shape matches the API `200` body (`employeeId, fullName, email, role`).
- **Regression:** US-001 register flow still works after the `api.ts`/`AuthEndpoints` edits.

### UX/UI Validation
- **Loading state:** submit button shows "Signing in…", is disabled, and `aria-busy` is set while the request is in flight.
- **Error state:** a single generic `role="alert"` message ("Invalid email or password.") for every failure — no field-specific hint, no enumeration.
- **Empty state:** initial render shows an empty, focusable form with visible labels; no error until a submit attempt.
- **Success state:** role-based redirect (`/requests` for Employee, `/manager` for Manager); no identity written to `localStorage`.
- **Accessibility (WCAG 2.1 AA):** programmatic label/`for` association, `aria-invalid`/`aria-describedby` linkage to the error, keyboard-only completion, visible focus.
- **Responsive:** usable at ≥360px width (single-column, `max-width:360px` centered).

---

## 9. Configuration & Deployment

### Backend env config (all already introduced by US-001 — no new keys)
- `ConnectionStrings:VacaFlow` — SQLite path (`vacaflow.db`).
- `CookieAuth:*` — HttpOnly, `SameSite=Strict`, sliding 120 min (used by `SignInAsync`).
- `Cors:AllowedOrigin` — the Next.js origin; CORS must have `AllowCredentials()` so the `Set-Cookie` is accepted and sent back cross-origin.

### Frontend env files
- `vacaflow-web/.env.local` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000` (consumed by `apiFetch`).

### Local run order
1. `dotnet run --project VacaFlow.Api` (API on `http://localhost:5000`).
2. `cd vacaflow-web && npm run dev` (web on `http://localhost:3000`).
3. Register (US-001) or use a seeded account, then log in at `/login`.

### Performance thresholds (login page)
- LCP ≤ 2.5s, CLS ≤ 0.1 (trivially met — static form, no above-the-fold data fetch).

### Feature flags
- None.

---

## 10. Risks & Mitigations

| Risk | Probability | Impact | Mitigation | Owner | Stack |
|---|---|---|---|---|---|
| Account enumeration / timing side-channel reveals which emails are registered | M | H | Identical generic `401` message for wrong-password and missing-account; dummy `BCrypt.Verify` on the missing-account branch to equalize timing (OWASP A07); unit test asserts message equality | Backend | BE |
| Session cookie not persisted cross-origin (CORS `AllowCredentials` / `SameSite` / `credentials:'include'` mismatch) — login "succeeds" but next request is anonymous | M | H | Rely on US-001 CORS `AllowCredentials()` + `SameSite=Strict`; `apiFetch` always sets `credentials:'include'`; integration test verifies a cookie-bearing follow-up call resolves identity | Backend/Frontend | Cross |
| ASP.NET sign-in types (`SignInAsync`, `ClaimsPrincipal`) leak into the Application layer, breaking the onion boundary | L | H | Keep all sign-in code in `AuthEndpoints`; `AuthService.LoginAsync` returns a plain DTO; enforce with `grep -r "using Microsoft" VacaFlow.Application/` = 0 in DoD | Backend | BE |
| `401` redirect loop when a login attempt itself returns `401` | L | M | `apiFetch` guards the redirect with `pathname !== '/login'`; unit test covers it | Frontend | FE |
| Post-login redirect targets (`/requests`, `/manager`) not yet built, so a successful login lands on a 404 | L | L | Documented as Assumption A-4; routes arrive in US-004/US-008/US-011; login success + cookie issuance is still fully verifiable | Frontend | FE |

---

## 11. Definition of Done

- [ ] **Backend code:** `Employee.VerifyPassword`, `LoginRequest`/`AuthenticatedUser`, `IAuthService.LoginAsync` + implementation, `ICurrentUserContext` + `HttpContextCurrentUserContext`, `POST /api/auth/login` — all merged and building.
- [ ] **Frontend code:** `api.ts` `login()` + `apiFetch` (401 redirect), `/login` page.
- [ ] **AC satisfied:** AC-001 (successful login + HttpOnly cookie), AC-002 (generic failure on wrong password), AC-003 (identical failure for non-existent account — no enumeration), AC-004 (identity read server-side from the cookie via `ICurrentUserContext`, never the body).
- [ ] **Business rules:** BR-IDEN-001/BR-IDEN-002 enforced (identity from session only; unresolved → 401); BR-AUTH-002 (BCrypt verify, never plaintext).
- [ ] **Tests:** backend unit (+ optional integration) and frontend unit/a11y pass; ≥80% coverage on changed code; anti-enumeration message-equality test present.
- [ ] **a11y:** login page passes jest-axe (WCAG 2.1 AA); keyboard-only completion verified.
- [ ] **UI states:** loading, generic error, empty, and success (role-based redirect) all implemented.
- [ ] **Performance:** login page LCP ≤ 2.5s, CLS ≤ 0.1.
- [ ] **API docs:** `POST /api/auth/login` documented (request/response/`401` shape).
- [ ] **Shared TS types:** `AuthenticatedUser` matches the API response body.
- [ ] **Migrations:** none (confirmed — `Employees` unchanged).
- [ ] **Boundary check:** `grep -r "using Microsoft" VacaFlow.Application/` returns zero.
- [ ] **No secrets** in code, logs, or the plan; no plaintext password persisted or logged.
- [ ] **PR approved** by at least one reviewer; both builds green (`dotnet build` + `npm run build`).
- [ ] **Docs updated** (CHANGELOG / relevant docs) and the US-002 work item updated.

---

## 12. References

- **Source analysis:** [backlog.md §US-002](../../documentation/05-planning/backlog.md) (AC-001…AC-004, FR-AUTH-004, FR-AUTH-005, FR-AUTH-008).
- **Business rules:** BR-IDEN-001, BR-IDEN-002 (identity from session cookie), BR-AUTH-002 (BCrypt), BR-ROLE-* (role claim used by later stories).
- **Shared technical brief:** VacaFlow_03 Shared Technical Brief (architecture §2, data model §3, API surface §4, error shape §4, conventions §6, output contract §7).
- **Prerequisite plan:** US-001 (solution scaffolding, `VacaFlowDbContext`, cookie-auth scheme, `ExceptionHandlingMiddleware`, `AddInfrastructure()`, `Employee`/`UserRole`, `IAuthService`/`AuthService`, `api.ts`).
- **Related stories:** US-001 (Registration, prerequisite), US-003 (Logout, consumer of this session), US-013 (`GET /api/me`, consumes `ICurrentUserContext`), US-004/US-008/US-011 (post-login routes).
- **OWASP:** A07 Identification & Authentication Failures (generic errors, no enumeration), A01 Broken Access Control (server-side identity).

---

*Generated by Bsa (AI Assisted) via the Implementation_Plan_Generator skill — 2026-07-22.*
