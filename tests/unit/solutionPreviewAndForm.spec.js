import { describe, it, expect } from 'vitest';
import { createSolutionModel } from '../../src/domain/models/index.js';
import { SolutionService } from '../../src/services/SolutionService.js';

describe('Solutions Preview and Form Contract Suite', () => {
  const sampleApiData = {
    id: 1,
    title: 'حلول الميديا والإنتاج المرئي',
    title_ar: 'حلول الميديا والإنتاج المرئي',
    title_en: 'Media & Visual Production Solutions',
    headline: 'إنتاج سينمائي بمعدات هوليوود',
    headline_ar: 'إنتاج سينمائي بمعدات هوليوود',
    headline_en: 'Cinema-Grade Visual Production',
    slug: 'media-production',
    department: 'Creative Production',
    badge: 'ENTERPRISE PRODUCTION',
    description: 'حلول متكاملة لإنتاج الفيديو والتصوير التجاري الاحترافي.',
    is_active: 1,
    technologies: ['RED Cinema', 'ARRI', 'DaVinci Resolve'],
    problem_section: {
      badge: 'THE CHALLENGE',
      department_title: 'عقبات الميديا والإنتاج',
      department_subtitle: 'مشاكل الجودة والإنتاج التقليدي',
      challenges: [
        { title: 'ضعف الجودة البصرية', description: 'التصوير بدون معدات احترافية يضعف موثوقية علامتك التجارية.' },
        { title: 'غياب السيناريو المؤثر', description: 'إنتاج محتوى عشوائي لا يحقق أي مبيعات أو تفاعل حقيقي.' }
      ]
    },
    solve_section: {
      badge: 'OUR APPROACH',
      department_title: 'كيف ننتج المحتوى باحترافية',
      department_subtitle: 'كاميرات سينمائية وإضاءة استوديو متكاملة',
      department_description: 'طواقم تصوير متخصصة وأحدث معدات الإخراج السينمائي.',
      image_url: 'https://site-backend.be-kite.com/public/storage/solve.jpg',
      cta_text: 'احجز جلسة استشارة إنتاج'
    },
    deliver_section: {
      department_title: 'ما ستحصل عليه بالتفصيل',
      department_subtitle: 'مخرجات جاهزة للبث والنشر الفوري',
      exits: [
        { title: 'إعلانات تجارية سينمائية', description: 'إعلانات مهيأة للتلفزيون ومنصات التواصل.' },
        { title: 'جلسات تصوير منتجات استوديو', description: 'صور فوتوغرافية فائقة النقاء بدقة 8K.' }
      ],
      proven_execution_framework: [
        { title: 'كتابة السيناريو واللوحات', description: 'تخطيط القصة وكتابة النص الإعلاني.' },
        { title: 'يوم التصوير الرئيسي', description: 'تنفيذ المشاهد بكاميرات RED وطاقم متكامل.' },
        { title: 'المونتاج وتلوين DaVinci', description: 'مونتاج سينمائي وهندسة صوتية شاملة.' }
      ],
      why_choose_us: [
        { title: 'كاميرات سينمائية معتمدة', description: 'أعلى معايير الإنتاج التلفزيوني والسينمائي.' },
        { title: 'تسليم سريع بمقاسات متعددة', description: 'تجهيز نسخ للشاشات الكبيرة وللهواتف (9:16).' }
      ]
    }
  };

  it('normalizes API solution data into dual keys for template rendering and preview display', () => {
    const model = createSolutionModel(sampleApiData);

    // Problem challenges accessible as both items and challenges
    expect(model.problem_section.items).toHaveLength(2);
    expect(model.problem_section.challenges).toHaveLength(2);
    expect(model.problem_section.items[0].title).toBe('ضعف الجودة البصرية');

    // Solve section properties normalized
    expect(model.solve_section.department_description).toBe('طواقم تصوير متخصصة وأحدث معدات الإخراج السينمائي.');
    expect(model.solve_section.image_url).toContain('solve.jpg');
    expect(model.solve_section.cta_text).toBe('احجز جلسة استشارة إنتاج');

    // Deliver exits accessible as both items and exits
    expect(model.deliver_section.items).toHaveLength(2);
    expect(model.deliver_section.exits).toHaveLength(2);

    // Process steps accessible as steps and proven_execution_framework
    expect(model.process_section.steps).toHaveLength(3);
    expect(model.process_section.proven_execution_framework).toHaveLength(3);

    // Why Choose Us accessible as items and why_choose_us
    expect(model.why_section.items).toHaveLength(2);
    expect(model.why_section.why_choose_us).toHaveLength(2);
  });

  it('serializes complete 31-parameter Postman payload via toMultipartPayload', async () => {
    const model = createSolutionModel(sampleApiData);
    const fd = await SolutionService.toMultipartPayload(model);

    // Check FormData contains all required Postman keys
    expect(fd.get('title_ar')).toBe('حلول الميديا والإنتاج المرئي');
    expect(fd.get('title_en')).toBe('Media & Visual Production Solutions');
    expect(fd.get('headline_ar')).toBe('إنتاج سينمائي بمعدات هوليوود');
    expect(fd.get('headline_en')).toBe('Cinema-Grade Visual Production');
    expect(fd.get('slug')).toBe('media-production');
    expect(fd.get('department')).toBe('Creative Production');
    expect(fd.get('problem_badge')).toBe('THE CHALLENGE');
    expect(fd.get('problem_department_title')).toBe('عقبات الميديا والإنتاج');
    expect(fd.get('challenges[0][title]')).toBe('ضعف الجودة البصرية');
    expect(fd.get('challenges[0][description]')).toBe('التصوير بدون معدات احترافية يضعف موثوقية علامتك التجارية.');
    expect(fd.get('solve_department_badge')).toBe('OUR APPROACH');
    expect(fd.get('solve_department_title')).toBe('كيف ننتج المحتوى باحترافية');
    expect(fd.get('solve_department_description')).toBe('طواقم تصوير متخصصة وأحدث معدات الإخراج السينمائي.');
    expect(fd.get('solve_cta_text')).toBe('احجز جلسة استشارة إنتاج');
    expect(fd.get('deliver_department_title')).toBe('ما ستحصل عليه بالتفصيل');
    expect(fd.get('exits[0][title]')).toBe('إعلانات تجارية سينمائية');
    expect(fd.get('proven_execution_framework[0][title]')).toBe('كتابة السيناريو واللوحات');
    expect(fd.get('why_choose_us[0][title]')).toBe('كاميرات سينمائية معتمدة');
  });
});
