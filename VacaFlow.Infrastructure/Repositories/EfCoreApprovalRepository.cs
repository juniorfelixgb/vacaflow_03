namespace VacaFlow.Infrastructure.Repositories;

using VacaFlow.Application.Repositories;
using VacaFlow.Domain;
using VacaFlow.Infrastructure.Persistence;

public class EfCoreApprovalRepository : IApprovalRepository
{
    private readonly VacaFlowDbContext _context;

    public EfCoreApprovalRepository(VacaFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task AddAsync(ApprovalRecord approval, CancellationToken cancellationToken = default)
    {
        _context.ApprovalRecords.Add(approval);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
