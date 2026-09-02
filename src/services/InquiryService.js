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
    const res = await apiClient.get('/dashboard/service-requests', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createInquiryModel);
  }

  /**
   * Fetch inquiry by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/service-requests/${id}`);
    return createInquiryModel(res.data?.data || {});
  }

  /**
   * Update inquiry status
   */
  static async updateStatus(id, status) {
    const res = await apiClient.put(`/dashboard/service-requests/${id}/status`, { status });
    return createInquiryModel(res.data?.data || {});
  }

  /**
   * Update entire inquiry notes or details
   */
  static async update(id, payload) {
    const res = await apiClient.put(`/dashboard/service-requests/${id}`, payload);
    return createInquiryModel(res.data?.data || payload);
  }

  /**
   * Delete an inquiry
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/service-requests/${id}`);
    return res.data;
  }
}

export default InquiryService;
