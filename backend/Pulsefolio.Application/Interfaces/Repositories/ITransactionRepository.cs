using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface ITransactionRepository
    {
        Task AddAsync(Transaction txn);
        Task<Transaction?> GetByIdAsync(Guid id);

        Task<List<Transaction>> GetByPortfolioIdAsync(Guid portfolioId);
        Task<List<Transaction>> GetByHoldingIdAsync(Guid holdingId);
    }
}
