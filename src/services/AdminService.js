/**
 * Admin Users & Activity Logs Service
 */

import apiClient from '../infrastructure/api/client';

export class AdminService {
  static async getAdmins(params = {}) {
    const res = await apiClient.get('/dashboard/admins', { params });
    return res.data?.data || [];
  }

  static async createAdmin(payload) {
    const res = await apiClient.post('/dashboard/admins', payload);
    return res.data?.data;
  }

  static async updateAdmin(id, payload) {
    const res = await apiClient.put(`/dashboard/admins/${id}`, payload);
    return res.data?.data;
  }

  static async deleteAdmin(id) {
    const res = await apiClient.delete(`/dashboard/admins/${id}`);
    return res.data;
  }

  static async getActivityLogs(params = {}) {
    const res = await apiClient.get('/dashboard/activity-logs', { params });
    return res.data?.data || [];
  }
}

export default AdminService;
