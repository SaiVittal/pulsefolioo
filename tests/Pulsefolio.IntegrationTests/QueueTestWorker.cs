using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Pulsefolio.IntegrationTests;

public class QueueTestWorker : IDisposable
{
    private readonly IConnection _conn;
    private readonly IModel _channel;
    private readonly IServiceProvider _serviceProvider;
    private readonly string _queueName = "valuation.requests";
    private readonly EventingBasicConsumer _consumer;

    public QueueTestWorker(TestContainersFixture containers, IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;

        var factory = new ConnectionFactory()
        {
            HostName = "localhost",
            Port = containers.RabbitPort,
            UserName = containers.RabbitUsername,
            Password = containers.RabbitPassword,
            DispatchConsumersAsync = true
        };

        _conn = factory.CreateConnection();
        _channel = _conn.CreateModel();

        // Ensure queue exists
        _channel.QueueDeclare(queue: _queueName,
                              durable: true,
                              exclusive: false,
                              autoDelete: false,
                              arguments: null);

        _consumer = new EventingBasicConsumer(_channel);
        _consumer.Received += async (sender, ea) =>
        {
            try
            {
                var body = Encoding.UTF8.GetString(ea.Body.ToArray());
                // Assuming payload is a JSON { "PortfolioId": "..." }
                var payload = JsonConvert.DeserializeObject<ValuationRequestPayload>(body);

                if (payload is not null)
                {
                    // Invoke your valuation logic inside a DI scope
                    using var scope = _serviceProvider.CreateScope();

                    // The service name below must match your implementation that processes valuation jobs.
                    // Replace IValuationProcessor with the actual interface in your project.
                    var processor = scope.ServiceProvider.GetService<IValuationProcessor>()
                                    ?? scope.ServiceProvider.GetService<IValuationService>() as dynamic;

                    if (processor != null)
                    {
                        // call the processor (sync/async depending on your impl)
                        await (processor as dynamic).ProcessValuationAsync(Guid.Parse(payload.PortfolioId));
                    }
                }

                _channel.BasicAck(ea.DeliveryTag, false);
            }
            catch
            {
                _channel.BasicNack(ea.DeliveryTag, false, true);
            }
        };

        _channel.BasicConsume(queue: _queueName, autoAck: false, consumer: _consumer);
    }

    public void Dispose()
    {
        try
        {
            _channel?.Close();
            _conn?.Close();
        }
        catch { }
    }

    private class ValuationRequestPayload
    {
        public string PortfolioId { get; set; } = string.Empty;
    }
}
