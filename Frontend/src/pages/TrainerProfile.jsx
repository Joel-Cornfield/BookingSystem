import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trainers } from '../api/client';
import { BookingsContext } from '../context/BookingsContext';

export const TrainerProfile = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const { bookTrainerSession, trainerBookings } = useContext(BookingsContext);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const data = await trainers.getById(id);
        setTrainer(data);
      } catch (err) {
        setError(err.message || 'Failed to load trainer');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [id]);

  const handleBooking = async () => {
    setBookingError('');
    setBookingLoading(true);

    try {
      debugger
      if (!startTime) throw new Error("Start time is required");
      if (!endTime) throw new Error("End time is required");
      if (startTime >= endTime) throw new Error("End time must be after start time");

      const booking = await bookTrainerSession(
        id,
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString()
      );
      
      setShowBookingModal(false);
      setStartTime('');
      setEndTime('');
      alert('Session successfully requested')
      
    } catch (error) {
      setBookingError(error.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading trainer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Trainer</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/trainers" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Trainers
          </Link>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trainer Not Found</h2>
          <p className="text-gray-600 mb-4">This trainer profile doesn't exist.</p>
          <Link to="/trainers" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Trainers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <Link 
          to="/trainers" 
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Trainers
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Profile Image - Overlapping header */}
            <div className="-mt-16 mb-6">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl inline-block">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                  {trainer.profileImage ? (
                    <img 
                      src={trainer.profileImage} 
                      alt={trainer.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">👨‍🏫</span>
                  )}
                </div>
              </div>
            </div>

            {/* Trainer Info */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{trainer.fullName}</h1>
              
              {/* Contact Info */}
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{trainer.email}</span>
              </div>

              {/* Specializations */}
              {trainer.specializations && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specializations.split(',').map((spec, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm px-4 py-2 rounded-full font-medium border border-purple-200"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats (if available) */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl text-center border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{trainer.yearsExperience}+</div>
                  <div className="text-xs text-gray-600 font-medium">Years Experience</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl text-center border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{trainer.clientsTrained}+</div>
                  <div className="text-xs text-gray-600 font-medium">Clients Trained</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl text-center border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{trainer.rating}</div>
                  <div className="text-xs text-gray-600 font-medium">Rating ⭐</div>
                </div>
              </div>

              {/* Bio Section (placeholder) */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {trainer.bio || ""}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button onClick={() => setShowBookingModal(true)} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-101">
                  Book a Session
                </button>
                <button className="px-6 py-4 rounded-xl border-2 border-purple-600 text-purple-600 font-bold hover:bg-purple-50 transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span>
            Available Classes
          </h3>
          <p className="text-gray-600">
            This trainer leads various fitness classes. Check the Classes page to see their upcoming sessions.
          </p>
          <Link 
            to="/classes" 
            className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-semibold"
          >
            Browse Classes →
          </Link>
        </div>
      </div>
      {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-fade-in">
              {/* Header */}
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Book Personal Trainer Session
              </h2>

              {/* Form */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                {bookingError && <p className="text-red-600 text-sm">{bookingError}</p>}
                {bookingLoading && <p className="text-blue-600 text-sm">Processing...</p>}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition shadow-lg"
                >
                  {bookingLoading ? 'Booking...' : 'Book'}
                </button>
              </div>
            </div>
          </div>
        )}
     </div>
  );
};