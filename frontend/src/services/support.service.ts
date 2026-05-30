import { apiClient } from '../lib/api/client';

export const supportService = {
  getExpiringPlans: async () => {
    const response = await apiClient.get('/support/expiring');
    return response.data;
  },
};
