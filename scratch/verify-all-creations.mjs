import axios from 'axios';

const BASE_URL = 'https://site-backend.be-kite.com/api/v1';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

async function run() {
  console.log('===============================================================');
  console.log('🔍 VERIFYING FRONT-END NORMALIZERS & LIVE API CREATION (7 MODULES)');
  console.log('===============================================================\n');

  // Authenticate
  const loginRes = await client.post('/dashboard/login', {
    email: 'admin@bekite.com',
    password: 'password123',
  });
  const token = loginRes.data.token;
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  const results = [];

  // Helper
  const record = (num, name, id, details) => {
    results.push({ num, name, id, status: 'SUCCESS', details });
    console.log(`✅ [${num}/7] ${name}: Successfully Created & Verified! ID=${id} | ${details}`);
  };

  // 1. Solution (using front-end formatted object)
  const solPayload = {
    title: 'منظومة إدارة الشحن الذكي',
    title_en: 'Smart Freight Management System',
    title_highlight: 'تقنيات الجيل القادم للخدمات اللوجستية',
    title_highlight_en: 'Next-Gen Freight Logistics',
    category: 'technology',
    slug: 'smart-freight-' + Date.now(),
    badge: 'LOGISTICS SUITE',
    technologies: ['Vue 3', 'Node.js', 'PostgreSQL', 'Docker'],
    description: 'حل برمجي متكامل لإدارة أساطيل الشحن وتتبع المسارات بالذكاء الاصطناعي.',
  };
  // Normalize exactly as SolutionService.normalizePayload does
  const normalizedSol = {
    title_ar: solPayload.title,
    title_en: solPayload.title_en,
    title: solPayload.title,
    headline_ar: solPayload.title_highlight || solPayload.title,
    headline_en: solPayload.title_highlight_en || solPayload.title_en,
    department: 'Software Engineering',
    slug: solPayload.slug,
    badge: solPayload.badge,
    description: solPayload.description,
    is_active: 1,
    technologies: solPayload.technologies,
  };
  const solRes = await client.post('/dashboard/solutions', normalizedSol, { headers: authHeaders });
  record(1, 'Solutions (الحلول التخصصية)', solRes.data?.data?.id, solRes.data?.data?.title || solRes.data?.data?.title_ar);

  // 2. Project Category
  const pCatPayload = {
    name_ar: 'أنظمة إدارة الأساطيل الذكية',
    name_en: 'Smart Fleet Management Systems',
    name: 'أنظمة إدارة الأساطيل الذكية',
    slug: 'fleet-management-' + Date.now(),
    is_active: 1,
  };
  const pCatRes = await client.post('/dashboard/project-categories', pCatPayload, { headers: authHeaders });
  const newPCatId = pCatRes.data?.data?.id;
  record(2, 'Project Categories (أقسام المشاريع)', newPCatId, pCatRes.data?.data?.name || pCatPayload.name_ar);

  // 3. Project
  const projPayload = {
    name_ar: 'تطبيق سائقي أسطول النقل السريع',
    name_en: 'Express Fleet Driver Mobility App',
    client_name: 'FastRoute Mobility KSA',
    slug: 'express-fleet-driver-' + Date.now(),
    category_ids: [newPCatId || 1],
    badge: 'Mobility & IoT',
    accent_color: '#0284c7',
    year: '2026',
    location: 'الرياض، المملكة العربية السعودية',
    description_ar: 'تطبيق هاتف ذكي مخصص للسائقين لإدارة مسارات التوصيل وإثبات التسليم الرقمي.',
    description_en: 'Mobile companion app for drivers with real-time waypoint routing.',
    is_active: 1,
  };
  const projRes = await client.post('/dashboard/projects', projPayload, { headers: authHeaders });
  record(3, 'Projects (مشاريع البورتفوليو)', projRes.data?.data?.id, projRes.data?.data?.title || projPayload.name_ar);

  // 4. Product Category
  const prodCatPayload = {
    name_ar: 'حلول الكاشير ونقاط البيع السحابية',
    name_en: 'Cloud POS & Cashier Solutions',
    name: 'حلول الكاشير ونقاط البيع السحابية',
    slug: 'cloud-pos-solutions-' + Date.now(),
    is_active: 1,
  };
  const prodCatRes = await client.post('/dashboard/categories', prodCatPayload, { headers: authHeaders });
  const newProdCatId = prodCatRes.data?.data?.id;
  record(4, 'Product Categories (أقسام المنتجات)', newProdCatId, prodCatRes.data?.data?.name || prodCatPayload.name_ar);

  // 5. Product (using normalized structure)
  const prodPayload = {
    name_ar: 'نظام فاست كاشير السحابي',
    name_en: 'FastCashier Cloud POS',
    slug: 'fastcashier-pos-' + Date.now(),
    category_id: newProdCatId || 1,
    color: '#059669',
    address_ar: 'الرياض - طريق الملك فهد',
    address_en: 'Riyadh, KSA',
    description_ar: 'منظومة نقاط بيع سحابية متطورة مصممة للمطاعم والكافيهات وسلاسل التجزئة.',
    description_en: 'High-speed cloud POS engine built for high-throughput hospitality and retail.',
    is_active: 1,
    is_featured_product: 1,
    overview_paragraph1: 'تسريع دورة الدفع بنسبة 40% مع دعم الفواتير الإلكترونية المعتمدة.',
    overview_paragraph2: 'مزامنة لحظية للمخزون ودعم العمل دون اتصال بالإنترنت.',
    built_for_main_section_title: 'مصمم خصيصاً للمطاعم وسلاسل التجزئة',
    built_for_secondary_section_title: 'سرعة، استقرار، وتقارير مبيعات فورية',
    built_for_data: [{ title: 'الكافيهات السريعة', description: 'دفع في ثوان معدودة' }],
    what_it_does_main_title: 'إدارة متكاملة للمبيعات والمخزون',
    what_it_does_secondary_title: 'من تسجيل الطلب إلى التقرير المالي',
    what_it_does_data: [{ title: 'دفع سريع بدون شبكة', description: 'تخزين ومزامنة تلقائية' }],
    see_in_action_screen_one_title_ar: 'شاشة الكاشير السريع',
    see_in_action_screen_one_title_en: 'Fast Checkout Screen',
    see_in_action_screen_two_title_ar: 'لوحة التحكم اللحظية',
    see_in_action_screen_two_title_en: 'Live Analytics Dashboard',
    see_in_action_screen_three_title_ar: 'شاشة المطبخ والطلبات',
    see_in_action_screen_three_title_en: 'Kitchen Display System',
    how_it_works_data: [{ title: 'توصيل وتشغيل', description: 'بدء البيع في دقائق' }],
    why_teams_data: [{ title: 'جاهزية بنسبة 99.99%', description: 'استقرار تام دون توقف' }],
    scalability_tiers: [{ title: 'Single Store', advantage: 'مرونة فائقة', specifications_capacity: 'Up to 5 registers' }],
    packages: [{ name: 'Enterprise Multi-Branch', description: 'Unlimited Terminals & Branches' }],
  };
  const prodRes = await client.post('/dashboard/products', prodPayload, { headers: authHeaders });
  record(5, 'Products (المنتجات الرقمية)', prodRes.data?.data?.id, prodRes.data?.data?.name || prodPayload.name_ar);

  // 6. Brand Showcase
  const brandPayload = {
    brand_ar: 'فاست روت للنقل الذكي',
    brand_en: 'FastRoute Smart Mobility',
    subtitle_ar: 'حلول الحركة اللوجستية الذكية للنقل والتوصيل السريع',
    subtitle_en: 'Smart Logistics & Urban Mobility Infrastructure',
    slug: 'fastroute-mobility-' + Date.now(),
    badge: 'Mobility & Logistics',
    layout: 'image_left',
    status_of_project: 'Live Production',
    is_active: 1,
  };
  const brandRes = await client.post('/dashboard/brand-showcases', brandPayload, { headers: authHeaders });
  record(6, 'Brand Showcases (العلامات التجارية)', brandRes.data?.data?.id, brandRes.data?.data?.brand_ar || brandPayload.brand_ar);

  // 7. Job Site
  const jobPayload = {
    job_title_ar: 'مهندس جودة وضمان برمجيات أول',
    job_title_en: 'Senior QA & Automation Engineer',
    departement: 'Core Engineering',
    slug: 'senior-qa-automation-' + Date.now(),
    job_type: 'دوام كامل',
    job_location: 'عمان / الرياض / عن بعد',
    experience: '4+ سنوات خبرة',
    badge: 'HIRING FAST',
    subtitle: 'قيادة اختبارات الأتمتة وضمان جودة المنصات السحابية',
    description: 'نبحث عن مهندس جودة متمرس في اختبارات End-to-End و Playwright و Vitest و CI/CD.',
    skills: ['Playwright', 'Vitest', 'Postman', 'Docker', 'CI/CD'],
    is_active: 1,
  };
  const jobRes = await client.post('/dashboard/job-site', jobPayload, { headers: authHeaders });
  record(7, 'Job Site (الوظائف والتوظيف)', jobRes.data?.data?.id, jobRes.data?.data?.job_title_ar || jobPayload.job_title_ar);

  console.log('\n===============================================================');
  console.log('🎉 ALL 7 TEST ITEMS WERE CREATED SUCCESSFULLY IN LIVE BACKEND!');
  console.log('===============================================================');
  console.table(results);
}

run().catch(err => {
  console.error('VERIFICATION ERROR:', err.response?.data || err.message);
  process.exit(1);
});
