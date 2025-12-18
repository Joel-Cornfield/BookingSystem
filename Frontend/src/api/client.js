const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If we get a 401 and have a refresh token, try to refresh
  if (response.status === 401 && localStorage.getItem('refreshToken')) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id,
            refreshToken: refreshToken,
          }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          
          // Update stored tokens
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));

          isRefreshing = false;
          onRefreshed(data.accessToken);

          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${data.accessToken}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
          });
        } else {
          isRefreshing = false;
          // Refresh failed, clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login'; // Redirect to login
          throw new Error('Session expired. Please login again.');
        }
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    } else {
      // Wait for the refresh to complete
      const retryOriginalRequest = new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          headers['Authorization'] = `Bearer ${token}`;
          resolve(fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          }));
        });
      });
      response = await retryOriginalRequest;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// Auth API calls
export const auth = {
  register: (data) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (data) => apiCall('/auth/refresh', { method: 'POST', body: JSON.stringify(data) }),
  editProfile: (data) => apiCall('/auth/update-profile', { method: 'POST', body: JSON.stringify(data) }),
  changePassword: (data) => apiCall('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
};

// Classes API calls
export const classes = {
  getAll: () => apiCall('/classes'),
  getById: (id) => apiCall(`/classes/${id}`),
  getSessions: (classId) => apiCall(`/classes/${classId}/sessions`),
  create: (data) => apiCall('/classes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/classes/${id}/update`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/classes/${id}/delete`, { method: 'DELETE' }),
};

// Sessions API calls
export const sessions = {
  book: (sessionId) => apiCall(`/sessions/${sessionId}/book`, { method: 'POST' }),
  cancel: (bookingId) => apiCall(`/sessions/${bookingId}/cancel`, { method: 'POST' }),
  getMemberBookings: () => apiCall('/sessions/member/sessions'),
  createSession: (classId, data) => apiCall(`/classes/${classId}/createsession`, { method: 'POST', body: JSON.stringify(data) }),
  updateSession: (sessionId, data) => apiCall(`/classes/sessions/${sessionId}/update`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSession: (sessionId) => apiCall(`/classes/sessions/${sessionId}/update`, { method: 'DELETE' }),
};

// Trainers API calls
export const trainers = {
  getAll: () => apiCall('/trainer/trainers'),
  getById: (id) => apiCall(`/trainer/${id}`),
  getMemberSessions: () => apiCall('/trainer/member/sessions'),
  bookSession: (trainerId, data) =>
    apiCall(`/trainer/${trainerId}/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelSession: (sessionId) => apiCall(`/trainer/${sessionId}/cancel`, { method: 'DELETE' }),
  updateSessionStatus: (sessionId, status) => apiCall(`/trainer/${sessionId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Trainer only endpoints
  getMySessions: () => apiCall("/trainer/sessions"),

  // Admin trainer endpoints
  createTrainer: (data) => apiCall('/trainer/admin/create', { method: 'POST', body: JSON.stringify(data) }),
  promoteUser: (userId) => apiCall(`/trainer/admin/${userId}/promote`, { method: 'POST' }),
  deactivateTrainer: (trainerId) => apiCall(`/trainer/admin/${trainerId}/deactivate`, { method: 'POST' }),
};

// Upload API calls
export const upload = {
  uploadProfileImage: (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${API_BASE_URL}/upload/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .catch(err => {
        throw new Error(err.message || 'Upload failed');
      });
  },
};