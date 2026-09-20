/**
 * Security Hardened Error Handler & Formatter for Be Kite Platform
 * Protects against Information Disclosure (OWASP A05) and provides
 * clean, human-friendly localized error messages.
 */

// Patterns indicating sensitive internal server details that must NEVER be leaked to users
const SENSITIVE_ERROR_PATTERNS = [
  /sqlstate/i,
  /syntax error/i,
  /integrity constraint/i,
  /pdoexception/i,
  /queryexception/i,
  /database/i,
  /connection refused/i,
  /vendor\//i,
  /\/home\d*\//i,
  /\/var\/www\//i,
  /stack trace/i,
  /exception/i,
  /illuminate\\/i,
  /symfony\\/i,
  /notfoundhttpexception/i,
  /methodnotallowed/i,
  /call to undefined/i,
  /fatal error/i,
  /eval\(\)/i,
];

// Translations for common raw backend validation messages
const COMMON_TRANSLATIONS = {
  'the given data was invalid.': 'البيانات المدخلة غير صالحة، يرجى مراجعة الحقول.',
  'unauthenticated.': 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.',
  'the email has already been taken.': 'البريد الإلكتروني مسجل مسبقاً لمستخدم آخر.',
  'the name field is required.': 'حقل الاسم مطلوب.',
  'the email field is required.': 'حقل البريد الإلكتروني مطلوب.',
  'the password confirmation does not match.': 'تأكيد كلمة المرور غير متطابق.',
  'the password must be at least 8 characters.': 'يجب ألا تقل كلمة المرور عن 8 أحرف.',
  'these credentials do not match our records.': 'بيانات الاعتماد غير متطابقة مع سجلاتنا.',
  'too many requests.': 'تم تجاوز عدد المحاولات المسموح به، يرجى الانتظار قليلاً.',
};

/**
 * Extracts a secure, sanitized, and friendly message from an API error.
 *
 * @param {any} err - The error caught from axios or a service call
 * @param {string} fallback - A safe fallback message in Arabic
 * @returns {string} Sanitized, localized error message
 */
export function formatApiError(err, fallback = 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً') {
  if (!err) return fallback;

  // Handle plain string error inputs
  if (typeof err === 'string') {
    const trimmed = err.trim();
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('the given data was invalid')) {
      return 'البيانات المدخلة غير صحيحة، يرجى مراجعة الحقول والمحاولة مجدداً';
    }
    if (COMMON_TRANSLATIONS[lower]) return COMMON_TRANSLATIONS[lower];
    if (isSensitive(trimmed)) return fallback;
    return trimmed;
  }

  // 1. Network / Connection Errors
  if (!err.response) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return 'استغرق الطلب وقتاً أطول من المتوقع، يرجى التحقق من اتصالك بالإنترنت';
    }
    if (err.message === 'Network Error' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت';
    }
    if (err.message && !isSensitive(err.message)) {
      return err.message;
    }
    return fallback;
  }

  const { status, data } = err.response;

  // 2. Authentication & Authorization Errors
  if (status === 401) {
    return 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً';
  }
  if (status === 403) {
    return 'ليس لديك الصلاحية الكافية لإتمام هذا الإجراء';
  }
  if (status === 404) {
    return 'السجل أو المسار المطلوب غير موجود في النظام';
  }
  if (status === 429) {
    return 'تم تجاوز الحد المسموح من الطلبات، يرجى الانتظار بضع دقائق ثم المحاولة مجدداً';
  }
  if (status >= 500) {
    // High-security rule: Never show raw 500 error messages to clients
    return 'حدث خطأ غير متوقع في الخادم، يرجى المحاولة في وقت لاحق';
  }

  // 3. Validation Errors (Status 422)
  if (status === 422 && data) {
    // If Laravel returned an errors object, extract the first specific field message
    if (data.errors && typeof data.errors === 'object') {
      const errorValues = Object.values(data.errors);
      if (errorValues.length > 0) {
        const firstEntry = errorValues[0];
        const rawMsg = Array.isArray(firstEntry) ? firstEntry[0] : String(firstEntry);
        if (rawMsg && typeof rawMsg === 'string') {
          const lower = rawMsg.trim().toLowerCase();
          if (COMMON_TRANSLATIONS[lower]) {
            return COMMON_TRANSLATIONS[lower];
          }
          // Ensure the validation message doesn't leak internal code/tokens
          if (!isSensitive(rawMsg)) {
            return rawMsg;
          }
        }
      }
    }

    // If message exists in data
    if (typeof data.message === 'string') {
      const trimmed = data.message.trim();
      const lower = trimmed.toLowerCase();
      // Filter out generic Laravel "The given data was invalid. (and 1 more error)"
      if (lower.startsWith('the given data was invalid')) {
        return 'البيانات المدخلة غير صحيحة، يرجى مراجعة الحقول والمحاولة مجدداً';
      }
      if (COMMON_TRANSLATIONS[lower]) {
        return COMMON_TRANSLATIONS[lower];
      }
      if (!isSensitive(trimmed)) {
        return trimmed;
      }
    }
    return 'يرجى التأكد من صحة كافة البيانات المدخلة والمحاولة مجدداً';
  }

  // 4. Client Errors (Status 400 - 499)
  if (typeof data?.message === 'string') {
    const trimmed = data.message.trim();
    const lower = trimmed.toLowerCase();
    if (COMMON_TRANSLATIONS[lower]) {
      return COMMON_TRANSLATIONS[lower];
    }
    if (!isSensitive(trimmed)) {
      return trimmed;
    }
  }

  return fallback;
}

/**
 * Checks if an error string contains sensitive server or database internals
 */
function isSensitive(msg) {
  if (typeof msg !== 'string') return true;
  return SENSITIVE_ERROR_PATTERNS.some((pattern) => pattern.test(msg));
}
