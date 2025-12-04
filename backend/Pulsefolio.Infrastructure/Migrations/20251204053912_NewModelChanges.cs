using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pulsefolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TopPortfolioPnlDto",
                columns: table => new
                {
                    PortfolioId = table.Column<Guid>(type: "uuid", nullable: false),
                    PortfolioName = table.Column<string>(type: "text", nullable: false),
                    TotalPnl = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TopPortfolioPnlDto");
        }
    }
}
