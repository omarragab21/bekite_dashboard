import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://site-backend.be-kite.com/api/v1';

function fileToBlob(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let mimeType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
  else if (ext === '.svg') mimeType = 'image/svg+xml';
  else if (ext === '.webp') mimeType = 'image/webp';

  const buffer = fs.readFileSync(filePath);
  return new Blob([buffer], { type: mimeType });
}

async function run() {
  console.log('====================================================');
  console.log('🚀 Seeding 5 Digital Products to Live API (Be Kite)');
  console.log('====================================================\n');

  // 1. Authenticate
  console.log('🔐 Step 1: Logging in to Dashboard API...');
  const loginRes = await fetch(`${BASE_URL}/dashboard/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email: 'admin@bekite.com', password: 'password123' })
  }).then(r => r.json());

  if (!loginRes.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginRes));
  }
  const token = loginRes.token;
  console.log('✅ Logged in successfully. Token acquired.\n');

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  // 2. Fetch or Create Categories
  console.log('📂 Step 2: Ensuring Categories exist for the 5 products...');
  const catRes = await fetch(`${BASE_URL}/dashboard/categories`, { headers: authHeaders }).then(r => r.json());
  let currentCats = catRes.data || [];
  console.log(`Found ${currentCats.length} existing categories.`);

  const neededCategories = [
    { name_en: 'Customer Management Solutions', name_ar: 'حلول إدارة العملاء' },
    { name_en: 'Retail & POS Systems', name_ar: 'أنظمة نقاط البيع والتجزئة' },
    { name_en: 'Enterprise Cloud & ERP', name_ar: 'الأنظمة المؤسسية والسحابية ERP' },
    { name_en: 'Education & Learning Systems', name_ar: 'أنظمة التعليم والتدريب الإلكتروني' },
    { name_en: 'Booking & Hospitality Systems', name_ar: 'أنظمة الحجوزات والمواعيد والضيافة' },
  ];

  for (const nc of neededCategories) {
    const exists = currentCats.find(c => 
      c.name?.toLowerCase().includes(nc.name_en.toLowerCase()) || 
      c.translations?.en?.name?.toLowerCase() === nc.name_en.toLowerCase()
    );
    if (!exists) {
      console.log(`Creating category: ${nc.name_en} / ${nc.name_ar}...`);
      const createRes = await fetch(`${BASE_URL}/dashboard/categories`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(nc)
      }).then(r => r.json());
      if (createRes.data) {
        currentCats.push(createRes.data);
      }
    }
  }

  // Refresh categories
  const catListUpdated = await fetch(`${BASE_URL}/dashboard/categories`, { headers: authHeaders }).then(r => r.json());
  currentCats = catListUpdated.data || currentCats;
  console.log(`Total categories ready: ${currentCats.length}\n`);

  const catMap = {};
  currentCats.forEach(c => {
    catMap[c.slug] = c.id;
  });

  const catRetailPos = currentCats.find(c => c.slug.includes('retail') || c.slug.includes('pos'))?.id || currentCats[0].id;
  const catCustomer = currentCats.find(c => c.slug.includes('customer'))?.id || currentCats[0].id;
  const catErp = currentCats.find(c => c.slug.includes('erp') || c.slug.includes('cloud'))?.id || currentCats[0].id;
  const catEducation = currentCats.find(c => c.slug.includes('education') || c.slug.includes('learning'))?.id || currentCats[0].id;
  const catBooking = currentCats.find(c => c.slug.includes('booking') || c.slug.includes('hospitality'))?.id || currentCats[0].id;

  // 3. Define the 5 Complete Products
  const products = [
    // PRODUCT 1: TIJARA POS
    {
      name_ar: 'تجارة - منظومة نقاط البيع السحابية والتجزئة',
      name_en: 'Tijara Cloud POS & Retail Suite',
      slug: 'tijara-pos-system',
      category_id: catRetailPos,
      color: '#1E3A8A',
      address_ar: 'عمان، الأردن - شارع الملكة رانيا',
      address_en: 'Amman, Jordan - Queen Rania St',
      description_ar: 'نظام نقاط بيع سحابي متكامل يخدم قطاع التجزئة والمطاعم مع مزامنة فورية وإصدار فواتير ضريبية وإدارة المستودعات.',
      description_en: 'All-in-one cloud POS and retail omnichannel suite featuring instant edge sync, multi-warehouse control, and certified tax compliance.',
      is_featured_product: '1',
      is_active: '1',
      overview_paragraph1: 'منظومة سحابية متطورة تمنحك تحكماً مطلقاً في دورة المبيعات اليومية، معالجة الدفع السريع، وتحديث حركة المخزون عبر كافة نقاط البيع والفروع في لحظات.',
      overview_paragraph2: 'مصمم خصيصاً للعمل في البيئات الهجينة دون انقطاع، مما يتيح لك الاستمرار في إصدار الفواتير وتسجيل العمليات حتى في حال انقطاع الاتصال بالإنترنت مع مزامنة تلقائية لاحقة.',
      overview_tablet_image: '/Users/omarragab/Projects/bekite/public/images/products/tijara_overview.png',
      built_for_main_section_title: 'صُمم خصيصاً للمتاجر والمطاعم العصرية',
      built_for_secondary_section_title: 'أداء عالي السرعة، موثوقية فائقة، وقابلية للتوسع في سلاسل الفروع المتعددة',
      built_for_data: [
        {
          title: 'المطاعم والمقاهي',
          description: 'إدارة الطاولات، تجزئة الفاتورة، وربط شاشات عرض المطبخ مع طابعات الإيصالات اللاسلكية.'
        },
        {
          title: 'متاجر التجزئة والسوبرماركت',
          description: 'مسح الباركود بسرعة فائقة، إصدار الفواتير الفورية، والتحكم في حد إعادة الطلب للمنتجات.'
        }
      ],
      what_it_does_main_title: 'عمليات تشغيلية موحدة من الكاشير إلى المستودع',
      what_it_does_secondary_title: 'كل ما تحتاجه بدءاً من إرسال الطلبات إلى تقفيل الحسابات والمطابقة المحاسبية',
      what_it_does_data: [
        {
          title: 'كاشير يعمل بدون إنترنت (Offline-First)',
          description: 'استمرارية تامة لعمليات البيع دون توقف مع تخزين مؤقت للعمليات والمزامنة الفورية عند عودة الاتصال.'
        },
        {
          title: 'فوترة إلكترونية معتمدة',
          description: 'دعم كامل لاشتراطات الفوترة الإلكترونية وضريبة القيمة المضافة مع تشفير الفواتير وطباعة الـ QR Code.'
        }
      ],
      see_in_action_main_image: '/Users/omarragab/Projects/bekite/public/images/products/tijara_action_main.png',
      screens: [
        {
          title_ar: 'شاشة الكاشير السريعة',
          title_en: 'Rapid Checkout Terminal',
          file: '/Users/omarragab/Projects/bekite/public/images/products/tijara_action_1.png'
        },
        {
          title_ar: 'لوحة تحليلات المبيعات الفورية',
          title_en: 'Real-Time Sales Telemetry',
          file: '/Users/omarragab/Projects/bekite/public/images/products/tijara_action_2.png'
        },
        {
          title_ar: 'شاشة تحكم المطبخ والطلبات',
          title_en: 'Kitchen Display System (KDS)',
          file: '/Users/omarragab/Projects/bekite/public/images/products/tijara_action_3.png'
        }
      ],
      how_it_works_data: [
        {
          title: 'تسجيل وتشغيل الأجهزة',
          description: 'مسح رمز الاستجابة السريعة (QR) على أجهزة الكاشير أو التابلت لبدء العمل في دقائق.'
        },
        {
          title: 'مزامنة السحابة التلقائية',
          description: 'تحديث الأسعار والمخزون وحسابات الولاء تلقائياً من الإدارة المركزية إلى الفروع.'
        }
      ],
      why_teams_data: [
        {
          title: 'موثوقية سحابية بنسبة 99.99%',
          description: 'عقد سحابية موزعة تضمن عدم تعطل أجهزة البيع وحماية تامة للبيانات والمعاملات.'
        },
        {
          title: 'دعم فني وتدريب متكامل',
          description: 'فريق دعم متخصص لتهيئة الأجهزة وتدريب الكوادر الميدانية على مدار الساعة.'
        }
      ],
      scalability_tiers: [
        {
          title: 'متجر أحادي الفرع (Single Store)',
          advantage: 'تشغيل فوري بأقل تكلفة استثمارية، مصمم للمتاجر الفردية والمقاهي الناشئة.',
          specifications_capacity: 'حتى نقطتي بيع (2 Terminals)، 5,000 صنف، ونسخ احتياطي يومي آلي.'
        },
        {
          title: 'سلاسل الفروع (Enterprise Multi-Branch)',
          advantage: 'إدارة مركزية لسلسلة الفروع مع تقارير مبيعات مجمعة ومستودعات إقليمية.',
          specifications_capacity: 'نقاط بيع ومستودعات غير محدودة مع ربط واجهات برمجة التطبيقات (API).'
        }
      ],
      packages: [
        {
          name: 'باقة التجارة الاحترافية',
          description: 'تشمل نقاط البيع السحابية، إدارة المخزون، والفوترة الضريبية الإلكترونية.'
        },
        {
          name: 'باقة المؤسسات وسلاسل الفروع',
          description: 'نقاط بيع غير محدودة، إدارة متعددة للمستودعات، وربط مخصص بالأنظمة المحاسبية.'
        }
      ]
    },

    // PRODUCT 2: WAJHA ENTERPRISE CMS & PORTAL
    {
      name_ar: 'واجهة - المنظومة الرقمية وإدارة المحتوى المؤسسي B2B',
      name_en: 'Wajha Enterprise Portal & Modern CMS',
      slug: 'wajha-enterprise-portal',
      category_id: catCustomer,
      color: '#7C3AED',
      address_ar: 'الرياض، المملكة العربية السعودية - طريق الملك فهد',
      address_en: 'Riyadh, Saudi Arabia - King Fahd Rd',
      description_ar: 'منصة تفاعلية سريعة ومتقدمة لبناء البوابات والمواقع المؤسسية مع نظام إدارة محتوى مرن، تحسين محركات البحث، وجلب العملاء المحتملين.',
      description_en: 'High-performance headless corporate portal and B2B CMS platform delivering lightning-fast page loads, lead automation, and enterprise SEO.',
      is_featured_product: '1',
      is_active: '1',
      overview_paragraph1: 'تمنح منصة واجهة المؤسسات والشركات الكبرى واجهة تفاعلية رفيعة المستوى تليق بمكانتها السوقية، مع تصميم متجاوب فائق السرعة يجذب كبار العملاء ويعزز المصداقية الرقمية.',
      overview_paragraph2: 'مزودة بمحرك إدارة محتوى متعدد اللغات فائق المرونة يتيح لفرق التسويق نشر المقالات، الصفحات الترويجية، ودراسات الحالة دون كتابة سطر برمجي واحد.',
      overview_tablet_image: '/Users/omarragab/Projects/bekite/public/images/products/wajha.png',
      built_for_main_section_title: 'صُمم لتمكين العلامات التجارية والشركات الرائدة',
      built_for_secondary_section_title: 'بناء حضور رقمي فخم يجلب الفرص الاستثمارية والصفقات الكبرى',
      built_for_data: [
        {
          title: 'الشركات القابضة والمجموعات الاستثمارية',
          description: 'إبراز قطاعات الأعمال، التقارير السنوية، والرسائل الاستراتيجية للشركاء والمستثمرين.'
        },
        {
          title: 'شركات الخدمات الاحترافية والـ B2B',
          description: 'استعراض دراسات الحالة، قياس معدل التحويل، وجلب طلبات عروض الأسعار بصورة مؤتمتة.'
        }
      ],
      what_it_does_main_title: 'أدوات تسويقية متقدمة لبناء الثقة والنمو',
      what_it_does_secondary_title: 'من سرعة التحميل الخاطفة إلى تكامل أدوات التحليل وإدارة العملاء',
      what_it_does_data: [
        {
          title: 'بناء الصفحات البصري السريع',
          description: 'تخطيط مرن مع مكتبة مكونات تفاعلية تتوافق 100% مع الهوية البصرية المؤسسية.'
        },
        {
          title: 'أرشفة متقدمة لمحركات البحث (SEO)',
          description: 'هيكلة بيانات Schema، خريطة موقع لحظية، وسرعة قياسية في مؤشرات Core Web Vitals.'
        }
      ],
      see_in_action_main_image: '/Users/omarragab/Projects/bekite/public/images/web_dev_hero_laptop.jpg',
      screens: [
        {
          title_ar: 'شاشة إدارة الصفحات والمحتوى',
          title_en: 'Visual Page Builder Interface',
          file: '/Users/omarragab/Projects/bekite/public/images/web_dev_responsive_devices.jpg'
        },
        {
          title_ar: 'لوحة تتبع الزوار والعملاء المحتملين',
          title_en: 'Lead Telemetry & Analytics Hub',
          file: '/Users/omarragab/Projects/bekite/public/images/hero_laptop_dashboard.jpg'
        },
        {
          title_ar: 'شاشة تخصيص الهوية واللغات',
          title_en: 'Multilingual & Theme Customizer',
          file: '/Users/omarragab/Projects/bekite/public/images/manzli_dashboard.jpg'
        }
      ],
      how_it_works_data: [
        {
          title: 'اختيار القوالب والهوية',
          description: 'تطبيق ألوان المؤسسة، خطوطها الرسمية، وتنسيق الأقسام وفق أدلة العلامة التجارية.'
        },
        {
          title: 'النشر الفوري على شبكة Edge السحابية',
          description: 'توزيع المحتوى عبر شبكات التوصيل السحابي العالمية لضمان سرعة تصفح لا تتجاوز جزءاً من الثانية.'
        }
      ],
      why_teams_data: [
        {
          title: 'حماية أمنية وبنية سحابية معزولة',
          description: 'شهادات أمان SSL متقدمة وحماية ضد هجمات حجب الخدمة DDoS مع فحص دوري للثغرات.'
        },
        {
          title: 'لوحة تحكم عربية بالكامل',
          description: 'سهولة إدارة المحتوى لجميع مسؤولي العلاقات العامة وفرق التواصل المؤسسي.'
        }
      ],
      scalability_tiers: [
        {
          title: 'البوابة المؤسسية الفردية (Corporate Portal)',
          advantage: 'حضور رقمي متكامل مع إدارة الخدمات والمدونة ونماذج استقطاب العملاء.',
          specifications_capacity: 'عدد صفحات غير محدود، حتى 50,000 زائر شهرياً، ونسخ احتياطي يومي.'
        },
        {
          title: 'منظومة المواقع المتعددة (Multi-Brand Network)',
          advantage: 'لوحة مركزية واحدة تدير مواقع متعددة تابعة لنفس المجموعة القابضة.',
          specifications_capacity: 'مواقع ونطاقات غير محدودة مع عزل كامل لقواعد البيانات والصلاحيات.'
        }
      ],
      packages: [
        {
          name: 'باقة البوابة المؤسسية الرسمية',
          description: 'موقع ويب متكامل، نظام إدارة محتوى متعدد اللغات، وتكامل نماذج التواصل.'
        },
        {
          name: 'باقة المجموعات والشركات القابضة',
          description: 'إدارة عدة بوابات وفروع، دعم النطاقات المخصصة، وتكامل مباشر مع أنظمة CRM.'
        }
      ]
    },

    // PRODUCT 3: MASAR CLOUD ERP
    {
      name_ar: 'مسار - السحابة المحاسبية وإدارة الموارد المؤسسية (ERP)',
      name_en: 'Masar Cloud ERP & Financial Suite',
      slug: 'masar-cloud-erp',
      category_id: catErp,
      color: '#059669',
      address_ar: 'دبي، الإمارات العربية المتحدة - الخليج التجاري',
      address_en: 'Dubai, UAE - Business Bay',
      description_ar: 'نظام ERP سحابي متكامل يجمع بين المحاسبة العامة، دورة المشتريات والمبيعات، الفوترة الإلكترونية، وإدارة الأصول والموارد البشرية.',
      description_en: 'Next-generation cloud ERP connecting financial accounting, supply chain procurement, inventory reconciliation, and HR payroll.',
      is_featured_product: '1',
      is_active: '1',
      overview_paragraph1: 'تمنحك سحابة مسار المحاسبية رؤية مالية استراتيجية لحظية لجميع التدفقات النقدية، الحسابات المدينة والدائنة، وميزان المراجعة مع مطابقة بنكية تلقائية.',
      overview_paragraph2: 'مترابط بالكامل مع دورة المستودعات والمشتريات وسندات الصرف والقبض، وممتثل بدقة لمتطلبات هيئات الزكاة والضريبة والجمارك في الخليج والشرق الأوسط.',
      overview_tablet_image: '/Users/omarragab/Projects/bekite/public/images/products/masar.png',
      built_for_main_section_title: 'صُمم للشركات المتوسطة والمؤسسات الكبرى',
      built_for_secondary_section_title: 'ضبط مالي حازم، حوكمة إدارية، وتقارير أرباح وخسائر دقيقة على مدار الساعة',
      built_for_data: [
        {
          title: 'المدراء الماليون (CFOs)',
          description: 'مراقبة السيولة النقدية، تحليل هوامش الربحية، واعتماد القيود المحاسبية المعقدة بضغطة زر.'
        },
        {
          title: 'مدراء سلاسل الإمداد والمشتريات',
          description: 'أتمتة أوامر الشراء، فواتير الموردين، ومطابقة الاستلام مع فواتير الشراء بدقة 100%.'
        }
      ],
      what_it_does_main_title: 'تكامل مالي ومحاسبي غير مسبوق',
      what_it_does_secondary_title: 'دليل حسابات شجري مرن، قيود يومية ذكية، وموازين مراجعة لحظية',
      what_it_does_data: [
        {
          title: 'مطابقة الحسابات البنكية آلياً',
          description: 'استيراد كشوفات الحسابات ومطابقة المعاملات المالية المكتملة دون تدخل بشري.'
        },
        {
          title: 'إدارة مراكز التكلفة والمشاريع',
          description: 'توزيع المصروفات والإيرادات على المشاريع والفروع لمعرفة ربحية كل وحدة تشغيلية بدقة.'
        }
      ],
      see_in_action_main_image: '/Users/omarragab/Projects/bekite/public/images/bekite_erp_hero_dashboard.png',
      screens: [
        {
          title_ar: 'لوحة العمليات المالية والميزانية',
          title_en: 'General Ledger & Financial Control',
          file: '/Users/omarragab/Projects/bekite/public/images/madroubty_dashboard.jpg'
        },
        {
          title_ar: 'شاشة الفوترة الإلكترونية والضرائب',
          title_en: 'Automated Tax & E-Invoicing Engine',
          file: '/Users/omarragab/Projects/bekite/public/images/nawad_dashboard.jpg'
        },
        {
          title_ar: 'مركز تقارير الأرباح والتدفقات النقدية',
          title_en: 'Cash Flow & Predictive Forecasts',
          file: '/Users/omarragab/Projects/bekite/public/images/tyro_dashboard.jpg'
        }
      ],
      how_it_works_data: [
        {
          title: 'تهيئة دليل الحسابات (Chart of Accounts)',
          description: 'تجهيز الهيكل المالي وفق المعايير المحاسبية الدولية IFRS وتخصيص الفترات المالية.'
        },
        {
          title: 'ربط المستودعات والفروع',
          description: 'تسجيل الأصول، ترحيل الأرصدة الافتتاحية، وبدء إصدار سندات القيد والفواتير فوراً.'
        }
      ],
      why_teams_data: [
        {
          title: 'حوكمة وتتبع تدقيق صارم (Audit Trail)',
          description: 'سجل تدقيق كامل يرصد كل حركة وتعديل مع هوية المستخدم والوقت والوثائق المرفقة.'
        },
        {
          title: 'تشفير عالي المستوى للبيانات المالية',
          description: 'تخزين مشفر وفق أعلى معايير الحماية المصرفية مع نسخ احتياطي جغرافي متعدد.'
        }
      ],
      scalability_tiers: [
        {
          title: 'باقة الأعمال النامية (Business ERP)',
          advantage: 'محاسبة متكاملة للشركات في طور التوسع مع مراكز تكلفة وفاتورة إلكترونية.',
          specifications_capacity: 'حتى 10 مستخدمين متزامنين، 3 فروع، وتقارير مالية شاملة.'
        },
        {
          title: 'باقة المؤسسات والمجموعات (Corporate ERP)',
          advantage: 'إدارة متعددة الشركات والعملات، أصول ثابتة، ورواتب ومستودعات ضخمة.',
          specifications_capacity: 'مستخدمون وفروع غير محدودة، تكامل API مخصص، واستضافة خاصة.'
        }
      ],
      packages: [
        {
          name: 'باقة المحاسبة المتقدمة',
          description: 'المحاسبة العامة، مراكز التكلفة، الفوترة الضريبية، وسندات القبض والصرف.'
        },
        {
          name: 'منظومة مسار ERP المتكاملة',
          description: 'المحاسبة الكاملة، المشتريات، المبيعات، المخازن، وإدارة الأصول الثابتة.'
        }
      ]
    },

    // PRODUCT 4: MADRASATI
    {
      name_ar: 'مدرستي - النظام الشامل لإدارة المدارس والبيئة التعليمية',
      name_en: 'Madrasati Unified School Management & LMS',
      slug: 'madrasati-school-management',
      category_id: catEducation,
      color: '#0284C7',
      address_ar: 'الرياض، المملكة العربية السعودية - حي النرجس',
      address_en: 'Riyadh, Saudi Arabia - Al Narjis District',
      description_ar: 'منظومة تعليمية ذكية تربط الإدارة المدرسية، المعلمين، الطلاب وأولياء الأمور في بيئة رقمية تفاعلية مع جداول الحصص والدرجات والرسائل الفورية.',
      description_en: 'Comprehensive K-12 school management ecosystem featuring student information records, automated gradebooks, parent portals, and bus tracking.',
      is_featured_product: '1',
      is_active: '1',
      overview_paragraph1: 'تجمع منصة مدرستي كافة الجوانب الأكاديمية والإدارية والمالية للمدارس في مكان واحد، مما يسهم في رفع كفاءة التواصل مع أولياء الأمور وتطوير التحصيل الدراسي للطلاب.',
      overview_paragraph2: 'يتيح النظام للمعلمين رصد الحضور والغياب اليومي، إدخال الدرجات والواجبات، وإرسال التقارير التقييمية اللحظية إلى أولياء الأمور عبر التطبيق الذكي ورسائل الواتساب.',
      overview_tablet_image: '/Users/omarragab/Projects/bekite/public/images/products/madrasati.png',
      built_for_main_section_title: 'صُمم للمدارس الأهلية، الدولية، والمجمعات التعليمية',
      built_for_secondary_section_title: 'بيئة تعليمية مترابطة تعزز ثقة أولياء الأمور وترتقي بالأداء الأكاديمي',
      built_for_data: [
        {
          title: 'الإدارة المدرسية والمشرفون',
          description: 'إدارة ملفات الطلاب والموظفين، جداول الحصص المدرسية، ورصد الرسوم المدرسية والأقساط.'
        },
        {
          title: 'أولياء الأمور والطلاب',
          description: 'متابعة الواجبات، الجداول، خطوط سير الحافلات المدرسية، والتواصل المباشر مع المعلمين.'
        }
      ],
      what_it_does_main_title: 'تجربة مدرسية ذكية ومتكاملة',
      what_it_does_secondary_title: 'أدوات أكاديمية ومالية متقدمة تدعم التعليم الإلكتروني والرقمنة',
      what_it_does_data: [
        {
          title: 'دفتر الدرجات والتقارير الأكاديمية',
          description: 'حساب المعدلات تلقائياً وإصدار شهادات النتائج بصيغ رقمية موثقة ومعتمدة.'
        },
        {
          title: 'إدارة الرسوم المدرسية والأقساط',
          description: 'إشعارات سداد آلية، بوابات دفع إلكترونية مدمجة، وإصدار الفواتير الضريبية لأولياء الأمور.'
        }
      ],
      see_in_action_main_image: '/Users/omarragab/Projects/bekite/public/images/modern_office_interior.jpg',
      screens: [
        {
          title_ar: 'شاشة ملف الطالب الأكاديمي',
          title_en: 'Student Academic Profile Hub',
          file: '/Users/omarragab/Projects/bekite/public/images/about_team_meeting.jpg'
        },
        {
          title_ar: 'بوابة ولي الأمر ومتابعة الحضور',
          title_en: 'Parent Portal & Attendance Telemetry',
          file: '/Users/omarragab/Projects/bekite/public/images/team_collaboration.jpg'
        },
        {
          title_ar: 'نظام رصد الدرجات والشهادات الذكية',
          title_en: 'Automated Grading & Report Cards',
          file: '/Users/omarragab/Projects/bekite/public/images/about_desk_flatlay.jpg'
        }
      ],
      how_it_works_data: [
        {
          title: 'إدخال الهيكل الأكاديمي والفصول',
          description: 'استيراد بيانات الطلاب والصفوف والمعلمين وتوزيع المقررات والجداول الدراسية.'
        },
        {
          title: 'إطلاق بوابات التطبيقات',
          description: 'توزيع بيانات الدخول للمعلمين والطلاب وأولياء الأمور للبدء الفوري بالتفاعل.'
        }
      ],
      why_teams_data: [
        {
          title: 'سهولة الاستخدام وبساطة الواجهات',
          description: 'تصميم مريح للأجهزة الذكية يتيح للمعلم إنجاز المهام اليومية في أقل من دقيقة.'
        },
        {
          title: 'تكامل الحافلات المدرسية والخرائط',
          description: 'تتبع مسار حافلة الطالب لحظياً وإرسال تنبيه قرب وصول الحافلة للمنزل.'
        }
      ],
      scalability_tiers: [
        {
          title: 'المدرسة الواحدة (Single Campus)',
          advantage: 'نظام كامل لفرع تعليمي مستقل مع بوابة لأولياء الأمور والمعلمين.',
          specifications_capacity: 'حتى 1,500 طالب، 150 معلماً وموظفاً، ونسخ احتياطي يومي.'
        },
        {
          title: 'المجمعات وسلاسل المدارس (Multi-Campus Educational Group)',
          advantage: 'إدارة مركزية لعدة مجمعات ومدارس مع لوحة تقارير موحدة للإدارة العليا.',
          specifications_capacity: 'عدد غير محدود من المدارس والطلاب مع خوادم مخصصة ذات أداء عالٍ.'
        }
      ],
      packages: [
        {
          name: 'الباقة المدرسية القياسية',
          description: 'إدارة شؤون الطلاب، الحضور والغياب، دفتر الدرجات، وبوابة المعلمين.'
        },
        {
          name: 'الباقة الشاملة الذكية',
          description: 'تطبيق ولي الأمر، إدارة الأقساط والرسوم، تتبع الحافلات، والشهادات المعتمدة.'
        }
      ]
    },

    // PRODUCT 5: MAWED
    {
      name_ar: 'موعد - المنظومة الذكية لإدارة الحجوزات والعيادات والمراكز',
      name_en: 'Mawed Smart Scheduling & Clinic Booking Platform',
      slug: 'mawed-smart-booking',
      category_id: catBooking,
      color: '#D97706',
      address_ar: 'عمان، الأردن - منطقة عبدون',
      address_en: 'Amman, Jordan - Abdoun',
      description_ar: 'نظام حجز وجدولة ذكي للعيادات الطبية، صالونات التجميل، ومراكز الاستشارات مع مزامنة لحظية للتقويمات وتذكيرات آلية عبر الواتساب.',
      description_en: 'Smart appointment orchestration engine built for healthcare clinics, wellness salons, and consultant suites with WhatsApp alerts and payment deposits.',
      is_featured_product: '1',
      is_active: '1',
      overview_paragraph1: 'تخلص من فوضى المواعيد والانتظار مع نظام موعد الذكي، الذي يتيح لعملائك حجز المواعيد واختيار الأطباء أو الأخصائيين المفضلين عبر رابط مباشر مخصص وبكل سهولة.',
      overview_paragraph2: 'يقلل النظام من نسبة التخلف عن المواعيد بنسبة تصل إلى 75% عبر رسائل التذكير التلقائية عبر الواتساب وخاصية تأكيد أو إعادة جدولة الموعد بنقرة واحدة.',
      overview_tablet_image: '/Users/omarragab/Projects/bekite/public/images/products/mawed.png',
      built_for_main_section_title: 'صُمم للمجمعات الطبية، العيادات، ومراكز الخدمات',
      built_for_secondary_section_title: 'تنظيم دقيق لجدول الأخصائيين، استقبال فوري للمراجعين، وتقليل وقت الانتظار',
      built_for_data: [
        {
          title: 'العيادات والمراكز الطبية التخصصية',
          description: 'تنظيم غرف الكشف، الملف الطبي السريع، وإدارة مواعيد الاستشارات والمراجعات.'
        },
        {
          title: 'مراكز التجميل والاستشارات والسبا',
          description: 'حجز الخدمات المحددة، اختيار الخبير، والدفع المسبق لتأكيد الحجز.'
        }
      ],
      what_it_does_main_title: 'إدارة مواعيد فائقة السلاسة والذكاء',
      what_it_does_secondary_title: 'من حجز العميل عبر الهاتف إلى استقباله وإصدار الفاتورة عند الانتهاء',
      what_it_does_data: [
        {
          title: 'تقويم مواعيد تفاعلي متعدد الأخصائيين',
          description: 'عرض يومي وأسبوعي وشهري للجداول مع منع التعارض وتخصيص أوقات الراحة.'
        },
        {
          title: 'تذكيرات واتساب مؤتمتة (WhatsApp Automation)',
          description: 'إرسال رسائل التذكير وتأكيد الحضور مع أزرار تفاعلية لإلغاء أو تعديل الموعد.'
        }
      ],
      see_in_action_main_image: '/Users/omarragab/Projects/bekite/public/images/cloud_infra_hero_mockup.jpg',
      screens: [
        {
          title_ar: 'شاشة حجز المريض والتقويم اليومي',
          title_en: 'Live Appointment Dispatch Calendar',
          file: '/Users/omarragab/Projects/bekite/public/images/mobile_app_hero_mockup.jpg'
        },
        {
          title_ar: 'لوحة إدارة مواعيد الأطباء والموظفين',
          title_en: 'Multi-Doctor Schedule Orchestration',
          file: '/Users/omarragab/Projects/bekite/public/images/branding_marketing_hero_mockup.jpg'
        },
        {
          title_ar: 'شاشة تذكيرات الواتساب والدفع المسبق',
          title_en: 'Automated WhatsApp Reminders & Deposits',
          file: '/Users/omarragab/Projects/bekite/public/images/video_production_hero_mockup.jpg'
        }
      ],
      how_it_works_data: [
        {
          title: 'تحديد الخدمات وساعات العمل',
          description: 'إدخال قائمة الخدمات، مدة كل موعد، وأوقات دوام الأخصائيين والأطباء.'
        },
        {
          title: 'مشاركة رابط الحجز المباشر',
          description: 'نشر رابط الحجز على السوشيال ميديا، الموقع الإلكتروني، أو من خلال خدمة الاستقبال.'
        }
      ],
      why_teams_data: [
        {
          title: 'انخفاض ملموس في نسبة الغياب (No-Show)',
          description: 'تنبيهات استباقية تفاعلية تلزم العميل بالتأكيد وتتيح فتح الموعد لعميل آخر في حال الإلغاء.'
        },
        {
          title: 'تقارير الأداء والإيرادات اليومية',
          description: 'معرفة عدد المواعيد المنجزة وإيرادات كل أخصائي ونسب رضا العملاء.'
        }
      ],
      scalability_tiers: [
        {
          title: 'العيادة أو المركز الفردي (Single Practice)',
          advantage: 'جدولة متقدمة لفرع واحد مع دعم 5 أخصائيين ورسائل تذكير تلقائية.',
          specifications_capacity: 'حتى 1,000 موعد شهرياً، 5 موظفين، وتكامل بوابة الدفع.'
        },
        {
          title: 'المجمعات الطبية والمراكز الكبرى (Multi-Branch Medical Center)',
          advantage: 'إدارة عدة فروع ومراكز تخصصية مع ملف موحد للمراجع عبر كافة الفروع.',
          specifications_capacity: 'أطباء ومواعيد غير محدودة، تكامل مع أنظمة التأمين الطبي، وسيرفر خاص.'
        }
      ],
      packages: [
        {
          name: 'باقة إدارة الحجوزات الذكية',
          description: 'التقويم التفاعلي، صفحة الحجز الإلكتروني، وتأكيد المواعيد التلقائي.'
        },
        {
          name: 'باقة المجمعات الطبية والعيادات',
          description: 'أطباء متعددون، تذكيرات واتساب فورية، الفاتورة الإلكترونية، وسجل المراجعين.'
        }
      ]
    }
  ];

  // 4. Upload each product
  console.log('🚀 Step 3: Uploading the 5 products to Live Backend API...\n');
  const createdProducts = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`----------------------------------------------------`);
    console.log(`📦 [${i + 1}/5] Uploading Product: "${p.name_ar}" (${p.name_en})...`);

    const fd = new FormData();
    fd.append('name_en', p.name_en);
    fd.append('name_ar', p.name_ar);
    fd.append('address_ar', p.address_ar);
    fd.append('address_en', p.address_en);
    fd.append('description_ar', p.description_ar);
    fd.append('description_en', p.description_en);
    fd.append('category_id', String(p.category_id));
    fd.append('slug', p.slug);
    fd.append('color', p.color);
    fd.append('is_featured_product', p.is_featured_product);
    fd.append('is_active', p.is_active);

    fd.append('overview_paragraph1', p.overview_paragraph1);
    fd.append('overview_paragraph2', p.overview_paragraph2);
    fd.append('built_for_main_section_title', p.built_for_main_section_title);
    fd.append('built_for_secondary_section_title', p.built_for_secondary_section_title);

    p.built_for_data.forEach((item, idx) => {
      fd.append(`built_for_data[${idx}][title]`, item.title);
      fd.append(`built_for_data[${idx}][description]`, item.description);
    });

    fd.append('what_it_does_main_title', p.what_it_does_main_title);
    fd.append('what_it_does_secondary_title', p.what_it_does_secondary_title);

    p.what_it_does_data.forEach((item, idx) => {
      fd.append(`what_it_does_data[${idx}][title]`, item.title);
      fd.append(`what_it_does_data[${idx}][description]`, item.description);
    });

    fd.append('see_in_action_screen_one_title_ar', p.screens[0].title_ar);
    fd.append('see_in_action_screen_one_title_en', p.screens[0].title_en);
    fd.append('see_in_action_screen_two_title_ar', p.screens[1].title_ar);
    fd.append('see_in_action_screen_two_title_en', p.screens[1].title_en);
    fd.append('see_in_action_screen_three_title_ar', p.screens[2].title_ar);
    fd.append('see_in_action_screen_three_title_en', p.screens[2].title_en);

    p.how_it_works_data.forEach((item, idx) => {
      fd.append(`how_it_works_data[${idx}][title]`, item.title);
      fd.append(`how_it_works_data[${idx}][description]`, item.description);
    });

    p.why_teams_data.forEach((item, idx) => {
      fd.append(`why_teams_data[${idx}][title]`, item.title);
      fd.append(`why_teams_data[${idx}][description]`, item.description);
    });

    p.scalability_tiers.forEach((item, idx) => {
      fd.append(`scalability_tiers[${idx}][title]`, item.title);
      fd.append(`scalability_tiers[${idx}][advantage]`, item.advantage);
      fd.append(`scalability_tiers[${idx}][specifications_capacity]`, item.specifications_capacity);
    });

    p.packages.forEach((item, idx) => {
      fd.append(`packages[${idx}][name]`, item.name);
      fd.append(`packages[${idx}][description]`, item.description);
    });

    // Attach Real Images from filesystem
    fd.append('overview_tablet_image_file', fileToBlob(p.overview_tablet_image), path.basename(p.overview_tablet_image));
    fd.append('see_in_action_main_image_file', fileToBlob(p.see_in_action_main_image), path.basename(p.see_in_action_main_image));
    fd.append('see_in_action_screen_one_file', fileToBlob(p.screens[0].file), path.basename(p.screens[0].file));
    fd.append('see_in_action_screen_two_file', fileToBlob(p.screens[1].file), path.basename(p.screens[1].file));
    fd.append('see_in_action_screen_three_file', fileToBlob(p.screens[2].file), path.basename(p.screens[2].file));

    const postRes = await fetch(`${BASE_URL}/dashboard/products`, {
      method: 'POST',
      headers: authHeaders,
      body: fd
    });

    const resJson = await postRes.json();
    if (postRes.status !== 200 && postRes.status !== 201) {
      console.error(`❌ Failed to create product: ${p.name_en}`, resJson);
      throw new Error(`Upload failed for product ${p.name_en}`);
    }

    const createdData = resJson.data || resJson;
    console.log(`✅ Success! Created with ID: ${createdData.id}, Slug: ${createdData.slug}`);
    console.log(`   Images uploaded on server:`);
    console.log(`   - Overview Tablet: ${createdData.overview_tablet_image_url || 'Saved'}`);
    console.log(`   - Main Showcase: ${createdData.see_in_action_main_image_url || 'Saved'}`);
    console.log(`   - Screen 1: ${createdData.see_in_action_screen_one_url || 'Saved'}`);
    console.log(`   - Screen 2: ${createdData.see_in_action_screen_two_url || 'Saved'}`);
    console.log(`   - Screen 3: ${createdData.see_in_action_screen_three_url || 'Saved'}`);

    createdProducts.push(createdData);
  }

  // 5. Verification on Public & Private APIs
  console.log('\n====================================================');
  console.log('🔍 Step 4: Verification of Live Products');
  console.log('====================================================');
  
  const dashboardList = await fetch(`${BASE_URL}/dashboard/products`, { headers: authHeaders }).then(r => r.json());
  console.log(`📊 Dashboard API (/dashboard/products): Found ${dashboardList.data?.length} product(s).`);

  const publicList = await fetch(`${BASE_URL}/site/products`, { headers: { 'Accept': 'application/json' } }).then(r => r.json());
  console.log(`🌐 Public Website API (/site/products): Found ${publicList.data?.length} product(s).`);

  console.log('\n🎉 All 5 Digital Products have been seeded successfully with real images!\n');
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
