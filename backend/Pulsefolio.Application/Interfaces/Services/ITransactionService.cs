using Pulsefolio.Application.DTOs.Transaction;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface ITransactionService
    {
        Task<TransactionDto> AddTransactionAsync(CreateTransactionDto dto, Guid userId);
    }
}
