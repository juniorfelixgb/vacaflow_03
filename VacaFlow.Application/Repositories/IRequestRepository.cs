namespace VacaFlow.Application.Repositories;

using VacaFlow.Domain;

public interface IRequestRepository
{
    Task<AbsenceRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IList<AbsenceRequest>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default);
    Task<IList<AbsenceRequest>> GetSubmittedAsync(CancellationToken cancellationToken = default);
    Task AddAsync(AbsenceRequest request, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
