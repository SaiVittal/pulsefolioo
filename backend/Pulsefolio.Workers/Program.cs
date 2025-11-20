using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Pulsefolio.Workers;
using Pulsefolio.Infrastructure.Repositories;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Messaging;
using Pulsefolio.Application.Interfaces.Messaging;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Infrastructure.Services;
using Pulsefolio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((context, config) =>
    {
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        config.AddJsonFile("appsettings.Development.json", optional: true);
    })
    .ConfigureServices((context, services) =>
    {
        var cfg = context.Configuration;

        // Db Context
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(cfg.GetConnectionString("DefaultConnection"));
        });

        // RabbitMQ Publisher
        services.AddSingleton<IMessagePublisher, RabbitMqPublisher>();

        // Redis Price Cache Service
        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var redisHost = context.Configuration["Redis:Host"] ?? "localhost";
            var redisPort = context.Configuration["Redis:Port"] ?? "6379";

            return ConnectionMultiplexer.Connect($"{redisHost}:{redisPort}");
        });


        // Market Data Provider
        services.AddScoped<IMarketDataProvider, FakeMarketDataProvider>();

        // Price Cache Service
        services.AddScoped<IPriceCacheService, RedisPriceCacheService>();

        // Repositories
        services.AddScoped<IPortfolioRepository, PortfolioRepository>();
        services.AddScoped<IValuationSnapshotRepository, ValuationSnapshotRepository>();
        
        // Background Consumers
        services.AddHostedService<ValuationRequestConsumer>();
    })
    .Build();

await host.RunAsync();
