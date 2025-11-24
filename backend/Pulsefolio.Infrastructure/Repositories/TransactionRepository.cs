using Microsoft.EntityFrameworkCore;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _db;
        public TransactionRepository(ApplicationDbContext db) => _db = db;

        public async Task AddAsync(Transaction txn)
        {
            await _db.Transactions.AddAsync(txn);
            await _db.SaveChangesAsync();
        }

        public Task<Transaction?> GetByIdAsync(Guid id)
        {
            return _db.Transactions.FindAsync(id).AsTask();
        }

        public Task<List<Transaction>> GetByPortfolioIdAsync(Guid portfolioId)
        {
            return _db.Transactions
                .Where(t => t.PortfolioId == portfolioId)
                .OrderBy(t => t.Timestamp)
                .ToListAsync();
        }

        public Task<List<Transaction>> GetByHoldingIdAsync(Guid holdingId)
        {
            return _db.Transactions
                .Where(t => t.HoldingId == holdingId)
                .OrderBy(t => t.Timestamp)
                .ToListAsync();
        }
    }
}
