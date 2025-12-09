using System;
using System.Threading.Tasks;
using Pulsefolio.Application.Models.Dashboard;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IDashboardAggregationService
    {
        Task<DashboardFullResponse> GetFullDashboardAsync(Guid portfolioId, Guid userId);
    }
}
