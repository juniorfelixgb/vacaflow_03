namespace VacaFlow.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using VacaFlow.Application.Repositories;
using VacaFlow.Domain;
using VacaFlow.Infrastructure.Persistence;

public class EfCoreUserRepository : IUserRepository
{
    private readonly VacaFlowDbContext _context;

    public EfCoreUserRepository(VacaFlowDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.ToLowerInvariant();
        return await _context.Employees
            .AnyAsync(e => e.Email == normalizedEmail, cancellationToken);
    }

    public async Task<Employee?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.ToLowerInvariant();
        return await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == normalizedEmail, cancellationToken);
    }

    public async Task AddAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        await _context.Employees.AddAsync(employee, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
