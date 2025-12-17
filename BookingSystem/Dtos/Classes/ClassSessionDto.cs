using System;

namespace BookingSystem.Dtos.Classes;

public class ClassSessionDto
{
    public Guid Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Room { get; set; } = string.Empty;
    public int MaxCapacity { get; set; }
    public int CurrentBookingCount { get; set; }

    public List<ClassBookingDto> Bookings { get; set; } = new();
}
