import { describe, it, expect, beforeEach } from 'vitest';
import apiClient from '../../src/infrastructure/api/client.js';

describe('HTTP API Client & Interceptors Readiness Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should automatically attach Bearer token to requests when logged in', async () => {
    localStorage.setItem('token', 'mock_jwt_token_sample_xyz123');

    // Trigger an interceptor test through a simple GET
    const config = await apiClient.interceptors.request.handlers[0].fulfilled({
      headers: {}
    });

    expect(config.headers.Authorization).toBe('Bearer mock_jwt_token_sample_xyz123');
  });

  it('should attach current locale language header to requests', async () => {
    localStorage.setItem('lang', 'ar');

    const config = await apiClient.interceptors.request.handlers[0].fulfilled({
      headers: {}
    });

    expect(config.headers['Accept-Language']).toBe('ar');
  });

  it('should default language to "ar" if not set in storage', async () => {
    const config = await apiClient.interceptors.request.handlers[0].fulfilled({
      headers: {}
    });

    expect(config.headers['Accept-Language']).toBe('ar');
  });

  it('should have standard JSON headers configured by default', () => {
    expect(apiClient.defaults.headers['Accept']).toBe('application/json');
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should properly purge auth storage on 401 Unauthorized response', async () => {
    localStorage.setItem('token', 'stale_token');
    localStorage.setItem('admin', JSON.stringify({ name: 'Admin' }));

    const errorObj = {
      response: { status: 401 }
    };

    try {
      await apiClient.interceptors.response.handlers[0].rejected(errorObj);
    } catch (err) {
      // Expected rejection
    }

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('admin')).toBeNull();
  });
});
