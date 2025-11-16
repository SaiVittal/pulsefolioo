namespace Pulsefolio.Application.DTOs.Valuation
{
    public class ValuationRequestDto
    {
        public Guid PortfolioId { get; set; }
        public Guid RequestedBy { get; set; } // optional: user id
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}
