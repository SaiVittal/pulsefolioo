using Microsoft.EntityFrameworkCore;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly ApplicationDbContext _db;

        public PortfolioRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Portfolio portfolio)
        {
            await _db.Portfolios.AddAsync(portfolio);
            await _db.SaveChangesAsync();
        }

        public async Task<Portfolio?> GetByIdAsync(Guid id)
        {
            return await _db.Portfolios
                .Include(p => p.Holdings)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Portfolio>> GetByUserIdAsync(Guid userId)
        {
            return await _db.Portfolios
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task DeleteAsync(Portfolio portfolio)
        {
            _db.Portfolios.Remove(portfolio);
            await _db.SaveChangesAsync();
        }
    }
}
