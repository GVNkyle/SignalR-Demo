using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using signalRDemo._Repositories.Interfaces;
using signalRDemo.Helpers.Params;
using SignalRDemo.Data;
using SignalRDemo.Models;

namespace signalRDemo._Repositories.Repositories
{
    public class EmployeeRepository : MyDbRepository<Employee>, IEmployeeRepository
    {
        private readonly MyDbContext _context;
        public EmployeeRepository(MyDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> isExist(Employee employee)
        {
            if (await _context.Employee.AnyAsync(x => x.Id == employee.Id))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}