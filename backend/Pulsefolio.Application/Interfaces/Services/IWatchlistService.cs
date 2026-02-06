using Pulsefolio.Application.DTOs.Watchlist;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IWatchlistService
    {
        Task<WatchlistDto> CreateWatchlistAsync(Guid userId, CreateWatchlistDto dto);
        Task<List<WatchlistDto>> GetUserWatchlistsAsync(Guid userId);
        Task<WatchlistDto?> GetWatchlistByIdAsync(Guid watchlistId, Guid userId);
        Task DeleteWatchlistAsync(Guid watchlistId, Guid userId);
        Task<WatchlistItemDto> AddItemToWatchlistAsync(Guid watchlistId, CreateWatchlistItemDto dto, Guid userId);
        Task RemoveItemFromWatchlistAsync(Guid watchlistId, Guid itemId, Guid userId);
    }
}
