using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Configurations;
using DotNet.Testcontainers.Containers;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Pulsefolio.IntegrationTests;

public class TestContainersFixture : IAsyncLifetime
{
    public PostgreSqlTestcontainer Postgres { get; private set; } = null!;
    public RabbitMqTestcontainer RabbitMq { get; private set; } = null!;
    public TestcontainersContainer Redis { get; private set; } = null!;

    public string PostgresConnectionString => $"Host=localhost;Port={Postgres.Port};Database={Postgres.Database};Username={Postgres.Username};Password={Postgres.Password}";
    public string RabbitHost => "localhost";
    public int RabbitPort => RabbitMq.AmqpPort;
    public string RabbitUsername => RabbitMq.Username;
    public string RabbitPassword => RabbitMq.Password;
    public int RedisPort => 63790; // test mapping

    public async Task InitializeAsync()
    {
        // PostgreSQL
        Postgres = new TestcontainersBuilder<PostgreSqlTestcontainer>()
            .WithDatabase(new PostgreSqlTestcontainerConfiguration
            {
                Database = "pulsefolio_test_db",
                Username = "testuser",
                Password = "testpassword",
                Port = 5433 // internal container port, mapped automatically if left blank — we'll use the provided Port
            })
            .WithImage("postgres:16")
            .WithCleanUp(true)
            .Build();

        // RabbitMQ
        RabbitMq = new TestcontainersBuilder<RabbitMqTestcontainer>()
            .WithImage("rabbitmq:3-management")
            .WithName("pulsefolio-test-rabbitmq")
            .WithPortBinding(5673, 5672) // map host 5673 -> container 5672 (avoid conflicts)
            .WithPortBinding(15673, 15672)
            .WithUsername("admin")
            .WithPassword("saiadmin123")
            .Build();

        // Redis
        Redis = new TestcontainersBuilder<TestcontainersContainer>()
            .WithImage("redis:7")
            .WithName("pulsefolio-test-redis")
            .WithPortBinding(63790, 6379)
            .Build();

        await Postgres.StartAsync();
        await RabbitMq.StartAsync();
        await Redis.StartAsync();

        // Wait a little for readiness (optional)
        await Task.Delay(2000);
    }

    public async Task DisposeAsync()
    {
        try
        {
            if (Postgres is not null) await Postgres.DisposeAsync();
            if (RabbitMq is not null) await RabbitMq.DisposeAsync();
            if (Redis is not null) await Redis.DisposeAsync();
        }
        catch { /* ignore */ }
    }
}
