using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Pulsefolio.API.Controllers
{
    /// <summary>
    /// Controller for testing authenticated endpoints.
    /// </summary>
   [Authorize]
[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    /// <summary>
    /// Tests authentication and returns user context.
    /// </summary>
    [HttpGet("secure")]
    public IActionResult SecureEndpoint()
    {
        var userId = User.FindFirst("uid")?.Value;
        var email = User.FindFirst("email")?.Value;

        return Ok(new 
        { 
            message = "You are authenticated!",
            userId,
            email
        });
    }
}

}
