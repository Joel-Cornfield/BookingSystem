using System;
using BookingSystem.Dtos;

namespace BookingSystem.Services;

public interface ISessionServices
{
    Task<ClassBookingDto> BookSession(Guid userId, Guid sessionId);
    Task<bool> CancelBooking(Guid userId, Guid BookingId);
    Task<List<ClassBookingDto>> GetMemberBookings(Guid userId);
}
