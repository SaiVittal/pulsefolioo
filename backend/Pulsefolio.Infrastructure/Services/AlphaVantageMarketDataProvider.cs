using System.Net.Http;
using System.Net;
using System.Text.Json;
using System.Threading;
using Pulsefolio.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace Pulsefolio.Infrastructure.Services
{
    public class AlphaVantageMarketDataProvider : IMarketDataProvider
    {
        private readonly HttpClient _http;
        private readonly IPriceCacheService _cache;
        private readonly IConfiguration _cfg;
        private readonly IMarketDataProvider _fallback; // fake provider fallback
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly TimeSpan _cacheTtl;

        public AlphaVantageMarketDataProvider(
            IHttpClientFactory httpFactory,
            IPriceCacheService cache,
            IConfiguration cfg,
            IMarketDataProvider fallback)
        {
            _http = httpFactory.CreateClient("AlphaVantageClient");
            _cache = cache;
            _cfg = cfg;
            _fallback = fallback;
            _apiKey = cfg["AlphaVantage:ApiKey"] ?? "";
            _baseUrl = cfg["AlphaVantage:BaseUrl"] ?? "https://www.alphavantage.co";
            _cacheTtl = TimeSpan.FromSeconds(int.TryParse(cfg["Redis:PriceTtlSeconds"], out var s) ? s : 30);
        }

        public async Task<decimal> GetPriceAsync(string symbol)
        {
            // check cache first
            var cached = await _cache.GetCachedPriceAsync(symbol);
            if (cached.HasValue)
            {
                Console.WriteLine($"[AV CACHE-HIT] {symbol} = {cached.Value}");
                return cached.Value;
            }

            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                Console.WriteLine("[ALPHAVANTAGE] No API key configured, using fallback");
                return await _fallback.GetPriceAsync(symbol);
            }

            // build request
            var url = $"{_baseUrl}/query?function=GLOBAL_QUOTE&symbol={WebUtility.UrlEncode(symbol)}&apikey={_apiKey}";

            // simple retry loop with incremental backoff (no external libs)
            int maxRetries = 3;
            int delayMs = 500;
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                    var resp = await _http.GetAsync(url, cts.Token);
                    if (resp.IsSuccessStatusCode)
                    {
                        var payload = await resp.Content.ReadAsStringAsync(cts.Token);
                        using var doc = JsonDocument.Parse(payload);

                        if (doc.RootElement.TryGetProperty("Global Quote", out var quote) ||
                            doc.RootElement.TryGetProperty("Global_Quote", out quote))
                        {
                            if (quote.TryGetProperty("05. price", out var priceElem) ||
                                quote.TryGetProperty("05 price", out priceElem))
                            {
                                var priceStr = priceElem.GetString() ?? priceElem.ToString();
                                if (decimal.TryParse(priceStr, out var price))
                                {
                                    await _cache.SetCachedPriceAsync(symbol, price);
                                    Console.WriteLine($"[AV] Fetched {symbol} = {price}");
                                    return price;
                                }
                            }
                        }

                        // API can respond with note or error when rate limited
                        if (doc.RootElement.TryGetProperty("Note", out var note))
                        {
                            Console.WriteLine("[ALPHAVANTAGE] Rate limit or warning: " + note.GetString());
                            break; // fallback
                        }
                        if (doc.RootElement.TryGetProperty("Error Message", out var err))
                        {
                            Console.WriteLine("[ALPHAVANTAGE] Error: " + err.GetString());
                            break; // fallback
                        }
                    }
                    else if ((int)resp.StatusCode == 429)
                    {
                        Console.WriteLine("[ALPHAVANTAGE] HTTP 429 Rate limit");
                        break;
                    }
                    else
                    {
                        Console.WriteLine($"[ALPHAVANTAGE] HTTP {resp.StatusCode}. Attempt {attempt}");
                    }
                }
                catch (Exception ex) when (attempt < maxRetries)
                {
                    Console.WriteLine($"[ALPHAVANTAGE] Transient error: {ex.Message} (attempt {attempt})");
                    await Task.Delay(delayMs);
                    delayMs *= 2;
                    continue;
                }
            }

            // fallback to fake provider
            Console.WriteLine("[ALPHAVANTAGE] Falling back to fake provider");
            return await _fallback.GetPriceAsync(symbol);
        }
    }
}
