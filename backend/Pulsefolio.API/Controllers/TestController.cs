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
        /// Retrieves a secure endpoint that requires authentication.
        /// </summary>
        /// <returns>An OK response with an authenticated user message.</returns>
        [HttpGet("secure")]
        public IActionResult SecureEndpoint()
        {
            return Ok(new { message = "You are authenticated!", user = User.Identity?.Name });
        }
    }
}
