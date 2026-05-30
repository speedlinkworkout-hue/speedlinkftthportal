import { apiClient } from '../lib/api/client';

export const walletService = {
  getWallet: async () => {
    const response = await apiClient.get('/wallet');
    return response.data;
  },
};
