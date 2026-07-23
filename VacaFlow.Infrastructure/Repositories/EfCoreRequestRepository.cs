namespace VacaFlow.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using VacaFlow.Application.Repositories;
using VacaFlow.Domain;
using VacaFlow.Infrastructure.Persistence;

public class EfCoreRequestRepository : IRequestRepository
{
    private readonly VacaFlowDbContext _context;

    public EfCoreRequestRepository(VacaFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<AbsenceRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.AbsenceRequests.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<IList<AbsenceRequest>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default)
    {
        return await _context.AbsenceRequests
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IList<AbsenceRequest>> GetSubmittedAsync(CancellationToken cancellationToken = default)
    {
        return await _context.AbsenceRequests
            .Where(r => r.Status == RequestStatus.Submitted)
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(AbsenceRequest request, CancellationToken cancellationToken = default)
    {
        await _context.AbsenceRequests.AddAsync(request, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
