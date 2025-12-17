import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingsContext } from '../context/BookingsContext';
import { UpcomingSessionCard } from '../components/UpcomingSessionCard';
import { trainers } from '../api/client';
import { TrainerCard } from '../components/TrainerCard';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
  const { classBookings, trainerBookings, loading, error } = useContext(BookingsContext);
  const [trainerList, setTrainerList] = useState([]);

  // Find next upcoming session from both class and trainer bookings
  const upcomingSession = (() => {
    const now = new Date();
    const upcomingClasses = classBookings.filter(b => new Date(b.startTime) > now);
    const upcomingTrainers = trainerBookings.filter(b => new Date(b.startTime) > now);

    const allUpcoming = [...upcomingClasses, ...upcomingTrainers];
    if (allUpcoming.length === 0) return null;

    allUpcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return allUpcoming[0];
  })();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const trainersList = await trainers.getAll();
        setTrainerList(trainersList.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Welcome Back!
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Ready to crush your fitness goals today?</p>
            </div>
          </div>
        </div>

        {/* Upcoming Session */}
        <div className="mb-10">
          <UpcomingSessionCard session={upcomingSession} />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Link to="/classes" className="group relative bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📚</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">Browse Classes</h3>
                <p className="text-sm text-gray-600 group-hover:text-blue-50 mt-2 transition-colors duration-300">
                  Explore all available classes
                </p>
              </div>
            </Link>

            <Link to="/bookings" className="group relative bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📅</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">My Bookings</h3>
                <p className="text-sm text-gray-600 group-hover:text-purple-50 mt-2 transition-colors duration-300">
                  View all your sessions
                </p>
              </div>
            </Link>

            <Link to="/trainers" className="group relative bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">👨‍🏫</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">Trainers</h3>
                <p className="text-sm text-gray-600 group-hover:text-green-50 mt-2 transition-colors duration-300">
                  Book a personal trainer
                </p>
              </div>
            </Link>

            <Link to="/account" className="group relative bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">⚙️</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">Account</h3>
                <p className="text-sm text-gray-600 group-hover:text-orange-50 mt-2 transition-colors duration-300">
                  Manage your profile
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Trainers */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              Recommended Trainers
            </h2>
            <Link to="/trainers" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group transition-colors">
              View All 
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {trainerList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainerList.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-300 p-12 rounded-2xl text-center">
              <div className="text-5xl mb-4">🏋️</div>
              <p className="text-gray-600 font-medium">No trainers available at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for new trainers!</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Error loading dashboard</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
