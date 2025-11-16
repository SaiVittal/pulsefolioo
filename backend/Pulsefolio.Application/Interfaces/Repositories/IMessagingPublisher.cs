namespace Pulsefolio.Application.Interfaces.Messaging
{
    public interface IMessagePublisher
    {
        void Publish<T>(string queueOrExchange, T payload);
    }
}
