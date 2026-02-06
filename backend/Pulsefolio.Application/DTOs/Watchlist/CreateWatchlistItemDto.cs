namespace Pulsefolio.Application.DTOs.Watchlist
{
    public class CreateWatchlistItemDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string Exchange { get; set; } = "NSE";
    }
}
