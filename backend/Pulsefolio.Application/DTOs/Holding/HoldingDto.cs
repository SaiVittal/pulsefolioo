namespace Pulsefolio.Application.DTOs.Holding
{
    public class HoldingDto
    {
        public Guid Id { get; set; }
        public string? Symbol { get; set; }
        public decimal Quantity { get; set; }
        public decimal AveragePrice { get; set; }
    }
}
