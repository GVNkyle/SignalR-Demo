using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using signalRDemo._Services.Interfaces;
using signalRDemo.Helpers.Params;
using signalRDemo.Helpers.Utilities;
using SignalRDemo.Data;
using SignalRDemo.Models;
using SignalRDemo.Models.Hubs;

namespace SignalRDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IHubContext<BroadcastHub, IHubClient> hubContext, IEmployeeService employeeService)
        {
            _hubContext = hubContext;
            _employeeService = employeeService;
        }

        // POST: api/Employees
        [HttpPost("GetAll")]
        public async Task<PageListUtility<Employee>> GetEmployee(SortParams[] sortParams, [FromQuery] PaginationParams paginationParams, [FromQuery] string filter)
        {
            // await _hubContext.Clients.All.BroadcastMessage();
            return await _employeeService.GetAllEmployee(sortParams, paginationParams, filter);
        }

        // PUT: api/Employees/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<OperationResult> EditEmployee(string id, Employee employee)
        {
            var res = await _employeeService.EditEmployee(id, employee);

            if (res.Success)
            {
                await _hubContext.Clients.All.BroadcastMessage();
                return new OperationResult { Caption = "Success", Message = "Update Model Success", Success = true };

            }
            return new OperationResult { Caption = "Failed", Message = "Fail on Update Model", Success = false };
        }

        // POST: api/Employees
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("create")]
        public async Task<OperationResult> CreateEmployee(Employee employee)
        {
            var res = await _employeeService.CreateEmployee(employee);
            if (res.Success)
            {
                await _hubContext.Clients.All.BroadcastMessage();
                return new OperationResult { Caption = "Success", Message = "Create Model Success", Success = true };
            }
            return new OperationResult { Caption = "Failed", Message = "Fail on Create Model", Success = false };
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<OperationResult> DeleteEmployee(string id)
        {
            var res = await _employeeService.DeleteEmployee(id);
            if (res.Success)
            {
                await _hubContext.Clients.All.BroadcastMessage();
                return new OperationResult { Caption = "Success", Message = "Delete Model Success", Success = true };
            }
            return new OperationResult { Caption = "Failed", Message = "Fail on Delete Model", Success = false };
        }

    }
}
