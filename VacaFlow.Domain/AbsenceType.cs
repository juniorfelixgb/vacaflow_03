namespace VacaFlow.Domain;

public class AbsenceType
{
    public Guid Id { get; private set; }
    public string Code { get; private set; } = null!;
    public string NameEs { get; private set; } = null!;
    public string NameEn { get; private set; } = null!;
    public bool IsActive { get; private set; }

    private AbsenceType() { }

    public AbsenceType(string code, string nameEs, string nameEn)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Absence type code is required", "INVALID_ABSENCE_TYPE");

        Id = Guid.NewGuid();
        Code = code;
        NameEs = nameEs;
        NameEn = nameEn;
        IsActive = true;
    }
}
