/**
 * Mock Datasets for Be Kite Admin CMS & Portfolio Platform
 * Synchronized with Be Kite Clean Architecture Specifications (2026)
 */

export const initialMockData = {
  admin: {
    id: 1,
    name: 'مدير النظام',
    name_en: 'System Administrator',
    email: 'admin@bekite.com',
    role: 'super_admin',
    role_name: 'مدير عام النظام',
    permissions: ['all'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2025-01-01',
  },

  // ===== Analytics & KPIs =====
  statistics: {
    summary: {
      total_projects: 4,
      projects_change: 25.0,
      total_products: 6,
      products_change: 50.0,
      total_solutions: 9,
      solutions_change: 12.5,
      total_brands: 2,
      brands_change: 100.0,
      total_inquiries: 148,
      inquiries_change: 32.4,
      today_inquiries: 8,
      today_inquiries_change: 14.2,
      conversion_rate: 68.5,
      conversion_rate_change: 8.7,
      active_pipeline_value: 125000,
      pipeline_change: 18.2,
    },
    inquiries_by_status: {
      new: 24,
      contacted: 45,
      in_progress: 38,
      converted: 32,
      archived: 9,
    },
    inquiries_by_service: {
      technology: 54,
      products: 38,
      marketing: 32,
      creative: 24,
    },
    monthly_inquiries: [
      { month: 'يناير', leads: 18, converted: 12 },
      { month: 'فبراير', leads: 22, converted: 15 },
      { month: 'مارس', leads: 28, converted: 19 },
      { month: 'أبريل', leads: 34, converted: 24 },
      { month: 'مايو', leads: 40, converted: 28 },
      { month: 'يونيو', leads: 48, converted: 34 },
    ],
    daily_traffic: [
      { day: 'السبت', visitors: 1420, views: 3890 },
      { day: 'الأحد', visitors: 1850, views: 5120 },
      { day: 'الإثنين', visitors: 2100, views: 6300 },
      { day: 'الثلاثاء', visitors: 2450, views: 7200 },
      { day: 'الأربعاء', visitors: 2200, views: 6450 },
      { day: 'الخميس', visitors: 2900, views: 8600 },
      { day: 'الجمعة', visitors: 1650, views: 4200 },
    ],
  },

  // ===== Portfolio Projects Categories =====
  projectCategories: [
    { id: 1, slug: 'websites', name: 'مواقع إلكترونية', name_en: 'Websites', is_active: 1, count: 8 },
    { id: 2, slug: 'mobile', name: 'تطبيقات الهاتف', name_en: 'Mobile', is_active: 1, count: 6 },
    { id: 3, slug: 'ecommerce', name: 'تجارة إلكترونية', name_en: 'E-Commerce', is_active: 1, count: 5 },
    { id: 4, slug: 'digital-marketing', name: 'تسويق رقمي', name_en: 'Digital Marketing', is_active: 1, count: 5 },
    { id: 5, slug: 'branding', name: 'هوية بصرية', name_en: 'Branding', is_active: 1, count: 4 },
    { id: 6, slug: 'customized-systems', name: 'أنظمة مخصصة', name_en: 'Customized Systems', is_active: 1, count: 7 },
    { id: 7, slug: 'saas', name: 'برمجيات سحابية', name_en: 'SaaS', is_active: 1, count: 3 },
  ],

  // ===== Be Kite 4 Portfolio Projects (With Multi-Image Social Media) =====
  projects: [
    {
        "id": 1,
        "slug": "iris-flowers",
        "title": "Iris Flowers",
        "title_en": "Iris Flowers",
        "client_name": "Iris Flowers Group",
        "location": "عمان، الأردن",
        "location_en": "Amman, Jordan",
        "year": "2025 - 2026",
        "badge": "الهوية والتجارة الإلكترونية",
        "badge_en": "Brand & E-Commerce",
        "description": "تحول رقمي شامل لـ Iris Flowers يشمل الهوية البصرية ومنصة التجارة الإلكترونية وتطبيقات الهاتف الذكية وإدارة الحملات الإعلانية والتسويق الرقمي.",
        "description_en": "A complete digital transformation for Iris Flowers, from visual identity and e-commerce to mobile apps and full performance marketing.",
        "image": "/images/projects/iris_website_showcase.jpg",
        "card_image": "/images/projects/iris_website_showcase.jpg",
        "web_image": "/images/projects/iris_website_showcase.jpg",
        "website_url": "https://irisflowers.net/",
        "live_website_url": "https://irisflowers.net/",
        "has_mobile_app": true,
        "mobile_image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
        "ios_url": "https://apps.apple.com/app/iris-flowers/id123456789",
        "android_url": "https://play.google.com/store/apps/details?id=com.bekite.irisflowers",
        "social_media_images": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80",
                "title": "أصدق تعبير - باقات الورد الفاخرة"
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
                "title": "ذوق رفيع - زهور طبيعية منتقاة"
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&auto=format&fit=crop&q=80",
                "title": "لكل مناسبة - إهداءات استثنائية"
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80",
                "title": "تصل في وقتها - توصيل سريع ودقيق"
            }
        ],
        "social_links": {
            "facebook": "https://facebook.com/irisflowersjo",
            "instagram": "https://instagram.com/irisflowersjo",
            "twitter": "https://x.com/irisflowersjo",
            "linkedin": "https://linkedin.com/company/irisflowers",
            "tiktok": "https://tiktok.com/@irisflowersjo",
            "youtube": "https://youtube.com/@irisflowers"
        },
        "branding_images": [
            {
                "id": 1,
                "title": "Gold Foil Monogram Emblem",
                "image": "/images/projects/iris_brand_1.png"
            },
            {
                "id": 2,
                "title": "VIP Badges & Event Lanyards",
                "image": "/images/projects/iris_brand_2.png"
            },
            {
                "id": 3,
                "title": "Embossed Textured Stationery",
                "image": "/images/projects/iris_brand_3.png"
            },
            {
                "id": 4,
                "title": "Brand Merchandise & Apparel",
                "image": "/images/projects/iris_brand_4.png"
            }
        ],
        "branding_pdf_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "branding_pdf_name": "Iris_Flowers_Brand_Guidelines_2026.pdf",
        "logo": "/images/projects/irs.jpg",
        "accent_color": "#9333ea",
        "filter_categories": [
            "websites",
            "ecommerce",
            "branding",
            "digital-marketing",
            "mobile"
        ],
        "tags": [
            "الهوية البصرية",
            "تجارة إلكترونية",
            "تسويق رقمي",
            "تطبيق هاتف"
        ],
        "is_active": 1,
        "order_index": 1,
        "stats": [
            {
                "label": "نمو المبيعات",
                "label_en": "Sales Growth",
                "value": "+240%"
            },
            {
                "label": "تحميلات التطبيق",
                "label_en": "App Downloads",
                "value": "45K+"
            },
            {
                "label": "معدل التحويل",
                "label_en": "Conversion Rate",
                "value": "4.8%"
            }
        ],
        "deliverables": [
            "Web Platform",
            "iOS & Android App",
            "Brand Identity",
            "Social Media Management",
            "Performance Marketing"
        ],
        "created_at": "2026-01-15"
    },
    {
        "id": 2,
        "slug": "al-mzon-schools",
        "title": "مدارس المزن AL-Mzon",
        "title_en": "AL-Mzon Schools",
        "client_name": "Al-Mzon Educational Academy",
        "location": "عمان، الأردن",
        "location_en": "Amman, Jordan",
        "year": "2025",
        "badge": "موقع تعليمي",
        "badge_en": "Education Website",
        "description": "حضور رقمي متطور لمدارس المزن يجمع بين منصة ويب تفاعلية وإدارة احترافية للحملات ومنصات التواصل الاجتماعي ونظام القبول والتسجيل.",
        "description_en": "A modern digital presence for AL-Mzon Schools, combining a professional web platform with dynamic social media campaigns and admissions portal.",
        "image": "/images/projects/al-mzon-schools.png",
        "card_image": "/images/projects/al-mzon-schools.png",
        "web_image": "/images/projects/al-mzon-schools.png",
        "website_url": "https://almzon-schools.edu.jo",
        "live_website_url": "https://almzon-schools.edu.jo",
        "has_mobile_app": true,
        "mobile_image": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80",
        "ios_url": "https://apps.apple.com/app/almzon/id987654321",
        "android_url": "https://play.google.com/store/apps/details?id=jo.edu.almzon",
        "social_media_images": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
                "title": "فعاليات اليوم المفتوح والتسجيل"
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
                "title": "المختبرات والابتكار العلمي للطلاب"
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
                "title": "تكريم أوائل الطلبة والمتميزين"
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80",
                "title": "بيئة تعليمية تفاعلية حديثة"
            }
        ],
        "social_links": {
            "facebook": "https://facebook.com/almzonschools",
            "instagram": "https://instagram.com/almzonschools",
            "twitter": "https://x.com/almzonschools",
            "linkedin": "https://linkedin.com/school/almzonschools",
            "tiktok": "https://tiktok.com/@almzon",
            "youtube": "https://youtube.com/@almzon"
        },
        "branding_images": [
            {
                "id": 1,
                "title": "Al-Mzon Official Logo & Color Palette",
                "image": "/images/projects/al-mzon-schools.png"
            }
        ],
        "branding_pdf_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "branding_pdf_name": "Al_Mzon_Brand_Identity_Guide.pdf",
        "logo": "/images/projects/al-mzon-schools.svg",
        "accent_color": "#0284c7",
        "filter_categories": [
            "websites",
            "digital-marketing",
            "customized-systems",
            "mobile"
        ],
        "tags": [
            "موقع إلكتروني",
            "تسويق رقمي",
            "استشارات",
            "تطبيق هاتف"
        ],
        "is_active": 1,
        "order_index": 2,
        "stats": [
            {
                "label": "الطلاب المسجلين",
                "label_en": "Registered Students",
                "value": "2,500+"
            },
            {
                "label": "نمو التفاعل",
                "label_en": "Engagement Boost",
                "value": "+180%"
            }
        ],
        "deliverables": [
            "Responsive Web Portal",
            "Student Registration CMS",
            "Social Media Strategy",
            "Mobile App"
        ],
        "created_at": "2026-01-20"
    },
    {
        "id": 3,
        "slug": "kudos-events",
        "title": "Kudos Events",
        "title_en": "Kudos Events",
        "client_name": "Kudos Events Management LLC",
        "location": "دبي، الإمارات",
        "location_en": "Dubai, UAE",
        "year": "2025",
        "badge": "فعاليات ومؤتمرات",
        "badge_en": "Events & Conferences",
        "description": "منصة رقمية رائدة لإدارة وتنظيم المؤتمرات والمعارض الكبرى، تشمل هوية فاخرة وأنظمة حجز تذاكر وتغطية سوشيال ميديا مباشرة.",
        "description_en": "An experiential events management platform featuring high-end branding, digital ticketing, and live social media production.",
        "image": "/images/projects/kudos-events.png",
        "card_image": "/images/projects/kudos-events.png",
        "web_image": "/images/projects/kudos-events.png",
        "website_url": "https://kudos-events.ae",
        "live_website_url": "https://kudos-events.ae",
        "has_mobile_app": false,
        "social_media_images": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
                "title": "تغطية المؤتمرات والقمم العالمية"
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
                "title": "إضاءة المسارح والإنتاج الفني"
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80",
                "title": "تنظيم حفلات الإطلاق وجوائز التميز"
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
                "title": "لقطات حصرية خلف الكواليس"
            }
        ],
        "social_links": {
            "facebook": "https://facebook.com/kudosevents",
            "instagram": "https://instagram.com/kudosevents",
            "twitter": "https://x.com/kudosevents",
            "linkedin": "https://linkedin.com/company/kudosevents",
            "tiktok": "https://tiktok.com/@kudosevents",
            "youtube": "https://youtube.com/@kudosevents"
        },
        "branding_images": [
            {
                "id": 1,
                "title": "Kudos Brand Identity & Event Guide",
                "image": "/images/projects/kudos-events.png"
            }
        ],
        "branding_pdf_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "branding_pdf_name": "Kudos_Events_Brand_Guidelines.pdf",
        "logo": "/images/projects/kudos-events.svg",
        "accent_color": "#d97706",
        "filter_categories": [
            "websites",
            "branding",
            "digital-marketing"
        ],
        "tags": [
            "تنظيم فعاليات",
            "هوية بصرية",
            "تسويق رقمي"
        ],
        "is_active": 1,
        "order_index": 3,
        "stats": [
            {
                "label": "حضور الفعاليات",
                "label_en": "Event Attendees",
                "value": "50K+"
            },
            {
                "label": "تغطية إعلامية",
                "label_en": "Media Impressions",
                "value": "2.4M"
            }
        ],
        "deliverables": [
            "Interactive Web Platform",
            "VIP Guest Management",
            "Social Media Live Coverage"
        ],
        "created_at": "2026-02-05"
    },
    {
        "id": 4,
        "slug": "birma-water",
        "title": "مياه بيرما Birma",
        "title_en": "Birma Water",
        "client_name": "Birma Bottled Water Co.",
        "location": "الرياض، السعودية",
        "location_en": "Riyadh, Saudi Arabia",
        "year": "2025 - 2026",
        "badge": "هوية وتجارة إلكترونية",
        "badge_en": "Brand & E-Commerce",
        "description": "هوية تجارية عصرية ومتجر إلكتروني مع نظام توصيل اشتراكات المياه للمنازل والشركات وحملات تسويق رقمي عبر منصات التواصل.",
        "description_en": "A modern consumer brand with e-commerce subscriptions, route dispatch optimization, and high-impact social media creative.",
        "image": "/images/projects/birma-water.png",
        "card_image": "/images/projects/birma-water.png",
        "web_image": "/images/projects/birma-water.png",
        "website_url": "https://birmawater.com",
        "live_website_url": "https://birmawater.com",
        "has_mobile_app": true,
        "mobile_image": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&auto=format&fit=crop&q=80",
        "ios_url": "https://apps.apple.com/app/birma-water/id555666777",
        "android_url": "https://play.google.com/store/apps/details?id=com.birma.water",
        "social_media_images": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80",
                "title": "نقاء الطبيعة في كل قطرة"
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=800&auto=format&fit=crop&q=80",
                "title": "حملة الانتعاش والصحة اليومية"
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=800&auto=format&fit=crop&q=80",
                "title": "عروض الاشتراكات للمنازل والشركات"
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=800&auto=format&fit=crop&q=80",
                "title": "خدمة التوصيل السريع لجميع المناطق"
            }
        ],
        "social_links": {
            "facebook": "https://facebook.com/birmawater",
            "instagram": "https://instagram.com/birmawater",
            "twitter": "https://x.com/birmawater",
            "linkedin": "https://linkedin.com/company/birmawater",
            "tiktok": "https://tiktok.com/@birmawater",
            "youtube": "https://youtube.com/@birmawater"
        },
        "branding_images": [
            {
                "id": 1,
                "title": "Birma Water Bottle Label & Packaging Design",
                "image": "/images/projects/birma-water.png"
            }
        ],
        "branding_pdf_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "branding_pdf_name": "Birma_Brand_Packaging_Guidelines.pdf",
        "logo": "/images/projects/birma-water.svg",
        "accent_color": "#0d9488",
        "filter_categories": [
            "ecommerce",
            "branding",
            "digital-marketing",
            "mobile"
        ],
        "tags": [
            "تجارة إلكترونية",
            "هوية بصرية",
            "تسويق رقمي",
            "تطبيق هاتف"
        ],
        "is_active": 1,
        "order_index": 4,
        "stats": [
            {
                "label": "طلبات التوصيل",
                "label_en": "Monthly Deliveries",
                "value": "120K+"
            },
            {
                "label": "العملاء المشتركين",
                "label_en": "Active Subscribers",
                "value": "18K+"
            }
        ],
        "deliverables": [
            "E-Commerce Web Portal",
            "Mobile App for iOS & Android",
            "Brand Identity & Packaging",
            "Social Media Campaigns"
        ],
        "created_at": "2026-02-15"
    }
],

  // ===== Product Categories (Digital Products) =====
  productCategories: [
    { id: 1, slug: 'ecommerce', name: 'التجارة الإلكترونية والمنصات', name_en: 'E-Commerce & Platforms', is_active: 1 },
    { id: 2, slug: 'education', name: 'التعليم والتدريب', name_en: 'Education', is_active: 1 },
    { id: 3, slug: 'digital-presence', name: 'التواجد الرقمي والخدمات', name_en: 'Digital Presence', is_active: 1 },
  ],

  // ===== Be Kite Digital Products =====
  products: [
    {
      id: 1,
      slug: 'tijara',
      name: 'تجارة | Tijara',
      name_en: 'Tijara',
      subtitle: 'النظام الذكي لإدارة المتاجر والتجارة الإلكترونية المتكاملة',
      subtitle_en: 'The Smart Omnichannel E-Commerce & Retail Platform',
      category: 'ecommerce',
      category_id: 1,
      badge: 'إدارة التجارة الإلكترونية والـ POS',
      badge_en: 'E-COMMERCE & RETAIL ENGINE',
      description: 'منصة موحدة وشاملة مصممة لإدارة كافة عمليات المتجر الإلكتروني ونقاط البيع — المنتجات، الطلبات، المخزون المتعدد، وعلاقات العملاء من خلال لوحة تحكم ذكية واحدة مع دعم التوسع للمؤسسات الكبرى.',
      description_en: 'An all-in-one platform built to manage your online store and retail operations — multi-warehouse inventory, instant order fulfillment, omnichannel POS, and customer CRM in a unified high-performance dashboard.',
      features: ['إدارة المنتجات والمخازن المتعددة', 'معالجة وتتبع الطلبات اللحظي', 'نقاط البيع السحابية Cloud POS', 'بوابات الدفع وشركات الشحن'],
      features_en: ['Multi-warehouse Stock Tracking', 'Real-time Order Orchestration', 'Cloud Omnichannel POS', 'Global Payment & Shipping Integrations'],
      layout: 'wide-left',
      accent_color: '#9333ea',
      image: 'https://images.unsplash.com/photo-1556742049-0a67e557b683?w=1200&q=80',
      laptop_mockup: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      is_active: 1,
      is_featured: 1,
      order_index: 1,
      demo_url: 'https://demo.bekite.com/tijara',
      
      // 1. Deep Case Study Sections matching Bekite Website 1:1
      overview: {
        pill: 'نظرة عامة',
        pill_en: 'OVERVIEW',
        title: 'ما هو نظام تجارة؟',
        title_en: 'What Is Tijara?',
        p1: 'تجارة هو نظام سحابي متطور لتشغيل المتاجر الإلكترونية الضخمة والمتوسطة، يجمع بين إدارة المخزون متعدد الفروع، مزامنة نقاط البيع، والتحليلات التنبؤية للمبيعات في بيئة برمجية واحدة متكاملة.',
        p1_en: 'Tijara is a next-generation enterprise commerce platform built for high-growth merchants. It unifies multi-store catalog management, inventory routing, point-of-sale sync, and customer lifetime value analytics in one robust environment.',
        p2: 'مبني على بنية سحابية حديثة تضمن سرعة تحميل فائقة، وجاهزية بنسبة 99.99%، وربطاً سلساً مع بوابات الدفع الإلكتروني وشركات الشحن اللوجستي في المنطقة.',
        p2_en: 'Built on a cloud-native architecture, Tijara delivers lightning-fast checkout speeds, 99.99% uptime, and frictionless integrations with global payment gateways and regional shipping carriers.',
        image: '/images/products/tijara_overview.png'
      },

      built_for: {
        pill: 'لمن صُمم النظام',
        pill_en: 'WHO IS IT FOR',
        title: 'صُمم خصيصاً للشركات التي تبيع عبر الإنترنت',
        title_en: 'Built for Businesses That Sell Online',
        subtitle: 'مسارات عمل مخصصة لكل دور ومسؤولية في منظومة التجارة الإلكترونية الخاصة بك.',
        subtitle_en: 'Tailored workflows for every role across your e-commerce organization.',
        items: [
          {
            icon: 'shopping-cart',
            title: 'المتاجر الإلكترونية',
            title_en: 'Online Retailers',
            desc: 'توسيع مبيعات متجرك متعدد الأقسام مع إدارة مرنة للمنتجات وفلترة سريعة وتجربة شراء استثنائية.',
            desc_en: 'Scale your multi-category online store with high-velocity product listings, smart filters, and instant checkout.'
          },
          {
            icon: 'truck',
            title: 'فرق العمليات والتشغيل',
            title_en: 'Operations Teams',
            desc: 'أتمتة تجهيز الطلبات، بوالص الشحن، التوجيه التلقائي للمناديب، وإدارة المرتجعات بسهولة.',
            desc_en: 'Streamline order fulfillment, warehouse picking slips, automated courier dispatch, and return workflows.'
          },
          {
            icon: 'briefcase',
            title: 'أصحاب الأعمال والمدراء',
            title_en: 'Business Owners',
            desc: 'رؤية تنفيذية كاملة ولحظية للمبيعات اليومية، هوامش الأرباح، وصحة المخزون في كافة الفروع.',
            desc_en: 'Gain complete executive visibility over daily sales revenue, gross margins, and inventory health in real time.'
          },
          {
            icon: 'target',
            title: 'فرق التسويق والنمو',
            title_en: 'Marketing Teams',
            desc: 'إطلاق حملات الخصومات، كوبونات التخفيض الديناميكية، وبرامج ولاء العملاء لزيادة تكرار الشراء.',
            desc_en: 'Launch targeted promo campaigns, dynamic discount codes, coupon engine, and customer retention programs.'
          }
        ]
      },

      what_it_does: {
        pill: 'المزايا والقدرات',
        pill_en: 'KEY CAPABILITIES',
        title: 'ما الذي يقدمه نظام تجارة؟',
        title_en: 'What It Does',
        subtitle: 'كل ما تحتاجه لإدارة عمليات البيع والتجارة من البداية إلى النهاية.',
        subtitle_en: 'Everything you need to run end-to-end retail operations.',
        items: [
          {
            icon: 'layers',
            title: 'إدارة الكتالوج والمنتجات',
            title_en: 'Product Management',
            desc: 'توحيد المنتجات والخيارات والأسعار عبر الموقع والتطبيق ومنصات البيع المتعددة.',
            desc_en: 'Centralize catalog across web, mobile, and marketplaces with rich variants, pricing rules, and bundles.'
          },
          {
            icon: 'file-check',
            title: 'معالجة وتجهيز الطلبات',
            title_en: 'Order Processing',
            desc: 'أتمتة دورة الطلب من الدفع وحتى التسليم مع إصدار الفواتير وبوالص الشحن آلياً.',
            desc_en: 'Automate order routing from placement to delivery with unified packing slips and invoice generation.'
          },
          {
            icon: 'box',
            title: 'مزامنة المخزون اللحظية',
            title_en: 'Live Inventory Sync',
            desc: 'حجز تلقائي للكميات عبر كافة المستودعات لمنع نفاد المخزون وتسهيل إعادة التوريد.',
            desc_en: 'Real-time multi-warehouse stock reservation to prevent overselling and streamline restocking.'
          },
          {
            icon: 'users',
            title: 'إدارة علاقات العملاء CRM',
            title_en: 'Customer Management',
            desc: 'ملفات تفصيلية للعملاء مع سجل المشتريات، شرائح العملاء، وبرامج النقاط والمكافآت.',
            desc_en: 'Comprehensive customer profiles with purchase history, loyalty tiers, and automated segmentation.'
          },
          {
            icon: 'bar-chart',
            title: 'التقارير والتحليلات المتقدمة',
            title_en: 'Analytics & Reporting',
            desc: 'متابعة حركة المبيعات، توقعات الإيرادات، معدلات الإرجاع، وتقارير التدقيق المالي.',
            desc_en: 'Real-time sales velocity, revenue forecasts, return rates, and exportable financial audit sheets.'
          },
          {
            icon: 'globe',
            title: 'الربط متعدد القنوات Omnichannel',
            title_en: 'Multi-Channel Support',
            desc: 'مزامنة مبيعات الفروع ونقاط البيع POS مع قنوات البيع الإلكتروني في قاعدة بيانات واحدة.',
            desc_en: 'Synchronize offline point-of-sale, social commerce storefronts, and third-party delivery channels.'
          }
        ]
      },

      // 2. See It in Action
      action_main_image: '/images/products/tijara_action_main.png',
      action_screens: [
        { id: 1, image: '/images/products/tijara_action_1.png', title: 'Order Fulfillment Table', title_ar: 'جدول تجهيز الطلبات' },
        { id: 2, image: '/images/products/tijara_action_2.png', title: 'Multi-Warehouse Inventory', title_ar: 'المخزون متعدد المستودعات' },
        { id: 3, image: '/images/products/tijara_action_3.png', title: 'Live Analytics & Retention', title_ar: 'تحليلات المبيعات ونمو العملاء' }
      ],

      // 3. How It Works
      how_it_works: {
        pill: 'كيف يعمل',
        pill_en: 'HOW IT WORKS',
        title: 'سهل في البداية، قوي وقابل للتوسع',
        title_en: 'Simple to Start, Powerful to Scale',
        subtitle: 'من الإعداد الأولي وحتى التوسع متعدد الفروع في أربع خطوات بسيطة.',
        subtitle_en: 'From initial setup to multi-branch expansion in four simple steps.',
        steps: [
          {
            num: '01',
            title: 'الإعداد والتهيئة',
            title_en: 'Setup',
            desc: 'تجهيز المتجر، استيراد المنتجات، وربط بوابات الدفع الإلكتروني.',
            desc_en: 'Configure your store, import SKUs, and connect your payment gateways.'
          },
          {
            num: '02',
            title: 'الإدارة والتشغيل',
            title_en: 'Manage',
            desc: 'استقبال ومعالجة الطلبات ومزامنة المخزون عبر جميع قنوات البيع.',
            desc_en: 'Process incoming orders and synchronize inventory across all sales channels.'
          },
          {
            num: '03',
            title: 'الأتمتة الذكية',
            title_en: 'Automate',
            desc: 'دع القواعد الذكية تتولى إصدار الفواتير والشحن وتنبيهات العملاء.',
            desc_en: 'Let smart rules handle shipping dispatch, invoices, and customer notifications.'
          },
          {
            num: '04',
            title: 'النمو والتوسع',
            title_en: 'Grow',
            desc: 'استفد من التحليلات التنبؤية لتوسيع الفروع والوصول إلى أسواق جديدة.',
            desc_en: 'Leverage predictive insights to expand catalog, branches, and regional reach.'
          }
        ]
      },

      // 4. Why Choose Tijara
      why_choose: {
        pill: 'المزايا التنافسية',
        pill_en: 'ADVANTAGES',
        title: 'لماذا تختار الشركات نظام تجارة؟',
        title_en: 'Why Teams Choose Tijara',
        subtitle: 'هندسة برمجية متطورة صُممت للأداء العالي والموثوقية والنمو السريع.',
        subtitle_en: 'Engineered for performance, reliability, and growth.',
        items: [
          {
            title: 'إطلاق سريع',
            title_en: 'Fast Setup',
            desc: 'ابدأ العمل خلال أيام معدودة عبر أدوات التهيئة الذكية ونقل البيانات التلقائي.',
            desc_en: 'Go live in days with our intuitive onboarding wizards and zero-code migration tools.'
          },
          {
            title: 'توسع حقيقي',
            title_en: 'True Scalability',
            desc: 'قدرة على معالجة ملايين المعاملات شهرياً بدون أي بطء في سرعة الدفع والشراء.',
            desc_en: 'Handles millions of monthly transactions without degradation in checkout performance.'
          },
          {
            title: 'أمان وخصوصية البيانات',
            title_en: 'National Privacy',
            desc: 'تشفير بمستوى البنوك واستضافة بيانات محلية متوافقة مع الأنظمة واللوائح.',
            desc_en: 'Enterprise-grade encryption and local data residency adhering to regional compliance.'
          },
          {
            title: 'دعم فني وضمان 24/7',
            title_en: 'Dedicated 24/7 SLA',
            desc: 'دعم هندسي مباشر مع ضمان استقرار وجاهزية النظام بنسبة 99.99%.',
            desc_en: 'Direct engineering support and guaranteed 99.99% system availability.'
          }
        ]
      },

      // 5. Bottom CTA
      bottom_cta: {
        title: 'جاهز لاستكشاف نظام تجارة لمتجرك؟',
        title_en: 'Ready to Explore Tijara?',
        description: 'تواصل مع خبرائنا واحصل على عرض توضيحي مباشر ومخصص لعمليات متجرك الإلكتروني.',
        description_en: 'Talk to our product specialists and get a tailored live demo for your e-commerce operations.',
        button_text: 'طلب عرض توضيحي',
        button_href: '/contact?subject=Tijara+Demo'
      },

      // Included Modules list
      modules: [
        {
          icon: 'package',
          title: 'إدارة المنتجات والمخزون المتقدم (Inventory Control)',
          title_en: 'Advanced Product Catalog & Multi-Warehouse',
          description: 'إدارة شاملة للمتغيرات (الألوان والمقاسات)، باركود المنتجات، تنبيهات انخفاض المخزون، والتحويل بين المستودعات.',
          description_en: 'Complete variant management, SKU barcode generation, low stock alerts, and multi-location transfers.'
        },
        {
          icon: 'shopping-cart',
          title: 'معالجة وتتبع الطلبات اللحظية (Order Orchestration)',
          title_en: 'Real-time Order Management & Dispatch',
          description: 'مسار آلي لتجهيز الشحنات، طباعة بوالص الشحن، وإرسال تحديثات تتبع الطلب للعميل عبر SMS و WhatsApp.',
          description_en: 'Automated fulfillment workflow, airway bill printing, and live tracking updates via SMS and WhatsApp.'
        },
        {
          icon: 'credit-card',
          title: 'بوابات الدفع الإلكتروني ونقاط البيع (Omnichannel POS)',
          title_en: 'Payment Gateways & Cloud POS',
          description: 'تكامل مباشر مع كبرى بوابات الدفع (Visa, Mastercard, Apple Pay, CliQ) مع نظام كاشير سريع للفروع.',
          description_en: 'Seamless integration with Visa, Apple Pay, local debit rails, and blazing-fast in-store cashier POS.'
        },
        {
          icon: 'truck',
          title: 'الربط مع شركات الشحن واللوجستيات (Shipping Hub)',
          title_en: 'Automated Courier & Logistics Gateway',
          description: 'ربط مباشر عبر API مع أكثر من 15 شركة شحن محلية وإقليمية لتسعير وتوليد البوالص تلقائياً.',
          description_en: 'Direct API integrations with 15+ couriers for instant rate calculation and automated dispatch.'
        },
        {
          icon: 'bar-chart',
          title: 'محرك التحليلات والذكاء التجاري (AI Analytics)',
          title_en: 'AI Sales Analytics & Performance Insights',
          description: 'لوحات بيانية حية لحجم المبيعات، أفضل المنتجات أداءً، متوسط قيمة السلة، وتوقعات الطلب الموسمية.',
          description_en: 'Live executive dashboards tracking GMV, top SKUs, customer LTV, and predictive seasonal demand.'
        },
        {
          icon: 'users',
          title: 'برامج الولاء وإدارة العملاء (CRM & Loyalty)',
          title_en: 'Customer CRM & Loyalty Points System',
          description: 'نظام كوبونات ذكي، نقاط مكافآت للمشتريات المتكررة، وتقسيم العملاء حسب القوة الشرائية.',
          description_en: 'Automated discount coupons, tiered rewards program, and RFM customer segmentation.'
        }
      ],

      // 2. See it in action (Screenshots Gallery)
      gallery: [
        {
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80',
          title: 'لوحة التحكم الرئيسية وإحصائيات المبيعات اللحظية',
          device: 'Desktop Dashboard'
        },
        {
          image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1000&q=80',
          title: 'واجهة نقاط البيع والكاشير السريع (POS Terminal)',
          device: 'POS & Tablet'
        },
        {
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&q=80',
          title: 'تطبيق التاجر لإدارة الطلبات عبر الهاتف الذكي',
          device: 'Mobile App'
        },
        {
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=80',
          title: 'نظام إدارة المستودعات والباركود الذكي',
          device: 'Warehouse Barcode'
        }
      ],

      // 3. Scalable from Startup to Enterprise
      scalability: [
        {
          tier: 'startup',
          title: 'الشركات الناشئة (Startup Scale)',
          title_en: 'Startup Tier',
          highlight: 'إطلاق متجر متكامل في غضون 48 ساعة',
          specs: 'حتى 10,000 طلب شهرياً، متجر إلكتروني + كاشير فرع واحد، نطاق مخصص، دعم فني قياسي.',
          specs_en: 'Up to 10k orders/mo, 1 branch POS, custom domain, standard support.'
        },
        {
          tier: 'growth',
          title: 'الشركات المتنامية (Growth Scale)',
          title_en: 'Growth Tier',
          highlight: 'إدارة سلاسل الفروع المتعددة والمبيعات المكثفة',
          specs: 'حتى 100,000 طلب شهرياً، مستودعات متعددة، نقاط بيع غير محدودة، تكاملات WhatsApp و API متقدم.',
          specs_en: 'Up to 100k orders/mo, unlimited POS registers, multi-warehouse, WhatsApp notifications.'
        },
        {
          tier: 'enterprise',
          title: 'المؤسسات والشركات الكبرى (Enterprise Scale)',
          title_en: 'Enterprise Tier',
          highlight: 'بنية تحتية سحابية مخصصة ومعدل استجابة فائق السرعة',
          specs: 'طلبات وحجم ترافيك غير محدود، SLA 99.99%، ربط مخصص مع ERP (SAP/Oracle/Odoo)، مهندس دعم مخصص 24/7.',
          specs_en: 'Unlimited throughput, 99.99% SLA, custom ERP connectors (SAP/Odoo), dedicated engineer 24/7.'
        }
      ],

      // 4. Brands & Industry Editions
      editions: [
        {
          name: 'تجارة للأزياء والتجزئة (Retail & Fashion Edition)',
          name_en: 'Tijara Fashion & Retail',
          icon: 'shopping-bag',
          description: 'مصفوفة متكاملة للمقاسات والألوان، طباعة الباركود، وتكامل التبديل والاسترجاع في الفروع.'
        },
        {
          name: 'تجارة للمطاعم والمقاهي (Food & Beverage POS)',
          name_en: 'Tijara F&B Edition',
          icon: 'utensils',
          description: 'شاشات المطبخ KDS، طلبات الطاولات عبر QR، وتكامل سريع مع تطبيقات التوصيل.'
        },
        {
          name: 'تجارة للبيع بالجملة والشركات (B2B Wholesale)',
          name_en: 'Tijara B2B Portal',
          icon: 'briefcase',
          description: 'بوابة طلبات الجملة للشركات، قوائم أسعار خاصة بالعملاء، وائتمان الفواتير الآجلة.'
        },
        {
          name: 'تجارة للإلكترونيات والأجهزة (Electronics & Gadgets)',
          name_en: 'Tijara Electronics',
          icon: 'cpu',
          description: 'تتبع السيريال نمبر والأرقام التسلسلية لكل قطعة وإدارة شهادات الضمان الرقمية.'
        }
      ],

      // 5. Powered Projects built on this product
      related_projects: ['iris-flowers'],

      stats: { active_stores: 120, daily_orders: '45K+', uptime: '99.99%' },
      created_at: '2025-10-01',
    },
    {
      id: 2,
      slug: 'wajha',
      name: 'واجهة | Wajha',
      name_en: 'Wajha',
      subtitle: 'منصة تسويق ومواقع تفاعلية للشركات B2B',
      subtitle_en: 'Interactive B2B Marketing Website',
      category: 'digital-presence',
      category_id: 3,
      badge: 'التواجد الرقمي',
      badge_en: 'DIGITAL PRESENCE',
      description: 'منصة ويب عالية التحويل مخصصة للشركات والمؤسسات التي تتطلع إلى تعزيز المصداقية وجذب عملاء محتملين وبناء هوية رقمية رائدة.',
      description_en: 'A high-converting web platform tailored for B2B brands and enterprise companies looking to boost credibility and generate qualified leads.',
      features: ['جلب العملاء المحتملين Lead Gen', 'نظام إدارة محتوى حديث CMS', 'محرك متكامل لتحسين الـ SEO', 'تحليلات تفاعلية ومؤشرات أداء'],
      features_en: ['B2B Lead Generation', 'Modern Headless CMS', 'Built-in SEO Engine', 'Interactive Performance Analytics'],
      layout: 'card',
      accent_color: '#7c3aed',
      image: '/images/products/wajha.png',
      laptop_mockup: '/images/products/wajha_laptop.png',
      is_active: 1,
      is_featured: 1,
      order_index: 2,
      demo_url: 'https://demo.bekite.com/wajha',
      stats: { live_sites: 85, lead_conversion: '+310%' },
      created_at: '2025-10-15',
    },
    {
      id: 3,
      slug: 'masar',
      name: 'مسار | Masar',
      name_en: 'Masar',
      subtitle: 'منصة أتمتة العمليات وتدفق المهام المؤسسية',
      subtitle_en: 'Enterprise Workflow & Task Automation Platform',
      category: 'digital-presence',
      category_id: 3,
      badge: 'إدارة العمليات والإنتاجية',
      badge_en: 'WORKFLOW & AUTOMATION',
      description: 'منظومة إدارة مهام ومشاريع متطورة تتيح لفرق العمل التعاون السلس وأتمتة مسارات العمل وتتبع الإنجاز اللحظي بدقة متناهية.',
      description_en: 'Advanced project & workflow management system enabling seamless cross-team collaboration, automated pipelines, and live milestones tracking.',
      features: ['أتمتة خطوط الإنتاج والمهام', 'لوحات كانبان وجانت تفاعلية', 'تكامل الإشعارات ورسائل WhatsApp/Slack', 'تقارير أداء الكوادر'],
      features_en: ['Pipeline Automation', 'Interactive Kanban & Gantt', 'WhatsApp/Slack Integrations', 'Team Performance Analytics'],
      layout: 'card',
      accent_color: '#059669',
      image: '/images/products/masar.png',
      is_active: 1,
      is_featured: 1,
      order_index: 3,
      created_at: '2025-11-01',
    },
    {
      id: 4,
      slug: 'nawad',
      name: 'نواد | Nawad',
      name_en: 'Nawad',
      subtitle: 'منصة إدارة الأندية والمراكز الرياضية والاشتراكات',
      subtitle_en: 'Sports Clubs & Membership Management Platform',
      category: 'digital-presence',
      category_id: 3,
      badge: 'إدارة العضويات والاشتراكات',
      badge_en: 'MEMBERSHIP & CLUBS',
      description: 'نظام رقمي شامل لإدارة النوادي الصحية والرياضية — إدارة الاشتراكات، بوابات الدخول الذكية، وجدولة الحصص التدريبية وتتبع الحضور.',
      description_en: 'Complete digital platform for fitness clubs and athletic facilities — memberships, smart access turnstiles, class scheduling, and attendance.',
      features: ['إدارة الاشتراكات والتجديد التلقائي', 'ربط بوابات Access Control الذكية', 'تطبيق الأعضاء لحجز الحصص', 'المحاسبة ونقاط البيع'],
      features_en: ['Auto-renewing Memberships', 'Smart Access Control Integration', 'Member Booking App', 'POS & Financial Reporting'],
      layout: 'card',
      accent_color: '#ea580c',
      image: '/images/products/nawad.png',
      is_active: 1,
      is_featured: 0,
      order_index: 4,
      created_at: '2025-11-15',
    },
    {
      id: 5,
      slug: 'tyro',
      name: 'تايرو | Tyro',
      name_en: 'Tyro',
      subtitle: 'نظام إدارة الأكاديميات والتعليم والتدريب التفاعلي',
      subtitle_en: 'Academy & Interactive Training Management System',
      category: 'education',
      category_id: 2,
      badge: 'المنصات التعليمية LMS',
      badge_en: 'EDUCATION & LMS',
      description: 'منصة متكاملة للمراكز التدريبية والأكاديميات — إدارة الطلاب، الدورات المسجلة والحية، الاختبارات التفاعلية، وإصدار الشهادات المعتمدة.',
      description_en: 'Comprehensive LMS for academies and training institutes — student lifecycle, live & recorded courses, interactive exams, and certified certificates.',
      features: ['الفصول الافتراضية المباشرة', 'بنك الأسئلة والاختبارات الذكية', 'إصدار وتوثيق الشهادات بـ QR Code', 'بوابات دفع الأقساط'],
      features_en: ['Live Virtual Classrooms', 'Smart Exam & Quiz Engine', 'QR-verified Certificates', 'Installment Payment Gateway'],
      layout: 'card',
      accent_color: '#2563eb',
      image: '/images/products/tyro.png',
      is_active: 1,
      is_featured: 0,
      order_index: 5,
      created_at: '2025-12-01',
    },
    {
      id: 6,
      slug: 'madroubty',
      name: 'مدربتي | Madroubty',
      name_en: 'Madroubty',
      subtitle: 'منصة المدربين الشخصيين والبرامج الغذائية والرياضية',
      subtitle_en: 'Personal Trainers & Customized Wellness Platform',
      category: 'digital-presence',
      category_id: 3,
      badge: 'اللياقة والتدريب الشخصي',
      badge_en: 'FITNESS & TRAINERS',
      description: 'تطبيق ومنصة مخصصة للمدربين والخبراء لإنشاء خطط تدريب وبرامج تغذية مخصصة ومتابعة تقدم المشتركين والتواصل المباشر معهم.',
      description_en: 'Dedicated application and portal for coaches & nutritionists to design workout plans, diet charts, and monitor clients progress.',
      features: ['بناء جداول التمارين بالفيديو', 'تخصيص الحصص الغذائية والسعرات', 'تتبع قياسات الجسم والوزن', 'الشات والاستشارات الفردية'],
      features_en: ['Video Workout Builder', 'Custom Nutrition & Calorie Plans', 'Progress & Measurement Tracking', '1-on-1 Consultation Chat'],
      layout: 'card',
      accent_color: '#db2777',
      image: '/images/products/madroubty.png',
      is_active: 1,
      is_featured: 0,
      order_index: 6,
      created_at: '2025-12-20',
    },
  ],

  // ===== Be Kite 9 Comprehensive Solutions =====
  services: [
    // Technology
    {
      id: 1,
      slug: 'web-development',
      category: 'technology',
      category_name: 'الحلول التقنية',
      category_name_en: 'Technology Solutions',
      title: 'تصميم وتطوير المواقع والمنصات',
      title_en: 'Web Design & Development',
      title_highlight: 'ابنِ تجربة رقمية استثنائية تدعم نمو وتوسع أعمالك',
      title_highlight_en: 'Build a Digital Experience That Supports Your Business Growth',
      badge: 'DEVELOPMENT',
      description: 'مواقع إلكترونية وتطبيقات ويب عالية الأداء ومخصصة بالكامل لتحقيق أهدافك التجارية بأحدث التقنيات.',
      description_en: 'High-performance websites and web applications tailored to your business goals with cutting-edge tech.',
      hero_image: '/images/web_dev_hero_laptop.jpg',
      icon: 'code',
      icon_name: 'Code',
      technologies: ['React 18', 'Vue 3', 'Laravel 11', 'Next.js', 'TailwindCSS', 'PostgreSQL'],
      tags: ['تصميم الواجهات', 'تطوير الويب', 'إدارة المحتوى'],
      problem_section: {
        badge: 'التحدي التجاري',
        badge_en: 'THE CHALLENGE',
        title: 'المشكلة التي تواجه الشركات',
        title_en: 'The Business Problem',
        subtitle: 'تعاني العديد من الشركات من مواقع قديمة وبطيئة تفشل في تحويل الزوار إلى عملاء أو مواكبة نمو الأعمال.',
        subtitle_en: 'Many businesses struggle with outdated websites that fail to convert visitors or scale with business growth.',
        items: [
          { icon: 'AlertTriangle', title: 'حضور رقمي غير مواكب', title_en: 'Outdated Web Presence', description: 'مواقع نمطية أو بطيئة تفشل في عكس القيمة الحقيقية ومكانة علامتك التجارية.', description_en: 'A generic or slow website that fails to reflect brand authority.' },
          { icon: 'AlertTriangle', title: 'تجربة مستخدم ضعيفة', title_en: 'Poor User Experience', description: 'تصفح معقد، وتوافق ضعيف مع الهواتف الذكية يدفع العملاء للمنافسين.', description_en: 'Confusing navigation and weak mobile responsiveness.' },
          { icon: 'AlertTriangle', title: 'وظائف تقنية محدودة', title_en: 'Limited Functionality', description: 'أنظمة إدارة محتوى جامدة تعجز عن التوسع أو الربط مع واجهات الـ APIs.', description_en: 'Rigid CMS architecture that cannot scale or integrate with APIs.' },
          { icon: 'AlertTriangle', title: 'هوية غير متناسقة', title_en: 'Inconsistent Brand Identity', description: 'عناصر بصرية مبعثرة تضعف ثقة العملاء وتقلل من معدلات الشراء.', description_en: 'Disjointed visual elements that reduce customer trust and conversions.' }
        ]
      },
      solve_section: {
        badge: 'منهجيتنا',
        badge_en: 'OUR APPROACH',
        title: 'كيف نحل هذه المشكلة',
        title_en: 'How We Solve It',
        heading: 'موقع مصمم خصيصاً لأهداف أعمالك وليس قالباً جاهزاً',
        heading_en: 'A Website Designed Around Your Business, Not a Template',
        description: 'تجمع عملية تطوير المواقع المخصصة لدينا بين التصميم الاستراتيجي لواجهات وتجربة المستخدم (UI/UX) وهندسة الواجهات والأنظمة المتطورة المصممة لأهدافك بدقة.',
        description_en: 'Our custom web development process combines strategic UI/UX design, modern frontend architecture, and high-performance backend engineering.',
        image: '/images/web_dev_responsive_devices.jpg',
        cta_button: 'ناقش مشروعك معنا',
        cta_button_en: 'Discuss Your Project'
      },
      deliver_section: {
        title: 'ما نقدمه لك',
        title_en: 'What We Deliver',
        subtitle: 'حلول ويب شاملة ومتكاملة مصممة للسرعة والأمان والتوسع.',
        subtitle_en: 'Comprehensive, end-to-end web solutions built for scale and speed.',
        items: [
          { icon: 'CheckCircle2', title: 'مواقع الشركات والمؤسسات', title_en: 'Corporate Websites', description: 'مواقع مخصصة تعكس ريادة شركتك في قطاعها وتجذب وتلهم العملاء والشركاء.', description_en: 'Custom-designed corporate websites that establish industry authority.' },
          { icon: 'CheckCircle2', title: 'متاجر التجارة الإلكترونية', title_en: 'E-Commerce Websites', description: 'متاجر سريعة ومحسّنة للمبيعات مع بوابات دفع آمنة وإدارة ذكية للمخزون.', description_en: 'High-conversion online stores with secure checkout and inventory sync.' },
          { icon: 'CheckCircle2', title: 'تطبيقات الويب المخصصة (SaaS)', title_en: 'Bespoke Web Applications', description: 'بوابات عملاء ومنصات برمجية سحابية متطورة مبنية لأعلى مستويات الكفاءة.', description_en: 'Tailored SaaS platforms and portals engineered for performance.' },
          { icon: 'CheckCircle2', title: 'أنظمة إدارة المحتوى (CMS)', title_en: 'CMS Integration', description: 'تمكين فريقك من إدارة ونشر المحتوى بسلاسة مطلقة عبر أحدث أنظمة CMS.', description_en: 'Empower your team with intuitive headless or customized CMS setups.' },
          { icon: 'CheckCircle2', title: 'تكامل الـ APIs والأنظمة', title_en: 'API Integration', description: 'ربط فوري مع أنظمة الـ CRM وبوابات الدفع الإلكتروني وأدوات الأتمتة.', description_en: 'Seamless integration with third-party CRM, ERP, and payment gateways.' },
          { icon: 'CheckCircle2', title: 'تحسين السرعة ومحركات البحث', title_en: 'Performance Optimization', description: 'سرعة تحميل فائقة وبنية مهيأة لتصدر نتائج Google مع استقرار 99.9%.', description_en: 'Lightning-fast page loading speeds, SEO-optimized structure, and 99.9% uptime.' }
        ]
      },
      process_section: {
        badge: 'مراحل العمل',
        badge_en: 'PROCESS',
        title: 'كيف نعمل معك',
        title_en: 'How We Work',
        subtitle: 'مسار عمل مدروس وواضح من 5 خطوات يضمن الدقة والمرونة والتميز.',
        subtitle_en: 'Our proven 5-step process delivers clarity, agility, and excellence.',
        steps: [
          { number: '01', title: 'الاستكشاف والتحليل', title_en: 'Discover', description: 'بحث شامل لقطاعك، وأهدافك التجارية، وسلوك جمهورك المستهدف.', description_en: 'Deep-dive research into your industry, business goals, and target users.' },
          { number: '02', title: 'التخطيط والهيكلة', title_en: 'Plan', description: 'وضع الهيكل التقني، والمخططات الأولية (Wireframes)، وخطة العمل.', description_en: 'Technical architecture, wireframes, content strategy, and project roadmap.' },
          { number: '03', title: 'التصميم والتجربة', title_en: 'Design', description: 'تصميم نماذج تفاعلية لواجهات وتجربة المستخدم وهندسة نظام التصميم.', description_en: 'Interactive UI/UX prototypes, responsive layouts, and design systems.' },
          { number: '04', title: 'التطوير والبرمجة', title_en: 'Build', description: 'برمجة احترافية وكود نظيف واختبارات جودة شاملة ومستمرة.', description_en: 'Agile development with clean code, testing, and continuous feedback.' },
          { number: '05', title: 'الإطلاق والتحسين', title_en: 'Launch & Improve', description: 'نشر الموقع، ومراقبة مؤشرات الأداء، والتحسين المستمر لمضاعفة النتائج.', description_en: 'Deployment, speed optimization, user analytics, and ongoing evolution.' }
        ]
      },
      why_section: {
        title: 'لماذا تختار بي كايت',
        title_en: 'Why Be Kite',
        subtitle: 'ما يجعل شراكتنا معك استثنائية وذات أثر ملموس.',
        subtitle_en: 'What makes our partnership exceptional and impact-driven.',
        items: [
          { title: 'فهم عميق للأعمال', title_en: 'Business Understanding', description: 'نركز على العائد الاستثماري ونمو أعمالك وليس فقط التنفيذ التقني.', description_en: 'We focus on business metrics and ROI, not just technical implementation.' },
          { title: 'تميز تجربة المستخدم', title_en: 'UX Excellence', description: 'كل تفاعل ونقرة مصممة بدقة لتحقيق أعلى معدل تحويل وتفاعل.', description_en: 'Every click, scroll, and interaction is engineered to maximize conversion.' },
          { title: 'تكنولوجيا موثوقة', title_en: 'Reliable Technology', description: 'بناء على أحدث الأطر البرمجية مع معايير حماية وأمان فائقة.', description_en: 'Built on modern frameworks with secure, scalable, and clean architectures.' },
          { title: 'شراكة ممتدة', title_en: 'Long-Term Partnership', description: 'نبقى معك بعد الإطلاق لتقديم الدعم الفني والتطوير المستمر.', description_en: 'We stay with you post-launch to provide continuous support and growth.' }
        ]
      },
      capabilities: [
        { title: 'واجهات مستخدم تفاعلية UI/UX', title_en: 'Interactive UI/UX', desc: 'تصاميم جذابة وسلسة مصممة للتحويل.' },
        { title: 'أداء فائق وسرعة تحميل', title_en: 'Blazing Fast Speed', desc: 'معمارية متطورة تضمن 99+ في مؤشرات Core Web Vitals.' },
        { title: 'لوحات تحكم متقدمة CMS', title_en: 'Headless CMS Integration', desc: 'إدارة مرنة للمحتوى والمنتجات بكل سهولة.' },
      ],
      is_active: 1,
      order_index: 1,
    },
    {
      id: 2,
      slug: 'mobile-apps',
      category: 'technology',
      category_name: 'الحلول التقنية',
      category_name_en: 'Technology Solutions',
      title: 'تطوير تطبيقات الهواتف الذكية',
      title_en: 'Mobile App Development',
      title_highlight: 'تطبيقات iOS وأندرويد تفاعلية وسريعة وقابلة للتوسع',
      title_highlight_en: 'Intuitive & Scalable iOS and Android Mobile Applications',
      badge: 'MOBILE',
      description: 'تطبيقات أصلية وهجينة لنظامي iOS و Android تضمن تجربة مستخدم استثنائية وسرعة فائقة.',
      description_en: 'Native & cross-platform mobile apps for iOS and Android that deliver exceptional user experiences.',
      hero_image: '/images/mobile_app_hero_mockup.jpg',
      icon: 'smartphone',
      icon_name: 'Smartphone',
      technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
      tags: ['تطبيقات iOS', 'تطبيقات أندرويد', 'فلاتر (Flutter)', 'رياكت نيتف'],
      problem_section: {
        badge: 'التحدي التجاري',
        badge_en: 'THE CHALLENGE',
        title: 'تحديات الموبايل التي تواجه الشركات',
        title_en: 'Mobile Challenges Businesses Face',
        subtitle: 'تعاني العديد من التطبيقات من بطء الاستجابة واستهلاك البطارية وضعف التوافق.',
        subtitle_en: 'Many apps fail due to clunky navigation, high battery consumption, and poor compatibility.',
        items: [
          { icon: 'AlertTriangle', title: 'معدل تسرب مستخدمين مرتفع', title_en: 'High User Drop-Off', description: 'صعوبة التسجيل والبطء يجعلان أكثر من 70% يغادرون التطبيق.', description_en: 'Poor onboarding causes users to abandon apps within first week.' },
          { icon: 'AlertTriangle', title: 'أخطاء التوافق والانهيارات', title_en: 'Fragmentation & Bugs', description: 'تفاوت الشاشات وكثرة المشاكل يضر بسمعة العلامة التجارية.', description_en: 'Inconsistent UI and frequent crashes damage brand reputation.' },
          { icon: 'AlertTriangle', title: 'ضعف العمل بدون إنترنت', title_en: 'Weak Offline Capabilities', description: 'عدم حفظ البيانات محلياً يمنع العميل من إتمام الشراء.', description_en: 'Lack of offline sync stops users from completing actions.' },
          { icon: 'AlertTriangle', title: 'بطء إطلاق التحديثات', title_en: 'Slow Feature Updates', description: 'كود قديم يجعل إطلاق الميزات الجديدة صعباً وبطيئاً.', description_en: 'Monolithic codebases make releasing updates painful.' }
        ]
      },
      solve_section: {
        badge: 'منهجيتنا',
        badge_en: 'OUR APPROACH',
        title: 'كيف نطور تطبيقات الموبايل',
        title_en: 'How We Build Mobile Apps',
        heading: 'تجارب استخدام سلسة، فائقة السرعة وآمنة تماماً',
        heading_en: 'Engaging, Fast, and Secure Mobile Experiences',
        description: 'يعتمد فريقنا على فلاتر وأحدث التقنيات لتقديم أداء 60 إطاراً في الثانية مع تكاملات سحابية آمنة.',
        description_en: 'Our team leverages Flutter and Native tech to produce pixel-perfect UI and rock-solid security.',
        image: '/images/mobile_app_hero_mockup.jpg',
        cta_button: 'ناقش تطبيقك معنا',
        cta_button_en: 'Discuss Your Mobile App'
      },
      deliver_section: {
        title: 'ما نقدمه لك',
        title_en: 'What We Deliver',
        subtitle: 'دورة حياة كاملة لتطبيق الموبايل من الفكرة وحتى النشر.',
        subtitle_en: 'Complete mobile app lifecycles from architecture to store publishing.',
        items: [
          { icon: 'CheckCircle2', title: 'تطبيقات iOS أصلية (Swift)', title_en: 'iOS Native Development', description: 'تطبيقات سريعة ومخصصة لمنظومة Apple وآيفون وآيباد.', description_en: 'Swift applications optimized for the Apple ecosystem.' },
          { icon: 'CheckCircle2', title: 'تطبيقات أندرويد (Kotlin)', title_en: 'Android Native Development', description: 'تطبيقات عالية الاستجابة لكافة أجهزة وشاشات أندرويد.', description_en: 'Kotlin-based applications built for performance across all devices.' },
          { icon: 'CheckCircle2', title: 'تطبيقات عبر المنصات (Flutter)', title_en: 'Cross-Platform (Flutter)', description: 'كود موحد يوفر 50% من وقت وتكلفة الإطلاق دون التنازل عن السرعة.', description_en: 'A single codebase delivering native iOS and Android apps faster.' },
          { icon: 'CheckCircle2', title: 'إشعارات لحظية Push ذكية', title_en: 'Real-Time Notifications', description: 'محرك إشعارات ذكي لزيادة تفاعل وتكرار شراء العملاء.', description_en: 'Intelligent push notification engines that drive re-engagement.' },
          { icon: 'CheckCircle2', title: 'بوابات الدفع والمحافظ', title_en: 'Payment & Wallet Integration', description: 'دعم Apple Pay و Google Pay والبطاقات لدفع سريع بنقرة واحدة.', description_en: 'Seamless Apple Pay, Google Pay, and digital wallets.' },
          { icon: 'CheckCircle2', title: 'النشر على المتاجر و ASO', title_en: 'Store Publishing & ASO', description: 'إدارة كاملة لاشتراطات آبل وجوجل وضمان الاعتماد السريع.', description_en: 'Complete compliance management and rapid approval handling.' }
        ]
      },
      process_section: {
        badge: 'مراحل العمل',
        badge_en: 'PROCESS',
        title: 'دورة تطوير تطبيقات الموبايل',
        title_en: 'Mobile Development Lifecycle',
        subtitle: 'هندسة دقيقة مع اختبارات مستمرة على أجهزة حقيقية.',
        subtitle_en: 'Structured engineering with continuous testing on real devices.',
        steps: [
          { number: '01', title: 'دراسة رحلة المستخدم', title_en: 'User Journey Discovery', description: 'تحديد الميزات الأساسية ومسار استخدام العميل.', description_en: 'Mapping user personas and core features.' },
          { number: '02', title: 'التصميم الأولي والمخططات', title_en: 'Mobile Wireframing', description: 'نماذج أولية تفاعلية على Figma.', description_en: 'Touch-optimized prototypes and interactive Figma previews.' },
          { number: '03', title: 'المعمارية وربط الـ APIs', title_en: 'Architecture & API Setup', description: 'واجهات برمجة سريعة ونظام حفظ البيانات محلياً.', description_en: 'High-speed REST/GraphQL APIs and offline caching.' },
          { number: '04', title: 'البرمجة واختبارات الأجهزة', title_en: 'Development & QA', description: 'اختبارات مكثفة على أكثر من 20 جهازاً حقيقياً.', description_en: 'Builds tested on 20+ real Android and iOS devices.' },
          { number: '05', title: 'النشر والدعم المستمر', title_en: 'Store Launch & Scaling', description: 'إطلاق على المتاجر ومتابعة مؤشرات الاستقرار.', description_en: 'Store publishing, crash monitoring, and analytics.' }
        ]
      },
      why_section: {
        title: 'لماذا بي كايت لتطبيقات الهاتف',
        title_en: 'Why Choose Be Kite for Mobile',
        subtitle: 'نبني تطبيقات يحب المستخدمون الاحتفاظ بها على شاشاتهم الرئيسية.',
        subtitle_en: 'We build mobile apps that users love to keep on their home screen.',
        items: [
          { title: 'أداء 60 إطاراً في الثانية', title_en: '60 FPS Performance', description: 'حركات دقيقة وتفاعلات فورية تشعرك بالفخامة والسرعة.', description_en: 'Fluid micro-interactions and smooth transitions.' },
          { title: 'عمل سلس بدون إنترنت', title_en: 'Offline-First Reliability', description: 'حفظ محلي ذكي يضمن استمرار التطبيق حتى مع انقطاع الشبكة.', description_en: 'Smart local caching ensures your app works smoothly.' },
          { title: 'امتثال 100% للمتاجر', title_en: 'App Store Compliance', description: 'توافق كامل مع لوائح وسياسات Apple و Google لاعتماد فوري.', description_en: '100% adherence to Apple & Google review guidelines.' },
          { title: 'صيانة دورية وتحديثات', title_en: 'Continuous Maintenance', description: 'مواكبة سريعة لإصدارات أنظمة التشغيل وحماية متجددة.', description_en: 'Regular OS updates, security patches, and monitoring.' }
        ]
      },
      capabilities: [
        { title: 'تطبيقات iOS و Android', title_en: 'iOS & Android Native/Hybrid', desc: 'نشر على App Store و Google Play.' },
        { title: 'إشعارات لحظية متقدمة Push', title_en: 'Rich Push Notifications', desc: 'استهداف ذكي وتفاعل لحظي مع المستخدمين.' },
        { title: 'تكامل بوابات الدفع والموقع GPS', title_en: 'Payments & Geolocation', desc: 'دعم Apple Pay، البطاقات، وتتبع المسارات.' },
      ],
      is_active: 1,
      order_index: 2,
    },
    {
      id: 3,
      slug: 'erp-systems',
      category: 'technology',
      category_name: 'الحلول التقنية',
      category_name_en: 'Technology Solutions',
      title: 'أنظمة إدارة المؤسسات ERP والبرمجيات المخصصة',
      title_en: 'ERP & Business Management Systems',
      badge: 'ENTERPRISE',
      description: 'حلول ERP و CRM مخصصة لأتمتة العمليات اليومية، إدارة الحسابات والمخازن، ورفع الكفاءة التشغيلية.',
      description_en: 'Custom ERP and CRM solutions to streamline operations, automate workflows, and increase efficiency.',
      icon: 'database',
      icon_name: 'Database',
      technologies: ['Laravel Enterprise', 'Oracle DB', 'SAP RFC Connectors', 'Redis', 'Docker'],
      capabilities: [
        { title: 'الربط مع Oracle & SAP', title_en: 'Oracle & SAP Integration', desc: 'تزامن ثنائي الاتجاه للقيود والمخزون.' },
        { title: 'الفوترة الإلكترونية والضرائب ZATCA', title_en: 'E-Invoicing Compliance', desc: 'امتثال كامل للمرحلة الثانية في الأردن والخليج.' },
        { title: 'شجرة الحسابات والتقارير المالية', title_en: 'Financial Tree & Analytics', desc: 'ميزانية عمومية وقوائم دخل لحظية.' },
      ],
      is_active: 1,
      order_index: 3,
    },
    {
      id: 4,
      slug: 'cloud-infrastructure',
      category: 'technology',
      category_name: 'الحلول التقنية',
      category_name_en: 'Technology Solutions',
      title: 'البنية التحتية والحلول السحابية والأمن السيبراني',
      title_en: 'IT Infrastructure & Cloud Services',
      badge: 'CLOUD & DEVOPS',
      description: 'بيئات سحابية آمنة وقابلة للتوسع وإدارة متطورة للسيرفرات لضمان استمرارية الأعمال بأعلى حماية.',
      description_en: 'Secure, scalable cloud environments and server management for mission-critical operations.',
      icon: 'cloud',
      icon_name: 'Cloud',
      technologies: ['AWS', 'Cloudflare CDN', 'Kubernetes', 'Terraform', 'Nginx', 'SSL/WAF'],
      capabilities: [
        { title: 'بنية مقاومة للهجمات DDoS', title_en: 'DDoS & WAF Protection', desc: 'حماية كاملة وحجب التهديدات السيبرانية.' },
        { title: 'توسع تلقائي Auto-Scaling', title_en: 'Elastic Auto Scaling', desc: 'تحمل ملايين الزيارات دون انقطاع.' },
        { title: 'نسخ احتياطي واستعادة لحظية', title_en: 'Disaster Recovery', desc: 'نسخ دوري مشفر لقواعد البيانات والملفات.' },
      ],
      is_active: 1,
      order_index: 4,
    },

    // Marketing
    {
      id: 5,
      slug: 'branding-identity',
      category: 'marketing',
      category_name: 'الحلول التسويقية والإبداعية',
      category_name_en: 'Marketing & Creative Solutions',
      title: 'بناء الهوية البصرية والعلامات التجارية',
      title_en: 'Branding & Visual Identity',
      badge: 'BRANDING',
      description: 'تصميم هويات تجارية متفردة ودليل إرشادي متكامل يجعل علامتك لا تُنسى في أذهان العملاء.',
      description_en: 'Distinctive brand identity and creative guidelines designed to make your brand unforgettable.',
      icon: 'palette',
      icon_name: 'Palette',
      technologies: ['Adobe Illustrator', 'Figma', 'Brand Guidelines', 'Typography Specs'],
      capabilities: [
        { title: 'تصميم الشعار والعناصر البصرية', title_en: 'Logo & Visual Assets', desc: 'شعارات أيقونية وهوية متسقة.' },
        { title: 'كتاب الهوية Brand Guidelines', title_en: 'Complete Brandbook', desc: 'قواعد استخدام الألوان والخطوط والمطبوعات.' },
        { title: 'تصاميم التغليف والمطبوعات', title_en: 'Packaging & Print Materials', desc: 'تصاميم ملموسة فاخرة للمنتجات.' },
      ],
      is_active: 1,
      order_index: 5,
    },
    {
      id: 6,
      slug: 'social-media',
      category: 'marketing',
      category_name: 'الحلول التسويقية والإبداعية',
      category_name_en: 'Marketing & Creative Solutions',
      title: 'إدارة منصات التواصل الاجتماعي والتفاعل',
      title_en: 'Social Media Management',
      badge: 'SOCIAL MEDIA',
      description: 'إدارة شاملة لكافة قنوات التواصل، صناعة المحتوى الجذاب، وتنمية المجتمعات الرقمية الموالية لعلامتك.',
      description_en: 'End-to-end social channel management, content creation, community engagement, and growth campaigns.',
      icon: 'share-2',
      icon_name: 'Share2',
      technologies: ['Meta Business Suite', 'TikTok Ads', 'LinkedIn Analytics', 'Hootsuite'],
      capabilities: [
        { title: 'خطط المحتوى والنشر الشهري', title_en: 'Monthly Content Strategy', desc: 'جدولة محتوى إبداعي متفاعل ومدروس.' },
        { title: 'إدارة المجتمع والرد على العملاء', title_en: 'Community Moderation', desc: 'بناء علاقات متينة وسريعة مع المتابعين.' },
        { title: 'ريلز وفيديوهات تريند إبداعية', title_en: 'Trending Viral Reels', desc: 'زيادة الوصول العضوي بأساليب مبتكرة.' },
      ],
      is_active: 1,
      order_index: 6,
    },
    {
      id: 7,
      slug: 'digital-campaigns',
      category: 'marketing',
      category_name: 'الحلول التسويقية والإبداعية',
      category_name_en: 'Marketing & Creative Solutions',
      title: 'الحملات الرقمية والتسويق عالي الأداء',
      title_en: 'Digital Campaigns & Performance Marketing',
      badge: 'GROWTH MARKETING',
      description: 'إعلانات ممولة مستهدفة وحملات قائمة على البيانات عبر Google و Meta و TikTok و LinkedIn لمضاعفة العائد.',
      description_en: 'Data-driven paid ads and performance marketing across Google, Meta, TikTok, and LinkedIn to maximize ROI.',
      icon: 'trending-up',
      icon_name: 'TrendingUp',
      technologies: ['Google Ads', 'Meta Ads Manager', 'GA4 Analytics', 'TikTok Ads', 'Tag Manager'],
      capabilities: [
        { title: 'حملات محركات البحث Google Search', title_en: 'Search Engine Advertising', desc: 'ظهور في النتائج الأولى للعملاء ذوي النية العالية.' },
        { title: 'إعلانات التحويل Retargeting', title_en: 'Dynamic Retargeting', desc: 'استعادة الزوار ومضاعفة المبيعات بأقل تكلفة.' },
        { title: 'تقارير أداء ومؤشرات ROAS اللحظية', title_en: 'Live ROAS Dashboards', desc: 'شفافية كاملة في احتساب العائد على كل دينار منفق.' },
      ],
      is_active: 1,
      order_index: 7,
    },

    // Creative
    {
      id: 8,
      slug: 'content-production',
      category: 'creative',
      category_name: 'الحلول الإبداعية والإنتاج المرئي',
      category_name_en: 'Creative & Visual Production',
      title: 'صناعة المحتوى الإبداعي وكتابة النصوص الإعلانية',
      title_en: 'Creative Content Production & Copywriting',
      badge: 'CONTENT',
      description: 'نصوص إعلانية مقنعة، تصاميم جرافيك إبداعية، ورواية قصصية مؤثرة تحرك المشاعر وتقود إلى اتخاذ القرار.',
      description_en: 'Compelling copywriting, graphic design, and brand storytelling that captivates and converts audiences.',
      icon: 'file-text',
      icon_name: 'FileText',
      technologies: ['Copywriting Frameworks', 'Adobe Photoshop', 'After Effects', 'Storyboarding'],
      capabilities: [
        { title: 'كتابة الإعلانات المقنعة Copywriting', title_en: 'High-converting Copy', desc: 'نصوص ذكية تخاطب نقاط الألم والاحتياج.' },
        { title: 'تصاميم موشن جرافيك وفيديوهات توضيحية', title_en: 'Motion Graphics', desc: 'شرح الخدمات والأنظمة برسومات متحركة مبهرة.' },
      ],
      is_active: 1,
      order_index: 8,
    },
    {
      id: 9,
      slug: 'photo-video-production',
      category: 'creative',
      category_name: 'الحلول الإبداعية والإنتاج المرئي',
      category_name_en: 'Creative & Visual Production',
      title: 'الإنتاج المرئي والتصوير الإعلاني الاحترافي',
      title_en: 'Photography & Commercial Video Production',
      badge: 'PRODUCTION',
      description: 'تصوير فوتوغرافي تجاري وسينمائي للمنتجات والمنشآت يعكس فخامة علامتك التجارية بأعلى جودة بدقة 8K.',
      description_en: 'Professional commercial photography and cinematic video production that bring your brand to life in 8K.',
      icon: 'camera',
      icon_name: 'Camera',
      technologies: ['Sony Cinema FX', 'Color Grading (DaVinci)', 'Studio Lighting', 'Drone 4K'],
      capabilities: [
        { title: 'تصوير المنتجات الاستوديو الفاخر', title_en: 'Studio Product Shoots', desc: 'إبراز تفاصيل المنتجات بأعلى معايير الإضاءة.' },
        { title: 'إعلانات سينمائية ومقابلات وثائقية', title_en: 'Cinematic Commercials', desc: 'إنتاج إعلانات ترويجية جاهزة للشاشات والمنصات.' },
      ],
      is_active: 1,
      order_index: 9,
    },
  ],

  // ===== Be Kite Venture Brands & Investments =====
  brands: [
    {
      id: 1,
      slug: 'zalameh-app',
      name: 'تطبيق زلمة | Zalameh App',
      name_en: 'Zalameh App',
      subtitle: 'مجتمع ونمط حياة عصري مخصص للرجل العربي',
      subtitle_en: 'A Digital Platform for Real Connections',
      badge: 'CONSUMER APP',
      badge_en: 'CONSUMER APP',
      description: 'منصة رقمية ومجتمع تفاعلي حصري صُمم خصيصاً للرجل العربي — مساحة للتواصل، تبادل القصص الملهمة، واستكشاف أدلة أسلوب الحياة الراقي والاحتفاء بالثقافة والنمو الشخصي.',
      description_en: 'Zalameh is an exclusive online community and lifestyle space created specifically for Arab men — a platform to connect, share inspiring stories, and celebrate culture.',
      tags: ['تطبيق مجتمعي', 'علامة استهلاكية', 'ثقافة وأسلوب حياة'],
      tags_en: ['Community App', 'Consumer Brand', 'Culture & Lifestyle'],
      links: [
        { label: 'الموقع الرسمي', label_en: 'Website', href: 'https://zalameh.com', type: 'primary' },
        { label: 'تطبيق iOS', label_en: 'iOS', href: 'https://apps.apple.com', type: 'secondary' },
        { label: 'تطبيق Android', label_en: 'Android', href: 'https://play.google.com', type: 'secondary' },
      ],
      image: '/images/brands/zalameh_mockup.png',
      logo: '/images/brands/zalameh_mockup.png',
      brand_color: '#ea580c',
      accent_color: '#c2410c',
      is_coming_soon: 0,
      is_active: 1,
      order_index: 1,
      created_at: '2025-08-01',
    },
    {
      id: 2,
      slug: 'hadayapp',
      name: 'هدايا أب | HadayApp',
      name_en: 'HadayApp',
      subtitle: 'تجربة الإهداء الرقمي المبتكرة والمخصصة',
      subtitle_en: 'The Digital Gifting Experience',
      badge: 'GIFTING PLATFORM',
      badge_en: 'GIFTING PLATFORM',
      description: 'منصة رائدة لإرسال وتخصيص وتوصيل الهدايا الاستثنائية بلمسة إقليمية وتغليف فني فريد يدمج بين السهولة الرقمية وحرارة المشاعر الحقيقية.',
      description_en: 'HadayApp is a curated gifting platform and lifestyle brand created to revolutionize how people send, customize, and receive meaningful gifts with bespoke packaging.',
      tags: ['منصة إهداء', 'تجارة إلكترونية', 'تجربة مستخدم'],
      tags_en: ['Gifting Platform', 'Consumer Experience', 'E-Commerce'],
      links: [
        { label: 'الموقع الرسمي', label_en: 'Website', href: 'https://hadayapp.com', type: 'primary' },
        { label: 'تطبيق iOS', label_en: 'iOS', href: 'https://apps.apple.com', type: 'secondary' },
        { label: 'تطبيق Android', label_en: 'Android', href: 'https://play.google.com', type: 'secondary' },
      ],
      image: '/images/brands/hadayapp_mockup.png',
      logo: '/images/brands/hadayapp_mockup.png',
      brand_color: '#4f008c',
      accent_color: '#6d28d9',
      is_coming_soon: 0,
      is_active: 1,
      order_index: 2,
      created_at: '2025-09-01',
    },
    {
      id: 3,
      slug: 'fintech-concept',
      name: 'مشروع تقنية مالية | FinTech Concept',
      name_en: 'FinTech Concept',
      subtitle: 'حلول مالية ومدفوعات ذكية للشركات الناشئة',
      subtitle_en: 'Smart Corporate Payments & Financial Infrastructure',
      badge: 'قيد التجهيز والإعداد',
      badge_en: 'In Pipeline',
      description: 'منظومة مالية متطورة قيد التجهيز تهدف إلى تسهيل المدفوعات والتمويل السريع للمؤسسات الصغيرة والمتوسطة.',
      description_en: 'Next-generation financial technology and corporate payment infrastructure in ideation & engineering pipeline.',
      tags: ['FinTech', 'تقنية مالية', 'قيد التجهيز'],
      tags_en: ['FinTech', 'Payments', 'In Pipeline'],
      brand_color: '#0284c7',
      accent_color: '#0369a1',
      layout: 'image-left',
      pipeline_status: 'قيد التجهيز والإعداد',
      is_coming_soon: 1,
      is_active: 1,
      order_index: 3,
      created_at: '2026-01-01',
    },
    {
      id: 4,
      slug: 'edtech-venture',
      name: 'منصة تكنولوجيا التعليم | EdTech Venture',
      name_en: 'EdTech Venture',
      subtitle: 'تجارب تعليمية تفاعلية مدعومة بالذكاء الاصطناعي',
      subtitle_en: 'Interactive Learning Powered by Adaptive AI',
      badge: 'أبحاث ودراسة السوق',
      badge_en: 'Research & Ideation',
      description: 'منصة تعليمية متطورة تهدف إلى إضفاء الطابع الشخصي على رحلة الطالب وتسهيل وصول المعرفة الأكاديمية والمهنية.',
      description_en: 'An advanced educational venture focused on personalized adaptive learning and skills acceleration.',
      tags: ['EdTech', 'تعليم رقمي', 'أبحاث ودراسة السوق'],
      tags_en: ['EdTech', 'E-Learning', 'Research & Ideation'],
      brand_color: '#059669',
      accent_color: '#047857',
      layout: 'image-right',
      pipeline_status: 'أبحاث ودراسة السوق',
      is_coming_soon: 1,
      is_active: 1,
      order_index: 4,
      created_at: '2026-02-01',
    },
    {
      id: 5,
      slug: 'ai-productivity-app',
      name: 'تطبيق إنتاجية بالذكاء الاصطناعي | AI Productivity',
      name_en: 'AI Productivity App',
      subtitle: 'مساعد تنفيذي فائق الذكاء لفرق العمل الرقمية',
      subtitle_en: 'Autonomous Executive Assistant for High-Growth Teams',
      badge: 'النمذجة الأولية والبرمجة',
      badge_en: 'Prototyping & Dev',
      description: 'تطبيق للمستهلكين والشركات يدمج نماذج الذكاء الاصطناعي التوليدية لأتمتة المهام اليومية والجدولة وإدارة المعرفة المؤسسية.',
      description_en: 'An intelligent workplace companion streamlining multi-modal workflows, automated scheduling, and team intelligence.',
      tags: ['AI App', 'ذكاء اصطناعي', 'النمذجة الأولية'],
      tags_en: ['AI', 'Productivity', 'Prototyping & Dev'],
      brand_color: '#8b5cf6',
      accent_color: '#7c3aed',
      layout: 'image-left',
      pipeline_status: 'النمذجة الأولية والبرمجة',
      is_coming_soon: 1,
      is_active: 1,
      order_index: 5,
      created_at: '2026-02-15',
    },
  ],

  // ===== Be Kite Client Inquiries CRM (Leads) =====
  serviceRequests: [
    {
      id: 1,
      full_name: 'م. راشد الحنيطي',
      email: 'rashed@alkhaleej-group.com',
      phone: '+962 79 555 9812',
      company: 'مجموعة الخليج للاستثمار',
      service_type: 'solutions',
      service_name: 'تطوير نظام ERP مخصص وربط مع Oracle',
      budget_range: '$20,000 - $50,000',
      message: 'نحتاج إلى أتمتة عمليات المستودعات والمبيعات وربطها بالفوترة الإلكترونية وتكامل مع خوادم أوراكل السحابية.',
      status: 'in_progress',
      admin_notes: 'تم الاجتماع الأولي، قيد إعداد العرض الفني والمالي (Proposal).',
      created_at: '2026-08-29 10:30',
    },
    {
      id: 2,
      full_name: 'د. ليلى السالم',
      email: 'dr.layla@elite-dental.jo',
      phone: '+962 78 888 3421',
      company: 'عيادات إيليت لطب الأسنان',
      service_type: 'branding',
      service_name: 'هوية بصرية كاملة وتطبيق حجز مواعيد',
      budget_range: '$10,000 - $20,000',
      message: 'نريد تجديد الهوية البصرية للعيادة وتطوير تطبيق لحجز المواعيد وإرسال تذكيرات بالواتساب للعملاء.',
      status: 'contacted',
      admin_notes: 'تم التواصل هاتفياً وتحديد موعد اجتماع يوم الثلاثاء القادم.',
      created_at: '2026-08-28 14:15',
    },
    {
      id: 3,
      full_name: 'سامر قنديل',
      email: 'samer@qandeel-tech.com',
      phone: '+966 50 123 4567',
      company: 'Qandeel E-Commerce KSA',
      service_type: 'products',
      service_name: 'ترخيص نظام تجارة Tijara وطلب عرض Demo',
      budget_range: '$5,000 - $10,000',
      message: 'نرغب في تشغيل نظام تجارة لمتجرنا في السعودية مع ربط الدفع عبر مدى وتمارا.',
      status: 'new',
      admin_notes: 'طلب جديد وارد من صفحة المنتجات.',
      created_at: '2026-08-29 12:00',
    },
    {
      id: 4,
      full_name: 'مها الزعبي',
      email: 'maha.zoubi@horizon-edu.org',
      phone: '+962 77 712 3456',
      company: 'أكاديمية هورايزون للغات',
      service_type: 'products',
      service_name: 'منظومة تايرو Tyro للتعليم الإلكتروني',
      budget_range: '$10,000 - $20,000',
      message: 'نبحث عن منصة لإدارة 1500 طالب مع فصول مباشرة واختبارات تفاعلية.',
      status: 'converted',
      admin_notes: 'تم توقيع العقد وبدء مرحلة الإعداد والتخصيص.',
      created_at: '2026-08-25 09:40',
    },
    {
      id: 5,
      full_name: 'فادي طه',
      email: 'fadi@profitness-jo.com',
      phone: '+962 79 444 6677',
      company: 'سلسلة مراكز برو فيتنس',
      service_type: 'solutions',
      service_name: 'حملات تسويق رقمي وإدارة منصات التواصل',
      budget_range: '$3,000 / شهرياً',
      message: 'نريد حملات إعلانية قوية على إنستغرام وتيك توك لزيادة الاشتراكات السنوية.',
      status: 'contacted',
      admin_notes: 'تم إرسال الخطة الشهرية للعميل وبانتظار الموافقة النهائية.',
      created_at: '2026-08-27 16:20',
    },
  ],

  // ===== General Messages =====
  messages: [
    {
      id: 1,
      name: 'م. راشد الحنيطي',
      sender_name: 'م. راشد الحنيطي',
      email: 'rashed.huneiti@alkhaleej-group.com',
      phone: '+962 79 555 9812',
      subject: 'طلب استشارة لتطوير نظام إدارة العمليات والمخازن ERP',
      message: 'السلام عليكم ورحمة الله، نحن في مجموعة الخليج نرغب في الاستفسار عن إمكانية عقد جلسة استشارية لبحث بناء نظام ERP سحابي متكامل يربط بين الفروع وإدارة المخزون ونقاط البيع مع الربط بالفوترة الإلكترونية. يرجى التواصل لتحديد موعد.',
      status: 'unread',
      is_read: 0,
      created_at: '2026-08-31 10:45:00',
    },
    {
      id: 2,
      name: 'سارة عبد الرحمن الفايز',
      sender_name: 'سارة عبد الرحمن الفايز',
      email: 'sarah.fayez@luxuryspaces.sa',
      phone: '+966 54 887 1234',
      subject: 'طلب عرض سعر لتصميم الهوية البصرية وتطوير المتجر الإلكتروني',
      message: 'مرحباً فريق Be Kite، نحن بصدد إطلاق منصة تجارية متخصصة في الديكور والتصميم الداخلي في الرياض، ونود الحصول على عرض سعر وخطة عمل متكاملة لتصميم الهوية وتطوير المتجر على الويب والموبايل.',
      status: 'unread',
      is_read: 0,
      created_at: '2026-08-30 16:20:00',
    },
    {
      id: 3,
      name: 'د. ليلى السالم',
      sender_name: 'د. ليلى السالم',
      email: 'dr.layla@elite-dental.jo',
      phone: '+962 78 888 3421',
      subject: 'استفسار بخصوص تكامل نظام المواعيد مع WhatsApp API',
      message: 'تحياتي لكم، اطلعنا على أعمالكم السابقة في القطاع الطبي ونرغب في معرفة تفاصيل أكثر حول حلول الربط المباشر مع واتساب كلاود API لإرسال تأكيدات المواعيد ونتائج الفحوصات لمرضانا.',
      status: 'unread',
      is_read: 0,
      created_at: '2026-08-29 14:15:00',
    },
    {
      id: 4,
      name: 'طارق حسان',
      sender_name: 'طارق حسان',
      email: 'tariq@investcorp.com',
      phone: '+971 50 789 6543',
      subject: 'استفسار حول شراكات الاستثمار في العلامات التابعة لـ Be Kite',
      message: 'مرحباً فريق بي كايت، نود بحث فرص الاستثمار والمشاركة في جولة التمويل القادمة لتطبيق زلمة وهدايا أب وباقي منتجات المنظومة الرقمية. يسعدنا عقد اجتماع عبر Zoom لمناقشة التفاصيل.',
      status: 'read',
      is_read: 1,
      created_at: '2026-08-28 11:30:00',
    },
    {
      id: 5,
      name: 'المهندس كريم الشناوي',
      sender_name: 'المهندس كريم الشناوي',
      email: 'kareem.shinawy@horizon-media.ae',
      phone: '+971 55 234 5678',
      subject: 'طلب شراكة استراتيجية للإنتاج المرئي والإعلانات التلفزيونية',
      message: 'مرحباً، بصفتنا وكالة إنتاج إعلامي رائدة في دبي، نود اقتراح شراكة استراتيجية مع فريقكم لتقديم خدمات الإنتاج السينمائي ثلاثي الأبعاد والتصوير التجاري لحملاتكم الرقمية القادمة.',
      status: 'read',
      is_read: 1,
      created_at: '2026-08-27 15:10:00',
    },
    {
      id: 6,
      name: 'نور الدين المجالي',
      sender_name: 'نور الدين المجالي',
      email: 'nour@majali-logistics.com',
      phone: '+962 77 654 3210',
      subject: 'طلب ديمو تجريبي لمنصة تجارة Tijara السحابية',
      message: 'السلام عليكم، نرغب في حجز جلسة تجريبية Demo لمنظومة تجارة Tijara للاطلاع على ميزات إدارة المستودعات المتعددة والتكامل مع بوابات الشحن والدفع في الأردن والخليج.',
      status: 'read',
      is_read: 1,
      created_at: '2026-08-26 09:00:00',
    },
    {
      id: 7,
      name: 'ريم القاضي',
      sender_name: 'ريم القاضي',
      email: 'reem.qadi@almadar-tech.com',
      phone: '+966 56 321 9870',
      subject: 'طلب عرض تقديمي حول خدمات الأمن السيبراني والبنية التحتية',
      message: 'مرحباً، نرجو تزويدنا بالملف التعريفي الخاص بخدمات فحص الثغرات الأمنية واختبار الاختراق للبنية التحتية السحابية، بالإضافة إلى نماذج من تقارير التدقيق الأمني التي تقدمونها.',
      status: 'read',
      is_read: 1,
      created_at: '2026-08-25 13:40:00',
    },
  ],

  // ===== Careers & Open Positions (Be Kite Job Openings) =====
  careers: [
    {
      id: 1,
      slug: 'senior-full-stack-developer',
      title: 'مطور Full-Stack أول',
      title_en: 'Senior Full-Stack Developer',
      badge: 'TECH & ENGINEERING',
      badge_en: 'TECH & ENGINEERING',
      accent_color: '#4f008c',
      image: '/images/careers/job_hero_infinity.jpg',
      heroImage: '/images/careers/job_hero_infinity.jpg',
      department: 'الهندسة والتطوير',
      department_en: 'Engineering',
      location: 'الرياض، السعودية / عمان، الأردن — هجين',
      location_en: 'Riyadh, Saudi Arabia / Amman, Jordan — Hybrid',
      type: 'دوام كامل / دائم',
      type_en: 'Full-time / Permanent',
      experience: '+5 سنوات خبرة',
      experience_en: 'Exp: 5+ Years',
      subtitle: 'تصميم وبناء ونشر تطبيقات الجيل القادم وتوسيع منصاتنا السحابية.',
      description: 'تصميم وتطوير ونشر تطبيقات سريعة ومتطورة من الجيل القادم. قيادة الميزات البرمجية كعنصر محوري في الفريق لتسريع نمو عملائنا.',
      description_en: 'Design, build, and deploy next-generation modern agile applications. Drive features end-to-end as part of the core team to accelerate client growth.',
      skills: ['React & Next.js', 'Node.js', 'TypeScript', 'PostgreSQL'],
      requirements: [
        '5+ years of professional full-stack software development experience with React and Node.js.',
        'Extensive experience with modern frontend frameworks (React, Next.js, Vue 3) and TypeScript.',
        'Strong proficiency in PostgreSQL, MongoDB, RESTful APIs, and Clean Architecture.',
      ],
      applicants_count: 38,
      is_active: 1,
      created_at: '2026-02-01',
    },
    {
      id: 2,
      slug: 'flutter-developer',
      title: 'مطور تطبيقات Flutter',
      title_en: 'Flutter Developer',
      badge: 'MOBILE ENGINEERING',
      badge_en: 'MOBILE ENGINEERING',
      accent_color: '#4f008c',
      image: '/images/careers/careers_collaboration.jpg',
      heroImage: '/images/careers/careers_collaboration.jpg',
      department: 'الهندسة والتطوير',
      department_en: 'Engineering',
      location: 'الرياض، السعودية — حضوري',
      location_en: 'Riyadh, Saudi Arabia — On-site',
      type: 'دوام كامل / دائم',
      type_en: 'Full-time / Permanent',
      experience: '+3 سنوات خبرة',
      experience_en: 'Exp: 3+ Years',
      subtitle: 'بناء وتطوير تطبيقات أصلية فائقة السلاسة لمنظومتي iOS و Android.',
      description: 'تطوير وإطلاق تطبيقات هاتف ذكية لأنظمة iOS و Android بأداء فائق السرعة، واجهات عصرية، وهندسة برمجية نظيفة وقوية.',
      description_en: 'Build and ship cross-platform native iOS & Android applications with buttery smooth performance, state-of-the-art UI, and resilient clean architecture.',
      skills: ['Flutter & Dart', 'iOS / Android', 'BLoC / Riverpod', 'Clean Arch'],
      requirements: [
        '3+ years of Flutter development with published apps on App Store and Google Play.',
        'Deep understanding of BLoC or Riverpod state management and Clean Architecture.',
        'Experience integrating REST APIs, Push Notifications, and Payment Gateways.',
      ],
      applicants_count: 29,
      is_active: 1,
      created_at: '2026-02-10',
    },
    {
      id: 3,
      slug: 'ux-ui-designer',
      title: 'مصمم تجربة وواجهة المستخدم (UX/UI)',
      title_en: 'UX/UI Designer',
      badge: 'DESIGN & PRODUCT',
      badge_en: 'DESIGN & PRODUCT',
      accent_color: '#4f008c',
      image: '/images/careers/careers_experimentation.jpg',
      heroImage: '/images/careers/careers_experimentation.jpg',
      department: 'التصميم والإبداع',
      department_en: 'Design',
      location: 'عمان، الأردن — هجين',
      location_en: 'Amman, Jordan — Hybrid',
      type: 'دوام كامل / دائم',
      type_en: 'Full-time / Permanent',
      experience: '+3 سنوات خبرة',
      experience_en: 'Exp: 3+ Years',
      subtitle: 'تحويل الأنظمة والعمليات المعقدة إلى واجهات مستخدم مذهلة وسلسة.',
      description: 'تحويل الأنظمة المعقدة إلى منتجات وتجارب رقمية وتطبيقات مذهلة وسلسة تمنح المستخدمين تجربة استثنائية وفاخرة.',
      description_en: 'Transform complex workflows into clean, intuitive, and world-class digital products, web experiences, and mobile UI systems that wow users.',
      skills: ['Figma Mastery', 'Design Systems', 'Prototyping', 'User Research'],
      requirements: [
        '3+ years designing complex SaaS platforms, responsive web apps, and mobile interfaces.',
        'Expert proficiency in Figma, design systems, auto-layout, and interactive prototyping.',
        'Strong portfolio demonstrating user research, journey mapping, and pixel-perfect design.',
      ],
      applicants_count: 42,
      is_active: 1,
      created_at: '2026-02-15',
    },
    {
      id: 4,
      slug: 'digital-marketing-specialist',
      title: 'أخصائي تسويق رقمي ونمو',
      title_en: 'Digital Marketing Specialist',
      badge: 'GROWTH & MARKETING',
      badge_en: 'GROWTH & MARKETING',
      accent_color: '#4f008c',
      image: '/images/careers/careers_growth.jpg',
      heroImage: '/images/careers/careers_growth.jpg',
      department: 'التسويق الرقمي',
      department_en: 'Marketing',
      location: 'الرياض، السعودية — عن بعد',
      location_en: 'Riyadh, Saudi Arabia — Remote',
      type: 'دوام كامل / دائم',
      type_en: 'Full-time / Permanent',
      experience: '+2 سنوات خبرة',
      experience_en: 'Exp: 2+ Years',
      subtitle: 'قيادة حملات الأداء الممولة وتحسين محركات البحث والنمو الرقمي.',
      description: 'قيادة الحملات الإعلانية الممولة المركزة على التحويلات، تحسين محركات البحث SEO، وتجارب النمو التي تحقق عوائد استثمارية قياسية.',
      description_en: 'Lead conversion-focused paid ad campaigns, search engine optimization, content strategies, and growth experiments that generate high ROI.',
      skills: ['Meta & Google Ads', 'SEO & Analytics', 'CRO Optimization', 'Data Analysis'],
      requirements: [
        '2+ years managing performance marketing campaigns across Meta, Google Ads, and TikTok.',
        'Proven track record in technical SEO, conversion rate optimization (CRO), and Google Analytics 4.',
        'Data-driven mindset with experience optimizing CPA, ROAS, and customer acquisition funnels.',
      ],
      applicants_count: 22,
      is_active: 1,
      created_at: '2026-02-20',
    },
    {
      id: 5,
      slug: 'business-development-executive',
      title: 'مسؤول تطوير أعمال ومبيعات',
      title_en: 'Business Development Executive',
      badge: 'BUSINESS & SALES',
      badge_en: 'BUSINESS & SALES',
      accent_color: '#4f008c',
      image: '/images/careers/careers_ownership.jpg',
      heroImage: '/images/careers/careers_ownership.jpg',
      department: 'تطوير الأعمال والمبيعات',
      department_en: 'Business Development',
      location: 'عمان، الأردن — هجين',
      location_en: 'Amman, Jordan — Hybrid',
      type: 'دوام كامل / دائم',
      type_en: 'Full-time / Permanent',
      experience: '+3 سنوات خبرة',
      experience_en: 'Exp: 3+ Years',
      subtitle: 'توسيع قاعدة شركاء Be Kite وبناء صفقات استراتيجية كبرى.',
      description: 'توسيع قاعدة شركاء وعملاء Be Kite في المملكة العربية السعودية والأردن ومنطقة الشرق الأوسط من خلال بناء شراكات استراتيجية طويلة الأمد.',
      description_en: 'Expand Be Kite’s client ecosystem across Saudi Arabia, Jordan, and the MENA region by building long-term strategic relationships and closing deals.',
      skills: ['B2B Sales', 'Enterprise Deals', 'Strategic Partnerships', 'Negotiation'],
      requirements: [
        '3+ years in B2B software sales, technology services, or digital agency business development.',
        'Demonstrated success in prospecting, managing complex enterprise sales cycles, and closing high-ticket deals.',
        'Fluent in Arabic and English with outstanding communication and presentation skills.',
      ],
      applicants_count: 17,
      is_active: 1,
      created_at: '2026-02-25',
    },
  ],

  // ===== Be Kite Leadership & Team =====
  teamMembers: [
    {
      id: 1,
      name: 'أحمد المحمود',
      name_en: 'Ahmed Al-Mahmoud',
      position: 'مدير تطوير النظم والبرمجيات',
      position_en: 'Head of Software Development',
      email: 'dev@bekite.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'قائد تقني متمرس في هندسة النظم السحابية العملاقة والتحول الرقمي لأكبر المؤسسات في الشرق الأوسط.',
      is_active: 1,
      order_index: 1,
    },
    {
      id: 2,
      name: 'سارة خالد القضاة',
      name_en: 'Sara Qudah',
      position: 'مدير النمو والتسويق الرقمي',
      position_en: 'Head of Growth & Performance Marketing',
      email: 'sara@bekite.com',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      bio: 'خبير استراتيجي في الحملات الممولة القائمة على البيانات ونمو المنتجات الرقمية.',
      is_active: 1,
      order_index: 2,
    },
    {
      id: 3,
      name: 'زيد النجار',
      name_en: 'Zaid Najjar',
      position: 'مدير التصميم الإبداعي والمنتجات',
      position_en: 'Lead Product & UI/UX Designer',
      email: 'zaid@bekite.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'فنان ومصمم واجهات متخصص في الهويات الرقمية الفاخرة وتجارب المستخدم الغامرة.',
      is_active: 1,
      order_index: 3,
    },
  ],

  // ===== Dynamic & Legal Pages =====
  dynamicPages: [
    {
      id: 1,
      title: 'الشروط والأحكام الخاصة بمنظومة بي كايت',
      title_en: 'Terms and Conditions',
      slug: 'terms-and-conditions',
      content: `<h3>1. مقدمة وقبول الشروط</h3><p>مرحباً بك في منصة Be Kite. باستخدامك لخدماتنا البرمجية أو منتجاتنا السحابية أو بورتفوليو المشاريع فإنك تقر وتوافق على الالتزام الكامل بهذه الشروط والأحكام.</p><h3>2. حقوق الملكية الفكرية</h3><p>جميع التصاميم، الأكواد المصدرية، الأنظمة، والعلامات التجارية المنشورة هي ملك حصري لـ Be Kite ومحمية بموجب القوانين الدولية للملكية الفكرية.</p><h3>3. معايير تقديم الخدمات والأنظمة السحابية</h3><p>نلتزم بتقديم أعلى معايير الجودة والأداء والاستقرار بنسبة تشغيل 99.9% مع توفير الدعم الفني المستمر لكافة الشركاء والعملاء.</p>`,
      is_active: 1,
      updated_at: '2026-08-20',
    },
    {
      id: 2,
      title: 'سياسة الخصوصية وحماية البيانات',
      title_en: 'Privacy Policy',
      slug: 'privacy-policy',
      content: `<h3>1. التزامنا بحماية الخصوصية</h3><p>نحن في Be Kite نضع حماية البيانات وسرية المعلومات على رأس أولوياتنا. تنطبق هذه السياسة على كافة المنصات والتطبيقات التي نطورها.</p><h3>2. تشفير وأمان البيانات</h3><p>تخضع كافة البيانات المرسلة لأعلى بروتوكولات التشفير العالمية AES-256 و SSL/TLS لضمان عدم وصول أي طرف غير مصرح له.</p><h3>3. عدم مشاركة البيانات</h3><p>نحن لا نبيع أو نؤجر أو نشارك أي بيانات شخصية أو معلومات خاصة بعملائنا مع أي جهات خارجية إلا بموافقة صريحة أو امتثالاً للقوانين السارية.</p>`,
      is_active: 1,
      updated_at: '2026-08-20',
    },
    {
      id: 3,
      title: 'عن بي كايت | ثقافة الشركة والرؤية',
      title_en: 'About Be Kite & Vision',
      slug: 'about-us',
      content: `<h3>من نحن | Who We Are</h3><p>بي كايت هي وكالة رقمية هجينة وشركة تكنولوجيا تجمع بين التخطيط الاستراتيجي الرفيع والقدرة العميقة على التنفيذ الهندسي المتطور لمساعدة الشركات على التحول والنمو المستدام.</p><h3>رؤيتنا | Our Vision</h3><p>بناء التكنولوجيا التي تساعد الشركات على الازدهار وتحويل الأفكار الطموحة إلى واقع رقمي ريادي في الشرق الأوسط والعالم.</p>`,
      is_active: 1,
      updated_at: '2026-08-20',
    },
  ],

  // ===== News & Articles =====
  newsEvents: [
    {
      id: 1,
      title: 'إطلاق الإصدار 2.0 من منصة Be Kite السحابية ونظام تجارة الذكي',
      title_en: 'Launch of Be Kite 2.0 & Tijara E-Commerce Engine',
      slug: 'launch-of-bekite-2-and-tijara',
      excerpt: 'يسر شركة Be Kite الإعلان عن إطلاق أحدث معمارية برمجية تدعم الربط المباشر مع أنظمة Oracle و SAP.',
      content: 'تتضمن التحديثات الجديدة تحسينات غير مسبوقة على سرعة معالجة البيانات، دعم الفوترة الإلكترونية ZATCA، وتوفير لوحات تحكم متقدمة لإدارة البورتفوليو والأنظمة السحابية.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      category: 'أخبار الشركة',
      category_en: 'Company News',
      is_active: 1,
      views_count: 1250,
      created_at: '2026-08-15',
    },
    {
      id: 2,
      title: 'Be Kite تحصد جائزة أفضل شريك للتحول الرقمي وتطوير المنتجات',
      title_en: 'Be Kite Wins Best Digital Transformation Partner Award',
      slug: 'bekite-digital-transformation-award',
      excerpt: 'تكريم فريق العمل تقديراً للمشاريع الريادية والأنظمة البرمجية المبتكرة المقدمة لكبرى الشركات.',
      content: 'يأتي هذا التكريم تتويجاً لجهود الفريق في تسليم أكثر من 12 مشروعاً ضخماً خلال العام الحالي بنسب رضا بلغت 99%.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      category: 'جوائز وتقديرات',
      category_en: 'Awards',
      is_active: 1,
      views_count: 890,
      created_at: '2026-08-01',
    },
  ],

  // ===== Admins & Roles =====
  admins: [
    {
      id: 1,
      name: 'مدير النظام',
      email: 'admin@bekite.com',
      role: 'super_admin',
      role_name: 'مدير عام النظام (Super Admin)',
      status: 1,
      is_active: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      created_at: '2025-01-01',
    },
    {
      id: 2,
      name: 'سارة خالد',
      email: 'sara@bekite.com',
      role: 'manager',
      role_name: 'مدير العمليات والتسويق',
      status: 1,
      is_active: 1,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      created_at: '2025-02-15',
    },
  ],

  // ===== Notifications =====
  notifications: [
    {
      id: 1,
      title: 'طلب مشروع جديد وارد من مجموعة الخليج',
      message: 'قام م. راشد بطلب استشارة لنظام ERP مخصص بميزانية تفوق $20,000.',
      type: 'order',
      action_url: '/admin/service-requests',
      is_read: 0,
      read_at: null,
      created_at: '2026-08-29T10:30:00Z',
    },
    {
      id: 2,
      title: 'طلب ترخيص تجريبي لمنصة تجارة Tijara',
      message: 'قام سامر قنديل بطلب تجربة لوحة تحكم تجارة لمتجر في السعودية.',
      type: 'message',
      action_url: '/admin/service-requests',
      is_read: 0,
      read_at: null,
      created_at: '2026-08-29T12:00:00Z',
    },
    {
      id: 3,
      title: 'طلب توظيف جديد لمنصب Senior Frontend Engineer',
      message: 'تم استلام طلب تقديم جديد مع السيرة الذاتية ورابط GitHub.',
      type: 'review',
      action_url: '/admin/knowledge-guides',
      is_read: 1,
      read_at: '2026-08-28T15:00:00Z',
      created_at: '2026-08-28T14:30:00Z',
    },
  ],

  // ===== System Activity Logs =====
  activityLogs: [
    {
      id: 1,
      admin_name: 'مدير النظام',
      action: 'تحديث بيانات مشروع',
      description: 'تحديث معرض الصور وإحصائيات مشروع Iris Flowers',
      ip_address: '192.168.1.1',
      created_at: '2026-08-29 13:45:00',
    },
    {
      id: 2,
      admin_name: 'مدير النظام',
      action: 'تغيير حالة طلب عميل',
      description: 'تغيير حالة طلب م. راشد الحنيطي إلى قيد التنفيذ In Progress',
      ip_address: '192.168.1.1',
      created_at: '2026-08-29 12:20:00',
    },
    {
      id: 3,
      admin_name: 'سارة خالد',
      action: 'إضافة شاغر وظيفي',
      description: 'نشر شاغر UI/UX & Digital Product Designer',
      ip_address: '192.168.1.5',
      created_at: '2026-08-28 10:15:00',
    },
  ],

  // ===== Platform Settings =====
  settings: [
    { key: 'site_name', value: 'بي كايت | Be Kite Platform' },
    { key: 'site_name_en', value: 'Be Kite | Smart Digital & Marketing Solutions' },
    { key: 'site_description', value: 'منظومة سحابية متكاملة وأتمتة برمجية فائقة السرعة لإدارة وتطوير الأعمال والمؤسسات الكبرى' },
    { key: 'site_description_en', value: 'From Zero to Hero Grow Your Brand with Be Kite - Hybrid Digital Agency & Technology Company' },
    { key: 'email', value: 'info@bekite.com' },
    { key: 'support_email', value: 'support@bekite.com' },
    { key: 'phone', value: '+962 6 555 1234' },
    { key: 'whatsapp', value: '+962 79 123 4567' },
    { key: 'address', value: 'عمان، الأردن - مجمع الملك حسين للأعمال (Building 23)' },
    { key: 'address_en', value: 'Amman, Jordan - King Hussein Business Park' },
    { key: 'currency', value: 'USD' },
    { key: 'currency_symbol', value: '$' },
    { key: 'logo', value: '/logo-dashboard.png' },
    { key: 'favicon', value: '/favicon.svg' },
    { key: 'footer_logo', value: '/logo-dashboard.png' },
    { key: 'facebook', value: 'https://facebook.com/bekite' },
    { key: 'instagram', value: 'https://instagram.com/bekite' },
    { key: 'linkedin', value: 'https://linkedin.com/company/bekite' },
    { key: 'twitter', value: 'https://twitter.com/bekite' },
    { key: 'github', value: 'https://github.com/bekite' },
  ],
};
