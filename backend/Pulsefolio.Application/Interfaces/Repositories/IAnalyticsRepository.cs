using Pulsefolio.Application.DTOs.Analytics;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface IAnalyticsRepository
    {
        Task<List<TopPortfolioPnlDto>> GetTop10PortfoliosAsync();
    }
}
