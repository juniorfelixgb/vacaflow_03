namespace VacaFlow.Application.Services;

public interface ITransactionService
{
    Task<T> ExecuteInTransactionAsync<T>(
        Func<Task<T>> operation,
        CancellationToken cancellationToken = default);
}
