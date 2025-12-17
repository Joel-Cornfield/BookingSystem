import { useState, useEffect } from "react";
import { trainers } from "../../api/client";
import { Link } from "react-router-dom";

export default function ManageTrainers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainerList, setTrainerList] = useState([]);

  // Promote user modal
  const [showPromoteForm, setShowPromoteForm] = useState(false);
  const [promoteData, setPromoteData] = useState({ userId: "" });

  // Create trainer modal
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({ fullName: "", email: "", password: "" });

  // =============================
  // LOAD ALL TRAINERS
  // =============================
  const loadTrainers = async () => {
    try {
      const allTrainers = await trainers.getAll();
      setTrainerList(allTrainers);
    } catch (err) {
      console.error(err);
      setError("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  // =============================
  // PROMOTE EXISTING USER
  // =============================
  const openPromote = () => {
    setPromoteData({ userId: "" });
    setShowPromoteForm(true);
  };

  const handlePromote = async (e) => {
    e.preventDefault();
    try {
      await trainers.promoteUser(promoteData.userId);
      setShowPromoteForm(false);
      loadTrainers();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to promote user");
    }
  };

  // =============================
  // CREATE NEW TRAINER
  // =============================
  const openCreate = () => {
    setCreateData({ fullName: "", email: "", password: "" });
    setShowCreateForm(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await trainers.createTrainer(createData);
      setShowCreateForm(false);
      loadTrainers();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create trainer");
    }
  };

  const handleDeactivate = async (trainer) => {
    if (!window.confirm(`Deactivate ${trainer.fullName}? This will remove their trainer privileges.`)) {
      return;
    }

    try {
      await trainers.deactivateTrainer(trainer.id);
      loadTrainers();
    } catch (err) {
      alert(err.message || "Failed to deactivate trainer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading trainer manager...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Trainer Manager</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Manage Trainers
                </h1>
                <p className="text-gray-600 mt-1 text-lg">{trainerList.length} active trainers</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={openPromote}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Promote User
              </button>
              <button
                onClick={openCreate}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Trainer
              </button>
            </div>
          </div>
        </div>

        {/* Trainers Grid */}
        {trainerList.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 p-16 rounded-2xl text-center">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Trainers Yet</h3>
            <p className="text-gray-600 mb-6">Create your first trainer or promote an existing user</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Trainer
              </button>
              <button
                onClick={openPromote}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Promote User
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerList.map(trainer => (
              <div 
                key={trainer.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
              >
                {/* Header Bar */}
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {trainer.fullName?.charAt(0)?.toUpperCase() || 'T'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {trainer.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{trainer.email}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/trainers/${trainer.id}`}
                      className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-2 rounded-xl text-center hover:from-purple-200 hover:to-pink-200 transition-all font-semibold text-sm flex items-center justify-center"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleDeactivate(trainer)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold text-sm border border-red-200"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promote User Modal */}
      {showPromoteForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Promote User to Trainer
              </h2>
              <p className="text-green-100 text-sm mt-1">Upgrade an existing user to trainer role</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePromote} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  User ID *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter the user's ID"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                  value={promoteData.userId}
                  onChange={e => setPromoteData({ ...promoteData, userId: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2">You can find the user ID in the user management system</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPromoteForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Promote to Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Trainer Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Trainer
              </h2>
              <p className="text-purple-100 text-sm mt-1">Add a new trainer to the system</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., John Smith"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  value={createData.fullName}
                  onChange={e => setCreateData({ ...createData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="trainer@example.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  value={createData.email}
                  onChange={e => setCreateData({ ...createData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Password *
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  value={createData.password}
                  onChange={e => setCreateData({ ...createData, password: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Create Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}