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
using Microsoft.EntityFrameworkCore.Diagnostics;
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
using Pulsefolio.Application.Services.Auth;
using Pulsefolio.API.Middleware;

var builder = WebApplication.CreateBuilder(args);



// ---------------------------------------------------------------------
// Configuration Loading
// ---------------------------------------------------------------------
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json",
                 optional: true,
                 reloadOnChange: true)
    .AddEnvironmentVariables();

// CORS Configuration
// ---------------------------------------------------------------------

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();

    });
});



// ---------------------------------------------------------------------
// DB Context
// ---------------------------------------------------------------------

// Helper to parse DATABASE_URL (postgres://user:pass@host:port/db) from cloud providers
string GetConnectionString(IConfiguration configuration)
{
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrEmpty(databaseUrl))
    {
        Console.WriteLine("⚠️ DATABASE_URL not found. Using local DefaultConnection.");
        return configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    try 
    {
        Console.WriteLine($"✅ Found DATABASE_URL: {databaseUrl.Split('@')[1]} (credentials hidden)"); // Log non-sensitive part
        
        var databaseUri = new Uri(databaseUrl);
        var userInfo = databaseUri.UserInfo.Split(':');
        
        // Handle password with special chars (if any)
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? string.Join(":", userInfo.Skip(1)) : "";

        return $"Host={databaseUri.Host};" +
               $"Port={databaseUri.Port};" +
               $"Database={databaseUri.AbsolutePath.TrimStart('/')};" +
               $"Username={username};" +
               $"Password={password};" +
               $"SslMode=Require;Trust Server Certificate=true";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error parsing DATABASE_URL: {ex.Message}");
        Console.WriteLine($"Fallback: Returning raw DATABASE_URL");
        return databaseUrl;
    }
}

var connectionString = GetConnectionString(builder.Configuration);  
Console.WriteLine($"ℹ️ Final Connection String (Hidden Pwd): {System.Text.RegularExpressions.Regex.Replace(connectionString, "Password=.*?;", "Password=***;")}");

// Redis Configuration Helper
string GetRedisConnectionString(IConfiguration configuration)
{
    var redisUrl = Environment.GetEnvironmentVariable("REDIS_URL");
    if (string.IsNullOrEmpty(redisUrl))
    {
        var host = configuration["Redis:Host"] ?? "localhost";
        var port = configuration["Redis:Port"] ?? "6379";
        return $"{host}:{port}";
    }
    
    // Some providers give redis://user:pass@host:port
    return redisUrl.Replace("redis://", "").Replace("rediss://", "");
}

var redisConn = GetRedisConnectionString(builder.Configuration);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        b => b.MigrationsAssembly("Pulsefolio.Infrastructure")
    ).ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning))
);

// ---------------------------------------------------------------------
// Controllers & Swagger
// ---------------------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Pulsefolio API", Version = "v1" });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

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

// ---------------------------------------------------------------------
// AutoMapper
// ---------------------------------------------------------------------
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// ---------------------------------------------------------------------
// JWT
// ---------------------------------------------------------------------
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

builder.Services.AddAuthorization(options =>
{
    // Hierarchical roles: Admin has all access, Analyst has User+Analyst access
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("RequireAnalyst", policy => policy.RequireRole("Analyst", "Admin"));
    options.AddPolicy("RequireUser", policy => policy.RequireRole("User", "Analyst", "Admin"));
});


// ---------------------------------------------------------------------
// Redis
// ---------------------------------------------------------------------
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var cfg = builder.Configuration;
    var host = cfg["Redis:Host"] ?? "redis"; // IMPORTANT FIX
    var port = cfg["Redis:Port"] ?? "6379";
    return ConnectionMultiplexer.Connect($"{host}:{port}");
});

// ---------------------------------------------------------------------
// AlphaVantage HttpClient
// ---------------------------------------------------------------------
builder.Services.AddHttpClient("AlphaVantageClient", client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["AlphaVantage:BaseUrl"] ?? "https://www.alphavantage.co"
    );
    client.Timeout = TimeSpan.FromSeconds(10);
});

// ---------------------------------------------------------------------
// Market Data Provider
// ---------------------------------------------------------------------
builder.Services.AddScoped<FakeMarketDataProvider>();

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

// ---------------------------------------------------------------------
// Dependency Injection (UPDATED BLOCK - IPortfolioSummaryService added)
// ---------------------------------------------------------------------
builder.Services.AddScoped<IDashboardAggregationService, DashboardAggregationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IValuationQueryService, ValuationQueryService>();
builder.Services.AddScoped<IPortfolioAnalyticsService, PortfolioAnalyticsService>();
builder.Services.AddScoped<IPortfolioSummaryService, PortfolioSummaryService>(); 
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
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IPriceCacheService, RedisPriceCacheService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IWatchlistRepository, WatchlistRepository>();
builder.Services.AddScoped<IWatchlistService, WatchlistService>();

// ---------------------------------------------------------------------
// RabbitMQ should use hostname from config
// ---------------------------------------------------------------------
builder.Services.AddSingleton<IMessagePublisher, RabbitMqPublisher>();

// ---------------------------------------------------------------------
// SignalR + ValuationConsumer
// ---------------------------------------------------------------------
builder.Services.AddSignalR();
builder.Services.AddHostedService<ValuationCompletedConsumer>();

// ---------------------------------------------------------------------
// App Pipeline
// ---------------------------------------------------------------------
var app = builder.Build();

// Automatic Migrations on Startup **
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // This applies any pending migrations.
    // NOTE: This will attempt to run migrations when the app starts, 
    try
    {
        dbContext.Database.Migrate();
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while applying migrations.");
    }
}

// Global Middleware
app.UseSwagger();
app.UseSwaggerUI();
app.MapHub<PortfolioHub>("/hubs/portfolio");

// Enable CORS
app.UseCors("AllowFrontend");
app.UseMiddleware<ApiExceptionMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>(); // Add Rate Limiting
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}



// Log for debugging
app.Logger.LogInformation("API running in: {Env}", app.Environment.EnvironmentName);

app.Run();