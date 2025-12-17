using System;

namespace BookingSystem.Entities;

public class ClassSession
{
    public Guid Id { get; set; }

    public Guid ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public string Room { get; set; } = string.Empty;
    public int MaxCapacity { get; set; }

    public List<ClassBooking> Bookings { get; set; } = new();
}
