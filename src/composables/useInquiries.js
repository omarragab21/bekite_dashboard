import { ref, computed } from 'vue';
import { InquiryService } from '../services/InquiryService';
import { useToast } from './useToast';

export function useInquiries() {
  const inquiries = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const { success, error: toastError } = useToast();

  const fetchInquiries = async () => {
    loading.value = true;
    error.value = null;
    try {
      inquiries.value = await InquiryService.getAll();
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
      error.value = 'تعذر تحميل طلبات واستفسارات العملاء';
      toastError('تعذر تحميل طلبات العملاء');
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const updated = await InquiryService.updateStatus(id, status);
      const idx = inquiries.value.findIndex(i => String(i.id) === String(id));
      if (idx !== -1) {
        inquiries.value[idx].status = status;
      }
      success('تم تحديث حالة الطلب بنجاح');
      return updated;
    } catch (err) {
      toastError('حدث خطأ أثناء تحديث حالة الطلب');
      throw err;
    }
  };

  const updateInquiry = async (id, payload) => {
    try {
      const updated = await InquiryService.update(id, payload);
      const idx = inquiries.value.findIndex(i => String(i.id) === String(id));
      if (idx !== -1) {
        inquiries.value[idx] = { ...inquiries.value[idx], ...updated };
      }
      success('تم تحديث بيانات واستفسار العميل');
      return updated;
    } catch (err) {
      toastError('حدث خطأ أثناء تحديث بيانات الطلب');
      throw err;
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await InquiryService.delete(id);
      inquiries.value = inquiries.value.filter(i => String(i.id) !== String(id));
      success('تم حذف الطلب بنجاح');
      return true;
    } catch (err) {
      toastError('حدث خطأ أثناء حذف الطلب');
      throw err;
    }
  };

  const newInquiriesCount = computed(() => {
    return inquiries.value.filter(i => i.status === 'new').length;
  });

  const inProgressCount = computed(() => {
    return inquiries.value.filter(i => i.status === 'in_progress' || i.status === 'contacted').length;
  });

  const convertedCount = computed(() => {
    return inquiries.value.filter(i => i.status === 'converted').length;
  });

  return {
    inquiries,
    loading,
    error,
    newInquiriesCount,
    inProgressCount,
    convertedCount,
    fetchInquiries,
    updateStatus,
    updateInquiry,
    deleteInquiry,
  };
}

export default useInquiries;
