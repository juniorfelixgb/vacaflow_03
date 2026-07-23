namespace VacaFlow.Api.Endpoints;

using VacaFlow.Application.Dtos;
using VacaFlow.Application.Services;

public static class AuthEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/auth")
            .WithTags("Auth");

        group.MapPost("/register", Register)
            .WithName("Register")
            .WithOpenApi()
            .AllowAnonymous();
    }

    private static async Task<IResult> Register(
        RegisterRequest request,
        IAuthService authService,
        CancellationToken cancellationToken)
    {
        var response = await authService.RegisterAsync(request, cancellationToken);
        return Results.Created($"/api/auth/register/{response.Id}", response);
    }
}
