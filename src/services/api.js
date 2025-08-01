// src/services/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🔗 Create axios instance without setting global Content-Type
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔐 Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only manually set JSON header if not FormData
    if (
      config.data &&
      !(config.data instanceof FormData) &&
      !config.headers['Content-Type']
    ) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// ✅ Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (formData) => {
    const token = localStorage.getItem('token');
    
    return api.put('/users/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        // ✅ Let browser set 'Content-Type' for multipart/form-data
      }
    });
  }
};

// ✅ Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId, params) => api.get(`/messages/${userId}`, { params }),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (userId) => api.put(`/messages/read/${userId}`),
};

// ✅ Events API
export const eventsAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),

  // Do NOT manually set Content-Type when using FormData
  createEvent: (formData) => api.post('/events', formData),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),

  rsvpEvent: (id) => api.post(`/events/${id}/rsvp`),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export default api;
