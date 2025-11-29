using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Pulsefolio.Application.DTOs;
using Pulsefolio.Application.DTOs.Portfolio;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Services;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Domain.Entities.Valuations;
using Xunit;

namespace Pulsefolio.UnitTests.Services;

public class PortfolioSummaryServiceTests
{
    private readonly Mock<IPortfolioRepository> _portfolioRepo = new();
    private readonly Mock<IPortfolioAnalyticsService> _analytics = new();
    private readonly Mock<IValuationSnapshotRepository> _valuationRepo = new();
    private readonly PortfolioSummaryService _sut;

    public PortfolioSummaryServiceTests()
    {
        _sut = new PortfolioSummaryService(
            _portfolioRepo.Object,
            _analytics.Object,
            _valuationRepo.Object);
    }

    [Fact]
    public async Task GetSummaryAsync_ShouldCombinePnlAndLatestValuation()
    {
        // Arrange
        var portfolioId = Guid.NewGuid();

        _portfolioRepo.Setup(r => r.GetByIdAsync(portfolioId))
            .ReturnsAsync(new Portfolio
            {
                Id = portfolioId,
                Name = "Test Portfolio"
            });

        _analytics.Setup(a => a.ComputePortfolioPnlAsync(portfolioId))
            .ReturnsAsync(new PortfolioPnlDto
            {
                PortfolioId = portfolioId,
                TotalCurrentValue = 10000,
                TotalCostBasis = 8000,
                UnrealizedPnl = 2000,
                RealizedPnl = 500,
                Holdings = new List<HoldingPnlDto>
                {
                    new()
                    {
                        Symbol = "AAPL",
                        Quantity = 5,
                        CurrentPrice = 200 ,
                        AllocationPercent = 40
                    }
                }
            });

        _valuationRepo.Setup(r => r.GetLatestAsync(portfolioId))
            .ReturnsAsync(new ValuationSnapshot
            {
                Id = Guid.NewGuid(),
                PortfolioId = portfolioId,
                TotalValue = 10000,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5)
            });

        // Act
        var result = await _sut.GetSummaryAsync(portfolioId);

        // Assert
        result.PortfolioId.Should().Be(portfolioId);
        result.Name.Should().Be("Test Portfolio");
        result.TotalCurrentValue.Should().Be(10000);
        result.TotalCostBasis.Should().Be(8000);
        result.UnrealizedPnl.Should().Be(2000);
        result.RealizedPnl.Should().Be(500);
        result.TopHoldings.Should().HaveCount(1);
    }
}
