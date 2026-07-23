namespace VacaFlow.Domain;

public class ApprovalRecord
{
    public Guid Id { get; private set; }
    public Guid RequestId { get; private set; }
    public Guid ApproverId { get; private set; }
    public ApprovalDecision Decision { get; private set; }
    public string? Comment { get; private set; }
    public DateTime ReviewedAt { get; private set; }

    private ApprovalRecord() { }

    public static ApprovalRecord CreateApproval(Guid requestId, Guid approverId, string? comment = null)
    {
        return new ApprovalRecord
        {
            Id = Guid.NewGuid(),
            RequestId = requestId,
            ApproverId = approverId,
            Decision = ApprovalDecision.Approved,
            Comment = comment,
            ReviewedAt = DateTime.UtcNow
        };
    }

    public static ApprovalRecord CreateRejection(Guid requestId, Guid approverId, string? comment = null)
    {
        return new ApprovalRecord
        {
            Id = Guid.NewGuid(),
            RequestId = requestId,
            ApproverId = approverId,
            Decision = ApprovalDecision.Rejected,
            Comment = comment,
            ReviewedAt = DateTime.UtcNow
        };
    }
}

public enum ApprovalDecision
{
    Approved,
    Rejected
}
