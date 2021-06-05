using Microsoft.AspNetCore.SignalR;

namespace SignalRDemo.Models.Hubs
{
    public class BroadcastHub : Hub<IHubClient>
    {
    }
}
