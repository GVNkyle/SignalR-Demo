using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using signalRDemo.Helpers.Utilities;

namespace signalRDemo._Services.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationCountResult> GetNotification();
        Task<List<NotificationResult>> GetAllNotification();
        Task<OperationResult> DeleteNotification();
    }
}