using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class Holding : BaseEntity
    {
        public Guid PortfolioId { get; set; }
        public Portfolio? Portfolio { get; set; }

        public string Symbol { get; set; } = string.Empty; // e.g., AAPL
        public decimal Quantity { get; set; }
        public decimal AveragePrice { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
