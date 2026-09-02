/**
 * Core Formatting Utilities for Be Kite Platform
 */

/**
 * Format a date string to Arabic localized format
 * @param {string|Date} dateVal 
 * @param {object} options 
 * @returns {string}
 */
export function formatDate(dateVal, options = {}) {
  if (!dateVal) return '-';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return date.toLocaleDateString('ar-SA', defaultOptions);
}

/**
 * Format relative time (e.g. منذ 5 دقائق، الآن)
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export function formatRelativeTime(dateVal) {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(date);
}

/**
 * Format Currency (e.g., $15,000 or 5,000 د.أ)
 * @param {number|string} amount 
 * @param {string} currency 
 * @returns {string}
 */
export function formatCurrency(amount, currency = '$') {
  if (amount === null || amount === undefined || amount === '') return '-';
  const num = Number(amount);
  if (isNaN(num)) return String(amount);
  return `${num.toLocaleString('en-US')} ${currency}`;
}

/**
 * Truncate text with ellipsis
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
export function truncate(text, length = 60) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Generate a URL-friendly slug from Arabic/English text
 * @param {string} text 
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0621-\u064A-]+/g, '')
    .replace(/--+/g, '-');
}
