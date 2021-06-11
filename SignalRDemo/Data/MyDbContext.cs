using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Models;

namespace SignalRDemo.Data
{
    public class MyDbContext : IdentityDbContext
    {
        public MyDbContext (DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Employee> Employee { get; set; }
        public DbSet<Notification> Notification { get; set; }
    }
}
