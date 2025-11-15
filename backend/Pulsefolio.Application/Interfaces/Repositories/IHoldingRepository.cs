using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface IHoldingRepository
    {
        Task AddAsync(Holding holding);
        Task<Holding?> GetByIdAsync(Guid id);
        Task<List<Holding>> GetByPortfolioIdAsync(Guid portfolioId);
        Task UpdateAsync(Holding holding);
    }
}
