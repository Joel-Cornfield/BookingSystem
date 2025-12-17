import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { classes, sessions } from "../../api/client";

export default function ManageSessions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sessionsList, setSessionsList] = useState([]);
  const [classList, setClassList] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [formData, setFormData] = useState({
    classId: "",
    startTime: "",
    endTime: "",
    room: "",
    maxCapacity: "",
  });

  // =============================
  // LOAD ALL SESSIONS
  // =============================
  const loadSessions = async () => {
    try {
      const classesData = await classes.getAll();
      setClassList(classesData);

      const allSessions = [];

      for (const cls of classesData) {
        const sessionRes = await classes.getSessions(cls.id);
        sessionRes.forEach(s =>
          allSessions.push({
            ...s,
            className: cls.name,
            trainerName: cls.trainerName,
          })
        );
      }

      setSessionsList(allSessions);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const openCreate = () => {
    setEditingSession(null);
    setFormData({
      classId: "",
      startTime: "",
      endTime: "",
      room: "",
      maxCapacity: ""
    });
    setShowForm(true);
  }

  const openEdit = (session) => {
    setEditingSession(session);
    setFormData({
      classId: session.classId,
      startTime: session.startTime,
      endTime: session.endTime,
      room: session.room,
      maxCapacity: session.maxCapacity
    });
    setShowForm(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      maxCapacity: formData.maxCapacity
    };

    try {
      if (editingSession) {
        await sessions.updateSession(editingSession.id, payload);
      } else {
        await sessions.createSession(formData.classId, payload);
      }
      setShowForm(false);
      loadSessions();
    } catch {
      alert("Failed to save session");
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session? This cannot be undone.")) return;

    try {
      await sessions.deleteSession(id);
      setSessionsList(prev => prev.filter(s => s.id !== id));
    } catch {
      alert("Failed to delete session");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading session manager...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Session Manager</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/admin" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // =============================
  // RENDER
  // =============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent">
                  Manage Sessions
                </h1>
                <p className="text-gray-600 mt-1 text-lg">{sessionsList.length} total sessions</p>
              </div>
            </div>

            <button
              onClick={openCreate}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Session
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                <tr>
                  <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      Class
                    </div>
                  </th>
                  <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      Trainer
                    </div>
                  </th>
                  <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      Time
                    </div>
                  </th>
                  <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <div className="flex items-center gap-2">
                      Room
                    </div>
                  </th>
                  <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Capacity
                  </th>
                  <th className="text-right p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessionsList.map((s, index) => {
                  const startDate = new Date(s.startTime);
                  const endDate = new Date(s.endTime);
                  
                  return (
                    <tr 
                      key={s.id} 
                      className={`border-b border-gray-100 hover:bg-emerald-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="p-4 lg:p-6">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🏋️</span>
                          </div>
                          <span className="font-bold text-gray-900">{s.className}</span>
                        </div>
                      </td>
                      <td className="p-4 lg:p-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {s.trainerName?.charAt(0) || 'T'}
                          </div>
                          <span className="text-gray-800 font-medium">{s.trainerName}</span>
                        </div>
                      </td>
                      <td className="p-4 lg:p-6">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">
                            {startDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' - '}
                            {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 lg:p-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          s.room 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {s.room || 'Not Set'}
                        </span>
                      </td>
                      <td className="p-4 lg:p-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-emerald-600">{s.maxCapacity}</span>
                          <span className="text-sm text-gray-500">max</span>
                        </div>
                      </td>
                      <td className="p-4 lg:p-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {sessionsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Sessions Yet</h3>
                      <p className="text-gray-600 mb-6">Create your first session to get started</p>
                      <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create First Session
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {editingSession ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Session
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Session
                  </>
                )}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {!editingSession && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Select Class *
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                    value={formData.classId}
                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                  >
                    <option value="">Choose a class...</option>
                    {classList.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Room
                </label>
                <input
                  placeholder="e.g., Studio A"
                  value={formData.room}
                  onChange={e => setFormData({ ...formData, room: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Max Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 20"
                  value={formData.maxCapacity}
                  onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {editingSession ? 'Update Session' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}