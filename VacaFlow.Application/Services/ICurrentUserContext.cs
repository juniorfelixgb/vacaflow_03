namespace VacaFlow.Application.Services;

public interface ICurrentUserContext
{
    string UserId { get; }
    string Email { get; }
    string FullName { get; }
    string Role { get; }
    bool IsAuthenticated { get; }
}
