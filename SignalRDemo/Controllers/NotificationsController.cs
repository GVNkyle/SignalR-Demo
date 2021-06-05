using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using signalRDemo._Services.Interfaces;
using signalRDemo.Helpers.Utilities;
using SignalRDemo.Data;
using SignalRDemo.Models.Hubs;

namespace SignalRDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly INotificationService _notificationService;

        public NotificationsController(IHubContext<BroadcastHub, IHubClient> hubContext, INotificationService notificationService)
        {
            _hubContext = hubContext;
            _notificationService = notificationService;
        }

        // GET: api/Notifications
        [Route("getCount")]
        [HttpGet]
        public async Task<ActionResult<NotificationCountResult>> GetNotification()
        {
            return await _notificationService.GetNotification();

        }

        // GET: api/Notifications/5
        [Route("getAll")]
        [HttpGet]
        public async Task<ActionResult<List<NotificationResult>>> GetAllNotification()
        {
            return await _notificationService.GetAllNotification();
        }

        // DELETE: api/Notifications/5
        [Route("delete")]
        [HttpDelete]
        public async Task<OperationResult> DeleteNotification()
        {
            var res = await _notificationService.DeleteNotification();
            if (res.Success)
            {
                // await _hubContext.Clients.All.BroadcastMessage();
                return new OperationResult { Caption = "Success", Message = "Delete Notification Success", Success = true };
            }
            return new OperationResult { Caption = "Failed", Message = "Fail on Delete Notification", Success = false };
        }

    }
}
