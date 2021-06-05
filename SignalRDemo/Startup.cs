using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using SignalRDemo.Data;
using Microsoft.AspNetCore.Http.Connections;
using SignalRDemo.Models.Hubs;
using signalRDemo._Repositories.Interfaces;
using signalRDemo._Repositories.Repositories;
using signalRDemo._Services.Interfaces;
using signalRDemo._Services.Services;

namespace SignalRDemo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SignalRDemo", Version = "v1" });
            });

            services.AddDbContext<MyDbContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("MyDbContext")));

            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowAnyOrigin();
            }));

            services.AddSignalR();

            //Repository
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();

            //Services
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<INotificationService, NotificationService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SignalRDemo v1"));
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors("CorsPolicy");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<BroadcastHub>("/notify", options => options.Transports = HttpTransportType.WebSockets);
            });
        }
    }
}
