namespace VacaFlow.Domain;

public class AbsenceRequest
{
    public Guid Id { get; private set; }
    public Guid EmployeeId { get; private set; }
    public Guid AbsenceTypeId { get; private set; }
    public DateOnly StartDate { get; private set; }
    public DateOnly EndDate { get; private set; }
    public string Reason { get; private set; } = string.Empty;
    public RequestStatus Status { get; private set; }
    public Guid? ApproverId { get; private set; }
    public string? ApprovalComment { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? SubmittedAt { get; private set; }
    public DateTime? ReviewedAt { get; private set; }

    private AbsenceRequest() { }

    public static AbsenceRequest Create(
        Guid employeeId,
        Guid absenceTypeId,
        DateOnly startDate,
        DateOnly endDate,
        string reason)
    {
        ValidateDates(startDate, endDate);

        return new AbsenceRequest
        {
            Id = Guid.NewGuid(),
            EmployeeId = employeeId,
            AbsenceTypeId = absenceTypeId,
            StartDate = startDate,
            EndDate = endDate,
            Reason = reason,
            Status = RequestStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(DateOnly startDate, DateOnly endDate, string reason)
    {
        if (Status != RequestStatus.Draft)
            throw new DomainException("Only draft requests can be edited", "CANNOT_EDIT_NON_DRAFT");

        ValidateDates(startDate, endDate);

        StartDate = startDate;
        EndDate = endDate;
        Reason = reason;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Submit()
    {
        if (Status != RequestStatus.Draft)
            throw new DomainException("Only draft requests can be submitted", "CANNOT_SUBMIT_NON_DRAFT");

        Status = RequestStatus.Submitted;
        SubmittedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Approve(Guid approverId, string? comment = null)
    {
        if (Status != RequestStatus.Submitted)
            throw new DomainException("Only submitted requests can be approved", "CANNOT_APPROVE_NON_SUBMITTED");

        if (approverId == EmployeeId)
            throw new DomainException("Cannot approve your own request", "SELF_APPROVAL_NOT_ALLOWED");

        Status = RequestStatus.Approved;
        ApproverId = approverId;
        ApprovalComment = comment;
        ReviewedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reject(Guid approverId, string? comment = null)
    {
        if (Status != RequestStatus.Submitted)
            throw new DomainException("Only submitted requests can be rejected", "CANNOT_REJECT_NON_SUBMITTED");

        if (approverId == EmployeeId)
            throw new DomainException("Cannot reject your own request", "SELF_APPROVAL_NOT_ALLOWED");

        Status = RequestStatus.Rejected;
        ApproverId = approverId;
        ApprovalComment = comment;
        ReviewedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status == RequestStatus.Cancelled || Status == RequestStatus.Approved || Status == RequestStatus.Rejected)
            throw new DomainException("Cannot cancel this request", "CANNOT_CANCEL_REQUEST");

        Status = RequestStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    private static void ValidateDates(DateOnly startDate, DateOnly endDate)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (startDate < today)
            throw new DomainException("Start date cannot be in the past", "INVALID_START_DATE");

        if (endDate < startDate)
            throw new DomainException("End date must be on or after start date", "INVALID_END_DATE");
    }
}
