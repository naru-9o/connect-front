import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI } from '../services/api';
import socketService from '../services/socket';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      authAPI.getMe()
        .then(response => {
          if (response.data.success) {
            setUser(response.data.user);
            // Connect to socket
            socketService.connect(token);
          }
        })   
        .catch(error => {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        // Connect to socket
        socketService.connect(token);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        // Connect to socket
        socketService.connect(token);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    // Disconnect socket
    socketService.disconnect();
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

 const updateProfile = async (formData) => {
  try {
    
    // ✅ Add validation for formData
    if (!formData) {
      throw new Error('No form data provided');
    }
    const response = await usersAPI.updateProfile(formData);
    
    if (response.data && response.data.success) {
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return response.data; // ✅ Return the data
    } else {
      throw new Error(response.data?.message || 'Profile update failed');
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Profile update failed';
    throw new Error(message);
  }
};


  const value = {
    user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};