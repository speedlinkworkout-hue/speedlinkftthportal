import { apiClient } from '../lib/api/client';

export const adminService = {
  getCustomers: async () => {
    const response = await apiClient.get('/admin/customers');
    return response.data;
  },
};
