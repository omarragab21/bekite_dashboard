import axios from 'axios';

const BASE_URL = 'https://site-backend.be-kite.com/api/v1';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

let token = '';

async function run() {
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE LIVE BE-KITE API v1 TEST');
  console.log(`📡 Base URL: ${BASE_URL}`);
  console.log('====================================================\n');

  // 1. AUTH LOGIN
  console.log('▶️ [1/11] Authenticating Admin...');
  const loginRes = await client.post('/dashboard/login', {
    email: 'admin@bekite.com',
    password: 'password123',
  });
  token = loginRes.data.token;
  console.log(`✅ Logged in successfully! Admin: ${loginRes.data.user?.name_en} (${loginRes.data.user?.email})`);
  console.log(`🔑 Token: ${token.substring(0, 15)}...`);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  // 2. CATEGORIES CRUD
  console.log('\n▶️ [2/11] Testing Categories CRUD (/dashboard/categories)...');
  const catCreateRes = await client.post('/dashboard/categories', {
    name_en: 'Cloud Enterprise Solutions',
    name_ar: 'حلول المؤسسات السحابية',
  }, { headers: authHeaders });
  const catId = catCreateRes.data.data.id;
  console.log(`  ➕ Created Category: ID=${catId}, Name=${catCreateRes.data.data.name}`);

  const catShowRes = await client.get(`/dashboard/categories/${catId}`, { headers: authHeaders });
  console.log(`  🔍 Read Category: ID=${catShowRes.data.data.id}, Slug=${catShowRes.data.data.slug}`);

  const catUpdateRes = await client.put(`/dashboard/categories/${catId}`, {
    name_en: 'Enterprise Cloud Architecture',
    name_ar: 'بنية المؤسسات السحابية المتقدمة',
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Category: New Name=${catUpdateRes.data.data.name}`);

  const catDeleteRes = await client.delete(`/dashboard/categories/${catId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Category: ${catDeleteRes.data.message || 'OK'}`);

  // 3. PROJECT CATEGORIES CRUD
  console.log('\n▶️ [3/11] Testing Project Categories CRUD (/dashboard/project-categories)...');
  const pCatCreateRes = await client.post('/dashboard/project-categories', {
    name_en: 'FinTech & Banking Apps',
    name_ar: 'تطبيقات التقنية المالية والبنوك',
  }, { headers: authHeaders });
  const pCatId = pCatCreateRes.data.data.id;
  console.log(`  ➕ Created Project Category: ID=${pCatId}, Name=${pCatCreateRes.data.data.name}`);

  const pCatShowRes = await client.get(`/dashboard/project-categories/${pCatId}`, { headers: authHeaders });
  console.log(`  🔍 Read Project Category: ID=${pCatShowRes.data.data.id}`);

  const pCatUpdateRes = await client.put(`/dashboard/project-categories/${pCatId}`, {
    name_en: 'FinTech & High-Frequency POS',
    name_ar: 'التقنية المالية وأنظمة الدفع السريع',
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Project Category: New Name=${pCatUpdateRes.data.data.name}`);

  const pCatDeleteRes = await client.delete(`/dashboard/project-categories/${pCatId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Project Category: ${pCatDeleteRes.data.message || 'OK'}`);

  // 4. BRAND SHOWCASES CRUD
  console.log('\n▶️ [4/11] Testing Brand Showcases CRUD (/dashboard/brand-showcases)...');
  const brandCreateRes = await client.post('/dashboard/brand-showcases', {
    brand_en: 'Volt NextPay',
    brand_ar: 'ڤولت نيكست باي',
    subtitle_en: 'Omnichannel Payment Infrastructure',
    subtitle_ar: 'بنية تحتية متكاملة للمدفوعات الرقمية',
    slug: `volt-nextpay-${Date.now()}`,
    badge: 'FinTech',
    brand_color: '#0F172A',
    accent_color: '#38BDF8',
    layout: 'image_left',
    description_en: 'Unified payment gateway and digital wallet ecosystem for modern enterprises.',
    description_ar: 'بوابة دفع رقمية موحدة ونظام محفظة إلكترونية للشركات الحديثة.',
    status_of_project: 'Live Production',
    website_url: 'https://volt.be-kite.com',
    is_active: 1,
    is_coming_soon: 0,
  }, { headers: authHeaders });
  const brandId = brandCreateRes.data.data.id;
  console.log(`  ➕ Created Brand Showcase: ID=${brandId}, Name=${brandCreateRes.data.data.name || brandCreateRes.data.data.brand_en || 'Volt'}`);

  const brandShowRes = await client.get(`/dashboard/brand-showcases/${brandId}`, { headers: authHeaders });
  console.log(`  🔍 Read Brand Showcase: ID=${brandShowRes.data.data.id}, Slug=${brandShowRes.data.data.slug}`);

  const brandUpdateRes = await client.put(`/dashboard/brand-showcases/${brandId}`, {
    brand_en: 'Volt NextPay Global',
    brand_ar: 'ڤولت نيكست باي العالمية',
    subtitle_en: 'Global Omnichannel Orchestration',
    subtitle_ar: 'منظومة الدفع العالمية المتكاملة',
    slug: brandShowRes.data.data.slug,
    badge: 'Enterprise FinTech',
    status_of_project: 'Live Production',
    is_active: 1,
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Brand Showcase: ID=${brandUpdateRes.data.data.id}`);

  const brandDeleteRes = await client.delete(`/dashboard/brand-showcases/${brandId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Brand Showcase: ${brandDeleteRes.data.message || 'OK'}`);

  // 5. SOLUTIONS CRUD
  console.log('\n▶️ [5/11] Testing Solutions CRUD (/dashboard/solutions)...');
  const solCreateRes = await client.post('/dashboard/solutions', {
    title_en: 'Cloud Kubernetes Modernization',
    title_ar: 'تحديث وتطوير البنية السحابية بكوبرنيتس',
    headline_en: 'Resilient Microservices with Auto-Scaling',
    headline_ar: 'بنية خدمات مصغرة مرنة مع توسع تلقائي فوري',
    department: 'DevOps & Cloud',
    slug: `k8s-modernization-${Date.now()}`,
    badge: 'High Reliability',
    description: 'Enterprise migration from legacy monoliths into cloud-native Kubernetes clusters.',
    is_active: 1,
    technologies: ['Kubernetes', 'AWS EKS', 'Docker', 'Terraform'],
  }, { headers: authHeaders });
  const solId = solCreateRes.data.data.id;
  console.log(`  ➕ Created Solution: ID=${solId}`);

  const solShowRes = await client.get(`/dashboard/solutions/${solId}`, { headers: authHeaders });
  console.log(`  🔍 Read Solution: ID=${solShowRes.data.data.id}, Slug=${solShowRes.data.data.slug}`);

  const solUpdateRes = await client.put(`/dashboard/solutions/${solId}`, {
    title_en: 'Cloud Kubernetes & DevOps Excellence',
    title_ar: 'التميز السحابي وإدارة العمليات DevOps',
    headline_en: '99.99% Uptime with Zero Downtime Deployments',
    headline_ar: 'ضمان استمرارية 99.99% مع نشر برمجي دون انقطاع',
    slug: solShowRes.data.data.slug,
    department: 'Cloud Infrastructure',
    is_active: 1,
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Solution: ID=${solUpdateRes.data.data.id}`);

  const solDeleteRes = await client.delete(`/dashboard/solutions/${solId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Solution: ${solDeleteRes.data.message || 'OK'}`);

  // 6. PRODUCTS CRUD
  console.log('\n▶️ [6/11] Testing Products CRUD (/dashboard/products)...');
  const prodSlug = `bekite-pos-${Date.now()}`;
  const prodCreateRes = await client.post('/dashboard/products', {
    name_en: 'Be-Kite POS Engine',
    name_ar: 'محرك بي كايت لنقاط البيع السحابية',
    slug: prodSlug,
    category_id: 1,
    color: '#3B82F6',
    address_en: 'Riyadh, KSA - King Fahd Rd',
    address_ar: 'الرياض، المملكة العربية السعودية - طريق الملك فهد',
    description_en: 'Cloud point of sale terminal with offline synchronization and instant ledger balancing.',
    description_ar: 'نظام نقاط بيع سحابي يدعم العمل دون اتصال ومزامنة القيود المالية الفورية.',
    is_featured_product: 1,
    is_active: 1,
    overview_paragraph1: 'Empower your daily frontline operations with instantaneous order routing and payments.',
    overview_paragraph2: 'Designed to function offline with zero disruption to checkout queuing transactions.',
    built_for_main_section_title: 'Tailored for Modern Retail & Fast Dining',
    built_for_secondary_section_title: 'Engineered for speed, durability, and multi-branch scalability',
    built_for_data: [
      { title: 'المطاعم والكافيهات', description: 'إدارة الطاولات وتجزئة الفواتير وشاشات المطبخ' },
    ],
    what_it_does_main_title: 'Unified Front-to-Back Operations',
    what_it_does_secondary_title: 'Everything from ticket dispatch to financial ledger reconciliation',
    what_it_does_data: [
      { title: 'Offline-First Checkout', description: 'Zero downtime even during network interruptions' },
    ],
    see_in_action_screen_one_title_ar: 'شاشة الكاشير السريعة',
    see_in_action_screen_one_title_en: 'Rapid Checkout Terminal',
    see_in_action_screen_two_title_ar: 'لوحة تحليلات المبيعات الفورية',
    see_in_action_screen_two_title_en: 'Real-Time Sales Telemetry',
    see_in_action_screen_three_title_ar: 'شاشة تحكم المطبخ والطلبات',
    see_in_action_screen_three_title_en: 'Kitchen Display System (KDS)',
    how_it_works_data: [
      { title: 'Device Enrollment', description: 'Scan a QR code on hardware terminal.' },
    ],
    why_teams_data: [
      { title: '99.99% Guaranteed Cloud Reliability', description: 'Distributed edge nodes ensure zero terminal downtime.' },
    ],
    scalability_tiers: [
      {
        title: 'Single Store',
        advantage: 'Instant deployment with zero upfront infrastructure cost.',
        specifications_capacity: 'Up to 2 terminals, 1 branch, 5,000 SKUs.',
      },
    ],
    packages: [
      { name: 'Enterprise Fleet', description: 'Unlimited Terminals & Multiple Physical Warehouses' },
    ],
  }, { headers: authHeaders });
  const prodId = prodCreateRes.data.data.id;
  console.log(`  ➕ Created Product: ID=${prodId}, Name=${prodCreateRes.data.data.name}`);

  const prodShowRes = await client.get(`/dashboard/products/${prodId}`, { headers: authHeaders });
  console.log(`  🔍 Read Product: ID=${prodShowRes.data.data.id}, Slug=${prodShowRes.data.data.slug}`);

  const prodUpdateRes = await client.put(`/dashboard/products/${prodId}`, {
    name_en: 'Be-Kite POS Engine Pro',
    name_ar: 'محرك بي كايت لنقاط البيع الاحترافي',
    slug: prodShowRes.data.data.slug,
    category_id: 1,
    is_active: 1,
    color: '#1E3A8A',
    address_en: 'Amman, Jordan - Queen Rania St',
    address_ar: 'عمان، الأردن - شارع الملكة رانيا',
    description_en: 'All-in-one cloud POS system tailored for retail and restaurants with instant sync.',
    description_ar: 'نظام نقاط بيع سحابي متكامل يخدم قطاع التجزئة والمطاعم مع مزامنة فورية.',
    overview_paragraph1: 'Empower your daily frontline operations with instantaneous order routing.',
    overview_paragraph2: 'Designed to function offline with zero disruption to checkout.',
    built_for_main_section_title: 'Tailored for Modern Retail & Fast Dining',
    built_for_secondary_section_title: 'Engineered for speed, durability, and multi-branch scalability',
    built_for_data: [
      { title: 'المطاعم والكافيهات', description: 'إدارة الطاولات وتجزئة الفاتورة.' },
    ],
    what_it_does_main_title: 'Unified Front-to-Back Operations',
    what_it_does_secondary_title: 'Everything from ticket dispatch to financial ledger reconciliation',
    what_it_does_data: [
      { title: 'Offline-First Checkout', description: 'Zero downtime even during network interruptions.' },
    ],
    how_it_works_data: [
      { title: 'Device Enrollment', description: 'Scan a QR code on hardware terminal.' },
    ],
    why_teams_data: [
      { title: '99.99% Guaranteed Cloud Reliability', description: 'Distributed edge nodes ensure zero downtime.' },
    ],
    scalability_tiers: [
      { title: 'Single Store', advantage: 'Instant deployment.', specifications_capacity: 'Up to 2 terminals.' },
    ],
    packages: [
      { name: 'Enterprise Fleet', description: 'Unlimited Terminals & Multiple Physical Warehouses' },
    ],
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Product: ID=${prodUpdateRes.data.data.id}`);

  const prodDeleteRes = await client.delete(`/dashboard/products/${prodId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Product: ${prodDeleteRes.data.message || 'OK'}`);

  // 7. PROJECTS CRUD
  console.log('\n▶️ [7/11] Testing Projects CRUD (/dashboard/projects)...');
  const projCreateRes = await client.post('/dashboard/projects', {
    name_en: 'Alpha Hypermarket Omnichannel',
    name_ar: 'منصة ألفا هايبرماركت متعددة القنوات',
    client_name: 'Alpha Retail Group',
    slug: `alpha-hypermarket-${Date.now()}`,
    location: 'Dubai, UAE',
    year: '2026',
    badge: 'Enterprise Commerce',
    accent_color: '#059669',
    description_en: 'Connected 12 flagship superstores with unified cloud inventory and mobile cashier checkout.',
    description_ar: 'ربط 12 فرعاً رئيسياً بمنظومة مخزون موحدة مع تطبيق كاشير متنقل.',
    is_active: 1,
    tags: ['E-Commerce', 'Cloud POS'],
    category_ids: [1],
  }, { headers: authHeaders });
  const projId = projCreateRes.data.data.id;
  console.log(`  ➕ Created Project: ID=${projId}`);

  const projShowRes = await client.get(`/dashboard/projects/${projId}`, { headers: authHeaders });
  console.log(`  🔍 Read Project: ID=${projShowRes.data.data.id}, Slug=${projShowRes.data.data.slug}`);

  const projUpdateRes = await client.put(`/dashboard/projects/${projId}`, {
    name_en: 'Alpha Hypermarket Cloud Suite',
    name_ar: 'منظومة ألفا هايبرماركت السحابية الموحدة',
    slug: projShowRes.data.data.slug,
    client_name: 'Alpha Retail Group UAE',
    is_active: 1,
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Project: ID=${projUpdateRes.data.data.id}`);

  const projDeleteRes = await client.delete(`/dashboard/projects/${projId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Project: ${projDeleteRes.data.message || 'OK'}`);

  // 8. JOBS CRUD (/dashboard/job-site)
  console.log('\n▶️ [8/11] Testing Jobs CRUD (/dashboard/job-site)...');
  const jobCreateRes = await client.post('/dashboard/job-site', {
    job_title_en: 'Senior Full Stack Engineer',
    job_title_ar: 'مهندس برمجيات وتطبيقات متكامل أول',
    departement: 'Core Engineering',
    slug: `fullstack-engineer-${Date.now()}`,
    badge: 'Hiring Fast',
    job_type: 'Full-time',
    job_location: 'Riyadh / Remote',
    experience: '4+ Years',
    subtitle: 'Lead development of next-gen SaaS tools',
    description: 'We are seeking an experienced full-stack engineer proficient in Vue 3, Laravel, and cloud architectures.',
    skills: ['Vue.js', 'Laravel', 'PostgreSQL', 'TailwindCSS'],
  }, { headers: authHeaders });
  const jobId = jobCreateRes.data.data.id;
  console.log(`  ➕ Created Job: ID=${jobId}`);

  const jobShowRes = await client.get(`/dashboard/job-site/${jobId}`, { headers: authHeaders });
  console.log(`  🔍 Read Job: ID=${jobShowRes.data.data.id}, Slug=${jobShowRes.data.data.slug}`);

  const jobUpdateRes = await client.put(`/dashboard/job-site/${jobId}`, {
    job_title_en: 'Lead Full Stack Architect',
    job_title_ar: 'مهندس معماري برمجيات أول',
    slug: jobShowRes.data.data.slug,
    departement: 'Core Engineering',
    job_type: 'Full-time',
    experience: '5+ Years',
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Job: ID=${jobUpdateRes.data.data.id}`);

  const jobDeleteRes = await client.delete(`/dashboard/job-site/${jobId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Job: ${jobDeleteRes.data.message || 'OK'}`);

  // 9. INQUIRIES & CRM
  console.log('\n▶️ [9/11] Testing Inquiries CRUD (/dashboard/inquiries)...');
  const inqCreateRes = await client.post('/dashboard/inquiries', {
    full_name: 'Sultan Al-Otaibi',
    email: 'sultan@alotaibi-group.com',
    phone: '+966500000000',
    company: 'Al-Otaibi Retail & Hospitality',
    service_type: 'enterprise_pos',
    budget_range: '$10,000 - $25,000',
    preferred_contact_method: 'whatsapp',
    message: 'Need POS synchronization for 6 restaurant branches across Jeddah and Riyadh.',
    source_url: 'https://be-kite.com/solutions',
  }, { headers: authHeaders });
  const inqId = inqCreateRes.data.data.id;
  console.log(`  ➕ Created Inquiry: ID=${inqId}, Client=${inqCreateRes.data.data.full_name}`);

  const inqShowRes = await client.get(`/dashboard/inquiries/${inqId}`, { headers: authHeaders });
  console.log(`  🔍 Read Inquiry: ID=${inqShowRes.data.data.id}, Status=${inqShowRes.data.data.status}`);

  const inqUpdateRes = await client.put(`/dashboard/inquiries/${inqId}`, {
    status: 'Contacted',
    admin_notes: 'Demo meeting scheduled for Tuesday 11:00 AM via Zoom with technical team.',
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Inquiry: ID=${inqUpdateRes.data.data.id}`);

  const inqDeleteRes = await client.delete(`/dashboard/inquiries/${inqId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Inquiry: ${inqDeleteRes.data.message || 'OK'}`);

  // 10. MESSAGES & STATUS TOGGLE
  console.log('\n▶️ [10/11] Testing Messages CRUD (/dashboard/messages)...');
  const msgCreateRes = await client.post('/dashboard/messages', {
    name: 'Nasser Al-Ghamdi',
    phone_number: '+966555123456',
    email: 'nasser@enterprise.sa',
    message: 'Interested in partnering with Be-Kite for payment terminal installations.',
  }, { headers: authHeaders });
  const msgId = msgCreateRes.data.data.id;
  console.log(`  ➕ Created Message: ID=${msgId}, Sender=${msgCreateRes.data.data.name}`);

  const msgShowRes = await client.get(`/dashboard/messages/${msgId}`, { headers: authHeaders });
  console.log(`  🔍 Read Message: ID=${msgShowRes.data.data.id}, Status=${msgShowRes.data.data.status}`);

  const msgStatusRes = await client.post(`/dashboard/messages/${msgId}/status`, {
    status: 'read',
  }, { headers: authHeaders });
  console.log(`  ✏️ Updated Message Status to 'read': ${msgStatusRes.data.message || 'OK'}`);

  const msgDeleteRes = await client.delete(`/dashboard/messages/${msgId}`, { headers: authHeaders });
  console.log(`  🗑️ Deleted Message: ${msgDeleteRes.data.message || 'OK'}`);

  // 11. PUBLIC SITE READ & SUBMISSION ENDPOINTS
  console.log('\n▶️ [11/11] Testing Public Site Endpoints (/site/*)...');
  const siteCats = await client.get('/site/categories');
  console.log(`  🌐 Public Categories count: ${siteCats.data.data.length}`);

  const siteProds = await client.get('/site/products');
  console.log(`  🌐 Public Products count: ${siteProds.data.data.length}`);

  const siteProjects = await client.get('/site/projects');
  console.log(`  🌐 Public Projects count: ${siteProjects.data.data.length}`);

  const siteSolutions = await client.get('/site/solutions');
  console.log(`  🌐 Public Solutions count: ${siteSolutions.data.data.length}`);

  const siteBrands = await client.get('/site/brand-showcases');
  console.log(`  🌐 Public Brand Showcases count: ${siteBrands.data.data.length}`);

  const siteJobs = await client.get('/site/job-sites');
  console.log(`  🌐 Public Job Sites count: ${siteJobs.data.data.length}`);

  // Public Form submissions
  const siteInquiryRes = await client.post('/site/inquiries', {
    full_name: 'Visitor Tariq',
    email: 'visitor.tariq@test.com',
    phone: '+962791112233',
    company: 'Fast Retail LLC',
    service_type: 'enterprise_pos',
    budget_range: '$5,000 - $10,000',
    preferred_contact_method: 'whatsapp',
    message: 'Testing public website lead form submission.',
    source_url: 'https://be-kite.com',
  });
  console.log(`  📬 Public Website Inquiry submitted successfully: ID=${siteInquiryRes.data.data?.id || 'OK'}`);
  if (siteInquiryRes.data.data?.id) {
    await client.delete(`/dashboard/inquiries/${siteInquiryRes.data.data.id}`, { headers: authHeaders });
  }

  const siteMsgRes = await client.post('/site/messages', {
    name: 'Website Visitor Khalid',
    phone_number: '+966509998877',
    email: 'khalid.visitor@test.com',
    message: 'Testing public contact us form submission.',
  });
  console.log(`  📬 Public Website Message submitted successfully: ID=${siteMsgRes.data.data?.id || 'OK'}`);
  if (siteMsgRes.data.data?.id) {
    await client.delete(`/dashboard/messages/${siteMsgRes.data.data.id}`, { headers: authHeaders });
  }

  console.log('\n====================================================');
  console.log('🎉 ALL LIVE API ENDPOINTS & CRUD OPERATIONS PASSED 100%');
  console.log('====================================================');
}

run().catch((err) => {
  console.error('\n❌ ERROR during test execution:', err.response?.data || err.message);
  process.exit(1);
});
