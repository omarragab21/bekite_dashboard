<template>
  <div class="admin-profile-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-titles">
        <h2 class="page-title">الملف الشخصي</h2>
        <p class="page-subtitle">إدارة بيانات حسابك الشخصي</p>
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h3 class="profile-name">{{ admin.name }}</h3>
            <span class="profile-role">{{ admin.role || 'مدير' }}</span>
            <span class="profile-status" :class="admin.is_active ? 'active' : 'inactive'">
              {{ admin.is_active ? 'نشط' : 'غير نشط' }}
            </span>
          </div>

          <div class="profile-info-list">
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>{{ admin.email }}</span>
            </div>
            <div class="info-row" v-if="admin.phone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span dir="ltr">{{ admin.phone }}</span>
            </div>
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>تاريخ الانضمام: {{ formatDate(admin.createdAt || admin.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Forms -->
      <div class="profile-main">
        <!-- Edit Profile Form -->
        <div class="form-card">
          <div class="form-header">
            <h3>تعديل البيانات</h3>
            <p>تحديث معلوماتك الشخصية</p>
          </div>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">الاسم <span class="req">*</span></label>
                <input type="text" v-model="form.name" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">البريد الإلكتروني <span class="req">*</span></label>
                <input type="email" v-model="form.email" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">رقم الهاتف</label>
                <input type="tel" style="text-align: right;" v-model="form.phone" class="form-control" />
              </div>
              <div class="form-group">
                <label class="form-label">الصورة الشخصية</label>
                <div class="file-input-wrapper">
                  <input type="file" @change="handleFileChange" accept="image/*" class="file-input" />
                  <span class="file-name">{{ fileName || 'اختر صورة...' }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit" :disabled="loading">
                {{ loading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Form -->
        <div class="form-card">
          <div class="form-header">
            <h3>تغيير كلمة المرور</h3>
            <p>تأكد من استخدام كلمة مرور قوية</p>
          </div>
          <form @submit.prevent="changePassword" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">كلمة المرور الحالية <span class="req">*</span></label>
                <input type="password" v-model="passwordForm.current" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">كلمة المرور الجديدة <span class="req">*</span></label>
                <input type="password" v-model="passwordForm.new" class="form-control" required minlength="8" />
              </div>
              <div class="form-group">
                <label class="form-label">تأكيد كلمة المرور <span class="req">*</span></label>
                <input type="password" v-model="passwordForm.confirm" class="form-control" required />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit btn-secondary" :disabled="passwordLoading">
                {{ passwordLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Alert -->
    <div class="alert-toast" :class="[alertType, { show: showAlert }]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
        <path v-if="alertType === 'success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="alertType === 'success'" points="22 4 12 14.01 9 11.01"/>
        <circle v-if="alertType === 'error'" cx="12" cy="12" r="10"/><line v-if="alertType === 'error'" x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../config/axios';

// State
const admin = ref({});
const loading = ref(false);
const passwordLoading = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const fileName = ref('');
const avatarFile = ref(null);

const form = ref({
  name: '',
  email: '',
  phone: ''
});

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

// Utils
const formatDate = (d) => {
  if (!d) return '-';
  try {
    return new Date(d).toISOString().split('T')[0];
  } catch (e) {
    return d;
  }
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg;
  alertType.value = type;
  showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3000);
};

// Fetch admin data
const fetchAdmin = async () => {
  try {
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    if (!adminData.id) return;

    const res = await api.get(`/dashboard/admins/${adminData.id}`);
    admin.value = res.data.data || res.data;

    // Pre-fill form
    form.value.name = admin.value.name || '';
    form.value.email = admin.value.email || '';
    form.value.phone = admin.value.phone || '';
  } catch (err) {
    triggerAlert('فشل تحميل بيانات المسؤول', 'error');
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarFile.value = file;
    fileName.value = file.name;
  }
};

const updateProfile = async () => {
  loading.value = true;
  try {
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    if (!adminData.id) return;

    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    if (form.value.phone) formData.append('phone', form.value.phone);
    if (avatarFile.value) formData.append('avatar', avatarFile.value);

    const res = await api.post(`/dashboard/admins/${adminData.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const updated = res.data.data || res.data;
    admin.value = updated;

    // Update localStorage
    localStorage.setItem('admin', JSON.stringify({
      ...adminData,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      avatar: updated.avatar
    }));

    // Refresh page to update AppLayout
    window.location.reload();
  } catch (err) {
    const msg = err.response?.data?.message || 'فشل تحديث البيانات';
    triggerAlert(msg, 'error');
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    triggerAlert('كلمتا المرور غير متطابقتين', 'error');
    return;
  }

  passwordLoading.value = true;
  try {
    await api.post('/dashboard/change-password', {
      current_password: passwordForm.value.current,
      new_password: passwordForm.value.new
    });

    triggerAlert('تم تغيير كلمة المرور بنجاح');
    passwordForm.value = { current: '', new: '', confirm: '' };
  } catch (err) {
    const msg = err.response?.data?.message || 'فشل تغيير كلمة المرور';
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
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');

.admin-profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  direction: rtl;
  font-family: 'Almarai', sans-serif;
  padding-bottom: 2rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}
.page-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

/* Layout */
.profile-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Profile Side Card */
.profile-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fce7f3;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  color: #9ca3af;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}
.profile-role {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
}
.profile-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  margin-top: 0.25rem;
}
.profile-status.active {
  background: #dcfce7;
  color: #16a34a;
}
.profile-status.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.profile-info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #374151;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 10px;
  text-align: right;
}
.info-row svg {
  color: #873260;
  flex-shrink: 0;
}

/* Main Forms */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.form-header {
  margin-bottom: 1.5rem;
}
.form-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
}
.form-header p {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
}
.req {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'Almarai', sans-serif;
  font-size: 0.9rem;
  color: #111827;
  background: #fff;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}
.form-control:focus {
  border-color: #873260;
  box-shadow: 0 0 0 3px rgba(135, 50, 96, 0.1);
}

.file-input-wrapper {
  position: relative;
  padding: 0.85rem 1rem;
  border: 1.5px dashed #d1d5db;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.file-input-wrapper:hover {
  border-color: #873260;
  background: #fdf2f8;
}
.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.file-name {
  font-size: 0.85rem;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.btn-submit {
  padding: 0.85rem 2rem;
  background: #873260;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-submit:hover:not(:disabled) {
  background: #6b274d;
}
.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-secondary {
  background: #374151;
}
.btn-secondary:hover:not(:disabled) {
  background: #1f2937;
}

/* Alert */
.alert-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Almarai', sans-serif;
  background: #fff;
}
.alert-toast.success { color: #059669; border: 1px solid #10b981; }
.alert-toast.error { color: #dc2626; border: 1px solid #ef4444; }
.alert-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
