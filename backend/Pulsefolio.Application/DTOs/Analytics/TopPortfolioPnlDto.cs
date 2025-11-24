namespace Pulsefolio.Application.DTOs.Analytics
{
    public class TopPortfolioPnlDto
    {
        public Guid PortfolioId { get; set; }
        public string PortfolioName { get; set; } = "";
        public decimal TotalPnl { get; set; }
    }
}
