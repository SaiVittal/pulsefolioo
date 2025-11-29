using Xunit;

namespace Pulsefolio.IntegrationTests;

[CollectionDefinition("Integration")]
public class IntegrationCollection : ICollectionFixture<TestContainersFixture>
{
}
