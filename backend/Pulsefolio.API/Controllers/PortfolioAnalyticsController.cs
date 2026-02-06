using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Controller for portfolio analytics operations including PNL computations.
    /// </summary>
    [ApiController]
    [Route("api/pnl")]
    public class PortfolioAnalyticsController : ControllerBase
    {
        private readonly IPortfolioAnalyticsService _analytics;

        /// <summary>
        /// Initializes a new instance of the <see cref="PortfolioAnalyticsController"/> class.
        /// </summary>
        /// <param name="analytics">The portfolio analytics service.</param>
        public PortfolioAnalyticsController(IPortfolioAnalyticsService analytics)
        {
            _analytics = analytics;
        }

        /// <summary>
        /// Gets the profit and loss (PNL) analysis for a specific portfolio.
        /// </summary>
        /// <param name="portfolioId">The unique identifier of the portfolio.</param>
        /// <returns>An IActionResult containing the portfolio PNL data.</returns>
        [Authorize(Policy = "RequireUser")]
        [HttpGet("{portfolioId}")]
        public async Task<IActionResult> Get(Guid portfolioId)
        {
            var result = await _analytics.ComputePortfolioPnlAsync(portfolioId);
            return Ok(result);
        }
    }
}
