<template>
  <div class="team-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">فريق العمل والقيادة (Team & Leadership)</h1>
        <p class="page-subtitle">إدارة أعضاء الفريق القيادي والتنفيذي، مطوري الأنظمة، وخبراء التسويق في Be Kite</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة عضو جديد للفريق
      </button>
    </div>

    <!-- Team Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل أعضاء الفريق...</p>
    </div>

    <div v-else class="team-grid">
      <div v-for="member in team" :key="member.id" class="team-card">
        <div class="member-photo-wrap">
          <img :src="member.photo || member.avatar" :alt="member.name" class="member-photo" />
          <div class="status-indicator-dot" :class="member.is_active ? 'active' : 'inactive'"></div>
        </div>

        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <span class="member-role">{{ member.role }}</span>
          <span class="member-dept">{{ member.department }}</span>
          <p class="member-bio">{{ member.bio }}</p>
        </div>

        <div class="member-footer">
          <button class="status-btn" @click="toggleStatus(member)">
            {{ member.is_active ? 'ظاهر على الموقع' : 'مخفي' }}
          </button>
          <div class="member-actions">
            <button class="action-btn edit-btn" @click="openEditModal(member)" title="تعديل">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn delete-btn" @click="confirmDelete(member)" title="حذف">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEdit ? 'تعديل بيانات العضو' : 'إضافة عضو جديد' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveMember" class="modal-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">الاسم الكامل (بالعربية) *</label>
              <input type="text" v-model="formData.name" class="form-input" required placeholder="مثال: عمر رجب" />
            </div>
            <div class="form-group">
              <label class="form-label">الاسم الكامل (English) *</label>
              <input type="text" v-model="formData.name_en" class="form-input ltr-text" required placeholder="e.g. Omar Ragab" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">المسمى والمنصب (بالعربية) *</label>
              <input type="text" v-model="formData.role" class="form-input" required placeholder="مثال: المدير التنفيذي للتطوير والأنظمة" />
            </div>
            <div class="form-group">
              <label class="form-label">المنصب (English) *</label>
              <input type="text" v-model="formData.role_en" class="form-input ltr-text" required placeholder="Chief Technology Officer" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">القسم / الإدارة</label>
              <input type="text" v-model="formData.department" class="form-input" placeholder="القيادة التنفيذية / تطوير البرمجيات" />
            </div>
            <div class="form-group">
              <label class="form-label">رابط الصورة الشخصية (Photo URL)</label>
              <input type="text" v-model="formData.photo" class="form-input ltr-text" placeholder="/images/team/member.jpg" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">نبذة شخصية والخبرات</label>
            <textarea v-model="formData.bio" class="form-textarea" rows="3" placeholder="نبذة مختصرة عن الخبرات المهنية..."></textarea>
          </div>

          <div class="form-group checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
              <span>إظهار العضو في صفحة فريق العمل</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث البيانات' : 'حفظ ونشر') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ContentService } from '../services/ContentService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const team = ref([]);

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);

const formData = ref({
  name: '',
  name_en: '',
  role: '',
  role_en: '',
  department: 'القيادة التنفيذية',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  bio: '',
  is_active: 1,
});

const fetchTeam = async () => {
  loading.value = true;
  try {
    team.value = await ContentService.getTeamMembers();
  } catch (err) {
    console.error('Failed to fetch team members', err);
    toastError('تعذر تحميل فريق العمل');
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (member) => {
  const newStatus = member.is_active ? 0 : 1;
  try {
    await ContentService.updateTeamMember(member.id, { is_active: newStatus });
    member.is_active = newStatus;
    success('تم تحديث حالة عضو الفريق');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('حدث خطأ أثناء تحديث الحالة');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  formData.value = {
    name: '',
    name_en: '',
    role: '',
    role_en: '',
    department: 'القيادة التنفيذية',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: '',
    is_active: 1,
  };
  modalOpen.value = true;
};

const openEditModal = (member) => {
  isEdit.value = true;
  currentEditId.value = member.id;
  formData.value = JSON.parse(JSON.stringify(member));
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveMember = async () => {
  saving.value = true;
  try {
    if (isEdit.value) {
      const updated = await ContentService.updateTeamMember(currentEditId.value, formData.value);
      const idx = team.value.findIndex(m => m.id === currentEditId.value);
      if (idx !== -1) team.value[idx] = updated;
      success('تم تحديث بيانات عضو الفريق بنجاح');
    } else {
      const created = await ContentService.createTeamMember(formData.value);
      team.value.push(created);
      success('تمت إضافة عضو الفريق بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save team member', err);
    toastError('حدث خطأ أثناء حفظ العضو');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (member) => {
  if (confirm(`هل أنت متأكد من حذف العضو "${member.name}"؟`)) {
    try {
      await ContentService.deleteTeamMember(member.id);
      team.value = team.value.filter(m => m.id !== member.id);
      success('تم حذف عضو الفريق بنجاح');
    } catch (err) {
      console.error('Failed to delete team member', err);
      toastError('حدث خطأ أثناء حذف العضو');
    }
  }
};

onMounted(() => {
  fetchTeam();
});
</script>

<style scoped>
.team-page {
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

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  transition: transform 0.15s ease;
}
.btn-add:hover { transform: translateY(-2px); }

/* Team Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.team-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.07);
}

.member-photo-wrap {
  position: relative;
  width: 80px;
  height: 80px;
}

.member-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #7c3aed;
}

.status-indicator-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--bg-card);
}
.status-indicator-dot.active { background: #10b981; }
.status-indicator-dot.inactive { background: #ef4444; }

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.member-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.member-role {
  font-size: 0.8rem;
  font-weight: 700;
  color: #7c3aed;
}

.member-dept {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.member-bio {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
  line-height: 1.4;
}

.member-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-color);
}

.status-btn {
  background: transparent;
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
}
.status-btn:hover { color: #7c3aed; }

.member-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.edit-btn:hover { color: #7c3aed; border-color: #7c3aed; }
.delete-btn:hover { color: #ef4444; border-color: #ef4444; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 60;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
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

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-cancel {
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  font-weight: 700;
  cursor: pointer;
}

.btn-save {
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-muted);
  gap: 1rem;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(124, 58, 237, 0.2);
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
