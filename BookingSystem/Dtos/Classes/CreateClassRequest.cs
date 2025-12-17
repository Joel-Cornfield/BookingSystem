using System;

namespace BookingSystem.Dtos.Classes;

public class CreateClassRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public Guid TrainerId { get; set; }
}
