using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Pulsefolio.Workers
{
    /// <summary>
    /// Background service that consumes "valuation.completed" messages from RabbitMQ
    /// and forwards them to connected SignalR clients in the appropriate portfolio group.
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
        /// <param name="cfg">Application configuration containing RabbitMQ settings.</param>
        /// <param name="logger">Logger used for diagnostic messages.</param>
        /// <param name="hub">SignalR hub context used to forward valuation completed messages to clients.</param>
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
                arguments: null
            );
        }

        /// <summary>
        /// Execute the background consumer loop which listens for RabbitMQ messages
        /// on the "valuation.completed" queue and forwards them to SignalR clients
        /// grouped by portfolio id.
        /// </summary>
        /// <param name="stoppingToken">A token that is signaled when the host is shutting down.</param>
        /// <returns>A Task that represents the lifetime of the background operation.</returns>
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new AsyncEventingBasicConsumer(_ch);

            consumer.Received += async (_, ea) =>
            {
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                _logger.LogInformation("valuation.completed received: {json}", json);

                var payload = JsonSerializer.Deserialize<Dictionary<string, object>>(json);

                if (payload != null &&
                    payload.TryGetValue("portfolioId", out var pidObj))
                {
                    var pid = pidObj?.ToString() ?? string.Empty;

                    await _hub.Clients
                        .Group(pid)
                        .SendAsync("ValuationCompleted", payload);
                }

                if (_ch != null)
                {
                    _ch.BasicAck(ea.DeliveryTag, false);
                }
                else
                {
                    _logger.LogWarning("Cannot ack message because channel is null. DeliveryTag: {DeliveryTag}", ea.DeliveryTag);
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
        /// Disposes of the RabbitMQ connection and channel resources.
        /// </summary>
        public override void Dispose()
        {
            base.Dispose();
            try { _ch?.Close(); } catch { }
            try { _conn?.Close(); } catch { }
        }
    }
}
