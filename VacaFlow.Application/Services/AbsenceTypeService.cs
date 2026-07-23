namespace VacaFlow.Application.Services;

using VacaFlow.Application.Dtos;
using VacaFlow.Application.Repositories;

public class AbsenceTypeService : IAbsenceTypeService
{
    private readonly IAbsenceTypeRepository _repository;

    public AbsenceTypeService(IAbsenceTypeRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<IList<AbsenceTypeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var types = await _repository.GetAllAsync(cancellationToken);
        return types.Select(t => new AbsenceTypeDto
        {
            Id = t.Id.ToString(),
            Code = t.Code,
            NameEn = t.NameEn,
            NameEs = t.NameEs,
            IsActive = t.IsActive
        }).ToList();
    }
}
