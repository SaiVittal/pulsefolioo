using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.DTOs.Dashboard;
using Pulsefolio.Application.DTOs.Portfolio;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Services;
using Pulsefolio.Domain.Entities;
using Xunit;

namespace Pulsefolio.UnitTests.Services;

public class DashboardServiceTests
{
    private readonly Mock<IPortfolioSummaryService> _summary = new();
    private readonly Mock<ITransactionRepository> _txnRepo = new();
    private readonly Mock<IPortfolioRepository> _portfolioRepo = new();
    private readonly DashboardService _sut;

    public DashboardServiceTests()
    {
        _sut = new DashboardService(_summary.Object, _txnRepo.Object, _portfolioRepo.Object);
    }

    [Fact]
    public async Task GetDashboardAsync_ShouldReturnAggregatedDashboard()
    {
        // Arrange
        var portfolioId = Guid.NewGuid();

        _portfolioRepo.Setup(r => r.GetByIdAsync(portfolioId))
            .ReturnsAsync(new Portfolio
            {
                Id = portfolioId,
                Name = "My Dashboard Portfolio"
            });

        _summary.Setup(s => s.GetSummaryAsync(portfolioId))
            .ReturnsAsync(new PortfolioSummaryDto
            {
                PortfolioId = portfolioId,
                Name = "My Dashboard Portfolio",
                TotalCurrentValue = 12000,
                TotalCostBasis = 9000,
                UnrealizedPnl = 3000,
                RealizedPnl = 500,
                TopHoldings = new List<HoldingSummaryDto>
                {
                    new()
                    {
                        Symbol = "AAPL",
                        CurrentValue = 5000,
                        AllocationPercent = 41.7m
                    }
                }
            });

        _txnRepo.Setup(t => t.GetByPortfolioIdAsync(portfolioId))
            .ReturnsAsync(new List<Transaction>
            {
                new()
                {
                    Symbol = "AAPL",
                    Type = "BUY",
                    Quantity = 10,
                    Price = 100,
                    Timestamp = DateTime.UtcNow.AddMinutes(-10)
                },
                new()
                {
                    Symbol = "MSFT",
                    Type = "BUY",
                    Quantity = 5,
                    Price = 200,
                    Timestamp = DateTime.UtcNow.AddMinutes(-30)
                }
            });

        // Act
        var result = await _sut.GetDashboardAsync(portfolioId);

        // Assert
        result.PortfolioId.Should().Be(portfolioId);
        result.Name.Should().Be("My Dashboard Portfolio");
        result.TotalCurrentValue.Should().Be(12000);
        result.TotalCostBasis.Should().Be(9000);
        result.TopHoldings.Should().HaveCount(1);
        result.RecentTransactions.Should().HaveCount(2);
    }
}
