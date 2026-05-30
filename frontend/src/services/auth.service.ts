import { apiClient } from '../lib/api/client';

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  verifyOtp: async (data: any) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },
};
