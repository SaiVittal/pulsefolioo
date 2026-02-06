using System.Net;
using Pulsefolio.Application.Common.Interfaces;
using StackExchange.Redis;
using System.Security.Claims;

namespace Pulsefolio.API.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConnectionMultiplexer _redis;
        private readonly ILogger<RateLimitingMiddleware> _logger;

        // Configuration: 100 requests per minute per user/IP
        private const int Capacity = 100;
        private const int RefillRate = 100; // tokens per minute
        private const int WindowSeconds = 60;

        public RateLimitingMiddleware(RequestDelegate next, IConnectionMultiplexer redis, ILogger<RateLimitingMiddleware> logger)
        {
            _next = next;
            _redis = redis;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var db = _redis.GetDatabase();
            string key = GetRateLimitKey(context);

            if (await IsRateLimitedAsync(db, key))
            {
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                await context.Response.WriteAsync("Rate limit exceeded. Try again later.");
                return;
            }

            await _next(context);
        }

        private string GetRateLimitKey(HttpContext context)
        {
            // Prioritize Authenticated User ID, fallback to IP
            var userId = context.User?.FindFirst("uid")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                return $"rate_limit:user:{userId}";
            }

            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            return $"rate_limit:ip:{ip}";
        }

        private async Task<bool> IsRateLimitedAsync(IDatabase db, string key)
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            
            // Lua script for atomic Token Bucket
            // Keys: [1] rate_limit_key
            // Args: [1] capacity, [2] refill_rate (tokens/sec - simplified here to refill full window), [3] window_time, [4] cost (1), [5] current_timestamp
            
            // Simplified Token Bucket Logic for Redis (Fixed Window with sliding expiry concept or standard leaky bucket)
            // Ideally use a generic cell rate limiter (GCRA) or simple counter for "X reqs per Y sec"
            // Let's implement a simple "Count in Window" for robustness and simplicity, 
            // OR a true Token Bucket. User asked for Token Bucket.

            // Script handles: 
            // 1. Get current tokens (or init to capacity)
            // 2. Refill based on time elapsed since last update
            // 3. Consume token
            // 4. Update state

            const string script = @"
                local tokens_key = KEYS[1]
                local timestamp_key = KEYS[1] .. ':ts'
                
                local capacity = tonumber(ARGV[1])
                local rate_per_sec = tonumber(ARGV[2])
                local now = tonumber(ARGV[3])
                local cost = tonumber(ARGV[4])

                local last_tokens = tonumber(redis.call('get', tokens_key))
                if last_tokens == nil then
                    last_tokens = capacity
                end

                local last_refill = tonumber(redis.call('get', timestamp_key))
                if last_refill == nil then
                    last_refill = 0
                end

                -- Refill
                local delta = math.max(0, now - last_refill)
                local filled_tokens = math.min(capacity, last_tokens + (delta * rate_per_sec))

                -- Consume
                local allowed = 0
                if filled_tokens >= cost then
                    filled_tokens = filled_tokens - cost
                    allowed = 1
                    redis.call('set', tokens_key, filled_tokens)
                    redis.call('set', timestamp_key, now)
                    
                    -- Expire keys to clean up inactive users (e.g., 1 hour)
                    redis.call('expire', tokens_key, 3600)
                    redis.call('expire', timestamp_key, 3600)
                end

                return allowed
            ";

            var ratePerSec = (double)RefillRate / WindowSeconds;
            
            var result = (int)await db.ScriptEvaluateAsync(script, 
                new RedisKey[] { key }, 
                new RedisValue[] { Capacity, ratePerSec, now, 1 });

            return result == 0; // 0 means not allowed (0 allowed), wait logic inverted: script returns 1 if allowed
        }
    }

    public static class RateLimitingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRateLimiting(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>();
        }
    }
}
