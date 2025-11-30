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
using Pulsefolio.Application.Services;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((context, config) =>
    {
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        config.AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", optional: true);

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

// HttpClient for AlphaVantage
        services.AddHttpClient("AlphaVantageClient", client =>
        {
            client.BaseAddress = new Uri(context.Configuration["AlphaVantage:BaseUrl"] ?? "https://www.alphavantage.co");
            client.Timeout = TimeSpan.FromSeconds(10);
        });


// Register Fake as concrete type so can be injected into Alpha provider
        services.AddScoped<FakeMarketDataProvider>();

services.AddScoped<IMarketDataProvider>(sp =>
{
    var fake = sp.GetRequiredService<FakeMarketDataProvider>();
    return new AlphaVantageMarketDataProvider(
        sp.GetRequiredService<IHttpClientFactory>(),
        sp.GetRequiredService<IPriceCacheService>(),
        context.Configuration,
        fake
    );
});

services.AddScoped<ITransactionRepository, TransactionRepository>();
services.AddScoped<IPortfolioAnalyticsService, PortfolioAnalyticsService>();



        // Market Data Provider
        // services.AddScoped<IMarketDataProvider, FakeMarketDataProvider>();

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
