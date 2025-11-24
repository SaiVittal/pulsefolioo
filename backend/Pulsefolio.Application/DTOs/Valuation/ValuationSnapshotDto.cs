namespace Pulsefolio.Application.DTOs
{
    public class ValuationSnapshotDto
    {
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public decimal TotalValue { get; set; }
        public string HoldingsJson { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
