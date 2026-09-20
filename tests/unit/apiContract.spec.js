import { describe, expect, it } from 'vitest';
import { createProductModel, createProjectModel } from '../../src/domain/models';
import { ProjectService } from '../../src/services/ProjectService';

describe('API contract mapping', () => {
  it('maps backend project images into the frontend galleries', () => {
    const project = createProjectModel({
      name_ar: 'مشروع',
      name_en: 'Project',
      images: [
        { id: 1, type: 'social', title: 'Social', image_url: 'https://cdn.test/social.png' },
        { id: 2, type: 'branding', title: 'Brand', image_url: 'https://cdn.test/brand.png' },
      ],
    });

    expect(project.social_media_images[0].image).toBe('https://cdn.test/social.png');
    expect(project.branding_images[0].image).toBe('https://cdn.test/brand.png');
  });

  it('maps product screen image URLs into the frontend gallery', () => {
    const product = createProductModel({
      name_ar: 'منتج',
      see_in_action_screen_one_image_url: 'https://cdn.test/one.png',
      see_in_action_screen_two_image_url: 'https://cdn.test/two.png',
    });

    expect(product.gallery).toHaveLength(2);
    expect(product.gallery[1].url).toBe('https://cdn.test/two.png');
  });

  it('serializes project gallery metadata using the backend multipart contract', async () => {
    const data = await ProjectService.toMultipartPayload({
      name_ar: 'مشروع',
      name_en: 'Project',
      client_name: 'QA',
      category_ids: [1],
      social_media_images: [{ title: 'Social', image: 'https://cdn.test/social.png' }],
    });
    const keys = [];
    data.forEach((_value, key) => keys.push(key));

    expect(keys).toContain('name_ar');
    expect(keys).toContain('category_ids[0]');
    expect(keys).toContain('images_data[0][title]');
    expect(keys).toContain('images_data[0][type]');
  });
});
