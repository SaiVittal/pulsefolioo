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

            builder.Property(x => x.Symbol)
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.Type)
                .HasMaxLength(10)
                .IsRequired();

            builder.Property(x => x.Price).HasColumnType("numeric(18,2)");
            builder.Property(x => x.Quantity).HasColumnType("numeric(18,4)");

            // ONLY relation: Portfolio -> Transactions
            builder.HasOne<Portfolio>()
                   .WithMany(p => p.Transactions)
                   .HasForeignKey(x => x.PortfolioId);
        }
    }
}
