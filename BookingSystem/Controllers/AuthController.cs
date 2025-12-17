using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BookingSystem.Entities;
using BookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using BookingSystem.Dtos.Auth;

namespace BookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthServices authService) : ControllerBase
    {
        public static User user = new();

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegisterDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
            {
                return BadRequest("Username already exists");
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            var result = await authService.LoginAsync(request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Error });
            }

            return Ok(result.TokenResponse);
        }


        [Authorize]
        [HttpPost("update-profile")]
        public async Task<ActionResult<User>> UpdateProfile(UpdateProfileDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }

            var updatedUser = await authService.UpdateProfileAsync(userId, request);
            if (updatedUser is null)
            {
                return BadRequest("Failed to update profile. Email may already be in use.");
            }

            return Ok(updatedUser);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<ActionResult<object>> ChangePassword(ChangePasswordDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim is null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }

            var success = await authService.ChangePasswordAsync(userId, request);
            if (!success)
            {
                return BadRequest("Failed to change password. Current password may be incorrect.");
            }

            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<TokenResponseDto?>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            var tokenResponse = await authService.RefreshTokensAsync(request);
            if (tokenResponse is null) return Unauthorized(new { message = "Invalid refresh token" });

            return Ok(tokenResponse);
        }

    }
}
