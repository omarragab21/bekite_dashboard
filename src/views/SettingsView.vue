<template>
  <div class="settings-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">إعدادات المنصة والهوية (Platform Settings)</h1>
        <p class="page-subtitle">إدارة بيانات شركة Be Kite، معلومات التواصل، روابط التواصل الاجتماعي، وإعدادات محركات البحث</p>
      </div>
      <div class="header-btns" style="display: flex; gap: 0.75rem; align-items: center;">
        <router-link to="/admin/about-us" class="btn-goto-aboutus">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>{{ isArabic ? 'معلومات التواصل' : 'About Us' }}</span>
        </router-link>
        <button class="btn-save-all" @click="saveSettings" :disabled="saving">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
          </svg>
          {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
        </button>
      </div>
    </div>

    <!-- Form Cards -->
    <div class="settings-grid">
      <!-- General Agency Info -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">معلومات وهوية الشركة</h2>
          <span class="card-desc">البيانات الأساسية المعروضة في الترويسة والتذييل</span>
        </div>
        <div class="card-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">اسم الشركة (بالعربية)</label>
              <input type="text" v-model="settings.site_name" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">اسم الشركة (English)</label>
              <input type="text" v-model="settings.site_name_en" class="form-input ltr-text" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الشعار النصي (Tagline / Slogan)</label>
            <input type="text" v-model="settings.tagline" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">العنوان والمقر الرئيسي</label>
            <input type="text" v-model="settings.address" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Contact & Communication -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">قنوات التواصل والاتصال</h2>
          <span class="card-desc">أرقام الهواتف والبريد الإلكتروني للعملاء والاستفسارات</span>
        </div>
        <div class="card-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">البريد الإلكتروني الرسمي</label>
              <input type="email" v-model="settings.email" class="form-input ltr-text" />
            </div>
            <div class="form-group">
              <label class="form-label">رقم الهاتف والواتساب</label>
              <input type="text" v-model="settings.phone" class="form-input ltr-text" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">ساعات العمل</label>
              <input type="text" v-model="settings.working_hours" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">رابط خرائط جوجل (Google Maps)</label>
              <input type="text" v-model="settings.google_maps_url" class="form-input ltr-text" />
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media Links -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">روابط منصات التواصل الاجتماعي</h2>
          <span class="card-desc">الحسابات الرسمية لمنظومة Be Kite</span>
        </div>
        <div class="card-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">LinkedIn</label>
              <input type="text" v-model="settings.social_links.linkedin" class="form-input ltr-text" />
            </div>
            <div class="form-group">
              <label class="form-label">Instagram</label>
              <input type="text" v-model="settings.social_links.instagram" class="form-input ltr-text" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">X / Twitter</label>
              <input type="text" v-model="settings.social_links.twitter" class="form-input ltr-text" />
            </div>
            <div class="form-group">
              <label class="form-label">Facebook</label>
              <input type="text" v-model="settings.social_links.facebook" class="form-input ltr-text" />
            </div>
          </div>
        </div>
      </div>

      <!-- SEO & Metadata -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">إعدادات محركات البحث (SEO)</h2>
          <span class="card-desc">البيانات الوصفية الافتراضية للمنصة</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">عنوان الموقع الافتراضي (Meta Title)</label>
            <input type="text" v-model="settings.meta_title" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">الوصف الافتراضي (Meta Description)</label>
            <textarea v-model="settings.meta_description" class="form-textarea" rows="3"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { SettingsService } from '../services/SettingsService';
import { useToast } from '../composables/useToast';

const { locale } = useI18n();
const isArabic = computed(() => (locale?.value || 'ar') === 'ar');

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);

const settings = ref({
  site_name: 'بي كايت | Be Kite',
  site_name_en: 'Be Kite Platform',
  tagline: 'الابتكار الرقمي، تطوير الأنظمة، وبناء المنصات السحابية',
  address: 'عمان، الأردن - مجمع الملك حسين للأعمال',
  phone: '+962 6 000 0000',
  email: 'info@bekite.com',
  working_hours: 'الأحد - الخميس: 9:00 ص - 6:00 م',
  google_maps_url: 'https://maps.google.com',
  meta_title: 'Be Kite | الشركة الرائدة في تطوير الحلول الرقمية والأنظمة السحابية',
  meta_description: 'نبتكر حلولاً تقنية شاملة، نبني أنظمة سحابية متقدمة، ونمكن العلامات التجارية من الريادة الرقمية.',
  social_links: {
    linkedin: 'https://linkedin.com/company/bekite',
    instagram: 'https://instagram.com/bekite',
    twitter: 'https://twitter.com/bekite',
    facebook: 'https://facebook.com/bekite',
  },
});

const fetchSettings = async () => {
  loading.value = true;
  try {
    const data = await SettingsService.getAll();
    if (data) {
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.key) settings.value[item.key] = item.value;
        });
      } else {
        settings.value = { ...settings.value, ...data };
      }
      if (!settings.value.social_links) {
        settings.value.social_links = {
          linkedin: 'https://linkedin.com/company/bekite',
          instagram: 'https://instagram.com/bekite',
          twitter: 'https://twitter.com/bekite',
          facebook: 'https://facebook.com/bekite',
        };
      }
    }
  } catch (err) {
    console.error('Failed to fetch settings', err);
    toastError('تعذر تحميل إعدادات المنصة');
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  saving.value = true;
  try {
    await SettingsService.save(settings.value);
    success('تم حفظ إعدادات المنصة بنجاح');
  } catch (err) {
    console.error('Failed to save settings', err);
    toastError('حدث خطأ أثناء حفظ الإعدادات');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.btn-goto-aboutus {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.25);
  color: #7c3aed;
  text-decoration: none;
  padding: 0.65rem 1.15rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}
.btn-goto-aboutus:hover {
  background: #7c3aed;
  color: #fff;
  transform: translateY(-2px);
}

.btn-save-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  transition: transform 0.15s ease;
}
.btn-save-all:hover { transform: translateY(-2px); }

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

.settings-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.form-input, .form-textarea {
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.85rem;
}
</style>
