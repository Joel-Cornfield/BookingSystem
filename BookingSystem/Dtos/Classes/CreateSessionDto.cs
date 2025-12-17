using System;

namespace BookingSystem.Dtos.Classes;

public class CreateSessionDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Room { get; set; } = string.Empty;
    public int MaxCapacity { get; set; }
}
