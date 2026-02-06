using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.API.Controllers
{
     /// <summary>
    /// Provides dashboard endpoints for retrieving portfolio summaries.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireUser")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly IDashboardAggregationService _dashboardAggService;

        private readonly IPortfolioService _portfolios;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardController"/> class.
        /// </summary>
        /// <param name="dashboardService">The dashboard service used to retrieve portfolio summaries.</param>
        /// <param name="dashboardAggService">The dashboard aggregation service used to retrieve full dashboard summaries.</param>
        /// <param name="portfolios">The portfolio service used to manage user portfolios.</param>
        public DashboardController(
            IDashboardService dashboardService,
            IDashboardAggregationService dashboardAggService,
            IPortfolioService portfolios)
        {
            _dashboardService = dashboardService;
            _dashboardAggService = dashboardAggService;
            _portfolios = portfolios;
        }

        /// <summary>
        /// Retrieves the dashboard summary for a specific portfolio.
        /// </summary>
        /// <param name="portfolioId">The unique identifier of the portfolio.</param>
        /// <returns>An <see cref="IActionResult"/> containing the dashboard summary.</returns>
        [HttpGet("{portfolioId:guid}")]
        public async Task<IActionResult> GetDashboard(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);

            var userPortfolios = await _portfolios.GetUserPortfoliosAsync(userId);
            if (!userPortfolios.Any(p => p.Id == portfolioId))
                return Forbid();

            var result = await _dashboardService.GetDashboardAsync(portfolioId);

            return Ok(result);
        }

         /// <summary>
        /// Retrieves the dashboard summary for a specific portfolio.
        /// </summary>
        /// <param name="portfolioId">The unique identifier of the portfolio.</param>
        /// <returns>An <see cref="IActionResult"/> containing the full dashboard summary.</returns>

         [HttpGet("{portfolioId}/full")]
        public async Task<IActionResult> GetFullDashboard(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("sub")!.Value);

            var result = await _dashboardAggService.GetFullDashboardAsync(portfolioId, userId);

            return Ok(result);
        }
    }
}
