import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectService } from '../../src/services/ProjectService.js';
import { ProductService } from '../../src/services/ProductService.js';
import { ContentService } from '../../src/services/ContentService.js';
import { InquiryService } from '../../src/services/InquiryService.js';
import { BrandService } from '../../src/services/BrandService.js';
import { SolutionService } from '../../src/services/SolutionService.js';
import { SettingsService } from '../../src/services/SettingsService.js';
import { MessageService } from '../../src/services/MessageService.js';
import { mockDb } from '../mocks/mockAdapter.js';

describe('Functional Services & API Adapter Integration Tests', () => {
  beforeEach(() => {
    // Reset or ensure mockDb has fresh data
    localStorage.clear();
  });

  describe('ProjectService Functional Suite', () => {
    it('should retrieve all projects mapped to domain models', async () => {
      const projects = await ProjectService.getAll();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toHaveProperty('id');
      expect(projects[0]).toHaveProperty('title');
      expect(projects[0]).toHaveProperty('accent_color');
    });

    it('should create a new project and persist it in mock storage', async () => {
      const newProjData = {
        title: 'مشروع تجريبي مؤتمت',
        title_en: 'Automated Test Project',
        client_name: 'Be Kite Test Lab',
        category_id: 1,
        is_active: 1
      };
      const created = await ProjectService.create(newProjData);
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.title).toBe('مشروع تجريبي مؤتمت');

      // Verify retrieval
      const fetched = await ProjectService.getById(created.id);
      expect(fetched.id).toBe(created.id);
      expect(fetched.title_en).toBe('Automated Test Project');
    });

    it('should update project attributes correctly', async () => {
      const projects = await ProjectService.getAll();
      const target = projects[0];
      const updated = await ProjectService.update(target.id, {
        title: 'عنوان مشروع محدث للاختبار'
      });
      expect(updated.title).toBe('عنوان مشروع محدث للاختبار');
    });

    it('should delete a project successfully', async () => {
      const initialProjects = await ProjectService.getAll();
      const targetId = initialProjects[0].id;
      const res = await ProjectService.delete(targetId);
      expect(res.success).toBe(true);

      const afterDelete = await ProjectService.getAll();
      const found = afterDelete.find(p => p.id === targetId);
      expect(found).toBeUndefined();
    });
  });

  describe('ProductService Functional Suite', () => {
    it('should retrieve all digital products with enterprise sections', async () => {
      const products = await ProductService.getAll();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0]).toHaveProperty('modules');
      expect(products[0]).toHaveProperty('scalability');
    });

    it('should create and retrieve a digital product', async () => {
      const newProduct = {
        name: 'نظام إدارة لوجستي',
        name_en: 'Logistics ERP Pro',
        slug: 'logistics-erp-pro',
        category: 'saas',
        is_active: 1
      };
      const created = await ProductService.create(newProduct);
      expect(created.id).toBeDefined();
      expect(created.name).toBe('نظام إدارة لوجستي');
    });
  });

  describe('ContentService (Careers & Solutions) Functional Suite', () => {
    it('should retrieve all careers with unified Be Kite branding', async () => {
      const careers = await ContentService.getCareers();
      expect(Array.isArray(careers)).toBe(true);
      expect(careers.length).toBeGreaterThan(0);
      expect(careers[0]).toHaveProperty('department');
      expect(careers[0]).toHaveProperty('location');
      expect(careers[0]).toHaveProperty('type');
      expect(careers[0]).toHaveProperty('experience');
    });

    it('should create a career vacancy without salary field', async () => {
      const newCareer = {
        title: 'مهندس جودة برمجيات',
        title_en: 'QA Automation Engineer',
        department: 'الهندسة والتطوير',
        slug: 'qa-automation-engineer',
        location: 'عمان، الأردن — هجين',
        type: 'دوام كامل',
        experience: '+3 سنوات',
        is_active: 1
      };
      const created = await ContentService.createCareer(newCareer);
      expect(created.id).toBeDefined();
      expect(created.title).toBe('مهندس جودة برمجيات');
      expect(created.salary_range).toBeUndefined();
    });

    it('should toggle career active status', async () => {
      const careers = await ContentService.getCareers();
      const target = careers[0];
      const initialStatus = target.is_active;
      const updated = await ContentService.updateCareer(target.id, {
        is_active: initialStatus ? 0 : 1
      });
      expect(updated.is_active).toBe(initialStatus ? 0 : 1);
    });
  });

  describe('InquiryService (Messages) Functional Suite', () => {
    it('should fetch inquiries and support status toggling', async () => {
      const inquiries = await InquiryService.getAll();
      expect(Array.isArray(inquiries)).toBe(true);
      expect(inquiries.length).toBeGreaterThan(0);

      const target = inquiries[0];
      const originalStatus = target.status;
      const nextStatus = originalStatus === 'read' ? 'unread' : 'read';

      const updated = await InquiryService.update(target.id, { status: nextStatus });
      expect(updated.status).toBe(nextStatus);
    });
  });

  describe('BrandService Functional Suite', () => {
    it('should fetch all brand ventures and single brand details', async () => {
      const brands = await BrandService.getAll();
      expect(Array.isArray(brands)).toBe(true);
      expect(brands.length).toBeGreaterThan(0);

      const single = await BrandService.getById(brands[0].id);
      expect(single).toBeDefined();
      expect(single.id).toBe(brands[0].id);
    });
  });

  describe('SolutionService Functional Suite', () => {
    it('should fetch all digital services & solutions', async () => {
      const solutions = await SolutionService.getAll();
      expect(Array.isArray(solutions)).toBe(true);
      expect(solutions.length).toBeGreaterThan(0);
      expect(solutions[0]).toHaveProperty('technologies');
    });

    it('should create and update a custom solution', async () => {
      const newSol = {
        title: 'حلول ذكاء اصطناعي مخصصة',
        title_en: 'Custom AI Solutions',
        category: 'technology',
        technologies: ['PyTorch', 'FastAPI']
      };
      const created = await SolutionService.create(newSol);
      expect(created.id).toBeDefined();
      expect(created.title).toBe('حلول ذكاء اصطناعي مخصصة');

      const updated = await SolutionService.update(created.id, {
        title: 'حلول الذكاء الاصطناعي التوليدي'
      });
      expect(updated.title).toBe('حلول الذكاء الاصطناعي التوليدي');
    });
  });

  describe('SettingsService Functional Suite', () => {
    it('should retrieve and persist platform settings', async () => {
      const settings = await SettingsService.getAll();
      expect(settings).toBeDefined();

      const saveRes = await SettingsService.save({
        site_name: 'Be Kite Hub Pro',
        contact_email: 'ops@bekite.com'
      });
      expect(saveRes).toBeDefined();
    });
  });

  describe('MessageService Functional Suite', () => {
    it('should retrieve all contact messages', async () => {
      const messages = await MessageService.getAll();
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0]).toHaveProperty('id');
    });

    it('should submit a public contact message from website', async () => {
      const msgData = {
        name: 'زائر تجريبي',
        email: 'visitor@test.com',
        phone_number: '+962791234567',
        message: '[استفسار] تجربة إرسال رسالة من صفحة اتصل بنا'
      };
      const res = await MessageService.submitPublicMessage(msgData);
      expect(res).toBeDefined();
    });

    it('should update message read/unread status', async () => {
      const messages = await MessageService.getAll();
      const target = messages[0];
      const res = await MessageService.updateStatus(target.id, 'read');
      expect(res).toBeDefined();
    });
  });
});
