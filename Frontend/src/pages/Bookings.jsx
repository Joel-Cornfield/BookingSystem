import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingsContext } from '../context/BookingsContext';

export const Bookings = () => {
  const {
    classBookings,
    trainerBookings,
    loading,
    error,
    cancelClassBooking,
    cancelTrainerSession,
  } = useContext(BookingsContext);

  const handleCancelClass = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this class booking?')) {
      return;
    }
    await cancelClassBooking(bookingId);
  };

  const handleCancelTrainer = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this personal trainer session?')) {
      return;
    }
    await cancelTrainerSession(bookingId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Bookings</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const hasNoBookings = classBookings.length === 0 && trainerBookings.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-900 to-red-900 bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Manage your upcoming sessions
              </p>
            </div>
          </div>
        </div>

        {/* No Bookings State */}
        {hasNoBookings ? (
          <div className="bg-white border-2 border-dashed border-gray-300 p-16 rounded-2xl text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">Start your fitness journey by booking a class or personal trainer!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/classes"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Classes
              </Link>
              <Link
                to="/trainers"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Find a Trainer
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ===================== */}
            {/* CLASS BOOKINGS */}
            {/* ===================== */}
            {classBookings.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl lg:text-3xl text-black font-bold mb-6 flex items-center gap-2">
                  Class Bookings
                  <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                    {classBookings.length}
                  </span>
                </h2>

                <div className="space-y-4">
                  {classBookings.map((booking) => {
                    const startDate = new Date(booking.startTime);
                    const endDate = new Date(booking.endTime);
                    const isPast = endDate < new Date();

                    return (
                      <div
                        key={booking.id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                          isPast ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Status Bar */}
                        <div
                          className={`h-2 ${
                            isPast
                              ? 'bg-gray-400'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                        ></div>

                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Booking Info */}
                            <div className="flex-1">
                              {/* Class Name */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <span className="text-2xl">🏋️</span>
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900">
                                    {booking.className}
                                  </h3>
                                  {isPast && (
                                    <span className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium mt-1">
                                      Completed
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Date & Time */}
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <span className="text-lg">📆</span>
                                  <p className="font-semibold">
                                    {startDate.toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="text-lg">🕐</span>
                                  <p className="font-medium">
                                    {startDate.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    {' - '}
                                    {endDate.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Trainer */}
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {booking.trainerName?.charAt(0) || 'T'}
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Trainer</p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {booking.trainerName}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Cancel Button */}
                            {!isPast && (
                              <div className="flex md:flex-col gap-2">
                                <button
                                  onClick={() => handleCancelClass(booking.id)}
                                  className="flex-1 md:flex-none bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                                >
                                  Cancel Booking
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ===================== */}
            {/* PERSONAL TRAINER BOOKINGS */}
            {/* ===================== */}
            {trainerBookings.length > 0 && (
              <section>
                <h2 className="text-2xl lg:text-3xl text-black font-bold mb-6 flex items-center gap-2">
                  Personal Trainer Sessions
                  <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full">
                    {trainerBookings.length}
                  </span>
                </h2>

                <div className="space-y-4">
                  {trainerBookings.map((booking) => {
                    const startDate = new Date(booking.startTime);
                    const endDate = new Date(booking.endTime);
                    const isPast = endDate < new Date();
                    const canCancel = !isPast && booking.status === 'Pending';

                    return (
                      <div
                        key={booking.id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                          isPast ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Status Bar */}
                        <div
                          className={`h-2 ${
                            isPast
                              ? 'bg-gray-400'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                        ></div>

                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Booking Info */}
                            <div className="flex-1">
                              {/* Trainer Name */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-s font-bold">
                                  {booking.trainerName?.charAt(0) || 'T'}
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900">
                                    {booking.trainerName}
                                  </h3>
                                  <span
                                    className={`inline-block text-xs px-2 py-1 rounded-full font-medium mt-1 ${
                                      booking.status === 'Confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : isPast
                                        ? 'bg-gray-200 text-gray-700'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {isPast ? 'Completed' : booking.status}
                                  </span>
                                </div>
                              </div>

                              {/* Date & Time */}
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <span className="text-lg">📆</span>
                                  <p className="font-semibold">
                                    {startDate.toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="text-lg">🕐</span>
                                  <p className="font-medium">
                                    {startDate.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    {' - '}
                                    {endDate.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Session Type (if available) */}
                              {booking.sessionType && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-gray-500">Session Type:</span>
                                  <span className="text-sm font-semibold text-gray-800">
                                    {booking.sessionType}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Cancel Button */}
                            {canCancel && (
                              <div className="flex md:flex-col gap-2">
                                <button
                                  onClick={() => handleCancelTrainer(booking.id)}
                                  className="flex-1 md:flex-none bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                                >
                                  Cancel Session
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};