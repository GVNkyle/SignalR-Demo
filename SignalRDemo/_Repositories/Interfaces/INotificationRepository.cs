using System.Threading.Tasks;
using signalRDemo.Helpers.Params;
using SignalRDemo.Models;

namespace signalRDemo._Repositories.Interfaces
{
    public interface INotificationRepository : IRepository<Notification>
    {
        Task<bool> deleted();
    }
}