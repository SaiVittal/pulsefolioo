using Pulsefolio.Application.DTOs.Analytics;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IAnalyticsService
    {
        Task<List<TopPortfolioPnlDto>> GetTop10Async();
    }
}
