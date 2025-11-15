namespace Pulsefolio.Application.DTOs.Holding
{
    public class CreateHoldingDto
    {
        public Guid PortfolioId { get; set; }
        public string? Symbol { get; set; }
        public decimal Quantity { get; set; }
        public decimal BuyPrice { get; set; }
    }
}
