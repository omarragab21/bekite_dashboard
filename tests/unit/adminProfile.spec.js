import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminService } from '../../src/services/AdminService';
import { mockDb } from '../mocks/mockAdapter';

describe('Admin Profile & User Update Service Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    // Pre-populate mockDb admin
    const defaultAdmin = {
      id: 1,
      name: 'مدير النظام',
      email: 'admin@bekite.com',
      phone: '+966 50 123 4567',
      role: 'super_admin',
      role_name: 'مدير عام النظام (Super Admin)',
      status: 1,
      is_active: 1,
      created_at: '2025-01-01',
    };
    mockDb.set('admin', defaultAdmin);
    mockDb.set('admins', [defaultAdmin]);
  });

  it('fetches current admin from API successfully', async () => {
    const admin = await AdminService.getCurrentAdmin();
    expect(admin).toBeDefined();
    expect(admin.name).toBe('مدير النظام');
    expect(admin.email).toBe('admin@bekite.com');

    // Should also be cached in localStorage
    const saved = JSON.parse(localStorage.getItem('admin') || '{}');
    expect(saved.name).toBe('مدير النظام');
  });

  it('fetches admin by ID via API endpoint /dashboard/users/:id', async () => {
    const admin = await AdminService.getAdminById(1);
    expect(admin).toBeDefined();
    expect(admin.id).toBe(1);
  });

  it('updates admin user profile name, email, and phone via API', async () => {
    if (typeof window.dispatchEvent !== 'function') {
      window.dispatchEvent = () => true;
    }
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const updatePayload = {
      name: 'المسؤول التقني المطور',
      email: 'tech.dev@bekite.com',
      phone: '+966 55 999 8888',
    };

    const updated = await AdminService.updateProfile(1, updatePayload);
    expect(updated).toBeDefined();
    expect(updated.name).toBe('المسؤول التقني المطور');
    expect(updated.email).toBe('tech.dev@bekite.com');
    expect(updated.phone).toBe('+966 55 999 8888');

    // Verify localStorage was updated
    const savedInStorage = JSON.parse(localStorage.getItem('admin') || '{}');
    expect(savedInStorage.name).toBe('المسؤول التقني المطور');
    expect(savedInStorage.email).toBe('tech.dev@bekite.com');

    // Verify global event was dispatched for AppLayout navbar reactivity
    expect(dispatchSpy).toHaveBeenCalled();
    const eventArg = dispatchSpy.mock.calls.find(call => call[0] && call[0].type === 'admin-profile-updated');
    expect(eventArg).toBeDefined();
    expect(eventArg[0].detail.name).toBe('المسؤول التقني المطور');

    dispatchSpy.mockRestore();
  });

  it('supports updating profile using multipart FormData with avatar', async () => {
    const formData = new FormData();
    formData.append('name', 'مدير النظام - بي كايت إنتل');
    formData.append('email', 'admin@bekite.com');
    formData.append('phone', '+966 50 111 2222');
    formData.append('avatar', 'https://bekite.com/assets/new-avatar.png');

    const updated = await AdminService.updateProfile(1, formData);
    expect(updated).toBeDefined();
    expect(updated.name).toBe('مدير النظام - بي كايت إنتل');

    const admin = await AdminService.getCurrentAdmin();
    expect(admin.name).toBe('مدير النظام - بي كايت إنتل');
  });

  it('executes change-password endpoint cleanly', async () => {
    const result = await AdminService.changePassword({
      current_password: 'CurrentPassword123!',
      new_password: 'NewSecurePassword2026!',
      new_password_confirmation: 'NewSecurePassword2026!',
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain('كلمة المرور');
  });

  it('synchronizes profile changes with the general admins list in the backend', async () => {
    await AdminService.updateProfile(1, { name: 'مدير عام المنظومة المحدث' });

    const admins = await AdminService.getAdmins();
    const target = admins.find(a => Number(a.id) === 1);
    expect(target).toBeDefined();
    expect(target.name).toBe('مدير عام المنظومة المحدث');
  });

  it('falls back dynamically to "مدير النظام" when no admin name exists in storage/API', async () => {
    localStorage.clear();
    mockDb.set('admin', null);
    mockDb.set('admins', []);
    const admin = await AdminService.getCurrentAdmin();
    expect(admin).toBeDefined();
    expect(admin.name).toBe('مدير النظام');
  });
});
