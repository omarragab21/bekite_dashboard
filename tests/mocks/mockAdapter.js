/**
 * Mock API Adapter for Be Kite Admin CMS & Portfolio Platform
 * Intercepts Axios requests and provides complete Be Kite data responses.
 */

import { initialMockData } from './mockData';
import { DEFAULT_PARTNERS } from '../../src/services/PartnerService';

const STORAGE_KEY = 'bekite_cms_v11_db';

class MockDB {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure essential Be Kite keys exist
        if (parsed.projects && parsed.products && parsed.services && parsed.brands) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load mock db from localStorage', e);
    }
    const fresh = JSON.parse(JSON.stringify(initialMockData));
    this._save(fresh);
    return fresh;
  }

  _save(dataToSave) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave || this.data));
    } catch (e) {
      console.warn('Failed to save mock db to localStorage', e);
    }
  }

  get(key) {
    if (!this.data[key]) {
      if (key === 'partners') {
        this.data[key] = JSON.parse(JSON.stringify(DEFAULT_PARTNERS));
      } else {
        this.data[key] = initialMockData[key] ? JSON.parse(JSON.stringify(initialMockData[key])) : [];
      }
    }
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    this._save();
  }

  add(key, item) {
    const list = this.get(key);
    const newId = list.length > 0 ? Math.max(...list.map(i => Number(i.id) || 0)) + 1 : 1;
    const newItem = { id: newId, created_at: new Date().toISOString().split('T')[0], ...item };
    list.unshift(newItem);
    this._save();
    return newItem;
  }

  update(key, id, updates) {
    const list = this.get(key);
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this._save();
      return list[idx];
    }
    return null;
  }

  delete(key, id) {
    let list = this.get(key);
    const initialLen = list.length;
    list = list.filter(i => String(i.id) !== String(id));
    this.data[key] = list;
    this._save();
    return list.length < initialLen;
  }
}

export const mockDb = new MockDB();

/**
 * Handle incoming Axios config and generate a mock response
 */
export async function handleMockRequest(config) {
  const method = (config.method || 'get').toLowerCase();
  let url = config.url || '';

  // Remove full baseURL prefix if present
  url = url.replace(/^https?:\/\/[^/]+\/api/, '').replace(/^\/api/, '');
  if (!url.startsWith('/')) url = '/' + url;

  // Simulate minimal network latency for smooth UI feel
  await new Promise(res => setTimeout(res, 60));

  let data = null;
  if (config.data) {
    if (typeof config.data === 'string') {
      try {
        data = JSON.parse(config.data);
      } catch {
        data = config.data;
      }
    } else if (config.data instanceof FormData) {
      data = {};
      config.data.forEach((value, key) => {
        data[key] = value;
      });
    } else {
      data = config.data;
    }
  }

  // 1. Auth routes
  if (url === '/dashboard/login' || url === '/v1/login' || url === '/frontend/login' || url === '/login' || url === '/admin/auth/login') {
    const admin = mockDb.get('admin');
    return {
      status: 200,
      data: {
        success: true,
        token: 'bekite_auth_token_2026_enterprise',
        admin: admin,
        user: admin,
        customer: { id: 1, name: 'مدير النظام', email: data?.email || 'admin@bekite.com' },
        message: 'تم تسجيل الدخول بنجاح إلى منصة بي كايت',
      },
    };
  }

  if (url === '/dashboard/logout' || url === '/logout' || url === '/frontend/logout' || url === '/admin/auth/logout') {
    return {
      status: 200,
      data: { success: true, message: 'تم تسجيل الخروج بنجاح' },
    };
  }

  if (url === '/auth/me' || url === '/admin/auth/me' || url === '/frontend/user') {
    const admin = mockDb.get('admin');
    return {
      status: 200,
      data: { success: true, data: admin },
    };
  }

  // Password change endpoint
  if (url === '/dashboard/change-password' || url === '/admin/change-password' || url === '/auth/change-password') {
    return {
      status: 200,
      data: {
        success: true,
        message: 'تم تحديث كلمة المرور بنجاح',
      },
    };
  }

  // Dedicated admin profile endpoints
  if (url === '/dashboard/profile' || url === '/admin/profile' || url === '/dashboard/users/me') {
    if (method === 'get') {
      const admin = mockDb.get('admin');
      return {
        status: 200,
        data: { success: true, data: admin },
      };
    }
    if (method === 'post' || method === 'put' || method === 'patch') {
      let updateData = data;
      if (data && typeof data.entries === 'function') {
        updateData = {};
        for (const [k, v] of data.entries()) {
          if (k !== '_method') updateData[k] = v;
        }
      }
      const admin = mockDb.get('admin');
      const updated = { ...admin, ...(updateData || {}) };
      mockDb.set('admin', updated);
      if (admin.id) {
        mockDb.update('admins', admin.id, updated);
      }
      return {
        status: 200,
        data: { success: true, data: updated, message: 'تم تحديث الملف الشخصي بنجاح' },
      };
    }
  }

  // 2. Statistics & Analytics
  if (url === '/dashboard/statistics' || url === '/admin/analytics/overview') {
    const stats = mockDb.get('statistics');
    const projects = mockDb.get('projects');
    const products = mockDb.get('products');
    const inquiries = mockDb.get('serviceRequests');
    return {
      status: 200,
      data: {
        status: 'success',
        data: {
          ...stats,
          recent_inquiries: inquiries.slice(0, 5),
          recent_projects: projects.slice(0, 4),
          featured_products: products.filter(p => p.is_featured),
        },
      },
    };
  }

  // 3. Notifications
  if (url.startsWith('/dashboard/notifications/unread-count')) {
    const notifs = mockDb.get('notifications');
    const unread = notifs.filter(n => !n.is_read || n.is_read === 0).length;
    return {
      status: 200,
      data: { count: unread, unread_count: unread },
    };
  }

  if (url.startsWith('/dashboard/notifications/read-all')) {
    const notifs = mockDb.get('notifications');
    notifs.forEach(n => { n.is_read = 1; });
    mockDb.set('notifications', notifs);
    return { status: 200, data: { success: true } };
  }

  if (url.startsWith('/dashboard/notifications/') && url.endsWith('/read')) {
    const id = url.split('/')[3];
    mockDb.update('notifications', id, { is_read: 1 });
    return { status: 200, data: { success: true } };
  }

  // 4. Resource Routes Mapping
  const routesMapping = [
    { pattern: /^\/(?:dashboard|admin|site)\/projects(?:\/(\d+))?/, key: 'projects' },
    { pattern: /^\/(?:dashboard|admin|site)\/project-categories(?:\/(\d+))?/, key: 'projectCategories' },
    { pattern: /^\/(?:dashboard|admin|site)\/products(?:\/(\d+))?/, key: 'products' },
    { pattern: /^\/(?:dashboard|admin|site)\/categories(?:\/(\d+))?/, key: 'productCategories' },
    { pattern: /^\/(?:dashboard|admin)\/product-categories(?:\/(\d+))?/, key: 'productCategories' },
    { pattern: /^\/(?:dashboard|admin|site)\/solutions(?:\/(\d+))?/, key: 'services' },
    { pattern: /^\/(?:dashboard|admin)\/services(?:\/(\d+))?/, key: 'services' },
    { pattern: /^\/(?:dashboard|admin|site)\/brand-showcases(?:\/(\d+))?/, key: 'brands' },
    { pattern: /^\/(?:dashboard|admin)\/brands(?:\/(\d+))?/, key: 'brands' },
    { pattern: /^\/(?:dashboard|admin)\/service-requests(?:\/(\d+))?/, key: 'serviceRequests' },
    { pattern: /^\/(?:dashboard|admin|site)\/inquiries(?:\/(\d+))?/, key: 'serviceRequests' },
    { pattern: /^\/(?:dashboard|admin|site)\/job-site(?:\/(\d+))?/, key: 'careers' },
    { pattern: /^\/(?:dashboard|admin|site)\/job-sites(?:\/(\d+))?/, key: 'careers' },
    { pattern: /^\/(?:dashboard|admin)\/careers(?:\/(\d+))?/, key: 'careers' },
    { pattern: /^\/(?:dashboard|admin)\/knowledge-guides(?:\/(\d+))?/, key: 'careers' },
    { pattern: /^\/(?:dashboard|admin)\/team-members(?:\/(\d+))?/, key: 'teamMembers' },
    { pattern: /^\/(?:dashboard|admin)\/news-events(?:\/(\d+))?/, key: 'newsEvents' },
    { pattern: /^\/(?:dashboard|admin)\/dynamic-pages(?:\/(\d+))?/, key: 'dynamicPages' },
    { pattern: /^\/(?:dashboard|admin)\/legal(?:\/(\d+))?/, key: 'dynamicPages' },
    { pattern: /^\/(?:dashboard|admin)\/topics(?:\/(\d+))?/, key: 'dynamicPages' },
    { pattern: /^\/(?:dashboard|admin)\/contact-messages(?:\/(\d+))?/, key: 'messages' },
    { pattern: /^\/(?:dashboard|admin|site)\/messages(?:\/(\d+))?/, key: 'messages' },
    { pattern: /^\/(?:dashboard|admin)\/users(?:\/(\d+))?/, key: 'admins' },
    { pattern: /^\/(?:dashboard|admin)\/admins(?:\/(\d+))?/, key: 'admins' },
    { pattern: /^\/(?:dashboard|admin)\/activity-log(?:s)?(?:\/(\d+))?/, key: 'activityLogs' },
    { pattern: /^\/(?:dashboard|admin)\/notifications(?:\/(\d+))?/, key: 'notifications' },
    { pattern: /^\/(?:dashboard|admin|site)\/partners(?:\/(\d+))?/, key: 'partners' },
  ];

  // Specific status toggles
  if (url.match(/\/(?:contact-messages|messages)\/(\d+)\/(read|unread)/) && (method === 'patch' || method === 'put' || method === 'post')) {
    const parts = url.match(/\/(?:contact-messages|messages)\/(\d+)\/(read|unread)/);
    const id = parts[1];
    const status = parts[2];
    const updated = mockDb.update('messages', id, { status, is_read: status === 'read' ? 1 : 0 });
    return { status: 200, data: { success: true, data: updated, message: 'تم تحديث حالة الرسالة' } };
  }

  if (url.match(/\/(?:contact-messages|messages)\/(\d+)\/status/) && (method === 'patch' || method === 'put' || method === 'post')) {
    const id = url.match(/\/(?:contact-messages|messages)\/(\d+)\/status/)[1];
    const status = data?.status || 'read';
    const updated = mockDb.update('messages', id, { status, is_read: status === 'read' ? 1 : 0 });
    return { status: 200, data: { success: true, data: updated, message: 'تم تحديث حالة الرسالة' } };
  }

  if (url.match(/\/(?:service-requests|inquiries)\/(\d+)\/status/) && (method === 'put' || method === 'patch' || method === 'post')) {
    const id = url.match(/\/(?:service-requests|inquiries)\/(\d+)\/status/)[1];
    const status = data?.status || 'contacted';
    const updated = mockDb.update('serviceRequests', id, { status });
    return { status: 200, data: { success: true, data: updated, message: 'تم تحديث حالة الطلب' } };
  }

  // Reorder endpoints
  if (url.includes('/reorder')) {
    if (data?.ids && Array.isArray(data.ids)) {
      // Reorder items if target key is found
      for (const mapping of routesMapping) {
        if (url.includes(mapping.key) || url.includes(mapping.key.toLowerCase())) {
          const list = mockDb.get(mapping.key);
          const reordered = data.ids.map((id, index) => {
            const item = list.find(i => String(i.id) === String(id));
            if (item) item.order_index = index + 1;
            return item;
          }).filter(Boolean);
          mockDb.set(mapping.key, reordered.length ? reordered : list);
          break;
        }
      }
    }
    return { status: 200, data: { success: true, message: 'تم تحديث الترتيب بنجاح' } };
  }

  // Media upload simulation
  if (url.includes('/media/upload')) {
    return {
      status: 200,
      data: {
        success: true,
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        message: 'تم رفع الملف بنجاح',
      },
    };
  }

  // Settings
  if (url === '/dashboard/settings' || url === '/admin/settings' || url === '/frontend/settings') {
    if (method === 'get') {
      const settings = mockDb.get('settings');
      return { status: 200, data: { success: true, data: settings } };
    }
    if (method === 'post' || method === 'put') {
      if (data && typeof data === 'object') {
        const current = mockDb.get('settings');
        Object.keys(data).forEach(k => {
          const entry = current.find(s => s.key === k);
          if (entry) entry.value = data[k];
          else current.push({ key: k, value: data[k] });
        });
        mockDb.set('settings', current);
      }
      return { status: 200, data: { success: true, message: 'تم حفظ الإعدادات بنجاح' } };
    }
  }

  // Check general resource routes
  for (const route of routesMapping) {
    const match = url.match(route.pattern);
    if (match) {
      const id = match[1];
      const key = route.key;

      if (method === 'get') {
        let items = mockDb.get(key);
        if (id) {
          const item = items.find(i => String(i.id) === String(id));
          return { status: 200, data: { success: true, data: item || items[0] } };
        }

        // Handle filtering params if present
        const params = config.params || {};
        if (params.search) {
          const q = String(params.search).toLowerCase();
          items = items.filter(i =>
            (i.name && String(i.name).toLowerCase().includes(q)) ||
            (i.sender_name && String(i.sender_name).toLowerCase().includes(q)) ||
            (i.title && String(i.title).toLowerCase().includes(q)) ||
            (i.email && String(i.email).toLowerCase().includes(q)) ||
            (i.subject && String(i.subject).toLowerCase().includes(q)) ||
            (i.message && String(i.message).toLowerCase().includes(q))
          );
        }
        if (params.status) {
          items = items.filter(i =>
            i.status === params.status ||
            (params.status === 'read' && (i.is_read === 1 || i.is_read === true)) ||
            (params.status === 'unread' && (i.is_read === 0 || i.is_read === false))
          );
        }

        return {
          status: 200,
          data: {
            success: true,
            data: items,
            meta: { total: items.length, current_page: 1, last_page: 1 },
          },
        };
      }

      const isPostPut = Boolean(method === 'post' && id) || (
        (data && typeof data.get === 'function' && (data.get('_method') === 'PUT' || data.get('_method') === 'PATCH')) ||
        (data && typeof data === 'object' && (data._method === 'PUT' || data._method === 'PATCH'))
      );

      if (method === 'put' || method === 'patch' || isPostPut) {
        let updateData = data;
        if (data && typeof data.entries === 'function') {
          updateData = {};
          for (const [k, v] of data.entries()) {
            if (k !== '_method') updateData[k] = v;
          }
        }
        const updated = mockDb.update(key, id, updateData || {});
        if (key === 'admins' && updated) {
          const currentAdmin = mockDb.get('admin');
          if (currentAdmin && (String(currentAdmin.id) === String(id) || !currentAdmin.id)) {
            mockDb.set('admin', { ...currentAdmin, ...updated });
          }
        }
        return { status: 200, data: { success: true, data: updated, message: 'تم التحديث بنجاح' } };
      }

      if (method === 'post') {
        let createData = data;
        if (data && typeof data.entries === 'function') {
          createData = {};
          for (const [k, v] of data.entries()) {
            createData[k] = v;
          }
        }
        const created = mockDb.add(key, createData || {});
        return { status: 200, data: { success: true, data: created, message: 'تمت الإضافة بنجاح' } };
      }

      if (method === 'delete') {
        mockDb.delete(key, id);
        return { status: 200, data: { success: true, message: 'تم الحذف بنجاح' } };
      }
    }
  }

  // Default fallback response
  return {
    status: 200,
    data: {
      success: true,
      data: [],
      message: 'OK (Mock)',
    },
  };
}
