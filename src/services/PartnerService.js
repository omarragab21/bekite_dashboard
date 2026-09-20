/**
 * Strategic Technology Partners Service
 * Provides full CRUD, status toggling, and multipart file upload support.
 */

import apiClient from '../infrastructure/api/client';
import { createPartnerModel } from '../domain/models';
import { appendUpload, appendValue } from '../utils/multipart';

export const DEFAULT_PARTNERS = [
  {
    id: 1,
    name: 'Google',
    name_ar: 'جوجل العالمية',
    subtitle: 'Google Cloud & Google Play Partner',
    badge: 'شريك تكنولوجي معتمد',
    tier: 'Google Premier Partner',
    category: 'cloud',
    brand_color: '#4285F4',
    accent_color: '#34A853',
    logoType: 'google',
    description: 'شراكة معتمدة لنشر وتوثيق التطبيقات على متجر Google Play مع تكامل خدمات Google Cloud Platform وخرائط Maps API لمنظومة بي كايت.',
    features: ['متجر Google Play', 'Google Cloud Platform', 'خرائط Google Maps API', 'سحابة Firebase'],
    links: [
      { label: 'Google Play Console', href: 'https://play.google.com/console', type: 'primary' },
      { label: 'Google Cloud Portal', href: 'https://cloud.google.com', type: 'secondary' },
    ],
    google_play_url: 'https://play.google.com/console',
    apple_store_url: '',
    website_url: 'https://cloud.google.com',
    is_active: 1,
  },
  {
    id: 2,
    name: 'Apple',
    name_ar: 'أبل العالمية',
    subtitle: 'Apple Developer Ecosystem Partner',
    badge: 'شريك مطوري iOS',
    tier: 'Apple Developer Enterprise',
    category: 'stores',
    brand_color: '#18181b',
    accent_color: '#52525b',
    logoType: 'apple',
    description: 'شراكة متخصصة ضمن برنامج مطوري Apple لنشر وتوثيق تطبيقات iOS، iPadOS، وتكامل بوابات الدفع عبر Apple Pay.',
    features: ['متجر App Store', 'تكامل Apple Pay', 'اختبارات TestFlight', 'تطوير Swift / iOS'],
    links: [
      { label: 'App Store Connect', href: 'https://appstoreconnect.apple.com', type: 'primary' },
      { label: 'Apple Developer', href: 'https://developer.apple.com', type: 'secondary' },
    ],
    google_play_url: '',
    apple_store_url: 'https://appstoreconnect.apple.com',
    website_url: 'https://developer.apple.com',
    is_active: 1,
  },
  {
    id: 3,
    name: 'Microsoft',
    name_ar: 'مايكروسوفت العالمية',
    subtitle: 'Microsoft Cloud & AI Solutions Partner',
    badge: 'شريك حلول مايكروسوفت',
    tier: 'Gold Cloud & AI Partner',
    category: 'cloud',
    brand_color: '#00A4EF',
    accent_color: '#7FBA00',
    logoType: 'microsoft',
    description: 'اعتماد رسمي لتشغيل الحلول السحابية وخدمات الذكاء الاصطناعي عبر Microsoft Azure، وأمن البيانات المؤسسية.',
    features: ['سحابة Microsoft Azure', 'خدمات الذكاء الاصطناعي Copilot', 'حماية الهوية Active Directory', 'أنظمة Microsoft 365'],
    links: [
      { label: 'Azure Portal', href: 'https://portal.azure.com', type: 'primary' },
      { label: 'Microsoft Cloud', href: 'https://cloud.microsoft.com', type: 'secondary' },
    ],
    google_play_url: '',
    apple_store_url: '',
    website_url: 'https://cloud.microsoft.com',
    is_active: 1,
  },
  {
    id: 4,
    name: 'Amazon Web Services',
    name_ar: 'أمازون ويب سيرفسز (AWS)',
    subtitle: 'AWS Advanced Technology Partner',
    badge: 'شريك البنية التحتية',
    tier: 'AWS Advanced Tier Partner',
    category: 'cloud',
    brand_color: '#FF9900',
    accent_color: '#232F3E',
    logoType: 'aws',
    description: 'استضافة وتشغيل الأنظمة السحابية والحلول المؤسسية الضخمة مع ضمان استقرار 99.99% عبر مراكز بيانات AWS العالمية.',
    features: ['خوادم EC2 & S3', 'توزيع المحتوى CloudFront', 'قواعد بيانات RDS', 'حماية WAF السحابية'],
    links: [
      { label: 'AWS Console', href: 'https://aws.amazon.com/console/', type: 'primary' },
      { label: 'AWS Partner Network', href: 'https://aws.amazon.com/partners/', type: 'secondary' },
    ],
    google_play_url: '',
    apple_store_url: '',
    website_url: 'https://aws.amazon.com',
    is_active: 1,
  },
  {
    id: 5,
    name: 'Oracle',
    name_ar: 'أوراكل',
    subtitle: 'Enterprise Database & ERP Partner',
    badge: 'شريك قواعد بيانات',
    tier: 'Oracle Certified Partner',
    category: 'fintech',
    brand_color: '#C74634',
    accent_color: '#000000',
    logoType: 'oracle',
    description: 'ربط وتكامل الأنظمة البرمجية وحلول الـ ERP مع قواعد بيانات أوراكل السحابية للشركات الكبرى والجهات الحكومية.',
    features: ['تكامل Oracle ERP', 'قواعد بيانات عالية الأداء', 'ربط الفوترة الإلكترونية', 'أمان البيانات المصرفية'],
    links: [
      { label: 'Oracle Cloud', href: 'https://www.oracle.com/cloud/', type: 'primary' },
      { label: 'Oracle NetSuite', href: 'https://www.netsuite.com', type: 'secondary' },
    ],
    google_play_url: '',
    apple_store_url: '',
    website_url: 'https://www.oracle.com/cloud/',
    is_active: 1,
  },
  {
    id: 6,
    name: 'Stripe & FinTech Partners',
    name_ar: 'سترايب والمدفوعات',
    subtitle: 'Global Payment Infrastructure Partner',
    badge: 'شريك بوابات الدفع',
    tier: 'Verified FinTech Partner',
    category: 'fintech',
    brand_color: '#635BFF',
    accent_color: '#0A2540',
    logoType: 'stripe',
    description: 'معالجة المدفوعات الرقمية العالمية والاشتراكات المتكررة والمحافظ الإلكترونية عبر شراكات التكنولوجيا المالية المعتمدة.',
    features: ['Apple Pay & Google Pay', 'فوترة واشتراكات متكررة', 'امتثال معايير PCI-DSS', 'بطاقات بنكية دولية'],
    links: [
      { label: 'Stripe Dashboard', href: 'https://dashboard.stripe.com', type: 'primary' },
      { label: 'FinTech Network', href: 'https://stripe.com', type: 'secondary' },
    ],
    google_play_url: '',
    apple_store_url: '',
    website_url: 'https://stripe.com',
    is_active: 1,
  },
];

const LOCAL_STORAGE_KEY = 'bekite_partners_store_v1';

function getLocalPartners() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed reading partners from localStorage', e);
  }
  saveLocalPartners(DEFAULT_PARTNERS);
  return DEFAULT_PARTNERS;
}

function saveLocalPartners(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed saving partners to localStorage', e);
  }
}

export class PartnerService {
  /**
   * Serialize payload into FormData for file uploads
   */
  static async toMultipartPayload(payload = {}) {
    const fd = new FormData();
    const skip = new Set(['features', 'links', 'logo_file', 'image', 'logo_url']);

    Object.entries(payload).forEach(([key, value]) => {
      if (skip.has(key) || value === null || value === undefined) return;
      appendValue(fd, key, value);
    });

    // Features array
    const features = Array.isArray(payload.features) ? payload.features : [];
    features.forEach((feat, index) => {
      appendValue(fd, `features[${index}]`, feat);
    });

    // Links array
    const links = Array.isArray(payload.links) ? payload.links : [];
    links.forEach((link, index) => {
      appendValue(fd, `links[${index}][label]`, link.label || '');
      appendValue(fd, `links[${index}][href]`, link.href || '');
      appendValue(fd, `links[${index}][type]`, link.type || 'primary');
    });

    // Upload custom logo image file if present
    const logoFile = payload.logo_file || payload.image_file || payload.image;
    if (logoFile && (logoFile instanceof File || (typeof logoFile === 'string' && logoFile.startsWith('data:')))) {
      await appendUpload(fd, 'logo_file', logoFile, `partner-logo-${Date.now()}.png`);
    }

    return fd;
  }

  /**
   * Get all partners (with local storage fallback/sync)
   */
  static async getAll(params = {}) {
    try {
      const response = await apiClient.get('/admin/partners', { params });
      const rawData = response.data?.data || response.data || [];
      const list = Array.isArray(rawData) ? rawData : (rawData.data || []);
      if (list.length > 0) {
        saveLocalPartners(list);
        return list.map(createPartnerModel);
      }
    } catch (err) {
      console.warn('PartnerService.getAll: using local storage store', err);
    }
    const local = getLocalPartners();
    return local.map(createPartnerModel);
  }

  /**
   * Get single partner by ID
   */
  static async getById(id) {
    try {
      const response = await apiClient.get(`/admin/partners/${id}`);
      const raw = response.data?.data || response.data;
      if (raw && (String(raw.id) === String(id) || !id)) {
        return createPartnerModel(raw);
      }
    } catch (err) {
      console.warn('PartnerService.getById fallback to local store', err);
    }
    const local = getLocalPartners();
    const item = local.find(p => String(p.id) === String(id));
    if (item) return createPartnerModel(item);
    return createPartnerModel({ id });
  }

  /**
   * Create a new partner
   */
  static async create(payload) {
    const local = getLocalPartners();
    const newId = local.length > 0 ? Math.max(...local.map(p => Number(p.id) || 0)) + 1 : 1;
    const newPartner = {
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      ...payload,
      is_active: payload.is_active !== undefined ? Number(payload.is_active) : 1,
    };

    local.unshift(newPartner);
    saveLocalPartners(local);

    try {
      const fd = await this.toMultipartPayload({ ...payload, id: newId });
      const res = await apiClient.post('/admin/partners', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return createPartnerModel(res.data?.data || res.data || newPartner);
    } catch (err) {
      console.warn('PartnerService.create fallback to local store', err);
      return createPartnerModel(newPartner);
    }
  }

  /**
   * Update an existing partner
   */
  static async update(id, payload) {
    const local = getLocalPartners();
    const idx = local.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...payload };
      saveLocalPartners(local);
    }

    try {
      const fd = await this.toMultipartPayload(payload);
      fd.append('_method', 'PUT');
      const res = await apiClient.post(`/admin/partners/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return createPartnerModel(res.data?.data || res.data || local[idx]);
    } catch (err) {
      try {
        const res = await apiClient.put(`/admin/partners/${id}`, payload);
        return createPartnerModel(res.data?.data || res.data || local[idx]);
      } catch (e2) {
        return createPartnerModel(local[idx] || payload);
      }
    }
  }

  /**
   * Delete a partner
   */
  static async delete(id) {
    const local = getLocalPartners();
    const filtered = local.filter(p => String(p.id) !== String(id));
    saveLocalPartners(filtered);

    try {
      await apiClient.delete(`/admin/partners/${id}`);
      return true;
    } catch (err) {
      console.warn('PartnerService.delete local fallback', err);
      return true;
    }
  }

  /**
   * Toggle active state
   */
  static async toggleStatus(id) {
    const local = getLocalPartners();
    const item = local.find(p => String(p.id) === String(id));
    if (item) {
      item.is_active = (Number(item.is_active) === 1 || item.is_active === true) ? 0 : 1;
      saveLocalPartners(local);
      return this.update(id, item);
    }
  }
}
