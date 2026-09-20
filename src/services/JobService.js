/**
 * Job Postings & Career Site Service
 */

import apiClient from '../infrastructure/api/client';
import { createJobModel } from '../domain/models';
import { appendUpload, appendValue } from '../utils/multipart';

export class JobService {
  /**
   * Serialize payload into multipart/form-data matching Postman 12 parameters 1:1
   */
  static async toMultipartPayload(payload = {}) {
    const fd = new FormData();
    const skip = new Set([
      'job_title_ar', 'job_title_en', 'title', 'title_en', 'departement', 'department',
      'slug', 'badge', 'job_type', 'type', 'job_location', 'location', 'experience',
      'subtitle', 'description', 'is_active', 'skills', 'requirements',
      'image', 'heroImage', 'job_image', 'job_image_file', 'translations'
    ]);

    // Copy primitive scalar fields
    Object.entries(payload).forEach(([key, value]) => {
      if (skip.has(key) || value === null || value === undefined || typeof value === 'object') return;
      appendValue(fd, key, value);
    });

    // 1 & 2. Titles (job_title_ar, job_title_en, title, title_en)
    const job_title_ar = payload.job_title_ar || payload.title || '';
    const job_title_en = payload.job_title_en || payload.title_en || '';
    appendValue(fd, 'job_title_ar', job_title_ar);
    appendValue(fd, 'job_title_en', job_title_en);
    appendValue(fd, 'title', job_title_ar);
    appendValue(fd, 'title_en', job_title_en);

    // 3. Department (departement and department)
    const departement = payload.departement || payload.department || 'الهندسة والتطوير';
    appendValue(fd, 'departement', departement);
    appendValue(fd, 'department', departement);

    // 4. Slug
    const slug = (payload.slug || '').trim() || (job_title_en ? job_title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `job-${Date.now()}`);
    appendValue(fd, 'slug', slug);

    // 5. Badge
    appendValue(fd, 'badge', payload.badge || 'JOB OPENING');

    // 6. Job Type (job_type and type)
    const job_type = payload.job_type || payload.type || 'دوام كامل / دائم';
    appendValue(fd, 'job_type', job_type);
    appendValue(fd, 'type', job_type);

    // 7. Job Location (job_location and location)
    const job_location = payload.job_location || payload.location || 'الرياض / عمان — هجين';
    appendValue(fd, 'job_location', job_location);
    appendValue(fd, 'location', job_location);

    // 8. Experience
    appendValue(fd, 'experience', payload.experience || '+3 سنوات خبرة');

    // 9. Subtitle
    appendValue(fd, 'subtitle', payload.subtitle || job_title_en);

    // 10. Description
    appendValue(fd, 'description', payload.description || job_title_ar);

    // 11. Is Active
    const is_active = payload.is_active !== undefined ? (payload.is_active ? '1' : '0') : '1';
    appendValue(fd, 'is_active', is_active);

    // Skills array (skills[0], skills[1], ...)
    let skillsList = [];
    if (Array.isArray(payload.skills)) {
      skillsList = payload.skills;
    } else if (typeof payload.skills === 'string') {
      skillsList = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!skillsList.length) skillsList = ['Vue.js', 'React', 'TypeScript'];
    skillsList.forEach((skill, idx) => {
      appendValue(fd, `skills[${idx}]`, skill);
    });

    // Requirements array (if any)
    if (Array.isArray(payload.requirements)) {
      payload.requirements.forEach((req, idx) => {
        appendValue(fd, `requirements[${idx}]`, req);
      });
    }

    // 12. Job Image Artwork File (job_image_file)
    await appendUpload(
      fd,
      'job_image_file',
      payload.job_image_file || payload.image || payload.heroImage || payload.job_image,
      'job-artwork.png'
    );

    return fd;
  }

  /**
   * Helper to normalize payload for backend validation requirements
   */
  static normalizePayload(payload = {}) {
    const job_title_ar = (payload.job_title_ar || payload.title || '').trim();
    const job_title_en = (payload.job_title_en || payload.title_en || '').trim();
    const departement = (payload.departement || payload.department || 'الهندسة والتطوير').trim();
    const slug = (payload.slug || '').trim() || (job_title_en ? job_title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `job-${Date.now()}`);

    return {
      ...payload,
      job_title_ar,
      job_title_en,
      title: job_title_ar,
      title_en: job_title_en,
      departement,
      department: departement,
      job_type: payload.job_type || payload.type || 'دوام كامل / دائم',
      type: payload.job_type || payload.type || 'دوام كامل / دائم',
      job_location: payload.job_location || payload.location || 'الرياض / عمان — هجين',
      location: payload.job_location || payload.location || 'الرياض / عمان — هجين',
      experience: payload.experience || '+3 سنوات خبرة',
      subtitle: payload.subtitle || job_title_en,
      description: payload.description || job_title_ar,
      slug,
      badge: payload.badge || 'JOB OPENING',
      skills: Array.isArray(payload.skills) ? payload.skills : (typeof payload.skills === 'string' ? payload.skills.split(',').map(s => s.trim()).filter(Boolean) : ['Vue.js', 'React', 'TypeScript']),
      is_active: payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1,
    };
  }

  /**
   * Fetch all job postings
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/job-site', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createJobModel);
  }

  /**
   * Fetch job posting by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/job-site/${id}`);
    return createJobModel(res.data?.data || {});
  }

  /**
   * Create a job posting with multipart upload support
   */
  static async create(payload) {
    const normalized = JobService.normalizePayload(payload);
    try {
      const fd = await JobService.toMultipartPayload(normalized);
      const res = await apiClient.post('/dashboard/job-site', fd);
      return createJobModel(res.data?.data || payload);
    } catch (err) {
      // Fallback to JSON payload if server does not accept multipart on create
      const res = await apiClient.post('/dashboard/job-site', normalized);
      return createJobModel(res.data?.data || payload);
    }
  }

  /**
   * Update a job posting using method spoofing (POST with _method: PUT)
   */
  static async update(id, payload) {
    const normalized = JobService.normalizePayload(payload);
    try {
      const fd = await JobService.toMultipartPayload(normalized);
      fd.append('_method', 'PUT');
      const res = await apiClient.post(`/dashboard/job-site/${id}`, fd);
      return createJobModel(res.data?.data || payload);
    } catch (err) {
      // Fallback to standard PUT request
      const res = await apiClient.put(`/dashboard/job-site/${id}`, normalized);
      return createJobModel(res.data?.data || payload);
    }
  }

  /**
   * Delete a job posting
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/job-site/${id}`);
    return res.data;
  }

  // --- Public Website Endpoints ---

  /**
   * Fetch public job listings for careers page
   */
  static async getPublicJobs(params = {}) {
    const res = await apiClient.get('/site/job-sites', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createJobModel);
  }

  /**
   * Fetch public job details
   */
  static async getPublicJobById(id) {
    const res = await apiClient.get(`/site/job-sites/${id}`);
    return createJobModel(res.data?.data || {});
  }

  /**
   * Submit job application with CV upload
   */
  static async applyForJob(payload) {
    const res = await apiClient.post('/site/job-applications', payload);
    return res.data;
  }
}

export default JobService;
