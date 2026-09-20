import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://site-backend.be-kite.com/api/v1';

function fileToBlob(filePath, mimeType = 'image/png') {
  const buffer = fs.readFileSync(filePath);
  return new Blob([buffer], { type: mimeType });
}

async function run() {
  console.log('=== Step 1: Login to Live Backend API ===');
  const loginRes = await fetch(`${BASE_URL}/dashboard/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email: 'admin@bekite.com', password: 'password123' })
  }).then(r => r.json());

  if (!loginRes.token) {
    throw new Error('Failed to login: ' + JSON.stringify(loginRes));
  }
  const token = loginRes.token;
  console.log('Login successful, token:', token.substring(0, 15) + '...');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  console.log('\n=== Step 2: Fetch and Delete ALL existing projects in live API ===');
  const listRes = await fetch(`${BASE_URL}/dashboard/projects`, { headers: authHeaders }).then(r => r.json());
  const existingProjects = listRes.data || [];
  console.log(`Found ${existingProjects.length} existing project(s) in live API.`);

  for (const p of existingProjects) {
    console.log(`Deleting project: ${p.name || p.name_ar} (ID: ${p.id})...`);
    const delRes = await fetch(`${BASE_URL}/dashboard/projects/${p.id}`, {
      method: 'DELETE',
      headers: authHeaders
    }).then(r => r.json());
    console.log(`Deleted project ${p.id}: status = ${delRes.status}`);
  }

  // Double check deletion
  const verifyEmpty = await fetch(`${BASE_URL}/dashboard/projects`, { headers: authHeaders }).then(r => r.json());
  console.log(`Existing projects after deletion: ${(verifyEmpty.data || []).length}`);

  console.log('\n=== Step 3: Seed 4 projects with multiple social media images ===');
  const imgDir = '/Users/omarragab/Projects/bekite/public/images/projects';

  const projects = [
    {
      name_ar: 'أزهار أيريس Iris Flowers',
      name_en: 'Iris Flowers',
      slug: 'iris-flowers',
      client_name: 'Iris Flowers Co.',
      category_id: 1, // E-Commerce
      year: '2024-2025', // <= 10 characters
      location: 'عَمّان، الأردن',
      badge: 'متجر وتطبيق زهور',
      accent_color: '#ec4899',
      is_active: 1,
      live_website_url: 'https://irisflowers.jo',
      has_mobile_app: 1,
      mobile_app_apple_store_url: 'https://apps.apple.com/app/iris-flowers/id123456789',
      mobile_app_play_store_url: 'https://play.google.com/store/apps/details?id=com.irisflowers.app',
      description_ar: 'متجر إلكتروني فخم وتطبيق هاتف ذكي لطلب وتنسيق وتوصيل باقات الزهور والهدايا الفاخرة مع نظام تتبع مباشر للطلبات وبوابات دفع إلكترونية ذكية.',
      description_en: 'A luxury online boutique and mobile app for artisanal floral arrangements and bespoke gift delivery with real-time dispatch tracking.',
      facebook_url: 'https://facebook.com/irisflowers',
      instagram_url: 'https://instagram.com/irisflowers',
      twitter_x_url: 'https://x.com/irisflowers',
      linkedin_url: 'https://linkedin.com/company/irisflowers',
      tiktok_url: 'https://tiktok.com/@irisflowers',
      youtube_url: 'https://youtube.com/@irisflowers',
      tags: ['متجر إلكتروني', 'تطبيق هاتف', 'تصميم هوية', 'تسويق رقمي'],
      deliverables: ['E-Commerce Store', 'iOS & Android App', 'Custom Floral Visual Identity', 'Social Media Ads & Creative Direction'],
      kpi: [
        { percentage: '+150%', text: 'مبيعات التجارة الإلكترونية' },
        { percentage: '4.9', text: 'تقييم تجربة المستخدم' }
      ],
      showcase_file: path.join(imgDir, 'iris_website_showcase.jpg'),
      logo_file: path.join(imgDir, 'iris-flowers.png'),
      mobile_file: path.join(imgDir, 'iris_mobile_app.png'),
      social_images: [
        { title: 'باقات المناسبات والورود الفاخرة', path: path.join(imgDir, 'iris_sm_1.png') },
        { title: 'تنسيق هدايا التخرج والأفراح', path: path.join(imgDir, 'iris_sm_2.png') },
        { title: 'حملات التوصيل السريع للمنازل', path: path.join(imgDir, 'iris_sm_3.png') },
        { title: 'إبداع التصميم وتغليف الباقات الفخمة', path: path.join(imgDir, 'iris_sm_4.png') }
      ]
    },
    {
      name_ar: 'مدارس المزن الأهلية',
      name_en: 'AL-Mzon Schools',
      slug: 'al-mzon-schools',
      client_name: 'AL-Mzon Educational Group',
      category_id: 2, // Education & Platforms
      year: '2024',
      location: 'الرياض، السعودية',
      badge: 'منصة تعليمية ومدارس',
      accent_color: '#2563eb',
      is_active: 1,
      live_website_url: 'https://almzon.edu.sa',
      has_mobile_app: 1,
      mobile_app_apple_store_url: 'https://apps.apple.com/app/al-mzon/id987654321',
      mobile_app_play_store_url: 'https://play.google.com/store/apps/details?id=sa.edu.almzon',
      description_ar: 'بوابة تعليمية ذكية ومنظومة لإدارة المدارس والطلاب وأولياء الأمور مع فصول افتراضية وتتبع للحافلات المدرسية والنتائج والتقارير الأكاديمية.',
      description_en: 'An enterprise educational management portal and student information system featuring digital classrooms, grading modules, and bus tracking.',
      facebook_url: 'https://facebook.com/almzonschools',
      instagram_url: 'https://instagram.com/almzonschools',
      twitter_x_url: 'https://x.com/almzonschools',
      linkedin_url: 'https://linkedin.com/company/almzonschools',
      tiktok_url: 'https://tiktok.com/@almzonschools',
      youtube_url: 'https://youtube.com/@almzonschools',
      tags: ['منصة تعليمية', 'إدارة مدرسية', 'هوية مؤسسية', 'تطبيق ولي الأمر'],
      deliverables: ['School Management Portal', 'Parents & Students App', 'Interactive Learning Hub', 'Social Media Branding'],
      kpi: [
        { percentage: '12,000+', text: 'طالب ونظام نشط' },
        { percentage: '99.9%', text: 'جاهزية البوابة السحابية' }
      ],
      showcase_file: path.join(imgDir, 'al-mzon-schools.png'),
      logo_file: path.join(imgDir, 'al-mzon-schools.png'),
      mobile_file: path.join(imgDir, 'al-mzon-schools.png'),
      social_images: [
        { title: 'بيئة تعليمية تفاعلية حديثة', path: path.join(imgDir, 'al-mzon-schools.png') },
        { title: 'أنشطة ومسابقات الطلاب المبتكرين', path: path.join(imgDir, 'al-mzon-schools.png') },
        { title: 'منصة التواصل المباشر مع أولياء الأمور', path: path.join(imgDir, 'al-mzon-schools.png') },
        { title: 'حملات التسجيل والقبول للعام الدراسي', path: path.join(imgDir, 'al-mzon-schools.png') }
      ]
    },
    {
      name_ar: 'كيودوز للفعاليات Kudos Events',
      name_en: 'Kudos Events',
      slug: 'kudos-events',
      client_name: 'Kudos Events Management',
      category_id: 3, // Events & Conferences
      year: '2025',
      location: 'دبي، الإمارات',
      badge: 'منصة فعاليات ومؤتمرات',
      accent_color: '#8b5cf6',
      is_active: 1,
      live_website_url: 'https://kudosevents.com',
      has_mobile_app: 0,
      description_ar: 'منصة تنظيم ومؤتمرات وحجز تذاكر رقمية مع تجربة بصرية سينمائية وهوية مؤسسية فاخرة وإدارة كبار الشخصيات والندوات الدولية.',
      description_en: 'Digital event management and ticketing platform with cinematic UI, VIP attendee workflows, and full-spectrum summit staging.',
      facebook_url: 'https://facebook.com/kudosevents',
      instagram_url: 'https://instagram.com/kudosevents',
      twitter_x_url: 'https://x.com/kudosevents',
      linkedin_url: 'https://linkedin.com/company/kudosevents',
      tiktok_url: 'https://tiktok.com/@kudosevents',
      youtube_url: 'https://youtube.com/@kudosevents',
      tags: ['تنظيم فعاليات', 'هوية بصرية', 'تسويق رقمي'],
      deliverables: ['Interactive Web Platform', 'VIP Guest Management', 'Social Media Live Coverage'],
      kpi: [
        { percentage: '50K+', text: 'حضور الفعاليات' },
        { percentage: '2.4M', text: 'تغطية إعلامية' }
      ],
      showcase_file: path.join(imgDir, 'kudos-events.png'),
      logo_file: path.join(imgDir, 'kudos-events.png'),
      social_images: [
        { title: 'تغطية المؤتمرات والقمم العالمية', path: path.join(imgDir, 'kudos-events.png') },
        { title: 'إضاءة المسارح والإنتاج الفني', path: path.join(imgDir, 'kudos-events.png') },
        { title: 'تنظيم حفلات الإطلاق وجوائز التميز', path: path.join(imgDir, 'kudos-events.png') },
        { title: 'لقطات حصرية خلف الكواليس', path: path.join(imgDir, 'kudos-events.png') }
      ]
    },
    {
      name_ar: 'مياه بيرما Birma',
      name_en: 'Birma Water',
      slug: 'birma-water',
      client_name: 'Birma Bottled Water Co.',
      category_id: 4, // Branding & Digital Marketing
      year: '2025', // <= 10 characters
      location: 'الرياض، السعودية',
      badge: 'هوية وتجارة إلكترونية',
      accent_color: '#0d9488',
      is_active: 1,
      live_website_url: 'https://birmawater.com',
      has_mobile_app: 1,
      mobile_app_apple_store_url: 'https://apps.apple.com/app/birma-water/id555666777',
      mobile_app_play_store_url: 'https://play.google.com/store/apps/details?id=com.birma.water',
      description_ar: 'هوية تجارية عصرية ومتجر إلكتروني مع نظام توصيل اشتراكات المياه للمنازل والشركات وحملات تسويق رقمي عبر منصات التواصل.',
      description_en: 'A modern consumer brand with e-commerce subscriptions, route dispatch optimization, and high-impact social media creative.',
      facebook_url: 'https://facebook.com/birmawater',
      instagram_url: 'https://instagram.com/birmawater',
      twitter_x_url: 'https://x.com/birmawater',
      linkedin_url: 'https://linkedin.com/company/birmawater',
      tiktok_url: 'https://tiktok.com/@birmawater',
      youtube_url: 'https://youtube.com/@birmawater',
      tags: ['تجارة إلكترونية', 'هوية بصرية', 'تسويق رقمي', 'تطبيق هاتف'],
      deliverables: ['E-Commerce Web Portal', 'Mobile App for iOS & Android', 'Brand Identity & Packaging', 'Social Media Campaigns'],
      kpi: [
        { percentage: '120K+', text: 'طلبات التوصيل' },
        { percentage: '18K+', text: 'العملاء المشتركين' }
      ],
      showcase_file: path.join(imgDir, 'birma-water.png'),
      logo_file: path.join(imgDir, 'birma-water.png'),
      mobile_file: path.join(imgDir, 'birma-water.png'),
      social_images: [
        { title: 'نقاء الطبيعة في كل قطرة', path: path.join(imgDir, 'birma-water.png') },
        { title: 'حملة الانتعاش والصحة اليومية', path: path.join(imgDir, 'birma-water.png') },
        { title: 'عروض الاشتراكات للمنازل والشركات', path: path.join(imgDir, 'birma-water.png') },
        { title: 'خدمة التوصيل السريع لجميع المناطق', path: path.join(imgDir, 'birma-water.png') }
      ]
    }
  ];

  const createdResults = [];

  for (const [idx, p] of projects.entries()) {
    console.log(`\nCreating project ${idx + 1}/4: ${p.name_en}...`);
    const fd = new FormData();
    fd.append('name_ar', p.name_ar);
    fd.append('name_en', p.name_en);
    fd.append('slug', p.slug);
    fd.append('client_name', p.client_name);
    fd.append('category_ids[0]', String(p.category_id));
    fd.append('year', p.year);
    fd.append('location', p.location);
    fd.append('badge', p.badge);
    fd.append('accent_color', p.accent_color);
    fd.append('is_active', '1');
    fd.append('description_ar', p.description_ar);
    fd.append('description_en', p.description_en);

    if (p.live_website_url) fd.append('live_website_url', p.live_website_url);
    fd.append('has_mobile_app', p.has_mobile_app ? '1' : '0');
    if (p.mobile_app_apple_store_url) fd.append('mobile_app_apple_store_url', p.mobile_app_apple_store_url);
    if (p.mobile_app_play_store_url) fd.append('mobile_app_play_store_url', p.mobile_app_play_store_url);

    if (p.facebook_url) fd.append('facebook_url', p.facebook_url);
    if (p.instagram_url) fd.append('instagram_url', p.instagram_url);
    if (p.twitter_x_url) fd.append('twitter_x_url', p.twitter_x_url);
    if (p.linkedin_url) fd.append('linkedin_url', p.linkedin_url);
    if (p.tiktok_url) fd.append('tiktok_url', p.tiktok_url);
    if (p.youtube_url) fd.append('youtube_url', p.youtube_url);

    p.tags.forEach((t, tIdx) => fd.append(`tags[${tIdx}]`, t));
    p.deliverables.forEach((d, dIdx) => fd.append(`deliverables[${dIdx}]`, d));
    p.kpi.forEach((k, kIdx) => {
      fd.append(`kpi[${kIdx}][percentage]`, k.percentage);
      fd.append(`kpi[${kIdx}][text]`, k.text);
    });

    // Upload showcase and logo files
    fd.append('website_showcase_image_file', fileToBlob(p.showcase_file, 'image/jpeg'), 'showcase.jpg');
    fd.append('client_logo_file', fileToBlob(p.logo_file, 'image/png'), 'logo.png');
    if (p.mobile_file) {
      fd.append('mobile_app_mockup_image_file', fileToBlob(p.mobile_file, 'image/png'), 'mobile.png');
    }

    // Upload multiple social media images (images_data)
    p.social_images.forEach((sm, smIdx) => {
      fd.append(`images_data[${smIdx}][title]`, sm.title);
      fd.append(`images_data[${smIdx}][type]`, 'social');
      fd.append(`images_data[${smIdx}][file]`, fileToBlob(sm.path, 'image/png'), `social_${smIdx + 1}.png`);
    });

    const createRes = await fetch(`${BASE_URL}/dashboard/projects`, {
      method: 'POST',
      headers: authHeaders,
      body: fd
    }).then(r => r.json());

    if (createRes.status || createRes.data?.id) {
      const createdProj = createRes.data;
      console.log(`✅ SUCCESS: Created ${p.name_en} (ID: ${createdProj.id})`);
      console.log(`   - Images count: ${(createdProj.images || []).length}`);
      console.log(`   - Showcase image: ${createdProj.website_showcase_image}`);
      createdResults.push({
        id: createdProj.id,
        name_en: p.name_en,
        name_ar: p.name_ar,
        images_count: (createdProj.images || []).length,
        showcase: createdProj.website_showcase_image,
        logo: createdProj.client_logo
      });
    } else {
      console.error(`❌ FAILED creating ${p.name_en}:`, createRes);
      throw new Error(`Failed to create project ${p.name_en}: ${JSON.stringify(createRes)}`);
    }
  }

  console.log('\n=== Step 4: Verification of Public Projects API ===');
  const pubRes = await fetch(`${BASE_URL}/site/projects`).then(r => r.json());
  const pubProjects = pubRes.data || [];
  console.log(`Live public endpoint returned ${pubProjects.length} projects:`);
  pubProjects.forEach((p, idx) => {
    console.log(` ${idx + 1}. [ID: ${p.id}] ${p.name || p.name_ar} (Slug: ${p.slug})`);
    console.log(`    - Category: ${p.category || p.category_id}`);
    console.log(`    - Social Images count: ${(p.images || []).length}`);
    (p.images || []).forEach((img, i) => {
      console.log(`      * Image ${i+1}: ${img.title || 'Untitled'} (${img.type}) -> ${img.url || img.image_path}`);
    });
  });

  console.log('\n=== ALL 4 PROJECTS SUCCESSFULLY SYNCED TO LIVE API! ===');
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
