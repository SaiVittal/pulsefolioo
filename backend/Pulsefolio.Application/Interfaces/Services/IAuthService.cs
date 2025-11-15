using Pulsefolio.Application.DTOs.Auth;

namespace Pulsefolio.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterUserDto dto);
        Task<AuthResponseDto> LoginAsync(LoginUserDto dto);
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    }
}
