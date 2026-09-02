/**
 * Core Constants & Enums for Be Kite Platform
 */

export const INQUIRY_STATUSES = {
  NEW: { key: 'new', label: 'جديد', color: '#dc2626', bg: '#fee2e2' },
  CONTACTED: { key: 'contacted', label: 'تم التواصل', color: '#ea580c', bg: '#ffedd5' },
  IN_PROGRESS: { key: 'in_progress', label: 'قيد التنفيذ', color: '#2563eb', bg: '#dbeafe' },
  CONVERTED: { key: 'converted', label: 'تم التحويل', color: '#16a34a', bg: '#dcfce7' },
  ARCHIVED: { key: 'archived', label: 'مؤرشف', color: '#64748b', bg: '#f1f5f9' },
};

export const PROJECT_CATEGORIES = [
  { id: 1, slug: 'full-digital-presence', name: 'الحضور الرقمي والبرمجة', name_en: 'Full Digital Presence' },
  { id: 2, slug: 'branding-creative', name: 'الهوية البصرية والإنتاج الإبداعي', name_en: 'Branding & Creative' },
  { id: 3, slug: 'performance-marketing', name: 'التسويق الرقمي وإعلانات الأداء', name_en: 'Performance Marketing' },
  { id: 4, slug: 'media-production', name: 'الإنتاج الإعلامي والفيديو', name_en: 'Media & Video Production' },
];

export const PRODUCT_CATEGORIES = [
  { id: 1, slug: 'e-commerce', name: 'منصات التجارة الإلكترونية' },
  { id: 2, slug: 'business-platforms', name: 'الأنظمة الإدارية ومنصات الأعمال' },
  { id: 3, slug: 'community-education', name: 'الأنظمة التعليمية والمجتمعية' },
  { id: 4, slug: 'digital-presence', name: 'حلول الحضور الرقمي' },
];

export const ADMIN_ROLES = {
  SUPER_ADMIN: { key: 'super_admin', label: 'مدير النظام (سوبر)', color: '#4f008c' },
  OPERATIONS_MANAGER: { key: 'operations_manager', label: 'مدير العمليات', color: '#2563eb' },
  PROJECT_MANAGER: { key: 'project_manager', label: 'مدير المشاريع', color: '#0891b2' },
  CONTENT_MANAGER: { key: 'content_manager', label: 'مدير المحتوى', color: '#7c3aed' },
  CRM_SPECIALIST: { key: 'crm_specialist', label: 'أخصائي علاقات العملاء', color: '#16a34a' },
};

export const BUDGET_RANGES = [
  'أقل من 3,000 $',
  '3,000 $ - 7,000 $',
  '7,000 $ - 15,000 $',
  '15,000 $ - 30,000 $',
  'أكثر من 30,000 $',
];

export const SERVICE_TYPES = [
  { id: 'dev', name: 'تطوير المواقع والأنظمة المخصصة', category: 'التقنية والبرمجة' },
  { id: 'mobile', name: 'تطبيقات الهواتف الذكية (iOS & Android)', category: 'التقنية والبرمجة' },
  { id: 'branding', name: 'تصميم الهوية البصرية والعلامة التجارية', category: 'التصميم والإبداع' },
  { id: 'marketing', name: 'إعلانات الأداء والتسويق بالنتائج', category: 'التسويق الرقمي' },
  { id: 'seo', name: 'تحسين محركات البحث والظهور الرقمي', category: 'التسويق الرقمي' },
  { id: 'media', name: 'إنتاج الفيديو والموشن جرافيك', category: 'الإنتاج الإعلامي' },
];

export const BRAND_COLORS = {
  PURPLE: '#4f008c',
  PURPLE_DARK: '#23113b',
  PURPLE_LIGHT: '#7c3aed',
  GOLD: '#ffc700',
  GOLD_LIGHT: '#ffd633',
  TEAL: '#0891b2',
  SUCCESS: '#10b981',
  DANGER: '#dc2626',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
};
