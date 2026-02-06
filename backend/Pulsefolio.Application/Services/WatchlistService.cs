using AutoMapper;
using Pulsefolio.Application.DTOs.Watchlist;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.Common.Exceptions;

namespace Pulsefolio.Application.Services
{
    public class WatchlistService : IWatchlistService
    {
        private readonly IWatchlistRepository _watchlistRepo;
        private readonly IMapper _mapper;

        public WatchlistService(IWatchlistRepository watchlistRepo, IMapper mapper)
        {
            _watchlistRepo = watchlistRepo;
            _mapper = mapper;
        }

        public async Task<WatchlistDto> CreateWatchlistAsync(Guid userId, CreateWatchlistDto dto)
        {
            var watchlist = new Watchlist
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow
            };

            await _watchlistRepo.AddAsync(watchlist);
            return _mapper.Map<WatchlistDto>(watchlist);
        }

        public async Task<List<WatchlistDto>> GetUserWatchlistsAsync(Guid userId)
        {
            var watchlists = await _watchlistRepo.GetByUserIdAsync(userId);
            return _mapper.Map<List<WatchlistDto>>(watchlists);
        }

        public async Task<WatchlistDto?> GetWatchlistByIdAsync(Guid watchlistId, Guid userId)
        {
            var watchlist = await _watchlistRepo.GetByIdAsync(watchlistId);
            if (watchlist == null || watchlist.UserId != userId)
                return null;

            return _mapper.Map<WatchlistDto>(watchlist);
        }

        public async Task DeleteWatchlistAsync(Guid watchlistId, Guid userId)
        {
            var watchlist = await _watchlistRepo.GetByIdAsync(watchlistId);
             if (watchlist == null)
                throw new NotFoundException("Watchlist not found.");

            if (watchlist.UserId != userId)
                throw new NotFoundException("Watchlist not found or access denied.");

            await _watchlistRepo.DeleteAsync(watchlist);
        }

        public async Task<WatchlistItemDto> AddItemToWatchlistAsync(Guid watchlistId, CreateWatchlistItemDto dto, Guid userId)
        {
            var watchlist = await _watchlistRepo.GetByIdAsync(watchlistId);
             if (watchlist == null)
                throw new NotFoundException("Watchlist not found.");
            
            if (watchlist.UserId != userId)
                throw new NotFoundException("Watchlist not found or access denied.");

            if (watchlist.Items.Any(i => i.Symbol == dto.Symbol && i.Exchange == dto.Exchange))
                 throw new Exception("Item already in watchlist");

            var item = new WatchlistItem
            {
                Id = Guid.NewGuid(),
                WatchlistId = watchlistId,
                Symbol = dto.Symbol.ToUpper(),
                Exchange = dto.Exchange.ToUpper(),
                CreatedAt = DateTime.UtcNow
            };

            watchlist.Items.Add(item);
            await _watchlistRepo.UpdateAsync(watchlist);

            return _mapper.Map<WatchlistItemDto>(item);
        }

        public async Task RemoveItemFromWatchlistAsync(Guid watchlistId, Guid itemId, Guid userId)
        {
             var watchlist = await _watchlistRepo.GetByIdAsync(watchlistId);
             if (watchlist == null)
                throw new NotFoundException("Watchlist not found.");
            
            if (watchlist.UserId != userId)
                 throw new NotFoundException("Watchlist not found or access denied.");

            var item = watchlist.Items.FirstOrDefault(i => i.Id == itemId);
            if (item != null)
            {
                watchlist.Items.Remove(item);
                await _watchlistRepo.UpdateAsync(watchlist);
            }
        }
    }
}
