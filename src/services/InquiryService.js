/**
 * CRM Inquiries & Service Requests Service
 */

import apiClient from '../infrastructure/api/client';
import { createInquiryModel } from '../domain/models';

export class InquiryService {
  /**
   * Fetch all inquiries / leads
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/inquiries', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createInquiryModel);
  }

  /**
   * Fetch inquiry by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/inquiries/${id}`);
    return createInquiryModel(res.data?.data || {});
  }

  /**
   * Create an inquiry
   */
  static async create(payload) {
    const res = await apiClient.post('/dashboard/inquiries', payload);
    return createInquiryModel(res.data?.data || payload);
  }

  /**
   * Update inquiry status or admin notes
   */
  static async update(id, payload) {
    const res = await apiClient.put(`/dashboard/inquiries/${id}`, payload);
    return createInquiryModel(res.data?.data || payload);
  }

  /**
   * Update inquiry status
   */
  static async updateStatus(id, status, admin_notes = '') {
    const res = await apiClient.put(`/dashboard/inquiries/${id}`, { status, admin_notes });
    return createInquiryModel(res.data?.data || {});
  }

  /**
   * Delete an inquiry
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/inquiries/${id}`);
    return res.data;
  }

  // --- Public Website Endpoints ---

  /**
   * Submit an inquiry from public website
   */
  static async submitPublicInquiry(payload) {
    const res = await apiClient.post('/site/inquiries', payload);
    return res.data;
  }
}

export default InquiryService;
