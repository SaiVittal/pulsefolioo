using Microsoft.EntityFrameworkCore;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _db;

        public RefreshTokenRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(RefreshToken token)
        {
            await _db.RefreshTokens.AddAsync(token);
            await _db.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetValidTokenAsync(Guid userId, string token)
        {
            return await _db.RefreshTokens
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId &&
                    r.Token == token &&
                    r.ExpiresAt > DateTime.UtcNow &&
                    !r.IsRevoked);
        }

        public async Task InvalidateTokensAsync(Guid userId)
        {
            var tokens = await _db.RefreshTokens
                .Where(r => r.UserId == userId)
                .ToListAsync();

            tokens.ForEach(t => t.IsRevoked = true);

            await _db.SaveChangesAsync();
        }
    }
}
