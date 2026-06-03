import { apiClient } from '../lib/api/client';
import { useAuthStore } from '../stores/auth.store';

export const authService = {
  login: async (credentials: Record<string, unknown>) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  verifyOtp: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },
  me: async () => {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Not authenticated');
    return user;
  },
};
