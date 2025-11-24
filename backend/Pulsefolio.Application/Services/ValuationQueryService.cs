using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.Application.Services
{
    public class ValuationQueryService : IValuationQueryService
    {
        private readonly IValuationSnapshotRepository _repo;

        public ValuationQueryService(IValuationSnapshotRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ValuationSnapshotDto>> GetHistoryAsync(Guid portfolioId, DateTime? from = null, DateTime? to = null)
        {
            var list = await _repo.GetHistoryAsync(portfolioId, from, to);
            return list.Select(v => new ValuationSnapshotDto
            {
                Id = v.Id,
                PortfolioId = v.PortfolioId,
                TotalValue = v.TotalValue,
                HoldingsJson = v.HoldingsJson,
                CreatedAt = v.CreatedAt
            }).ToList();
        }

        public async Task<ValuationSnapshotDto?> GetLatestAsync(Guid portfolioId)
        {
            var v = await _repo.GetLatestAsync(portfolioId);
            if (v == null) return null;

            return new ValuationSnapshotDto
            {
                Id = v.Id,
                PortfolioId = v.PortfolioId,
                TotalValue = v.TotalValue,
                HoldingsJson = v.HoldingsJson,
                CreatedAt = v.CreatedAt
            };
        }
    }
}
