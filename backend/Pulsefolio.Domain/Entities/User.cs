using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// User role for authorization. Defaults to User.
        /// </summary>
        public UserRole Role { get; set; } = UserRole.User;

        public ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
