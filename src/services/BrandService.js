/**
 * Brands & Ecosystem Ventures Service
 */

import apiClient from '../infrastructure/api/client';
import { createBrandModel } from '../domain/models';

export class BrandService {
  /**
   * Fetch all venture brands
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/brands', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createBrandModel);
  }

  /**
   * Fetch brand by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/brands/${id}`);
    return createBrandModel(res.data?.data || {});
  }

  /**
   * Create a new brand venture
   */
  static async create(payload) {
    const res = await apiClient.post('/dashboard/brands', payload);
    return createBrandModel(res.data?.data || payload);
  }

  /**
   * Update an existing brand
   */
  static async update(id, payload) {
    const res = await apiClient.put(`/dashboard/brands/${id}`, payload);
    return createBrandModel(res.data?.data || payload);
  }

  /**
   * Delete a brand
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/brands/${id}`);
    return res.data;
  }
}

export default BrandService;
