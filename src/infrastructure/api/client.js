/**
 * Infrastructure Layer: Central HTTP Client for Be Kite Platform
 */

import axios from 'axios';
import { handleMockRequest } from '../../mock/mockAdapter';

const baseURL = '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  adapter: async (config) => {
    return handleMockRequest(config);
  },
});

// Request Interceptor: Attach Auth tokens and language
apiClient.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang') || 'ar';
    config.headers['Accept-Language'] = lang;

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform response extraction & error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
