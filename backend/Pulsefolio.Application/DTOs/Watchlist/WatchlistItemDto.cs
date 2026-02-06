namespace Pulsefolio.Application.DTOs.Watchlist
{
    public class WatchlistItemDto
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Exchange { get; set; } = string.Empty;
    }
}
