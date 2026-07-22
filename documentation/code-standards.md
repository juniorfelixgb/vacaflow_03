# Code Standards: VacaFlow_03

**Author:** Yeuri Jessel Reyes (AI Assisted)
**Date:** 2026-07-21
**Version:** 1.0
**Status:** Draft — Awaiting Approval
**Project:** VacaFlow_03 — IGS Solutions
**References:** SAD-001 (Software Architecture Document), FS-001 (Functional Spec), NFR-001 (Non-Functional Requirements Specification)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-21 | Yeuri Jessel Reyes (AI Assisted) | Initial version |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [General Guidelines](#2-general-guidelines)
3. [C# Standards (Backend)](#3-c-standards-backend)
4. [TypeScript and React Standards (Frontend)](#4-typescript-and-react-standards-frontend)
5. [Onion Architecture Compliance Rules](#5-onion-architecture-compliance-rules)
6. [Security Standards](#6-security-standards)
7. [Testing Standards](#7-testing-standards)
8. [Code Quality Metrics](#8-code-quality-metrics)
9. [Code Review Standards](#9-code-review-standards)
10. [Git Standards](#10-git-standards)
11. [Error Handling Standards](#11-error-handling-standards)
12. [Performance Guidelines](#12-performance-guidelines)
13. [Approval](#13-approval)

---

## 1. Introduction

### 1.1 Purpose

This document establishes coding standards and best practices for VacaFlow_03 to ensure consistent, maintainable, and secure code across the entire codebase. These standards reflect the architectural decisions captured in the Software Architecture Document (SAD-001) and the quality goals defined in the Non-Functional Requirements Specification (NFR-001).

The primary quality goals that drive these standards are:

- **Correctness** — Code must implement the intended business rules without ambiguity or silent failures.
- **Clarity** — Code must be readable and self-documenting. A reviewer unfamiliar with the codebase should be able to follow the intent of any file without needing to cross-reference multiple other files.
- **Reliability** — Workflows must execute in a deterministic and predictable manner. Invalid state transitions and unauthorized operations must produce clear, explicit error responses.

### 1.2 Scope

These standards apply to all code written for VacaFlow_03:

- `VacaFlow.Domain` — Domain entities, state machine, guards, domain exceptions
- `VacaFlow.Application` — Use case services, interface declarations
- `VacaFlow.Infrastructure` — EF Core repositories, transaction service, user context implementation
- `VacaFlow.Api` — ASP.NET Core Minimal API endpoints, middleware, DI configuration
- `vacaflow-web` — Next.js 14 frontend, React components, API client

These standards apply to production code, test code, and configuration files.

### 1.3 Guiding Principles

| Principle | Description |
|-----------|-------------|
| **Correctness first** | A simple, correct solution is always preferred over a clever, potentially incorrect one. |
| **Clarity over brevity** | Explicit code that communicates intent is preferred over concise code that requires decoding. |
| **Consistency** | Follow established patterns within the layer and the project. Do not introduce new patterns without team discussion. |
| **Security by default** | Security checks — authorization, input validation, identity enforcement — are implemented at the architectural boundary, not as optional additions. |
| **Minimal complexity** | Avoid introducing patterns, frameworks, or abstractions that are not required. MediatR, CQRS, generic repositories, unit-of-work wrappers, and messaging frameworks are prohibited for this project. |

---

## 2. General Guidelines

### 2.1 Code Organization

#### File Structure

| Rule | Detail |
|------|--------|
| One class or interface per file | Each `.cs` file contains exactly one public type. Each `.tsx` / `.ts` file contains one primary export. |
| Logical grouping in directories | Group files by domain concept or layer responsibility, not by type (e.g., group all request-related files together rather than all controllers together). |
| Index files for frontend exports | Use `index.ts` barrel files to expose public APIs from feature directories in the frontend. |

#### File Length Guidelines

| Metric | Target | Hard Maximum |
|--------|--------|--------------|
| Lines per file | < 250 | 400 |
| Public methods per class | < 8 | 12 |
| Lines per method | < 30 | 50 |
| Parameters per method | ≤ 4 | 5 |

When a file approaches its maximum, treat this as a signal to extract responsibilities rather than to increase the limit.

### 2.2 Naming Conventions

#### C# Naming

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `AbsenceRequest`, `ApprovalService` |
| Interfaces | PascalCase with `I` prefix | `IRequestRepository`, `ICurrentUserContext` |
| Methods | PascalCase | `ApproveAsync`, `FindByIdAsync` |
| Properties | PascalCase | `RequestorId`, `SubmittedAt` |
| Private fields | `_camelCase` | `_requestRepository`, `_currentUser` |
| Local variables | camelCase | `existingRequest`, `approvalRecord` |
| Constants | PascalCase | `DefaultSlidingExpirationMinutes` |
| Async methods | Suffix with `Async` | `ApproveAsync`, `GetByIdAsync` |
| Domain exceptions | Suffix with `Exception` | `DomainException`, `SelfApprovalException` |
| DTOs / Records | Suffix with `Request` or `Response` | `CreateRequestDto`, `RequestResponse` |
| Enums | PascalCase | `UserRole`, `RequestStatus` |
| Enum values | PascalCase | `Employee`, `Manager`, `Draft`, `Approved` |

#### TypeScript / React Naming

| Element | Convention | Example |
|---------|------------|---------|
| Files (components) | PascalCase | `RequestCard.tsx`, `ApprovalQueue.tsx` |
| Files (utilities, hooks) | camelCase | `useCurrentUser.ts`, `apiClient.ts` |
| React components | PascalCase | `RequestCard`, `LoginForm` |
| Hooks | camelCase with `use` prefix | `useCurrentUser`, `useRequestList` |
| Functions | camelCase | `fetchRequests`, `submitRequest` |
| Variables | camelCase | `currentUser`, `requestList` |
| Constants (module-level) | UPPER_SNAKE_CASE | `API_BASE_URL`, `SESSION_COOKIE_NAME` |
| Interfaces / Types | PascalCase | `AbsenceRequest`, `CurrentUser` |
| Enums | PascalCase | `RequestStatus` |

### 2.3 Comments and Documentation

#### When to Comment

| Situation | Action |
|-----------|--------|
| Complex business rule or domain invariant | Required comment explaining the rule and referencing the relevant requirement |
| Non-obvious architectural decision | Comment citing the relevant ADR from SAD-001 |
| Temporary workaround | `// TODO: [description] — [ticket or phase reference]` — never merged without a ticket |
| Public interface method | XML doc comment (C#) or JSDoc (TypeScript) |

#### C# XML Documentation

```csharp
/// <summary>
/// Approves a submitted absence request on behalf of the authenticated manager.
/// The caller identity is read exclusively from <see cref="ICurrentUserContext"/>
/// and is never accepted from the request body. See ADR-001.
/// </summary>
/// <param name="requestId">The unique identifier of the request to approve.</param>
/// <exception cref="DomainException">
/// Thrown when the request is not in a submittable state or when the approver
/// is the same person as the requestor (SelfApprovalGuard).
/// </exception>
/// <exception cref="UnauthorizedAccessException">
/// Thrown when the current user does not have the Manager role.
/// </exception>
Task ApproveAsync(Guid requestId);
```

#### What NOT to Comment

- Code that is already self-documenting through clear naming
- Restating what the code does line by line
- Version history — use Git commit messages instead
- Commented-out code — delete it; Git history preserves it

---

## 3. C# Standards (Backend)

### 3.1 Language Version and Style

All C# code in VacaFlow_03 targets **C# 12 on .NET 8**. The following style rules apply across all backend projects.

#### Implicit Usings and Nullable

Enable implicit usings and nullable reference types in all project files:

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <LangVersion>12</LangVersion>
  <TreatWarningsAsErrors>false</TreatWarningsAsErrors>
</PropertyGroup>
```

Nullable reference types are enabled. All nullable warnings must be resolved explicitly — either by adding null checks, using the null-forgiving operator with a justification comment, or adjusting the type to express optional intent correctly.

#### Async / Await

```csharp
// ✓ Correct — explicit async/await with error context
public async Task<AbsenceRequest> GetByIdAsync(Guid id)
{
    var request = await _dbContext.AbsenceRequests
        .FirstOrDefaultAsync(r => r.Id == id);

    if (request is null)
        throw new NotFoundException($"Absence request '{id}' was not found.");

    return request;
}

// ✗ Incorrect — returning task without await loses stack trace on exception
public Task<AbsenceRequest> GetByIdAsync(Guid id)
{
    return _dbContext.AbsenceRequests.FirstOrDefaultAsync(r => r.Id == id)!;
}
```

Always `await` tasks rather than returning them directly unless the method is a simple, single-expression pass-through with no `try/catch` or `using` block.

#### Null Handling

```csharp
// ✓ Correct — null-coalescing for defaults
var displayName = employee?.FullName ?? "Unknown Employee";

// ✓ Correct — throw for required values, never silently return null
var request = await _requestRepository.GetByIdAsync(id)
    ?? throw new NotFoundException($"Request '{id}' not found.");

// ✗ Incorrect — silent null propagation that causes NullReferenceException downstream
var status = request?.Status;
ProcessStatus(status); // status may be null here
```

#### Pattern Matching

Use pattern matching for type checks and null guards:

```csharp
// ✓ Correct
if (exception is DomainException domainEx)
{
    return Results.BadRequest(new ErrorResponse(domainEx.Code, domainEx.Message));
}

// ✓ Correct — switch expression for exhaustive enum handling
var httpStatus = request.Status switch
{
    RequestStatus.Draft      => StatusCodes.Status200OK,
    RequestStatus.Submitted  => StatusCodes.Status200OK,
    RequestStatus.Approved   => StatusCodes.Status200OK,
    RequestStatus.Rejected   => StatusCodes.Status200OK,
    RequestStatus.Cancelled  => StatusCodes.Status200OK,
    _ => throw new InvalidOperationException($"Unhandled status: {request.Status}")
};
```

#### Records for DTOs

Use C# records for immutable data transfer objects:

```csharp
// ✓ Correct — positional record for simple DTOs
public record CreateAbsenceRequestDto(
    Guid AbsenceTypeId,
    DateOnly StartDate,
    DateOnly EndDate,
    string? Notes);

// ✓ Correct — record with validation annotations for API input
public record LoginRequestDto(
    [property: Required] string Email,
    [property: Required] string Password);
```

### 3.2 Class Design

#### Single Responsibility

Each class must have one reason to change. Use the layer structure defined in SAD-001 to guide responsibility allocation:

| Layer | Responsibility | Prohibited Responsibilities |
|-------|---------------|------------------------------|
| Domain | Business rules, invariants, state machine | Database access, HTTP handling, DI registration |
| Application | Use case orchestration | EF Core queries, HTTP context reading, response formatting |
| Infrastructure | Persistence, external integrations | Business rule enforcement, HTTP routing |
| API | Routing, middleware, DI wiring | Business logic, direct database access |

#### Constructor Injection

All dependencies must be injected via the constructor. Field injection and property injection are prohibited.

```csharp
// ✓ Correct
public sealed class ApprovalService : IApprovalService
{
    private readonly IRequestRepository _requestRepository;
    private readonly IApprovalRepository _approvalRepository;
    private readonly ICurrentUserContext _currentUser;
    private readonly ITransactionService _transactionService;

    public ApprovalService(
        IRequestRepository requestRepository,
        IApprovalRepository approvalRepository,
        ICurrentUserContext currentUser,
        ITransactionService transactionService)
    {
        _requestRepository    = requestRepository;
        _approvalRepository   = approvalRepository;
        _currentUser          = currentUser;
        _transactionService   = transactionService;
    }
}
```

#### sealed Classes

Mark use case service implementations and infrastructure implementations as `sealed` unless explicit inheritance is planned. This prevents accidental subclassing and signals that the class is a concrete leaf implementation.

### 3.3 Domain Layer Specifics

#### State Machine Transitions

All state transitions on `AbsenceRequest` must go through `RequestStateMachine`. Direct property assignment to `Status` from outside the Domain layer is prohibited.

```csharp
// ✓ Correct — transition through aggregate method
request.Submit();   // internally calls RequestStateMachine.Transition(current, Draft → Submitted)
request.Approve(approverId); // internally calls SelfApprovalGuard and state machine

// ✗ Incorrect — bypasses state machine and self-approval guard
request.Status = RequestStatus.Approved;
```

#### Domain Exceptions

Domain invariant violations must throw `DomainException` (or a specific subtype) before any persistence attempt. Never rely on database constraints as the first line of defense for domain rules.

```csharp
// ✓ Correct — guard before persistence
public void Approve(Guid approverId)
{
    SelfApprovalGuard.Check(RequestorId, approverId); // throws DomainException if same
    RequestStateMachine.TransitionTo(this, RequestStatus.Approved); // throws if invalid transition
    ApprovedById = approverId;
    ApprovedAt   = DateTime.UtcNow;
}
```

#### Password Hashing

Passwords are hashed using `BCrypt.Net-Next` within the `Employee` entity factory method. Plaintext passwords must never appear in any field, variable, log, or exception message outside of the moment of hashing.

```csharp
// ✓ Correct — hashing occurs at entity creation, plaintext discarded immediately
public static Employee Create(string email, string plainTextPassword, UserRole role)
{
    var hashed = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);
    return new Employee { Email = email, PasswordHash = hashed, Role = role };
}

// ✗ Incorrect — storing or logging plaintext
_logger.LogInformation("Creating user with password {Password}", plainTextPassword);
```

### 3.4 Application Layer Specifics

#### Zero Framework Dependencies

`VacaFlow.Application.csproj` must contain no `PackageReference` entries for `Microsoft.AspNetCore.*` or `Microsoft.EntityFrameworkCore.*`. This rule is enforced by inspection and by a guard comment in the project file.

All interfaces declared in the Application layer must use only `System.*` types in their signatures. If an interface requires a type from `Microsoft.*`, it belongs in Infrastructure.

```csharp
// ✓ Correct — pure C# interface in Application layer
public interface ICurrentUserContext
{
    Guid CurrentUserId { get; }
    UserRole CurrentUserRole { get; }
}

// ✗ Incorrect — leaking ASP.NET Core type into Application layer
public interface ICurrentUserContext
{
    ClaimsPrincipal User { get; }  // System.Security.Claims is acceptable; IHttpContextAccessor is not
}
```

#### Ownership Enforcement

`RequestService` must verify that the authenticated user owns the request before permitting any mutation (edit, submit, cancel). Ownership is read from `ICurrentUserContext.CurrentUserId` — never from a user-supplied identifier in the request body or URL parameter without server-side validation.

```csharp
// ✓ Correct — ownership enforced using server-side identity
public async Task SubmitAsync(Guid requestId)
{
    var callerId = _currentUser.CurrentUserId;
    var request  = await _requestRepository.GetByIdAsync(requestId);

    if (request.RequestorId != callerId)
        throw new UnauthorizedAccessException("You are not the owner of this request.");

    request.Submit();
    await _requestRepository.UpdateAsync(request);
}
```

### 3.5 Infrastructure Layer Specifics

#### EF Core Queries

- Use `AsNoTracking()` for all read-only queries that are not intended to be updated within the same request scope.
- Always filter by the authenticated user's identity for employee-scoped queries; never return all records and filter in application memory.
- Use `AnyAsync` for existence checks instead of `FirstOrDefaultAsync` followed by a null check when the entity itself is not needed.

```csharp
// ✓ Correct — server-side filter, no-tracking for reads
public async Task<IReadOnlyList<AbsenceRequest>> ListByEmployeeAsync(Guid employeeId)
{
    return await _dbContext.AbsenceRequests
        .AsNoTracking()
        .Where(r => r.RequestorId == employeeId)
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync();
}

// ✗ Incorrect — loading all records, filtering in memory
public async Task<IReadOnlyList<AbsenceRequest>> ListByEmployeeAsync(Guid employeeId)
{
    var all = await _dbContext.AbsenceRequests.ToListAsync();
    return all.Where(r => r.RequestorId == employeeId).ToList();
}
```

#### Transaction Service

`EfCoreTransactionService` must check whether an active transaction already exists before calling `BeginTransactionAsync`. If a transaction is already open, throw a descriptive `InvalidOperationException` citing the nested-transaction prohibition for SQLite.

```csharp
public async Task ExecuteInTransactionAsync(Func<Task> operation)
{
    if (_dbContext.Database.CurrentTransaction is not null)
        throw new InvalidOperationException(
            "A transaction is already active on this DbContext. " +
            "Nested transactions are not supported by the SQLite provider. " +
            "See ADR-003 in SAD-001.");

    await using var transaction = await _dbContext.Database.BeginTransactionAsync();
    try
    {
        await operation();
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

### 3.6 API Layer Specifics

#### Minimal API Endpoint Organization

Endpoints are organized into named endpoint groups, one group per domain area. Inline lambda bodies are acceptable for simple delegation; complex logic must be extracted to a named method or moved to a use case service.

```csharp
// ✓ Correct — thin endpoint delegating to use case service
app.MapPost("/requests/{id}/approve", async (
    Guid id,
    IApprovalService approvalService) =>
{
    await approvalService.ApproveAsync(id);
    return Results.NoContent();
})
.RequireAuthorization("ManagerOnly");
```

#### Authorization Policy Placement

Authorization attributes and policies are applied at the endpoint mapping level in the API layer, not inside use case services. Use case services perform secondary authorization checks (ownership, self-approval) using `ICurrentUserContext`.

---

## 4. TypeScript and React Standards (Frontend)

### 4.1 Language Version and Compiler Settings

All frontend code targets **TypeScript 5** with strict mode enabled.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "bundler",
    "jsx": "preserve"
  }
}
```

No `// @ts-ignore` or `// @ts-nocheck` comments are permitted. All type errors must be resolved explicitly.

### 4.2 Type Safety

```typescript
// ✓ Correct — explicit return types on API functions
async function fetchRequests(): Promise<AbsenceRequest[]> {
  const res = await fetch('/api/requests', { credentials: 'include' });
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json() as Promise<AbsenceRequest[]>;
}

// ✗ Incorrect — implicit any through untyped fetch response
async function fetchRequests() {
  const res = await fetch('/api/requests', { credentials: 'include' });
  return res.json(); // returns Promise<any>
}
```

Never use `any` as a type annotation. When the shape of an external value is genuinely unknown, use `unknown` and narrow it explicitly.

### 4.3 Component Structure

All React components in VacaFlow_03 are functional components using hooks. Class components are prohibited.

```tsx
// ✓ Correct — typed props interface, explicit return type
interface RequestCardProps {
  request: AbsenceRequest;
  currentUser: CurrentUser;
  onApprove?: (id: string) => Promise<void>;
  onReject?:  (id: string) => Promise<void>;
}

export function RequestCard({ request, currentUser, onApprove, onReject }: RequestCardProps) {
  const canApprove =
    currentUser.role === 'Manager' &&
    request.status === 'Submitted' &&
    request.requestorId !== currentUser.id;

  return (
    <article className="request-card">
      <h3>{request.absenceTypeName}</h3>
      <p>{request.startDate} — {request.endDate}</p>
      <RequestStatusBadge status={request.status} />
      {canApprove && onApprove && (
        <button onClick={() => onApprove(request.id)}>Approve</button>
      )}
      {canApprove && onReject && (
        <button onClick={() => onReject(request.id)}>Reject</button>
      )}
    </article>
  );
}
```

### 4.4 State Management

- Use React's built-in state primitives (`useState`, `useReducer`, `useContext`) for all state. Do not introduce external state management libraries (Redux, Zustand, Jotai) for the MVP.
- Server state (API data) is fetched and cached using `useState` + `useEffect` with a custom hook pattern. Do not mix fetching logic directly into component bodies.
- The current user context (`CurrentUser`) is loaded once on application mount via `GET /api/me` and made available through a `useCurrentUser` hook backed by React Context.

### 4.5 API Client Rules

- All API requests must include `credentials: 'include'` to send the session cookie.
- The authenticated user's ID and role are read from the server response (`/api/me`). They must never be read from `localStorage`, `sessionStorage`, or a client-side cookie value, and must never be sent as trusted values in a request body.
- 401 responses must redirect the user to the login page. 403 responses must display an "Access denied" message and not reveal sensitive information.

```typescript
// ✓ Correct — identity enforced server-side, frontend reads /me for display only
const { data: currentUser } = useCurrentUser(); // calls GET /api/me

// ✗ Incorrect — reading identity from localStorage and sending it as a trusted value
const userId = localStorage.getItem('userId');
await fetch(`/api/requests/${id}/approve`, {
  method: 'POST',
  body: JSON.stringify({ approverId: userId }), // server must never trust this
});
```

### 4.6 State-Driven Action Rendering

Action buttons (Submit, Cancel, Approve, Reject) are rendered conditionally based on the request status and the authenticated user's role as returned by `/api/me`. The visibility logic must mirror the server-side authorization rules to provide a coherent UI, but the server is always the authoritative enforcement point.

| Action | Visible When | Permitted Role |
|--------|-------------|----------------|
| Submit | `status === 'Draft'` and user owns request | Employee |
| Cancel | `status === 'Draft' or 'Submitted'` and user owns request | Employee |
| Approve | `status === 'Submitted'` and `requestorId !== currentUser.id` | Manager |
| Reject | `status === 'Submitted'` and `requestorId !== currentUser.id` | Manager |

### 4.7 Hooks Rules

- Call hooks only at the top level of a React function — never inside loops, conditionals, or nested functions.
- All custom hooks are prefixed with `use` and placed in the `hooks/` directory.
- Hooks that fetch data return a consistent shape: `{ data, loading, error }`.

```typescript
// ✓ Correct — consistent hook shape
export function useRequestList(): { data: AbsenceRequest[]; loading: boolean; error: string | null } {
  const [data, setData]       = useState<AbsenceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetchRequests()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

---

## 5. Onion Architecture Compliance Rules

These rules are binding for all contributors. Any pull request that violates them must be rejected in code review regardless of other quality attributes.

### 5.1 Dependency Direction

Dependencies must flow strictly inward:

```
vacaflow-web → VacaFlow.Api → VacaFlow.Application → VacaFlow.Domain
                              ↑
                  VacaFlow.Infrastructure (implements Application interfaces)
```

| Allowed Dependency | Prohibited Dependency |
|-------------------|-----------------------|
| Application → Domain | Application → Infrastructure |
| Infrastructure → Application (implements interfaces) | Application → ASP.NET Core / EF Core |
| Infrastructure → Domain | Domain → any outer layer |
| Api → Application, Infrastructure, Domain | Infrastructure → Api |

### 5.2 Package Reference Rules

| Project | Allowed PackageReference | Prohibited |
|---------|--------------------------|------------|
| `VacaFlow.Domain` | `BCrypt.Net-Next` | `Microsoft.AspNetCore.*`, `Microsoft.EntityFrameworkCore.*` |
| `VacaFlow.Application` | None | All `Microsoft.*` packages beyond `System.*` framework libraries |
| `VacaFlow.Infrastructure` | `Microsoft.EntityFrameworkCore.Sqlite`, `Microsoft.AspNetCore.Http.Abstractions` | None specifically — but verify each new package does not break domain purity |
| `VacaFlow.Api` | `Microsoft.AspNetCore.App` framework reference | Direct EF Core queries or domain logic |

### 5.3 Verifiable Boundary Check

Before any pull request targeting the Application layer is merged, run:

```bash
grep -r "using Microsoft" VacaFlow.Application/
```

This command must return zero results. If any output is produced, the PR must be revised before merging.

### 5.4 Prohibited Patterns

The following patterns are explicitly prohibited in VacaFlow_03 regardless of convenience or perceived benefit:

| Prohibited Pattern | Reason |
|--------------------|--------|
| MediatR / command-query dispatching | Adds indirection without benefit at this scale; violates simplicity principle |
| CQRS separation | Not required for two-role MVP workflow |
| Generic repository (`IRepository<T>`) | Creates unnecessary abstraction; use specific repository interfaces |
| Unit of Work pattern (`IUnitOfWork`) | `ITransactionService` covers the explicit boundary needed; UoW adds complexity |
| Any messaging framework (RabbitMQ, Azure Service Bus, etc.) | Not applicable to MVP scope |
| Service Locator pattern | Breaks DI transparency |
| Static service access | Makes testing and reasoning about dependencies impossible |

---

## 6. Security Standards

### 6.1 Identity Enforcement

The authenticated user's identity is derived exclusively from the server-validated session cookie claim via `ICurrentUserContext`. This is the single source of truth for all authorization decisions.

**Rules:**

- The API must never read an employee ID, approver ID, or role from the HTTP request body for any security-sensitive decision.
- `ICurrentUserContext.CurrentUserId` is the only source of the caller's identity in `ApprovalService`, `RequestService`, and `AuthService`.
- If `HttpContextCurrentUserContext` cannot find the expected claim (because the cookie is absent or invalid), it must throw `UnauthorizedAccessException` immediately — never return `Guid.Empty` or a default value.

```csharp
// ✓ Correct — identity read from server-validated claim
public Guid CurrentUserId =>
    _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) is string raw
    && Guid.TryParse(raw, out var id)
        ? id
        : throw new UnauthorizedAccessException("Authenticated user identity claim is absent or invalid.");

// ✗ Incorrect — accepting caller-supplied identity
app.MapPost("/requests/{id}/approve", async (Guid id, Guid approverId, ...) =>
{
    await approvalService.ApproveAsync(id, approverId); // approverId from request is untrusted
});
```

### 6.2 Authorization Boundaries

Authorization is enforced at two independent layers for defense in depth:

| Layer | Mechanism | Responsibility |
|-------|-----------|----------------|
| API (VacaFlow.Api) | `.RequireAuthorization("ManagerOnly")` on endpoint | Rejects non-Manager callers before the handler executes |
| Domain (VacaFlow.Domain) | `SelfApprovalGuard.Check(requestorId, approverId)` | Rejects self-approval at the invariant level before persistence |

Never remove either layer of enforcement on the grounds that the other layer is sufficient.

### 6.3 Password Handling

| Rule | Detail |
|------|--------|
| Algorithm | BCrypt via `BCrypt.Net-Next` 4.x. Work factor default (10 or higher). |
| Storage | Only the BCrypt hash is persisted in `Employee.PasswordHash`. |
| Plaintext lifetime | Plaintext password exists only for the duration of the `Create` factory call. |
| Logging prohibition | Plaintext passwords must never appear in logs, exception messages, or traces. |
| Comparison | Use `BCrypt.Net.BCrypt.Verify(plaintext, hash)` — never compare hashes directly or use `string.Equals`. |

### 6.4 Input Validation

All API input is validated at the endpoint boundary before reaching the Application layer. Use Data Annotations or minimal inline validation on request DTOs. Domain-level validation (state machine, self-approval) is performed in the Domain layer and does not replace endpoint-level input validation.

```csharp
// ✓ Correct — validate date range at API boundary before invoking use case
app.MapPost("/requests", async (CreateAbsenceRequestDto dto, IRequestService requestService) =>
{
    if (dto.EndDate < dto.StartDate)
        return Results.BadRequest(new ErrorResponse("INVALID_DATE_RANGE",
            "End date must be on or after start date."));

    var created = await requestService.CreateAsync(dto);
    return Results.Created($"/requests/{created.Id}", created);
});
```

### 6.5 SQL Injection Prevention

All database access goes through EF Core parameterized LINQ queries. Raw SQL strings are prohibited unless there is a documented justification and the query uses `FromSqlRaw` with explicit parameters — never string interpolation.

```csharp
// ✓ Correct — EF Core parameterized query
var employee = await _dbContext.Employees
    .FirstOrDefaultAsync(e => e.Email == email);

// ✗ Incorrect — raw string interpolation
var employee = await _dbContext.Employees
    .FromSqlRaw($"SELECT * FROM Employees WHERE Email = '{email}'")
    .FirstOrDefaultAsync();
```

### 6.6 Security Checklist (Pre-Merge)

- [ ] No plaintext passwords in any log, variable, or exception message
- [ ] Authenticated user identity read from `ICurrentUserContext` only — never from request body
- [ ] Role authorization applied at the endpoint level for all Manager-only operations
- [ ] `SelfApprovalGuard` invoked before any approval persistence
- [ ] All API inputs validated before reaching Application layer services
- [ ] All EF Core queries use LINQ parameterization — no raw string interpolation
- [ ] No hardcoded credentials, API keys, or secrets in any source file
- [ ] `vacaflow.db` listed in `.gitignore`

---

## 7. Testing Standards

### 7.1 Scope for MVP

Full test automation is not required for the VacaFlow_03 MVP. A focused set of unit tests covering the two most critical correctness domains is expected:

| Test Domain | Coverage Target |
|-------------|-----------------|
| Date validation rules (start/end date range, overlap detection) | All acceptance rules from FS-001 |
| Request state machine transitions | All valid and invalid transitions defined in the domain |
| Self-approval guard | Both the rejection case and the pass-through case |

Integration tests and end-to-end tests are deferred to post-MVP phases.

### 7.2 Test Project Structure

```
VacaFlow.Tests/
├── Domain/
│   ├── RequestStateMachineTests.cs
│   ├── SelfApprovalGuardTests.cs
│   └── AbsenceRequestDateValidationTests.cs
├── Application/
│   ├── ApprovalServiceTests.cs
│   └── RequestServiceTests.cs
└── Fakes/
    ├── FakeCurrentUserContext.cs
    ├── FakeTransactionService.cs
    ├── FakeRequestRepository.cs
    └── FakeApprovalRepository.cs
```

### 7.3 Test Naming Convention

Use the pattern: `MethodUnderTest_ExpectedBehavior_WhenCondition`

```csharp
// ✓ Correct
[Fact]
public void Submit_ThrowsDomainException_WhenRequestIsAlreadySubmitted() { }

[Fact]
public void Approve_ThrowsDomainException_WhenApproverIsRequestor() { }

[Fact]
public void CreateAbsenceRequest_ThrowsValidationError_WhenEndDateBeforeStartDate() { }

[Fact]
public void TransitionTo_Succeeds_WhenTransitionIsValid() { }
```

### 7.4 Test Structure (AAA Pattern)

All test methods follow the Arrange–Act–Assert pattern with explicit section labels:

```csharp
[Fact]
public async Task ApproveAsync_ThrowsDomainException_WhenApproverIsRequestor()
{
    // Arrange
    var requestorId = Guid.NewGuid();
    var request = AbsenceRequest.CreateDraft(requestorId, someAbsenceTypeId, startDate, endDate);
    request.Submit();

    var fakeCurrentUser = new FakeCurrentUserContext(userId: requestorId, role: UserRole.Manager);
    var fakeRepo        = new FakeRequestRepository(request);
    var service         = new ApprovalService(fakeRepo, new FakeApprovalRepository(),
                                              fakeCurrentUser, new FakeTransactionService());

    // Act
    var act = async () => await service.ApproveAsync(request.Id);

    // Assert
    await act.Should().ThrowAsync<DomainException>()
        .WithMessage("*self-approval*");
}
```

### 7.5 Fake Implementation Pattern

Application layer services are tested using hand-written fakes — not Moq or NSubstitute mocks for the MVP. Fakes live in the `Fakes/` directory and implement the Application interfaces directly.

```csharp
// ✓ Correct — simple, readable fake
public sealed class FakeCurrentUserContext : ICurrentUserContext
{
    public FakeCurrentUserContext(Guid userId, UserRole role)
    {
        CurrentUserId   = userId;
        CurrentUserRole = role;
    }

    public Guid CurrentUserId { get; }
    public UserRole CurrentUserRole { get; }
}

public sealed class FakeTransactionService : ITransactionService
{
    public async Task ExecuteInTransactionAsync(Func<Task> operation)
        => await operation(); // pass-through; no real transaction needed in unit tests
}
```

---

## 8. Code Quality Metrics

### 8.1 Quality Targets

| Metric | Target | Acceptable Minimum |
|--------|--------|--------------------|
| Unit test coverage (Domain + Application) | > 70% | 50% for MVP |
| Cyclomatic complexity per method | ≤ 8 | 12 |
| Cognitive complexity per method | ≤ 12 | 20 |
| Code duplication | < 5% | 8% |
| Methods exceeding 50 lines | 0 | 0 |

### 8.2 C# Linting (EditorConfig)

A `.editorconfig` file at the solution root enforces consistent formatting across all IDEs:

```ini
root = true

[*.cs]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

# Braces always required
csharp_prefer_braces = true:warning

# Prefer 'var' when type is apparent
csharp_style_var_when_type_is_apparent = true:suggestion

# Prefer expression bodies for simple members
csharp_style_expression_bodied_properties = true:suggestion
csharp_style_expression_bodied_accessors = true:suggestion

# Require accessibility modifiers
dotnet_style_require_accessibility_modifiers = always:warning

# Prefer using directives inside namespace
csharp_using_directive_placement = outside_namespace:warning
```

### 8.3 TypeScript / ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict-type-checked",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["error"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 8.4 Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

---

## 9. Code Review Standards

### 9.1 Review Process

Given the two-person team, the following lightweight process applies:

| Step | Action |
|------|--------|
| 1. Self-review | Author reads the diff as if seeing it for the first time before opening a PR. |
| 2. Automated checks | CI pipeline (if configured) must pass linting and tests. If CI is not yet configured, the author runs lint and tests locally and confirms in the PR description. |
| 3. Peer review | The other team member reviews and must approve before merge. |
| 4. Merge | Author merges after approval. No force-push to `main`. |

### 9.2 Review Checklist

#### Architecture Compliance
- [ ] No framework types leaked into the Application or Domain layers
- [ ] `grep -r "using Microsoft" VacaFlow.Application/` returns zero results
- [ ] No prohibited patterns introduced (MediatR, CQRS, generic repository, UoW)
- [ ] Dependency direction is strictly inward

#### Security
- [ ] User identity read from `ICurrentUserContext` — not from request body
- [ ] Manager-only endpoints have `.RequireAuthorization("ManagerOnly")`
- [ ] `SelfApprovalGuard` invoked in approval path
- [ ] No plaintext passwords in logs or exceptions
- [ ] All EF Core queries use LINQ parameterization

#### Correctness
- [ ] State transitions go through `RequestStateMachine`
- [ ] Domain exceptions thrown before persistence for invariant violations
- [ ] Ownership verified before any mutation
- [ ] Invalid state transitions return clear error responses (not 500)

#### Code Quality
- [ ] Naming follows conventions in Section 2.2
- [ ] No method exceeds 50 lines
- [ ] No obvious code duplication
- [ ] No `any` type in TypeScript
- [ ] All nullable warnings resolved

#### Testing
- [ ] New domain rules covered by unit tests
- [ ] Fakes used for Application layer unit tests — no `DbContext` or `HttpContext` in unit tests

#### Documentation
- [ ] Complex business rules commented with rule reference
- [ ] New ADR created if an architectural decision was made

### 9.3 Review Comment Standards

Comments must be constructive, specific, and actionable:

```
// ✓ Good — explains the problem and suggests a resolution
"This query loads all requests into memory before filtering by requestorId.
Add a .Where(r => r.RequestorId == employeeId) clause to the EF Core query
so the filter executes in the database. See Section 3.5 of the Code Standards."

// ✓ Good — references the standard
"Per Section 5.3, Application layer must not reference Microsoft.AspNetCore types.
IHttpContextAccessor should be moved to the Infrastructure layer."

// ✗ Bad — vague and non-actionable
"This is wrong."

// ✗ Bad — personal preference without justification
"I don't like this."
```

Use the following prefixes to signal intent:

| Prefix | Meaning |
|--------|---------|
| `[REQUIRED]` | Must be fixed before merge |
| `[SUGGESTION]` | Optional improvement worth considering |
| `[QUESTION]` | Asking for clarification — not necessarily a required change |
| `[NITPICK]` | Minor style issue — author's discretion |

---

## 10. Git Standards

### 10.1 Commit Message Format

```
<type>(<scope>): <subject>

<body — optional>

<footer — optional>
```

**Types:**

| Type | Usage |
|------|-------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, no logic change |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build scripts, dependencies, configuration |

**Subject line rules:**
- Maximum 72 characters
- Imperative mood: "add approval endpoint" not "added approval endpoint"
- No trailing period
- Lowercase after the type prefix

**Examples:**

```
feat(approval): add self-approval guard to ApprovalService

Calls SelfApprovalGuard.Check before state machine transition.
Throws DomainException with code SELF_APPROVAL_PROHIBITED when
requestorId matches approverId. Closes #12.

---

fix(auth): throw UnauthorizedAccessException when identity claim is absent

HttpContextCurrentUserContext previously returned Guid.Empty when the
NameIdentifier claim was missing. Now throws explicitly to prevent
silent authorization bypass.

---

test(domain): add state machine transition coverage for all valid paths
```

### 10.2 Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<short-description>` | `feature/approval-endpoint` |
| Bug fix | `bugfix/<short-description>` | `bugfix/self-approval-guard-null` |
| Documentation | `docs/<short-description>` | `docs/update-code-standards` |
| Chore | `chore/<short-description>` | `chore/add-editorconfig` |

### 10.3 Pull Request Template

```markdown
## Summary
[One or two sentences describing what this PR changes and why.]

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Chore / configuration

## Architecture Compliance
- [ ] No Microsoft.* types added to VacaFlow.Application
- [ ] Dependency direction is inward only
- [ ] No prohibited patterns introduced

## Security
- [ ] Identity read from ICurrentUserContext only
- [ ] Authorization applied at endpoint level
- [ ] No plaintext password in logs or variables

## Testing
- [ ] Relevant unit tests added or updated
- [ ] Tests pass locally

## How to Test
[Steps to manually verify the change, if applicable.]
```

### 10.4 Branch Protection Rules (main)

- No direct commits to `main`
- At least one peer approval required before merge
- No force-push to `main`
- Delete branch after merge

---

## 11. Error Handling Standards

### 11.1 Exception Hierarchy

```csharp
// Base domain exception — all domain invariant violations use this or a subtype
public class DomainException : Exception
{
    public string Code { get; }

    public DomainException(string code, string message) : base(message)
    {
        Code = code;
    }
}

// State machine violation
public sealed class InvalidStateTransitionException : DomainException
{
    public InvalidStateTransitionException(RequestStatus current, RequestStatus attempted)
        : base("INVALID_STATE_TRANSITION",
               $"Cannot transition from '{current}' to '{attempted}'.") { }
}

// Self-approval violation
public sealed class SelfApprovalException : DomainException
{
    public SelfApprovalException()
        : base("SELF_APPROVAL_PROHIBITED",
               "A manager cannot approve or reject their own absence request.") { }
}
```

### 11.2 ExceptionHandlingMiddleware

The `ExceptionHandlingMiddleware` in the API layer is the single point of exception-to-HTTP translation. It must handle:

| Exception Type | HTTP Status | Response Body |
|----------------|-------------|---------------|
| `DomainException` (and subtypes) | 422 Unprocessable Entity | `{ code, message }` |
| `NotFoundException` | 404 Not Found | `{ code: "NOT_FOUND", message }` |
| `UnauthorizedAccessException` | 401 Unauthorized | `{ code: "UNAUTHORIZED", message: "Authentication required." }` |
| `InvalidOperationException` (nested transaction guard) | 500 Internal Server Error | Generic message — log full details server-side |
| All others | 500 Internal Server Error | `{ code: "INTERNAL_ERROR", message: "An unexpected error occurred." }` |

Error responses must never include stack traces, internal class names, or database error details.

```csharp
// ✓ Correct — structured error response without leaking internals
app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (DomainException ex)
    {
        context.Response.StatusCode  = StatusCodes.Status422UnprocessableEntity;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { code = ex.Code, message = ex.Message });
    }
    catch (NotFoundException ex)
    {
        context.Response.StatusCode  = StatusCodes.Status404NotFound;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { code = "NOT_FOUND", message = ex.Message });
    }
    catch (UnauthorizedAccessException)
    {
        context.Response.StatusCode  = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { code = "UNAUTHORIZED",
            message = "Authentication required." });
    }
    catch (Exception ex)
    {
        // Log full exception server-side; return generic message to client
        logger.LogError(ex, "Unhandled exception processing {Method} {Path}",
            context.Request.Method, context.Request.Path);
        context.Response.StatusCode  = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { code = "INTERNAL_ERROR",
            message = "An unexpected error occurred." });
    }
});
```

### 11.3 Error Response Shape

All API error responses use the following JSON shape:

```json
{
  "code": "INVALID_STATE_TRANSITION",
  "message": "Cannot transition from 'Draft' to 'Approved'."
}
```

Frontend components must read `code` for programmatic handling and `message` for user-facing display. Error codes are stable identifiers; messages may change.

---

## 12. Performance Guidelines

Given the two-person team and MVP scope, performance optimization is not a primary concern. The following baseline guidelines prevent obvious anti-patterns:

### 12.1 Database

| Rule | Detail |
|------|--------|
| Use `AsNoTracking()` for reads | Any query result that is not updated within the same request scope must use `AsNoTracking()`. |
| No N+1 queries | Use `Include()` or explicit `Join` for related data. Never lazy-load in a loop. |
| Paginate list endpoints | Request list endpoints must accept `page` and `pageSize` parameters and never return unbounded result sets. |
| Filter server-side | All filtering must occur in the EF Core LINQ expression, not in application memory after `ToListAsync()`. |

### 12.2 Frontend

| Rule | Detail |
|------|--------|
| Avoid redundant API calls | Fetch current user once on mount; do not re-fetch on every component render. |
| Minimize payload size | API responses include only fields needed by the frontend. Avoid returning entire entity graphs when a summary is sufficient. |
| No synchronous blocking | All API calls must be `async`/`await`. Never use synchronous XHR or blocking operations on the main thread. |

---

## 13. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Technical Lead | Yeuri Jessel Reyes | | ⏳ Pending |
| Solution Architect | | | ⏳ Pending |
| Team Representative | | | ⏳ Pending |

---
## Document Control

| Field | Value |
|-------|-------|
| Author | Yeuri Jessel Reyes (AI Assisted) |
| Approval Authority | Technical Lead (PM_OVERRIDE — bypassed Technical Lead) |
| Status | Approved |
| Signature | ✅ SIGNED by Yeuri Jessel Reyes (yeuri.reyes@arroyoconsulting.net) on 2026-07-21 21:10:35 UTC |

*— End of document —*
