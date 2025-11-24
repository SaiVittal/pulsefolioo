using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.DTOs.Transaction;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _txRepo;
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly IHoldingRepository _holdingRepo;

        public TransactionService(
            ITransactionRepository txRepo,
            IPortfolioRepository portfolioRepo,
            IHoldingRepository holdingRepo)
        {
            _txRepo = txRepo;
            _portfolioRepo = portfolioRepo;
            _holdingRepo = holdingRepo;
        }

        // ====== low-level ======
        public Task AddAsync(Transaction txn) => _txRepo.AddAsync(txn);

        public Task<Transaction?> GetByIdAsync(Guid id) => _txRepo.GetByIdAsync(id);

        public Task<List<Transaction>> GetByPortfolioIdAsync(Guid portfolioId)
            => _txRepo.GetByPortfolioIdAsync(portfolioId);

        public Task<List<Transaction>> GetByHoldingIdAsync(Guid holdingId)
            => _txRepo.GetByHoldingIdAsync(holdingId);

        // ====== high-level BUY ======
        public async Task<TransactionDto> BuyAsync(CreateBuyTransactionDto dto, Guid userId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(dto.PortfolioId)
                           ?? throw new KeyNotFoundException("Portfolio not found");

            if (portfolio.UserId != userId)
                throw new UnauthorizedAccessException("Access denied to portfolio");

            // find or create holding
            Holding? holding = null;

            if (dto.HoldingId.HasValue)
            {
                holding = await _holdingRepo.GetByIdAsync(dto.HoldingId.Value);
            }

            if (holding == null)
            {
                holding = portfolio.Holdings
                    .FirstOrDefault(h => h.Symbol.Equals(dto.Symbol, StringComparison.OrdinalIgnoreCase));
            }

            if (holding == null)
            {
                holding = new Holding
                {
                    Id = Guid.NewGuid(),
                    PortfolioId = portfolio.Id,
                    Symbol = dto.Symbol.Trim().ToUpperInvariant(),
                    Quantity = 0,
                    AveragePrice = 0,
                    CreatedAt = DateTime.UtcNow
                };
                await _holdingRepo.AddAsync(holding);
            }

            // update avg cost & quantity
            var oldQty = holding.Quantity;
            var oldCost = holding.AveragePrice;
            var newQty = oldQty + dto.Quantity;
            if (newQty <= 0)
                throw new InvalidOperationException("Resulting quantity must be positive for a buy.");

            var totalCostBefore = oldQty * oldCost;
            var newCost = (totalCostBefore + dto.Price * dto.Quantity) / newQty;

            holding.Quantity = newQty;
            holding.AveragePrice = newCost;
            holding.UpdatedAt = DateTime.UtcNow;

            await _holdingRepo.UpdateAsync(holding);

            var txn = new Transaction
            {
                Id = Guid.NewGuid(),
                PortfolioId = portfolio.Id,
                HoldingId = holding.Id,
                Symbol = holding.Symbol,
                Type = "BUY",
                Quantity = dto.Quantity,
                Price = dto.Price,
                Timestamp = dto.Timestamp ?? DateTime.UtcNow
            };

            await _txRepo.AddAsync(txn);

            return ToDto(txn);
        }

        // ====== high-level SELL ======
        public async Task<TransactionDto> SellAsync(CreateSellTransactionDto dto, Guid userId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(dto.PortfolioId)
                           ?? throw new KeyNotFoundException("Portfolio not found");

            if (portfolio.UserId != userId)
                throw new UnauthorizedAccessException("Access denied to portfolio");

            // find holding
            Holding? holding = null;

            if (dto.HoldingId.HasValue)
            {
                holding = await _holdingRepo.GetByIdAsync(dto.HoldingId.Value);
            }

            if (holding == null)
            {
                holding = portfolio.Holdings
                    .FirstOrDefault(h => h.Symbol.Equals(dto.Symbol, StringComparison.OrdinalIgnoreCase));
            }

            if (holding == null)
                throw new InvalidOperationException("Cannot sell: holding not found for symbol.");

            if (dto.Quantity <= 0)
                throw new InvalidOperationException("Sell quantity must be positive.");

            if (dto.Quantity > holding.Quantity)
                throw new InvalidOperationException("Cannot sell more than current holding quantity.");

            holding.Quantity -= dto.Quantity;
            holding.UpdatedAt = DateTime.UtcNow;

            await _holdingRepo.UpdateAsync(holding);

            var txn = new Transaction
            {
                Id = Guid.NewGuid(),
                PortfolioId = portfolio.Id,
                HoldingId = holding.Id,
                Symbol = holding.Symbol,
                Type = "SELL",
                Quantity = dto.Quantity,
                Price = dto.Price,
                Timestamp = dto.Timestamp ?? DateTime.UtcNow
            };

            await _txRepo.AddAsync(txn);

            return ToDto(txn);
        }

        // ====== list txns for portfolio ======
        public async Task<List<TransactionDto>> GetPortfolioTransactionsAsync(Guid portfolioId, Guid userId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(portfolioId)
                           ?? throw new KeyNotFoundException("Portfolio not found");
            if (portfolio.UserId != userId)
                throw new UnauthorizedAccessException("Access denied to portfolio");

            var txns = await _txRepo.GetByPortfolioIdAsync(portfolioId);
            return txns.Select(ToDto).ToList();
        }

        private static TransactionDto ToDto(Transaction t) => new()
        {
            Id = t.Id,
            PortfolioId = t.PortfolioId,
            HoldingId = t.HoldingId,
            Symbol = t.Symbol,
            Type = t.Type,
            Quantity = t.Quantity,
            Price = t.Price,
            Timestamp = t.Timestamp
        };
    }
}
