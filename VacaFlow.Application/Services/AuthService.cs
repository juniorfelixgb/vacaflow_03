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

        var employee = Employee.RegisterEmployee(request.FullName, request.Email, request.Password);

        await _userRepository.AddAsync(employee, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return new RegisterResponse
        {
            Id = employee.Id,
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
}
