using System.Security.Claims;
using BookingSystem.Data;
using BookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController(ICloudinaryService cloudinaryService, AppDbContext context) : ControllerBase
{
    // Upload profile image
    // POST /api/upload/profile
    [HttpPost("profile")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        try
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(file, "bookingsystem/profiles");
            
            if (imageUrl == null)
                return BadRequest("Image upload failed");

            // Update user's profile image
            var userId = GetUserIdFromClaims();
            var user = await context.Users.FindAsync(userId);
            
            if (user == null)
                return NotFound("User not found");

            user.ProfileImage = imageUrl;
            await context.SaveChangesAsync();

            return Ok(new { imageUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private Guid GetUserIdFromClaims()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException("User ID not found in claims"));
    }
}
