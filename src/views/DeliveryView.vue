<template>
  <div class="delivery-page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h2 class="page-title">إدارة مناطق التوصيل</h2>
        <p class="page-subtitle">الأردن — تسعيرة التوصيل لكل محافظة</p>
      </div>
      <button class="add-btn" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة تسعيرة
      </button>
    </div>

    <!-- Country Badge -->
    <div class="country-badge">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span>المملكة الأردنية الهاشمية</span>
      <span class="gov-count">{{ rates.length }} / 12 محافظة مُسعَّرة</span>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">محافظات مُسعَّرة</span>
        <span class="stat-value">{{ rates.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">محافظات نشطة</span>
        <span class="stat-value">{{ activeCount }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">متوسط سعر الشحن</span>
        <span class="stat-value">{{ avgRate }} د.أ</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">أدنى سعر</span>
        <span class="stat-value">{{ minRate }} د.أ</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <div class="table-toolbar">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" v-model="search" placeholder="ابحث عن محافظة..." class="search-input" />
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>المحافظة</th>
            <th>سعر التوصيل</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="state-row"><td colspan="4">جاري التحميل...</td></tr>
          <tr v-else-if="filteredRates.length === 0" class="state-row"><td colspan="4">لا توجد تسعيرات مطابقة</td></tr>
          <template v-else>
            <tr v-for="rate in filteredRates" :key="rate.id" class="data-row">
              <td>
                <div class="city-cell">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#873260" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{{ rate.city?.name || rate.city_name }}</span>
                </div>
              </td>
              <td>
                <span class="price-badge">{{ formatPrice(rate.shipping_cost) }} د.أ</span>
              </td>
              <td>
                <span class="status-badge" :class="rate.is_active ? 'active' : 'inactive'">
                  {{ rate.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td>
                <div class="actions-group">
                  <button class="action-btn edit-btn" @click="openEditModal(rate)" title="تعديل">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" @click="confirmDelete(rate)" title="حذف">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h3 class="modal-title">{{ isEdit ? 'تعديل تسعيرة التوصيل' : 'إضافة تسعيرة توصيل' }}</h3>
        <p class="modal-subtitle">{{ isEdit ? 'تعديل سعر التوصيل للمحافظة' : 'اختر المحافظة وحدد سعر التوصيل' }}</p>

        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label class="form-label">المحافظة <span class="req">*</span></label>
            <div class="select-wrapper">
              <select v-model="form.city_id" class="form-control" required :disabled="isEdit">
                <option value="" disabled>اختر المحافظة</option>
                <option v-for="gov in availableGovernorates" :key="gov.id" :value="gov.id">
                  {{ gov.name }}
                </option>
              </select>
              <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">سعر التوصيل (د.أ) <span class="req">*</span></label>
            <input type="number" v-model="form.shipping_cost" class="form-control" step="0.01" min="0" placeholder="0.00" required />
          </div>

          <div class="form-group">
            <label class="form-label">الحالة</label>
            <div class="select-wrapper">
              <select v-model="form.is_active" class="form-control">
                <option :value="true">نشط</option>
                <option :value="false">غير نشط</option>
              </select>
              <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'جاري الحفظ...' : (isEdit ? 'حفظ التعديل' : 'إضافة التسعيرة') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Shipping Settings Card -->
    <div class="settings-card">
      <div class="settings-card-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>إعدادات الشحن</span>
      </div>
      <div class="settings-fields">
        <div class="settings-field-row">
          <div class="settings-field">
            <label class="settings-label">حد التوصيل المجاني (د.أ)</label>
            <input type="number" v-model="shippingSettings.free_delivery_threshold" class="settings-input" placeholder="10" min="0" step="0.01" />
          </div>
          <div class="settings-field">
            <label class="settings-label">تكلفة الشحن الثابتة (د.أ)</label>
            <input type="number" v-model="shippingSettings.shipping_cost" class="settings-input" placeholder="15" min="0" step="0.01" />
          </div>
        </div>
        <div class="toggle-row">
          <div class="toggle-info">
            <span class="toggle-title">تفعيل نظام الشحن حسب المحافظات</span>
            <span class="toggle-hint">تحديد سعر شحن مختلف لكل محافظة من الجدول أعلاه</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="shippingSettings.enable_city_shipping" true-value="1" false-value="0" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <button class="btn-save-settings" @click="saveShippingSettings" :disabled="savingSettings">
          {{ savingSettings ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div class="alert-toast" :class="[alertType, { show: showAlert }]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
        <path v-if="alertType === 'success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="alertType === 'success'" points="22 4 12 14.01 9 11.01"/>
        <circle v-if="alertType !== 'success'" cx="12" cy="12" r="10"/><line v-if="alertType !== 'success'" x1="12" y1="8" x2="12" y2="12"/><line v-if="alertType !== 'success'" x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../config/axios';

const JORDAN_GOVERNORATES = [
  'عمّان', 'إربد', 'الزرقاء', 'البلقاء', 'الكرك',
  'المفرق', 'الطفيلة', 'معان', 'العقبة', 'جرش', 'عجلون', 'مادبا'
];

const rates = ref([]);
const cities = ref([]);
const loading = ref(false);
const search = ref('');
const showModal = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);

const form = ref({ city_id: '', shipping_cost: '', is_active: true });

const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg;
  alertType.value = type;
  showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3000);
};

const formatPrice = (v) => Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Stats
const activeCount = computed(() => rates.value.filter(r => r.is_active).length);
const avgRate = computed(() => {
  if (!rates.value.length) return '0.00';
  const avg = rates.value.reduce((s, r) => s + Number(r.shipping_cost), 0) / rates.value.length;
  return formatPrice(avg);
});
const minRate = computed(() => {
  if (!rates.value.length) return '0.00';
  return formatPrice(Math.min(...rates.value.map(r => Number(r.shipping_cost))));
});

// Filter
const filteredRates = computed(() => {
  const q = search.value.trim();
  if (!q) return rates.value;
  return rates.value.filter(r => (r.city?.name || '').includes(q));
});

// Already-rated city IDs
const ratedCityIds = computed(() => rates.value.map(r => r.city_id));

// Available governorates for the add form
const availableGovernorates = computed(() => {
  return cities.value;
});

const fetchRates = async () => {
  loading.value = true;
  try {
    const res = await api.get('/dashboard/city-shipping-rates');
    rates.value = res.data.data || [];
  } catch {
    triggerAlert('فشل تحميل التسعيرات', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchCities = async () => {
  try {
    const res = await api.get('/dashboard/cities');
    cities.value = res.data.data || [];
  } catch {
    console.error('Failed to fetch cities');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  editingId.value = null;
  form.value = { city_id: '', shipping_cost: '', is_active: true };
  showModal.value = true;
};

const openEditModal = (rate) => {
  isEdit.value = true;
  editingId.value = rate.id;
  form.value = {
    city_id: rate.city_id,
    shipping_cost: rate.shipping_cost,
    is_active: rate.is_active
  };
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/dashboard/city-shipping-rates/${editingId.value}`, {
        shipping_cost: form.value.shipping_cost,
        is_active: form.value.is_active
      });
      triggerAlert('تم تحديث التسعيرة بنجاح');
    } else {
      await api.post('/dashboard/city-shipping-rates', {
        city_id: form.value.city_id,
        shipping_cost: form.value.shipping_cost,
        is_active: form.value.is_active
      });
      triggerAlert('تمت إضافة التسعيرة بنجاح');
    }
    closeModal();
    fetchRates();
  } catch (err) {
    const msg = err.response?.data?.message || 'حدث خطأ في الحفظ';
    triggerAlert(msg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Shipping Settings
const shippingSettings = ref({
  free_delivery_threshold: '',
  shipping_cost: '',
  enable_city_shipping: '0'
});
const savingSettings = ref(false);

const fetchShippingSettings = async () => {
  try {
    const res = await api.get('/dashboard/settings');
    const data = res.data.data || res.data;
    
    // Convert array [{key, value}] to object {key: value}
    const s = {};
    if (Array.isArray(data)) {
      data.forEach(item => { s[item.key] = item.value; });
    } else {
      Object.assign(s, data);
    }
    
    shippingSettings.value.free_delivery_threshold = s.free_delivery_threshold ?? '';
    shippingSettings.value.shipping_cost = s.shipping_cost ?? '';
    shippingSettings.value.enable_city_shipping = s.enable_city_shipping ?? '0';
  } catch {
    console.error('Failed to fetch shipping settings');
  }
};

const saveShippingSettings = async () => {
  savingSettings.value = true;
  try {
    const settingsArray = [
      { key: 'free_delivery_threshold', value: shippingSettings.value.free_delivery_threshold, type: 'string' },
      { key: 'shipping_cost', value: shippingSettings.value.shipping_cost, type: 'string' },
      { key: 'enable_city_shipping', value: shippingSettings.value.enable_city_shipping, type: 'string' }
    ];
    await api.post('/dashboard/settings/multiple', { settings: settingsArray });
    triggerAlert('تم حفظ إعدادات الشحن بنجاح');
  } catch (err) {
    const msg = err.response?.data?.message || 'فشل حفظ الإعدادات';
    triggerAlert(msg, 'error');
  } finally {
    savingSettings.value = false;
  }
};

const confirmDelete = async (rate) => {
  if (!confirm(`هل أنت متأكد من حذف تسعيرة "${rate.city?.name || ''}"؟`)) return;
  try {
    await api.delete(`/dashboard/city-shipping-rates/${rate.id}`);
    triggerAlert('تم الحذف بنجاح');
    fetchRates();
  } catch {
    triggerAlert('فشل الحذف', 'error');
  }
};

onMounted(() => {
  fetchRates();
  fetchCities();
  fetchShippingSettings();
});
</script>

<style scoped>
.delivery-page {
  display: flex; flex-direction: column; gap: 1.5rem;
  direction: rtl; font-family: 'Cairo', sans-serif; padding-bottom: 2rem;
}

/* Header */
.page-header { display: flex; align-items: center; justify-content: space-between; }
.header-titles { display: flex; flex-direction: column; }
.page-title { font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0 0 0.15rem; }
.page-subtitle { font-size: 0.82rem; color: #6b7280; margin: 0; }
.add-btn { display: flex; align-items: center; gap: 6px; background: #873260; color: #fff; border: none; padding: 0.65rem 1.2rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; font-family: 'Cairo', sans-serif; transition: background 0.2s; }
.add-btn:hover { background: #6d2750; }

/* Country Badge */
.country-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 8px; padding: 0.5rem 1rem; width: fit-content; }
.country-badge span { font-weight: 700; color: #9d174d; font-size: 0.9rem; }
.gov-count { background: #873260; color: #fff !important; border-radius: 12px; padding: 2px 10px; font-size: 0.75rem; font-weight: 700; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem 1.2rem; display: flex; flex-direction: column; gap: 0.3rem; }
.stat-label { font-size: 0.78rem; color: #6b7280; font-weight: 600; }
.stat-value { font-size: 1.4rem; font-weight: 800; color: #111827; }

/* Table */
.table-container { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.table-toolbar { padding: 1rem; border-bottom: 1px solid #f3f4f6; }
.search-box { position: relative; display: flex; align-items: center; max-width: 320px; }
.search-icon { position: absolute; right: 0.75rem; color: #9ca3af; }
.search-input { width: 100%; padding: 0.6rem 2.5rem 0.6rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; outline: none; }
.search-input:focus { border-color: #873260; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background: #f9fafb; padding: 0.85rem 1rem; font-size: 0.78rem; font-weight: 700; color: #374151; text-align: right; border-bottom: 1px solid #e5e7eb; }
.data-row td { padding: 0.85rem 1rem; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem; color: #1f2937; vertical-align: middle; }
.state-row td { text-align: center; color: #6b7280; padding: 2.5rem; }
.city-cell { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
.price-badge { background: #f0fdf4; color: #15803d; border-radius: 6px; padding: 3px 10px; font-weight: 700; font-size: 0.85rem; }
.status-badge { border-radius: 20px; padding: 3px 10px; font-size: 0.75rem; font-weight: 700; }
.status-badge.active { background: #d1fae5; color: #059669; }
.status-badge.inactive { background: #fee2e2; color: #dc2626; }
.actions-group { display: flex; gap: 0.4rem; }
.action-btn { width: 32px; height: 32px; border: 1px solid #e5e7eb; background: #fff; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.15s; }
.delete-btn:hover { color: #dc2626; background: #fef2f2; border-color: #fecaca; }
.edit-btn:hover { color: #2563eb; background: #eff6ff; border-color: #bfdbfe; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
.modal-content { background: #fff; border-radius: 12px; width: 100%; max-width: 460px; padding: 2rem; position: relative; }
.modal-close { position: absolute; top: 1rem; left: 1rem; background: none; border: none; color: #9ca3af; cursor: pointer; }
.modal-title { font-size: 1.1rem; font-weight: 800; color: #111827; text-align: center; margin-bottom: 0.2rem; }
.modal-subtitle { font-size: 0.8rem; color: #6b7280; text-align: center; margin-bottom: 1.5rem; }
.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.form-label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; }
.req { color: #dc2626; }
.form-control { width: 100%; padding: 0.65rem 0.8rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #1f2937; outline: none; }
.form-control:focus { border-color: #873260; }
.select-wrapper { position: relative; }
.select-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: #9ca3af; }
.form-actions { margin-top: 0.5rem; }
.btn-submit { width: 100%; background: #873260; color: #fff; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: 'Cairo', sans-serif; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* Shipping Settings Card */
.settings-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
.settings-card-header { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6; font-weight: 700; font-size: 0.9rem; color: #374151; background: #f9fafb; }
.settings-fields { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
.settings-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.settings-field { display: flex; flex-direction: column; gap: 0.4rem; }
.settings-label { font-size: 0.8rem; font-weight: 700; color: #374151; }
.settings-input { padding: 0.6rem 0.8rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #1f2937; outline: none; }
.settings-input:focus { border-color: #873260; }
.toggle-row { display: flex; justify-content: space-between; align-items: center; }
.toggle-info { display: flex; flex-direction: column; gap: 0.15rem; }
.toggle-title { font-weight: 700; font-size: 0.85rem; color: #111827; }
.toggle-hint { font-size: 0.75rem; color: #6b7280; }
.toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; inset: 0; background: #e5e7eb; border-radius: 12px; transition: 0.3s; }
.toggle-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
input:checked + .toggle-slider { background: #873260; }
input:checked + .toggle-slider::before { transform: translateX(20px); }
.btn-save-settings { align-self: flex-end; background: #873260; color: #fff; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; font-family: 'Cairo', sans-serif; }
.btn-save-settings:disabled { opacity: 0.6; cursor: not-allowed; }

/* Alert */
.alert-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; background: #1f2937; color: #fff; padding: 0.75rem 1.25rem; border-radius: 10px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; opacity: 0; transform: translateY(10px); transition: 0.3s; pointer-events: none; z-index: 9999; }
.alert-toast.show { opacity: 1; transform: translateY(0); }
.alert-toast.success { background: #065f46; }
.alert-toast.error { background: #991b1b; }

/* Remove number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; appearance: textfield; }
</style>
