namespace VacaFlow.Application.Repositories;

using VacaFlow.Domain;

public interface IApprovalRepository
{
    Task AddAsync(ApprovalRecord approval, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
