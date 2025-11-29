using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Pulsefolio.IntegrationTests;

[Collection("Integration")]
public class AnalyticsTop10Tests : IClassFixture<TestContainersFixture>
{
    private readonly TestContainersFixture _containers;
    private readonly CustomWebApplicationFactory _factory;

    public AnalyticsTop10Tests(TestContainersFixture containers)
    {
        _containers = containers;
        _factory = new CustomWebApplicationFactory(_containers);
    }

    [Fact]
    public async Task Top10Endpoint_ReturnsArray()
    {
        using var client = _factory.CreateClient();

        // Use an existing user or create/login like auth test
        var loginBody = new { email = "pulsefolio_test1@gmail.com", password = "SaiVittal@25" };
        var loginResp = await client.PostAsync("/api/auth/login", new StringContent(JsonConvert.SerializeObject(loginBody), Encoding.UTF8, "application/json"));
        loginResp.StatusCode.Should().Be(HttpStatusCode.OK);

        dynamic loginJson = JsonConvert.DeserializeObject(await loginResp.Content.ReadAsStringAsync());
        string accessToken = (string)loginJson.accessToken;
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var resp = await client.GetAsync("/api/analytics/top10");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await resp.Content.ReadAsStringAsync();
        var arr = JsonConvert.DeserializeObject<dynamic>(body);
        arr.Should().NotBeNull();
    }
}
