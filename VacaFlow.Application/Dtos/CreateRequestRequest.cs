namespace VacaFlow.Application.Dtos;

public class CreateRequestRequest
{
    public string AbsenceTypeId { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}
