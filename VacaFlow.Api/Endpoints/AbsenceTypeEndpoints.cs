namespace VacaFlow.Api.Endpoints;

using VacaFlow.Application.Services;

public static class AbsenceTypeEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/absence-types")
            .WithTags("Absence Types")
            .RequireAuthorization();

        group.MapGet("/", GetAll)
            .WithName("GetAbsenceTypes")
            .WithOpenApi();
    }

    private static async Task<IResult> GetAll(
        IAbsenceTypeService absenceTypeService,
        CancellationToken cancellationToken)
    {
        var types = await absenceTypeService.GetAllAsync(cancellationToken);
        return Results.Ok(types);
    }
}
