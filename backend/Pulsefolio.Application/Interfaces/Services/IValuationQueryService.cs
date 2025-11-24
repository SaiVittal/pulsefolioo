using Pulsefolio.Application.DTOs;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IValuationQueryService
    {
        Task<List<ValuationSnapshotDto>> GetHistoryAsync(Guid portfolioId, DateTime? from = null, DateTime? to = null);
        Task<ValuationSnapshotDto?> GetLatestAsync(Guid portfolioId);
    }
}
