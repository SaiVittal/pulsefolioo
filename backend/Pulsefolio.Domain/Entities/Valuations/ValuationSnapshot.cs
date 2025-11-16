namespace Pulsefolio.Domain.Entities.Valuations
{
    public class ValuationSnapshot
    {
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal TotalValue { get; set; }

        // JSON blob storing per-holding details (symbol, qty, price, value, etc.)
        // Use JSONB in Postgres via a string property + EF mapping to jsonb if desired.
        public string HoldingsJson { get; set; } = null!;
    }
}
