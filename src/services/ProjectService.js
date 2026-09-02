/**
 * Project & Portfolio Service
 */

import apiClient from '../infrastructure/api/client';
import { createProjectModel } from '../domain/models';

export class ProjectService {
  /**
   * Fetch all portfolio projects
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/projects', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createProjectModel);
  }

  /**
   * Fetch a single project by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/projects/${id}`);
    return createProjectModel(res.data?.data || {});
  }

  /**
   * Create a new project
   */
  static async create(payload) {
    const res = await apiClient.post('/dashboard/projects', payload);
    return createProjectModel(res.data?.data || payload);
  }

  /**
   * Update an existing project
   */
  static async update(id, payload) {
    const res = await apiClient.put(`/dashboard/projects/${id}`, payload);
    return createProjectModel(res.data?.data || payload);
  }

  /**
   * Delete a project
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/projects/${id}`);
    return res.data;
  }

  /**
   * Reorder projects
   */
  static async reorder(ids) {
    const res = await apiClient.post('/dashboard/projects/reorder', { ids });
    return res.data;
  }

  /**
   * Fetch project categories
   */
  static async getCategories() {
    const res = await apiClient.get('/dashboard/project-categories');
    return res.data?.data || [];
  }

  /**
   * Create a project category
   */
  static async createCategory(payload) {
    const res = await apiClient.post('/dashboard/project-categories', payload);
    return res.data?.data;
  }

  /**
   * Update a project category
   */
  static async updateCategory(id, payload) {
    const res = await apiClient.put(`/dashboard/project-categories/${id}`, payload);
    return res.data?.data;
  }

  /**
   * Delete a project category
   */
  static async deleteCategory(id) {
    const res = await apiClient.delete(`/dashboard/project-categories/${id}`);
    return res.data;
  }
}

export default ProjectService;
