using System;
using System.Linq;
using System.Threading.Tasks;
using signalRDemo._Repositories.Interfaces;
using signalRDemo._Services.Interfaces;
using signalRDemo.Helpers.Params;
using signalRDemo.Helpers.Utilities;
using SignalRDemo.Models;

namespace signalRDemo._Services.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly INotificationRepository _notificationRepository;
        public EmployeeService(IEmployeeRepository employeeRepository, INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
            _employeeRepository = employeeRepository;

        }
        public async Task<OperationResult> CreateEmployee(Employee employee)
        {
            employee.Id = Guid.NewGuid().ToString();
            _employeeRepository.Add(employee);
            if (await _employeeRepository.isExist(employee))
            {
                return new OperationResult { Caption = "Failed", Message = "Fail on Create Model. Model Exists", Success = false };
            }
            else
            {
                Notification notification = new Notification()
                {
                    EmployeeName = employee.Name,
                    TranType = "Add"
                };
                _notificationRepository.Add(notification);
                if (await _employeeRepository.Save())
                {
                    return new OperationResult { Caption = "Success", Message = "Create Model Success", Success = true };
                }

                else
                {
                    return new OperationResult { Caption = "Failed", Message = "Fail on Create Model", Success = false };
                }
            }
        }

        public async Task<OperationResult> DeleteEmployee(string id)
        {
            var employee = await _employeeRepository.FindById(id);
            if (employee == null)
            {
                return new OperationResult { Caption = "Failed", Message = "Fail on Delete Model", Success = false };
            }
            Notification notification = new Notification()
            {
                EmployeeName = employee.Name,
                TranType = "Delete"
            };
            _notificationRepository.Add(notification);
            _employeeRepository.Remove(employee);
            if (await _employeeRepository.Save())
            {
                return new OperationResult { Caption = "Success", Message = "Delete Model Success", Success = true };
            }
            else
            {
                return new OperationResult { Caption = "Failed", Message = "Fail on Delete Model", Success = false };
            }
        }

        public async Task<OperationResult> EditEmployee(string id, Employee employee)
        {
            if (id != employee.Id)
            {
                return new OperationResult { Caption = "Failed", Message = "Fail on Update Model. Double check ID", Success = true };
            }
            Notification notification = new Notification()
            {
                EmployeeName = employee.Name,
                TranType = "Edit"
            };
            _notificationRepository.Add(notification);

            _employeeRepository.Update(employee);
            if (await _employeeRepository.Save())
            {
                return new OperationResult { Caption = "Success", Message = "Update Model Success", Success = true };
            }
            else
            {
                return new OperationResult { Caption = "Failed", Message = "Fail on Update Model", Success = false };
            }
        }


        public async Task<PageListUtility<Employee>> GetAllEmployee(SortParams[] sortParams, PaginationParams paginationParams, string filter)
        {
            var data = _employeeRepository.FindAll();
            if (!string.IsNullOrEmpty(filter))
            {
                data = data.Where(x => x.Name.Contains(filter));
            }
            var orderedData = data.OrderBy(x => 0);
            foreach (var sort in sortParams)
            {
                switch (sort.sortBy)
                {
                    case nameof(Employee.Name):
                        orderedData = sort.sortType == SortBy.Asc ? orderedData.ThenBy(x => x.Name) : orderedData.ThenByDescending(x => x.Name);
                        break;
                    case nameof(Employee.Address):
                        orderedData = sort.sortType == SortBy.Asc ? orderedData.ThenBy(x => x.Address) : orderedData.ThenByDescending(x => x.Address);
                        break;
                    default:
                        break;
                }
            }

            return await PageListUtility<Employee>.PageListAsync(orderedData, paginationParams.PageNumber, paginationParams.PageSize);
        }
    }
}