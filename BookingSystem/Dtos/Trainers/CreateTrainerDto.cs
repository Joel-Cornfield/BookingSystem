using System;

namespace BookingSystem.Dtos.Trainers;

public class CreateTrainerDto
{
     public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // plain here; hash in service
}
