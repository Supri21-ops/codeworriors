import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to resolve localhost issues
const resolveApiUrl = (baseUrl: string): string => {
  try {
    // If window is not available (SSR), return the base URL
    if (typeof window === 'undefined') {
      return baseUrl;
    }
    
    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // If accessing via IP address, update API URL to use the same IP
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1' && /^\d+\.\d+\.\d+\.\d+$/.test(currentHost)) {
      // Extract port from the original API URL
      const urlObj = new URL(baseUrl);
      return `${currentProtocol}//${currentHost}:${urlObj.port || '3000'}${urlObj.pathname}`;
    }
    
    return baseUrl;
  } catch (error) {
    console.warn('Error resolving API URL:', error);
    return baseUrl;
  }
};

const RESOLVED_API_URL = resolveApiUrl(API_BASE_URL);

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: RESOLVED_API_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Handle network errors (backend not available)
    if (!error.response) {
      console.warn('Network error - backend may not be available');
      const networkError = new Error('Network Error: Backend server is not available');
      (networkError as any).code = 'NETWORK_ERROR';
      return Promise.reject(networkError);
    }

    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${RESOLVED_API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed: clear tokens and notify app to handle logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        try {
          // Dispatch an event so React Router can handle navigation inside the app
          window.dispatchEvent(new CustomEvent('auth:logout'));
        } catch (e) {
          // Fallback to a safe replace if events are not available
          try { window.location.replace('/login'); } catch (_) { /* ignore */ }
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get(url, config).then((response) => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then((response) => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then((response) => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then((response) => response.data),
};

export default api;
