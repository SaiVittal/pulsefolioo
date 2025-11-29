using System;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using AutoMapper;

using Pulsefolio.Application.DTOs.Auth;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Domain.Entities;

using Pulsefolio.Application.Services.Auth;

using Pulsefolio.Application.Common.Security;

using Pulsefolio.Application.Common.Interfaces;

using Pulsefolio.Application.Common.Settings;

namespace Pulsefolio.UnitTests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepo;
        private readonly Mock<IRefreshTokenRepository> _refreshTokenRepo;
        private readonly Mock<IPasswordHasher> _hasher;
        private readonly Mock<ITokenService> _tokenService;
        private readonly Mock<IMapper> _mapper;

        private readonly AuthService _service;

        public AuthServiceTests()
        {
            _userRepo = new Mock<IUserRepository>();
            _refreshTokenRepo = new Mock<IRefreshTokenRepository>();
            _hasher = new Mock<IPasswordHasher>();
            _tokenService = new Mock<ITokenService>();
            _mapper = new Mock<IMapper>();

            _service = new AuthService(
                _userRepo.Object,
                _refreshTokenRepo.Object,
                _hasher.Object,
                _tokenService.Object,
                _mapper.Object
            );
        }

        [Fact]
        public async Task LoginAsync_WithCorrectCredentials_ReturnsTokens()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                PasswordHash = "hashed"
            };

            _userRepo.Setup(r => r.GetByEmailAsync("test@example.com"))
                     .ReturnsAsync(user);

            _hasher.Setup(h => h.Verify("pass123", "hashed")).Returns(true);

            _tokenService.Setup(t => t.CreateAccessTokenWithExpiry(user.Id, user.Email))
                         .Returns(("token123", DateTime.UtcNow));

            _tokenService.Setup(t => t.CreateRefreshToken())
                         .Returns("refresh123");

            var dto = new LoginUserDto
            {
                Email = "test@example.com",
                Password = "pass123"
            };

            var result = await _service.LoginAsync(dto);

            result.AccessToken.Should().Be("token123");
            result.RefreshToken.Should().Be("refresh123");
        }

        [Fact]
        public async Task LoginAsync_InvalidCredentials_Throws()
        {
            _userRepo.Setup(r => r.GetByEmailAsync("wrong@example.com"))
                     .ReturnsAsync((User?)null);

            var dto = new LoginUserDto
            {
                Email = "wrong@example.com",
                Password = "123"
            };

            var act = () => _service.LoginAsync(dto);

            await act.Should().ThrowAsync<Exception>();
        }
    }
}
