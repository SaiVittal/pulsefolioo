namespace Pulsefolio.Application.DTOs
{
    public class PortfolioPnlDto
    {
        public Guid PortfolioId { get; set; }
        public List<HoldingPnlDto> Holdings { get; set; } = new();

        public decimal TotalCurrentValue { get; set; }
        public decimal TotalCostBasis { get; set; }
        public decimal UnrealizedPnl { get; set; }
        public decimal RealizedPnl { get; set; }
    }
}
