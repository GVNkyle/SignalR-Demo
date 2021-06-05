using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRDemo.Models.Hubs
{
    public interface IHubClient
    {
        Task BroadcastMessage();
    }
}
