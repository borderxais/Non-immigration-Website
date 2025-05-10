// import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import api from './api';

// // Access environment variables using Vite's import.meta.env
// const API_ENDPOINT = process.env.REACT_APP_SERVER_API_URL || 'http://localhost:5000';
// const API_URL = `${API_ENDPOINT}/api`;

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Register a new user
 */
const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post(`/auth/register`, data);
  return response.data;
};

/**
 * Login a user
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post(`/auth/login`, credentials);
  return response.data;
};

/**
 * Validate a token and get user information
 */
const validateToken = async (token: string): Promise<User> => {
  const response = await api.get(`/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Reset password request
 */
const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
  const response = await api.post(`/auth/reset-password`, { email });
  return response.data;
};

/**
 * Complete password reset
 */
const completePasswordReset = async (token: string, newPassword: string): Promise<{ success: boolean }> => {
  const response = await api.post(`/auth/reset-password/confirm`, { 
    token, 
    new_password: newPassword 
  });
  return response.data;
};

/**
 * Update user profile
 */
const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/auth/profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Change password
 */
const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
  const token = localStorage.getItem('token');
  const response = await api.post(
    `/auth/change-password`,
    { current_password: currentPassword, new_password: newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

const authService = {
  register,
  login,
  validateToken,
  requestPasswordReset,
  completePasswordReset,
  updateProfile,
  changePassword
};

export default authService;
