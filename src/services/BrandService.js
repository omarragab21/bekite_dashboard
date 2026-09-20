/**
 * Brands & Ecosystem Ventures Service
 */

import apiClient from '../infrastructure/api/client';
import { createBrandModel } from '../domain/models';
import { appendUpload, appendValue } from '../utils/multipart';

export class BrandService {
  /**
   * Serialize payload into multipart/form-data matching Postman 19 parameters 1:1
   */
  static async toMultipartPayload(payload = {}) {
    const fd = new FormData();
    const skip = new Set([
      'brand_ar', 'brand_en', 'brand', 'name', 'name_en', 'title', 'title_en',
      'subtitle_ar', 'subtitle_en', 'subtitle', 'slug', 'badge',
      'brand_color', 'accent_color', 'layout', 'description_ar', 'description_en', 'description',
      'categories', 'tags', 'tags_en', 'website_url', 'apple_store_url', 'google_play_url',
      'status_of_project', 'pipeline_status', 'is_coming_soon', 'is_active',
      'image', 'cover_image', 'mockup_image', 'mockup_image_file', 'links', 'translations'
    ]);

    // Copy primitive scalar fields
    Object.entries(payload).forEach(([key, value]) => {
      if (skip.has(key) || value === null || value === undefined || typeof value === 'object') return;
      appendValue(fd, key, value);
    });

    // 1 & 2. Brand names (brand_ar, brand_en, brand)
    const brand_ar = payload.brand_ar || payload.name || payload.title || '';
    const brand_en = payload.brand_en || payload.name_en || payload.title_en || '';
    appendValue(fd, 'brand_ar', brand_ar);
    appendValue(fd, 'brand_en', brand_en);
    appendValue(fd, 'brand', brand_ar);

    // 3 & 4. Subtitles (subtitle_ar, subtitle_en, subtitle)
    const subtitle_ar = payload.subtitle_ar || payload.subtitle || '';
    const subtitle_en = payload.subtitle_en || payload.subtitle || '';
    appendValue(fd, 'subtitle_ar', subtitle_ar);
    appendValue(fd, 'subtitle_en', subtitle_en);
    appendValue(fd, 'subtitle', subtitle_ar);

    // 5. Slug
    const slug = (payload.slug || '').trim() || (brand_en ? brand_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `brand-${Date.now()}`);
    appendValue(fd, 'slug', slug);

    // 6. Badge
    appendValue(fd, 'badge', payload.badge || 'CONSUMER APP');

    // 7 & 8. Colors
    appendValue(fd, 'brand_color', payload.brand_color || '#0F172A');
    appendValue(fd, 'accent_color', payload.accent_color || '#38BDF8');

    // 9. Layout (backend expects image_left or image_right)
    const layout = (payload.layout || 'image_left').replace('-', '_');
    appendValue(fd, 'layout', layout);

    // 10 & 11. Descriptions (description_ar, description_en, description)
    const description_ar = payload.description_ar || payload.description || '';
    const description_en = payload.description_en || '';
    appendValue(fd, 'description_ar', description_ar);
    appendValue(fd, 'description_en', description_en);
    appendValue(fd, 'description', description_ar);

    // 12. Categories (categories[0], categories[1], ...)
    const categories = Array.isArray(payload.categories) && payload.categories.length
      ? payload.categories
      : (Array.isArray(payload.tags) && payload.tags.length ? payload.tags : ['علامة استهلاكية']);
    categories.forEach((cat, idx) => {
      appendValue(fd, `categories[${idx}]`, cat);
    });

    // 13. Website URL
    const website_url = payload.website_url || (payload.links?.find(l => l.label?.includes('موقع') || l.label?.toLowerCase()?.includes('web'))?.href) || '';
    if (website_url && website_url !== '#') appendValue(fd, 'website_url', website_url);

    // 14. Apple Store URL
    const apple_store_url = payload.apple_store_url || (payload.links?.find(l => l.label?.toLowerCase()?.includes('ios') || l.label?.includes('آبل'))?.href) || '';
    if (apple_store_url && apple_store_url !== '#') appendValue(fd, 'apple_store_url', apple_store_url);

    // 15. Google Play URL
    const google_play_url = payload.google_play_url || (payload.links?.find(l => l.label?.toLowerCase()?.includes('android') || l.label?.includes('أندرويد'))?.href) || '';
    if (google_play_url && google_play_url !== '#') appendValue(fd, 'google_play_url', google_play_url);

    // 16. Status of project
    const status_of_project = payload.status_of_project || payload.pipeline_status || (payload.is_coming_soon ? 'In Pipeline' : 'Live Production');
    appendValue(fd, 'status_of_project', status_of_project);

    // 17. Is Coming Soon (0 or 1)
    const is_coming_soon = payload.is_coming_soon ? '1' : '0';
    appendValue(fd, 'is_coming_soon', is_coming_soon);

    // 18. Is Active (0 or 1)
    const is_active = payload.is_active !== undefined ? (payload.is_active ? '1' : '0') : '1';
    appendValue(fd, 'is_active', is_active);

    // 19. Mockup Image File (mockup_image_file)
    await appendUpload(
      fd,
      'mockup_image_file',
      payload.mockup_image_file || payload.image || payload.cover_image || payload.mockup_image,
      'brand-mockup.png'
    );

    return fd;
  }

  /**
   * Fetch all venture brand showcases
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/brand-showcases', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createBrandModel);
  }

  /**
   * Fetch brand showcase by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/brand-showcases/${id}`);
    return createBrandModel(res.data?.data || {});
  }

  /**
   * Helper to normalize payload for backend validation requirements
   */
  static normalizePayload(payload = {}) {
    const brand_ar = (payload.brand_ar || payload.name || payload.title || '').trim();
    const brand_en = (payload.brand_en || payload.name_en || payload.title_en || '').trim();
    const slug = (payload.slug || '').trim() || (brand_en ? brand_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `brand-${Date.now()}`);

    return {
      ...payload,
      brand_ar,
      brand_en,
      name: brand_ar,
      name_en: brand_en,
      title: brand_ar,
      title_en: brand_en,
      brand: brand_ar,
      subtitle_ar: payload.subtitle_ar || payload.subtitle || '',
      subtitle_en: payload.subtitle_en || payload.subtitle || '',
      subtitle: payload.subtitle_ar || payload.subtitle || '',
      description_ar: payload.description_ar || payload.description || '',
      description_en: payload.description_en || '',
      description: payload.description_ar || payload.description || '',
      slug,
      badge: payload.badge || 'CONSUMER APP',
      layout: (payload.layout || 'image_left').replace('-', '_'),
      status_of_project: payload.status_of_project || payload.pipeline_status || 'Live Production',
      is_coming_soon: payload.is_coming_soon ? 1 : 0,
      is_active: payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1,
    };
  }

  /**
   * Create a new brand showcase
   */
  static async create(payload) {
    const normalized = BrandService.normalizePayload(payload);
    try {
      const fd = await BrandService.toMultipartPayload(normalized);
      const res = await apiClient.post('/dashboard/brand-showcases', fd);
      return createBrandModel(res.data?.data || payload);
    } catch (err) {
      // Fallback to JSON payload if server does not accept multipart on create
      const res = await apiClient.post('/dashboard/brand-showcases', normalized);
      return createBrandModel(res.data?.data || payload);
    }
  }

  /**
   * Update an existing brand showcase using POST with _method: PUT
   */
  static async update(id, payload) {
    const normalized = BrandService.normalizePayload(payload);
    try {
      const fd = await BrandService.toMultipartPayload(normalized);
      fd.append('_method', 'PUT');
      const res = await apiClient.post(`/dashboard/brand-showcases/${id}`, fd);
      return createBrandModel(res.data?.data || payload);
    } catch (err) {
      // Fallback to standard PUT request
      const res = await apiClient.put(`/dashboard/brand-showcases/${id}`, normalized);
      return createBrandModel(res.data?.data || payload);
    }
  }

  /**
   * Delete a brand showcase
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/brand-showcases/${id}`);
    return res.data;
  }

  // --- Public Website Endpoints ---

  /**
   * Fetch public brand showcases
   */
  static async getPublicBrands(params = {}) {
    const res = await apiClient.get('/site/brand-showcases', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createBrandModel);
  }

  /**
   * Fetch public brand showcase by ID
   */
  static async getPublicBrandById(id) {
    const res = await apiClient.get(`/site/brand-showcases/${id}`);
    return createBrandModel(res.data?.data || {});
  }
}

export default BrandService;
