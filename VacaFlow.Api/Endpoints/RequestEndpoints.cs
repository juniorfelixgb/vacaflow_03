namespace VacaFlow.Api.Endpoints;

using System.Security.Claims;
using VacaFlow.Application.Dtos;
using VacaFlow.Application.Services;

public static class RequestEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/requests")
            .WithTags("Requests")
            .RequireAuthorization();

        group.MapPost("/", Create)
            .WithName("CreateRequest")
            .WithOpenApi();

        group.MapGet("/{id}", GetById)
            .WithName("GetRequest")
            .WithOpenApi();

        group.MapGet("/", GetByEmployeeId)
            .WithName("GetEmployeeRequests")
            .WithOpenApi();

        group.MapPut("/{id}", Update)
            .WithName("UpdateRequest")
            .WithOpenApi();

        group.MapPost("/{id}/submit", Submit)
            .WithName("SubmitRequest")
            .WithOpenApi();

        group.MapPost("/{id}/approve", Approve)
            .WithName("ApproveRequest")
            .WithOpenApi();

        group.MapPost("/{id}/reject", Reject)
            .WithName("RejectRequest")
            .WithOpenApi();

        group.MapPost("/{id}/cancel", Cancel)
            .WithName("CancelRequest")
            .WithOpenApi();

        group.MapGet("/submitted/all", GetSubmitted)
            .WithName("GetSubmittedRequests")
            .WithOpenApi();
    }

    private static async Task<IResult> Create(
        CreateRequestRequest request,
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var employeeId = GetUserId(httpContext);
        var result = await requestService.CreateAsync(employeeId, request, cancellationToken);
        return Results.Created($"/api/requests/{result.Id}", result);
    }

    private static async Task<IResult> GetById(
        string id,
        IRequestService requestService,
        CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var requestId))
            return Results.BadRequest();

        var result = await requestService.GetByIdAsync(requestId, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> GetByEmployeeId(
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var employeeId = GetUserId(httpContext);
        var results = await requestService.GetByEmployeeIdAsync(employeeId, cancellationToken);
        return Results.Ok(results);
    }

    private static async Task<IResult> Update(
        string id,
        UpdateRequestRequest request,
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var requestId))
            return Results.BadRequest();

        var employeeId = GetUserId(httpContext);
        var result = await requestService.UpdateAsync(requestId, employeeId, request, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> Submit(
        string id,
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var requestId))
            return Results.BadRequest();

        var employeeId = GetUserId(httpContext);
        var result = await requestService.SubmitAsync(requestId, employeeId, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> Approve(
        string id,
        ApproveRequestRequest request,
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var requestId))
            return Results.BadRequest();

        var approverId = GetUserId(httpContext);
        var result = await requestService.ApproveAsync(requestId, approverId, request, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> Reject(
        string id,
        ApproveRequestRequest request,
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var requestId))
            return Results.BadRequest();

        var approverId = GetUserId(httpContext);
        var result = await requestService.RejectAsync(requestId, approverId, request, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> Cancel(
        string id,
        IRequestService requestService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var requestId))
            return Results.BadRequest();

        var employeeId = GetUserId(httpContext);
        var result = await requestService.CancelAsync(requestId, employeeId, cancellationToken);
        return Results.Ok(result);
    }

    private static async Task<IResult> GetSubmitted(
        IRequestService requestService,
        CancellationToken cancellationToken)
    {
        var results = await requestService.GetSubmittedAsync(cancellationToken);
        return Results.Ok(results);
    }

    private static Guid GetUserId(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            throw new InvalidOperationException("User ID not found in claims");

        return userId;
    }
}
