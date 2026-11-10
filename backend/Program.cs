using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5000");

builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));   // SignalR ต้องใช้ AllowCredentials

var app = builder.Build();

// Code First: สร้างฐานข้อมูลและตารางจาก Model ให้อัตโนมัติ
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();
}

app.UseCors();
app.MapControllers();
app.MapHub<TodoHub>("/hub");
app.Run();
