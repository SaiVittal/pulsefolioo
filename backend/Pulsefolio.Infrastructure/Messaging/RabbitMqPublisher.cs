using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Pulsefolio.Application.Interfaces.Messaging;
using Microsoft.Extensions.Configuration;

namespace Pulsefolio.Infrastructure.Messaging
{
    public class RabbitMqPublisher : IMessagePublisher, IDisposable
    {
        private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMqPublisher(IConfiguration config)
    {
        var host = config["RabbitMQ:Host"] ?? "rabbitmq";
        var user = config["RabbitMQ:Username"] ?? "admin";
        var pass = config["RabbitMQ:Password"] ?? "admin";

        var factory = new ConnectionFactory
        {
            HostName = host,
            UserName = user,
            Password = pass,
            AutomaticRecoveryEnabled = true,
            NetworkRecoveryInterval = TimeSpan.FromSeconds(5)
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
    }
        public void Publish<T>(string queueName, T payload)
        {
            var json = JsonSerializer.Serialize(payload);
            var body = Encoding.UTF8.GetBytes(json);

            _channel.QueueDeclare(queueName, durable: true, exclusive: false, autoDelete: false);
            _channel.BasicPublish("", queueName, null, body);
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
