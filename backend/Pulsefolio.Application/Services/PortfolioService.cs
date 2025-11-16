using AutoMapper;
using Pulsefolio.Application.DTOs.Portfolio;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Common.Exceptions;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Application.Interfaces.Services
{
    public class PortfolioService : IPortfolioService
    {
        private readonly IPortfolioRepository _portfolioRepo;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public PortfolioService(IPortfolioRepository portfolioRepo, IUserRepository userRepo, IMapper mapper)
        {
            _portfolioRepo = portfolioRepo;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<PortfolioDto> CreateAsync(Guid userId, CreatePortfolioDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new NotFoundException("User not found.");

            // optionally check uniqueness of name per user
            var userPortfolios = await _portfolioRepo.GetByUserIdAsync(userId);
            if (userPortfolios.Any(p => p.Name.ToLower() == dto.Name.Trim().ToLower()))
                throw new BadRequestException("You already have a portfolio with this name.");

            var entity = new Portfolio
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _portfolioRepo.AddAsync(entity);

            return _mapper.Map<PortfolioDto>(entity);
        }

        public async Task<List<PortfolioDto>> GetUserPortfoliosAsync(Guid userId)
        {
            var list = await _portfolioRepo.GetByUserIdAsync(userId);
            return _mapper.Map<List<PortfolioDto>>(list);
        }

        public async Task DeleteAsync(Guid portfolioId, Guid userId)
        {
            var p = await _portfolioRepo.GetByIdAsync(portfolioId);
            if (p == null || p.UserId != userId) throw new NotFoundException("Portfolio not found or access denied.");

            await _portfolioRepo.DeleteAsync(p);
        }
    }
}
