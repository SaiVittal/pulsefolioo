using Microsoft.EntityFrameworkCore;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class WatchlistRepository : IWatchlistRepository
    {
        private readonly ApplicationDbContext _context;

        public WatchlistRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Watchlist?> GetByIdAsync(Guid id)
        {
            return await _context.Watchlists
                .Include(w => w.Items)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<List<Watchlist>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Watchlists
                .Include(w => w.Items)
                .Where(w => w.UserId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(Watchlist watchlist)
        {
            await _context.Watchlists.AddAsync(watchlist);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Watchlist watchlist)
        {
            _context.Watchlists.Update(watchlist);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Watchlist watchlist)
        {
            _context.Watchlists.Remove(watchlist);
            await _context.SaveChangesAsync();
        }
    }
}
