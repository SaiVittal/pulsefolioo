namespace Pulsefolio.Application.Common.Security
{
    public interface IPasswordHasher
    {
        string Hash(string plain);
        bool Verify(string plain, string hash);
    }
}
