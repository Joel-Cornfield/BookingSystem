using System;
using BookingSystem.Data;
using BookingSystem.Dtos.Trainers;
using BookingSystem.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Services;

public class TrainerService(AppDbContext context) : ITrainerServices, ITrainerAdminServices
{
    public async Task<PersonalTrainerSession> BookSession(Guid memberId, Guid trainerId, BookTrainerRequestDto request)
    {
        var trainer = await context.Users.FindAsync(trainerId);

        if (trainer is null)
        {
            throw new Exception("Trainer does not exist");
        }

        // Check for any conflicting classes
        var conflictBooking = await context.ClassBookings
            .Include(b => b.Session)
            .Where(b => b.UserId == memberId)
            .FirstOrDefaultAsync(b => b.Session.StartTime < request.EndTime && b.Session.EndTime > request.StartTime);

        // Check if trainer already has a booking then 
        var conflictTrainer = await context.PersonalTrainerSessions
            .Where(b => b.TrainerId == trainerId && b.Status == "Approved")
            .FirstOrDefaultAsync(b => b.StartTime < request.EndTime && b.EndTime > request.StartTime);

        
        if (conflictBooking is not null)
        {
            throw new Exception("You have a conflicting class");
        }

        if (conflictTrainer is not null)
        {
            throw new Exception("Trainer already has a conflicting session");
        }

        // Create new booking
        var booking = new PersonalTrainerSession
        {
            TrainerId = trainerId,
            MemberId = memberId, 
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = "Pending"
        };

        context.PersonalTrainerSessions.Add(booking);
        await context.SaveChangesAsync();

        return booking;
    }

    public async Task<bool> CancelSession(Guid userId, Guid sessionId)
    {
        var session = await context.PersonalTrainerSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.MemberId == userId);

        if (session is null)
        {
            throw new Exception("Session not found");
        }

        context.PersonalTrainerSessions.Remove(session);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<List<TrainerSessionDto>> GetMemberTrainerSessions(Guid memberId)
    {
        var sessions = await context.PersonalTrainerSessions
            .Where(s => s.MemberId == memberId)
            .Include(s => s.Trainer)
            .ToListAsync();

        return sessions.Select(s => new TrainerSessionDto
        {
            Id = s.Id,
            TrainerName = s.Trainer?.FullName ?? string.Empty,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            Status = s.Status
        }).ToList();
    }

    public async Task<bool> UpdateStatus(Guid sessionId, string status)
    {
        var session = await context.PersonalTrainerSessions.FindAsync(sessionId);

        if (session is null)
        {
            throw new Exception("Session not found");
        }

        session.Status = status;
        await context.SaveChangesAsync();
        return true;
    }

    // Admin methods
    public async Task<User> CreateTrainerAsync(CreateTrainerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new Exception("FullName, Email, and Password are required");
        }

        if (await context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            throw new Exception("Email already exists");
        }
        
        var user = new User();
        var hashedPassword = new PasswordHasher<User>().HashPassword(user, dto.Password);

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.PasswordHash = hashedPassword;
        user.Role = "Trainer";

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    public async Task<bool> PromoteUserToTrainerAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId);

        if (user is null)
        {
            throw new Exception("User not found");
        }

        if (user.Role == "Trainer")
        {
            return false; // Already a trainer
        }

        user.Role = "Trainer";
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateTrainerAsync(Guid trainerId)
    {
        var trainer = await context.Users.FindAsync(trainerId);

        if (trainer is null)
        {
            throw new Exception("Trainer not found");
        }

        if (trainer.Role != "Trainer")
        {
            return false; // Not a trainer
        }

        trainer.Role = "Member"; 
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<List<TrainerSessionDto>> GetTrainerSessionsAsync(Guid trainerId)
    {
        return await context.PersonalTrainerSessions
            .Where(s => s.TrainerId == trainerId)
            .Include(s => s.Member)
            .OrderByDescending(s => s.StartTime)
            .Select(s => new TrainerSessionDto
            {
                Id = s.Id,
                MemberName = s.Member.FullName,
                MemberEmail = s.Member.Email,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                Status = s.Status
            })
            .ToListAsync();
    }
}
