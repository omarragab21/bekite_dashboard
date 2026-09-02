/**
 * Digital Products & Systems Service
 */

import apiClient from '../infrastructure/api/client';
import { createProductModel } from '../domain/models';

export class ProductService {
  /**
   * Fetch all digital products
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/products', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createProductModel);
  }

  /**
   * Fetch a single product by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/products/${id}`);
    return createProductModel(res.data?.data || {});
  }

  /**
   * Create a new product
   */
  static async create(payload) {
    const res = await apiClient.post('/dashboard/products', payload);
    return createProductModel(res.data?.data || payload);
  }

  /**
   * Update an existing product
   */
  static async update(id, payload) {
    const res = await apiClient.put(`/dashboard/products/${id}`, payload);
    return createProductModel(res.data?.data || payload);
  }

  /**
   * Delete a product
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/products/${id}`);
    return res.data;
  }

  /**
   * Fetch product categories
   */
  static async getCategories() {
    const res = await apiClient.get('/dashboard/categories');
    return res.data?.data || [];
  }

  /**
   * Create a product category
   */
  static async createCategory(payload) {
    const res = await apiClient.post('/dashboard/categories', payload);
    return res.data?.data;
  }

  /**
   * Update a product category
   */
  static async updateCategory(id, payload) {
    const res = await apiClient.put(`/dashboard/categories/${id}`, payload);
    return res.data?.data;
  }

  /**
   * Delete a product category
   */
  static async deleteCategory(id) {
    const res = await apiClient.delete(`/dashboard/categories/${id}`);
    return res.data;
  }
}

export default ProductService;
