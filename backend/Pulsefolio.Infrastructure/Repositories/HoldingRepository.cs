using Microsoft.EntityFrameworkCore;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class HoldingRepository : IHoldingRepository
    {
        private readonly ApplicationDbContext _db;

        public HoldingRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Holding holding)
        {
            await _db.Holdings.AddAsync(holding);
            await _db.SaveChangesAsync();
        }
        
        public async Task<Holding?> GetByIdAsync(Guid id)
        {
            return await _db.Holdings.FindAsync(id);
        }

        public async Task<List<Holding>> GetByPortfolioIdAsync(Guid portfolioId)
        {
            return await _db.Holdings
                .Where(h => h.PortfolioId == portfolioId)
                .ToListAsync();
        }

        public async Task UpdateAsync(Holding holding)
        {
            _db.Holdings.Update(holding);
            await _db.SaveChangesAsync();
        }
    }
}
