/**
 * Content Management (News, Careers, Team Members, Legal Pages) Service
 */

import apiClient from '../infrastructure/api/client';
import { JobService } from './JobService';

export class ContentService {
  // 1. Articles & News
  static async getArticles(params = {}) {
    const res = await apiClient.get('/dashboard/news-events', { params });
    return res.data?.data || [];
  }

  static async createArticle(payload) {
    const res = await apiClient.post('/dashboard/news-events', payload);
    return res.data?.data;
  }

  static async updateArticle(id, payload) {
    const res = await apiClient.put(`/dashboard/news-events/${id}`, payload);
    return res.data?.data;
  }

  static async deleteArticle(id) {
    const res = await apiClient.delete(`/dashboard/news-events/${id}`);
    return res.data;
  }

  // 2. Careers & Job Postings (job-site)
  static normalizeCareerPayload(payload = {}) {
    return JobService.normalizePayload(payload);
  }

  static async getCareers(params = {}) {
    return JobService.getAll(params);
  }

  static async createCareer(payload) {
    return JobService.create(payload);
  }

  static async updateCareer(id, payload) {
    return JobService.update(id, payload);
  }

  static async deleteCareer(id) {
    return JobService.delete(id);
  }

  // 3. Team Members
  static async getTeamMembers(params = {}) {
    const res = await apiClient.get('/dashboard/team-members', { params });
    return res.data?.data || [];
  }

  static async createTeamMember(payload) {
    const res = await apiClient.post('/dashboard/team-members', payload);
    return res.data?.data;
  }

  static async updateTeamMember(id, payload) {
    const res = await apiClient.put(`/dashboard/team-members/${id}`, payload);
    return res.data?.data;
  }

  static async deleteTeamMember(id) {
    const res = await apiClient.delete(`/dashboard/team-members/${id}`);
    return res.data;
  }

  // 4. Dynamic Legal Pages
  static async getPages(params = {}) {
    const res = await apiClient.get('/dashboard/dynamic-pages', { params });
    return res.data?.data || [];
  }

  static async createPage(payload) {
    const res = await apiClient.post('/dashboard/dynamic-pages', payload);
    return res.data?.data;
  }

  static async updatePage(id, payload) {
    const res = await apiClient.put(`/dashboard/dynamic-pages/${id}`, payload);
    return res.data?.data;
  }

  static async deletePage(id) {
    const res = await apiClient.delete(`/dashboard/dynamic-pages/${id}`);
    return res.data;
  }
}

export default ContentService;
