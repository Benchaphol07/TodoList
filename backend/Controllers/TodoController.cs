using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Hubs;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/todos")]
public class TodoController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHubContext<TodoHub> _hub;

    public TodoController(AppDbContext db, IHubContext<TodoHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    // แจ้งทุกหน้าจอที่เปิดอยู่ให้โหลดข้อมูลใหม่
    private Task Notify() => _hub.Clients.All.SendAsync("changed");

    [HttpGet]                                   // Read
    public async Task<List<TodoItem>> GetAll() =>
        await _db.TodoItems.OrderBy(t => t.Id).ToListAsync();

    [HttpPost]                                  // Create
    public async Task<TodoItem> Create(TodoItem item)
    {
        item.Id = 0;
        _db.TodoItems.Add(item);
        await _db.SaveChangesAsync();
        await Notify();
        return item;
    }

    [HttpPut("{id}")]                           // Update
    public async Task<IActionResult> Update(int id, TodoItem item)
    {
        var t = await _db.TodoItems.FindAsync(id);
        if (t == null) return NotFound();
        t.Title = item.Title;
        t.Description = item.Description;
        t.Status = item.Status;
        await _db.SaveChangesAsync();
        await Notify();
        return NoContent();
    }

    [HttpDelete("{id}")]                        // Delete
    public async Task<IActionResult> Delete(int id)
    {
        var t = await _db.TodoItems.FindAsync(id);
        if (t == null) return NotFound();
        _db.TodoItems.Remove(t);
        await _db.SaveChangesAsync();
        await Notify();
        return NoContent();
    }
}
