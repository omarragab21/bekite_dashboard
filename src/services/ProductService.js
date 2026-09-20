/**
 * Digital Products & Systems Service
 */

import apiClient from '../infrastructure/api/client';
import { createProductModel } from '../domain/models';
import { appendUpload, appendValue } from '../utils/multipart';

export class ProductService {
  static async toMultipartPayload(payload = {}) {
    const fd = new FormData();

    // 1. Basic text and boolean attributes matching Postman exactly
    appendValue(fd, 'name_en', payload.name_en);
    appendValue(fd, 'name_ar', payload.name_ar || payload.name);
    appendValue(fd, 'address_ar', payload.address_ar || 'عمان، الأردن - شارع الملكة رانيا');
    appendValue(fd, 'address_en', payload.address_en || 'Amman, Jordan - Queen Rania St');
    appendValue(fd, 'description_ar', payload.description_ar || payload.description);
    appendValue(fd, 'description_en', payload.description_en || payload.description);
    appendValue(fd, 'category_id', payload.category_id || 1);
    appendValue(fd, 'slug', payload.slug);
    appendValue(fd, 'color', payload.color || payload.accent_color || '#1E3A8A');
    appendValue(fd, 'is_featured_product', payload.is_featured_product !== undefined ? (payload.is_featured_product ? '1' : '0') : '1');
    appendValue(fd, 'is_active', payload.is_active !== undefined ? (payload.is_active ? '1' : '0') : '1');

    // 2. Overview paragraphs
    appendValue(fd, 'overview_paragraph1', payload.overview_paragraph1 || payload.overview?.p1 || payload.overview?.paragraph1 || payload.description_ar || payload.description);
    appendValue(fd, 'overview_paragraph2', payload.overview_paragraph2 || payload.overview?.p2 || payload.overview?.paragraph2 || payload.description_en || payload.description);

    // 3. Section Titles
    appendValue(fd, 'built_for_main_section_title', payload.built_for_main_section_title || payload.built_for?.title || 'Tailored for Modern Retail & Fast Dining');
    appendValue(fd, 'built_for_secondary_section_title', payload.built_for_secondary_section_title || payload.built_for?.subtitle || 'Engineered for speed, durability, and multi-branch scalability');

    appendValue(fd, 'what_it_does_main_title', payload.what_it_does_main_title || payload.what_it_does?.title || 'Unified Front-to-Back Operations');
    appendValue(fd, 'what_it_does_secondary_title', payload.what_it_does_secondary_title || payload.what_it_does?.subtitle || 'Everything from ticket dispatch to financial ledger reconciliation');

    // 4. Arrays
    const builtFor = Array.isArray(payload.built_for_data) && payload.built_for_data.length 
      ? payload.built_for_data 
      : (Array.isArray(payload.built_for?.items) && payload.built_for.items.length 
          ? payload.built_for.items.map(i => ({ title: i.title, description: i.desc || i.description }))
          : [{ title: 'المطاعم والكافيهات', description: 'إدارة الطاولات، تجزئة الفاتورة، وربط شاشات عرض المطبخ.' }]);
    builtFor.forEach((item, index) => {
      appendValue(fd, `built_for_data[${index}][title]`, item.title);
      appendValue(fd, `built_for_data[${index}][description]`, item.description || item.desc);
    });

    const whatItDoes = Array.isArray(payload.what_it_does_data) && payload.what_it_does_data.length
      ? payload.what_it_does_data
      : (Array.isArray(payload.what_it_does?.items) && payload.what_it_does.items.length
          ? payload.what_it_does.items.map(i => ({ title: i.title, description: i.desc || i.description }))
          : [{ title: 'Offline-First Checkout', description: 'Zero downtime even during network interruptions with auto-sync fallback.' }]);
    whatItDoes.forEach((item, index) => {
      appendValue(fd, `what_it_does_data[${index}][title]`, item.title);
      appendValue(fd, `what_it_does_data[${index}][description]`, item.description || item.desc);
    });

    // Action screens titles
    appendValue(fd, 'see_in_action_screen_one_title_ar', payload.see_in_action_screen_one_title_ar || payload.action_screens?.[0]?.title_ar || 'شاشة الكاشير السريعة');
    appendValue(fd, 'see_in_action_screen_one_title_en', payload.see_in_action_screen_one_title_en || payload.action_screens?.[0]?.title || 'Rapid Checkout Terminal');
    appendValue(fd, 'see_in_action_screen_two_title_ar', payload.see_in_action_screen_two_title_ar || payload.action_screens?.[1]?.title_ar || 'لوحة تحليلات المبيعات الفورية');
    appendValue(fd, 'see_in_action_screen_two_title_en', payload.see_in_action_screen_two_title_en || payload.action_screens?.[1]?.title || 'Real-Time Sales Telemetry');
    appendValue(fd, 'see_in_action_screen_three_title_ar', payload.see_in_action_screen_three_title_ar || payload.action_screens?.[2]?.title_ar || 'شاشة تحكم المطبخ والطلبات');
    appendValue(fd, 'see_in_action_screen_three_title_en', payload.see_in_action_screen_three_title_en || payload.action_screens?.[2]?.title || 'Kitchen Display System (KDS)');

    const howItWorks = Array.isArray(payload.how_it_works_data) && payload.how_it_works_data.length
      ? payload.how_it_works_data
      : (Array.isArray(payload.how_it_works?.steps) && payload.how_it_works.steps.length
          ? payload.how_it_works.steps.map(s => ({ title: s.title, description: s.desc || s.description }))
          : [{ title: 'Device Enrollment', description: 'Scan a QR code on hardware terminal.' }]);
    howItWorks.forEach((item, index) => {
      appendValue(fd, `how_it_works_data[${index}][title]`, item.title);
      appendValue(fd, `how_it_works_data[${index}][description]`, item.description || item.desc);
    });

    const whyTeams = Array.isArray(payload.why_teams_data) && payload.why_teams_data.length
      ? payload.why_teams_data
      : (Array.isArray(payload.why_choose?.items) && payload.why_choose.items.length
          ? payload.why_choose.items.map(w => ({ title: w.title, description: w.desc || w.description }))
          : [{ title: '99.99% Guaranteed Cloud Reliability', description: 'Distributed edge nodes ensure zero terminal downtime.' }]);
    whyTeams.forEach((item, index) => {
      appendValue(fd, `why_teams_data[${index}][title]`, item.title);
      appendValue(fd, `why_teams_data[${index}][description]`, item.description || item.desc);
    });

    const scalability = Array.isArray(payload.scalability_tiers) && payload.scalability_tiers.length
      ? payload.scalability_tiers
      : (Array.isArray(payload.scalability) && payload.scalability.length
          ? payload.scalability.map(s => ({ title: s.title, advantage: s.highlight || s.advantage, specifications_capacity: s.specs || s.specifications_capacity }))
          : [{ title: 'Single Store', advantage: 'Instant deployment with zero upfront infrastructure cost, engineered for single-location stability.', specifications_capacity: 'Up to 2 terminals, 1 branch, 5,000 SKUs, and daily automated cloud backup.' }]);
    scalability.forEach((item, index) => {
      appendValue(fd, `scalability_tiers[${index}][title]`, item.title);
      appendValue(fd, `scalability_tiers[${index}][advantage]`, item.advantage || item.highlight);
      appendValue(fd, `scalability_tiers[${index}][specifications_capacity]`, item.specifications_capacity || item.specs);
    });

    const packages = Array.isArray(payload.packages) && payload.packages.length
      ? payload.packages
      : (Array.isArray(payload.editions) && payload.editions.length
          ? payload.editions.map(e => ({ name: e.name, description: e.description }))
          : [{ name: 'enterprise', description: 'Unlimited Terminals & Multiple Physical Warehouses' }]);
    packages.forEach((item, index) => {
      appendValue(fd, `packages[${index}][name]`, item.name);
      appendValue(fd, `packages[${index}][description]`, item.description);
    });

    // 5. Image uploads matching Postman keys exactly
    await appendUpload(fd, 'overview_tablet_image_file', payload.overview_tablet_image_file || payload.overview?.image || payload.overview?.tablet_image_url || '/images/products/tijara_overview.png', 'product-overview.png');
    await appendUpload(fd, 'see_in_action_main_image_file', payload.see_in_action_main_image_file || payload.action_main_image || payload.laptop_mockup || '/images/products/tijara_action_main.png', 'product-action-main.png');
    await appendUpload(fd, 'see_in_action_screen_one_file', payload.see_in_action_screen_one_file || payload.action_screens?.[0]?.file || payload.action_screens?.[0]?.image || payload.gallery?.[0]?.file || payload.gallery?.[0]?.image || '/images/products/tijara_action_1.png', 'product-screen-1.png');
    await appendUpload(fd, 'see_in_action_screen_two_file', payload.see_in_action_screen_two_file || payload.action_screens?.[1]?.file || payload.action_screens?.[1]?.image || payload.gallery?.[1]?.file || payload.gallery?.[1]?.image || '/images/products/tijara_action_2.png', 'product-screen-2.png');
    await appendUpload(fd, 'see_in_action_screen_three_file', payload.see_in_action_screen_three_file || payload.action_screens?.[2]?.file || payload.action_screens?.[2]?.image || payload.gallery?.[2]?.file || payload.gallery?.[2]?.image || '/images/products/tijara_action_3.png', 'product-screen-3.png');

    return fd;
  }
  /**
   * Fetch all digital products
   */
  static async getAll(params = {}) {
    const res = await apiClient.get('/dashboard/products', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createProductModel);
  }

  /**
   * Fetch a single product by ID
   */
  static async getById(id) {
    const res = await apiClient.get(`/dashboard/products/${id}`);
    return createProductModel(res.data?.data || {});
  }

  /**
   * Helper to normalize payload for backend validation requirements
   */
  static normalizePayload(payload = {}) {
    const name_ar = (payload.name_ar || payload.name || '').trim();
    const name_en = (payload.name_en || '').trim();
    const slug = (payload.slug || '').trim() || (name_en ? name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);
    const category_id = Number(payload.category_id) || 1;
    const color = payload.color || payload.accent_color || '#3B82F6';
    const address_ar = (payload.address_ar || payload.address || 'الرياض، المملكة العربية السعودية').trim();
    const address_en = (payload.address_en || 'Riyadh, Saudi Arabia').trim();
    const description_ar = (payload.description_ar || payload.description || name_ar).trim();
    const description_en = (payload.description_en || payload.description || name_en).trim();

    // Overview paragraphs
    const overview_paragraph1 = (payload.overview_paragraph1 || (payload.overview && payload.overview.p1) || description_ar).trim();
    const overview_paragraph2 = (payload.overview_paragraph2 || (payload.overview && payload.overview.p2) || description_en).trim();

    // Built for section
    const built_for_main_section_title = payload.built_for_main_section_title || (payload.built_for && payload.built_for.title) || 'صُمم خصيصاً للشركات المتقدمة';
    const built_for_secondary_section_title = payload.built_for_secondary_section_title || (payload.built_for && payload.built_for.subtitle) || 'أداء عالي وقابلية للتوسع';
    const built_for_data = Array.isArray(payload.built_for_data) && payload.built_for_data.length 
      ? payload.built_for_data 
      : (Array.isArray(payload.built_for?.items) 
          ? payload.built_for.items.map(it => ({ title: it.title || 'قطاع الأعمال', description: it.desc || it.description || '' }))
          : [{ title: 'المتاجر والشركات', description: 'إدارة متكاملة' }]);

    // What it does section
    const what_it_does_main_title = payload.what_it_does_main_title || (payload.what_it_does && payload.what_it_does.title) || 'القدرات والمزايا الأساسية';
    const what_it_does_secondary_title = payload.what_it_does_secondary_title || (payload.what_it_does && payload.what_it_does.subtitle) || 'كل ما تحتاجه في نظام واحد';
    const what_it_does_data = Array.isArray(payload.what_it_does_data) && payload.what_it_does_data.length
      ? payload.what_it_does_data
      : (Array.isArray(payload.what_it_does?.items)
          ? payload.what_it_does.items.map(it => ({ title: it.title || 'ميزة ذكية', description: it.desc || it.description || '' }))
          : [{ title: 'مزامنة لحظية', description: 'تكامل مباشر مع السيرفر' }]);

    // Action screens
    const see_in_action_screen_one_title_ar = payload.see_in_action_screen_one_title_ar || 'شاشة العمليات الرئيسية';
    const see_in_action_screen_one_title_en = payload.see_in_action_screen_one_title_en || 'Main Operations Terminal';
    const see_in_action_screen_two_title_ar = payload.see_in_action_screen_two_title_ar || 'لوحة التحليلات اللحظية';
    const see_in_action_screen_two_title_en = payload.see_in_action_screen_two_title_en || 'Live Telemetry Dashboard';
    const see_in_action_screen_three_title_ar = payload.see_in_action_screen_three_title_ar || 'شاشة التقارير والمخزون';
    const see_in_action_screen_three_title_en = payload.see_in_action_screen_three_title_en || 'Inventory & Reports';

    // How it works
    const how_it_works_data = Array.isArray(payload.how_it_works_data) && payload.how_it_works_data.length
      ? payload.how_it_works_data
      : (Array.isArray(payload.how_it_works?.steps)
          ? payload.how_it_works.steps.map(s => ({ title: s.title || 'خطوة', description: s.desc || s.description || '' }))
          : [{ title: 'الإعداد السريع', description: 'تهيئة وتشغيل في دقائق' }]);

    // Why teams
    const why_teams_data = Array.isArray(payload.why_teams_data) && payload.why_teams_data.length
      ? payload.why_teams_data
      : (Array.isArray(payload.why_choose?.items)
          ? payload.why_choose.items.map(it => ({ title: it.title || 'موثوقية عالية', description: it.desc || it.description || '' }))
          : [{ title: 'استقرار 99.99%', description: 'بنية سحابية موثوقة' }]);

    // Scalability
    const scalability_tiers = Array.isArray(payload.scalability_tiers) && payload.scalability_tiers.length
      ? payload.scalability_tiers
      : (Array.isArray(payload.scalability)
          ? payload.scalability.map(s => ({ title: s.title || 'حجم العمل', advantage: s.highlight || 'مرونة', specifications_capacity: s.specs || '' }))
          : [{ title: 'Single Store', advantage: 'مرونة عالية', specifications_capacity: 'Up to 5,000 SKUs' }]);

    // Packages
    const packages = Array.isArray(payload.packages) && payload.packages.length
      ? payload.packages
      : [{ name: 'Enterprise Edition', description: 'Unlimited Terminals & Multiple Branches' }];

    return {
      ...payload,
      name_ar,
      name_en,
      name: name_ar,
      slug,
      category_id,
      color,
      address_ar,
      address_en,
      description_ar,
      description_en,
      is_active: payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1,
      is_featured_product: payload.is_featured_product !== undefined ? (payload.is_featured_product ? 1 : 0) : 1,
      overview_paragraph1,
      overview_paragraph2,
      built_for_main_section_title,
      built_for_secondary_section_title,
      built_for_data,
      what_it_does_main_title,
      what_it_does_secondary_title,
      what_it_does_data,
      see_in_action_screen_one_title_ar,
      see_in_action_screen_one_title_en,
      see_in_action_screen_two_title_ar,
      see_in_action_screen_two_title_en,
      see_in_action_screen_three_title_ar,
      see_in_action_screen_three_title_en,
      how_it_works_data,
      why_teams_data,
      scalability_tiers,
      packages,
    };
  }

  /**
   * Create a new product
   */
  static async create(payload) {
    const normalized = ProductService.normalizePayload(payload);
    const res = await apiClient.post('/dashboard/products', await ProductService.toMultipartPayload(normalized));
    return createProductModel(res.data?.data || payload);
  }

  /**
   * Update an existing product
   */
  static async update(id, payload) {
    const normalized = ProductService.normalizePayload(payload);
    const res = await apiClient.put(`/dashboard/products/${id}`, await ProductService.toMultipartPayload(normalized));
    return createProductModel(res.data?.data || payload);
  }

  /**
   * Delete a product
   */
  static async delete(id) {
    const res = await apiClient.delete(`/dashboard/products/${id}`);
    return res.data;
  }

  /**
   * Fetch product categories
   */
  static async getCategories() {
    const res = await apiClient.get('/dashboard/categories');
    return res.data?.data || [];
  }

  /**
   * Create a product category
   */
  static async createCategory(payload) {
    const res = await apiClient.post('/dashboard/categories', payload);
    return res.data?.data;
  }

  /**
   * Update a product category
   */
  static async updateCategory(id, payload) {
    const res = await apiClient.put(`/dashboard/categories/${id}`, payload);
    return res.data?.data;
  }

  /**
   * Delete a product category
   */
  static async deleteCategory(id) {
    const res = await apiClient.delete(`/dashboard/categories/${id}`);
    return res.data;
  }

  // --- Public Website Endpoints ---

  /**
   * Fetch public products for visitors
   */
  static async getPublicProducts(params = {}) {
    const res = await apiClient.get('/site/products', { params });
    const rawData = res.data?.data || [];
    return rawData.map(createProductModel);
  }

  /**
   * Fetch public product details
   */
  static async getPublicProductById(id) {
    const res = await apiClient.get(`/site/products/${id}`);
    return createProductModel(res.data?.data || {});
  }

  /**
   * Fetch public categories
   */
  static async getPublicCategories() {
    const res = await apiClient.get('/site/categories');
    return res.data?.data || [];
  }
}

export default ProductService;
