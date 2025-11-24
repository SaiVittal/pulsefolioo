namespace Pulsefolio.Application.DTOs.Dashboard
{
    public class DashboardDto
    {
        public Guid PortfolioId { get; set; }
        public required string Name { get; set; }

        public decimal TotalCurrentValue { get; set; }
        public decimal TotalCostBasis { get; set; }
        public decimal UnrealizedPnl { get; set; }
        public decimal RealizedPnl { get; set; }

        public DateTime? LastValuationAt { get; set; }
        public decimal? LastValuationValue { get; set; }

        public List<HoldingSummaryDto> TopHoldings { get; set; } = new();
        public List<RecentTransactionDto> RecentTransactions { get; set; } = new();
    }

    public class RecentTransactionDto
    {
        public required string Symbol { get; set; }
        public required string Type { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
