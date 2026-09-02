/**
 * Domain Model Definitions & Entity Factories
 */

/**
 * Creates a default Project entity
 */
export function createProjectModel(raw = {}) {
  return {
    id: raw.id || null,
    title: raw.title || '',
    title_en: raw.title_en || '',
    slug: raw.slug || '',
    client_name: raw.client_name || '',
    category_id: raw.category_id || 1,
    category_name: raw.category_name || '',
    industry: raw.industry || '',
    location: raw.location || 'عمان، الأردن',
    location_en: raw.location_en || 'Amman, Jordan',
    year: raw.year || '2025 - 2026',
    badge: raw.badge || 'مشروع رقمي',
    badge_en: raw.badge_en || 'Digital Project',
    description: raw.description || raw.summary || '',
    description_en: raw.description_en || '',
    challenge: raw.challenge || '',
    solution: raw.solution || '',
    impact: raw.impact || '',
    card_image: raw.card_image || raw.image || raw.cover_image || '',
    image: raw.image || raw.card_image || raw.cover_image || '',
    logo: raw.logo || '',
    accent_color: raw.accent_color || '#7c3aed',
    filter_categories: Array.isArray(raw.filter_categories) ? raw.filter_categories : ['websites'],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    
    // Web Showcase
    web_image: raw.web_image || raw.card_image || '',
    website_url: raw.website_url || '',

    // Mobile App Showcase
    has_mobile_app: raw.has_mobile_app !== undefined ? Boolean(raw.has_mobile_app) : Boolean(raw.ios_url || raw.android_url || raw.mobile_image),
    mobile_image: raw.mobile_image || '',
    ios_url: raw.ios_url || raw.app_store_url || '',
    android_url: raw.android_url || raw.play_store_url || '',

    // Social Media Showcase
    social_media_images: Array.isArray(raw.social_media_images)
      ? raw.social_media_images
      : (Array.isArray(raw.social_media_grid) ? raw.social_media_grid : []),
    social_links: raw.social_links || {
      facebook: raw.facebook_url || '',
      instagram: raw.instagram_url || '',
      twitter: raw.twitter_url || '',
      linkedin: raw.linkedin_url || '',
      tiktok: raw.tiktok_url || '',
      youtube: raw.youtube_url || '',
    },

    // Branding Showcase & PDF Document
    branding_images: Array.isArray(raw.branding_images)
      ? raw.branding_images
      : (Array.isArray(raw.branding_showcase) ? raw.branding_showcase : []),
    branding_pdf_url: raw.branding_pdf_url || raw.pdf_url || '',
    branding_pdf_name: raw.branding_pdf_name || 'Brand_Identity_Guidelines.pdf',

    stats: Array.isArray(raw.stats) ? raw.stats : [{ label: 'النمو', value: '+150%' }],
    deliverables: Array.isArray(raw.deliverables) ? raw.deliverables : ['Web Platform'],
    is_featured: Boolean(raw.is_featured),
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true ? 1 : 0) : 1,
    order_index: raw.order_index || 0,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Creates a default Digital Product entity
 */
export function createProductModel(raw = {}) {
  return {
    id: raw.id || null,
    name: raw.name || '',
    name_en: raw.name_en || '',
    subtitle: raw.subtitle || raw.tagline || '',
    subtitle_en: raw.subtitle_en || '',
    slug: raw.slug || '',
    badge: raw.badge || '',
    badge_en: raw.badge_en || '',
    category: raw.category || 'ecommerce',
    category_id: raw.category_id || 1,
    category_name: raw.category_name || '',
    accent_color: raw.accent_color || '#7c3aed',
    image: raw.image || '',
    laptop_mockup: raw.laptop_mockup || '',
    demo_url: raw.demo_url || '',
    description: raw.description || '',
    description_en: raw.description_en || '',
    
    // Quick highlights / tags
    features: Array.isArray(raw.features) ? raw.features : [],
    features_en: Array.isArray(raw.features_en) ? raw.features_en : [],

    // 1. What does it include (Modules & Sub-features)
    modules: Array.isArray(raw.modules) ? raw.modules : [
      {
        icon: 'package',
        title: 'إدارة المنتجات والمخزون',
        title_en: 'Product & Inventory Management',
        description: 'إدارة متقدمة للكتالوج والخيارات المتعددة والمخازن المتفرقة.',
        description_en: 'Advanced catalog, variants, and multi-warehouse stock tracking.'
      }
    ],

    // 2. See it in action (Screenshots Gallery)
    gallery: Array.isArray(raw.gallery) ? raw.gallery : (
      Array.isArray(raw.screenshots) ? raw.screenshots : []
    ),

    // 3. Scalable from Startup to Enterprise Scale
    scalability: Array.isArray(raw.scalability) ? raw.scalability : [
      {
        tier: 'startup',
        title: 'الشركات الناشئة (Startup)',
        title_en: 'Startup Scale',
        highlight: 'إطلاق سريع وتكلفة مرنة',
        specs: 'حتى 10,000 طلب شهرياً، متجر واحد، تكامل شحن ودفع موحد',
        specs_en: 'Up to 10k orders/mo, single storefront, standard integrations'
      },
      {
        tier: 'growth',
        title: 'الشركات المتنامية (Growth)',
        title_en: 'Growth Scale',
        highlight: 'توسع متعدد الفروع والقنوات',
        specs: 'حتى 100,000 طلب شهرياً، نقاط بيع POS متعددة، بوابات دفع مخصصة',
        specs_en: 'Up to 100k orders/mo, multi-branch POS, customized gateways'
      },
      {
        tier: 'enterprise',
        title: 'المؤسسات الكبرى (Enterprise)',
        title_en: 'Enterprise Scale',
        highlight: 'بنية سحابية مخصصة وسعة فائقة',
        specs: 'طلبات غير محدودة، SLA 99.99%، ربط ERP مخصص، دعم فني VIP 24/7',
        specs_en: 'Unlimited throughput, 99.99% SLA, custom ERP integrations, 24/7 dedicated engineering'
      }
    ],

    // 4. Brands & Industry Editions
    editions: Array.isArray(raw.editions) ? raw.editions : [
      {
        name: 'تجارة للتجزئة (Retail & Fashion)',
        name_en: 'Tijara Retail & Fashion',
        icon: 'shopping-bag',
        description: 'مخصص لمحلات الملابس ومتاجر التجزئة مع دعم المقاسات والألوان ونقاط البيع.'
      },
      {
        name: 'تجارة للمطاعم والأغذية (Food & Beverage)',
        name_en: 'Tijara F&B Edition',
        icon: 'utensils',
        description: 'إدارة الطلبات السريعة، طاولات المطاعم، وتتبع التوصيل اللحظي.'
      },
      {
        name: 'تجارة للبيع بالجملة (B2B Wholesale)',
        name_en: 'Tijara B2B Edition',
        icon: 'briefcase',
        description: 'أسعار مخصصة لكل عميل، طلبات بالكميات، وائتمان الشركات.'
      }
    ],

    // 5. Projects built on this product
    related_projects: Array.isArray(raw.related_projects) ? raw.related_projects : (
      Array.isArray(raw.projects) ? raw.projects : []
    ),

    stats: raw.stats || { active_stores: '120+', daily_orders: '45K+', uptime: '99.99%' },
    is_featured: Boolean(raw.is_featured),
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true ? 1 : 0) : 1,
    order_index: raw.order_index || 0,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Creates a default Service/Solution entity
 */
export function createSolutionModel(raw = {}) {
  return {
    id: raw.id || null,
    title: raw.title || '',
    title_en: raw.title_en || '',
    slug: raw.slug || '',
    category: raw.category || 'التقنية والبرمجة',
    description: raw.description || '',
    deliverables: Array.isArray(raw.deliverables) ? raw.deliverables : [],
    icon_name: raw.icon_name || 'code',
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
    order_index: raw.order_index || 0,
  };
}

/**
 * Creates a default Brand Venture entity
 */
export function createBrandModel(raw = {}) {
  return {
    id: raw.id || null,
    name: raw.name || '',
    name_en: raw.name_en || '',
    slug: raw.slug || '',
    tagline: raw.tagline || '',
    description: raw.description || '',
    sector: raw.sector || '',
    status: raw.status || 'Active & Scaling',
    ownership: raw.ownership || '100% Be Kite Venture',
    website_url: raw.website_url || '',
    app_store_url: raw.app_store_url || '',
    play_store_url: raw.play_store_url || '',
    logo_url: raw.logo_url || '',
    cover_image: raw.cover_image || '',
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
  };
}

/**
 * Creates a default CRM Inquiry / Service Request entity
 */
export function createInquiryModel(raw = {}) {
  return {
    id: raw.id || null,
    full_name: raw.full_name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    company: raw.company || '',
    service_type: raw.service_type || 'تطوير برمجيات ومواقع',
    budget_range: raw.budget_range || '7,000 $ - 15,000 $',
    project_description: raw.project_description || '',
    status: raw.status || 'new', // new, contacted, in_progress, converted, archived
    notes: raw.notes || '',
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}
