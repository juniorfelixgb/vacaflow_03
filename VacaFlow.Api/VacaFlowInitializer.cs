namespace VacaFlow.Api;

using VacaFlow.Infrastructure.Extensions;

public static class VacaFlowInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        try
        {
            await InfrastructureServiceExtensions.InitializeDatabaseAsync(serviceProvider);
        }
        catch (Exception ex)
        {
            var logger = serviceProvider.GetRequiredService<ILogger<object>>();
            logger.LogError(ex, "Failed to initialize database");
            throw;
        }
    }
}
