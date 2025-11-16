using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pulsefolio.Application.Interfaces.Services;
using Pulsefolio.Application.DTOs.Auth;
using System.Security.Claims;

/// <summary>
/// Controller for handling user authentication operations including registration, login, and token refresh.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthController"/> class.
    /// </summary>
    /// <param name="auth">The authentication service.</param>
    public AuthController(IAuthService auth) => _auth = auth;

    /// <summary>
    /// Registers a new user and returns JWT access + refresh tokens.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        var res = await _auth.RegisterAsync(dto);
        return Ok(res);
    }

    /// <summary>
    /// Logs in a user and issues new access + refresh tokens.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
    {
        var res = await _auth.LoginAsync(dto);
        return Ok(res);
    }

    /// <summary>
    /// Creates a new access token using a valid refresh token.
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        var res = await _auth.RefreshTokenAsync(refreshToken);
        return Ok(res);
    }
    
    /// <summary>
    /// Returns the authenticated user's profile info from JWT.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirst("uid")?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;

        return Ok(new
        {
            userId,
            email
        });
    }
}
