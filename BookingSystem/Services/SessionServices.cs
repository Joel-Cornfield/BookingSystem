using System;
using BookingSystem.Data;
using BookingSystem.Dtos;
using BookingSystem.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Services;

public class SessionServices(AppDbContext context) : ISessionServices
{
    public async Task<ClassBookingDto> BookSession(Guid userId, Guid sessionId)
    {
        // Check session exists
        var session = await context.ClassSessions
            .Include(s => s.Class)
            .ThenInclude(c => c.Trainer)
            .Include(s => s.Bookings)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session is null)
        {
            throw new Exception("Session not found");
        }

        // Check if session is full
        var activeBookings = session.Bookings.Count();
        if (activeBookings >= session.MaxCapacity)
        {
            throw new Exception("Session is full");
        }

        // Check if user already has a conflicting booking
        var conflictBooking = await context.ClassBookings
            .Include(b => b.Session)
            .Where(b => b.UserId == userId)
            .FirstOrDefaultAsync(b => b.Session.StartTime < session.EndTime && b.Session.EndTime > session.StartTime);
        
        if (conflictBooking is not null)
        {
            throw new Exception("User already has a conflicting booking");
        }

        // Create a new booking 
        var booking = new ClassBooking
        {
            SessionId = sessionId,
            UserId = userId,
            // CreatedAt default is set in entity, but set eplicitly for clarity
            CreatedAt = DateTimeOffset.UtcNow,
        };

        context.ClassBookings.Add(booking);
        await context.SaveChangesAsync();

        // Return DTO
        return new ClassBookingDto
        {
            Id = booking.Id,
            SessionId = booking.SessionId,
            UserId = booking.UserId,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            ClassName = session.Class?.Name ?? string.Empty, 
            TrainerName = session.Class?.Trainer?.FullName ?? string.Empty,
            CreatedAt = booking.CreatedAt.UtcDateTime
        };
    }

    public async Task<bool> CancelBooking(Guid userId, Guid bookingId)
    {
        var booking = await context.ClassBookings
            .FirstOrDefaultAsync(b => b.UserId == userId && b.Id == bookingId);

        if (booking == null)
        {
            return false;
        }

        context.ClassBookings.Remove(booking);
        await context.SaveChangesAsync();

        return true;
    }


    public async Task<List<ClassBookingDto>> GetMemberBookings(Guid userId)
    {
        var bookings = await context.ClassBookings
            .Where(b => b.UserId == userId)
            .Include(b => b.Session)
                .ThenInclude(s => s.Class)
                    .ThenInclude(c => c.Trainer)
            .ToListAsync();

        if (bookings is null)
        {
            throw new Exception("No bookings found for this member");
        }

        return bookings.Select(b => new ClassBookingDto
        {
            Id = b.Id,
            SessionId = b.SessionId,
            UserId = b.UserId,
            StartTime = b.Session.StartTime,
            EndTime = b.Session.EndTime,
            ClassName = b.Session.Class?.Name ?? string.Empty, 
            TrainerName = b.Session.Class?.Trainer?.FullName ?? string.Empty,
            CreatedAt = b.CreatedAt.UtcDateTime
        }).ToList();
    }
}
