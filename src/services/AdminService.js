/**
 * Admin Users & Activity Logs Service
 */

import apiClient from '../infrastructure/api/client';

export class AdminService {
  static async getAdmins(params = {}) {
    const res = await apiClient.get('/dashboard/users', { params });
    return res.data?.data || [];
  }

  static async getAdminById(id) {
    const res = await apiClient.get(`/dashboard/users/${id}`);
    return res.data?.data || res.data;
  }

  static async getCurrentAdmin() {
    let localAdmin = null;
    try {
      localAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
    } catch (e) {
      localAdmin = null;
    }

    const adminId = localAdmin?.id || 1;
    try {
      const res = await apiClient.get(`/dashboard/users/${adminId}`);
      const admin = res.data?.data !== undefined ? res.data.data : res.data;
      if (admin && typeof admin === 'object' && admin.id) {
        const merged = {
          name: 'مدير النظام',
          role_name: 'مدير النظام',
          ...localAdmin,
          ...admin,
          name: admin.name || localAdmin?.name || 'مدير النظام',
        };
        localStorage.setItem('admin', JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      // Fallback to /auth/me
      try {
        const meRes = await apiClient.get('/auth/me');
        const meAdmin = meRes.data?.data !== undefined ? meRes.data.data : meRes.data;
        if (meAdmin && typeof meAdmin === 'object') {
          const merged = {
            name: 'مدير النظام',
            role_name: 'مدير النظام',
            ...localAdmin,
            ...meAdmin,
            name: meAdmin.name || localAdmin?.name || 'مدير النظام',
          };
          localStorage.setItem('admin', JSON.stringify(merged));
          return merged;
        }
      } catch (authErr) {
        console.warn('Could not fetch current admin from API', authErr);
      }
    }
    return localAdmin ? { name: 'مدير النظام', role_name: 'مدير النظام', ...localAdmin, name: localAdmin.name || 'مدير النظام' } : { id: null, name: 'مدير النظام', email: '', role_name: 'مدير النظام' };
  }

  static async createAdmin(payload) {
    const res = await apiClient.post('/dashboard/users', payload);
    return res.data?.data;
  }

  static async updateAdmin(id, payload) {
    let res;
    if (payload instanceof FormData) {
      if (!payload.has('_method')) payload.append('_method', 'PUT');
      try {
        res = await apiClient.post(`/dashboard/users/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err) {
        if (err.response?.status === 405) {
          res = await apiClient.put(`/dashboard/users/${id}`, payload);
        } else {
          throw err;
        }
      }
    } else {
      try {
        res = await apiClient.put(`/dashboard/users/${id}`, payload);
      } catch (err) {
        if (err.response?.status === 405) {
          res = await apiClient.post(`/dashboard/users/${id}`, { ...payload, _method: 'PUT' });
        } else {
          throw err;
        }
      }
    }
    return res.data?.data || res.data;
  }

  static async updateProfile(id, payload) {
    let res;
    if (payload instanceof FormData) {
      if (!payload.has('_method')) payload.append('_method', 'PUT');
      try {
        res = await apiClient.post(`/dashboard/users/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err) {
        if (err.response?.status === 405) {
          res = await apiClient.put(`/dashboard/users/${id}`, payload);
        } else {
          throw err;
        }
      }
    } else {
      try {
        res = await apiClient.put(`/dashboard/users/${id}`, payload);
      } catch (err) {
        if (err.response?.status === 405) {
          res = await apiClient.post(`/dashboard/users/${id}`, { ...payload, _method: 'PUT' });
        } else {
          throw err;
        }
      }
    }
    const updated = res.data?.data || res.data;

    // Sync localStorage
    try {
      const current = JSON.parse(localStorage.getItem('admin') || '{}');
      const merged = {
        ...current,
        ...updated,
        name: updated.name || current.name,
        email: updated.email || current.email,
        phone: updated.phone || current.phone,
        avatar: updated.avatar || current.avatar,
      };
      localStorage.setItem('admin', JSON.stringify(merged));

      // Dispatch global event for instant UI synchronization (e.g. AppLayout navbar)
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('admin-profile-updated', { detail: merged }));
      }
    } catch (e) {
      console.warn('Failed to sync admin to localStorage', e);
    }

    return updated;
  }

  static async changePassword(payload) {
    const res = await apiClient.post('/dashboard/change-password', payload);
    return res.data;
  }

  static async deleteAdmin(id) {
    const res = await apiClient.delete(`/dashboard/users/${id}`);
    return res.data;
  }

  static async getActivityLogs(params = {}) {
    const res = await apiClient.get('/dashboard/activity-logs', { params });
    return res.data?.data || [];
  }
}

export default AdminService;
