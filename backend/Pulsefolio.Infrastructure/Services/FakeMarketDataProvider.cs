using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.Infrastructure.Services
{
    public class FakeMarketDataProvider : IMarketDataProvider
    {
        private readonly IPriceCacheService _cache;
        private readonly Random _rand = new();

        public FakeMarketDataProvider(IPriceCacheService cache)
        {
            _cache = cache;
        }

        public async Task<decimal> GetPriceAsync(string symbol)
        {
            // 1. Check cache
            var cached = await _cache.GetCachedPriceAsync(symbol);
            if (cached.HasValue)
            {
                Console.WriteLine($"[CACHE-HIT] {symbol} = {cached.Value}");
                return cached.Value;
            }

            // 2. Generate fake price
            var price = (decimal)(_rand.NextDouble() * 500 + 100);

            // 3. Cache it for 30 seconds
            await _cache.SetCachedPriceAsync(symbol, price);

            Console.WriteLine($"[CACHE-MISS] {symbol} generated price = {price}");

            return price;
        }
    }
}
