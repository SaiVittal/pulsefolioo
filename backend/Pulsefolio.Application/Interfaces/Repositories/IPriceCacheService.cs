namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IPriceCacheService
    {
        Task<decimal?> GetCachedPriceAsync(string symbol);
        Task SetCachedPriceAsync(string symbol, decimal price);
    }
}
