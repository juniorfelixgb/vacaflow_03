namespace VacaFlow.Application.Services;

using VacaFlow.Application.Dtos;
using VacaFlow.Application.Exceptions;
using VacaFlow.Application.Repositories;
using VacaFlow.Domain;

public class RequestService : IRequestService
{
    private readonly IRequestRepository _requestRepository;
    private readonly ITransactionService _transactionService;
    private readonly IApprovalRepository _approvalRepository;
    private readonly IUserRepository _userRepository;

    public RequestService(
        IRequestRepository requestRepository,
        ITransactionService transactionService,
        IApprovalRepository approvalRepository,
        IUserRepository userRepository)
    {
        _requestRepository = requestRepository ?? throw new ArgumentNullException(nameof(requestRepository));
        _transactionService = transactionService ?? throw new ArgumentNullException(nameof(transactionService));
        _approvalRepository = approvalRepository ?? throw new ArgumentNullException(nameof(approvalRepository));
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
    }

    public async Task<RequestDto> CreateAsync(
        Guid employeeId,
        CreateRequestRequest request,
        CancellationToken cancellationToken = default)
    {
        ValidateCreateRequest(request);

        var startDate = ParseDate(request.StartDate, "StartDate");
        var endDate = ParseDate(request.EndDate, "EndDate");
        var absenceTypeId = ParseGuid(request.AbsenceTypeId, "AbsenceTypeId");

        var absenceRequest = AbsenceRequest.Create(employeeId, absenceTypeId, startDate, endDate, request.Reason);

        await _requestRepository.AddAsync(absenceRequest, cancellationToken);
        await _requestRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(absenceRequest);
    }

    public async Task<RequestDto> GetByIdAsync(Guid requestId, CancellationToken cancellationToken = default)
    {
        var request = await _requestRepository.GetByIdAsync(requestId, cancellationToken);
        if (request == null)
            throw new ValidationException("Request not found", "REQUEST_NOT_FOUND");

        return await MapToDtoEnrichedAsync(request, cancellationToken);
    }

    public async Task<IList<RequestDto>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default)
    {
        var requests = await _requestRepository.GetByEmployeeIdAsync(employeeId, cancellationToken);
        return requests.Select(MapToDto).ToList();
    }

    public async Task<IList<RequestDto>> GetSubmittedAsync(CancellationToken cancellationToken = default)
    {
        var requests = await _requestRepository.GetSubmittedAsync(cancellationToken);
        return requests.Select(MapToDto).ToList();
    }

    public async Task<IList<RequestDto>> GetSubmittedForManagerAsync(
        Guid managerId,
        CancellationToken cancellationToken = default)
    {
        var requests = await _requestRepository.GetSubmittedForManagerAsync(managerId, cancellationToken);
        var employees = await _userRepository.GetByIdsAsync(
            requests.Select(r => r.EmployeeId), cancellationToken);

        return requests.Select(r =>
        {
            var dto = MapToDto(r);
            if (employees.TryGetValue(r.EmployeeId, out var employee))
            {
                dto.EmployeeName = employee.FullName;
                dto.EmployeeEmail = employee.Email;
            }
            return dto;
        }).ToList();
    }

    public async Task<RequestDto> UpdateAsync(
        Guid requestId,
        Guid employeeId,
        UpdateRequestRequest request,
        CancellationToken cancellationToken = default)
    {
        ValidateUpdateRequest(request);

        var absenceRequest = await _requestRepository.GetByIdAsync(requestId, cancellationToken);
        if (absenceRequest == null)
            throw new ValidationException("Request not found", "REQUEST_NOT_FOUND");

        if (absenceRequest.EmployeeId != employeeId)
            throw new ValidationException("Not authorized to update this request", "UNAUTHORIZED");

        var startDate = ParseDate(request.StartDate, "StartDate");
        var endDate = ParseDate(request.EndDate, "EndDate");

        absenceRequest.Update(startDate, endDate, request.Reason);

        await _requestRepository.SaveChangesAsync(cancellationToken);
        return MapToDto(absenceRequest);
    }

    public async Task<RequestDto> SubmitAsync(
        Guid requestId,
        Guid employeeId,
        CancellationToken cancellationToken = default)
    {
        var absenceRequest = await _requestRepository.GetByIdAsync(requestId, cancellationToken);
        if (absenceRequest == null)
            throw new ValidationException("Request not found", "REQUEST_NOT_FOUND");

        if (absenceRequest.EmployeeId != employeeId)
            throw new ValidationException("Not authorized to submit this request", "UNAUTHORIZED");

        absenceRequest.Submit();

        await _requestRepository.SaveChangesAsync(cancellationToken);
        return MapToDto(absenceRequest);
    }

    public async Task<RequestDto> ApproveAsync(
        Guid requestId,
        Guid approverId,
        ApproveRequestRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = await _transactionService.ExecuteInTransactionAsync(async () =>
        {
            var absenceRequest = await _requestRepository.GetByIdAsync(requestId, cancellationToken);
            if (absenceRequest == null)
                throw new ValidationException("Request not found", "REQUEST_NOT_FOUND");

            absenceRequest.Approve(approverId, request.Comment);

            var approvalRecord = ApprovalRecord.CreateApproval(requestId, approverId, request.Comment);
            await _approvalRepository.AddAsync(approvalRecord, cancellationToken);

            await _requestRepository.SaveChangesAsync(cancellationToken);

            return MapToDto(absenceRequest);
        }, cancellationToken);

        return result;
    }

    public async Task<RequestDto> RejectAsync(
        Guid requestId,
        Guid approverId,
        ApproveRequestRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = await _transactionService.ExecuteInTransactionAsync(async () =>
        {
            var absenceRequest = await _requestRepository.GetByIdAsync(requestId, cancellationToken);
            if (absenceRequest == null)
                throw new ValidationException("Request not found", "REQUEST_NOT_FOUND");

            absenceRequest.Reject(approverId, request.Comment);

            var approvalRecord = ApprovalRecord.CreateRejection(requestId, approverId, request.Comment);
            await _approvalRepository.AddAsync(approvalRecord, cancellationToken);

            await _requestRepository.SaveChangesAsync(cancellationToken);

            return MapToDto(absenceRequest);
        }, cancellationToken);

        return result;
    }

    public async Task<RequestDto> CancelAsync(
        Guid requestId,
        Guid employeeId,
        CancellationToken cancellationToken = default)
    {
        var absenceRequest = await _requestRepository.GetByIdAsync(requestId, cancellationToken);
        if (absenceRequest == null)
            throw new ValidationException("Request not found", "REQUEST_NOT_FOUND");

        if (absenceRequest.EmployeeId != employeeId)
            throw new ValidationException("Not authorized to cancel this request", "UNAUTHORIZED");

        absenceRequest.Cancel();

        await _requestRepository.SaveChangesAsync(cancellationToken);
        return MapToDto(absenceRequest);
    }

    private async Task<RequestDto> MapToDtoEnrichedAsync(
        AbsenceRequest request,
        CancellationToken cancellationToken)
    {
        var dto = MapToDto(request);

        var employee = await _userRepository.GetByIdAsync(request.EmployeeId, cancellationToken);
        if (employee != null)
        {
            dto.EmployeeName = employee.FullName;
            dto.EmployeeEmail = employee.Email;

            if (employee.AssignedManagerId.HasValue)
            {
                var manager = await _userRepository.GetByIdAsync(
                    employee.AssignedManagerId.Value, cancellationToken);
                dto.AssignedManagerName = manager?.FullName;
            }
        }

        if (request.ApproverId.HasValue)
        {
            var approver = await _userRepository.GetByIdAsync(request.ApproverId.Value, cancellationToken);
            dto.ApproverName = approver?.FullName;
        }

        return dto;
    }

    private static RequestDto MapToDto(AbsenceRequest request) => new()
    {
        Id = request.Id.ToString(),
        EmployeeId = request.EmployeeId.ToString(),
        AbsenceTypeId = request.AbsenceTypeId.ToString(),
        StartDate = request.StartDate.ToString("yyyy-MM-dd"),
        EndDate = request.EndDate.ToString("yyyy-MM-dd"),
        Reason = request.Reason,
        Status = request.Status.ToString(),
        ApproverId = request.ApproverId?.ToString(),
        ApprovalComment = request.ApprovalComment,
        CreatedAt = request.CreatedAt.ToString("O"),
        UpdatedAt = request.UpdatedAt?.ToString("O"),
        SubmittedAt = request.SubmittedAt?.ToString("O"),
        ReviewedAt = request.ReviewedAt?.ToString("O")
    };

    private static void ValidateCreateRequest(CreateRequestRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.AbsenceTypeId))
            throw new ValidationException("Absence type is required", "MISSING_ABSENCE_TYPE");

        if (string.IsNullOrWhiteSpace(request.StartDate))
            throw new ValidationException("Start date is required", "MISSING_START_DATE");

        if (string.IsNullOrWhiteSpace(request.EndDate))
            throw new ValidationException("End date is required", "MISSING_END_DATE");

        if (string.IsNullOrWhiteSpace(request.Reason))
            throw new ValidationException("Reason is required", "MISSING_REASON");
    }

    private static void ValidateUpdateRequest(UpdateRequestRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.StartDate))
            throw new ValidationException("Start date is required", "MISSING_START_DATE");

        if (string.IsNullOrWhiteSpace(request.EndDate))
            throw new ValidationException("End date is required", "MISSING_END_DATE");

        if (string.IsNullOrWhiteSpace(request.Reason))
            throw new ValidationException("Reason is required", "MISSING_REASON");
    }

    private static DateOnly ParseDate(string dateString, string fieldName)
    {
        if (!DateOnly.TryParseExact(dateString, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out var date))
            throw new ValidationException($"Invalid {fieldName} format. Use yyyy-MM-dd", "INVALID_DATE_FORMAT");

        return date;
    }

    private static Guid ParseGuid(string guidString, string fieldName)
    {
        if (!Guid.TryParse(guidString, out var guid))
            throw new ValidationException($"Invalid {fieldName} format", "INVALID_GUID_FORMAT");

        return guid;
    }
}
