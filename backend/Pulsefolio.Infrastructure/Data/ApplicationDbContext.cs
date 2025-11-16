using Microsoft.EntityFrameworkCore;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Domain.Entities.Valuations;

namespace Pulsefolio.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
public DbSet<ValuationSnapshot> ValuationSnapshots { get; set; } = null!;
        public DbSet<User> Users { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<Holding> Holdings { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply entity configuration automatically
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
            modelBuilder.Entity<ValuationSnapshot>(eb =>
        {
            eb.ToTable("ValuationSnapshots");
            eb.HasKey(v => v.Id);
            eb.Property(v => v.HoldingsJson).HasColumnType("jsonb"); // Postgres JSONB
            eb.Property(v => v.TotalValue).HasColumnType("numeric(28,8)");
            eb.Property(v => v.CreatedAt).HasDefaultValueSql("NOW()");
            eb.HasIndex(v => v.PortfolioId);
        });
            
        }
    }
}
