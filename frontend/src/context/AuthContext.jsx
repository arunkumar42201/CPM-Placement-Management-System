import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, studentService, teacherService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cpm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cpm_token');
      const storedUser = localStorage.getItem('cpm_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          try {
            const refreshed = await authService.getCurrentUser();
            if (refreshed?.success && refreshed.data) {
              const mergedUser = { ...parsedUser, ...refreshed.data, token: parsedUser.token };
              setUser(mergedUser);
              localStorage.setItem('cpm_user', JSON.stringify(mergedUser));
            }
          } catch (e) {
            console.warn('Failed to refresh current user', e);
          }
        } catch (e) {
          localStorage.removeItem('cpm_token');
          localStorage.removeItem('cpm_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const userData = res.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('cpm_token', userData.token);
      localStorage.setItem('cpm_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (registerData) => {
    const res = await authService.register(registerData);
    if (res.success && res.data) {
      const userData = res.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('cpm_token', userData.token);
      localStorage.setItem('cpm_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cpm_token');
    localStorage.removeItem('cpm_user');
    // Keep the last login email/password so the user can sign back in quickly.
    window.location.href = '/';
  };

  const updateUserProfile = (updatedProfile) => {
    if (user) {
      const newUser = { ...user, ...updatedProfile };
      setUser(newUser);
      localStorage.setItem('cpm_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
