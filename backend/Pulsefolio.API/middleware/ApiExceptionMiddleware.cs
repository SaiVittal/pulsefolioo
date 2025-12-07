using System.Net;
using Pulsefolio.Application.Common.Exceptions;

/// <summary>
/// Global exception handling middleware.
/// </summary>
public class ApiExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiExceptionMiddleware> _logger;

/// <summary>
/// Global exception handling middleware.
/// </summary>
    public ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

/// <summary>
/// Global exception handling middleware Invoke.
/// </summary>
    public async Task Invoke(HttpContext context)
    {
        var correlationId = Guid.NewGuid().ToString();
        context.Response.Headers["X-Correlation-ID"] = correlationId;

        try
        {
            await _next(context);
        }
        catch (BadRequestException ex)
        {
            _logger.LogWarning(ex, "BadRequest: {Message} | Correlation {CorrelationId}", ex.Message, correlationId);
            await WriteError(context, HttpStatusCode.BadRequest, ex.Message, correlationId);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized: {Message} | Correlation {CorrelationId}", ex.Message, correlationId);
            await WriteError(context, HttpStatusCode.Unauthorized, ex.Message, correlationId);
        }
        catch (ForbiddenAccessException ex)
        {
            _logger.LogWarning(ex, "Forbidden: {Message} | Correlation {CorrelationId}", ex.Message, correlationId);
            await WriteError(context, HttpStatusCode.Forbidden, ex.Message, correlationId);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "NotFound: {Message} | Correlation {CorrelationId}", ex.Message, correlationId);
            await WriteError(context, HttpStatusCode.NotFound, ex.Message, correlationId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception | Correlation {CorrelationId}", correlationId);
            await WriteError(context, HttpStatusCode.InternalServerError, "Something went wrong.", correlationId);
        }
    }

    private static async Task WriteError(
        HttpContext context,
        HttpStatusCode status,
        string message,
        string correlationId)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var json = new
        {
            error = message,
            status = (int)status,
            correlationId
        };

        await context.Response.WriteAsJsonAsync(json);
    }
}
