namespace VacaFlow.Infrastructure.Services;

using VacaFlow.Application.Services;
using VacaFlow.Infrastructure.Persistence;

public class EfCoreTransactionService : ITransactionService
{
    private readonly VacaFlowDbContext _context;

    public EfCoreTransactionService(VacaFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<T> ExecuteInTransactionAsync<T>(
        Func<Task<T>> operation,
        CancellationToken cancellationToken = default)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var result = await operation();
            await transaction.CommitAsync(cancellationToken);
            return result;
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
