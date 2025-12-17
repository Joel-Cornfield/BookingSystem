import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { auth as authApi } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  // Function to refresh the access token
  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');
    
    if (!storedRefreshToken || !storedUser) {
      return false;
    }

    try {
      const userData = JSON.parse(storedUser);
      const response = await authApi.refresh({
        userId: userData.id,
        refreshToken: storedRefreshToken
      });

      // Update tokens
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // If refresh fails, logout user
      logout();
      return false;
    }
  }, []);

  // Check token validity on mount and try to refresh if needed
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedRefreshToken = localStorage.getItem('refreshToken');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedRefreshToken && savedUser) {
        setToken(savedToken);
        setRefreshToken(savedRefreshToken);
        setUser(JSON.parse(savedUser));
        
        // Optionally: Try to refresh token on mount to ensure it's valid
        // await refreshAccessToken();
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Set up automatic token refresh (optional but recommended)
  useEffect(() => {
    if (!token) return;

    // Refresh token every 50 minutes (since token expires in 60 minutes)
    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, [token, refreshAccessToken]);

  const login = (userData, authToken, authRefreshToken) => {
    setUser(userData);
    setToken(authToken);
    setRefreshToken(authRefreshToken);
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('refreshToken', authRefreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        refreshToken,
        isAuthenticated, 
        loading, 
        login, 
        updateUser, 
        logout,
        refreshAccessToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider()');
  }
  return context;
};