import axiosInstance from './axios';
import { AuthResponse, User } from '../types/auth.types';

export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response.data.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }
    );
    return response.data.data;
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post('/auth/refresh', {}, { withCredentials: true });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.data;
  },
};
