using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pulsefolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddValuationSnapshots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ValuationSnapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PortfolioId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    TotalValue = table.Column<decimal>(type: "numeric(28,8)", nullable: false),
                    HoldingsJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuationSnapshots", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ValuationSnapshots_PortfolioId",
                table: "ValuationSnapshots",
                column: "PortfolioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValuationSnapshots");
        }
    }
}
