/**
 * Project & Portfolio Service
 */

import apiClient from '../infrastructure/api/client';
import { createProjectModel } from '../domain/models';
import { appendUpload, appendValue } from '../utils/multipart';

export class ProjectService {
  static async toMultipartPayload(payload = {}) {
    const fd = new FormData();
    const skip = new Set([
      'social_media_images', 'branding_images', 'web_image', 'mobile_image', 'card_image', 'image',
      'logo', 'branding_pdf_url', 'branding_pdf_name', 'stats', 'social_links', 'filter_categories',
      'category_ids', 'tags', 'deliverables', 'kpi', 'images', 'created_at', 'updated_at',
    ]);
    const arrayFields = new Set(['tags', 'deliverables', 'category_ids', 'filter_categories']);

    Object.entries(payload).forEach(([key, value]) => {
      if (skip.has(key) || value === null || value === undefined || typeof value === 'object') return;
      appendValue(fd, key, value);
    });

    for (const key of arrayFields) {
      const values = Array.isArray(payload[key]) ? payload[key] : [];
      values.forEach((value, index) => appendValue(fd, `${key}[${index}]`, value));
    }

    const webImage = payload.web_image || payload.card_image || payload.image;
    const mobileImage = payload.mobile_image;
    const logo = payload.logo;
    const pdf = payload.branding_pdf_url;
    await appendUpload(fd, 'website_showcase_image_file', webImage, 'website-showcase.png');
    await appendUpload(fd, 'mobile_app_mockup_image_file', mobileImage, 'mobile-mockup.png');
    await appendUpload(fd, 'client_logo_file', logo, 'client-logo.png');
    await appendUpload(fd, 'pdf_file', pdf, 'brand-guidelines.pdf');

    if (Array.isArray(payload.stats)) {
      payload.stats.forEach((stat, index) => {
        appendValue(fd, `kpi[${index}][percentage]`, stat.value || stat.percentage);
        appendValue(fd, `kpi[${index}][text]`, stat.label || stat.text);
      });
    }
    if (payload.social_links && typeof payload.social_links === 'object') {
      const linkMap = { facebook: 'facebook_url', instagram: 'instagram_url', twitter: 'twitter_x_url', linkedin: 'linkedin_url', tiktok: 'tiktok_url', youtube: 'youtube_url' };
      Object.entries(linkMap).forEach(([source, target]) => appendValue(fd, target, payload.social_links[source]));
    }

    const gallery = [
      ...(Array.isArray(payload.social_media_images) ? payload.social_media_images.map((item) => ({ ...item, type: item.type || 'social' })) : []),
      ...(Array.isArray(payload.branding_images) ? payload.branding_images.map((item) => ({ ...item, type: item.type || 'branding' })) : []),
    ];
    for (const [index, item] of gallery.entries()) {
      appendValue(fd, `images_data[${index}][title]`, item.title || `Image ${index + 1}`);
      appendValue(fd, `images_data[${index}][type]`, item.type);
      await appendUpload(fd, `images_data[${index}][file]`, item.file || item.image || item.url, `gallery-${index + 1}.png`);
    }
    return fd;
  }
  /**
   * Fetch all portfolio projects
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/projects', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createProjectModel);
  }

  /**
   * Fetch a single project by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/projects/${id}`);
    return createProjectModel(res.data?.data || {});
  }

  /**
   * Helper to normalize payload for backend validation requirements
   */
  static normalizePayload(payload = {}) {
    const name_ar = (payload.name_ar || payload.title || payload.name || '').trim();
    const name_en = (payload.name_en || payload.title_en || '').trim();
    const client_name = (payload.client_name || '').trim();
    const slug = (payload.slug || '').trim() || (name_en ? name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `project-${Date.now()}`);

    let category_ids = [];
    if (Array.isArray(payload.category_ids) && payload.category_ids.length) {
      category_ids = payload.category_ids.map(Number).filter(n => !isNaN(n) && n > 0);
    }
    if (!category_ids.length && payload.category_id) {
      category_ids = [Number(payload.category_id)];
    }
    if (!category_ids.length) {
      category_ids = [1];
    }

    return {
      ...payload,
      name_ar,
      name_en,
      name: name_ar,
      title: name_ar,
      title_en: name_en,
      client_name,
      slug,
      category_ids,
      badge: (payload.badge || 'Portfolio Project').trim(),
      accent_color: payload.accent_color || '#2563eb',
      year: payload.year || '2026',
      location: payload.location || 'Riyadh, KSA',
      description_ar: payload.description_ar || payload.description || name_ar,
      description_en: payload.description_en || payload.description || name_en,
      is_active: payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1,
    };
  }

  /**
   * Create a new project
   */
  static async create(payload) {
    const normalized = ProjectService.normalizePayload(payload);
    const res = await apiClient.post('/dashboard/projects', await ProjectService.toMultipartPayload(normalized));
    return createProjectModel(res.data?.data || payload);
  }

  /**
   * Update an existing project
   */
  static async update(id, payload) {
    const normalized = ProjectService.normalizePayload(payload);
    const res = await apiClient.put(`/dashboard/projects/${id}`, await ProjectService.toMultipartPayload(normalized));
    return createProjectModel(res.data?.data || payload);
  }

  /**
   * Delete a project
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/projects/${id}`);
    return res.data;
  }

  /**
   * Reorder projects
   */
  static async reorder(ids) {
    const res = await apiClient.post('/dashboard/projects/reorder', { ids });
    return res.data;
  }

  /**
   * Fetch project categories
   */
  static async getCategories() {
    const res = await apiClient.get('/dashboard/project-categories');
    return res.data?.data || [];
  }

  /**
   * Create a project category
   */
  static async createCategory(payload) {
    const res = await apiClient.post('/dashboard/project-categories', payload);
    return res.data?.data;
  }

  /**
   * Update a project category
   */
  static async updateCategory(id, payload) {
    const res = await apiClient.put(`/dashboard/project-categories/${id}`, payload);
    return res.data?.data;
  }

  /**
   * Delete a project category
   */
  static async deleteCategory(id) {
    const res = await apiClient.delete(`/dashboard/project-categories/${id}`);
    return res.data;
  }

  // --- Public Website Endpoints ---

  /**
   * Fetch public projects
   */
  static async getPublicProjects(params = {}) {
    const res = await apiClient.get('/site/projects', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createProjectModel);
  }

  /**
   * Fetch public project by ID
   */
  static async getPublicProjectById(id) {
    const res = await apiClient.get(`/site/projects/${id}`);
    return createProjectModel(res.data?.data || {});
  }

  /**
   * Fetch public project categories
   */
  static async getPublicCategories() {
    const res = await apiClient.get('/site/project-categories');
    return res.data?.data || [];
  }
}

export default ProjectService;
