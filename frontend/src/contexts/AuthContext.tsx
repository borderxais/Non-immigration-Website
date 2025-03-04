import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterData, User } from '../types/auth';

interface AuthResponse {
  user: User;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await validateToken(token);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('token');
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } else {
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await loginApi(credentials);
      const { user, token } = response;

      localStorage.setItem('token', token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await registerApi(data);
      const { user, token } = response;

      localStorage.setItem('token', token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await resetPasswordApi(email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions with proper types
const validateToken = async (token: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        username: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      });
    }, 500);
  });
};

const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          username: 'Test User',
          email: credentials.email,
          createdAt: new Date().toISOString(),
        },
        token: 'fake-jwt-token',
      });
    }, 500);
  });
};

const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: '1',
          username: data.username,
          email: data.email,
          createdAt: new Date().toISOString(),
        },
        token: 'fake-jwt-token',
      });
    }, 500);
  });
};

const resetPasswordApi = async (email: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
