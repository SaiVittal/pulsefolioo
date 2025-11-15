using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pulsefolio.Domain.Entities;

namespace Pulsefolio.Infrastructure.Configurations
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.ToTable("Transactions");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Price)
                   .HasPrecision(18, 4);

            builder.Property(x => x.Quantity)
                   .HasPrecision(18, 4);

            builder.Property(x => x.Type)
                   .IsRequired()
                   .HasMaxLength(10);

            builder.HasIndex(x => x.HoldingId);

            builder.HasOne(x => x.Holding)
                   .WithMany(h => h.Transactions)
                   .HasForeignKey(x => x.HoldingId);
        }
    }
}
