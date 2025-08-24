import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Common API functions
export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  verify: () => api.get('/verify-admin'),
};

export const blogAPI = {
  getAll: () => api.get('/blog'),
  getById: (id) => api.get(`/blog/${id}`),
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.put(`/blog/${id}`, data),
  delete: (id) => api.delete(`/blog/${id}`),
};

export const activityAPI = {
  getAll: () => api.get('/activities'),
  getById: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
};

export const teamAPI = {
  getAll: () => api.get('/teamMembers'),
  getById: (id) => api.get(`/teamMembers/${id}`),
  create: (data) => api.post('/teamMembers', data),
  update: (id, data) => api.put(`/teamMembers/${id}`, data),
  delete: (id) => api.delete(`/teamMembers/${id}`),
};

export const volunteerAPI = {
  getApplications: () => api.get('/volunteer-applications'),
  getOpportunities: () => api.get('/volunteer-opportunities'),
  createOpportunity: (data) => api.post('/volunteer-opportunities', data),
  updateOpportunity: (id, data) => api.put(`/volunteer-opportunities/${id}`, data),
  deleteOpportunity: (id) => api.delete(`/volunteer-opportunities/${id}`),
};

export const aboutUsAPI = {
  get: () => api.get('/about-us'),
  create: (data) => api.post('/about-us', data),
  update: (id, data) => api.put(`/about-us/${id}`, data),
};

export const testimonialAPI = {
  getAll: () => api.get('/testimonials'),
  getById: (id) => api.get(`/testimonials/${id}`),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };        
  }
};

export default api;
