using Pulsefolio.Application.DTOs.Dashboard;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Interfaces.Repositories;

namespace Pulsefolio.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IPortfolioSummaryService _summary;
        private readonly ITransactionRepository _txnRepo;
        private readonly IPortfolioRepository _portfolioRepo;

        public DashboardService(
            IPortfolioSummaryService summary,
            ITransactionRepository txnRepo,
            IPortfolioRepository portfolioRepo)
        {
            _summary = summary;
            _txnRepo = txnRepo;
            _portfolioRepo = portfolioRepo;
        }

        public async Task<DashboardDto> GetDashboardAsync(Guid portfolioId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(portfolioId)
                ?? throw new KeyNotFoundException("Portfolio not found.");

            var summary = await _summary.GetSummaryAsync(portfolioId);

            var txns = await _txnRepo.GetByPortfolioIdAsync(portfolioId);

            return new DashboardDto
            {
                PortfolioId = portfolioId,
                Name = portfolio.Name,
                TotalCurrentValue = summary.TotalCurrentValue,
                TotalCostBasis = summary.TotalCostBasis,
                UnrealizedPnl = summary.UnrealizedPnl,
                RealizedPnl = summary.RealizedPnl,
                LastValuationAt = summary.LastValuationAt,
                LastValuationValue = summary.TotalCurrentValue,

                TopHoldings = summary.TopHoldings,

                RecentTransactions = txns
                    .OrderByDescending(t => t.Timestamp)
                    .Take(5)
                    .Select(t => new RecentTransactionDto
                    {
                        Symbol = t.Symbol,
                        Type = t.Type,
                        Quantity = t.Quantity,
                        Price = t.Price,
                        Timestamp = t.Timestamp
                    })
                    .ToList()
            };
        }
    }
}
