import { Link } from 'react-router-dom';

export const TrainerCard = ({ trainer }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 flex items-center justify-center overflow-hidden">
        {trainer.profileImage ? (
          <img 
            src={trainer.profileImage} 
            alt={trainer.fullName} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-8xl transform group-hover:scale-110 transition-transform duration-300">👨‍🏫</span>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {trainer.fullName}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">{trainer.email}</span>
        </div>

        {/* Specializations */}
        {trainer.specializations && (
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              Specializations
            </p>
            <div className="flex flex-wrap gap-2">
              {trainer.specializations.split(',').slice(0, 3).map((spec, idx) => (
                <span 
                  key={idx} 
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {spec.trim()}
                </span>
              ))}
              {trainer.specializations.split(',').length > 3 && (
                <span className="text-xs text-gray-500 py-1">
                  +{trainer.specializations.split(',').length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Button */}
        <Link
          to={`/trainers/${trainer.id}`}
          className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};