import { describe, it, expect } from 'vitest';
import {
  createProjectModel,
  createProductModel,
  createSolutionModel,
  createBrandModel
} from '../../src/domain/models/index.js';

describe('Domain Models Unit Tests', () => {
  describe('createProjectModel', () => {
    it('should initialize with secure and sensible default values when empty', () => {
      const project = createProjectModel({});
      expect(project.id).toBeNull();
      expect(project.title).toBe('');
      expect(project.is_active).toBe(1);
      expect(project.accent_color).toBe('#7c3aed');
      expect(Array.isArray(project.filter_categories)).toBe(true);
      expect(project.filter_categories).toContain('websites');
      expect(project.has_mobile_app).toBe(false);
    });

    it('should correctly normalize and map raw input data', () => {
      const raw = {
        id: 42,
        title: 'منصة بي كايت',
        title_en: 'Be Kite Platform',
        slug: 'bekite-platform',
        is_active: 0,
        ios_url: 'https://apple.com/app',
        accent_color: '#4f008c',
        stats: [{ label: 'مستخدم نشط', value: '100K+' }]
      };
      const project = createProjectModel(raw);
      expect(project.id).toBe(42);
      expect(project.title).toBe('منصة بي كايت');
      expect(project.is_active).toBe(0);
      expect(project.has_mobile_app).toBe(true);
      expect(project.accent_color).toBe('#4f008c');
      expect(project.stats[0].value).toBe('100K+');
    });

    it('should sanitize arrays even when null or non-array inputs are provided', () => {
      const project = createProjectModel({
        filter_categories: 'invalid',
        tags: null,
        social_media_images: null
      });
      expect(Array.isArray(project.filter_categories)).toBe(true);
      expect(Array.isArray(project.tags)).toBe(true);
      expect(Array.isArray(project.social_media_images)).toBe(true);
    });
  });

  describe('createProductModel', () => {
    it('should provide default ecommerce category and enterprise scalability tiers', () => {
      const product = createProductModel({});
      expect(product.category).toBe('ecommerce');
      expect(product.scalability).toHaveLength(3);
      expect(product.scalability[0].tier).toBe('startup');
      expect(product.scalability[1].tier).toBe('growth');
      expect(product.scalability[2].tier).toBe('enterprise');
    });

    it('should preserve custom modules and gallery if passed', () => {
      const customModules = [{ icon: 'cpu', title: 'محرك ذكاء اصطناعي' }];
      const customScreens = ['/img/screen1.png', '/img/screen2.png'];
      const product = createProductModel({
        name: 'منتج تجارة AI',
        modules: customModules,
        screenshots: customScreens
      });
      expect(product.name).toBe('منتج تجارة AI');
      expect(product.modules).toHaveLength(1);
      expect(product.gallery).toEqual(customScreens);
    });
  });

  describe('createBrandModel', () => {
    it('should fall back to default venture structure and links', () => {
      const brand = createBrandModel({});
      expect(brand.badge).toBe('CONSUMER APP');
      expect(brand.ownership).toBe('100% Be Kite Venture');
      expect(Array.isArray(brand.links)).toBe(true);
      expect(brand.links.length).toBeGreaterThanOrEqual(3);
    });

    it('should correctly prioritize title and name mapping', () => {
      const brand = createBrandModel({ title: 'زلمة كافيه', name_en: 'Zalameh Cafe' });
      expect(brand.name).toBe('زلمة كافيه');
      expect(brand.title).toBe('زلمة كافيه');
      expect(brand.name_en).toBe('Zalameh Cafe');
    });
  });

  describe('createSolutionModel', () => {
    it('should generate valid technology solution structure', () => {
      const solution = createSolutionModel({
        title: 'هندسة السحابة',
        technologies: ['AWS', 'Kubernetes']
      });
      expect(solution.title).toBe('هندسة السحابة');
      expect(solution.category).toBe('technology');
      expect(solution.technologies).toContain('AWS');
      expect(solution.is_active).toBe(1);
    });

    it('should correctly normalize live API structure with challenges, exits, framework, and why-us', () => {
      const liveApiSolution = {
        id: 10,
        title: 'حلول الميديا والإنتاج المرئي',
        headline: 'إنتاج سينمائي بمعدات هوليوود',
        problem_section: {
          badge: 'THE CHALLENGE',
          department_title: 'عقبات الميديا والإنتاج',
          challenges: [
            { title: 'ضعف الجودة', description: 'تصوير بكاميرات رديئة يقلل الثقة' }
          ]
        },
        solve_section: {
          badge: 'OUR APPROACH',
          department_title: 'كيف ننتج المحتوى',
          department_description: 'نستخدم كاميرات سينمائية RED و ARRI بدقة 8K',
          image_url: 'https://site-backend.be-kite.com/storage/solve.jpg',
          cta_text: 'احجز جلسة تصوير'
        },
        deliver_section: {
          department_title: 'المخرجات',
          exits: [
            { title: 'إعلانات تلفزيونية ورقمية', description: 'إعلانات مصممة للبث' }
          ],
          proven_execution_framework: [
            { title: 'الفكرة والسيناريو', description: 'كتابة النص واللوحات' }
          ],
          why_choose_us: [
            { title: 'معدات سينمائية', description: 'أحدث الكاميرات والإضاءة' }
          ]
        }
      };

      const model = createSolutionModel(liveApiSolution);
      expect(model.title).toBe('حلول الميديا والإنتاج المرئي');
      expect(model.problem_section.challenges).toHaveLength(1);
      expect(model.problem_section.items).toHaveLength(1);
      expect(model.problem_section.items[0].title).toBe('ضعف الجودة');

      expect(model.solve_section.department_description).toBe('نستخدم كاميرات سينمائية RED و ARRI بدقة 8K');
      expect(model.solve_section.image_url).toBe('https://site-backend.be-kite.com/storage/solve.jpg');
      expect(model.solve_section.cta_text).toBe('احجز جلسة تصوير');

      expect(model.deliver_section.exits).toHaveLength(1);
      expect(model.deliver_section.items).toHaveLength(1);
      expect(model.process_section.steps).toHaveLength(1);
      expect(model.why_section.items).toHaveLength(1);
    });
  });
});
