using AutoMapper;
using Pulsefolio.Application.DTOs.Holding;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Common.Exceptions;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Services
{
    public class HoldingService : IHoldingService
    {
        private readonly IHoldingRepository _holdingRepo;
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly IMapper _mapper;

        public HoldingService(IHoldingRepository holdingRepo, IPortfolioRepository portfolioRepo, IMapper mapper)
        {
            _holdingRepo = holdingRepo;
            _portfolioRepo = portfolioRepo;
            _mapper = mapper;
        }

        public async Task<HoldingDto> CreateAsync(CreateHoldingDto dto, Guid userId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(dto.PortfolioId)
                            ?? throw new NotFoundException("Portfolio not found.");

            if (portfolio.UserId != userId)
                throw new NotFoundException("Portfolio not found or access denied.");

            var holding = new Holding
            {
                Id = Guid.NewGuid(),
                PortfolioId = dto.PortfolioId,
                Symbol = (dto.Symbol ?? string.Empty).Trim().ToUpperInvariant(),
                Quantity = dto.Quantity,
                AveragePrice = dto.BuyPrice,
                CreatedAt = DateTime.UtcNow
            };

            await _holdingRepo.AddAsync(holding);

            return _mapper.Map<HoldingDto>(holding);
        }

        public async Task<List<HoldingDto>> GetHoldingsAsync(Guid portfolioId, Guid userId)
        {
            var portfolio = await _portfolioRepo.GetByIdAsync(portfolioId)
                           ?? throw new NotFoundException("Portfolio not found.");

            if (portfolio.UserId != userId)
                throw new NotFoundException("Portfolio not found or access denied.");

            var holdings = await _holdingRepo.GetByPortfolioIdAsync(portfolioId) ?? new List<Holding>();
            return _mapper.Map<List<HoldingDto>>(holdings);
        }
    }
}
