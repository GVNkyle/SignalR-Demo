using System.Threading.Tasks;
using signalRDemo.Helpers.Params;
using signalRDemo.Helpers.Utilities;
using SignalRDemo.Models;

namespace signalRDemo._Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<PageListUtility<Employee>> GetAllEmployee(SortParams[] sortParams, PaginationParams paginationParams, string filter);
        Task<OperationResult> EditEmployee(string id, Employee employee);
        Task<OperationResult> CreateEmployee(Employee employee);
        Task<OperationResult> DeleteEmployee(string id);
    }
}