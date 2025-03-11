import axios from 'axios';


// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_SERVER_API_URL || 'http://localhost:5000' ,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Search API functions
export const searchAPI = {
  // Search in both databases
  search: async (query: string, limit: number = 5) => {
    try {
      const response = await api.post('/api/search', { query, limit });
      return response.data;
    } catch (error) {
      console.error('Error in combined search:', error);
      throw error;
    }
  },

  // Search only in vector database
  vectorSearch: async (query: string, limit: number = 5) => {
    try {
      const response = await api.post('/api/search/vector', { query, limit });
      return response.data;
    } catch (error) {
      console.error('Error in vector search:', error);
      throw error;
    }
  },

  // Search only in SQL database
  sqlSearch: async (query: string, limit: number = 5) => {
    try {
      const response = await api.post('/api/search/sql', { query, limit });
      return response.data;
    } catch (error) {
      console.error('Error in SQL search:', error);
      throw error;
    }
  },
};

// Authentication API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/user');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
};

// DS-160 API functions
export const ds160API = {
  submitForm: async (formData: any) => {
    try {
      const response = await api.post('/api/ds160', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting DS-160 form:', error);
      throw error;
    }
  },

  getForms: async () => {
    try {
      const response = await api.get('/api/ds160');
      return response.data;
    } catch (error) {
      console.error('Error getting DS-160 forms:', error);
      throw error;
    }
  },

  getFormById: async (id: string) => {
    try {
      const response = await api.get(`/api/ds160/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting DS-160 form with ID ${id}:`, error);
      throw error;
    }
  },
};

// Consultation API functions
export const consultationAPI = {
  requestConsultation: async (consultationData: any) => {
    try {
      const response = await api.post('/api/consultation', consultationData);
      return response.data;
    } catch (error) {
      console.error('Error requesting consultation:', error);
      throw error;
    }
  },

  getConsultations: async () => {
    try {
      const response = await api.get('/api/consultation');
      return response.data;
    } catch (error) {
      console.error('Error getting consultations:', error);
      throw error;
    }
  },
};

export default api;
