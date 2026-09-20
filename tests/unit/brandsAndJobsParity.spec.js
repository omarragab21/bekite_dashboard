import { describe, it, expect, beforeEach } from 'vitest';
import { BrandService } from '../../src/services/BrandService';
import { JobService } from '../../src/services/JobService';
import { createBrandModel, createJobModel } from '../../src/domain/models';

describe('Brands & Careers / Jobs Postman Parity & Scroll Contract', () => {
  describe('BrandService Multipart & Postman Compliance', () => {
    it('serializes all 19 Postman parameters 1:1 via BrandService.toMultipartPayload', async () => {
      const payload = {
        brand_en: 'Volt NextPay',
        brand_ar: 'ڤولت نيكست باي',
        subtitle_en: 'Omnichannel Payment Infrastructure',
        subtitle_ar: 'بنية تحتية متكاملة للمدفوعات الرقمية',
        slug: 'volt-nextpay',
        badge: 'FinTech App',
        brand_color: '#0F172A',
        accent_color: '#38BDF8',
        layout: 'image-left',
        description_en: 'Unified payment gateway and digital wallet ecosystem for modern enterprises.',
        description_ar: 'بوابة دفع رقمية موحدة ونظام محفظة إلكترونية للشركات الحديثة.',
        categories: ['Fintech', 'Payments', 'POS'],
        website_url: 'https://volt.be-kite.com',
        apple_store_url: 'https://apps.apple.com/app/id123456789',
        google_play_url: 'https://play.google.com/store/apps/details?id=com.volt.app',
        status_of_project: 'Live Production',
        is_coming_soon: 0,
        is_active: 1,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
      };

      const fd = await BrandService.toMultipartPayload(payload);
      expect(fd).toBeInstanceOf(FormData);

      // Verify all 19 parameters are present and properly formatted
      expect(fd.get('brand_en')).toBe('Volt NextPay');
      expect(fd.get('brand_ar')).toBe('ڤولت نيكست باي');
      expect(fd.get('brand')).toBe('ڤولت نيكست باي');
      expect(fd.get('subtitle_en')).toBe('Omnichannel Payment Infrastructure');
      expect(fd.get('subtitle_ar')).toBe('بنية تحتية متكاملة للمدفوعات الرقمية');
      expect(fd.get('subtitle')).toBe('بنية تحتية متكاملة للمدفوعات الرقمية');
      expect(fd.get('slug')).toBe('volt-nextpay');
      expect(fd.get('badge')).toBe('FinTech App');
      expect(fd.get('brand_color')).toBe('#0F172A');
      expect(fd.get('accent_color')).toBe('#38BDF8');
      expect(fd.get('layout')).toBe('image_left'); // normalized with underscore
      expect(fd.get('description_en')).toBe('Unified payment gateway and digital wallet ecosystem for modern enterprises.');
      expect(fd.get('description_ar')).toBe('بوابة دفع رقمية موحدة ونظام محفظة إلكترونية للشركات الحديثة.');
      expect(fd.get('categories[0]')).toBe('Fintech');
      expect(fd.get('categories[1]')).toBe('Payments');
      expect(fd.get('categories[2]')).toBe('POS');
      expect(fd.get('website_url')).toBe('https://volt.be-kite.com');
      expect(fd.get('apple_store_url')).toBe('https://apps.apple.com/app/id123456789');
      expect(fd.get('google_play_url')).toBe('https://play.google.com/store/apps/details?id=com.volt.app');
      expect(fd.get('status_of_project')).toBe('Live Production');
      expect(fd.get('is_coming_soon')).toBe('0');
      expect(fd.get('is_active')).toBe('1');
      expect(fd.get('mockup_image_file')).toBeDefined();
    });

    it('createBrandModel maps attributes correctly from raw backend payloads', () => {
      const rawBackendItem = {
        id: 42,
        brand_en: 'Zalameh Community',
        brand_ar: 'مجتمع زلمة',
        subtitle_ar: 'تطبيق التفاعل المجتمعي',
        slug: 'zalameh',
        brand_color: '#EA580C',
        accent_color: '#C2410C',
        layout: 'image_right',
        categories: ['Social', 'Lifestyle'],
        website_url: 'https://zalameh.com',
        apple_store_url: 'https://apple.com',
        google_play_url: 'https://google.com',
        is_coming_soon: 0,
        is_active: 1,
        mockup_image_url: 'https://site-backend.be-kite.com/storage/brands/zalameh.png'
      };

      const model = createBrandModel(rawBackendItem);
      expect(model.id).toBe(42);
      expect(model.name).toBe('مجتمع زلمة');
      expect(model.name_en).toBe('Zalameh Community');
      expect(model.brand_ar).toBe('مجتمع زلمة');
      expect(model.brand_en).toBe('Zalameh Community');
      expect(model.layout).toBe('image_right');
      expect(model.image).toBe('https://site-backend.be-kite.com/storage/brands/zalameh.png');
      expect(model.website_url).toBe('https://zalameh.com');
      expect(model.links.length).toBe(3);
      expect(model.links[0].href).toBe('https://zalameh.com');
    });

    it('BrandService CRUD functions with method spoofing', async () => {
      const created = await BrandService.create({
        brand_en: 'Aegis Security',
        brand_ar: 'إيجيس للحماية السيبرانية',
        badge: 'Enterprise CyberSec',
        categories: ['Security', 'Cloud'],
        is_active: 1
      });

      expect(created.id).toBeDefined();
      expect(created.name).toBe('إيجيس للحماية السيبرانية');

      const updated = await BrandService.update(created.id, {
        ...created,
        brand_en: 'Aegis Global Security',
        brand_ar: 'إيجيس العالمية للأمن السيبراني'
      });

      expect(updated.name).toBe('إيجيس العالمية للأمن السيبراني');
    });
  });

  describe('JobService Multipart & Postman Compliance', () => {
    it('serializes all 12 Postman parameters 1:1 via JobService.toMultipartPayload', async () => {
      const payload = {
        job_title_ar: 'مهندس حلول سحابية متقدم',
        job_title_en: 'Senior Cloud Solutions Engineer',
        departement: 'Core Engineering & Infrastructure',
        slug: 'senior-cloud-solutions-engineer',
        badge: 'Top Priority',
        job_type: 'Full-time / Remote',
        job_location: 'Riyadh, Saudi Arabia / Hybrid',
        experience: '+5 Years in AWS / Kubernetes',
        subtitle: 'Architect resilient enterprise infrastructure',
        description: 'Design and automate global cloud architectures for high-traffic financial systems.',
        skills: ['AWS', 'Terraform', 'Kubernetes', 'Go'],
        is_active: 1,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
      };

      const fd = await JobService.toMultipartPayload(payload);
      expect(fd).toBeInstanceOf(FormData);

      // Verify all 12 parameters
      expect(fd.get('job_title_ar')).toBe('مهندس حلول سحابية متقدم');
      expect(fd.get('job_title_en')).toBe('Senior Cloud Solutions Engineer');
      expect(fd.get('title')).toBe('مهندس حلول سحابية متقدم');
      expect(fd.get('title_en')).toBe('Senior Cloud Solutions Engineer');
      expect(fd.get('departement')).toBe('Core Engineering & Infrastructure');
      expect(fd.get('department')).toBe('Core Engineering & Infrastructure');
      expect(fd.get('slug')).toBe('senior-cloud-solutions-engineer');
      expect(fd.get('badge')).toBe('Top Priority');
      expect(fd.get('job_type')).toBe('Full-time / Remote');
      expect(fd.get('type')).toBe('Full-time / Remote');
      expect(fd.get('job_location')).toBe('Riyadh, Saudi Arabia / Hybrid');
      expect(fd.get('location')).toBe('Riyadh, Saudi Arabia / Hybrid');
      expect(fd.get('experience')).toBe('+5 Years in AWS / Kubernetes');
      expect(fd.get('subtitle')).toBe('Architect resilient enterprise infrastructure');
      expect(fd.get('description')).toBe('Design and automate global cloud architectures for high-traffic financial systems.');
      expect(fd.get('is_active')).toBe('1');
      expect(fd.get('skills[0]')).toBe('AWS');
      expect(fd.get('skills[1]')).toBe('Terraform');
      expect(fd.get('skills[2]')).toBe('Kubernetes');
      expect(fd.get('skills[3]')).toBe('Go');
      expect(fd.get('job_image_file')).toBeDefined();
    });

    it('createJobModel maps attributes correctly from raw backend payloads', () => {
      const rawBackendJob = {
        id: 101,
        job_title_ar: 'مصمم واجهات وتجربة مستخدم أول',
        job_title_en: 'Senior UI/UX Designer',
        departement: 'Product Design',
        job_type: 'دوام كامل',
        job_location: 'عمان، الأردن',
        experience: '4+ سنوات',
        subtitle: 'صياغة هويات رقمية متميزة',
        description: 'قيادة تصميم المنتجات الرقمية والتطبيقات التابعة لـ Be Kite',
        skills: ['Figma', 'Design Systems', 'Micro-interactions'],
        is_active: 1,
        job_image_url: 'https://site-backend.be-kite.com/storage/jobs/design.png'
      };

      const model = createJobModel(rawBackendJob);
      expect(model.id).toBe(101);
      expect(model.title).toBe('مصمم واجهات وتجربة مستخدم أول');
      expect(model.title_en).toBe('Senior UI/UX Designer');
      expect(model.department).toBe('Product Design');
      expect(model.departement).toBe('Product Design');
      expect(model.location).toBe('عمان، الأردن');
      expect(model.type).toBe('دوام كامل');
      expect(model.skills).toEqual(['Figma', 'Design Systems', 'Micro-interactions']);
      expect(model.image).toBe('https://site-backend.be-kite.com/storage/jobs/design.png');
    });

    it('JobService CRUD functions with method spoofing', async () => {
      const created = await JobService.create({
        job_title_ar: 'مهندس ذكاء اصطناعي',
        job_title_en: 'AI Engineer',
        departement: 'Core Engineering',
        skills: ['Python', 'PyTorch', 'Transformers'],
        is_active: 1
      });

      expect(created.id).toBeDefined();
      expect(created.title).toBe('مهندس ذكاء اصطناعي');

      const updated = await JobService.update(created.id, {
        ...created,
        job_title_ar: 'مهندس ذكاء اصطناعي ونظم توليدية أول',
        job_title_en: 'Senior Generative AI Engineer'
      });

      expect(updated.title).toBe('مهندس ذكاء اصطناعي ونظم توليدية أول');
    });
  });

  describe('Dashboard Brand Showcases & Store Links Parity', () => {
    it('createBrandModel extracts Google Play, Apple Store, and Website from links array fallback', () => {
      const brandWithLinksOnly = {
        id: 99,
        name: 'تطبيق تجريبي',
        links: [
          { label: 'الموقع الرسمي', href: 'https://test-venture.com' },
          { label: 'تطبيق Android (Google Play)', href: 'https://play.google.com/store/apps/details?id=com.test' },
          { label: 'تطبيق iOS (Apple)', href: 'https://apps.apple.com/app/id99999' }
        ]
      };

      const model = createBrandModel(brandWithLinksOnly);
      expect(model.website_url).toBe('https://test-venture.com');
      expect(model.google_play_url).toBe('https://play.google.com/store/apps/details?id=com.test');
      expect(model.apple_store_url).toBe('https://apps.apple.com/app/id99999');
    });

    it('DashboardView file contains Brand Showcases section and store button classes', async () => {
      const fs = await import('fs');
      const content = fs.readFileSync('src/views/DashboardView.vue', 'utf-8');
      expect(content).toContain('dash-brands-section');
      expect(content).toContain('google-play-btn');
      expect(content).toContain('apple-store-btn');
      expect(content).toContain('web-store-btn');
      expect(content).toContain('BrandService.getAll()');
      expect(content).toContain("key: 'brands'");
    });
  });
});
