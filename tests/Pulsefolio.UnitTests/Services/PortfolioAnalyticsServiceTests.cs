using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Services;
using Pulsefolio.Domain.Entities;
using Xunit;

namespace Pulsefolio.UnitTests.Services;

public class PortfolioAnalyticsServiceTests
{
    private readonly Mock<IPortfolioRepository> _portfolioRepo = new();
    private readonly Mock<ITransactionRepository> _txnRepo = new();
    private readonly Mock<IMarketDataProvider> _marketData = new();
    private readonly PortfolioAnalyticsService _sut;

    public PortfolioAnalyticsServiceTests()
    {
        _sut = new PortfolioAnalyticsService(
            _portfolioRepo.Object,
            _txnRepo.Object,
            _marketData.Object);
    }

    [Fact]
    public async Task ComputePortfolioPnlAsync_ShouldComputeHoldingsAndTotals()
    {
        // Arrange
        var portfolioId = Guid.NewGuid();

        _portfolioRepo.Setup(r => r.GetByIdAsync(portfolioId))
            .ReturnsAsync(new Portfolio
            {
                Id = portfolioId,
                Holdings = new List<Holding>
                {
                    new()
                    {
                        Symbol = "AAPL",
                        Quantity = 10,
                        AveragePrice = 100
                    }
                }
            });

        _txnRepo.Setup(r => r.GetByPortfolioIdAsync(portfolioId))
            .ReturnsAsync(new List<Transaction>());

        _marketData.Setup(m => m.GetPriceAsync("AAPL"))
            .ReturnsAsync(150m);

        // Act
        var result = await _sut.ComputePortfolioPnlAsync(portfolioId);

        // Assert
        result.PortfolioId.Should().Be(portfolioId);
        result.Holdings.Should().HaveCount(1);

        var h = result.Holdings[0];
        h.Symbol.Should().Be("AAPL");
        h.Quantity.Should().Be(10);
        h.AvgCost.Should().Be(100);
        h.CurrentPrice.Should().Be(150);
        h.CostBasis.Should().Be(1000);
        h.CurrentValue.Should().Be(1500);
        h.UnrealizedPnl.Should().Be(500);

        result.TotalCostBasis.Should().Be(1000);
        result.TotalCurrentValue.Should().Be(1500);
        result.UnrealizedPnl.Should().Be(500);
    }

    [Fact]
    public async Task ComputePortfolioPnlAsync_ShouldHandleSellRealizedPnl()
    {
        // Arrange
        var portfolioId = Guid.NewGuid();

        _portfolioRepo.Setup(r => r.GetByIdAsync(portfolioId))
            .ReturnsAsync(new Portfolio
            {
                Id = portfolioId,
                Holdings = new List<Holding>
                {
                    new()
                    {
                        Symbol = "AAPL",
                        Quantity = 5,
                        AveragePrice = 100
                    }
                }
            });

        _txnRepo.Setup(r => r.GetByPortfolioIdAsync(portfolioId))
            .ReturnsAsync(new List<Transaction>
            {
                new()
                {
                    Symbol = "AAPL",
                    Type = "BUY",
                    Quantity = 10,
                    Price = 100
                },
                new()
                {
                    Symbol = "AAPL",
                    Type = "SELL",
                    Quantity = 5,
                    Price = 120
                }
            });

        _marketData.Setup(m => m.GetPriceAsync("AAPL"))
            .ReturnsAsync(130m);

        // Act
        var result = await _sut.ComputePortfolioPnlAsync(portfolioId);

        // Assert
        var h = result.Holdings[0];

        h.RealizedPnl.Should().Be(100); // (120 - 100) * 5
        result.RealizedPnl.Should().Be(100);
    }
}
