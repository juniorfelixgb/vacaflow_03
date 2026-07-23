namespace VacaFlow.Application.Services;

using VacaFlow.Application.Dtos;

public interface IAbsenceTypeService
{
    Task<IList<AbsenceTypeDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
