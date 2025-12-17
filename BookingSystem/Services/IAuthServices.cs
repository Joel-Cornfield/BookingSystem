using System;
using BookingSystem.Entities;
using BookingSystem.Dtos.Auth;

namespace BookingSystem.Services;

public interface IAuthServices
{
    Task<User?> RegisterAsync(UserRegisterDto request);
    Task<LoginResultDto> LoginAsync(UserLoginDto request);
    Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
    Task<User?> UpdateProfileAsync(Guid userId, UpdateProfileDto request);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto request);
}
