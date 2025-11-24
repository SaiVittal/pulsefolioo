namespace Pulsefolio.Application.DTOs.Transaction
{
    public class CreateBuyTransactionDto
    {
    public Guid PortfolioId { get; set; }
        public Guid? HoldingId { get; set; } // optional
        public string Symbol { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime? Timestamp { get; set; }
    }

       public class CreateSellTransactionDto
    {
        public Guid PortfolioId { get; set; }
        public Guid? HoldingId { get; set; } // optional
        public string Symbol { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime? Timestamp { get; set; }
    }
}
