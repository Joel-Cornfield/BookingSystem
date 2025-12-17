using System;

namespace BookingSystem.Entities;

public class User
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Member";
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public string? ProfileImage { get; set; } 

    // Trainer-specific fields (nullable)
    public string? Bio { get; set; }
    public string? Specializations { get; set; } // e.g., comma-separated string
    public int? YearsExperience { get; set; }
    public int? ClientsTrained { get; set; }
    public double? Rating { get; set; }
}
