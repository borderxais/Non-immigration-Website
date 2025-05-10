import axios from 'axios';


// Define the API URL based on environment
// const API_ENDPOINT = process.env.REACT_APP_SERVER_API_URL || 'https://visasupport-dot-overseabiz-453023.wl.r.appspot.com';
// const API_URL = `${API_ENDPOINT}/api`;

// Use CORS proxy to bypass CORS issues temporarily
const API_ENDPOINT = 'https://corsproxy.io/?' + encodeURIComponent('https://visasupport-dot-overseabiz-453023.wl.r.appspot.com');
const API_URL = `${API_ENDPOINT}/api`;

// const API_ENDPOINT = 'http://localhost:5000';
// const API_URL = `${API_ENDPOINT}/api`;


// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Must be false for cross-origin requests
});

// Add request interceptor for authentication and CORS
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers for preflight
    if (config.method?.toUpperCase() === 'OPTIONS') {
      config.headers['Access-Control-Request-Method'] = 'POST';
      config.headers['Access-Control-Request-Headers'] = 'content-type,authorization';
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
      const response = await api.post('/search', { query, limit });
      return response.data;
    } catch (error) {
      console.error('Error in combined search:', error);
      throw error;
    }
  },

  // Search only in vector database
  vectorSearch: async (query: string, limit: number = 5) => {
    try {
      const response = await api.post('/search/vector', { query, limit });
      return response.data;
    } catch (error) {
      console.error('Error in vector search:', error);
      throw error;
    }
  },

  // Search only in SQL database
  sqlSearch: async (query: string, limit: number = 5) => {
    try {
      const response = await api.post('/search/sql', { query, limit });
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
      const response = await api.post('/auth/login', { email, password });
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
      const response = await api.post('/auth/register', userData);
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
      const response = await api.get('/auth/user');
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
      const response = await api.post('/ds160', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting DS-160 form:', error);
      throw error;
    }
  },

  getForms: async () => {
    try {
      const response = await api.get('/ds160');
      return response.data;
    } catch (error) {
      console.error('Error getting DS-160 forms:', error);
      throw error;
    }
  },

  getFormById: async (application_id: string) => {
    try {
      const response = await api.get(`/ds160/${application_id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting DS-160 form with ID ${application_id}:`, error);
      throw error;
    }
  },
};

// Consultation API functions
export const consultationAPI = {
  requestConsultation: async (consultationData: any) => {
    try {
      const response = await api.post('/consultation', consultationData);
      return response.data;
    } catch (error) {
      console.error('Error requesting consultation:', error);
      throw error;
    }
  },

  getConsultations: async () => {
    try {
      const response = await api.get('/consultation');
      return response.data;
    } catch (error) {
      console.error('Error getting consultations:', error);
      throw error;
    }
  },
};

export default api;
