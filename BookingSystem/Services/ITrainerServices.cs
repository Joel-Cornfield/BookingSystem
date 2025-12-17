using System;
using BookingSystem.Dtos.Trainers;
using BookingSystem.Entities;

namespace BookingSystem.Services;

public interface ITrainerServices
{
    Task<PersonalTrainerSession> BookSession(Guid memberId, Guid trainerId, BookTrainerRequestDto request);
    Task<bool> CancelSession(Guid userId, Guid sessionId);
    Task<bool> UpdateStatus(Guid sessionId, string status);
    Task<List<TrainerSessionDto>> GetMemberTrainerSessions(Guid memberId);
    Task<List<TrainerSessionDto>> GetTrainerSessionsAsync(Guid trainerId);
}
