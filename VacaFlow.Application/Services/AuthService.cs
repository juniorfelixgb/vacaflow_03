namespace VacaFlow.Application.Services;

using VacaFlow.Application.Dtos;
using VacaFlow.Application.Exceptions;
using VacaFlow.Application.Repositories;
using VacaFlow.Domain;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        ValidateRequest(request);

        var emailExists = await _userRepository.EmailExistsAsync(request.Email.ToLowerInvariant(), cancellationToken);
        if (emailExists)
            throw new ValidationException("This email is already registered", "EMAIL_ALREADY_IN_USE");

        // Assign the default manager so submitted requests reach a review queue.
        var defaultManager = await _userRepository.GetDefaultManagerAsync(cancellationToken);
        var employee = Employee.RegisterEmployee(
            request.FullName, request.Email, request.Password, defaultManager?.Id);

        await _userRepository.AddAsync(employee, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return new RegisterResponse
        {
            Id = employee.Id.ToString(),
            FullName = employee.FullName,
            Email = employee.Email,
            Role = employee.Role.ToString()
        };
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        ValidateLoginRequest(request);

        var employee = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);
        if (employee == null)
            throw new ValidationException("Invalid email or password", "INVALID_CREDENTIALS");

        if (!employee.VerifyPassword(request.Password))
            throw new ValidationException("Invalid email or password", "INVALID_CREDENTIALS");

        return new LoginResponse
        {
            Id = employee.Id.ToString(),
            FullName = employee.FullName,
            Email = employee.Email,
            Role = employee.Role.ToString()
        };
    }

    private static void ValidateRequest(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ValidationException("Full name is required", "MISSING_FULL_NAME");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("Email is required", "MISSING_EMAIL");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ValidationException("Password is required", "MISSING_PASSWORD");
    }

    private static void ValidateLoginRequest(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("Email is required", "MISSING_EMAIL");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ValidationException("Password is required", "MISSING_PASSWORD");
    }
}
