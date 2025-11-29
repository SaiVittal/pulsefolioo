using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using Xunit;
using Microsoft.Extensions.DependencyInjection;

namespace Pulsefolio.IntegrationTests;

[Collection("Integration")]
public class PortfolioFlowTests : IClassFixture<TestContainersFixture>, IDisposable
{
    private readonly TestContainersFixture _containers;
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private QueueTestWorker? _worker;

    public PortfolioFlowTests(TestContainersFixture containers)
    {
        _containers = containers;
        _factory = new CustomWebApplicationFactory(_containers);
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task FullPortfolioLifecycle_WithValuationProcessing_Works()
    {
        // Register (optional)
        var email = $"pulsefolio_test1_{Guid.NewGuid().ToString().Split('-')[0]}@gmail.com";
        var password = "SaiVittal@25";

        var regBody = new { email, password };
        var regResp = await _client.PostAsync("/api/auth/register", new StringContent(JsonConvert.SerializeObject(regBody), Encoding.UTF8, "application/json"));

        // Login
        var loginResp = await _client.PostAsync("/api/auth/login", new StringContent(JsonConvert.SerializeObject(regBody), Encoding.UTF8, "application/json"));
        loginResp.StatusCode.Should().Be(HttpStatusCode.OK);
        dynamic loginJson = JsonConvert.DeserializeObject(await loginResp.Content.ReadAsStringAsync());
        string accessToken = (string)loginJson.accessToken;
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        // Create portfolio
        var createBody = new { name = $"Test Portfolio {Guid.NewGuid()}" };
        var createResp = await _client.PostAsync("/api/portfolio", new StringContent(JsonConvert.SerializeObject(createBody), Encoding.UTF8, "application/json"));
        createResp.StatusCode.Should().Be(HttpStatusCode.OK);
        dynamic created = JsonConvert.DeserializeObject(await createResp.Content.ReadAsStringAsync());
        string portfolioId = created.id;

        // Buy transaction (creates holdings)
        var buy = new { portfolioId, symbol = "TSLA", quantity = 3, price = 1000M };
        var buyResp = await _client.PostAsync("/api/transactions/buy", new StringContent(JsonConvert.SerializeObject(buy), Encoding.UTF8, "application/json"));
        buyResp.StatusCode.Should().Be(HttpStatusCode.OK).Or(HttpStatusCode.Created);

        // Request valuation (this enqueues job)
        var reqValResp = await _client.PostAsync($"/api/valuation/{portfolioId}/request", null);
        reqValResp.StatusCode.Should().Be(HttpStatusCode.Accepted).Or(HttpStatusCode.OK).Or(HttpStatusCode.Created);

        // Start in-test worker that will process the message
        var sp = _factory.Services; // uses the API's service provider
        _worker = new QueueTestWorker(_containers, sp);

        // Wait for worker to process (worker acknowledges)
        await Task.Delay(3000);

        // Get latest valuation
        var valResp = await _client.GetAsync($"/api/valuation/{portfolioId}/latest");
        valResp.StatusCode.Should().Be(HttpStatusCode.OK);
        dynamic valJson = JsonConvert.DeserializeObject(await valResp.Content.ReadAsStringAsync());
        ((decimal)valJson.totalValue).Should().BeGreaterThan(0);
    }

    public void Dispose()
    {
        _worker?.Dispose();
        _client.Dispose();
    }
}
