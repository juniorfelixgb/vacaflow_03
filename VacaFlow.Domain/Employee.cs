namespace VacaFlow.Domain;

using BCrypt.Net;

public class Employee
{
    private const int BcryptWorkFactor = 12;
    private const int MinPasswordLength = 8;

    public Guid Id { get; private set; }
    public string FullName { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public UserRole Role { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Employee() { }

    public static Employee RegisterEmployee(string fullName, string email, string password)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("Full name is required", "MISSING_FULL_NAME");

        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email is required", "MISSING_EMAIL");

        if (string.IsNullOrWhiteSpace(password))
            throw new DomainException("Password is required", "MISSING_PASSWORD");

        if (!IsValidEmail(email))
            throw new DomainException("Invalid email format", "INVALID_EMAIL");

        if (password.Length < MinPasswordLength)
            throw new DomainException($"Password must be at least {MinPasswordLength} characters", "WEAK_PASSWORD");

        var passwordHash = BCrypt.HashPassword(password, BcryptWorkFactor);

        return new Employee
        {
            Id = Guid.NewGuid(),
            FullName = fullName.Trim(),
            Email = email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHash,
            Role = UserRole.Employee,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static Employee CreateManager(string fullName, string email, string password)
    {
        var employee = RegisterEmployee(fullName, email, password);
        employee.Role = UserRole.Manager;
        return employee;
    }

    public bool VerifyPassword(string password)
    {
        return BCrypt.Verify(password, PasswordHash);
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email.ToLowerInvariant();
        }
        catch
        {
            return false;
        }
    }
}
