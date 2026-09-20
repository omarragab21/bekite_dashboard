import { describe, it, expect } from 'vitest';
import { createProductModel } from '../../src/domain/models/index.js';

describe('Product Preview Model and Full Data Verification', () => {
  it('should correctly normalize live API product data with all 11 case study sections', () => {
    const liveApiProduct = {
      id: 15,
      slug: 'mawed-smart-booking',
      color: '#059669',
      is_featured_product: 1,
      is_active: 1,
      name: 'Mawed Smart Scheduling & Clinic Booking Platform',
      translations: {
        en: {
          name: 'Mawed Smart Scheduling & Clinic Booking Platform',
          address: 'Amman, Jordan - Abdoun',
          description: 'Smart appointment orchestration engine built for healthcare clinics.',
          see_in_action_screen_one_title: 'Live Appointment Dispatch Calendar',
          see_in_action_screen_two_title: 'Multi-Doctor Schedule Orchestration',
          see_in_action_screen_three_title: 'Automated WhatsApp Reminders & Deposits'
        },
        ar: {
          name: 'موعد - المنظومة الذكية لإدارة الحجوزات والعيادات والمراكز',
          address: 'عمان، الأردن - منطقة عبدون',
          description: 'نظام حجز وجدولة ذكي للعيادات الطبية وصالونات التجميل.',
          see_in_action_screen_one_title: 'شاشة حجز المريض والتقويم اليومي',
          see_in_action_screen_two_title: 'لوحة إدارة مواعيد الأطباء والموظفين',
          see_in_action_screen_three_title: 'شاشة تذكيرات الواتساب والدفع المسبق'
        }
      },
      overview_paragraph1: 'تخلص من فوضى المواعيد والانتظار مع نظام موعد الذكي...',
      overview_paragraph2: 'يوفر النظام تجربة سلسة للمراجعين وإدارة مركزية لغرف الكشف...',
      overview_tablet_image_url: 'https://site-backend.be-kite.com/storage/tablet.jpg',
      built_for_main_section_title: 'صُمم خصيصاً للعيادات والمراكز التخصصية والصالونات',
      built_for_secondary_section_title: 'تجربة حجز وتنظيم بدون تداخل في المواعيد',
      built_for_data: [
        { title: 'العيادات والمراكز الطبية', description: 'تنظيم غرف الكشف والملف الطبي.' },
        { title: 'مراكز التجميل والاستشارات', description: 'حجز الخدمات والدفع المسبق.' }
      ],
      what_it_does_main_title: 'المزايا والقدرات الأساسية لمنظومة موعد',
      what_it_does_secondary_title: 'كل ما تحتاجه لإدارة المواعيد والتواصل مع المرضى',
      what_it_does_data: [
        { title: 'تقويم مواعيد تفاعلي', description: 'عرض يومي وأسبوعي للجداول.' },
        { title: 'تذكيرات واتساب مؤتمتة', description: 'إرسال رسائل التذكير وتأكيد الحضور.' }
      ],
      see_in_action_main_image_url: 'https://site-backend.be-kite.com/storage/action_main.jpg',
      see_in_action_screen_one_image_url: 'https://site-backend.be-kite.com/storage/screen1.jpg',
      see_in_action_screen_two_image_url: 'https://site-backend.be-kite.com/storage/screen2.jpg',
      see_in_action_screen_three_image_url: 'https://site-backend.be-kite.com/storage/screen3.jpg',
      how_it_works_data: [
        { title: 'تحديد الخدمات وساعات العمل', description: 'إدخال قائمة الخدمات وأوقات الدوام.' },
        { title: 'مشاركة رابط الحجز المباشر', description: 'نشر رابط الحجز على السوشيال ميديا.' }
      ],
      why_teams_data: [
        { title: 'انخفاض نسبة الغياب No-Show', description: 'تنبيهات استباقية تفاعلية.' },
        { title: 'تقارير الأداء والإيرادات', description: 'معرفة عدد المواعيد المنجزة.' }
      ],
      scalability_tiers: [
        { title: 'Single Practice', advantage: 'جدولة متقدمة لفرع واحد.', specifications_capacity: 'حتى 1000 موعد شهرياً' },
        { title: 'Multi-Branch Medical Center', advantage: 'إدارة عدة فروع ومراكز.', specifications_capacity: 'أطباء ومواعيد غير محدودة' }
      ],
      packages: [
        { name: 'باقة إدارة الحجوزات الذكية', description: 'التقويم التفاعلي والحجز الإلكتروني.' },
        { name: 'باقة المجمعات الطبية', description: 'أطباء متعددون وتذكيرات واتساب.' }
      ]
    };

    const model = createProductModel(liveApiProduct);

    // 1. Hero & Base attributes
    expect(model.name).toBe('موعد - المنظومة الذكية لإدارة الحجوزات والعيادات والمراكز');
    expect(model.name_en).toBe('Mawed Smart Scheduling & Clinic Booking Platform');
    expect(model.address).toBe('عمان، الأردن - منطقة عبدون');
    expect(model.accent_color).toBe('#059669');

    // 2. Overview Section
    expect(model.overview.p1).toContain('تخلص من فوضى المواعيد');
    expect(model.overview.p2).toContain('يوفر النظام تجربة سلسة');
    expect(model.overview.image).toBe('https://site-backend.be-kite.com/storage/tablet.jpg');

    // 3. Built For Businesses
    expect(model.built_for.title).toContain('صُمم خصيصاً');
    expect(model.built_for.items).toHaveLength(2);
    expect(model.built_for.items[0].title).toBe('العيادات والمراكز الطبية');
    expect(model.built_for.items[0].desc).toContain('تنظيم غرف الكشف');

    // 4. Key Capabilities (What It Does)
    expect(model.what_it_does.title).toContain('المزايا والقدرات');
    expect(model.what_it_does.items).toHaveLength(2);
    expect(model.what_it_does.items[0].title).toBe('تقويم مواعيد تفاعلي');
    expect(model.what_it_does.items[1].desc).toContain('إرسال رسائل التذكير');

    // 5. See It In Action (Main screen + 3 sub-screens)
    expect(model.action_main_image).toBe('https://site-backend.be-kite.com/storage/action_main.jpg');
    expect(model.action_screens).toHaveLength(3);
    expect(model.action_screens[0].image).toBe('https://site-backend.be-kite.com/storage/screen1.jpg');
    expect(model.action_screens[0].title).toContain('شاشة حجز المريض');

    // 6. How It Works
    expect(model.how_it_works.steps).toHaveLength(2);
    expect(model.how_it_works.steps[0].title).toBe('تحديد الخدمات وساعات العمل');

    // 7. Why Teams Choose
    expect(model.why_choose.items).toHaveLength(2);
    expect(model.why_choose.items[0].title).toContain('انخفاض نسبة الغياب');

    // 8. Scalability Tiers
    expect(model.scalability).toHaveLength(2);
    expect(model.scalability[0].highlight).toBe('جدولة متقدمة لفرع واحد.');
    expect(model.scalability[0].specs).toContain('1000 موعد');

    // 9. Editions / Packages
    expect(model.editions).toHaveLength(2);
    expect(model.editions[0].name).toBe('باقة إدارة الحجوزات الذكية');

    // 10. Bottom CTA
    expect(model.bottom_cta.title).toContain('جاهز لتشغيل أو تخصيص');
  });
});
