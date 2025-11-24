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
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.AveragePrice)
                .HasColumnType("numeric(18,2)");

            builder.Property(x => x.Quantity)
                .HasColumnType("numeric(18,4)");

            builder.HasOne<Portfolio>()
                   .WithMany(p => p.Holdings)
                   .HasForeignKey(x => x.PortfolioId);
        }
    }
}
