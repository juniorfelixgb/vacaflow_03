namespace VacaFlow.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VacaFlow.Domain;

public class VacaFlowDbContext : DbContext
{
    public VacaFlowDbContext(DbContextOptions<VacaFlowDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<AbsenceType> AbsenceTypes { get; set; } = null!;
    public DbSet<AbsenceRequest> AbsenceRequests { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureEmployee(modelBuilder);
        ConfigureAbsenceType(modelBuilder);
        ConfigureAbsenceRequest(modelBuilder);
    }

    private static void ConfigureEmployee(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedNever();

            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.Role)
                .IsRequired()
                .HasConversion<int>();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.HasIndex(e => e.Email)
                .IsUnique(true)
                .HasDatabaseName("IX_Employees_Email_Unique");

            entity.ToTable("Employees");
        });
    }

    private static void ConfigureAbsenceType(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AbsenceType>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedNever();

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.NameEs)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.NameEn)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.IsActive)
                .IsRequired();

            entity.HasIndex(e => e.Code)
                .IsUnique(true)
                .HasDatabaseName("IX_AbsenceTypes_Code_Unique");

            entity.ToTable("AbsenceTypes");
        });
    }

    private static void ConfigureAbsenceRequest(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AbsenceRequest>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedNever();

            entity.Property(e => e.EmployeeId)
                .IsRequired();

            entity.Property(e => e.AbsenceTypeId)
                .IsRequired();

            entity.Property(e => e.StartDate)
                .IsRequired();

            entity.Property(e => e.EndDate)
                .IsRequired();

            entity.Property(e => e.Reason)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<int>();

            entity.Property(e => e.ApproverId);

            entity.Property(e => e.ApprovalComment)
                .HasMaxLength(1000);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt);
            entity.Property(e => e.SubmittedAt);
            entity.Property(e => e.ReviewedAt);

            entity.HasIndex(e => e.EmployeeId)
                .HasDatabaseName("IX_AbsenceRequests_EmployeeId");

            entity.HasIndex(e => e.Status)
                .HasDatabaseName("IX_AbsenceRequests_Status");

            entity.HasIndex(e => new { e.EmployeeId, e.Status })
                .HasDatabaseName("IX_AbsenceRequests_EmployeeId_Status");

            entity.ToTable("AbsenceRequests");
        });
    }
}
