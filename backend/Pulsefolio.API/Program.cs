using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Pulsefolio.Application.Common.Settings;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.Services;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Infrastructure.Repositories;
using Pulsefolio.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Pulsefolio.Infrastructure.Data;
using Pulsefolio.Application.Common.Interfaces;
using Pulsefolio.Application.Mapping;
using Pulsefolio.Application.Common.Security;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Pulsefolio.Application.Interfaces.Messaging;
using Pulsefolio.Infrastructure.Messaging;
using Pulsefolio.Infrastructure.Services;
using Pulsefolio.Workers;
using StackExchange.Redis;
var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Pulsefolio API", Version = "v1" });

    // XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

    // Add JWT Support
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// JWT Config
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
var key = Encoding.UTF8.GetBytes(jwt.Secret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var cfg = builder.Configuration;
    var host = cfg["Redis:Host"] ?? "localhost";
    var port = cfg["Redis:Port"] ?? "6379";

    return ConnectionMultiplexer.Connect($"{host}:{port}");
});


    // HttpClient for AlphaVantage
builder.Services.AddHttpClient("AlphaVantageClient", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["AlphaVantage:BaseUrl"] ?? "https://www.alphavantage.co"
    );
    client.Timeout = TimeSpan.FromSeconds(10);
});



    // Register Fake as concrete type so can be injected into Alpha provider
    builder.Services.AddScoped<FakeMarketDataProvider>(); // concrete
    builder.Services.AddScoped<IMarketDataProvider>(sp =>
    {
        var fake = sp.GetRequiredService<FakeMarketDataProvider>();
        return new AlphaVantageMarketDataProvider(
            sp.GetRequiredService<IHttpClientFactory>(),
            sp.GetRequiredService<IPriceCacheService>(),
            builder.Configuration,
            fake
        );
    });


builder.Services.AddScoped<IPortfolioAnalyticsService, PortfolioAnalyticsService>();

// Register Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IHoldingRepository, HoldingRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IValuationSnapshotRepository, ValuationSnapshotRepository>();
builder.Services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IHoldingService, HoldingService>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddSingleton<IMessagePublisher, RabbitMqPublisher>();
builder.Services.AddScoped<IValuationSnapshotRepository, ValuationSnapshotRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IPriceCacheService, RedisPriceCacheService>();
// builder.Services.AddScoped<IMarketDataProvider, FakeMarketDataProvider>();

// Portfolio summary service
builder.Services.AddScoped<IPortfolioSummaryService, PortfolioSummaryService>();

// Valuation query service
builder.Services.AddScoped<IValuationQueryService, ValuationQueryService>();


// Transaction repository
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// Analytics service
builder.Services.AddScoped<IPortfolioAnalyticsService, PortfolioAnalyticsService>();

// SignalR and Hosted Services
builder.Services.AddSignalR();
builder.Services.AddHostedService<ValuationCompletedConsumer>();


// Analytics repository and service
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();



// map endpoint


builder.WebHost.UseUrls("http://localhost:5188");

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapHub<PortfolioHub>("/hubs/portfolio");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.Logger.LogInformation("Now listening on: {Url}", "http://localhost:5188");

app.Run();
