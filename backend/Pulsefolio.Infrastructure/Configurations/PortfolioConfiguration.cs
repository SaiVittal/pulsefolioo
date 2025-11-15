using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Infrastructure.Configurations
{
    public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
    {
        public void Configure(EntityTypeBuilder<Portfolio> builder)
        {
            builder.ToTable("Portfolios");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.HasIndex(x => new { x.UserId, x.Name })
                   .IsUnique(); // User cannot create duplicate portfolio names

            builder.HasOne(x => x.User)
                   .WithMany(u => u.Portfolios)
                   .HasForeignKey(x => x.UserId);

            builder.HasMany(x => x.Holdings)
                   .WithOne(h => h.Portfolio)
                   .HasForeignKey(h => h.PortfolioId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
