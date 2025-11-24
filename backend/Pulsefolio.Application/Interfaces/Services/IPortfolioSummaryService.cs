using Pulsefolio.Application.DTOs;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IPortfolioSummaryService
    {
        Task<PortfolioSummaryDto> GetSummaryAsync(Guid portfolioId);
    }
}
