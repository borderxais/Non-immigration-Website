// import axios from 'axios';
import { LoginCredentials, RegisterData, User, UserRole } from '../types/auth';
import api from './api';

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
  console.log('Login response:', response);
  
  // If user is admin, store this information in localStorage
  if (response.data.user && response.data.user.role === UserRole.ADMIN) {
    localStorage.setItem('userRole', UserRole.ADMIN);
  }
  
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
  
  // Get the stored role from localStorage
  const storedRole = localStorage.getItem('userRole');
  
  // Make sure user has a role property
  const userData = response.data;
  const userWithRole = {
    ...userData,
    // If we previously stored that this user is an admin, preserve that information
    role: storedRole === UserRole.ADMIN ? UserRole.ADMIN : (userData.role || UserRole.USER)
  };
  
  console.log('Validated user with role:', userWithRole);
  return userWithRole;
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
  
  // If updating role to admin, store in localStorage
  if (userData.role === UserRole.ADMIN) {
    localStorage.setItem('userRole', UserRole.ADMIN);
  }
  
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

/**
 * Get all users (admin only)
 */
const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      throw new Error('Authentication required');
    }
    
    console.log('Checkpoint1: Token found, making API call');
    const response = await api.get(`/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('All users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const authService = {
  register,
  login,
  validateToken,
  requestPasswordReset,
  completePasswordReset,
  updateProfile,
  changePassword,
  getAllUsers
};

export default authService;
