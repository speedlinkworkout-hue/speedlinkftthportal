import { apiClient } from '../lib/api/client';

export const ticketsService = {
  getTickets: async () => {
    const response = await apiClient.get('/tickets');
    return response.data;
  },
};
