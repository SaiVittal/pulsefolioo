namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IMarketDataProvider
    {
        Task<decimal> GetPriceAsync(string symbol);
    }
}
