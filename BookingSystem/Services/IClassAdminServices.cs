using System;
using BookingSystem.Dtos.Classes;
using BookingSystem.Entities;

namespace BookingSystem.Services;

public interface IClassAdminServices
{
    Task<Class> CreateClass(CreateClassRequest request);
    Task<Class> UpdateClass(Guid classId, UpdateClassDto dto);
    Task<bool> DeleteClass(Guid classId);

    Task<ClassSession> CreateSession(Guid classId, CreateSessionDto dto);
    Task<ClassSession> UpdateSession(Guid sessionId, UpdateSessionDto dto);
    Task<bool> DeleteSession(Guid sessionId);
}
