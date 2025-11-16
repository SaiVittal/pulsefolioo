using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

/// <summary>
/// Background RabbitMQ consumer that listens for valuation completion events
/// and pushes them to connected SignalR clients.
/// </summary>
public class ValuationCompletedConsumer : BackgroundService
{
    private readonly IConfiguration _cfg;
    private readonly ILogger<ValuationCompletedConsumer> _logger;
    private readonly IHubContext<PortfolioHub> _hub;

    private IConnection? _conn;
    private IModel? _ch;

    /// <summary>
    /// Initializes a new instance of the <see cref="ValuationCompletedConsumer"/> class.
    /// </summary>
    /// <param name="cfg">The application configuration.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="hub">The SignalR hub context for PortfolioHub.</param>
    public ValuationCompletedConsumer(
        IConfiguration cfg,
        ILogger<ValuationCompletedConsumer> logger,
        IHubContext<PortfolioHub> hub)
    {
        _cfg = cfg;
        _logger = logger;
        _hub = hub;

        var factory = new ConnectionFactory
        {
            HostName = cfg["RabbitMQ:Host"] ?? "localhost",
            UserName = cfg["RabbitMQ:Username"] ?? "guest",
            Password = cfg["RabbitMQ:Password"] ?? "guest",
            DispatchConsumersAsync = true
        };

        _conn = factory.CreateConnection();
        _ch = _conn.CreateModel();

        _ch.QueueDeclare(
            queue: "valuation.completed",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null);
    }

    /// <summary>
    /// Executes the background service to consume valuation completion events from RabbitMQ.
    /// </summary>
    /// <param name="stoppingToken">A cancellation token that can be used to stop the service.</param>
    /// <returns>A Task representing the background operation.</returns>
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new AsyncEventingBasicConsumer(_ch);

        consumer.Received += async (_, ea) =>
        {
            var json = Encoding.UTF8.GetString(ea.Body.ToArray());
            _logger.LogInformation("valuation.completed received: {json}", json);

            var payload = JsonSerializer.Deserialize<Dictionary<string, object>>(json);

            if (payload != null && payload.TryGetValue("portfolioId", out var pidObj))
            {
                var portfolioId = pidObj?.ToString() ?? string.Empty;

                await _hub.Clients
                    .Group(portfolioId)
                    .SendAsync("ValuationCompleted", payload);
            }

            if (_ch != null)
            {
                _ch.BasicAck(ea.DeliveryTag, false);
            }
        };

        _ch.BasicConsume(
            queue: "valuation.completed",
            autoAck: false,
            consumer: consumer
        );

        return Task.CompletedTask;
    }

    /// <summary>
    /// Releases the resources used by the <see cref="ValuationCompletedConsumer"/> class.
    /// </summary>
    public override void Dispose()
    {
        base.Dispose();
        try { _ch?.Close(); } catch { }
        try { _conn?.Close(); } catch { }
    }
}
