using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using signalRDemo._Repositories.Interfaces;
using signalRDemo.Helpers.Params;
using SignalRDemo.Data;
using SignalRDemo.Models;

namespace signalRDemo._Repositories.Repositories
{
    public class NotificationRepository : MyDbRepository<Notification>, INotificationRepository
    {
        private readonly MyDbContext _context;
        public NotificationRepository(MyDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<bool> deleted()
        {
            await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE Notification");
            await _context.SaveChangesAsync();
            return true;
        }
    }
}