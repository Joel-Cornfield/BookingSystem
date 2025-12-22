using System;
using BookingSystem.Dtos.Classes;
using BookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassesController(IClassServices classService, IClassAdminServices classAdminService) : ControllerBase
{
    // Get all gym classes
    // GET /api/classes
    [HttpGet]
    public async Task<ActionResult<List<ClassDto>>> GetAllClasses()
    {
        var classes = await classService.GetAllClasses();
        return Ok(classes);
    }

    // Create a new gym class (Admin only)
    // POST /api/classes
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassDto>> CreateClass([FromBody] CreateClassRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var newClass = await classAdminService.CreateClass(request);

        if (newClass is null)
        {
            return BadRequest("Trainer not found");
        }

        var classDto = new ClassDto
        {
            Id = newClass.Id,
            Name = newClass.Name,
            Description = newClass.Description,
            TrainerName = newClass.Trainer?.FullName ?? "Unknown",
        };

        return CreatedAtAction(nameof(GetSessionsByClass), new { id = newClass.Id }, classDto);
    }

    // Update a gym class (Admin only)
    // PUT /api/classes/{id}/update
    [HttpPut("{id}/update")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassDto>> UpdateClass(Guid id, [FromBody] UpdateClassDto dto)
    {
        try
        {
            var updated = await classAdminService.UpdateClass(id, dto);
            
            if (updated is null)
            {
                return NotFound("Class not found");
            }

            var classDto = new ClassDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                TrainerName = updated.Trainer?.FullName ?? "Unknown",
            };

            return Ok(classDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Delete a gym class (Admin only)
    // DELETE /api/classes/{id}/delete
    [HttpDelete("{id}/delete")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteClass(Guid id)
    {
        try
        {
            var result = await classAdminService.DeleteClass(id);

            if (!result)
            {
                return NotFound("Class not found");
            }

            return Ok(new { message = "Class deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Create a session for a gym class (Admin or Trainer)
    // POST /api/classes/{id}/createsession
    [HttpPost("{id}/createsession")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult<ClassSessionDto>> CreateSession(Guid id, [FromBody] CreateSessionDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var session = await classAdminService.CreateSession(id, request);

        if (session is null)
        {
            return NotFound("Class not found");
        }

        var sessionDto = new ClassSessionDto
        {
            Id = session.Id,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Room = session.Room,
            MaxCapacity = session.MaxCapacity,
            CurrentBookingCount = 0
        };

        return CreatedAtAction(nameof(GetSessionsByClass), new { id }, sessionDto);
    }

    // Update a session (Admin or Trainer)
    // PUT /api/classes/sessions/{sessionId}/update
    [HttpPut("sessions/{sessionId}/update")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult<ClassSessionDto>> UpdateSession(Guid sessionId, [FromBody] UpdateSessionDto dto)
    {
        try
        {
            var updated = await classAdminService.UpdateSession(sessionId, dto);

            if (updated is null)
            {
                return NotFound("Session not found");
            }

            var sessionDto = new ClassSessionDto
            {
                Id = updated.Id,
                StartTime = updated.StartTime,
                EndTime = updated.EndTime,
                Room = updated.Room,
                CurrentBookingCount = updated.Bookings.Count
            };

            return Ok(sessionDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Delete a session (Admin or Trainer)
    // DELETE /api/classes/sessions/{sessionId}/delete
    [HttpDelete("sessions/{sessionId}/delete")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult> DeleteSession(Guid sessionId)
    {
        try
        {
            var result = await classAdminService.DeleteSession(sessionId);

            if (!result)
            {
                return NotFound("Session not found");
            }

            return Ok(new { message = "Session deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Get all sessions for a specific class with booking counts
    // GET /api/classes/{id}/sessions
    [HttpGet("{id}/sessions")]
    public async Task<ActionResult<List<ClassSessionDto>>> GetSessionsByClass(Guid id)
    {
        var sessions = await classService.GetSessionsByClass(id);
    
        // Always return OK, even if empty
        return Ok(sessions);
    }

    // Get class details including sessions
    // GET /api/classes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDetailsDto>> GetClassById(Guid id)
    {
        var cls = await classService.GetClassById(id);
        if (cls is null)
            return NotFound("Class not found");

        return Ok(cls);
    }
}
