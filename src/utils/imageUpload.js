export const IMAGE_UPLOAD_RULES = Object.freeze({
  maxFileSize: 5 * 1024 * 1024,
  maxFiles: 10,
  acceptedTypes: Object.freeze(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  acceptedExtensions: Object.freeze(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']),
});

export function validateImageFile(file, rules = IMAGE_UPLOAD_RULES) {
  if (!file) return 'الملف غير موجود';

  const extension = String(file.name || '').split('.').pop()?.toLowerCase();
  const typeIsValid = rules.acceptedTypes.includes(file.type) || rules.acceptedExtensions.includes(extension);
  if (!typeIsValid) return 'نوع الملف غير مدعوم. استخدم JPG أو PNG أو WEBP أو GIF أو SVG';
  if (file.size > rules.maxFileSize) return `حجم الصورة يجب ألا يتجاوز ${rules.maxFileSize / 1024 / 1024}MB`;
  if (file.size === 0) return 'لا يمكن رفع ملف فارغ';
  return null;
}

export function validateImageFiles(files, { currentCount = 0, maxFiles = IMAGE_UPLOAD_RULES.maxFiles, rules = IMAGE_UPLOAD_RULES } = {}) {
  const incoming = Array.from(files || []);
  const available = Math.max(0, maxFiles - currentCount);
  const accepted = [];
  const errors = [];

  if (incoming.length > available) {
    errors.push(`يمكنك رفع ${maxFiles} صور كحد أقصى`);
  }

  incoming.slice(0, available).forEach((file) => {
    const error = validateImageFile(file, rules);
    if (error) errors.push(`${file.name}: ${error}`);
    else accepted.push(file);
  });

  return { accepted, errors };
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`تعذر قراءة الملف: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export function revokeObjectUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:') && typeof URL !== 'undefined') {
    URL.revokeObjectURL(url);
  }
}
