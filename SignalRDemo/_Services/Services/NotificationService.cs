using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using signalRDemo._Repositories.Interfaces;
using signalRDemo._Services.Interfaces;
using signalRDemo.Helpers.Utilities;

namespace signalRDemo._Services.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;

        }

        public async Task<OperationResult> DeleteNotification()
        {
            if (await _notificationRepository.deleted())
            {
                await _notificationRepository.Save();
                return new OperationResult { Caption = "Success", Message = "Delete Notification Success", Success = true };
            }
            return new OperationResult { Caption = "Failed", Message = "Fail on Delete Notification", Success = false };


        }

        public async Task<NotificationCountResult> GetNotification()
        {
            var count = _notificationRepository.FindAll().CountAsync();
            NotificationCountResult result = new NotificationCountResult
            {
                Count = await count
            };
            return result;
        }

        public async Task<List<NotificationResult>> GetAllNotification()
        {
            var result = _notificationRepository.FindAll().OrderByDescending(x => x.Id).Select(x => new NotificationResult
            {
                EmployeeName = x.EmployeeName,
                TranType = x.TranType
            });
            return await result.ToListAsync();
        }
    }
}