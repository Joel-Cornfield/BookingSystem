using System.Security.Claims;
using BookingSystem.Entities;
using BookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SessionsController(ISessionServices sessionService) : ControllerBase
    {
        // Book a class session
        // POST /api/sessions/{id}/book
        [HttpPost("{id}/book")]
        public async Task<ActionResult> BookSession(Guid id)
        {
            try
            {
                var userId = GetUserIdFromClaims();

                var booking = await sessionService.BookSession(userId, id);

                return Ok(booking);
            }
            catch (Exception ex)
            {
                
                return BadRequest(new { message = ex.Message });
            }
        }

        // Cancel a booking
        // POST /api/sessions/{id}/cancel
        [HttpPost("{id}/cancel")]
        public async Task<ActionResult> CancelBooking(Guid id)
        {
            try
            {
                var userId = GetUserIdFromClaims();

                var result = await sessionService.CancelBooking(userId, id);

                if (!result)
                {
                    return BadRequest(new { message = "Booking is already cancelled"});
                }

                return Ok (new { message = "Booking cancelled successfully"});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get all bookings for current user
        // GET /api/sessions/member/sessions
        [HttpGet("member/sessions")]
        public async Task<ActionResult> GetMemberBookings()
        {
            try
            {
                var userId = GetUserIdFromClaims();

                var bookings = await sessionService.GetMemberBookings(userId);

                return Ok(bookings);
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
