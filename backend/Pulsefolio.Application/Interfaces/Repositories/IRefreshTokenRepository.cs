using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken token);
        Task<RefreshToken?> GetValidTokenAsync(Guid userId, string token);
        Task InvalidateTokensAsync(Guid userId);
        Task<RefreshToken?> GetByTokenAsync(string token);

        Task UpdateAsync(RefreshToken token);

    }
}
