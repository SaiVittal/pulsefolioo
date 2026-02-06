using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class WatchlistItem : BaseEntity
    {
        public Guid WatchlistId { get; set; }
        public Watchlist? Watchlist { get; set; }

        public string Symbol { get; set; } = string.Empty;
        public string Exchange { get; set; } = string.Empty; // e.g., NSE, BSE
    }
}
