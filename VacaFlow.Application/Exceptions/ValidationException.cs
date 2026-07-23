namespace VacaFlow.Application.Exceptions;

public class ValidationException : Exception
{
    public string Code { get; }

    public ValidationException(string message, string code) : base(message)
    {
        Code = code;
    }
}
