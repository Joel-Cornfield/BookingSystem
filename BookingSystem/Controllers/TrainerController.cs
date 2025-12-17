using System.Globalization;
using System.Linq.Expressions;
using System.Security.Claims;
using BookingSystem.Data;
using BookingSystem.Dtos.Trainers;
using BookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TrainerController(ITrainerServices trainerSessionServices, ITrainerAdminServices trainerAdminServices, AppDbContext context) : ControllerBase
    {
        // Get all trainers
        // GET /api/trainer/trainers
        [HttpGet("trainers")]
        [AllowAnonymous]
        public async Task<ActionResult> GetAllTrainers()
        {
            try
            {
                var trainers = await context.Users
                    .Where(u => u.Role == "Trainer")
                    .Select(t => new { t.Id, t.FullName, t.Email, t.ProfileImage })
                    .ToListAsync();
                
                return Ok(trainers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get trainer by id
        // GET /api/trainer/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetTrainerById(Guid id)
        {
            try
            {
                var trainer = await context.Users
                .Where(u => u.Id == id && u.Role == "Trainer")
                .Select(u => new 
                { 
                    u.Id, 
                    u.FullName, 
                    u.Email,
                    u.ProfileImage,
                    u.Bio,
                    u.Specializations,
                    u.YearsExperience,
                    u.ClientsTrained,
                    u.Rating
                })
                .FirstOrDefaultAsync();

                if (trainer == null)
                    return NotFound(new { message = "Trainer not found" });

                return Ok(trainer);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Book a personal training session
        // POST /api/trainer/{id}/book
        [HttpPost("{id}/book")]
        public async Task<ActionResult> BookSession(
            [FromRoute] Guid id,
            [FromBody] BookTrainerRequestDto request)
        {
            try
            {
                var userId = GetUserIdFromClaims();

                var session = await trainerSessionServices.BookSession(
                    userId,
                    id,
                    request
                );

                return Ok(new
                {
                    message = "Training session requested successfully",
                    sessionId = session.Id,
                    status = session.Status
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Cancel a training session booking
        // DELETE /api/trainer/{id}/cancel
        [HttpDelete("{id}/cancel")] 
        public async Task<ActionResult> CancelSession([FromRoute] Guid id)
        {
            try
            {
                var memberId = GetUserIdFromClaims();
                var result = await trainerSessionServices.CancelSession(memberId, id);

                if (!result)
                {
                    return BadRequest(new { message = "Session is already cancelled"});
                }

                return Ok(new { message = "Session successfully cancelled" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get all trainer sessions for the current member
        // GET /api/trainer/member/sessions
        [HttpGet("member/sessions")]
        public async Task<ActionResult> GetMemberSessions()
        {
            try
            {
                var memberId = GetUserIdFromClaims();
                var sessions = await trainerSessionServices.GetMemberTrainerSessions(memberId);

                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update a session's status (Admin/Trainer only)
        // PATCH /api/trainer/{id}/update
        [Authorize(Roles = "Trainer")]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult> UpdateSessionStatus(Guid id, [FromBody] UpdateSessionStatusDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest("Status is required");
            try
            {
                var result = await trainerSessionServices.UpdateStatus(id, dto.Status);
                if (!result)
                {
                    return BadRequest(new { message = "Failed to update session status" });
                }

                return Ok(new { message = "Session status successfully updated" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Admin endpoints
        
        // Create a new trainer (Admin only)
        // POST /api/trainer/admin/create
        [HttpPost("admin/create")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateTrainer([FromBody] CreateTrainerDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var trainer = await trainerAdminServices.CreateTrainerAsync(dto);

                return Ok(new
                {
                    message = "Trainer created successfully",
                    trainerId = trainer.Id,
                    email = trainer.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Promote user to a trainer (Admin only)
        // POST /api/trainer/admin/{userId}/promote
        [HttpPost("admin/{userId}/promote")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> PromoteToTrainer(Guid userId)
        {
            try
            {
                var result = await trainerAdminServices.PromoteUserToTrainerAsync(userId);

                if (!result)
                {
                    return BadRequest(new { message = "User is already a trainer"});
                }

                return Ok(new { message = "User successfully promoted to trainer" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Deactivate a trainer (Admin only)
        // POST /api/trainer/admin/{trainerId}/deactivate
        [HttpPost("admin/{trainerId}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeactivateTrainer(Guid trainerId)
        {
            try
            {
                var result = await trainerAdminServices.DeactivateTrainerAsync(trainerId);

                if (!result)
                {
                    return BadRequest(new { message = "User is not a trainer"});
                } 
                
                return Ok(new { message = "Trainer deactivated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get trainer's own PT sessions
        // GET /api/trainer/sessions
        [Authorize(Roles = "Trainer")]
        [HttpGet("sessions")]
        public async Task<ActionResult> GetMyTrainerSessions()
        {
            try
            {
                var trainerId = GetUserIdFromClaims();

                var sessions = await trainerSessionServices.GetTrainerSessionsAsync(trainerId);

                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Extract userId from JWT claims
        private Guid GetUserIdFromClaims()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new Exception("User ID not found in claims");
            }

            return userId;
        }
    }
}
