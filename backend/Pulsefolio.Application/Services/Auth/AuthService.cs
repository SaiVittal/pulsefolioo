using AutoMapper;
using Pulsefolio.Application.Common.Interfaces;
using Pulsefolio.Application.DTOs.Auth;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Common.Exceptions;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Application.Interfaces.Services; 
using Pulsefolio.Application.Common.Security;  
namespace Pulsefolio.Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly IRefreshTokenRepository _rtRepo;
        private readonly IPasswordHasher _hasher;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository userRepo,
                           IRefreshTokenRepository rtRepo,
                           IPasswordHasher hasher,
                           ITokenService tokenService,
                           IMapper mapper)
        {
            _userRepo = userRepo;
            _rtRepo = rtRepo;
            _hasher = hasher;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterUserDto dto)
        {
            var existing = await _userRepo.GetByEmailAsync(dto.Email);
            if (existing != null) throw new BadRequestException("Email already registered.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = _hasher.Hash(dto.Password),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepo.AddAsync(user);

            var (access, expiresAt) = _tokenService.CreateAccessTokenWithExpiry(user.Id, user.Email);
            var refresh = _tokenService.CreateRefreshToken();

            var rt = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refresh,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30) // use config if needed
            };

            await _rtRepo.AddAsync(rt);

            return new AuthResponseDto
            {
                AccessToken = access,
                RefreshToken = refresh,
                UserId = user.Id
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginUserDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null) throw new UnauthorizedException("Invalid credentials.");

            if (!_hasher.Verify(dto.Password, user.PasswordHash)) throw new UnauthorizedException("Invalid credentials.");

            var (access, expiresAt) = _tokenService.CreateAccessTokenWithExpiry(user.Id, user.Email);
            var refresh = _tokenService.CreateRefreshToken();

            // optionally invalidate old tokens for user
            await _rtRepo.InvalidateTokensAsync(user.Id);

            var rt = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refresh,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30)
            };
            await _rtRepo.AddAsync(rt);

            return new AuthResponseDto
            {
                AccessToken = access,
                RefreshToken = refresh,
                UserId = user.Id
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            // Find token and user
            // Implementation depends on whether token stores user id in request or not.
            // Here, we search by token
            // For security: ensure token is not revoked and not expired.
            // We'll assume RefreshTokenRepository has GetValidTokenAsync(Guid, token) but we need user id.
            // So repository may need GetByTokenAsync - we will use GetValidTokenAsync by searching all tokens (alternative).
            // For now, implement a basic GetByToken in repository or you can add method. Here I will assume GetByToken token exists.

            var rt = await _rtRepo.GetByTokenAsync(refreshToken);
            if (rt == null || rt.IsRevoked || rt.ExpiresAt <= DateTime.UtcNow)
                throw new UnauthorizedException("Invalid refresh token.");

            var user = await _userRepo.GetByIdAsync(rt.UserId);
            if (user == null) throw new NotFoundException("User not found for refresh token.");

            // create new access + refresh token
            var (access, expiresAt) = _tokenService.CreateAccessTokenWithExpiry(user.Id, user.Email);
            var newRefresh = _tokenService.CreateRefreshToken();

            // revoke old token and save new
            rt.IsRevoked = true;
            await _rtRepo.UpdateAsync(rt); // ensure you have UpdateAsync

            var newRt = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = newRefresh,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30)
            };
            await _rtRepo.AddAsync(newRt);

            return new AuthResponseDto
            {
                AccessToken = access,
                RefreshToken = newRefresh,
                UserId = user.Id
            };
        }
    }
}
