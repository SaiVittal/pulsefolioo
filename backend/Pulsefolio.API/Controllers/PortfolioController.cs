using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.DTOs.Portfolio;
using System.Security.Claims;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Handles all portfolio-related operations including creation, retrieval, and deletion.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireUser")]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;
        private readonly IPortfolioAnalyticsService _analytics;
        private readonly IPortfolioSummaryService _summary;
        /// <summary>
        /// Initializes a new instance of the <see cref="PortfolioController"/> class.
        /// </summary>
        /// <param name="portfolioService">The portfolio service dependency.</param>
        /// <param name="analytics">The portfolio analytics service dependency.</param>
        /// <param name="summary">The portfolio summary service dependency.</param>

        public PortfolioController(IPortfolioService portfolioService, IPortfolioAnalyticsService analytics, IPortfolioSummaryService summary)
        {
            _portfolioService = portfolioService;
            _analytics = analytics;
             _summary = summary;
        }

        /// <summary>
        /// Creates a new portfolio for the authenticated user.
        /// </summary>
        /// <param name="dto">Portfolio creation details.</param>
        /// <returns>The created portfolio.</returns>
        /// <response code="200">Returns the created portfolio.</response>
        /// <response code="400">If validation fails.</response>
        [HttpPost]
        public async Task<IActionResult> CreatePortfolio([FromBody] CreatePortfolioDto dto)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);

            var result = await _portfolioService.CreateAsync(userId, dto);

            return Ok(result);
        }

        /// <summary>
        /// Retrieves all portfolios owned by the authenticated user.
        /// </summary>
        /// <returns>A list of portfolios.</returns>
        [HttpGet("user")]
        public async Task<IActionResult> GetUserPortfolios()
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _portfolioService.GetUserPortfoliosAsync(userId);

            return Ok(result);
        }

        /// <summary>
        /// Deletes a portfolio owned by the authenticated user.
        /// </summary>
        /// <param name="portfolioId">The portfolio identifier.</param>
        /// <returns>No content.</returns>
        /// <response code="204">Successfully deleted.</response>
        /// <response code="404">If portfolio does not exist or access denied.</response>
        [HttpDelete("{portfolioId:guid}")]
        public async Task<IActionResult> DeletePortfolio(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);

            await _portfolioService.DeleteAsync(portfolioId, userId);

            return NoContent();
        }

        /// <summary>
        /// Returns portfolio PNL snapshot (unrealized + realized + allocations)
        /// </summary>
        [HttpGet("{portfolioId:guid}/pnl")]
        public async Task<IActionResult> GetPortfolioPnl(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);

            // Optional ownership check
            var userPortfolios = await _portfolioService.GetUserPortfoliosAsync(userId);
            if (!userPortfolios.Any(p => p.Id == portfolioId))
                return Forbid();

            var result = await _analytics.ComputePortfolioPnlAsync(portfolioId);
            return Ok(result);
        }

        /// <summary>
        /// Returns a high-level summary of the portfolio (PNL + allocations + last valuation).
        /// </summary>
        [HttpGet("{portfolioId:guid}/summary")]
        public async Task<IActionResult> GetSummary(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var userPortfolios = await _portfolioService.GetUserPortfoliosAsync(userId);

            if (!userPortfolios.Any(p => p.Id == portfolioId))
                return Forbid();

            var result = await _summary.GetSummaryAsync(portfolioId);
            return Ok(result);
        }



    }
}
