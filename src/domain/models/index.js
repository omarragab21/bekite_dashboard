/**
 * Domain Model Definitions & Entity Factories
 */

/**
 * Creates a default Project entity
 */
export function createProjectModel(raw = {}) {
  const title = raw.name_ar || raw.title || raw.name || '';
  const title_en = raw.name_en || raw.title_en || '';
  const uploadedImages = Array.isArray(raw.images)
    ? raw.images.map((item) => ({
      id: item.id,
      image: item.image_url || item.image || item.url || '',
      url: item.image_url || item.image || item.url || '',
      title: item.title || '',
      type: item.type || '',
    }))
    : [];
  const socialImages = Array.isArray(raw.social_media_images)
    ? raw.social_media_images
    : (Array.isArray(raw.social_media_grid) ? raw.social_media_grid : uploadedImages.filter((item) => item.type === 'social'));
  const brandingImages = Array.isArray(raw.branding_images)
    ? raw.branding_images
    : (Array.isArray(raw.branding_showcase) ? raw.branding_showcase : uploadedImages.filter((item) => item.type === 'branding'));
  return {
    id: raw.id || null,
    title,
    title_en,
    name: title,
    name_en: title_en,
    slug: raw.slug || '',
    client_name: raw.client_name || '',
    category_id: raw.category_id || (Array.isArray(raw.category_ids) ? raw.category_ids[0] : 1),
    category_ids: Array.isArray(raw.category_ids) ? raw.category_ids : [],
    category_name: raw.category_name || (raw.categories?.[0]?.name) || '',
    industry: raw.industry || '',
    location: raw.location || 'عمان، الأردن',
    location_en: raw.location_en || 'Amman, Jordan',
    year: raw.year || '2025 - 2026',
    badge: raw.badge || 'مشروع رقمي',
    badge_en: raw.badge_en || 'Digital Project',
    description: raw.description_ar || raw.description || raw.summary || '',
    description_en: raw.description_en || '',
    challenge: raw.challenge || '',
    solution: raw.solution || '',
    impact: raw.impact || '',
    card_image: raw.website_showcase_image_url || raw.card_image || raw.image || raw.cover_image || '',
    image: raw.website_showcase_image_url || raw.image || raw.card_image || raw.cover_image || '',
    logo: raw.client_logo_url || raw.logo || '',
    accent_color: raw.accent_color || '#7c3aed',
    filter_categories: Array.isArray(raw.filter_categories) ? raw.filter_categories : ['websites'],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    
    // Web Showcase
    web_image: raw.website_showcase_image_url || raw.web_image || raw.card_image || '',
    website_url: raw.live_website_url || raw.website_url || '',
    live_website_url: raw.live_website_url || raw.website_url || '',

    // Mobile App Showcase
    has_mobile_app: raw.has_mobile_app !== undefined ? Boolean(raw.has_mobile_app) : Boolean(raw.ios_url || raw.android_url || raw.mobile_image),
    mobile_image: raw.mobile_app_mockup_image_url || raw.mobile_image || '',
    ios_url: raw.mobile_app_apple_store_url || raw.ios_url || raw.app_store_url || '',
    android_url: raw.mobile_app_play_store_url || raw.android_url || raw.play_store_url || '',

    // Social Media Showcase
    social_media_images: socialImages,
    social_links: raw.social_links || {
      facebook: raw.facebook_url || '',
      instagram: raw.instagram_url || '',
      twitter: raw.twitter_x_url || raw.twitter_url || '',
      linkedin: raw.linkedin_url || '',
      tiktok: raw.tiktok_url || '',
      youtube: raw.youtube_url || '',
    },

    // Branding Showcase & PDF Document
    branding_images: brandingImages,
    branding_pdf_url: raw.pdf_url || raw.branding_pdf_url || '',
    branding_pdf_name: raw.branding_pdf_name || 'Brand_Identity_Guidelines.pdf',

    stats: Array.isArray(raw.kpi) ? raw.kpi.map(k => ({ label: k.text || k['text'], value: k.percentage || k['percentage'] })) : (Array.isArray(raw.stats) ? raw.stats : [{ label: 'النمو', value: '+150%' }]),
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
  const name = raw.name_ar || raw.translations?.ar?.name || raw.name || '';
  const name_en = raw.name_en || raw.translations?.en?.name || (raw.name !== name ? raw.name : '');
  const description = raw.description_ar || raw.translations?.ar?.description || raw.description || '';
  const description_en = raw.description_en || raw.translations?.en?.description || '';
  const address = raw.address_ar || raw.translations?.ar?.address || raw.address || '';
  const address_en = raw.address_en || raw.translations?.en?.address || '';

  const screenGallery = [
    ['see_in_action_screen_one_image_url', raw.see_in_action_screen_one_title_ar || raw.translations?.ar?.see_in_action_screen_one_title || raw.see_in_action_screen_one_title_en || 'Screen 1'],
    ['see_in_action_screen_two_image_url', raw.see_in_action_screen_two_title_ar || raw.translations?.ar?.see_in_action_screen_two_title || raw.see_in_action_screen_two_title_en || 'Screen 2'],
    ['see_in_action_screen_three_image_url', raw.see_in_action_screen_three_title_ar || raw.translations?.ar?.see_in_action_screen_three_title || raw.see_in_action_screen_three_title_en || 'Screen 3'],
  ].filter(([key]) => raw[key]).map(([key, title]) => ({ image: raw[key], url: raw[key], title, title_ar: title }));
  return {
    id: raw.id || null,
    name,
    name_en,
    subtitle: raw.subtitle || raw.translations?.ar?.subtitle || raw.tagline || '',
    subtitle_en: raw.subtitle_en || raw.translations?.en?.subtitle || '',
    slug: raw.slug || '',
    badge: raw.badge || raw.translations?.ar?.badge || '',
    badge_en: raw.badge_en || raw.translations?.en?.badge || '',
    category: raw.category?.slug || raw.category || 'ecommerce',
    category_id: raw.category_id || 1,
    category_name: raw.category?.name || raw.category_name || '',
    accent_color: raw.color || raw.accent_color || '#7c3aed',
    image: raw.overview_tablet_image_url || raw.image || '',
    laptop_mockup: raw.see_in_action_main_image_url || raw.laptop_mockup || '',
    demo_url: raw.demo_url || '',
    description,
    description_en,
    address,
    address_en,
    
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
      Array.isArray(raw.screenshots) ? raw.screenshots : (
        Array.isArray(raw.action_screens) ? raw.action_screens : screenGallery
      )
    ),

    // 3. Scalable from Startup to Enterprise Scale
    scalability: (Array.isArray(raw.scalability_tiers) && raw.scalability_tiers.length)
      ? raw.scalability_tiers.map((s, idx) => ({
          tier: s.tier || (idx === 0 ? 'startup' : (idx === 1 ? 'growth' : 'enterprise')),
          title: s.title || '',
          highlight: s.advantage || s.highlight || '',
          specs: s.specifications_capacity || s.specs || '',
          specs_en: s.specifications_capacity || s.specs_en || ''
        }))
      : (Array.isArray(raw.scalability) ? raw.scalability : [
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
        ]),

    // 4. Brands & Industry Editions
    editions: (Array.isArray(raw.packages) && raw.packages.length)
      ? raw.packages.map((pkg, idx) => ({
          name: pkg.name || '',
          name_en: pkg.name_en || '',
          icon: pkg.icon || (idx === 0 ? 'package' : (idx === 1 ? 'briefcase' : 'globe')),
          description: pkg.description || pkg.desc || ''
        }))
      : (Array.isArray(raw.editions) ? raw.editions : [
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
        ]),

    // 5. Projects built on this product
    related_projects: Array.isArray(raw.related_projects) ? raw.related_projects : (
      Array.isArray(raw.projects) ? raw.projects : []
    ),

    // Deep Case Study Sections matching Bekite Website 1:1
    overview: {
      p1: raw.overview_paragraph1 || raw.overview?.paragraph1 || raw.overview?.p1 || raw.description_ar || raw.description || '',
      p2: raw.overview_paragraph2 || raw.overview?.paragraph2 || raw.overview?.p2 || '',
      paragraph1: raw.overview_paragraph1 || raw.overview?.paragraph1 || raw.overview?.p1 || '',
      paragraph2: raw.overview_paragraph2 || raw.overview?.paragraph2 || raw.overview?.p2 || '',
      image: raw.overview_tablet_image_url || raw.overview?.tablet_image_url || raw.overview?.image || '',
      tablet_image_url: raw.overview_tablet_image_url || raw.overview?.tablet_image_url || raw.overview?.image || '',
      pill: raw.overview?.pill || 'نظرة عامة',
      title: raw.overview?.title || ('ما هو نظام ' + name + '؟')
    },
    built_for: {
      main_title: raw.built_for_main_section_title || raw.built_for?.main_title || raw.built_for?.title || 'لمن صُمم هذا النظام؟',
      title: raw.built_for_main_section_title || raw.built_for?.main_title || raw.built_for?.title || 'لمن صُمم هذا النظام؟',
      secondary_title: raw.built_for_secondary_section_title || raw.built_for?.secondary_title || raw.built_for?.subtitle || '',
      subtitle: raw.built_for_secondary_section_title || raw.built_for?.secondary_title || raw.built_for?.subtitle || '',
      pill: raw.built_for?.pill || 'لمن صُمم النظام',
      data: Array.isArray(raw.built_for_data) ? raw.built_for_data : (raw.built_for?.data || []),
      items: (Array.isArray(raw.built_for_data) && raw.built_for_data.length)
        ? raw.built_for_data.map((i, idx) => ({ title: i.title, desc: i.description || i.desc || '', icon: i.icon || (idx === 0 ? 'shopping-cart' : 'truck') }))
        : (Array.isArray(raw.built_for?.items) ? raw.built_for.items : [])
    },
    what_it_does: {
      main_title: raw.what_it_does_main_title || raw.what_it_does?.main_title || raw.what_it_does?.title || 'المزايا والقدرات الأساسية',
      title: raw.what_it_does_main_title || raw.what_it_does?.main_title || raw.what_it_does?.title || 'المزايا والقدرات الأساسية',
      secondary_title: raw.what_it_does_secondary_title || raw.what_it_does?.secondary_title || raw.what_it_does?.subtitle || '',
      subtitle: raw.what_it_does_secondary_title || raw.what_it_does?.secondary_title || raw.what_it_does?.subtitle || '',
      pill: raw.what_it_does?.pill || 'المزايا والقدرات',
      data: Array.isArray(raw.what_it_does_data) ? raw.what_it_does_data : (raw.what_it_does?.data || []),
      items: (Array.isArray(raw.what_it_does_data) && raw.what_it_does_data.length)
        ? raw.what_it_does_data.map((i, idx) => ({ title: i.title, desc: i.description || i.desc || '', icon: i.icon || (idx === 0 ? 'cpu' : 'activity') }))
        : (Array.isArray(raw.what_it_does?.items) ? raw.what_it_does.items : [])
    },
    action_main_image: raw.see_in_action_main_image_url || raw.action_main_image || '',
    action_screens: (Array.isArray(raw.action_screens) && raw.action_screens.length)
      ? raw.action_screens
      : (screenGallery.length ? screenGallery : []),
    how_it_works: {
      pill: raw.how_it_works?.pill || 'كيف يعمل',
      title: raw.how_it_works?.title || 'سهل في البداية، قوي وقابل للتوسع',
      subtitle: raw.how_it_works?.subtitle || 'خطوات بسيطة وواضحة لتشغيل المنظومة بكفاءة عالية',
      data: Array.isArray(raw.how_it_works_data) ? raw.how_it_works_data : (raw.how_it_works?.data || []),
      steps: (Array.isArray(raw.how_it_works_data) && raw.how_it_works_data.length)
        ? raw.how_it_works_data.map((st, idx) => ({ num: idx + 1, title: st.title, desc: st.description || st.desc || '' }))
        : (Array.isArray(raw.how_it_works?.steps) ? raw.how_it_works.steps : [])
    },
    why_choose: {
      pill: raw.why_choose?.pill || 'المزايا التنافسية',
      title: raw.why_choose?.title || ('لماذا تختار الشركات نظام ' + name + '؟'),
      data: Array.isArray(raw.why_teams_data) ? raw.why_teams_data : (raw.why_choose?.data || []),
      items: (Array.isArray(raw.why_teams_data) && raw.why_teams_data.length)
        ? raw.why_teams_data.map(w => ({ title: w.title, desc: w.description || w.desc || '' }))
        : (Array.isArray(raw.why_choose?.items) ? raw.why_choose.items : [])
    },
    scalability_tiers: Array.isArray(raw.scalability_tiers) ? raw.scalability_tiers : [],
    packages: Array.isArray(raw.packages) ? raw.packages : (Array.isArray(raw.editions) ? raw.editions : []),
    bottom_cta: raw.bottom_cta || {
      title: `جاهز لتشغيل أو تخصيص نظام ${name}؟`,
      description: 'احصل على استشارة تقنية مجانية وعرض حي للنظام من فريق بي كايت.',
      button_text: 'تعديل بيانات المنتج ✎'
    },

    stats: raw.stats || { active_stores: '120+', daily_orders: '45K+', uptime: '99.99%' },
    is_featured: Boolean(raw.is_featured_product !== undefined ? raw.is_featured_product : raw.is_featured),
    is_featured_product: raw.is_featured_product !== undefined ? (raw.is_featured_product ? 1 : 0) : (raw.is_featured ? 1 : 0),
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true ? 1 : 0) : 1,
    order_index: raw.order_index || 0,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],

    // Raw Postman JSON schema direct fields for 1:1 round-tripping
    name_ar: raw.name_ar || raw.translations?.ar?.name || name,
    address_ar: raw.address_ar || raw.translations?.ar?.address || raw.address || '',
    description_ar: raw.description_ar || raw.translations?.ar?.description || raw.description || '',
    color: raw.color || raw.accent_color || '#1E3A8A',
    overview_paragraph1: raw.overview_paragraph1 || raw.overview?.paragraph1 || raw.overview?.p1 || '',
    overview_paragraph2: raw.overview_paragraph2 || raw.overview?.paragraph2 || raw.overview?.p2 || '',
    overview_tablet_image_url: raw.overview_tablet_image_url || raw.overview?.image || '',
    built_for_main_section_title: raw.built_for_main_section_title || raw.built_for?.main_title || raw.built_for?.title || '',
    built_for_secondary_section_title: raw.built_for_secondary_section_title || raw.built_for?.secondary_title || raw.built_for?.subtitle || '',
    built_for_data: Array.isArray(raw.built_for_data) ? raw.built_for_data : (raw.built_for?.data || []),
    what_it_does_main_title: raw.what_it_does_main_title || raw.what_it_does?.main_title || raw.what_it_does?.title || '',
    what_it_does_secondary_title: raw.what_it_does_secondary_title || raw.what_it_does?.secondary_title || raw.what_it_does?.subtitle || '',
    what_it_does_data: Array.isArray(raw.what_it_does_data) ? raw.what_it_does_data : (raw.what_it_does?.data || []),
    see_in_action_main_image_url: raw.see_in_action_main_image_url || raw.action_main_image || '',
    see_in_action_screen_one_title_ar: raw.see_in_action_screen_one_title_ar || raw.translations?.ar?.see_in_action_screen_one_title || '',
    see_in_action_screen_one_title_en: raw.see_in_action_screen_one_title_en || raw.translations?.en?.see_in_action_screen_one_title || '',
    see_in_action_screen_one_image_url: raw.see_in_action_screen_one_image_url || '',
    see_in_action_screen_two_title_ar: raw.see_in_action_screen_two_title_ar || raw.translations?.ar?.see_in_action_screen_two_title || '',
    see_in_action_screen_two_title_en: raw.see_in_action_screen_two_title_en || raw.translations?.en?.see_in_action_screen_two_title || '',
    see_in_action_screen_two_image_url: raw.see_in_action_screen_two_image_url || '',
    see_in_action_screen_three_title_ar: raw.see_in_action_screen_three_title_ar || raw.translations?.ar?.see_in_action_screen_three_title || '',
    see_in_action_screen_three_title_en: raw.see_in_action_screen_three_title_en || raw.translations?.en?.see_in_action_screen_three_title || '',
    see_in_action_screen_three_image_url: raw.see_in_action_screen_three_image_url || '',
    how_it_works_data: Array.isArray(raw.how_it_works_data) ? raw.how_it_works_data : [],
    why_teams_data: Array.isArray(raw.why_teams_data) ? raw.why_teams_data : [],
    scalability_tiers: Array.isArray(raw.scalability_tiers) ? raw.scalability_tiers : [],
    packages: Array.isArray(raw.packages) ? raw.packages : (Array.isArray(raw.editions) ? raw.editions : []),
  };
}

/**
 * Creates a default Service/Solution entity
 */
export function createSolutionModel(raw = {}) {
  const title = raw.title_ar || raw.translations?.ar?.title || raw.title || '';
  const title_en = raw.title_en || raw.translations?.en?.title || (raw.title !== title ? raw.title : '');
  const headline = raw.headline_ar || raw.translations?.ar?.headline || raw.headline || raw.title_highlight || '';
  const headline_en = raw.headline_en || raw.translations?.en?.headline || raw.title_highlight_en || '';
  const description = raw.description_ar || raw.translations?.ar?.description || raw.description || '';
  const description_en = raw.description_en || raw.translations?.en?.description || '';

  // Problem section
  const prob = raw.problem_section || {};
  const problem_section = {
    badge: prob.badge || 'التحدي والمشكلة',
    title: prob.department_title || prob.title || 'لماذا تفشل الحلول التقليدية؟',
    department_title: prob.department_title || prob.title || 'لماذا تفشل الحلول التقليدية؟',
    subtitle: prob.department_subtitle || prob.subtitle || '',
    department_subtitle: prob.department_subtitle || prob.subtitle || '',
    challenges: Array.isArray(prob.challenges) ? prob.challenges : (Array.isArray(prob.items) ? prob.items : []),
    items: Array.isArray(prob.challenges) ? prob.challenges : (Array.isArray(prob.items) ? prob.items : []),
  };

  // Solve section
  const slv = raw.solve_section || {};
  const solve_section = {
    badge: slv.badge || 'الحل المبتكر',
    title: slv.department_title || slv.title || 'كيف نعيد صياغة الحل؟',
    department_title: slv.department_title || slv.title || 'كيف نعيد صياغة الحل؟',
    subtitle: slv.department_subtitle || slv.subtitle || '',
    department_subtitle: slv.department_subtitle || slv.subtitle || '',
    description: slv.department_description || slv.description || '',
    department_description: slv.department_description || slv.description || '',
    image: slv.image_url || slv.image || '',
    image_url: slv.image_url || slv.image || '',
    ctaText: slv.cta_text || slv.ctaText || slv.cta || '',
    cta_text: slv.cta_text || slv.ctaText || slv.cta || '',
  };

  // Deliver section
  const del = raw.deliver_section || {};
  const deliver_section = {
    badge: del.badge || 'المخرجات ونطاق التسليم',
    title: del.department_title || del.title || 'ما ستحصل عليه بدقة واحترافية',
    department_title: del.department_title || del.title || 'ما ستحصل عليه بدقة واحترافية',
    subtitle: del.department_subtitle || del.subtitle || '',
    department_subtitle: del.department_subtitle || del.subtitle || '',
    exits: Array.isArray(del.exits) ? del.exits : (Array.isArray(del.items) ? del.items : []),
    items: Array.isArray(del.exits) ? del.exits : (Array.isArray(del.items) ? del.items : []),
  };

  // Process / Framework section
  const proc = raw.process_section || {};
  const processSteps = Array.isArray(del.proven_execution_framework) && del.proven_execution_framework.length
    ? del.proven_execution_framework
    : (Array.isArray(raw.proven_execution_framework) && raw.proven_execution_framework.length
      ? raw.proven_execution_framework
      : (Array.isArray(proc.steps) ? proc.steps : (Array.isArray(proc.items) ? proc.items : [])));

  const process_section = {
    badge: proc.badge || 'منهجية التنفيذ',
    title: proc.title || 'مسار عمل هندسي دقيق من 5 مراحل',
    subtitle: proc.subtitle || '',
    steps: processSteps,
    proven_execution_framework: processSteps,
  };

  // Why Choose Us section
  const whyItems = Array.isArray(del.why_choose_us) && del.why_choose_us.length
    ? del.why_choose_us
    : (Array.isArray(raw.why_choose_us) && raw.why_choose_us.length
      ? raw.why_choose_us
      : (Array.isArray(raw.why_section?.items) ? raw.why_section.items : []));

  const why_section = {
    badge: raw.why_section?.badge || 'لماذا BE KITE',
    title: raw.why_section?.title || 'لماذا تختار شراكتنا؟',
    items: whyItems,
    why_choose_us: whyItems,
  };

  const department = raw.department || (raw.category === 'marketing' ? 'Digital Marketing' : (raw.category === 'creative' ? '• Creative Solutions' : 'TechnologySolutions'));
  const category = raw.category || (department.includes('Marketing') ? 'marketing' : (department.includes('Creative') ? 'creative' : 'technology'));

  return {
    id: raw.id || null,
    title,
    title_ar: title,
    title_en,
    headline,
    headline_ar: headline,
    headline_en,
    department,
    title_highlight: headline,
    title_highlight_en: headline_en,
    slug: raw.slug || '',
    category,
    category_name: raw.category_name || (category === 'marketing' ? 'التسويق ونمو العلامات' : (category === 'creative' ? 'الإنتاج الإبداعي والمرئي' : 'الحلول التقنية والبرمجية')),
    category_name_en: raw.category_name_en || (category === 'marketing' ? 'Digital Marketing' : (category === 'creative' ? 'Creative Production' : 'Software Engineering')),
    badge: raw.badge || department || 'ENTERPRISE SOLUTION',
    description,
    description_ar: description,
    description_en,
    hero_image: raw.hero_image_url || raw.hero_image || '',
    hero_image_url: raw.hero_image_url || raw.hero_image || '',
    icon: raw.icon || 'code',
    icon_name: raw.icon_name || 'Code',
    icon_image: raw.icon_image_url || raw.icon_image || '',
    icon_image_url: raw.icon_image_url || raw.icon_image || '',
    technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    capabilities: Array.isArray(raw.capabilities) ? raw.capabilities : [],
    deliverables: Array.isArray(raw.deliverables) ? raw.deliverables : [],
    problem_section,
    solve_section,
    deliver_section,
    process_section,
    why_section,
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true ? 1 : 0) : 1,
    order_index: raw.order_index || 0,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Creates a default Brand Venture entity
 */
export function createBrandModel(raw = {}) {
  const brandName = raw.brand_ar || raw.name_ar || raw.name || raw.title || '';
  const brandNameEn = raw.brand_en || raw.name_en || raw.title_en || '';
  const sub = raw.subtitle_ar || raw.subtitle || raw.tagline || '';
  const subEn = raw.subtitle_en || '';
  const websiteUrl = raw.website_url || (Array.isArray(raw.links) ? raw.links.find(l => (l.label && l.label.includes('موقع')) || (l.label_en && l.label_en.toLowerCase() === 'website'))?.href : '') || '';
  const appleUrl = raw.apple_store_url || raw.app_store_url || (Array.isArray(raw.links) ? raw.links.find(l => (l.label && (l.label.toLowerCase().includes('ios') || l.label.includes('آبل') || l.label.toLowerCase().includes('apple'))) || (l.label_en && l.label_en.toLowerCase() === 'ios'))?.href : '') || '';
  const googleUrl = raw.google_play_url || raw.play_store_url || (Array.isArray(raw.links) ? raw.links.find(l => (l.label && (l.label.toLowerCase().includes('android') || l.label.toLowerCase().includes('google') || l.label.includes('أندرويد') || l.label.includes('جوجل'))) || (l.label_en && l.label_en.toLowerCase() === 'android'))?.href : '') || '';

  return {
    id: raw.id || null,
    name: brandName,
    name_en: brandNameEn,
    title: brandName,
    title_en: brandNameEn,
    brand_ar: brandName,
    brand_en: brandNameEn,
    subtitle: sub,
    subtitle_en: subEn,
    tagline: sub,
    slug: raw.slug || '',
    badge: raw.badge || 'CONSUMER APP',
    badge_en: raw.badge_en || raw.badge || 'CONSUMER APP',
    description: raw.description_ar || raw.description || '',
    description_en: raw.description_en || '',
    sector: raw.sector || 'Digital Ventures',
    ownership: raw.ownership || '100% Be Kite Venture',
    status_of_project: raw.status_of_project || raw.status || (raw.is_coming_soon ? 'In Pipeline' : 'Live Production'),
    categories: Array.isArray(raw.categories) ? raw.categories : (Array.isArray(raw.tags) ? raw.tags : []),
    tags: Array.isArray(raw.tags) ? raw.tags : (Array.isArray(raw.categories) ? raw.categories : ['علامة استهلاكية']),
    tags_en: Array.isArray(raw.tags_en) ? raw.tags_en : ['Consumer Brand'],
    links: Array.isArray(raw.links) && raw.links.length ? raw.links : [
      { label: 'الموقع الرسمي', label_en: 'Website', href: websiteUrl || '#', type: 'primary' },
      { label: 'iOS', label_en: 'iOS', href: appleUrl || '#', type: 'secondary' },
      { label: 'Android (Google Play)', label_en: 'Android', href: googleUrl || '#', type: 'secondary' },
    ],
    website_url: websiteUrl,
    apple_store_url: appleUrl,
    google_play_url: googleUrl,
    image: raw.mockup_image_url || raw.image || raw.cover_image || '',
    cover_image: raw.mockup_image_url || raw.image || raw.cover_image || '',
    logo: raw.logo || raw.logo_url || '',
    logo_url: raw.logo || raw.logo_url || '',
    brand_color: raw.brand_color || raw.brandColor || '#0F172A',
    accent_color: raw.accent_color || raw.accentColor || '#38BDF8',
    layout: (raw.layout || 'image_left').replace('-', '_'),
    is_coming_soon: raw.is_coming_soon !== undefined ? Number(raw.is_coming_soon) : 0,
    pipeline_status: raw.pipeline_status || raw.status_of_project || (raw.is_coming_soon ? 'In Pipeline' : 'Live Production'),
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true || raw.is_active === '1' ? 1 : 0) : 1,
    order_index: raw.order_index || 1,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Creates a default Career / Job Site entity
 */
export function createJobModel(raw = {}) {
  const titleAr = raw.job_title_ar || raw.title || raw.job_title || raw.translations?.ar?.title || raw.translations?.ar?.job_title || '';
  const titleEn = raw.job_title_en || raw.title_en || raw.job_title || raw.translations?.en?.title || raw.translations?.en?.job_title || '';
  const department = raw.departement || raw.department || raw.translations?.ar?.departement || raw.translations?.ar?.department || 'الهندسة والتطوير';
  const departmentEn = raw.department_en || raw.translations?.en?.department || raw.translations?.en?.departement || 'Engineering';
  const location = raw.job_location || raw.location || raw.translations?.ar?.job_location || 'الرياض / عمان — هجين';
  const type = raw.job_type || raw.type || raw.translations?.ar?.job_type || 'دوام كامل / دائم';
  const experience = raw.experience || raw.translations?.ar?.experience || '+3 سنوات خبرة';
  const subtitle = raw.subtitle || raw.translations?.ar?.subtitle || '';
  const description = raw.description || raw.translations?.ar?.description || '';
  const image = raw.job_image_url || raw.image_url || raw.image || raw.heroImage || '';

  let skills = [];
  if (Array.isArray(raw.skills)) {
    skills = raw.skills;
  } else if (typeof raw.skills === 'string') {
    skills = raw.skills.split(',').map(s => s.trim()).filter(Boolean);
  } else if (raw.translations?.ar?.skills) {
    skills = Array.isArray(raw.translations.ar.skills) ? raw.translations.ar.skills : [raw.translations.ar.skills];
  }

  let requirements = [];
  if (Array.isArray(raw.requirements)) {
    requirements = raw.requirements;
  } else if (typeof raw.requirements === 'string') {
    requirements = raw.requirements.split('\n').map(s => s.trim()).filter(Boolean);
  }

  return {
    id: raw.id || null,
    title: titleAr,
    title_en: titleEn,
    job_title_ar: titleAr,
    job_title_en: titleEn,
    department,
    departement: department,
    department_en: departmentEn,
    location,
    job_location: location,
    type,
    job_type: type,
    experience,
    subtitle,
    description,
    slug: raw.slug || '',
    badge: raw.badge || 'JOB OPENING',
    image,
    heroImage: image,
    job_image_url: image,
    skills: skills.length ? skills : ['Vue.js', 'React', 'TypeScript'],
    requirements,
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true || raw.is_active === '1' ? 1 : 0) : 1,
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
    phone: raw.phone || raw.phone_number || '',
    company: raw.company || '',
    service_type: raw.service_type || 'enterprise_pos',
    budget_range: raw.budget_range || '',
    project_description: raw.message || raw.project_description || '',
    message: raw.message || raw.project_description || '',
    preferred_contact_method: raw.preferred_contact_method || 'whatsapp',
    source_url: raw.source_url || '',
    status: raw.status || 'Contacted',
    notes: raw.admin_notes || raw.notes || '',
    admin_notes: raw.admin_notes || raw.notes || '',
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}

/**
 * Creates a default Strategic Technology Partner entity
 */
export function createPartnerModel(raw = {}) {
  let features = [];
  if (Array.isArray(raw.features)) {
    features = raw.features;
  } else if (typeof raw.features === 'string') {
    features = raw.features.split(',').map(s => s.trim()).filter(Boolean);
  }

  let links = [];
  if (Array.isArray(raw.links) && raw.links.length) {
    links = raw.links;
  } else {
    if (raw.google_play_url) links.push({ label: 'Google Play Console', href: raw.google_play_url, type: 'primary' });
    if (raw.apple_store_url) links.push({ label: 'App Store Connect', href: raw.apple_store_url, type: 'primary' });
    if (raw.website_url) links.push({ label: 'البوابة الرسمية', href: raw.website_url, type: 'secondary' });
  }

  return {
    id: raw.id || null,
    name: raw.name || raw.partner_name || '',
    name_ar: raw.name_ar || raw.partner_name_ar || raw.name || '',
    subtitle: raw.subtitle || '',
    badge: raw.badge || 'شريك معتمد',
    tier: raw.tier || 'Technology Partner',
    category: raw.category || 'cloud',
    brand_color: raw.brand_color || '#2563eb',
    accent_color: raw.accent_color || '#3b82f6',
    logoType: raw.logoType || raw.logo_type || 'custom',
    logo_url: raw.logo_url || raw.image || '',
    image: raw.logo_url || raw.image || '',
    description: raw.description || raw.description_ar || '',
    description_ar: raw.description_ar || raw.description || '',
    description_en: raw.description_en || '',
    features: features.length ? features : ['تكامل الأنظمة السحابية', 'أمان عالي وامتثال دولي'],
    links,
    google_play_url: raw.google_play_url || '',
    apple_store_url: raw.apple_store_url || '',
    website_url: raw.website_url || '',
    is_active: raw.is_active !== undefined ? (raw.is_active === 1 || raw.is_active === true || raw.is_active === '1' ? 1 : 0) : 1,
    created_at: raw.created_at || new Date().toISOString().split('T')[0],
  };
}
