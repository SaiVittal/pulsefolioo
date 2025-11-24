using Pulsefolio.Application.DTOs.Analytics;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IAnalyticsRepository _repo;

        public AnalyticsService(IAnalyticsRepository repo)
        {
            _repo = repo;
        }

        public Task<List<TopPortfolioPnlDto>> GetTop10Async()
            => _repo.GetTop10PortfoliosAsync();
    }
}
