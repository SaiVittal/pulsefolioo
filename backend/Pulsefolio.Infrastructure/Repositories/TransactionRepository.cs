using Microsoft.EntityFrameworkCore;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDbContext _db;

        public TransactionRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Transaction tx)
        {
            await _db.Transactions.AddAsync(tx);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Transaction>> GetByHoldingIdAsync(Guid holdingId)
        {
            return await _db.Transactions
                .Where(t => t.HoldingId == holdingId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }
    }
}
