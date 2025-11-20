using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.DTOs.Holding;
using System.Security.Claims;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Handles operations related to individual portfolio holdings.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HoldingController : ControllerBase
    {
        private readonly IHoldingService _holdingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="HoldingController"/> class.
        /// </summary>
        /// <param name="holdingService">The holding service dependency.</param>
        public HoldingController(IHoldingService holdingService)
        {
            _holdingService = holdingService;
        }

        /// <summary>
        /// Adds a new holding to a user's portfolio.
        /// </summary>
        /// <param name="dto">The holding creation details.</param>
        /// <returns>The created holding.</returns>
        /// <response code="200">Returns the created holding.</response>
        /// <response code="404">Portfolio not found or access denied.</response>
        [HttpPost]
        public async Task<IActionResult> CreateHolding([FromBody] CreateHoldingDto dto)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);

            var result = await _holdingService.CreateAsync(dto, userId);

            return Ok(result);
        }

        /// <summary>
        /// Retrieves all holdings belonging to a specific portfolio.
        /// </summary>
        /// <param name="portfolioId">The portfolio identifier.</param>
        /// <returns>A list of holdings.</returns>
        /// <response code="200">Returns list of holdings.</response>
        /// <response code="404">Portfolio not found or access denied.</response>
        [HttpGet("portfolio/{portfolioId:guid}")]
        public async Task<IActionResult> GetPortfolioHoldings(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);

            var result = await _holdingService.GetHoldingsAsync(portfolioId, userId);

            return Ok(result);
        }
    }
}
