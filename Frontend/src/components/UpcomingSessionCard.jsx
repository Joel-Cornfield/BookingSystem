import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { BookingsContext } from '../context/BookingsContext';

export const UpcomingSessionCard = ({ session }) => {
  const { cancelClassBooking, cancelTrainerSession } = useContext(BookingsContext);

  if (!session) {
    return (
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-3">No Upcoming Sessions</h3>
          <p className="text-gray-600 mb-4">You haven't booked any upcoming sessions yet.</p>
          <Link to="/classes" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Browse Classes
          </Link>
        </div>
      </div>
    );
  }

  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const isPast = end < new Date();

  const displayStatus =
    session.status === 'Cancelled'
      ? 'Cancelled'
      : isPast
      ? 'Completed'
      : session.status;

  const handleCancel = () => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;

    if (session.className) {
      cancelClassBooking(session.id);
    } else {
      cancelTrainerSession(session.id);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Your Next Session 🎯</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-blue-100 text-sm">Type</p>
          <p className="text-xl font-bold">{session.className || 'Personal Training Session'}</p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Trainer</p>
          <p className="text-xl font-bold">{session.trainerName}</p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Date & Time</p>
          <p className="text-lg font-bold">
            {start.toLocaleDateString()} at {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Status</p>
          <p className="text-lg font-bold">{displayStatus}</p>
        </div>
      </div>

      {(session.status !== 'Cancelled' && !isPast) && (
        <button
          onClick={handleCancel}
          className="flex-1 max-w-80 bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
        >
          Cancel Session
        </button>
      )}
    </div>
  );
};
