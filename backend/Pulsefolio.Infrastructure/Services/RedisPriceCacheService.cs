using StackExchange.Redis;
using System.Text.Json;
using Pulsefolio.Application.Interfaces.Services;

namespace Pulsefolio.Infrastructure.Services
{
    public class RedisPriceCacheService : IPriceCacheService
    {
        private readonly IDatabase _db;
        private readonly TimeSpan _ttl = TimeSpan.FromSeconds(30);

        public RedisPriceCacheService(IConnectionMultiplexer redis)
        {
            _db = redis.GetDatabase();
        }

        public async Task<decimal?> GetCachedPriceAsync(string symbol)
        {
            var key = $"quote:{symbol}";
            var value = await _db.StringGetAsync(key);

            if (value.IsNullOrEmpty) return null;

            return JsonSerializer.Deserialize<decimal>(value!);
        }

        public async Task SetCachedPriceAsync(string symbol, decimal price)
        {
            var key = $"quote:{symbol}";
            var json = JsonSerializer.Serialize(price);

            await _db.StringSetAsync(key, json, _ttl);
        }
    }
}
