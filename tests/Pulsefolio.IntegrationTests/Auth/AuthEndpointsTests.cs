using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Pulsefolio.IntegrationTests;

[Collection("Integration")]
public class AuthEndpointsTests : IClassFixture<TestContainersFixture>
{
    private readonly TestContainersFixture _containers;
    private readonly CustomWebApplicationFactory _factory;

    public AuthEndpointsTests(TestContainersFixture containers)
    {
        _containers = containers;
        _factory = new CustomWebApplicationFactory(_containers);
    }

    [Fact]
    public async Task Register_And_Login_Works()
    {
        using var client = _factory.CreateClient();

        var registerBody = new
        {
            email = "pulsefolio_test1@gmail.com",
            password = "SaiVittal@25"
        };

        var regResp = await client.PostAsync("/api/auth/register",
            new StringContent(JsonConvert.SerializeObject(registerBody), Encoding.UTF8, "application/json"));
        regResp.StatusCode.Should().BeOneOf(HttpStatusCode.Created, HttpStatusCode.BadRequest);

        var loginBody = new
        {
            email = registerBody.email,
            password = registerBody.password
        };

        var loginResp = await client.PostAsync("/api/auth/login",
            new StringContent(JsonConvert.SerializeObject(loginBody), Encoding.UTF8, "application/json"));
        loginResp.StatusCode.Should().Be(HttpStatusCode.OK);

        var loginJson = JsonConvert.DeserializeObject<dynamic>(await loginResp.Content.ReadAsStringAsync());
        ((string)loginJson.accessToken).Should().NotBeNullOrEmpty();
    }
}
