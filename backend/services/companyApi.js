import axios from 'axios';

const companyApiClient = axios.create({
  baseURL: process.env.COMPANY_API_BASE_URL || 'http://blazzinghost.com:8790/rest',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Attach auth token if available
companyApiClient.interceptors.request.use((config) => {
  const token = process.env.COMPANY_API_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch a user's account data from the company API using their login ID
 * @param {string} loginId - The user's unique login ID in the company system
 * @returns {Promise<object>} - The account data from the company API
 */
export const getCompanyUserAccount = async (loginId) => {
  const response = await companyApiClient.get(`/user/${loginId}`);
  return response.data;
};

export default companyApiClient;
