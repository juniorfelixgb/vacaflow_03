namespace VacaFlow.Application.Services;

using VacaFlow.Application.Dtos;

public interface IAuthService
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
}
