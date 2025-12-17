using System;

namespace BookingSystem.Dtos.Auth;

public class TokenResponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required UserResponseDto User { get; set; }
}

public class UserResponseDto
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public required string Role { get; set; }
    public string? ProfileImage { get; set; }
}
