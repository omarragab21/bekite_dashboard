import { ref } from 'vue';
import { formatApiError } from '../utils/errorHandler';

const toasts = ref([]);

let toastId = 0;

export function useToast() {
  const showToast = (message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    let safeMessage = message;
    if (type === 'error') {
      safeMessage = formatApiError(message);
    }
    const toast = { id, message: safeMessage, type };
    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const success = (msg, duration) => showToast(msg, 'success', duration);
  const error = (msg, duration) => showToast(msg, 'error', duration);
  const info = (msg, duration) => showToast(msg, 'info', duration);
  const warning = (msg, duration) => showToast(msg, 'warning', duration);

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return {
    toasts,
    showToast,
    success,
    error,
    info,
    warning,
    removeToast,
  };
}

export default useToast;
