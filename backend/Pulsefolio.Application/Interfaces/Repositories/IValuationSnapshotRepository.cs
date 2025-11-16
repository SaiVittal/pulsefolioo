using Pulsefolio.Domain.Entities.Valuations;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface IValuationSnapshotRepository
    {
        Task AddAsync(ValuationSnapshot snapshot);
        Task<List<ValuationSnapshot>> GetHistoryAsync(Guid portfolioId, DateTime? from = null, DateTime? to = null);
        Task<ValuationSnapshot?> GetLatestAsync(Guid portfolioId);
    }
}
