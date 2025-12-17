using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BookingSystem.Data;
using BookingSystem.Entities;
using BookingSystem.Dtos.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BookingSystem.Services;

public class AuthServices(AppDbContext context, IConfiguration configuration) : IAuthServices
{
    // =============================
    // REGISTER
    // =============================
    public async Task<User?> RegisterAsync(UserRegisterDto request)
    {
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
            return null;

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
        };

        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    // =============================
    // LOGIN
    // =============================
    public async Task<LoginResultDto> LoginAsync(UserLoginDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        // Always return the same error message if login fails
        if (user is null)
            return new LoginResultDto { Success = false, Error = "Invalid email or password" };

        var passwordCheck = new PasswordHasher<User>()
            .VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (passwordCheck == PasswordVerificationResult.Failed)
            return new LoginResultDto { Success = false, Error = "Invalid email or password" };

        var tokenResponse = await CreateTokenResponse(user);

        return new LoginResultDto
        {
            Success = true,
            TokenResponse = tokenResponse
        };
    }


    // =============================
    // REFRESH TOKENS
    // =============================
    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
        if (user is null) return null;

        return await CreateTokenResponse(user);
    }

    private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var user = await context.Users.FindAsync(userId);
        if (user is null 
            || user.RefreshToken != refreshToken 
            || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return null;
        }
        return user;
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
    {
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();
        return refreshToken;
    }

    // =============================
    // TOKEN CREATION
    // =============================
    private async Task<TokenResponseDto> CreateTokenResponse(User user)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(user),
            User = new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ProfileImage = user.ProfileImage
            }
        };
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration.GetValue<string>("AppSettings:Issuer"),
            audience: configuration.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60), // access token valid for 1 hour
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    // =============================
    // PROFILE & PASSWORD MANAGEMENT
    // =============================
    public async Task<User?> UpdateProfileAsync(Guid userId, UpdateProfileDto request)
    {
        var user = await context.Users.FindAsync(userId);
        if (user is null) return null;

        if (request.Email != user.Email && await context.Users.AnyAsync(u => u.Email == request.Email))
            return null;

        user.FullName = request.FullName;
        user.Email = request.Email;

        context.Users.Update(user);
        await context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto request)
    {
        var user = await context.Users.FindAsync(userId);
        if (user is null) return false;

        var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
        if (result == PasswordVerificationResult.Failed) return false;

        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.NewPassword);
        context.Users.Update(user);
        await context.SaveChangesAsync();
        return true;
    }
}
