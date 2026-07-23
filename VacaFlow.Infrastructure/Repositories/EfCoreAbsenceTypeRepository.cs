namespace VacaFlow.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using VacaFlow.Application.Repositories;
using VacaFlow.Domain;
using VacaFlow.Infrastructure.Persistence;

public class EfCoreAbsenceTypeRepository : IAbsenceTypeRepository
{
    private readonly VacaFlowDbContext _context;

    public EfCoreAbsenceTypeRepository(VacaFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IList<AbsenceType>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.AbsenceTypes
            .Where(at => at.IsActive)
            .ToListAsync(cancellationToken);
    }
}
