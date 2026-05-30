import { apiClient } from '../lib/api/client';

export const accountsService = {
  getAccounts: async () => {
    const response = await apiClient.get('/accounts');
    return response.data;
  },
};
