using Pulsefolio.Application.DTOs;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IPortfolioAnalyticsService
    {
        Task<PortfolioPnlDto> ComputePortfolioPnlAsync(Guid portfolioId);
    }
}
