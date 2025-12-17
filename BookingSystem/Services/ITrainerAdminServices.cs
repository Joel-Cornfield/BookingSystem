using System;
using BookingSystem.Dtos.Trainers;
using BookingSystem.Entities;

namespace BookingSystem.Services;

public interface ITrainerAdminServices
{
    Task<User> CreateTrainerAsync(CreateTrainerDto dto);
    Task<bool> PromoteUserToTrainerAsync(Guid userId);
    Task<bool> DeactivateTrainerAsync(Guid trainerId);
}
