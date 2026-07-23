namespace VacaFlow.Infrastructure.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VacaFlow.Application.Repositories;
using VacaFlow.Application.Services;
using VacaFlow.Infrastructure.Persistence;
using VacaFlow.Infrastructure.Repositories;
using VacaFlow.Infrastructure.Seeders;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<VacaFlowDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<IUserRepository, EfCoreUserRepository>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }

    public static async Task InitializeDatabaseAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<VacaFlowDbContext>();

        // Apply migrations (or create if none exist)
        await context.Database.MigrateAsync();

        // Seed data
        await AbsenceTypeSeeder.SeedAsync(context);
        await ManagerAccountSeeder.SeedAsync(context);
    }
}
