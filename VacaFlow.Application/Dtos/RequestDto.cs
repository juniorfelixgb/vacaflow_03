namespace VacaFlow.Application.Dtos;

public class RequestDto
{
    public string Id { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string AbsenceTypeId { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ApproverId { get; set; }
    public string? ApprovalComment { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? UpdatedAt { get; set; }
    public string? SubmittedAt { get; set; }
    public string? ReviewedAt { get; set; }
}
