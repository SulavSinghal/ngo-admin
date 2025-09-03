import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'; // 1. Import useMemo
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // Set the header first for the verification request itself
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/api/verify-admin`); // Removed headers since it's now a default

      if (response.data.valid) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        // 2. If token is invalid, call logout() for a full cleanup
        logout();
      }
    } catch (error) {
      // 2. If verification fails, call logout() for a full cleanup
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('adminToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  // 3. Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      login,
      logout
    }),
    [isAuthenticated, user, loading] // Dependencies for the memoization
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};