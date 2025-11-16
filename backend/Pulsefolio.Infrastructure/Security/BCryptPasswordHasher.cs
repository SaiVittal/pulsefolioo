using Pulsefolio.Application.Common.Security;
using BCrypt.Net;

namespace Pulsefolio.Infrastructure.Security
{
    public class BCryptPasswordHasher : IPasswordHasher
    {
        public string Hash(string plain) => BCrypt.Net.BCrypt.HashPassword(plain);

        public bool Verify(string plain, string hash) => BCrypt.Net.BCrypt.Verify(plain, hash);
    }
}
