using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Net.Http;
using Pulsefolio.API;

namespace Pulsefolio.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly TestContainersFixture _containers;

    public CustomWebApplicationFactory(TestContainersFixture containers)
    {
        _containers = containers;
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        // Replace configuration before the app starts
        builder.ConfigureAppConfiguration((context, conf) =>
        {
            var inMemorySettings = new Dictionary<string, string>
            {
                ["ConnectionStrings:DefaultConnection"] = _containers.PostgresConnectionString,
                ["RabbitMQ:Host"] = "localhost",
                ["RabbitMQ:Port"] = _containers.RabbitPort.ToString(),
                ["RabbitMQ:Username"] = _containers.RabbitUsername,
                ["RabbitMQ:Password"] = _containers.RabbitPassword,
                ["Redis:Host"] = "localhost",
                ["Redis:Port"] = _containers.RedisPort.ToString(),

                // Use a test JWT secret (short-living)
                ["AppSettings:JwtSecret"] = "TestJwtSecretForIntegrationTests123!"
            };

            conf.AddInMemoryCollection(inMemorySettings);
        });

        return base.CreateHost(builder);
    }
}
