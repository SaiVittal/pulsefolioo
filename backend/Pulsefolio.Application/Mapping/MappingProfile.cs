using AutoMapper;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.DTOs.Portfolio;
using Pulsefolio.Application.DTOs.Holding;
using Pulsefolio.Application.DTOs.Transaction;
using Pulsefolio.Application.DTOs.Auth;

namespace Pulsefolio.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Portfolio, PortfolioDto>().ReverseMap();
            CreateMap<Holding, HoldingDto>().ReverseMap();
            CreateMap<Transaction, TransactionDto>().ReverseMap();
            // Map User -> UserDto if exists
        }
    }
}
