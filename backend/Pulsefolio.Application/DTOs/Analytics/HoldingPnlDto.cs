namespace Pulsefolio.Application.DTOs
{
    public class HoldingPnlDto
    {
        public string Symbol { get; set; } = "";
        public decimal Quantity { get; set; }
        public decimal AvgCost { get; set; }
        public decimal CurrentPrice { get; set; }

        public decimal CostBasis => AvgCost * Quantity;
        public decimal CurrentValue => CurrentPrice * Quantity;
        public decimal UnrealizedPnl => CurrentValue - CostBasis;

        public decimal RealizedPnl { get; set; }
        public decimal AllocationPercent { get; set; }
    }
}
