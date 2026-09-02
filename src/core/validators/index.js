/**
 * Core Validators for Be Kite Platform Form Inputs
 */

export function validateRequired(value, fieldName = 'هذا الحقل') {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} مطلوب`;
  }
  return null;
}

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'البريد الإلكتروني مطلوب';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'صيغة البريد الإلكتروني غير صحيحة';
  }
  return null;
}

export function validatePhone(phone) {
  if (!phone) return null;
  const phoneRegex = /^[+0-9\s-]{7,20}$/;
  if (!phoneRegex.test(phone.trim())) {
    return 'رقم الهاتف غير صالح';
  }
  return null;
}

export function validateUrl(url) {
  if (!url) return null;
  try {
    new URL(url);
    return null;
  } catch {
    return 'الرابط غير صالح (يجب أن يبدأ بـ https://)';
  }
}
