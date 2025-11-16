using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class Transaction : BaseEntity
    {
        public Guid HoldingId { get; set; }
        public Holding? Holding { get; set; }

        public decimal Price { get; set; }
        public decimal Quantity { get; set; }

        public string Type { get; set; } = "BUY"; // BUY / SELL
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
