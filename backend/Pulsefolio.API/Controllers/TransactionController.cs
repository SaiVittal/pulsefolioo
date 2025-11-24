using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.DTOs.Transaction;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Handles trade operations (buy/sell) and transaction history.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _txService;

        /// <summary>
        /// Initializes a new instance of the <see cref="TransactionsController"/> class.
        /// </summary>
        /// <param name="txService">The transaction service used to handle transaction operations and queries.</param>
        public TransactionsController(ITransactionService txService)
        {
            _txService = txService;
        }

        /// <summary>
        /// Places a BUY order and records transaction + adjusts holdings.
        /// </summary>
        [HttpPost("buy")]
        public async Task<IActionResult> Buy([FromBody] CreateBuyTransactionDto dto)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _txService.BuyAsync(dto, userId);
            return Ok(result);
        }

        /// <summary>
        /// Places a SELL order and records transaction + adjusts holdings.
        /// </summary>
        [HttpPost("sell")]
        public async Task<IActionResult> Sell([FromBody] CreateSellTransactionDto dto)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _txService.SellAsync(dto, userId);
            return Ok(result);
        }

        /// <summary>
        /// Gets transaction history for a portfolio.
        /// </summary>
        [HttpGet("portfolio/{portfolioId:guid}")]
        public async Task<IActionResult> GetByPortfolio(Guid portfolioId)
        {
            var userId = Guid.Parse(User.FindFirst("uid")!.Value);
            var result = await _txService.GetPortfolioTransactionsAsync(portfolioId, userId);
            return Ok(result);
        }
    }
}
