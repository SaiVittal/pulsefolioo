using Pulsefolio.Application.DTOs.Transaction;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface ITransactionService
    {
        Task AddAsync(Transaction txn);
        Task<Transaction?> GetByIdAsync(Guid id);
        Task<List<Transaction>> GetByPortfolioIdAsync(Guid portfolioId);
        Task<List<Transaction>> GetByHoldingIdAsync(Guid holdingId);

         Task<TransactionDto> BuyAsync(CreateBuyTransactionDto dto, Guid userId);
        Task<TransactionDto> SellAsync(CreateSellTransactionDto dto, Guid userId);
        Task<List<TransactionDto>> GetPortfolioTransactionsAsync(Guid portfolioId, Guid userId);
    }
}
