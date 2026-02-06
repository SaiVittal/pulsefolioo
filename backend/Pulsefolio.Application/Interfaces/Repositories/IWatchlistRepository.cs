using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface IWatchlistRepository
    {
        Task<Watchlist?> GetByIdAsync(Guid id);
        Task<List<Watchlist>> GetByUserIdAsync(Guid userId);
        Task AddAsync(Watchlist watchlist);
        Task UpdateAsync(Watchlist watchlist);
        Task DeleteAsync(Watchlist watchlist);
    }
}
