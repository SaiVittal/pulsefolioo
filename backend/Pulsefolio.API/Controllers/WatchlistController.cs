using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.DTOs.Watchlist;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireUser")]
    public class WatchlistController : ControllerBase
    {
        private readonly IWatchlistService _watchlistService;

        public WatchlistController(IWatchlistService watchlistService)
        {
            _watchlistService = watchlistService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateWatchlist([FromBody] CreateWatchlistDto dto)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _watchlistService.CreateWatchlistAsync(userId, dto);
            return Ok(result);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserWatchlists()
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _watchlistService.GetUserWatchlistsAsync(userId);
            return Ok(result);
        }

        [HttpDelete("{watchlistId:guid}")]
        public async Task<IActionResult> DeleteWatchlist(Guid watchlistId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            await _watchlistService.DeleteWatchlistAsync(watchlistId, userId);
            return NoContent();
        }

        [HttpPost("{watchlistId:guid}/items")]
        public async Task<IActionResult> AddItem(Guid watchlistId, [FromBody] CreateWatchlistItemDto dto)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _watchlistService.AddItemToWatchlistAsync(watchlistId, dto, userId);
            return Ok(result);
        }

        [HttpDelete("{watchlistId:guid}/items/{itemId:guid}")]
        public async Task<IActionResult> RemoveItem(Guid watchlistId, Guid itemId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            await _watchlistService.RemoveItemFromWatchlistAsync(watchlistId, itemId, userId);
            return NoContent();
        }
    }
}
