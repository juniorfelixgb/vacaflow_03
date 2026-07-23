namespace VacaFlow.Infrastructure.Seeders;

using Microsoft.EntityFrameworkCore;
using VacaFlow.Domain;
using VacaFlow.Infrastructure.Persistence;

public static class ManagerAccountSeeder
{
    private static readonly string ManagerEmail = "james.parker@igs.com";
    private static readonly string ManagerPassword = "Demo1234!";

    public static async Task SeedAsync(VacaFlowDbContext context)
    {
        var normalizedEmail = ManagerEmail.ToLowerInvariant();
        var exists = await context.Employees.AnyAsync(e => e.Email == normalizedEmail);

        if (exists)
            return;

        var manager = Employee.CreateManager("James Parker", ManagerEmail, ManagerPassword);
        await context.Employees.AddAsync(manager);
        await context.SaveChangesAsync();
    }
}
