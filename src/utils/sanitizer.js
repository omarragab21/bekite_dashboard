/**
 * Security: DOMPurify HTML Sanitizer Wrapper for Be Kite Platform
 * Protects against Stored and Reflected Cross-Site Scripting (XSS).
 */

import DOMPurify from 'dompurify';

const DEFAULT_CONFIG = Object.freeze({
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'strong', 'em', 'span',
    'ul', 'ol', 'li', 'br', 'hr', 'blockquote', 'pre', 'code', 'table', 'thead',
    'tbody', 'tr', 'th', 'td', 'a', 'img', 'div'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'style'],
  ALLOW_DATA_ATTR: false,
});

function getPurifier() {
  if (typeof window !== 'undefined') {
    if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
      return DOMPurify;
    }
    if (typeof DOMPurify === 'function') {
      return DOMPurify(window);
    }
  }
  return null;
}

function stripDangerousMarkup(dirty) {
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/<a\s+([^>]*target=["']_blank["'][^>]*)>/gi, (match) => {
      if (!match.includes('rel=')) {
        return match.replace(/>$/, ' rel="noopener noreferrer">');
      }
      return match;
    });
}

/**
 * Sanitizes dirty HTML string, eliminating any malicious scripts, event handlers (onclick, onerror, etc.)
 *
 * @param {string} dirty - The raw HTML string
 * @param {object} customConfig - Optional custom DOMPurify config
 * @returns {string} Sanitized safe HTML
 */
export function sanitizeHtml(dirty, customConfig = {}) {
  if (!dirty || typeof dirty !== 'string') return '';

  const purifier = getPurifier();
  if (purifier && typeof purifier.sanitize === 'function') {
    const config = { ...DEFAULT_CONFIG, ...customConfig };
    return purifier.sanitize(dirty, config);
  }

  // Fallback for SSR / Node test environment
  return stripDangerousMarkup(dirty);
}

export default sanitizeHtml;
