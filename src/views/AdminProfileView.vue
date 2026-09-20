<template>
  <div class="admin-profile-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-titles">
        <h2 class="page-title">الملف الشخصي</h2>
        <p class="page-subtitle">إدارة بيانات حسابك وتحديث كلمة المرور في منظومة بي كايت</p>
      </div>
    </div>

    <div class="profile-layout">
      <!-- Left Column: Profile Card -->
      <div class="profile-side">
        <div class="profile-card">
          <div class="profile-avatar-section">
            <div class="avatar-wrapper">
              <img v-if="admin.avatar" :src="getImageUrl(admin.avatar)" alt="avatar" class="avatar-img" />
              <div v-else class="avatar-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h3 class="profile-name">{{ admin.name || 'مدير النظام' }}</h3>
            <span class="profile-role-badge">{{ admin.role_name || (admin.is_super_admin ? 'مدير عام النظام (Super Admin)' : (admin.role || 'مدير النظام')) }}</span>
            <span class="profile-status" :class="admin.is_active !== 0 && admin.status !== 0 ? 'active' : 'inactive'">
              <span class="status-dot"></span>
              {{ admin.is_active !== 0 && admin.status !== 0 ? 'نشط الآن' : 'غير نشط' }}
            </span>
          </div>

          <div class="profile-info-list">
            <div class="info-row">
              <div class="info-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">البريد الإلكتروني</span>
                <span class="info-value" dir="ltr">{{ admin.email || 'غير مسجل' }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">رقم الهاتف</span>
                <span class="info-value" dir="ltr">{{ admin.phone || 'غير مسجل' }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">تاريخ الانضمام</span>
                <span class="info-value">{{ formatDate(admin.createdAt || admin.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Forms -->
      <div class="profile-main">
        <!-- Edit Profile Form -->
        <div class="form-card">
          <div class="form-header">
            <div class="form-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="form-title">تعديل البيانات الشخصية</h3>
              <p class="form-desc">تحديث اسم الحساب، بيانات الاتصال، والصورة الشخصية في بي كايت</p>
            </div>
          </div>

          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">الاسم الكامل <span class="req">*</span></label>
                <div class="input-with-icon">
                  <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" v-model="form.name" class="form-control" required placeholder="أدخل اسمك الكامل" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">البريد الإلكتروني <span class="req">*</span></label>
                <div class="input-with-icon">
                  <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" v-model="form.email" class="form-control" required dir="ltr" placeholder="admin@bekite.com" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">رقم الهاتف</label>
                <div class="input-with-icon">
                  <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" dir="ltr" v-model="form.phone" class="form-control" placeholder="+966 50 000 0000" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">الصورة الشخصية (Avatar)</label>
                <div class="file-input-wrapper">
                  <input type="file" @change="handleFileChange" accept="image/*" class="file-input" />
                  <div class="file-input-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span class="file-name">{{ fileName || 'اضغط هنا لاختيار صورة شخصية جديدة...' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit btn-save" :disabled="loading">
                <span v-if="loading" class="spinner-icon"></span>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <span>{{ loading ? 'جاري حفظ التغييرات...' : 'حفظ التغييرات' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Form -->
        <div class="form-card">
          <div class="form-header">
            <div class="form-header-icon password-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h3 class="form-title">تغيير كلمة المرور</h3>
              <p class="form-desc">قم بتحديث كلمة المرور لحماية حسابك في لوحة بي كايت</p>
            </div>
          </div>

          <form @submit.prevent="changePassword" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">كلمة المرور الحالية <span class="req">*</span></label>
                <div class="input-with-icon">
                  <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" v-model="passwordForm.current" class="form-control" required placeholder="أدخل كلمة المرور الحالية" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">كلمة المرور الجديدة <span class="req">*</span></label>
                <div class="input-with-icon">
                  <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 2l-2 2m-1-1l-3 3m2 2l-3 3m2 2l-3 3m-4 1a6 6 0 1 1-8.49-8.49l6.5-6.5a6 6 0 0 1 8.49 8.49z"/>
                  </svg>
                  <input type="password" v-model="passwordForm.new" class="form-control" required minlength="8" placeholder="8 أحرف أو رموز على الأقل" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">تأكيد كلمة المرور <span class="req">*</span></label>
                <div class="input-with-icon">
                  <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <input type="password" v-model="passwordForm.confirm" class="form-control" required placeholder="أعد إدخال كلمة المرور للتأكيد" />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit btn-update-pwd" :disabled="passwordLoading">
                <span v-if="passwordLoading" class="spinner-icon"></span>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>{{ passwordLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Alert Toast -->
    <transition name="toast-fade">
      <div v-if="showAlert" class="alert-toast" :class="alertType">
        <svg v-if="alertType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="alert-icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="alert-icon">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ alertMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../config/axios';
import { AdminService } from '../services/AdminService';
import { formatApiError } from '../utils/errorHandler';
import { validateImageFile } from '../utils/imageUpload';

// State
const admin = ref({});
const form = ref({
  name: '',
  email: '',
  phone: '',
});
const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
});
const avatarFile = ref(null);
const fileName = ref('');
const loading = ref(false);
const passwordLoading = ref(false);

// Alert Toast State
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

const formatDate = (dateStr) => {
  if (!dateStr) return '2026-01-01';
  return new Date(dateStr).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL || '';
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg;
  alertType.value = type;
  showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3500);
};

// Fetch admin profile from API
const fetchAdmin = async () => {
  try {
    const data = await AdminService.getCurrentAdmin();
    if (data) {
      admin.value = data;
      form.value.name = data.name || '';
      form.value.email = data.email || '';
      form.value.phone = data.phone || '';
    }
  } catch (err) {
    const safeError = formatApiError(err, 'فشل تحميل بيانات المسؤول من الخادم');
    triggerAlert(safeError, 'error');
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const validationError = validateImageFile(file);
    if (validationError) {
      triggerAlert(validationError, 'error');
      e.target.value = '';
      return;
    }
    avatarFile.value = file;
    fileName.value = file.name;
  }
};

const updateProfile = async () => {
  const trimmedName = form.value.name?.trim() || '';
  const trimmedEmail = form.value.email?.trim() || '';
  const trimmedPhone = form.value.phone?.trim() || '';

  // Input Sanitization & Pre-flight Validation
  if (!trimmedName || !trimmedEmail) {
    triggerAlert('يرجى ملء كافة الحقول الإجبارية (الاسم والبريد)', 'error');
    return;
  }

  // Name length & script tag checks
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    triggerAlert('يجب أن يتراوح الاسم بين حرفين و 100 حرف', 'error');
    return;
  }
  if (/<[a-z][\s\S]*>/i.test(trimmedName)) {
    triggerAlert('الاسم المدخل يحتوي على رموز أو وسوم غير مسموح بها', 'error');
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    triggerAlert('يرجى إدخال عنوان بريد إلكتروني صحيح', 'error');
    return;
  }

  loading.value = true;
  try {
    const adminId = admin.value.id || JSON.parse(localStorage.getItem('admin') || '{}').id || 1;

    let payload;
    if (avatarFile.value) {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', trimmedName);
      formData.append('email', trimmedEmail);
      if (trimmedPhone) formData.append('phone', trimmedPhone);
      formData.append('avatar', avatarFile.value);
      payload = formData;
    } else {
      payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      };
    }

    const updated = await AdminService.updateProfile(adminId, payload);
    if (updated) {
      admin.value = { ...admin.value, ...updated };
      fileName.value = '';
      avatarFile.value = null;
      triggerAlert('تم حفظ التغييرات وتحديث البيانات بنجاح في بي كايت', 'success');
    }
  } catch (err) {
    const msg = formatApiError(err, 'فشل تحديث البيانات الشخصية');
    triggerAlert(msg, 'error');
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (!passwordForm.value.current) {
    triggerAlert('يرجى إدخال كلمة المرور الحالية', 'error');
    return;
  }
  if (passwordForm.value.new.length < 8) {
    triggerAlert('يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف', 'error');
    return;
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    triggerAlert('كلمتا المرور غير متطابقتين', 'error');
    return;
  }

  passwordLoading.value = true;
  try {
    await AdminService.changePassword({
      current_password: passwordForm.value.current,
      new_password: passwordForm.value.new,
      new_password_confirmation: passwordForm.value.confirm
    });

    triggerAlert('تم تحديث كلمة المرور بنجاح في منظومة بي كايت', 'success');
    passwordForm.value = { current: '', new: '', confirm: '' };
  } catch (err) {
    const msg = formatApiError(err, 'فشل تغيير كلمة المرور');
    triggerAlert(msg, 'error');
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(() => {
  fetchAdmin();
});
</script>

<style scoped>
.admin-profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  direction: rtl;
  font-family: 'Cairo', sans-serif;
  padding-bottom: 2.5rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
  letter-spacing: -0.01em;
}
.page-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin: 0.35rem 0 0;
}

/* Layout */
.profile-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Profile Side Card */
.profile-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.2rem 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4f008c 0%, #7c3aed 50%, #ffc700 100%);
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  width: 100%;
}

.avatar-wrapper {
  width: 108px;
  height: 108px;
  border-radius: 50%;
  overflow: hidden;
  border: 3.5px solid #4f008c;
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(79, 0, 140, 0.18);
  transition: all 0.3s ease;
}

:deep(.dark) .avatar-wrapper,
.dark .avatar-wrapper {
  border-color: #ffc700;
  box-shadow: 0 0 24px rgba(255, 199, 0, 0.25);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  color: #4f008c;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.dark) .avatar-placeholder,
.dark .avatar-placeholder {
  color: #ffc700;
}

.profile-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
  line-height: 1.3;
}

.profile-role-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: #4f008c;
  background: rgba(79, 0, 140, 0.08);
  border: 1px solid rgba(79, 0, 140, 0.18);
  padding: 0.3rem 0.9rem;
  border-radius: 50px;
}

:deep(.dark) .profile-role-badge,
.dark .profile-role-badge {
  color: #ffc700;
  background: rgba(255, 199, 0, 0.12);
  border-color: rgba(255, 199, 0, 0.28);
}

.profile-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.85rem;
  border-radius: 50px;
  margin-top: 0.2rem;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.profile-status.active {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.profile-status.inactive {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

/* Profile Info List */
.profile-info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  text-align: right;
  transition: all 0.2s ease;
}

.info-row:hover {
  border-color: #4f008c;
  transform: translateX(-2px);
}

:deep(.dark) .info-row:hover,
.dark .info-row:hover {
  border-color: #ffc700;
}

.info-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.dark) .info-icon-box,
.dark .info-icon-box {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  overflow: hidden;
}

.info-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
}

.info-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Right Column: Forms */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem 2.2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(79, 0, 140, 0.1);
  color: #4f008c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.dark) .form-header-icon,
.dark .form-header-icon {
  background: rgba(255, 199, 0, 0.14);
  color: #ffc700;
}

.password-header-icon {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

:deep(.dark) .password-header-icon,
.dark .password-header-icon {
  background: rgba(255, 199, 0, 0.14);
  color: #ffc700;
}

.form-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.form-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}
.req {
  color: #ef4444;
  margin-right: 0.2rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  right: 1rem;
  color: var(--text-muted);
  pointer-events: none;
  transition: color 0.2s ease;
}

.form-control {
  width: 100%;
  padding: 0.85rem 2.6rem 0.85rem 1rem;
  border: 1.5px solid var(--input-border);
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  background: var(--input-bg);
  outline: none;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.form-control:hover {
  border-color: #7c3aed;
}

:deep(.dark) .form-control:hover,
.dark .form-control:hover {
  border-color: #ffc700;
}

.form-control:focus {
  border-color: #4f008c;
  box-shadow: 0 0 0 3.5px rgba(79, 0, 140, 0.16);
}

:deep(.dark) .form-control:focus,
.dark .form-control:focus {
  border-color: #ffc700;
  box-shadow: 0 0 0 3.5px rgba(255, 199, 0, 0.22);
}

.input-with-icon:focus-within .field-icon {
  color: #4f008c;
}

:deep(.dark) .input-with-icon:focus-within .field-icon,
.dark .input-with-icon:focus-within .field-icon {
  color: #ffc700;
}

/* File Upload */
.file-input-wrapper {
  position: relative;
  padding: 0.78rem 1.1rem;
  border: 1.5px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: var(--bg-main);
}

.file-input-wrapper:hover {
  border-color: #4f008c;
  background: rgba(79, 0, 140, 0.04);
}

:deep(.dark) .file-input-wrapper:hover,
.dark .file-input-wrapper:hover {
  border-color: #ffc700;
  background: rgba(255, 199, 0, 0.08);
}

.file-input-content {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.upload-icon {
  color: #4f008c;
  flex-shrink: 0;
}

:deep(.dark) .upload-icon,
.dark .upload-icon {
  color: #ffc700;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-name {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Form Actions & Buttons */
.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.75rem;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 2.4rem;
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
}

/* Save Changes Button (Primary Be Kite Purple Gradient) */
.btn-save {
  background: linear-gradient(135deg, #4f008c 0%, #7c3aed 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(79, 0, 140, 0.28);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 0, 140, 0.42);
  filter: brightness(1.08);
}

:deep(.dark) .btn-save,
.dark .btn-save {
  background: linear-gradient(135deg, #ffc700 0%, #f59e0b 100%);
  color: #150522;
  box-shadow: 0 4px 16px rgba(255, 199, 0, 0.25);
}

:deep(.dark) .btn-save:hover:not(:disabled),
.dark .btn-save:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(255, 199, 0, 0.45);
}

/* Update Password Button (Secondary Be Kite Action) */
.btn-update-pwd {
  background: rgba(79, 0, 140, 0.08);
  border: 1.5px solid #4f008c;
  color: #4f008c;
}

.btn-update-pwd:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f008c 0%, #7c3aed 100%);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 0, 140, 0.3);
}

:deep(.dark) .btn-update-pwd,
.dark .btn-update-pwd {
  background: rgba(255, 199, 0, 0.1);
  border: 1.5px solid #ffc700;
  color: #ffc700;
}

:deep(.dark) .btn-update-pwd:hover:not(:disabled),
.dark .btn-update-pwd:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffc700 0%, #e6b400 100%);
  color: #150522;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(255, 199, 0, 0.35);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
}

/* Spinner */
.spinner-icon {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast Alert */
.alert-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.85rem 1.8rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  font-family: 'Cairo', sans-serif;
  backdrop-filter: blur(10px);
}

.alert-toast.success {
  background: #064e3b;
  color: #ecfdf5;
  border: 1px solid #059669;
}

.alert-toast.error {
  background: #7f1d1d;
  color: #fef2f2;
  border: 1px solid #dc2626;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
}

@media (max-width: 860px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .form-card {
    padding: 1.5rem;
  }
}
</style>
