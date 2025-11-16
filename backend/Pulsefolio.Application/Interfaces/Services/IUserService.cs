using Pulsefolio.Application.DTOs.User;

public interface IUserService
{
    Task<UserDto> GetByIdAsync(Guid id);
    Task<List<UserDto>> GetAllAsync();
}
