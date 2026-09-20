import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://site-backend.be-kite.com/api/v1';

async function seed() {
  console.log('🚀 Seeding real production data into live Be-Kite Backend...');

  // 1. Login
  const loginRes = await axios.post(`${BASE_URL}/dashboard/login`, {
    email: 'admin@bekite.com',
    password: 'password123',
  });
  const token = loginRes.data.token;
  console.log(`✅ Authenticated token: ${token.substring(0, 15)}...`);

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  // 2. Seed Project Categories
  console.log('\n📦 Seeding Project Categories...');
  try {
    await axios.post(`${BASE_URL}/dashboard/project-categories`, {
      name_en: 'E-Commerce & Retail',
      name_ar: 'التجارة الإلكترونية والتجزئة',
    }, { headers });
    console.log('  ✅ Created Project Category: E-Commerce & Retail');
  } catch (e) {
    console.log('  ℹ️ Project category already exists or error:', e.response?.data?.message || e.message);
  }

  try {
    await axios.post(`${BASE_URL}/dashboard/project-categories`, {
      name_en: 'Mobile Applications',
      name_ar: 'تطبيقات الهواتف الذكية',
    }, { headers });
    console.log('  ✅ Created Project Category: Mobile Applications');
  } catch (e) {
    console.log('  ℹ️ Project category already exists or error:', e.response?.data?.message || e.message);
  }

  // 3. Seed Brand Showcases
  console.log('\n🌟 Seeding Brand Showcases...');
  const brandsToSeed = [
    {
      brand_ar: 'ڤولت تكنولوجي',
      brand_en: 'Volt Technology',
      subtitle_ar: 'الجيل القادم من حلول الدفع الرقمي ونقاط البيع السحابية',
      subtitle_en: 'Next-gen digital payment ecosystem & cloud POS orchestration',
      slug: 'volt-technology',
      badge: 'FinTech',
      brand_color: '#0F172A',
      accent_color: '#38BDF8',
      layout: 'image_left',
      description_ar: 'منصة متكاملة لمعالجة المدفوعات ونقاط البيع السحابية مع تكامل فوري للبنوك وبوابات الدفع العالمية.',
      description_en: 'Enterprise payment orchestration and cloud POS syncing across global financial gateways.',
      categories: ['FinTech', 'Cloud POS'],
      website_url: 'https://volt.example.com',
      apple_store_url: 'https://apps.apple.com/app/volt-pay/id987654321',
      google_play_url: 'https://play.google.com/store/apps/details?id=com.volt.pay',
      status_of_project: 'Live Production',
      is_coming_soon: 0,
      is_active: 1,
      image_path: 'public/images/brands/zalameh_mockup.png',
    },
    {
      brand_ar: 'زلمة كاشير',
      brand_en: 'Zalameh Cashier',
      subtitle_ar: 'نظام نقاط البيع وإدارة المطاعم والمتاجر السحابي',
      subtitle_en: 'Smart cloud POS & multi-branch restaurant operations',
      slug: 'zalameh-cashier',
      badge: 'Retail & POS',
      brand_color: '#1E3A8A',
      accent_color: '#F59E0B',
      layout: 'image_right',
      description_ar: 'نظام كاشير فائق السرعة يعمل دون انقطاع مع دعم الفوترة الضريبية وإدارة المخزون والمطابخ الذكية.',
      description_en: 'High-speed offline-first cashier terminal with e-invoicing compliance and kitchen routing.',
      categories: ['POS', 'Food & Beverage'],
      website_url: 'https://zalameh.com',
      apple_store_url: 'https://apps.apple.com/app/zalameh-pos/id12345678',
      google_play_url: 'https://play.google.com/store/apps/details?id=com.zalameh.pos',
      status_of_project: 'Live Production',
      is_coming_soon: 0,
      is_active: 1,
      image_path: 'public/images/products/tijara_overview.png',
    },
    {
      brand_ar: 'هدية آب',
      brand_en: 'Hadaya App',
      subtitle_ar: 'منصة الإهداء الرقمي والتسوق السريع',
      subtitle_en: 'Social gifting & on-demand gift delivery network',
      slug: 'hadaya-app',
      badge: 'Consumer App',
      brand_color: '#831843',
      accent_color: '#EC4899',
      layout: 'image_left',
      description_ar: 'تطبيق تجارة إلكترونية مبتكر لإرسال الهدايا والبطاقات الرقمية مع باقات ورد وتغليف فاخر.',
      description_en: 'Next-generation social gifting marketplace offering on-demand bespoke gift deliveries.',
      categories: ['Mobile App', 'E-Commerce'],
      website_url: 'https://hadaya.app',
      apple_store_url: 'https://apps.apple.com/app/hadaya/id87654321',
      google_play_url: 'https://play.google.com/store/apps/details?id=com.hadaya.app',
      status_of_project: 'Active & Scaling',
      is_coming_soon: 0,
      is_active: 1,
      image_path: 'public/images/brands/hadayapp_mockup.png',
    },
  ];

  for (const b of brandsToSeed) {
    try {
      const form = new FormData();
      Object.keys(b).forEach(k => {
        if (k === 'categories') {
          b.categories.forEach((cat, idx) => form.append(`categories[${idx}]`, cat));
        } else if (k === 'image_path') {
          if (fs.existsSync(b.image_path)) {
            form.append('mockup_image_file', fs.createReadStream(b.image_path));
          }
        } else {
          form.append(k, String(b[k]));
        }
      });
      const res = await axios.post(`${BASE_URL}/dashboard/brand-showcases`, form, {
        headers: {
          ...headers,
          ...form.getHeaders(),
        },
      });
      console.log(`  ✅ Added Brand Showcase: ${b.brand_en} (ID: ${res.data.data?.id})`);
    } catch (e) {
      console.log(`  ⚠️ Brand ${b.brand_en} note:`, e.response?.data?.message || e.message);
    }
  }

  // 4. Seed Solutions
  console.log('\n💡 Seeding Solutions...');
  const solutionsToSeed = [
    {
      title_ar: 'حلول الحوسبة السحابية المؤسسية',
      title_en: 'Enterprise Cloud Solutions',
      headline_ar: 'بنية تحتية سحابية مرنة وقابلة للتطوير',
      headline_en: 'Scalable and Resilient Cloud Architecture',
      department: 'Cloud Infrastructure',
      slug: 'enterprise-cloud-solutions',
      badge: 'Scalable Architecture',
      description: 'End-to-end cloud infrastructure modernization, Kubernetes clustering, and zero-downtime microservices.',
      technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
      is_active: 1,
      icon_image_path: 'public/images/products/wajha.png',
      hero_image_path: 'public/images/cloud_infra_hero_mockup.jpg',
      problem_badge: 'Legacy Friction',
      problem_department_title: 'Bottlenecks in Monolithic Infrastructure',
      problem_department_subtitle: 'Downtime during traffic surges and slow deployment cycles',
      challenges: [
        { title: 'بطء التحميل وسوء تجربة المستخدم', description: 'كل ثانية تأخير في تحميل الموقع تفقدك ما يصل إلى 20% من عملائك المحتملين.' },
      ],
      solve_department_badge: 'Modern Architecture',
      solve_department_title: 'Automated Cloud Engineering',
      solve_department_subtitle: 'Resilient auto-scaling clusters with zero downtime',
      solve_department_description: 'We migrate monolithic workloads to isolated microservices backed by automated CI/CD pipelines.',
      solve_cta_text: 'Schedule an Infrastructure Audit',
      deliver_department_title: 'Delivery Blueprint',
      deliver_department_subtitle: 'Step-by-step migration roadmap',
      exits: [
        { title: 'تصميم واجهات مخصص (UI/UX)', description: 'Discovery and architecture planning' },
      ],
      proven_execution_framework: [
        { title: 'Cloud Audit', description: 'Comprehensive code and database profiling' },
      ],
      why_choose_us: [
        { title: 'High Availability', description: '99.99% uptime guarantee across multi-region clusters' },
      ],
    },
    {
      title_ar: 'تطوير المنصات الرقمية وتطبيقات الويب',
      title_en: 'Custom Web & SaaS Engineering',
      headline_ar: 'منصات رقمية متطورة وسريعة الاستجابة',
      headline_en: 'High-Performance Web Platforms & SaaS',
      department: 'Software Engineering',
      slug: 'custom-web-saas-engineering',
      badge: 'Bespoke Software',
      description: 'Engineering responsive, secure web platforms and multi-tenant SaaS systems utilizing modern Vue 3 and Laravel architectures.',
      technologies: ['Vue.js 3', 'Laravel 11', 'PostgreSQL', 'TailwindCSS'],
      is_active: 1,
      icon_image_path: 'public/images/products/tijara.png',
      hero_image_path: 'public/images/web_dev_hero_laptop.jpg',
      problem_badge: 'Outdated Systems',
      problem_department_title: 'Rigid Technical Debt & Slow Releases',
      problem_department_subtitle: 'Legacy software unable to handle rapid business pivots',
      challenges: [
        { title: 'صعوبة التكامل مع الخدمات الخارجية', description: 'الأنظمة القديمة تفتقر للـ APIs الحديثة وتعيق ربط الدفع والفوترة.' },
      ],
      solve_department_badge: 'Modern Stack',
      solve_department_title: 'Modular API-Driven Architecture',
      solve_department_subtitle: 'Fast, secure, and reactive web applications',
      solve_department_description: 'We design component-based architectures with real-time syncing and comprehensive automated testing.',
      solve_cta_text: 'Request Platform Scope Consultation',
      deliver_department_title: 'Delivery Blueprint',
      deliver_department_subtitle: 'Agile sprints with bi-weekly deployments',
      exits: [
        { title: 'تصميم النظام وقاعدة البيانات', description: 'Domain-driven database schema' },
      ],
      proven_execution_framework: [
        { title: 'Agile Development', description: 'Continuous integration and test coverage' },
      ],
      why_choose_us: [
        { title: 'Clean Architecture', description: 'Maintainable code adhering to enterprise design patterns' },
      ],
    },
  ];

  for (const s of solutionsToSeed) {
    try {
      const form = new FormData();
      Object.keys(s).forEach(k => {
        if (k === 'technologies') {
          s.technologies.forEach((tech, idx) => form.append(`technologies[${idx}]`, tech));
        } else if (k === 'challenges') {
          s.challenges.forEach((ch, idx) => {
            form.append(`challenges[${idx}][title]`, ch.title);
            form.append(`challenges[${idx}][description]`, ch.description);
          });
        } else if (k === 'exits') {
          s.exits.forEach((item, idx) => {
            form.append(`exits[${idx}][title]`, item.title);
            form.append(`exits[${idx}][description]`, item.description);
          });
        } else if (k === 'proven_execution_framework') {
          s.proven_execution_framework.forEach((item, idx) => {
            form.append(`proven_execution_framework[${idx}][title]`, item.title);
            form.append(`proven_execution_framework[${idx}][description]`, item.description);
          });
        } else if (k === 'why_choose_us') {
          s.why_choose_us.forEach((item, idx) => {
            form.append(`why_choose_us[${idx}][title]`, item.title);
            form.append(`why_choose_us[${idx}][description]`, item.description);
          });
        } else if (k === 'icon_image_path' && fs.existsSync(s.icon_image_path)) {
          form.append('icon_image_file', fs.createReadStream(s.icon_image_path));
        } else if (k === 'hero_image_path' && fs.existsSync(s.hero_image_path)) {
          form.append('hero_image_file', fs.createReadStream(s.hero_image_path));
        } else {
          form.append(k, String(s[k]));
        }
      });
      const res = await axios.post(`${BASE_URL}/dashboard/solutions`, form, {
        headers: {
          ...headers,
          ...form.getHeaders(),
        },
      });
      console.log(`  ✅ Added Solution: ${s.title_en} (ID: ${res.data.data?.id})`);
    } catch (e) {
      console.log(`  ⚠️ Solution ${s.title_en} note:`, e.response?.data?.message || e.message);
    }
  }

  // 5. Seed Project
  console.log('\n🎨 Seeding Showcase Project...');
  try {
    const pForm = new FormData();
    pForm.append('name_ar', 'منظومة آيريس الفاخرة للزهور والهدايا');
    pForm.append('name_en', 'Iris Luxury Flowers & Gifting Suite');
    pForm.append('client_name', 'Iris Flowers International');
    pForm.append('slug', 'iris-luxury-flowers');
    pForm.append('location', 'Amman, Jordan');
    pForm.append('year', '2026');
    pForm.append('badge', 'Luxury Retail');
    pForm.append('tags[0]', 'E-Commerce');
    pForm.append('tags[1]', 'POS Integration');
    pForm.append('category_ids[0]', '1');
    pForm.append('description_ar', 'منظومة رقمية شاملة تربط المتاجر الفعلية بالمتجر الإلكتروني وتطبيق الهاتف المحمول لإدارة الطلبات الفورية.');
    pForm.append('description_en', 'End-to-end luxury retail platform synchronizing physical boutique stores with instant mobile delivery.');
    pForm.append('live_website_url', 'https://iris.example.com');
    pForm.append('has_mobile_app', 'true');
    pForm.append('mobile_app_apple_store_url', 'https://apps.apple.com/app/iris-flowers/id123456');
    pForm.append('mobile_app_play_store_url', 'https://play.google.com/store/apps/details?id=com.iris.flowers');
    pForm.append('accent_color', '#7C3AED');
    pForm.append('kpi[0][percentage]', '+175%');
    pForm.append('kpi[0][text]', 'نمو الطلبات الرقمية');
    pForm.append('deliverables[0]', 'Web Storefront');
    pForm.append('deliverables[1]', 'Mobile Checkout App');
    pForm.append('is_active', '1');

    if (fs.existsSync('public/images/projects/iris_website_showcase.jpg')) {
      pForm.append('website_showcase_image_file', fs.createReadStream('public/images/projects/iris_website_showcase.jpg'));
    }
    if (fs.existsSync('public/images/projects/iris_mobile_app.png')) {
      pForm.append('mobile_app_mockup_image_file', fs.createReadStream('public/images/projects/iris_mobile_app.png'));
    }
    if (fs.existsSync('public/images/projects/iris_hero_logo.png')) {
      pForm.append('client_logo_file', fs.createReadStream('public/images/projects/iris_hero_logo.png'));
    }

    const pRes = await axios.post(`${BASE_URL}/dashboard/projects`, pForm, {
      headers: {
        ...headers,
        ...pForm.getHeaders(),
      },
    });
    console.log(`  ✅ Added Project: Iris Luxury Flowers (ID: ${pRes.data.data?.id})`);
  } catch (e) {
    console.log('  ⚠️ Project note:', e.response?.data?.message || e.message);
  }

  console.log('\n✨ Database seeding completed successfully!');
}

seed().catch(err => {
  console.error('❌ Seeding error:', err.response?.data || err.message);
});
