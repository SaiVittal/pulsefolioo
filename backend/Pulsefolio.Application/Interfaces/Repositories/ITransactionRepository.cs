using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface ITransactionRepository
    {
        Task AddAsync(Transaction transaction);
        Task<List<Transaction>> GetByHoldingIdAsync(Guid holdingId);
    }
}
