using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.DTOs.Valuation;
using Pulsefolio.Application.Interfaces.Messaging;
using Pulsefolio.Infrastructure.Messaging; // for IMessagePublisher

/// <summary>
/// Controller for handling valuation requests for portfolios.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ValuationController : ControllerBase
{
    private readonly IMessagePublisher _publisher;
    /// <summary>
    /// Initializes a new instance of the <see cref="ValuationController"/> class.
    /// </summary>
    /// <param name="publisher">The message publisher used to enqueue valuation requests.</param>
    public ValuationController(IMessagePublisher publisher) => _publisher = publisher;

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
}
