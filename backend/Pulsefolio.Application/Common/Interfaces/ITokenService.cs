namespace Pulsefolio.Application.Common.Interfaces
{
    public interface ITokenService
    {
        string CreateAccessToken(Guid userId, string email, string role);
        string CreateRefreshToken();
        (string AccessToken, DateTime ExpiresAt) CreateAccessTokenWithExpiry(Guid userId, string email, string role);
    }
}
