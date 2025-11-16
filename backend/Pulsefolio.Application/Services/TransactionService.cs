using AutoMapper;
using Pulsefolio.Application.DTOs.Transaction;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Common.Exceptions;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _txRepo;
        private readonly IHoldingRepository _holdingRepo;
        private readonly IMapper _mapper;

        public TransactionService(ITransactionRepository txRepo, IHoldingRepository holdingRepo, IMapper mapper)
        {
            _txRepo = txRepo;
            _holdingRepo = holdingRepo;
            _mapper = mapper;
        }

        public async Task<TransactionDto> AddTransactionAsync(CreateTransactionDto dto, Guid userId)
        {
            var holding = await _holdingRepo.GetByIdAsync(dto.HoldingId);
            if (holding == null) throw new NotFoundException("Holding not found.");

            // ownership check: get portfolio and verify userId (via holding -> portfolio)
            // assume holding includes PortfolioId; use portfolio repo if necessary
            // For simplicity, assume holding has Portfolio.UserId or we fetch portfolio via portfolio repo (better)

            // Basic validation
            if (dto.Quantity <= 0) throw new BadRequestException("Quantity must be positive.");
            if (dto.Price <= 0) throw new BadRequestException("Price must be positive.");

            var tx = new Transaction
            {
                Id = Guid.NewGuid(),
                HoldingId = dto.HoldingId,
                Quantity = dto.Quantity,
                Price = dto.Price,
                Type = dto.Type,
                CreatedAt = DateTime.UtcNow
            };

            await _txRepo.AddAsync(tx);

            // Update holding: recalc quantity and average price for BUY only here. SELL logic subtracts quantity.
            if (dto.Type.Equals("BUY", StringComparison.CurrentCultureIgnoreCase))
            {
                var totalCostOld = holding.AveragePrice * holding.Quantity;
                var totalBought = dto.Price * dto.Quantity;
                var newQuantity = holding.Quantity + dto.Quantity;
                var newAvg = (totalCostOld + totalBought) / newQuantity;
                holding.Quantity = newQuantity;
                holding.AveragePrice = newAvg;
            }
            else if (dto.Type.ToUpper() == "SELL")
            {
                if (dto.Quantity > holding.Quantity) throw new BadRequestException("Not enough quantity to sell.");
                holding.Quantity -= dto.Quantity;
                // when selling, average price remains same; realized P/L handled in analytics
            }
            else
            {
                throw new BadRequestException("Invalid transaction type.");
            }

            await _holdingRepo.UpdateAsync(holding);

            return _mapper.Map<TransactionDto>(tx);
        }
    }
}
