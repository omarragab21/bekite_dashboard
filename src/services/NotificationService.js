/**
 * Notifications & Real-Time Alerts Service
 */

import apiClient from '../infrastructure/api/client';

export class NotificationService {
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/notifications', { params });
    return res.data?.data || [];
  }

  static async getUnreadCount() {
    const res = await apiClient.get('/dashboard/notifications/unread-count');
    return res.data?.count || 0;
  }

  static async markAllAsRead() {
    const res = await apiClient.post('/dashboard/notifications/read-all');
    return res.data;
  }

  static async markAsRead(id) {
    const res = await apiClient.post(`/dashboard/notifications/${id}/read`);
    return res.data;
  }
}

export default NotificationService;
