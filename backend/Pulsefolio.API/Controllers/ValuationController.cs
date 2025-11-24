using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.DTOs.Valuation;
using Pulsefolio.Application.Interfaces.Messaging;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Infrastructure.Messaging; // for IMessagePublisher

/// <summary>
/// Controller for handling valuation requests for portfolios.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ValuationController : ControllerBase
{
    private readonly IMessagePublisher _publisher;
    private readonly IValuationQueryService _valuationQuery;

    /// <summary>
    /// Initializes a new instance of the <see cref="ValuationController"/> class.
    /// </summary>
    /// <param name="publisher">The message publisher used to enqueue valuation requests.</param>
    /// <param name="valuationQuery">The service for querying valuation data.</param>
    public ValuationController(IMessagePublisher publisher, IValuationQueryService valuationQuery)
    {
        _publisher = publisher;
        _valuationQuery = valuationQuery;
    }

    /// <summary>
    /// Requests a valuation for the specified portfolio.
    /// </summary>
    /// <param name="portfolioId">The unique identifier of the portfolio to be valued.</param>
    /// <returns>An <see cref="AcceptedResult"/> containing the valuation request status.</returns>
    [Authorize]
    [HttpPost("{portfolioId:guid}/request")]
    public IActionResult RequestValuation([FromRoute] Guid portfolioId)
    {
        var userIdClaim = User.FindFirst("uid")?.Value;
        var userId = userIdClaim is null ? Guid.Empty : Guid.Parse(userIdClaim);

        var dto = new ValuationRequestDto
        {
            PortfolioId = portfolioId,
            RequestedBy = userId,
            RequestedAt = DateTime.UtcNow
        };

        _publisher.Publish("valuation.request", dto);
        return Accepted(new { message = "Valuation enqueued", portfolioId });
    }


        /// <summary>
    /// Gets latest valuation snapshot for a portfolio.
    /// </summary>
    [Authorize]
    [HttpGet("{portfolioId:guid}/latest")]
    public async Task<IActionResult> GetLatest(Guid portfolioId)
    {
        var result = await _valuationQuery.GetLatestAsync(portfolioId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    /// <summary>
    /// Gets valuation history for a portfolio (optionally filtered by date).
    /// </summary>
    [Authorize]
    [HttpGet("{portfolioId:guid}/history")]
    public async Task<IActionResult> GetHistory(
        Guid portfolioId,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var result = await _valuationQuery.GetHistoryAsync(portfolioId, from, to);
        return Ok(result);
    }

}
