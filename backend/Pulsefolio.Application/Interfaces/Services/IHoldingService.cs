using Pulsefolio.Application.DTOs.Holding;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IHoldingService
    {
        Task<HoldingDto> CreateAsync(CreateHoldingDto dto, Guid userId);
        Task<List<HoldingDto>> GetHoldingsAsync(Guid portfolioId, Guid userId);
    }
}
