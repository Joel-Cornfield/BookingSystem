using System;
using BookingSystem.Data;
using BookingSystem.Dtos;
using BookingSystem.Dtos.Classes;
using BookingSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Services;

public class ClassServices(AppDbContext context) : IClassServices, IClassAdminServices
{
    public async Task<List<ClassDto>> GetAllClasses()
    {
        var classes = await context.Classes
            .Include(c => c.Trainer)
            .ToListAsync();

        return classes.Select(c => new ClassDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            TrainerName = c.Trainer?.FullName ?? "Unknown",
        }).ToList();
    }

    public async Task<List<ClassSessionDto>> GetSessionsByClass(Guid classId)
    {
        var sessions = await context.ClassSessions
            .Where(cs => cs.ClassId == classId)
            .Include(cs => cs.Bookings)
            .ToListAsync();

        return sessions.Select(s => new ClassSessionDto
        {
            Id = s.Id,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            Room = s.Room,
            MaxCapacity = s.MaxCapacity,
            CurrentBookingCount = s.Bookings.Count,
            Bookings = s.Bookings.Select(b => new ClassBookingDto 
            {
                UserId = b.UserId,
            }).ToList()
        }).ToList();
    }

    public async Task<ClassDetailsDto?> GetClassById(Guid classId)
    {
        var cls = await context.Classes
            .Where(c => c.Id == classId)
            .Include(c => c.Trainer)
            .Include(c => c.Sessions)
                .ThenInclude(s => s.Bookings)
            .FirstOrDefaultAsync();

        if (cls is null) return null;

        var dto = new ClassDetailsDto
        {
            Id = cls.Id,
            Name = cls.Name,
            Description = cls.Description,
            TrainerName = cls.Trainer?.FullName ?? "Unknown",
            Sessions = cls.Sessions.Select(s => new ClassSessionDto
            {
                Id = s.Id,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Room = s.Room,
                CurrentBookingCount = s.Bookings.Count
            }).OrderBy(s => s.StartTime).ToList()
        };

        return dto;
    }

    // Admin methods
    public async Task<Class> CreateClass(CreateClassRequest request)
    {
        var trainer = await context.Users.FindAsync(request.TrainerId);
        
        if (trainer is null) 
        {
            return null;
        }
        var newClass = new Class();

        newClass.Name = request.Name;
        newClass.Description = request.Description;
        newClass.TrainerId = request.TrainerId;

        context.Classes.Add(newClass);
        await context.SaveChangesAsync();

        return newClass;
    }

    public async Task<ClassSession> CreateSession(Guid classId, CreateSessionDto request)
    {
        var classCheck = await context.Classes.FindAsync(classId);

        if (classCheck is null)
        {
            return null;
        }

        var session = new ClassSession();

        session.ClassId = classId;
        session.StartTime = request.StartTime;
        session.EndTime = request.EndTime;
        session.Room = request.Room;
        session.MaxCapacity = request.MaxCapacity;

        context.ClassSessions.Add(session);
        await context.SaveChangesAsync();

        return session;
    }

    public async Task<Class> UpdateClass(Guid classId, UpdateClassDto dto)
    {
        var existing = await context.Classes.FindAsync(classId);
        if (existing is null) return null;

        if (!string.IsNullOrEmpty(dto.Name)) existing.Name = dto.Name;
        if (!string.IsNullOrEmpty(dto.Description)) existing.Description = dto.Description;
        if (dto.TrainerId.HasValue)
        {
            var trainer = await context.Users.FindAsync(dto.TrainerId.Value);
            if (trainer is null) throw new Exception("Trainer not found");
            existing.TrainerId = dto.TrainerId.Value;
        }

        await context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteClass(Guid classId)
    {
        var existing = await context.Classes
            .Include(c => c.Sessions)
                .ThenInclude(s => s.Bookings)
            .FirstOrDefaultAsync(c => c.Id == classId);

        if (existing is null) return false;

        // Prevent deletion if any session has active bookings
        var hasActive = existing.Sessions.Any();
        if (hasActive) throw new Exception("Cannot delete class with active bookings");

        // Remove related sessions and bookings (they should be empty or cancelled)
        context.ClassSessions.RemoveRange(existing.Sessions);
        context.Classes.Remove(existing);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<ClassSession> UpdateSession(Guid sessionId, UpdateSessionDto dto)
    {
        var session = await context.ClassSessions.FindAsync(sessionId);
        if (session is null) return null;

        if (dto.StartTime.HasValue) session.StartTime = dto.StartTime.Value;
        if (dto.EndTime.HasValue) session.EndTime = dto.EndTime.Value;
        if (!string.IsNullOrEmpty(dto.Room)) session.Room = dto.Room;
        if (dto.MaxCapacity.HasValue) session.MaxCapacity = dto.MaxCapacity.Value;

        await context.SaveChangesAsync();
        return session;
    }

    public async Task<bool> DeleteSession(Guid sessionId)
    {
        var session = await context.ClassSessions
            .Include(s => s.Bookings)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session is null) return false;

        var hasActive = session.Bookings.Any();
        if (hasActive) throw new Exception("Cannot delete session with active bookings");

        context.ClassSessions.Remove(session);
        await context.SaveChangesAsync();
        return true;
    }
}
