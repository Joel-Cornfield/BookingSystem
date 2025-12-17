using System;

namespace BookingSystem.Entities;

public class Class
{
    public Guid Id { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public Guid TrainerId { get; set; } 
    public User Trainer { get; set; } = null!;

    public List<ClassSession> Sessions { get; set; } = new();
}
