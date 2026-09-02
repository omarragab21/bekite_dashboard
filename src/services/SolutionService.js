/**
 * Solutions & Digital Services Service
 */

import apiClient from '../infrastructure/api/client';
import { createSolutionModel } from '../domain/models';

export class SolutionService {
  /**
   * Fetch all solutions & services
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/services', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createSolutionModel);
  }

  /**
   * Fetch solution by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/services/${id}`);
    return createSolutionModel(res.data?.data || {});
  }

  /**
   * Create a new solution
   */
  static async create(payload) {
    const res = await apiClient.post('/dashboard/services', payload);
    return createSolutionModel(res.data?.data || payload);
  }

  /**
   * Update an existing solution
   */
  static async update(id, payload) {
    const res = await apiClient.put(`/dashboard/services/${id}`, payload);
    return createSolutionModel(res.data?.data || payload);
  }

  /**
   * Delete a solution
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/services/${id}`);
    return res.data;
  }
}

export default SolutionService;
