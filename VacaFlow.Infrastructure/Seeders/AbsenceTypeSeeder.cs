namespace VacaFlow.Infrastructure.Seeders;

using Microsoft.EntityFrameworkCore;
using VacaFlow.Domain;
using VacaFlow.Infrastructure.Persistence;

public static class AbsenceTypeSeeder
{
    public static async Task SeedAsync(VacaFlowDbContext context)
    {
        if (await context.AbsenceTypes.AnyAsync())
            return;

        var absenceTypes = new[]
        {
            new AbsenceType("vacation", "Vacaciones", "Vacation"),
            new AbsenceType("personal", "Permiso Personal", "Personal Leave"),
            new AbsenceType("sick", "Licencia por Enfermedad", "Sick Leave")
        };

        await context.AbsenceTypes.AddRangeAsync(absenceTypes);
        await context.SaveChangesAsync();
    }
}
