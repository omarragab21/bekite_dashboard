/**
 * Platform Settings & Branding Service
 */

import apiClient from '../infrastructure/api/client';

export class SettingsService {
  /**
   * Fetch all settings
   */
  static async getAll() {
    const res = await apiClient.get('/dashboard/settings');
    return res.data?.data || [];
  }

  /**
   * Save or update settings key-value map
   */
  static async save(settingsMap) {
    const res = await apiClient.post('/dashboard/settings', settingsMap);
    return res.data;
  }
}

export default SettingsService;
