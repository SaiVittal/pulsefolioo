using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Provides market data endpoints including indices, trending stocks, and search.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class MarketController : ControllerBase
    {
        private readonly IMarketDataProvider _marketData;

        /// <summary>
        /// Initializes a new instance of the <see cref="MarketController"/> class.
        /// </summary>
        /// <param name="marketData">The market data provider service.</param>
        public MarketController(IMarketDataProvider marketData)
        {
            _marketData = marketData;
        }

        /// <summary>
        /// Gets current prices for major market indices.
        /// </summary>
        /// <returns>Market index data including S&P 500, NASDAQ, and DOW.</returns>
        [HttpGet("indices")]
        public async Task<IActionResult> GetIndices()
        {
            // Using ETFs that track the major indices
            var symbols = new[] { "SPY", "QQQ", "DIA" }; // S&P 500, NASDAQ, DOW
            var indices = new List<MarketIndexDto>();

            foreach (var symbol in symbols)
            {
                try
                {
                    var price = await _marketData.GetPriceAsync(symbol);
                    indices.Add(new MarketIndexDto
                    {
                        Symbol = symbol,
                        Name = GetIndexName(symbol),
                        Price = price,
                        Change = GetMockChange(), // Real change data would require historical data
                        ChangePercent = GetMockChangePercent()
                    });
                }
                catch
                {
                    // If price fetch fails, add with placeholder data
                    indices.Add(new MarketIndexDto
                    {
                        Symbol = symbol,
                        Name = GetIndexName(symbol),
                        Price = 0,
                        Change = 0,
                        ChangePercent = 0
                    });
                }
            }

            return Ok(indices);
        }

        /// <summary>
        /// Gets trending/popular stocks.
        /// </summary>
        /// <returns>List of trending stocks with current prices.</returns>
        [HttpGet("trending")]
        public async Task<IActionResult> GetTrending()
        {
            // Popular tech/growth stocks
            var symbols = new[] { "NVDA", "AMD", "INTC", "AAPL", "MSFT", "GOOGL" };
            var trending = new List<TrendingStockDto>();

            foreach (var symbol in symbols)
            {
                try
                {
                    var price = await _marketData.GetPriceAsync(symbol);
                    trending.Add(new TrendingStockDto
                    {
                        Symbol = symbol,
                        Name = GetCompanyName(symbol),
                        Price = price,
                        ChangePercent = GetMockChangePercent()
                    });
                }
                catch
                {
                    // Skip failed fetches
                }
            }

            return Ok(trending);
        }

        /// <summary>
        /// Searches for stocks by symbol or name.
        /// </summary>
        /// <param name="q">Search query.</param>
        /// <returns>Matching stock symbols.</returns>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new List<StockSearchResultDto>());

            // Simple in-memory search (in production, this would call AlphaVantage SYMBOL_SEARCH)
            var knownStocks = new Dictionary<string, string>
            {
                { "AAPL", "Apple Inc" },
                { "MSFT", "Microsoft Corporation" },
                { "GOOGL", "Alphabet Inc" },
                { "AMZN", "Amazon.com Inc" },
                { "NVDA", "NVIDIA Corporation" },
                { "META", "Meta Platforms Inc" },
                { "TSLA", "Tesla Inc" },
                { "AMD", "Advanced Micro Devices Inc" },
                { "INTC", "Intel Corporation" },
                { "NFLX", "Netflix Inc" }
            };

            var results = knownStocks
                .Where(kv => kv.Key.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                             kv.Value.Contains(q, StringComparison.OrdinalIgnoreCase))
                .Take(10)
                .Select(kv => new StockSearchResultDto
                {
                    Symbol = kv.Key,
                    Name = kv.Value
                })
                .ToList();

            return Ok(results);
        }

        /// <summary>
        /// Gets the current price for a specific symbol.
        /// </summary>
        /// <param name="symbol">Stock symbol.</param>
        /// <returns>Current price data.</returns>
        [HttpGet("quote/{symbol}")]
        public async Task<IActionResult> GetQuote(string symbol)
        {
            try
            {
                var price = await _marketData.GetPriceAsync(symbol.ToUpperInvariant());
                return Ok(new QuoteDto
                {
                    Symbol = symbol.ToUpperInvariant(),
                    Price = price,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        #region Helper Methods

        private static string GetIndexName(string symbol) => symbol switch
        {
            "SPY" => "S&P 500",
            "QQQ" => "NASDAQ",
            "DIA" => "DOW JONES",
            _ => symbol
        };

        private static string GetCompanyName(string symbol) => symbol switch
        {
            "NVDA" => "NVIDIA Corp",
            "AMD" => "Adv Micro Dev",
            "INTC" => "Intel Corp",
            "AAPL" => "Apple Inc",
            "MSFT" => "Microsoft",
            "GOOGL" => "Alphabet",
            _ => symbol
        };

        private static decimal GetMockChange() => (decimal)(new Random().NextDouble() * 20 - 10);
        private static decimal GetMockChangePercent() => Math.Round((decimal)(new Random().NextDouble() * 4 - 2), 2);

        #endregion
    }

    #region DTOs

    /// <summary>
    /// Market index data transfer object.
    /// </summary>
    public class MarketIndexDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Change { get; set; }
        public decimal ChangePercent { get; set; }
    }

    /// <summary>
    /// Trending stock data transfer object.
    /// </summary>
    public class TrendingStockDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal ChangePercent { get; set; }
    }

    /// <summary>
    /// Stock search result data transfer object.
    /// </summary>
    public class StockSearchResultDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    /// <summary>
    /// Stock quote data transfer object.
    /// </summary>
    public class QuoteDto
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime Timestamp { get; set; }
    }

    #endregion
}
