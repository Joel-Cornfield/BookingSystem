using System;

namespace BookingSystem.Dtos.Classes;

public class UpdateClassDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public Guid? TrainerId { get; set; }
}
