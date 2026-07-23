namespace VacaFlow.Api.Endpoints;

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

        group.MapPost("/login", Login)
            .WithName("Login")
            .WithOpenApi()
            .AllowAnonymous();

        group.MapPost("/logout", Logout)
            .WithName("Logout")
            .WithOpenApi()
            .RequireAuthorization();
    }

    private static async Task<IResult> Register(
        RegisterRequest request,
        IAuthService authService,
        CancellationToken cancellationToken)
    {
        var response = await authService.RegisterAsync(request, cancellationToken);
        return Results.Created($"/api/auth/register/{response.Id}", response);
    }

    private static async Task<IResult> Login(
        LoginRequest request,
        IAuthService authService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var response = await authService.LoginAsync(request, cancellationToken);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, response.Id),
            new Claim(ClaimTypes.Email, response.Email),
            new Claim(ClaimTypes.Name, response.FullName),
            new Claim("FullName", response.FullName),
            new Claim(ClaimTypes.Role, response.Role)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties { IsPersistent = true };

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

        return Results.Ok(response);
    }

    private static async Task<IResult> Logout(HttpContext httpContext)
    {
        await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Results.Ok(new { message = "Logged out successfully" });
    }
}
