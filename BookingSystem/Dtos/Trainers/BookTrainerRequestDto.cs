using System;

namespace BookingSystem.Dtos.Trainers;

public class BookTrainerRequestDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
