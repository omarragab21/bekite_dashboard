/**
 * Infrastructure Layer: Central HTTP Client for Be Kite Platform
 * Exclusively connected to live backend endpoints
 */

import axios from 'axios';

const baseURL = import.meta.env?.VITE_API_BASE_URL || 'https://site-backend.be-kite.com/api/v1';

const axiosConfig = {
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export const apiClient = axios.create(axiosConfig);

// Request Interceptor: Attach Auth tokens, language, and appropriate headers
apiClient.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang') || 'ar';
    config.headers['Accept-Language'] = lang;

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Do not enforce application/json if data is FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated 401s and errors cleanly
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && window.location?.pathname && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    } else if (
      typeof window !== 'undefined' &&
      error.response?.status === 500 &&
      (error.response?.data?.message === 'Unauthenticated.' ||
        (typeof error.response?.data?.message === 'string' && error.response.data.message.includes('Unauthenticated')))
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      localStorage.removeItem('user');
      if (window.location?.pathname && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
