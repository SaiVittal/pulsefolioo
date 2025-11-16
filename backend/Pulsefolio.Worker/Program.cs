using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Pulsefolio.Infrastructure.Messaging;
using Pulsefolio.Infrastructure.Data;
using Pulsefolio.Infrastructure.Repositories;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using Pulsefolio.Application.DTOs.Valuation;
using Pulsefolio.Domain.Entities.Valuations;

Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, services) =>
    {
        // register db context same as API (connection string from config)
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(ctx.Configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IValuationSnapshotRepository, ValuationSnapshotRepository>();
        services.AddSingleton<IMessagePublisher, RabbitMqPublisher>();

        services.AddHostedService<ValuationWorker>();
    })
    .Build()
    .Run();

public class ValuationWorker : BackgroundService
{
    private readonly IServiceProvider _sp;
    private readonly ILogger<ValuationWorker> _logger;
    private IConnection? _conn;
    private IModel? _ch;

    public ValuationWorker(IServiceProvider sp, ILogger<ValuationWorker> logger)
    {
        _sp = sp;
        _logger = logger;

        var cfg = sp.GetRequiredService<IConfiguration>();
        var factory = new ConnectionFactory
        {
            HostName = cfg["RabbitMQ:Host"] ?? "localhost",
            UserName = cfg["RabbitMQ:Username"] ?? "guest",
            Password = cfg["RabbitMQ:Password"] ?? "guest",
            DispatchConsumersAsync = true
        };
        _conn = factory.CreateConnection();
        _ch = _conn.CreateModel();
        _ch.QueueDeclare("valuation.request", durable: true, exclusive: false, autoDelete: false, arguments: null);
        _ch.QueueDeclare("valuation.completed", durable: true, exclusive: false, autoDelete: false, arguments: null);
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumer = new AsyncEventingBasicConsumer(_ch);
        consumer.Received += async (_, ea) =>
        {
            var body = Encoding.UTF8.GetString(ea.Body.ToArray());
            _logger.LogInformation("Received valuation request: {body}", body);

            ValuationRequestDto? req = null;
            try { req = JsonSerializer.Deserialize<ValuationRequestDto>(body); }
            catch (Exception ex) { _logger.LogError(ex, "Invalid valuation message"); }

            if (req != null)
            {
                // Basic stub: fetch holdings from DB and compute values.
                using var scope = _sp.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IValuationSnapshotRepository>();
                // TODO: Replace with real holdings fetch + market price retrieval
                var sampleHoldings = new[]
                {
                    new { symbol = "AAPL", qty = 10m, price = 150.25m },
                    new { symbol = "MSFT", qty = 5m, price = 300.5m }
                };

                var total = sampleHoldings.Sum(h => h.qty * h.price);
                var snapshot = new ValuationSnapshot
                {
                    Id = Guid.NewGuid(),
                    PortfolioId = req.PortfolioId,
                    CreatedAt = DateTime.UtcNow,
                    TotalValue = total,
                    HoldingsJson = JsonSerializer.Serialize(sampleHoldings)
                };

                await repo.AddAsync(snapshot);

                // publish completed message with minimal info
                var completedPayload = new
                {
                    portfolioId = req.PortfolioId,
                    snapshotId = snapshot.Id,
                    totalValue = snapshot.TotalValue,
                    createdAt = snapshot.CreatedAt
                };

                // publish to 'valuation.completed' queue
                var json = JsonSerializer.Serialize(completedPayload);
                var bodyOut = Encoding.UTF8.GetBytes(json);
                var props = _ch.CreateBasicProperties();
                props.Persistent = true;
                _ch.BasicPublish(exchange: "", routingKey: "valuation.completed", basicProperties: props, body: bodyOut);

                _logger.LogInformation("Saved snapshot {id} and published completed", snapshot.Id);
            }

            _ch.BasicAck(ea.DeliveryTag, false);
        };

        _ch.BasicConsume(queue: "valuation.request", autoAck: false, consumer: consumer);
        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        base.Dispose();
        try { _ch?.Close(); } catch { }
        try { _conn?.Close(); } catch { }
    }
}
