namespace VacaFlow.Api.Endpoints;

using VacaFlow.Application.Dtos;
using VacaFlow.Application.Services;

public static class UserEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .RequireAuthorization();

        group.MapGet("/me", GetCurrentUser)
            .WithName("GetCurrentUser")
            .WithOpenApi();
    }

    private static async Task<IResult> GetCurrentUser(ICurrentUserContext currentUserContext)
    {
        var response = new
        {
            id = currentUserContext.UserId,
            email = currentUserContext.Email,
            fullName = currentUserContext.FullName,
            role = currentUserContext.Role
        };

        return Results.Ok(response);
    }
}
