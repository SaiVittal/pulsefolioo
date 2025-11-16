using Microsoft.AspNetCore.SignalR;

/// <summary>
/// SignalR hub that allows clients to subscribe/unsubscribe to portfolio groups to receive real-time updates.
/// </summary>
public class PortfolioHub : Hub
{
    // clients connect and can subscribe to portfolio groups
    /// <summary>
    /// Subscribes the current client connection to a portfolio group to receive real-time updates.
    /// </summary>
    /// <param name="portfolioId">The portfolio group identifier to subscribe to.</param>
    /// <returns>A task representing the asynchronous subscription operation.</returns>
    public Task SubscribeToPortfolio(string portfolioId) => Groups.AddToGroupAsync(Context.ConnectionId, portfolioId);
    /// <summary>
    /// Unsubscribes the current client connection from a portfolio group.
    /// </summary>
    /// <param name="portfolioId">The portfolio group identifier to unsubscribe from.</param>
    /// <returns>A task representing the asynchronous unsubscription operation.</returns>
    public Task UnsubscribeFromPortfolio(string portfolioId) => Groups.RemoveFromGroupAsync(Context.ConnectionId, portfolioId);
}
