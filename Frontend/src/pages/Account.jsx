import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from '../components/ImageUpload';
import { apiCall } from '../api/client';

export const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isPasswordEditOpen, setIsPasswordEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEditData, setUserEditData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || ""
  });
  const [passwordEditData, setPasswordEditData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const imageUploadRef = useRef(null);

  const handleImageUpload = (imageUrl) => {
    setProfileImage(imageUrl);
    setError('');
    // Update the user in AuthContext to sync across app
    updateUser({ profileImage: imageUrl });
  };

  const handleImageError = (errorMsg) => {
    setError(errorMsg);
  };

  const submitProfileChange = async () => {
    setProfileError('');
    
    if (!userEditData.fullName.trim() || !userEditData.email.trim()) {
      setProfileError('Full name and email are required');
      return;
    }

    setLoading(true);
    try {
      // Call backend update-profile endpoint
      await apiCall('/auth/update-profile', {
        method: 'POST',
        body: JSON.stringify(userEditData)
      });
      // Update AuthContext with new data
      updateUser({ fullName: userEditData.fullName, email: userEditData.email });
      // success
      setIsUserEditOpen(false);
      setProfileError('');
    } catch (err) {
        setProfileError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }             
  }
  const submitPasswordChange = async () => {
    setPasswordError('');

    const { currentPassword, newPassword, confirmPassword } = passwordEditData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all fields');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

        setLoading(true);
        try {
          // Call backend change-password endpoint
          await apiCall('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
          });
          // success
          setIsPasswordEditOpen(false);
          setPasswordEditData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordError('');
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password');
        } finally {
          setLoading(false);
        }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Account</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/account" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Gradient */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Profile Image Section - Overlapping header */}
            <div className="-mt-16 mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">
                        {user?.fullName?.charAt(0)?.toUpperCase() || '👤'}
                      </span>
                    )}
                  </div>
                </div>
                {/* Edit Badge */}
                <div
                  onClick={() => imageUploadRef.current?.click?.()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <ImageUpload 
                  ref={imageUploadRef}
                  onUpload={handleImageUpload}
                  onError={handleImageError}
                  onLoadingChange={setLoading}
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            {loading && <p className="text-blue-600 text-sm mb-4">Uploading...</p>}

            {/* User Information */}
            <div className="space-y-6 mb-8">
              {/* Full Name */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Full Name
                    </label>
                    <p className="text-2xl font-bold text-gray-900">{user?.fullName || 'N/A'}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Email Address
                    </label>
                    <p className="text-xl font-semibold text-gray-900 break-all">{user?.email || 'N/A'}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Account Role
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-semibold text-gray-900">{user?.role || 'Member'}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user?.role === 'Admin' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {user?.role === 'Admin' ? '👑 Admin' : user?.role === 'Trainer' ? '👟 Trainer' : '✓ Member'}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsUserEditOpen(true)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-101 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              
              <button
                onClick={logout}
                className="sm:w-auto bg-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span>
              Account Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-bold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Classes Completed</span>
                <span className="font-bold text-gray-900">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="font-bold text-gray-900">Jan 2024</span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔒</span>
              Security
            </h3>
            <div className="space-y-3">
              <button onClick={() => setIsPasswordEditOpen(true)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <span className="font-medium">Change Password</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <span className="font-medium">Two-Factor Auth</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isUserEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-fade-in">

            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Edit Profile
            </h2>

            {/* Form */}
            <div className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userEditData.fullName}
                  onChange={(e) => setUserEditData({ ...userEditData, fullName: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userEditData.email}
                  onChange={(e) => setUserEditData({ ...userEditData, email: e.target.value })}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>
              {profileError && (
                <p className="text-red-600 text-sm">{profileError}</p>
              )}
              {loading && (
                <p className="text-blue-600 text-sm">Processing...</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => setIsUserEditOpen(false)}
                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitProfileChange}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-lg"
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}
      {isPasswordEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg animate-fade-in">

            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Change Password
            </h2>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordEditData.currentPassword}
                  onChange={(e) =>
                    setPasswordEditData({ ...passwordEditData, currentPassword: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordEditData.newPassword}
                  onChange={(e) =>
                    setPasswordEditData({ ...passwordEditData, newPassword: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordEditData.confirmPassword}
                  onChange={(e) =>
                    setPasswordEditData({ ...passwordEditData, confirmPassword: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
              {loading && (
                <p className="text-blue-600 text-sm">Processing...</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsPasswordEditOpen(false)}
                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitPasswordChange}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
