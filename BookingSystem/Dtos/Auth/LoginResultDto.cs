namespace BookingSystem.Dtos.Auth;

public class LoginResultDto
{
    public bool Success { get; set; }
    public string? Error { get; set; }
    public TokenResponseDto? TokenResponse { get; set; }
}
