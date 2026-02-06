using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class Watchlist : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public ICollection<WatchlistItem> Items { get; set; } = new List<WatchlistItem>();
    }
}
