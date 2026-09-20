import { describe, expect, it } from 'vitest';
import { formatApiError } from '../../src/utils/errorHandler';
import { sanitizeHtml } from '../../src/utils/sanitizer';
import { useToast } from '../../src/composables/useToast';

describe('Security & Error Handler Unit Tests', () => {
  describe('formatApiError (OWASP A05 Information Disclosure Prevention)', () => {
    it('translates common raw English validation messages to Arabic', () => {
      expect(formatApiError('The given data was invalid.')).toContain('غير صحيحة');
      expect(formatApiError('The given data was invalid. (and 1 more error)')).toContain('غير صحيحة');
      expect(formatApiError('The email has already been taken.')).toContain('مسجل مسبقاً');
      expect(formatApiError('Unauthenticated.')).toContain('انتهت صلاحية الجلسة');
    });

    it('suppresses internal database and stack trace errors', () => {
      const sqlError = 'SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry in /home11/bekite/app/Http/Controllers/UserController.php:45';
      const result = formatApiError(sqlError);
      expect(result).not.toContain('SQLSTATE');
      expect(result).not.toContain('/home11/bekite');
      expect(result).toBe('حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً');
    });

    it('suppresses Symfony / Illuminate exception stack traces from 500 responses', () => {
      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'MethodNotAllowedHttpException in RouteCollection.php line 255',
            exception: 'Symfony\\Component\\HttpKernel\\Exception\\MethodNotAllowedHttpException',
            file: '/var/www/vendor/laravel/framework/src/Illuminate/Routing/RouteCollection.php',
          },
        },
      };

      const result = formatApiError(serverError);
      expect(result).not.toContain('MethodNotAllowedHttpException');
      expect(result).not.toContain('RouteCollection.php');
      expect(result).toBe('حدث خطأ غير متوقع في الخادم، يرجى المحاولة في وقت لاحق');
    });

    it('extracts specific friendly field errors from Laravel 422 responses', () => {
      const validationError = {
        response: {
          status: 422,
          data: {
            message: 'The given data was invalid.',
            errors: {
              email: ['The email has already been taken.'],
            },
          },
        },
      };

      const result = formatApiError(validationError);
      expect(result).toBe('البريد الإلكتروني مسجل مسبقاً لمستخدم آخر.');
    });

    it('handles network disconnection and timeouts cleanly', () => {
      const networkError = new Error('Network Error');
      expect(formatApiError(networkError)).toBe('تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');

      const timeoutError = { code: 'ECONNABORTED', message: 'timeout of 10000ms exceeded' };
      expect(formatApiError(timeoutError)).toBe('استغرق الطلب وقتاً أطول من المتوقع، يرجى التحقق من اتصالك بالإنترنت');
    });

    it('handles HTTP status 401, 403, 404, and 429 cleanly', () => {
      expect(formatApiError({ response: { status: 401 } })).toContain('انتهت صلاحية الجلسة');
      expect(formatApiError({ response: { status: 403 } })).toContain('ليس لديك الصلاحية');
      expect(formatApiError({ response: { status: 404 } })).toContain('غير موجود');
      expect(formatApiError({ response: { status: 429 } })).toContain('تم تجاوز الحد المسموح');
    });
  });

  describe('sanitizeHtml (OWASP A03 Stored/Reflected XSS Prevention)', () => {
    it('strips script tags and malicious event handlers', () => {
      const dangerousHtml = '<p>Hello</p><script>alert("xss")</script><img src="x" onerror="alert(1)">';
      const clean = sanitizeHtml(dangerousHtml);

      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert("xss")');
      expect(clean).not.toContain('onerror');
      expect(clean).toContain('<p>Hello</p>');
    });

    it('strips javascript: pseudo-protocol URIs from links', () => {
      const dangerousLink = '<a href="javascript:stealToken()">Click me</a>';
      const clean = sanitizeHtml(dangerousLink);

      expect(clean).not.toContain('javascript:');
      expect(clean).not.toContain('stealToken');
    });

    it('preserves safe formatting tags and ensures target="_blank" has noopener noreferrer', () => {
      const safeContent = '<p>Safe <strong>bold</strong> and <a href="https://be-kite.com" target="_blank">link</a></p>';
      const clean = sanitizeHtml(safeContent);

      expect(clean).toContain('<strong>bold</strong>');
      expect(clean).toContain('rel="noopener noreferrer"');
    });
  });

  describe('useToast Error Sanitization', () => {
    it('automatically sanitizes sensitive error messages passed to toast.error()', () => {
      const { error, toasts, removeToast } = useToast();
      const rawLeak = 'SQLSTATE[HY000]: General error /home11/bekite/...';

      const id = error(rawLeak);
      const addedToast = toasts.value.find((t) => t.id === id);

      expect(addedToast).toBeDefined();
      expect(addedToast.message).not.toContain('SQLSTATE');
      expect(addedToast.message).not.toContain('/home11/bekite');
      expect(addedToast.message).toBe('حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً');

      removeToast(id);
    });
  });
});
