using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.Application.Services
{
    public class PortfolioSummaryService : IPortfolioSummaryService
    {
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly IPortfolioAnalyticsService _analytics;
        private readonly IValuationSnapshotRepository _valuationRepo;

        public PortfolioSummaryService(
            IPortfolioRepository portfolioRepo,
            IPortfolioAnalyticsService analytics,
            IValuationSnapshotRepository valuationRepo)
        {
            _portfolioRepo = portfolioRepo;
            _analytics = analytics;
            _valuationRepo = valuationRepo;
        }

        public async Task<PortfolioSummaryDto> GetSummaryAsync(Guid portfolioId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(portfolioId)
                           ?? throw new KeyNotFoundException("Portfolio not found");

            var pnl = await _analytics.ComputePortfolioPnlAsync(portfolioId);
            var latestVal = await _valuationRepo.GetLatestAsync(portfolioId);

            var dto = new PortfolioSummaryDto
            {
                PortfolioId = portfolioId,
                Name = portfolio.Name,
                TotalCurrentValue = pnl.TotalCurrentValue,
                TotalCostBasis = pnl.TotalCostBasis,
                UnrealizedPnl = pnl.UnrealizedPnl,
                RealizedPnl = pnl.RealizedPnl,
                LastValuationAt = latestVal?.CreatedAt
            };

            dto.TopHoldings = pnl.Holdings
                .OrderByDescending(h => h.CurrentValue)
                .Take(5)
                .Select(h => new HoldingSummaryDto
                {
                    Symbol = h.Symbol,
                    CurrentValue = h.CurrentValue,
                    AllocationPercent = h.AllocationPercent
                })
                .ToList();

            return dto;
        }
    }
}
