import { describe, expect, it } from 'vitest';
import { validateImageFile, validateImageFiles } from '../../src/utils/imageUpload';

const image = (name, type = 'image/png', size = 1024) => new File(['x'.repeat(size)], name, { type });

describe('image upload validation', () => {
  it('accepts supported images below the size limit', () => {
    expect(validateImageFile(image('hero.webp', 'image/webp'))).toBeNull();
  });

  it('rejects unsupported types and oversized files', () => {
    expect(validateImageFile(image('payload.exe', 'application/octet-stream'))).toMatch(/غير مدعوم/);
    expect(validateImageFile(image('huge.png', 'image/png', 6 * 1024 * 1024))).toMatch(/5MB/);
  });

  it('limits a multi-file selection by the remaining capacity', () => {
    const result = validateImageFiles([
      image('one.png'),
      image('two.png'),
      image('three.png'),
    ], { currentCount: 8, maxFiles: 10 });

    expect(result.accepted).toHaveLength(2);
    expect(result.errors[0]).toMatch(/10/);
  });
});
