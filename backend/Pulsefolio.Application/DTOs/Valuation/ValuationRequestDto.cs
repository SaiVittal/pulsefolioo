namespace Pulsefolio.Application.DTOs.Valuation
{
    public class ValuationRequestDto
    {
        public Guid PortfolioId { get; set; }
        public Guid RequestedBy { get; set; }
        public DateTime RequestedAt { get; set; }
    }
}
