using System;
using System.Collections.Generic;

namespace BookingSystem.Dtos.Classes;

public class ClassDetailsDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string TrainerName { get; set; } = string.Empty;
    public List<ClassSessionDto> Sessions { get; set; } = new();
}
