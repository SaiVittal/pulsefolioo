using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Infrastructure.Configurations
{
    public class HoldingConfiguration : IEntityTypeConfiguration<Holding>
    {
        public void Configure(EntityTypeBuilder<Holding> builder)
        {
            builder.ToTable("Holdings");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Symbol)
                   .IsRequired()
                   .HasMaxLength(20);

            builder.Property(x => x.Quantity)
                   .HasPrecision(18, 4);

            builder.Property(x => x.AveragePrice)
                   .HasPrecision(18, 4);

            builder.HasIndex(x => new { x.PortfolioId, x.Symbol })
                   .IsUnique(); 
            // Prevent duplicate holdings for same symbol in same portfolio

            builder.HasOne(x => x.Portfolio)
                   .WithMany(p => p.Holdings)
                   .HasForeignKey(x => x.PortfolioId);

            builder.HasMany(x => x.Transactions)
                   .WithOne(t => t.Holding)
                   .HasForeignKey(t => t.HoldingId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
