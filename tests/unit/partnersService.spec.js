import { describe, it, expect, beforeEach } from 'vitest';
import { PartnerService, DEFAULT_PARTNERS } from '../../src/services/PartnerService';
import { createPartnerModel } from '../../src/domain/models';

describe('Strategic Technology Partner Service & Store Integrations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly maps raw backend data to partner domain model', () => {
    const raw = {
      id: 99,
      name: 'Cloudflare',
      name_ar: 'كلاودفلير',
      subtitle: 'Global Cloud Security & CDN Partner',
      badge: 'شريك أمان سحابي',
      tier: 'Cloudflare Certified Partner',
      category: 'infrastructure',
      brand_color: '#F38020',
      accent_color: '#FAAD3F',
      logoType: 'custom',
      description: 'حماية وتأمين الشبكات السحابية ومواقع بي كايت مع تسريع المحتوى عبر شبكة CDN عالمية.',
      features: ['شبكة CDN عالمية', 'حماية DDoS المتقدمة', 'شهادات SSL مدارة'],
      google_play_url: '',
      apple_store_url: '',
      website_url: 'https://cloudflare.com',
      is_active: 1,
    };

    const model = createPartnerModel(raw);
    expect(model.id).toBe(99);
    expect(model.name).toBe('Cloudflare');
    expect(model.name_ar).toBe('كلاودفلير');
    expect(model.brand_color).toBe('#F38020');
    expect(model.features.length).toBe(3);
    expect(model.is_active).toBe(1);
  });

  it('serializes partner payload into FormData with features and links', async () => {
    const payload = {
      name: 'Google',
      name_ar: 'جوجل العالمية',
      subtitle: 'Google Cloud & Google Play Partner',
      badge: 'شريك تكنولوجي معتمد',
      tier: 'Google Premier Partner',
      category: 'cloud',
      brand_color: '#4285F4',
      accent_color: '#34A853',
      logoType: 'google',
      description: 'شراكة معتمدة لمتجر Google Play وسحابة Google Cloud.',
      features: ['متجر Google Play', 'Google Cloud Platform'],
      links: [
        { label: 'Google Play Console', href: 'https://play.google.com/console', type: 'primary' },
        { label: 'Google Cloud Portal', href: 'https://cloud.google.com', type: 'secondary' }
      ],
      google_play_url: 'https://play.google.com/console',
      apple_store_url: '',
      website_url: 'https://cloud.google.com',
      is_active: 1,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
    };

    const fd = await PartnerService.toMultipartPayload(payload);
    expect(fd).toBeInstanceOf(FormData);
    expect(fd.get('name')).toBe('Google');
    expect(fd.get('name_ar')).toBe('جوجل العالمية');
    expect(fd.get('category')).toBe('cloud');
    expect(fd.get('google_play_url')).toBe('https://play.google.com/console');
    expect(fd.get('features[0]')).toBe('متجر Google Play');
    expect(fd.get('features[1]')).toBe('Google Cloud Platform');
    expect(fd.get('links[0][label]')).toBe('Google Play Console');
    expect(fd.get('links[0][href]')).toBe('https://play.google.com/console');
  });

  it('supports full CRUD and status toggling for partners', async () => {
    const list = await PartnerService.getAll();
    expect(list.length).toBeGreaterThanOrEqual(DEFAULT_PARTNERS.length);

    // Create
    const created = await PartnerService.create({
      name: 'NVIDIA AI',
      name_ar: 'إنفيديا للذكاء الاصطناعي',
      subtitle: 'Accelerated Computing & AI Partner',
      badge: 'شريك الذكاء الاصطناعي',
      tier: 'NVIDIA Inception Premier',
      category: 'ai',
      brand_color: '#76B900',
      accent_color: '#111111',
      logoType: 'nvidia',
      description: 'تسريع تدريب وتطبيق نماذج الذكاء الاصطناعي عبر معالجات NVIDIA السحابية.',
      features: ['معالجات GPU سحابية', 'تكامل CUDA & TensorRT'],
      is_active: 1,
    });
    expect(created).toBeDefined();
    expect(created.name).toBe('NVIDIA AI');

    // Verify addition in list
    const updatedList = await PartnerService.getAll();
    expect(updatedList.some(p => p.name === 'NVIDIA AI')).toBe(true);

    // Toggle status
    await PartnerService.toggleStatus(created.id);
    const toggled = await PartnerService.getById(created.id);
    expect(toggled.is_active).toBe(0);

    // Update
    await PartnerService.update(created.id, { tier: 'NVIDIA Elite Partner' });
    const edited = await PartnerService.getById(created.id);
    expect(edited.tier).toBe('NVIDIA Elite Partner');

    // Delete
    await PartnerService.delete(created.id);
    const finalList = await PartnerService.getAll();
    expect(finalList.some(p => p.id === created.id)).toBe(false);
  });
});
