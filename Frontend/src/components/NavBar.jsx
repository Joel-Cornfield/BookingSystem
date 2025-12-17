import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white shadow-2xl border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-2xl font-bold hover:scale-105 transition-transform duration-200"
          >
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">💪</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              FitBooking
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* User Links */}
                <div className="hidden md:flex items-center gap-1">
                  <Link 
                    to="/classes" 
                    className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:text-blue-400"
                  >
                    Classes
                  </Link>
                  <Link 
                    to="/trainers" 
                    className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:text-blue-400"
                  >
                    Trainers
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:text-blue-400"
                  >
                    My Bookings
                  </Link>
                </div>

                {/* Admin Links */}
                {user?.role === 'Admin' && (
                  <div className="hidden lg:flex items-center gap-1 ml-2 pl-4 border-l border-gray-700">
                    <Link 
                      to="/admin" 
                      className="px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 font-medium hover:text-yellow-400 text-sm"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/classes" 
                      className="px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 font-medium hover:text-yellow-400 text-sm"
                    >
                      Classes
                    </Link>
                    <Link 
                      to="/admin/sessions" 
                      className="px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 font-medium hover:text-yellow-400 text-sm"
                    >
                      Sessions
                    </Link>
                    <Link 
                      to="/admin/trainers" 
                      className="px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 font-medium hover:text-yellow-400 text-sm"
                    >
                      Trainers
                    </Link>
                  </div>
                )}

                {/* Trainer Links */}
                {user?.role === 'Trainer' && (
                  <div className="hidden lg:flex items-center gap-1 ml-2 pl-4 border-l border-gray-700">
                    <Link 
                      to="/trainer/sessions" 
                      className="px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 font-medium hover:text-yellow-400 text-sm"
                    >
                      Sessions
                    </Link>
                  </div>
                )}


                {/* User Menu */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
                  {/* Profile Section */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-7 h-7 rounded-full border-2 border-blue-400 object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-300">
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </span>
                  </div>

                  {/* Account Link */}
                  <Link 
                    to="/account" 
                    className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white"
                    title="Account Settings"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:text-blue-400"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};