import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('demo_erp_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('demo_erp_token', token);
      verifyToken(token);
    } else {
      localStorage.removeItem('demo_erp_token');
      setAdmin(null);
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async (currentToken) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error('Auth verification failed', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    setToken(null);
  };

  const value = {
    admin,
    token,
    login,
    logout,
    isAuthenticated: !!admin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
