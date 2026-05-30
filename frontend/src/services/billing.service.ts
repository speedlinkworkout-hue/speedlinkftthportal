import { apiClient } from '../lib/api/client';

export const billingService = {
  getInvoices: async () => {
    const response = await apiClient.get('/billing/invoices');
    return response.data;
  },
};
