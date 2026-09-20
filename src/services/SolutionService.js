/**
 * Solutions & Digital Services Service
 */

import apiClient from '../infrastructure/api/client';
import { createSolutionModel } from '../domain/models';
import { appendUpload, appendValue } from '../utils/multipart';

export class SolutionService {
  static async toMultipartPayload(payload = {}) {
    const fd = new FormData();
    const skip = new Set(['technologies', 'icon_image', 'hero_image', 'solve_image', 'icon', 'problem_section', 'solve_section', 'deliver_section', 'process_section', 'why_section', 'proven_execution_framework', 'why_choose_us']);
    Object.entries(payload).forEach(([key, value]) => {
      if (skip.has(key) || value === null || value === undefined || typeof value === 'object') return;
      appendValue(fd, key, value);
    });
    (Array.isArray(payload.technologies) ? payload.technologies : []).forEach((value, index) => appendValue(fd, `technologies[${index}]`, value));

    const problem = payload.problem_section || {};
    appendValue(fd, 'problem_badge', problem.badge || 'THE CHALLENGE');
    appendValue(fd, 'problem_department_title', problem.department_title || problem.title || 'Visual Media Obstacles Businesses Face');
    appendValue(fd, 'problem_department_subtitle', problem.department_subtitle || problem.subtitle || 'Challenges businesses encounter');
    const challenges = Array.isArray(problem.challenges) && problem.challenges.length
      ? problem.challenges
      : (Array.isArray(problem.items) && problem.items.length ? problem.items : []);
    challenges.forEach((item, index) => {
      appendValue(fd, `challenges[${index}][title]`, item.title);
      appendValue(fd, `challenges[${index}][description]`, item.description || item.desc);
    });

    const solve = payload.solve_section || {};
    appendValue(fd, 'solve_department_badge', solve.badge || 'OUR APPROACH');
    appendValue(fd, 'solve_department_title', solve.department_title || solve.title || 'How We Solve It');
    appendValue(fd, 'solve_department_subtitle', solve.department_subtitle || solve.subtitle || 'State-of-the-Art Architecture & Direction');
    appendValue(fd, 'solve_department_description', solve.department_description || solve.description || 'Our dedicated approach delivers excellence.');
    appendValue(fd, 'solve_cta_text', solve.cta_text || solve.ctaText || solve.cta || 'Request Consultation');

    const deliver = payload.deliver_section || {};
    appendValue(fd, 'deliver_department_title', deliver.department_title || deliver.title || 'What We Deliver');
    appendValue(fd, 'deliver_department_subtitle', deliver.department_subtitle || deliver.subtitle || 'End-to-end deliverables');
    const exits = Array.isArray(deliver.exits) && deliver.exits.length
      ? deliver.exits
      : (Array.isArray(deliver.items) && deliver.items.length ? deliver.items : []);
    exits.forEach((item, index) => {
      appendValue(fd, `exits[${index}][title]`, item.title);
      appendValue(fd, `exits[${index}][description]`, item.description || item.desc);
    });

    const framework = Array.isArray(payload.proven_execution_framework) && payload.proven_execution_framework.length
      ? payload.proven_execution_framework
      : (Array.isArray(payload.process_section?.steps) && payload.process_section.steps.length
        ? payload.process_section.steps
        : (Array.isArray(payload.process_section?.items) ? payload.process_section.items : []));
    framework.forEach((item, index) => {
      appendValue(fd, `proven_execution_framework[${index}][title]`, item.title);
      appendValue(fd, `proven_execution_framework[${index}][description]`, item.description || item.desc);
    });

    const whyChoose = Array.isArray(payload.why_choose_us) && payload.why_choose_us.length
      ? payload.why_choose_us
      : (Array.isArray(payload.why_section?.items) && payload.why_section.items.length
        ? payload.why_section.items
        : []);
    whyChoose.forEach((item, index) => {
      appendValue(fd, `why_choose_us[${index}][title]`, item.title);
      appendValue(fd, `why_choose_us[${index}][description]`, item.description || item.desc);
    });

    await appendUpload(fd, 'icon_image_file', payload.icon_image || payload.icon, 'solution-icon.png');
    await appendUpload(fd, 'hero_image_file', payload.hero_image, 'solution-hero.png');
    await appendUpload(fd, 'solve_image_file', payload.solve_image || solve.image || solve.image_url, 'solution-solve.png');
    return fd;
  }
  /**
   * Fetch all solutions & services
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/solutions', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createSolutionModel);
  }

  /**
   * Fetch solution by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/solutions/${id}`);
    return createSolutionModel(res.data?.data || {});
  }

  /**
   * Helper to normalize payload for backend validation requirements
   */
  static normalizePayload(payload = {}) {
    const title_ar = (payload.title_ar || payload.title || '').trim();
    const title_en = (payload.title_en || '').trim();
    const headline_ar = (payload.headline_ar || payload.headline || title_ar).trim();
    const headline_en = (payload.headline_en || payload.headline || title_en).trim();
    const department = (payload.department || payload.category_name || (payload.category === 'marketing' ? 'Digital Marketing' : payload.category === 'creative' ? 'Creative Production' : 'Software Engineering')).trim();
    const slug = (payload.slug || '').trim() || (title_en ? title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `solution-${Date.now()}`);

    return {
      ...payload,
      title_ar,
      title_en,
      title: title_ar,
      headline_ar,
      headline_en,
      headline: headline_ar,
      department,
      slug,
      badge: (payload.badge || payload.category || 'High Performance').trim(),
      description: payload.description_ar || payload.description || headline_ar,
      is_active: payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1,
      technologies: Array.isArray(payload.technologies) ? payload.technologies : [],
    };
  }

  /**
   * Create a new solution
   */
  static async create(payload) {
    const normalized = SolutionService.normalizePayload(payload);
    const res = await apiClient.post('/dashboard/solutions', await SolutionService.toMultipartPayload(normalized));
    return createSolutionModel(res.data?.data || payload);
  }

  /**
   * Update an existing solution
   */
  static async update(id, payload) {
    const normalized = SolutionService.normalizePayload(payload);
    const fd = await SolutionService.toMultipartPayload(normalized);
    fd.append('_method', 'PUT');
    let res;
    try {
      res = await apiClient.post(`/dashboard/solutions/${id}`, fd);
    } catch (e) {
      if (e.response?.status === 405) {
        res = await apiClient.put(`/dashboard/solutions/${id}`, fd);
      } else {
        throw e;
      }
    }
    return createSolutionModel(res.data?.data || payload);
  }

  /**
   * Delete a solution
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/solutions/${id}`);
    return res.data;
  }

  // --- Public Website Endpoints ---

  /**
   * Fetch public solutions
   */
  static async getPublicSolutions(params = {}) {
    const res = await apiClient.get('/site/solutions', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createSolutionModel);
  }

  /**
   * Fetch public solution by ID
   */
  static async getPublicSolutionById(id) {
    const res = await apiClient.get(`/site/solutions/${id}`);
    return createSolutionModel(res.data?.data || {});
  }
}

export default SolutionService;
