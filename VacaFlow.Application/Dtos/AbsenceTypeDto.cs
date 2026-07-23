namespace VacaFlow.Application.Dtos;

public class AbsenceTypeDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string NameEs { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
