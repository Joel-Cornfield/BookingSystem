using System;

namespace BookingSystem.Dtos;

public class ClassBookingDto
{
    public Guid Id { get; set; }
    public Guid SessionId { get; set; }
    public Guid UserId { get; set; }
    
    public DateTime StartTime { get; set; }  // Match ClassSession.StartTime
    public DateTime EndTime { get; set; }    // Match ClassSession.Endtime 
    public string ClassName { get; set; } = string.Empty;
    public string TrainerName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
