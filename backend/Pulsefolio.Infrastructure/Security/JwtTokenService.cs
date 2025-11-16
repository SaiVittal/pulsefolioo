using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Pulsefolio.Application.Common.Interfaces;
using Pulsefolio.Application.Common.Settings;


namespace Pulsefolio.Infrastructure.Security
{
    public class JwtTokenService : ITokenService
    {
        private readonly JwtSettings _settings;

        public JwtTokenService(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        public string CreateAccessToken(Guid userId, string email)
        {
            var key = Encoding.UTF8.GetBytes(_settings.Secret);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim("email", email.ToString()),
                new Claim("uid", userId.ToString())
            };

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.AccessTokenMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public (string AccessToken, DateTime ExpiresAt) CreateAccessTokenWithExpiry(Guid userId, string email)
        {
            var expires = DateTime.UtcNow.AddMinutes(_settings.AccessTokenMinutes);
            var token = CreateAccessToken(userId, email);
            return (token, expires);
        }

        public string CreateRefreshToken()
        {
            var randomNum = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNum);
            return Convert.ToBase64String(randomNum);
        }
    }
}
