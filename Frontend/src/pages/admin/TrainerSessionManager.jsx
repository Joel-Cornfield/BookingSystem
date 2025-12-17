import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { trainers } from '../../api/client';

export const TrainerSessionManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await trainers.getMySessions();
        setSessions(data);
      } catch (error) {
        setError('Failed to load sessions')
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const handleStatusChange = async (sessionId, status) => {
    if (status === "Cancelled") {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this session?"
      );
      if (!confirmCancel) return;
    }

    try {
      await trainers.updateSessionStatus(sessionId, status);

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId ? { ...s, status } : s
        )
      );
    } catch {
      setError('Failed to update session status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Sessions</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Dashboard
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
            to="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                My Training Sessions
              </h1>
              <p className="text-gray-600 mt-1 text-lg">{sessions.length} total sessions</p>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        {sessions.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 p-16 rounded-2xl text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Sessions Yet</h3>
            <p className="text-gray-600">Your training sessions will appear here once members book with you</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                  <tr>
                    <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        Member
                      </div>
                    </th>
                    <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        Date & Time
                      </div>
                    </th>
                    <th className="text-left p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span>📊</span>
                        Status
                      </div>
                    </th>
                    <th className="text-right p-4 lg:p-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                      <div className="flex items-center justify-end gap-2">
                        <span>⚙️</span>
                        Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, index) => {
                    const startDate = new Date(s.startTime);
                    const endDate = new Date(s.endTime);
                    const isPast = endDate < new Date();

                    return (
                      <tr 
                        key={s.id} 
                        className={`border-b border-gray-100 hover:bg-purple-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="p-4 lg:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {s.memberName?.charAt(0)?.toUpperCase() || 'M'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{s.memberName}</p>
                              {isPast && (
                                <span className="text-xs text-gray-500">Past Session</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 lg:p-6">
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">
                              {startDate.toLocaleDateString('en-US', { 
                                weekday: 'short',
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
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(s.status)}`}>
                            {s.status === "Approved" && "✓"}
                            {s.status === "Pending" && "⏳"}
                            {s.status === "Cancelled" && "✕"}
                            {s.status === "Completed" && "✓"}
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 lg:p-6">
                          <div className="flex justify-end">
                            <select
                              value={s.status}
                              onChange={e => handleStatusChange(s.id, e.target.value)}
                              disabled={s.status === "Completed"}
                              className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⏳</span>
                <span className="text-3xl font-bold text-yellow-600">
                  {sessions.filter(s => s.status === "Pending").length}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✓</span>
                <span className="text-3xl font-bold text-green-600">
                  {sessions.filter(s => s.status === "Approved").length}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Approved</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✓</span>
                <span className="text-3xl font-bold text-gray-600">
                  {sessions.filter(s => s.status === "Completed").length}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✕</span>
                <span className="text-3xl font-bold text-red-600">
                  {sessions.filter(s => s.status === "Cancelled").length}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Cancelled</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}