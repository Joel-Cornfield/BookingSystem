using System;

namespace BookingSystem.Entities;

public class PersonalTrainerSession
{
    public Guid Id { get; set; }

    public Guid TrainerId { get; set; }
    public User Trainer { get; set; } = null!;

    public Guid MemberId { get; set; }
    public User Member { get; set; } = null!;

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public string Status { get; set; } = "Pending";
}
