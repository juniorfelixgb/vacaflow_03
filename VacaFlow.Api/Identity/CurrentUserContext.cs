namespace VacaFlow.Api.Identity;

using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using VacaFlow.Application.Services;

public class CurrentUserContext : ICurrentUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    public string UserId => GetClaimValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    public string Email => GetClaimValue(ClaimTypes.Email) ?? string.Empty;
    public string FullName => GetClaimValue("FullName") ?? string.Empty;
    public string Role => GetClaimValue(ClaimTypes.Role) ?? string.Empty;
    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

    private string? GetClaimValue(string claimType)
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirst(claimType)?.Value;
    }
}
