namespace VacaFlow.Application.Services;

using VacaFlow.Application.Dtos;

public interface IRequestService
{
    Task<RequestDto> CreateAsync(
        Guid employeeId,
        CreateRequestRequest request,
        CancellationToken cancellationToken = default);

    Task<RequestDto> GetByIdAsync(Guid requestId, CancellationToken cancellationToken = default);

    Task<IList<RequestDto>> GetByEmployeeIdAsync(Guid employeeId, CancellationToken cancellationToken = default);

    Task<IList<RequestDto>> GetSubmittedAsync(CancellationToken cancellationToken = default);

    Task<RequestDto> UpdateAsync(
        Guid requestId,
        Guid employeeId,
        UpdateRequestRequest request,
        CancellationToken cancellationToken = default);

    Task<RequestDto> SubmitAsync(Guid requestId, Guid employeeId, CancellationToken cancellationToken = default);

    Task<RequestDto> ApproveAsync(
        Guid requestId,
        Guid approverId,
        ApproveRequestRequest request,
        CancellationToken cancellationToken = default);

    Task<RequestDto> RejectAsync(
        Guid requestId,
        Guid approverId,
        ApproveRequestRequest request,
        CancellationToken cancellationToken = default);

    Task<RequestDto> CancelAsync(Guid requestId, Guid employeeId, CancellationToken cancellationToken = default);
}
