import { apiClient } from '../lib/api/client';

export const plansService = {
  getPlans: async () => {
    const response = await apiClient.get('/plans');
    return response.data;
  },
  getPlanById: async (id: string) => {
    const response = await apiClient.get(`/plans/${id}`);
    return response.data;
  },
};
