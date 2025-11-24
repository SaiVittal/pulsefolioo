using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class Transaction : BaseEntity
    {
        public Guid PortfolioId { get; set; }
        public Guid? HoldingId { get; set; }      // optional link to holding
        public string Symbol { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "BUY" or "SELL"
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
