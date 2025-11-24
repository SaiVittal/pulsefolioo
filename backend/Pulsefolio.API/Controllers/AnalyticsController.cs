using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Provides analytics endpoints for retrieving portfolio performance data.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analytics;

        /// <summary>
        /// Initializes a new instance of the <see cref="AnalyticsController"/> class.
        /// </summary>
        /// <param name="analytics">The analytics service used to retrieve portfolio analytics.</param>
        public AnalyticsController(IAnalyticsService analytics)
        {
            _analytics = analytics;
        }

        /// <summary>
        /// Retrieves the top 10 portfolio positions by profit and loss.
        /// </summary>
        /// <returns>An <see cref="IActionResult"/> containing the top 10 PnL results.</returns>
        [HttpGet("top10")]
        public async Task<IActionResult> GetTop10Pnl()
        {
            var result = await _analytics.GetTop10Async();
            return Ok(result);
        }
    }
}
