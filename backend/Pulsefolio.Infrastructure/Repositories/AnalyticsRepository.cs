using Microsoft.EntityFrameworkCore;
using Pulsefolio.Application.DTOs.Analytics;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Data;

namespace Pulsefolio.Infrastructure.Repositories
{
    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly ApplicationDbContext _db;

        public AnalyticsRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<TopPortfolioPnlDto>> GetTop10PortfoliosAsync()
        {
            var result = await _db.Set<TopPortfolioPnlDto>()
                .FromSqlRaw("SELECT * FROM get_top10_portfolios_by_pnl()")
                .ToListAsync();

            return result;
        }
    }
}
