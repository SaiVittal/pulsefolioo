using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Pulsefolio.Application.Common.Exceptions;
using Pulsefolio.Application.DTOs.Portfolio;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Domain.Entities;
using Xunit;

namespace Pulsefolio.UnitTests.Services;

public class PortfolioServiceTests
{
    private readonly Mock<IPortfolioRepository> _portfolioRepo = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly PortfolioService _sut; // system under test

    public PortfolioServiceTests()
    {
        var mapper = AutoMapperTestHelper.CreateMapper();
        _sut = new PortfolioService(_portfolioRepo.Object, _userRepo.Object, mapper);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreatePortfolio_WhenValid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var dto = new CreatePortfolioDto { Name = "My Portfolio" };

        _userRepo.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(new User { Id = userId, Email = "user@test.com" });

        _portfolioRepo.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(new List<Portfolio>());

        // Act
        var result = await _sut.CreateAsync(userId, dto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("My Portfolio");
        result.Id.Should().NotBe(Guid.Empty);

        _portfolioRepo.Verify(r => r.AddAsync(It.IsAny<Portfolio>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenNameIsEmpty()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var dto = new CreatePortfolioDto { Name = "  " };

        _userRepo.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(new User { Id = userId });

        // Act
        var act = async () => await _sut.CreateAsync(userId, dto);

        // Assert
        await act.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Portfolio name is required.");
    }

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenDuplicateNameForUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var dto = new CreatePortfolioDto { Name = "Existing" };

        _userRepo.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(new User { Id = userId });

        _portfolioRepo.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(new List<Portfolio>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Name = "Existing"
                }
            });

        // Act
        var act = async () => await _sut.CreateAsync(userId, dto);

        // Assert
        await act.Should().ThrowAsync<BadRequestException>()
            .WithMessage("You already have a portfolio with this name.");
    }

    [Fact]
    public async Task GetUserPortfoliosAsync_ShouldReturnMappedDtos()
    {
        // Arrange
        var userId = Guid.NewGuid();

        _portfolioRepo.Setup(r => r.GetByUserIdAsync(userId))
            .ReturnsAsync(new List<Portfolio>
            {
                new() { Id = Guid.NewGuid(), Name = "P1", UserId = userId },
                new() { Id = Guid.NewGuid(), Name = "P2", UserId = userId }
            });

        // Act
        var result = await _sut.GetUserPortfoliosAsync(userId);

        // Assert
        result.Should().HaveCount(2);
        result[0].Name.Should().Be("P1");
        result[1].Name.Should().Be("P2");
    }
}
