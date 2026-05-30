import { apiClient } from '../lib/api/client';

export const financeService = {
  getTransactions: async () => {
    const response = await apiClient.get('/finance/transactions');
    return response.data;
  },
};
