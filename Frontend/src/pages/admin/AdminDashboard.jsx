import { Link } from "react-router-dom";
import { classes, trainers } from "../../api/client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    classes: 0,
    trainers: 0,
    sessions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1️⃣ Fetch all classes
        const classList = await classes.getAll();

        // 2️⃣ Count sessions across all classes
        let sessionCount = 0;
        for (const cls of classList) {
          const sessions = await classes.getSessions(cls.id);
          sessionCount += sessions.length;
        }

        // 3️⃣ Fetch trainers
        const trainerList = await trainers.getAll();

        setStats({
          classes: classList.length,
          sessions: sessionCount,
          trainers: trainerList.length,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Admin Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/classes" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Classes
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full"></div>
            <div>
              <div className="flex items-center gap-2">

                <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-yellow-900 to-amber-900 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-600 mt-1 text-lg">
                Manage classes, sessions, and trainers across the system
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.classes}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 upperxscase tracking-wide">Total Classes</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.trainers}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Trainers</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.sessions}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Sessions</h3>
          </div>
        </div>

        {/* Management Cards */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            Management Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Manage Classes */}
            <Link
              to="/admin/classes"
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">📚</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                  Manage Classes
                </h3>
                <p className="text-gray-600 group-hover:text-blue-50 transition-colors duration-300">
                  Create, update, and delete fitness classes across the platform.
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-2 text-blue-600 group-hover:text-white font-semibold transition-colors duration-300">
                  <span>Manage</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-0 transition-opacity"></div>
            </Link>

            {/* Manage Sessions */}
            <Link
              to="/admin/sessions"
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">📅</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                  Manage Sessions
                </h3>
                <p className="text-gray-600 group-hover:text-emerald-50 transition-colors duration-300">
                  Manage class schedules, session availability, and booking limits.
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-2 text-emerald-600 group-hover:text-white font-semibold transition-colors duration-300">
                  <span>Manage</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-0 transition-opacity"></div>
            </Link>

            {/* Manage Trainers */}
            <Link
              to="/admin/trainers"
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">👨‍🏫</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                  Manage Trainers
                </h3>
                <p className="text-gray-600 group-hover:text-purple-50 transition-colors duration-300">
                  Approve new trainers and manage existing trainer accounts.
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-2 text-purple-600 group-hover:text-white font-semibold transition-colors duration-300">
                  <span>Manage</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-0 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}