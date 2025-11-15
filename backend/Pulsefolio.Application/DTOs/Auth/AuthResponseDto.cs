namespace Pulsefolio.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public Guid UserId { get; set; }
    }
}
