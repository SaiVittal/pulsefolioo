namespace Pulsefolio.Application.DTOs.Transaction
{
       public class TransactionDto
    {
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public Guid? HoldingId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // BUY / SELL
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
