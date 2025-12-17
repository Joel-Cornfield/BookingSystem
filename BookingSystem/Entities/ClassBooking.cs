using System;

namespace BookingSystem.Entities;

public class ClassBooking
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public ClassSession Session { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
