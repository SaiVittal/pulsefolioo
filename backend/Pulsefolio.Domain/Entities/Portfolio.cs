using Pulsefolio.Domain.Common;

namespace Pulsefolio.Domain.Entities
{
    public class Portfolio : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public Guid UserId { get; set; }
        public required User User { get; set; }

        public ICollection<Holding> Holdings { get; set; } = new List<Holding>();
    }
}
