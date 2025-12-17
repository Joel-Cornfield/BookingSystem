using System;

namespace BookingSystem.Dtos.Trainers;

public class TrainerSessionDto
{
    public Guid Id { get; set; }
    public string TrainerName { get; set; } = string.Empty;
    public string MemberName { get; set; } = string.Empty;
    public string MemberEmail { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
}
