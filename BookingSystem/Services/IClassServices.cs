using System;
using BookingSystem.Dtos.Classes;
using BookingSystem.Entities;

namespace BookingSystem.Services;

public interface IClassServices
{
    Task<List<ClassDto>> GetAllClasses();
    Task<List<ClassSessionDto>> GetSessionsByClass(Guid classId);
    Task<ClassDetailsDto?> GetClassById(Guid classId);
}
