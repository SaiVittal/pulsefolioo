using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Pulsefolio.Application.DTOs.Valuation;
using Pulsefolio.Application.Interfaces.Messaging;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Application.Interfaces.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Microsoft.Extensions.DependencyInjection;

namespace Pulsefolio.Workers
{
    public class ValuationRequestConsumer : BackgroundService
    {
        private readonly ILogger<ValuationRequestConsumer> _logger;
        private readonly IConfiguration _cfg;
        private readonly IMessagePublisher _publisher;
        private readonly IServiceScopeFactory _scopeFactory;

        private readonly IConnection _conn;
        private readonly IModel _ch;

        public ValuationRequestConsumer(
            ILogger<ValuationRequestConsumer> logger,
            IConfiguration cfg,
            IMessagePublisher publisher,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _cfg = cfg;
            _publisher = publisher;
            _scopeFactory = scopeFactory;

            var factory = new ConnectionFactory
            {
                HostName = cfg["RabbitMQ:Host"] ?? "localhost",
                UserName = cfg["RabbitMQ:Username"] ?? "guest",
                Password = cfg["RabbitMQ:Password"] ?? "guest",
                DispatchConsumersAsync = true
            };

            _conn = factory.CreateConnection();
            _ch = _conn.CreateModel();  // now guaranteed non-null

            _ch.QueueDeclare("valuation.request", durable: true, exclusive: false, autoDelete: false);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new AsyncEventingBasicConsumer(_ch);

            consumer.Received += async (_, ea) =>
            {
                using var scope = _scopeFactory.CreateScope();

                var portfolioRepo = scope.ServiceProvider.GetRequiredService<IPortfolioRepository>();
                var snapshotRepo = scope.ServiceProvider.GetRequiredService<IValuationSnapshotRepository>();
                var marketData = scope.ServiceProvider.GetRequiredService<IMarketDataProvider>();

                try
                {
                    var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                    _logger.LogInformation("Received valuation.request: {json}", json);

                    var dto = JsonSerializer.Deserialize<ValuationRequestDto>(json);
                    if (dto == null)
                    {
                        _logger.LogWarning("Invalid valuation request payload");
                        _ch.BasicAck(ea.DeliveryTag, false);
                        return;
                    }

                    // --- Load portfolio ---
                    var portfolio = await portfolioRepo.GetByIdAsync(dto.PortfolioId);
                    if (portfolio == null)
                    {
                        _logger.LogWarning("Portfolio {id} not found", dto.PortfolioId);
                        _ch.BasicAck(ea.DeliveryTag, false);
                        return;
                    }

                    decimal totalValue = 0;
                    var holdingsSnapshot = new List<object>();

                    // --- Price each holding ---
                    foreach (var holding in portfolio.Holdings)
                    {
                        var price = await marketData.GetPriceAsync(holding.Symbol);
                        var value = price * holding.Quantity;
                        totalValue += value;

                        holdingsSnapshot.Add(new { holding.Symbol, holding.Quantity, price, value });
                    }

                    // --- Save snapshot ---
                    var snapshot = new Pulsefolio.Domain.Entities.Valuations.ValuationSnapshot
                    {
                        Id = Guid.NewGuid(),
                        PortfolioId = dto.PortfolioId,
                        TotalValue = totalValue,
                        HoldingsJson = JsonSerializer.Serialize(holdingsSnapshot),
                        CreatedAt = DateTime.UtcNow
                    };

                    await snapshotRepo.AddAsync(snapshot);

                    // --- Publish completed event ---
                    _publisher.Publish("valuation.completed", new
                    {
                        portfolioId = dto.PortfolioId,
                        snapshotId = snapshot.Id,
                        totalValue
                    });

                    _logger.LogInformation("Valuation completed for {id}: {value}", dto.PortfolioId, totalValue);

                    _ch.BasicAck(ea.DeliveryTag, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in valuation processing");
                    _ch.BasicReject(ea.DeliveryTag, false);
                }
            };

            _ch.BasicConsume("valuation.request", autoAck: false, consumer: consumer);

            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            _ch.Close();
            _conn.Close();
            base.Dispose();
        }
    }
}
