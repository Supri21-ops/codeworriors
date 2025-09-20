import { apiService } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'OPERATOR' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'OPERATOR' | 'USER';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class AuthService {
  private getMockAuthResponse(credentials: LoginCredentials): AuthResponse {
    const mockUser: User = {
      id: 'mock-user-1',
      email: credentials.emailOrUsername.includes('@') ? credentials.emailOrUsername : 'admin@example.com',
      name: 'Demo User',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      accessToken: 'mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: '24h',
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      }
      
      throw new Error(response.message);
    } catch (error: any) {
      console.warn('Backend unavailable, using mock authentication for development');
      
      // Check if it's a network error (backend not running)
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED' || 
          error.message?.includes('timeout') || error.message?.includes('Network Error')) {
        
        // Mock authentication for development
        const mockResponse = this.getMockAuthResponse(credentials);
        
        // Store mock tokens
        localStorage.setItem('accessToken', mockResponse.accessToken);
        localStorage.setItem('refreshToken', mockResponse.refreshToken);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      }
      
      // Re-throw the original error if it's not a network issue
      throw error;
    }
  }

  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/signup', userData);

    if (response.success) {
      // Return response but do NOT persist tokens — require an explicit login
      // so users must verify credentials before being treated as authenticated.
      return response.data;
    }

    throw new Error(response.message);
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    });

    if (response.success) {
      const { user, accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Update tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    }
    
    throw new Error(response.message);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = {
      'USER': 1,
      'OPERATOR': 2,
      'SUPERVISOR': 3,
      'MANAGER': 4,
      'ADMIN': 5,
    };
    
    return roleHierarchy[user.role as keyof typeof roleHierarchy] >= roleHierarchy[role as keyof typeof roleHierarchy];
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
