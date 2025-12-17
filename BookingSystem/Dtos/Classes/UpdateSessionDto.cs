using System;

namespace BookingSystem.Dtos.Classes;

public class UpdateSessionDto
{
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Room { get; set; }
    public int? MaxCapacity { get; set; }
}
