namespace Pulsefolio.Application.DTOs.Transaction
{
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public string? Type { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
