using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Services
{
    public class PortfolioAnalyticsService : IPortfolioAnalyticsService
    {
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly ITransactionRepository _transactionRepo;
        private readonly IMarketDataProvider _marketData;

        public PortfolioAnalyticsService(
            IPortfolioRepository portfolioRepo,
            ITransactionRepository transactionRepo,
            IMarketDataProvider marketData)
        {
            _portfolioRepo = portfolioRepo;
            _transactionRepo = transactionRepo;
            _marketData = marketData;
        }

        public async Task<PortfolioPnlDto> ComputePortfolioPnlAsync(Guid portfolioId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(portfolioId)
                ?? throw new KeyNotFoundException("Portfolio not found");

            var dto = new PortfolioPnlDto { PortfolioId = portfolioId };

            // Build dictionary of holdings
            var holdingDtos = portfolio.Holdings.ToDictionary(
                h => h.Symbol.ToUpperInvariant(),
                h => new HoldingPnlDto
                {
                    Symbol = h.Symbol,
                    Quantity = h.Quantity,
                    AvgCost = h.AveragePrice
                });

            var txns = await _transactionRepo.GetByPortfolioIdAsync(portfolioId)
                        ?? new List<Transaction>();

            var realized = new Dictionary<string, decimal>();
            var buyQueues = new Dictionary<string, Queue<(decimal qty, decimal price)>>();

            foreach (var txn in txns)
            {
                var s = txn.Symbol.ToUpperInvariant();
                if (!buyQueues.ContainsKey(s)) buyQueues[s] = new();

                if (txn.Type == "BUY")
                {
                    buyQueues[s].Enqueue((txn.Quantity, txn.Price));
                }
                else if (txn.Type == "SELL")
                {
                    decimal rem = txn.Quantity;
                    decimal realizedForTxn = 0;

                    while (rem > 0 && buyQueues[s].Any())
                    {
                        var (avail, cost) = buyQueues[s].Dequeue();
                        var take = Math.Min(rem, avail);

                        realizedForTxn += (txn.Price - cost) * take;

                        if (avail > take)
                            buyQueues[s].Enqueue((avail - take, cost));

                        rem -= take;
                    }

                    if (!realized.ContainsKey(s)) realized[s] = 0;
                    realized[s] += realizedForTxn;
                }
            }

            // Price lookup
            foreach (var h in holdingDtos.Values)
            {
                h.CurrentPrice = await _marketData.GetPriceAsync(h.Symbol);
                h.RealizedPnl = realized.ContainsKey(h.Symbol.ToUpper()) ? realized[h.Symbol.ToUpper()] : 0;
            }

            dto.Holdings = holdingDtos.Values.ToList();

            dto.TotalCurrentValue = dto.Holdings.Sum(h => h.CurrentValue);
            dto.TotalCostBasis = dto.Holdings.Sum(h => h.CostBasis);
            dto.UnrealizedPnl = dto.Holdings.Sum(h => h.UnrealizedPnl);
            dto.RealizedPnl = dto.Holdings.Sum(h => h.RealizedPnl);

            foreach (var h in dto.Holdings)
                h.AllocationPercent = dto.TotalCurrentValue == 0 ? 0 :
                    Math.Round((h.CurrentValue / dto.TotalCurrentValue) * 100, 2);

            return dto;
        }
    }
}
