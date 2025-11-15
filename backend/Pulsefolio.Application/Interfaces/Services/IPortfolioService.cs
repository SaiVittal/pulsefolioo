using Pulsefolio.Application.DTOs.Portfolio;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IPortfolioService
    {
        Task<PortfolioDto> CreateAsync(Guid userId, CreatePortfolioDto dto);
        Task<List<PortfolioDto>> GetUserPortfoliosAsync(Guid userId);
        Task DeleteAsync(Guid portfolioId, Guid userId);
    }
}
