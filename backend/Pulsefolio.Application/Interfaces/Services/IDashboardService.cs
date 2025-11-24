using Pulsefolio.Application.DTOs.Dashboard;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardAsync(Guid portfolioId);
    }
}
