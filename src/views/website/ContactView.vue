<template>
  <div class="contact-view">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">{{ t('contact.title') }}</h1>
        <p class="page-subtitle">{{ t('contact.subtitle') }}</p>
      </header>

      <div class="contact-grid">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <div class="form-card">
            <h3 class="form-title">{{ t('contact.send_message') }}</h3>
            <form @submit.prevent="handleSubmit" class="main-form">
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('auth.name') }} <span class="req">*</span></label>
                  <input type="text" v-model="form.name" :placeholder="t('contact.name_placeholder')" required />
                </div>
                <div class="form-group">
                  <label>{{ t('auth.email') }} <span class="req">*</span></label>
                  <input type="email" v-model="form.email" placeholder="email@example.com" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('auth.phone') }}</label>
                  <input type="tel" :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }" v-model="form.phone" placeholder="+962 79 123 4567" />
                </div>
                <div class="form-group">
                  <label>{{ t('contact.subject') }} <span class="req">*</span></label>
                  <div class="select-wrapper">
                    <select v-model="form.subject" required>
                      <option value="" disabled selected>{{ t('contact.choose_subject') }}</option>
                      <option value="استفسار عام">{{ t('contact.general_inquiry') }}</option>
                      <option value="طلب خاص">{{ t('contact.special_request') }}</option>
                      <option value="شكوى">{{ t('contact.complaint') }}</option>
                      <option value="اقتراح">{{ t('contact.suggestion') }}</option>
                    </select>
                    <i class="fas fa-chevron-down select-icon"></i>
                  </div>
                </div>
              </div>

              <div class="form-group full-width">
                <label>{{ t('contact.message') }} <span class="req">*</span></label>
                <textarea v-model="form.message" rows="6" :placeholder="t('contact.message_placeholder')" required></textarea>
              </div>

              <div class="form-action">
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  <i class="fas fa-paper-plane"></i>
                  <span>{{ isSubmitting ? t('contact.sending') : t('contact.submit') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Info Cards -->
        <div class="contact-info-section">
          <div class="info-card">
            <div class="info-icon-wrapper">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="info-content">
              <h4>{{ t('contact.address') }}</h4>
              <p>{{ localizedValue(storeSettings.address) || t('contact.default_address') }}</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon-wrapper">
              <i class="fas fa-phone-alt"></i>
            </div>
            <div class="info-content">
              <h4>{{ t('contact.phone') }}</h4>
              <p v-if="storeSettings.phone" dir="ltr">{{ storeSettings.phone }}</p>
              <p v-if="storeSettings.whatsapp" dir="ltr">{{ storeSettings.whatsapp }}</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon-wrapper">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="info-content">
              <h4>{{ t('contact.email') }}</h4>
              <p v-if="storeSettings.email">{{ storeSettings.email }}</p>
              <p v-if="storeSettings.support_email">{{ storeSettings.support_email }}</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon-wrapper">
              <i class="far fa-clock"></i>
            </div>
            <div class="info-content">
              <h4>{{ t('contact.working_hours') }}</h4>
              <p v-if="localizedValue(storeSettings.working_hours)">{{ localizedValue(storeSettings.working_hours) }}</p>
              <p v-if="localizedValue(storeSettings.friday_hours)">{{ localizedValue(storeSettings.friday_hours) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '../../config/axios';
import { useLocalized } from '../../composables/useLocalized';

const { t, locale } = useI18n();
const { localizedValue } = useLocalized();
const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

const storeSettings = reactive({
  address: {},
  phone: '',
  whatsapp: '',
  email: '',
  support_email: '',
  working_hours: {},
  friday_hours: {}
});

const isSubmitting = ref(false);

const fetchSettings = async () => {
  try {
    const res = await api.get('/frontend/settings');
    const settings = res.data.data || res.data;
    if (Array.isArray(settings)) {
      const getVal = (key) => settings.find(s => s.key === key)?.value;
      storeSettings.address = {
        ar: getVal('address_ar') || getVal('address'),
        en: getVal('address_en') || getVal('address')
      };
      storeSettings.phone = getVal('support_phone') || getVal('phone_number');
      storeSettings.email = getVal('email');
      storeSettings.whatsapp = getVal('whatsapp');
      storeSettings.support_email = getVal('support_email');
      storeSettings.working_hours = {
        ar: getVal('working_hours_ar'),
        en: getVal('working_hours_en')
      };
      storeSettings.friday_hours = {
        ar: getVal('friday_hours_ar'),
        en: getVal('friday_hours_en')
      };
    }
  } catch (err) {
    console.error('Failed to fetch contact settings', err);
  }
};

onMounted(fetchSettings);

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await api.post('/frontend/contact', form);
    alert(t('contact.success_message'));
    Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '' });
  } catch (err) {
    alert(err.response?.data?.message || t('contact.error_message'));
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-view {
  padding: 140px 0 100px;
  background: #fdfcfd;
  font-family: 'Almarai', sans-serif;
}

.container {
  max-width: 1300px !important;
  margin: 0 auto;
  padding: 0 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-size: 42px;
  font-weight: 850;
  color: #111827;
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 40px;
  align-items: start;
}

/* Form Section */
.form-card {
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  border: 1px solid #f3f4f6;
}

.form-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 0;
  width: 40px;
  height: 3px;
  background: #873260;
  border-radius: 2px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
  margin-top: 20px;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}

.form-group input, 
.form-group textarea, 
.form-group select {
  padding: 14px 18px;
  border: 1.5px solid #f3f4f6;
  border-radius: 12px;
  background: #fdfcfd;
  font-family: inherit;
  font-size: 15px;
  color: #111827;
  transition: all 0.3s;
  outline: none;
}

.form-group input:focus, 
.form-group textarea:focus, 
.form-group select:focus {
  border-color: #873260;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(135, 50, 96, 0.05);
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  width: 100%;
  appearance: none;
}

.select-icon {
  position: absolute;
  left: 15px;
  color: #9ca3af;
  pointer-events: none;
  font-size: 14px;
}

.req {
  color: #ef4444;
}

.form-action {
  margin-top: 30px;
  text-align: left;
}

.submit-btn {
  background: #873260;
  color: #fff;
  border: none;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #4a1936;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(135, 50, 96, 0.2);
}

.submit-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* Info Cards */
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #fff;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  gap: 20px;
  align-items: center;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}

.info-card:hover {
  border-color: #87326033;
  transform: translateX(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.info-icon-wrapper {
  width: 54px;
  height: 54px;
  background: #fdf2f8;
  color: #873260;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.info-content h4 {
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
}

.info-content p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-view { padding-top: 40px !important; }
  .container { padding: 0 20px; }
  .form-row { grid-template-columns: 1fr; }
  .page-title { font-size: 32px; }
  .form-card { padding: 25px; }
  .submit-btn { width: 100%; justify-content: center; }
}
</style>
