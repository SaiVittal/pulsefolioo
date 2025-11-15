using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface IPortfolioRepository
    {
        Task AddAsync(Portfolio portfolio);
        Task<Portfolio?> GetByIdAsync(Guid id);
        Task<List<Portfolio>> GetByUserIdAsync(Guid userId);
        Task DeleteAsync(Portfolio portfolio);
    }
}
