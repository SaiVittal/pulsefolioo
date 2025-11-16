using Microsoft.EntityFrameworkCore;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Domain.Entities.Valuations;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class ValuationSnapshotRepository : IValuationSnapshotRepository
    {
        private readonly ApplicationDbContext _db;
        public ValuationSnapshotRepository(ApplicationDbContext db) => _db = db;

        public async Task AddAsync(ValuationSnapshot snapshot)
        {
            _db.ValuationSnapshots.Add(snapshot);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ValuationSnapshot>> GetHistoryAsync(Guid portfolioId, DateTime? from = null, DateTime? to = null)
        {
            var q = _db.ValuationSnapshots.Where(v => v.PortfolioId == portfolioId);
            if (from.HasValue) q = q.Where(v => v.CreatedAt >= from.Value);
            if (to.HasValue) q = q.Where(v => v.CreatedAt <= to.Value);
            return await q.OrderByDescending(v => v.CreatedAt).ToListAsync();
        }

        public async Task<ValuationSnapshot?> GetLatestAsync(Guid portfolioId)
        {
            return await _db.ValuationSnapshots
                            .Where(v => v.PortfolioId == portfolioId)
                            .OrderByDescending(v => v.CreatedAt)
                            .FirstOrDefaultAsync();
        }
    }
}
