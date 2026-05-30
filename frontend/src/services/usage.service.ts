import { apiClient } from '../lib/api/client';

export const usageService = {
  getUsageStats: async () => {
    const response = await apiClient.get('/usage');
    return response.data;
  },
};
