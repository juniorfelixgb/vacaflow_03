namespace VacaFlow.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VacaFlow.Domain;

public class VacaFlowDbContext : DbContext
{
    public VacaFlowDbContext(DbContextOptions<VacaFlowDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<AbsenceType> AbsenceTypes { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureEmployee(modelBuilder);
        ConfigureAbsenceType(modelBuilder);
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
}
