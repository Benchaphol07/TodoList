namespace TodoApi.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public int Status { get; set; }   // 0 = To Do, 1 = In Progress, 2 = Done
}
