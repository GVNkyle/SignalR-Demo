using System.Threading.Tasks;
using signalRDemo.Helpers.Params;
using SignalRDemo.Models;

namespace signalRDemo._Repositories.Interfaces
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
        Task<bool> isExist(Employee employee);
    }
}