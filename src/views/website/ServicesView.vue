<template>
  <div class="services-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t('services.title', 'خدماتنا') }}</h1>
        <p class="page-subtitle">{{ t('services.subtitle', 'اكتشف الخدمات التي نقدمها') }}</p>
      </div>

      <div class="services-grid" v-if="!loading">
        <div v-if="items.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <p>{{ t('services.no_services', 'لا توجد خدمات متاحة') }}</p>
        </div>
        <div v-for="service in items" :key="service.id" class="service-card">
          <div class="service-image">
            <img v-if="service.image" :src="service.image" :alt="service.name" />
            <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div class="service-info">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-desc">{{ service.description }}</p>
          </div>
          <button class="request-btn" @click="openRequestModal(service)">
            {{ t('services.request_service', 'طلب الخدمة') }}
          </button>
        </div>
      </div>

      <div class="loading-state" v-else>
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Service Request Modal -->
    <div class="modal-overlay" v-if="showRequestModal" @click.self="closeRequestModal">
      <div class="modal-content request-content">
        <button class="modal-close" @click="closeRequestModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h3 class="modal-title">{{ t('services.request_service', 'طلب الخدمة') }}</h3>
        <p class="modal-subtitle">{{ selectedService?.name }}</p>

        <form @submit.prevent="submitRequest" class="request-form">
          <div class="form-group">
            <label class="form-label">{{ t('services.full_name', 'الاسم الكامل') }} <span class="req">*</span></label>
            <input type="text" v-model="requestForm.full_name" class="form-control" :placeholder="t('services.name_placeholder', 'أدخل اسمك الكامل')" required />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('services.phone', 'رقم الهاتف') }} <span class="req">*</span></label>
            <input type="tel" v-model="requestForm.phone" class="form-control ltr-input" :placeholder="t('services.phone_placeholder', '+962...')" required />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('services.email', 'البريد الإلكتروني') }} <span class="req">*</span></label>
            <input type="email" v-model="requestForm.email" class="form-control ltr-input" :placeholder="t('services.email_placeholder', 'example@email.com')" required />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('services.country', 'الدولة') }} <span class="req">*</span></label>
            <select v-model="requestForm.country" class="form-control" required>
              <option value="" disabled selected>{{ t('services.select_country', 'اختر الدولة') }}</option>
              <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('services.message', 'الرسالة') }} <span class="req">*</span></label>
            <textarea v-model="requestForm.message" class="form-control" rows="4" :placeholder="t('services.message_placeholder', 'اكتب تفاصيل طلبك...')" required></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeRequestModal">{{ t('services.cancel', 'إلغاء') }}</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? t('services.sending', 'جاري الإرسال...') : t('services.confirm_request', 'تأكيد الطلب') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Alert -->
    <div class="alert-toast" :class="[alertType, { show: showAlert }]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
        <path v-if="alertType === 'success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="alertType === 'success'" points="22 4 12 14.01 9 11.01"/>
        <circle v-if="alertType === 'error'" cx="12" cy="12" r="10"/><line v-if="alertType === 'error'" x1="12" y1="8" x2="12" y2="12"/><line v-if="alertType === 'error'" x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '../../config/axios';

const { t, locale } = useI18n();
const currentLang = computed(() => locale.value);

const items = ref([]);
const loading = ref(true);
const showRequestModal = ref(false);
const selectedService = ref(null);
const isSubmitting = ref(false);

const countries = [
  'الأردن', 'السعودية', 'الإمارات العربية المتحدة', 'مصر', 'الكويت', 'قطر',
  'البحرين', 'عمان', 'العراق', 'لبنان', 'سوريا', 'فلسطين', 'اليمن',
  'ليبيا', 'الجزائر', 'المغرب', 'تونس', 'السودان', 'أخرى'
];

const requestForm = ref({
  service_id: null,
  full_name: '',
  phone: '',
  email: '',
  country: '',
  message: ''
});

const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg; alertType.value = type; showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3000);
};

onMounted(async () => {
  try {
    const res = await api.get('/frontend/services?per_page=100');
    items.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch services', err);
  } finally {
    loading.value = false;
  }
});

const openRequestModal = (service) => {
  selectedService.value = service;
  requestForm.value = {
    service_id: service.id,
    full_name: '',
    phone: '',
    email: '',
    country: '',
    message: ''
  };
  showRequestModal.value = true;
};

const closeRequestModal = () => {
  showRequestModal.value = false;
  selectedService.value = null;
};

const submitRequest = async () => {
  isSubmitting.value = true;
  try {
    await api.post('/frontend/service-requests', requestForm.value);
    triggerAlert(t('services.success_message', 'تم إرسال طلب الخدمة بنجاح'));
    closeRequestModal();
  } catch (error) {
    const msg = error.response?.data?.message || t('services.error_message', 'فشل إرسال الطلب');
    triggerAlert(msg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.services-view { padding: 3rem 0; }
.container { max-width: 900px; margin: 0 auto; padding: 0 5%; }
.page-header { text-align: center; margin-bottom: 3rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
.page-subtitle { font-size: 1rem; color: #6b7280; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.service-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
.service-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.service-image { width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f3f4f6; flex-shrink: 0; }
.service-image img { width: 100%; height: 100%; object-fit: cover; }
.service-info { flex: 1; margin-bottom: 1rem; }
.service-name { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
.service-desc { font-size: 0.85rem; color: #6b7280; margin: 0; line-height: 1.5; }
.request-btn { background: #873260; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: background 0.2s; }
.request-btn:hover { background: #6E1A41; }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; color: #9ca3af; }
.empty-state p { margin-top: 1rem; font-size: 0.9rem; }
.loading-state { display: flex; justify-content: center; padding: 4rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
.modal-content { background: #fff; border-radius: 12px; width: 100%; max-width: 500px; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto; }
.request-content { max-width: 600px; }
.modal-close { position: absolute; top: 1.2rem; left: 1.2rem; background: none; border: none; color: #9ca3af; cursor: pointer; transition: color 0.2s; }
.modal-close:hover { color: #111827; }
.modal-title { font-size: 1.2rem; font-weight: 800; color: #111827; text-align: center; margin-bottom: 0.2rem; }
.modal-subtitle { font-size: 0.9rem; color: #873260; text-align: center; margin-bottom: 1.5rem; font-weight: 600; }
.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; text-align: right; }
.req { color: #dc2626; }
.form-control { width: 100%; padding: 0.65rem 0.8rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #1f2937; outline: none; transition: border-color 0.2s; text-align: right; }
.form-control:focus { border-color: #873260; }
.form-control.ltr-input { direction: ltr; text-align: left; }
select.form-control { cursor: pointer; }
.form-actions { margin-top: 1.5rem; display: flex; justify-content: center; gap: 0.75rem; }
.btn-submit { background: #873260; color: #fff; border: none; padding: 0.7rem 2rem; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
.btn-submit:hover:not(:disabled) { background: #6E1A41; }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-cancel { padding: 0.7rem 2rem; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: #f9fafb; }
.alert-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); padding: 0.75rem 1.5rem; border-radius: 30px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; opacity: 0; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: 'Cairo', sans-serif; }
.alert-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
.alert-toast.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.alert-toast.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.alert-icon { flex-shrink: 0; }
</style>
