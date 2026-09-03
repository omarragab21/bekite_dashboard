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

    // Deep Case Study Sections matching Bekite Website 1:1
    overview: raw.overview || null,
    built_for: raw.built_for || null,
    what_it_does: raw.what_it_does || null,
    action_main_image: raw.action_main_image || '',
    action_screens: Array.isArray(raw.action_screens) ? raw.action_screens : [],
    how_it_works: raw.how_it_works || null,
    why_choose: raw.why_choose || null,
    bottom_cta: raw.bottom_cta || null,

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
    title_highlight: raw.title_highlight || '',
    title_highlight_en: raw.title_highlight_en || '',
    slug: raw.slug || '',
    category: raw.category || 'technology',
    category_name: raw.category_name || '',
    category_name_en: raw.category_name_en || '',
    badge: raw.badge || '',
    description: raw.description || '',
    description_en: raw.description_en || '',
    hero_image: raw.hero_image || '',
    icon: raw.icon || 'code',
    icon_name: raw.icon_name || 'Code',
    technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    capabilities: Array.isArray(raw.capabilities) ? raw.capabilities : [],
    deliverables: Array.isArray(raw.deliverables) ? raw.deliverables : [],
    problem_section: raw.problem_section || null,
    solve_section: raw.solve_section || null,
    deliver_section: raw.deliver_section || null,
    process_section: raw.process_section || null,
    why_section: raw.why_section || null,
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true ? 1 : 0) : 1,
    order_index: raw.order_index || 0,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Creates a default Brand Venture entity
 */
export function createBrandModel(raw = {}) {
  const brandName = raw.name || raw.title || '';
  const brandNameEn = raw.name_en || raw.title_en || '';
  const sub = raw.subtitle || raw.tagline || '';
  return {
    id: raw.id || null,
    name: brandName,
    name_en: brandNameEn,
    title: brandName,
    title_en: brandNameEn,
    subtitle: sub,
    subtitle_en: raw.subtitle_en || '',
    tagline: sub,
    slug: raw.slug || '',
    badge: raw.badge || 'CONSUMER APP',
    badge_en: raw.badge_en || 'CONSUMER APP',
    description: raw.description || '',
    description_en: raw.description_en || '',
    sector: raw.sector || 'Digital Ventures',
    status: raw.status || (raw.is_coming_soon ? 'In Pipeline' : 'Active & Scaling'),
    ownership: raw.ownership || '100% Be Kite Venture',
    tags: Array.isArray(raw.tags) ? raw.tags : ['علامة استهلاكية'],
    tags_en: Array.isArray(raw.tags_en) ? raw.tags_en : ['Consumer Brand'],
    links: Array.isArray(raw.links) ? raw.links : [
      { label: 'الموقع الرسمي', label_en: 'Website', href: raw.website_url || '#', type: 'primary' },
      { label: 'iOS', label_en: 'iOS', href: raw.app_store_url || '#', type: 'secondary' },
      { label: 'Android', label_en: 'Android', href: raw.play_store_url || '#', type: 'secondary' },
    ],
    website_url: raw.website_url || '',
    app_store_url: raw.app_store_url || '',
    play_store_url: raw.play_store_url || '',
    image: raw.image || raw.cover_image || '/images/brands/zalameh_mockup.png',
    cover_image: raw.image || raw.cover_image || '/images/brands/zalameh_mockup.png',
    logo: raw.logo || raw.logo_url || '',
    logo_url: raw.logo || raw.logo_url || '',
    brand_color: raw.brand_color || raw.brandColor || '#ea580c',
    accent_color: raw.accent_color || raw.accentColor || '#c2410c',
    layout: raw.layout || 'image-left',
    is_coming_soon: raw.is_coming_soon !== undefined ? Number(raw.is_coming_soon) : 0,
    pipeline_status: raw.pipeline_status || (raw.is_coming_soon ? 'In Pipeline' : 'Live'),
    is_active: raw.is_active !== undefined ? (raw.is_active ? 1 : 0) : 1,
    order_index: raw.order_index || 1,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
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
