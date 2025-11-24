namespace Pulsefolio.Application.DTOs
{
    public class HoldingSummaryDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal CurrentValue { get; set; }
        public decimal AllocationPercent { get; set; }
    }

    public class PortfolioSummaryDto
    {
        public Guid PortfolioId { get; set; }
        public string Name { get; set; } = string.Empty;

        public decimal TotalCurrentValue { get; set; }
        public decimal TotalCostBasis { get; set; }
        public decimal UnrealizedPnl { get; set; }
        public decimal RealizedPnl { get; set; }

        public DateTime? LastValuationAt { get; set; }

        public List<HoldingSummaryDto> TopHoldings { get; set; } = new();
    }
}
