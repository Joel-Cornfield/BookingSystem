using System;

namespace BookingSystem.Dtos.Auth;

public class UserLoginDto
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}
