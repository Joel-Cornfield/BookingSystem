import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classes, sessions as sessionApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BookingsContext } from '../context/BookingsContext';

export const ClassDetails = () => {
  const { classBookings, bookClassSession } = useContext(BookingsContext);
  const { id } = useParams();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const classInfo = await classes.getById(id);
        const sessionList = await classes.getSessions(id);
        setClassData(classInfo);
        setSessions(sessionList || []);
      } catch (err) {
        setError(err.message || 'Failed to load class details');
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [id]);

  const handleBooking = async (sessionId) => {
    setLoading(true);
    setError('');

    try {
      await bookClassSession(sessionId);

      // Optionally, refetch sessions to update capacity UI
      const updatedSessions = await classes.getSessions(id);
      setSessions(updatedSessions || []);

    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Class</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/classes" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Class Not Found</h2>
          <p className="text-gray-600 mb-4">The class you're looking for doesn't exist.</p>
          <Link to="/classes" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <Link 
          to="/classes" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Classes
        </Link>

        {/* Class Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">🏋️</span>
            </div>

            {/* Class Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{classData.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{classData.description}</p>
              
              {/* Trainer Info */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {classData.trainerName?.charAt(0) || 'T'}
                </div>
                <div>
                  <p className="text-xs text-gray-600">Led by</p>
                  <p className="font-semibold text-gray-900">{classData.trainerName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Available Sessions
          </h2>

          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((session) => {
                const startDate = new Date(session.startTime);
                const endDate = new Date(session.endTime);
                const currentEnrolled = session.currentBookingCount;
                const isFullyBooked = currentEnrolled >= session.maxCapacity;
                const spotsLeft = session.maxCapacity - currentEnrolled;
                const alreadyBooked = classBookings.some(b => b.sessionId === session.id);

                return (
                  <div 
                    key={session.id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                  >
                    {/* Date & Time */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📆</span>
                        <p className="font-bold text-gray-900 text-lg">
                          {startDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">🕐</span>
                        <p className="font-medium">
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Capacity Info */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Capacity</span>
                        <span className="text-sm font-bold text-gray-900">
                          {currentEnrolled}/{session.maxCapacity}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            isFullyBooked 
                              ? 'bg-red-500' 
                              : spotsLeft <= 3 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${(currentEnrolled / session.maxCapacity) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Spots Left */}
                      <p className={`text-xs mt-1 font-medium ${
                        isFullyBooked 
                          ? 'text-red-600' 
                          : spotsLeft <= 3 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                      }`}>
                        {isFullyBooked 
                          ? 'Fully Booked' 
                          : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`
                        }
                      </p>
                    </div>

                    {/* Book Button */}
                    <button 
                      disabled={isFullyBooked || alreadyBooked}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        isFullyBooked || alreadyBooked
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}

                      onClick={() => !alreadyBooked && !isFullyBooked && handleBooking(session.id)}
                    >
                      {alreadyBooked ? 'Already Enrolled' : isFullyBooked ? 'Session Full' : 'Book This Session'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-300 p-12 rounded-2xl text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Sessions Available</h3>
              <p className="text-gray-600">Check back soon for upcoming sessions!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};