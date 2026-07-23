namespace VacaFlow.Application.Repositories;

using VacaFlow.Domain;

public interface IAbsenceTypeRepository
{
    Task<IList<AbsenceType>> GetAllAsync(CancellationToken cancellationToken = default);
}
