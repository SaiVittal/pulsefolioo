namespace Pulsefolio.Application.DTOs.Watchlist
{
    public class WatchlistDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<WatchlistItemDto> Items { get; set; } = new();
    }
}
