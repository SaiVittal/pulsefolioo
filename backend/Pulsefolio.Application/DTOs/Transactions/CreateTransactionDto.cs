namespace Pulsefolio.Application.DTOs.Transaction
{
    public class CreateTransactionDto
    {
        public Guid HoldingId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public string? Type { get; set; } // BUY / SELL
    }
}
