import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classes } from '../api/client';

export const Classes = () => {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classes.getAll();
        setClassList(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Classes</h2>
          <p className="text-red-600">{error}</p>
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
                Available Classes
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Find the perfect class for your fitness journey</p>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {classList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {classList.map((cls) => (
              <div 
                key={cls.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
              >
                {/* Colored Header Bar */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🏋️</span>
                  </div>

                  {/* Class Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {cls.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                    {cls.description}
                  </p>

                  {/* Trainer Info */}
                  <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {cls.trainerName?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trainer</p>
                      <p className="text-sm font-semibold text-gray-800">{cls.trainerName}</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link 
                    to={`/classes/${cls.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-white opacity-100 [text-shadow:none] text-center px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View Details & Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-300 p-16 rounded-2xl text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Classes Available</h3>
            <p className="text-gray-600">Check back soon for new classes!</p>
          </div>
        )}
      </div>
    </div>
  );
};