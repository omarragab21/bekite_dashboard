<template>
  <div class="careers-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">إدارة الشواغر والفرص الوظيفية (Careers & Positions)</h1>
        <p class="page-subtitle">نشر وإدارة الوظائف الشاغرة لدى Be Kite — مهندسي البرمجيات، مصممي واجهات المستخدم، ومحللي الأنظمة</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة شاغر وظيفي
      </button>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>المسمى الوظيفي</th>
              <th>القسم / الفريق</th>
              <th>نوع العمل والموقع</th>
              <th>الخبرة المطلوبة</th>
              <th>تاريخ النشر</th>
              <th>الحالة</th>
              <th class="text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="state-row"><td colspan="7">جاري تحميل الشواغر الوظيفية...</td></tr>
            <tr v-else-if="careers.length === 0" class="state-row"><td colspan="7">لا توجد وظائف مضافة حالياً</td></tr>
            <template v-else>
              <tr v-for="job in careers" :key="job.id" class="data-row">
                <td>
                  <div class="job-meta">
                    <span class="job-title">{{ job.title }}</span>
                    <span class="job-title-en ltr-text">{{ job.title_en }}</span>
                  </div>
                </td>
                <td>
                  <span class="dept-pill">{{ job.department }}</span>
                </td>
                <td>
                  <div class="loc-type-wrap">
                    <span class="type-text">{{ job.type }}</span>
                    <span class="loc-text">{{ job.location }}</span>
                  </div>
                </td>
                <td>
                  <span class="exp-badge">{{ job.experience }}</span>
                </td>
                <td class="td-date">{{ job.created_at }}</td>
                <td>
                  <button
                    class="status-toggle-btn"
                    :class="job.is_active ? 'active' : 'inactive'"
                    @click="toggleStatus(job)"
                  >
                    {{ job.is_active ? 'متاح للتقديم' : 'مغلق' }}
                  </button>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn edit-btn" @click="openEditModal(job)" title="تعديل">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" @click="confirmDelete(job)" title="حذف">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEdit ? 'تعديل الشاغر الوظيفي' : 'إضافة شاغر جديد' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveJob" class="modal-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">المسمى الوظيفي (بالعربية) *</label>
              <input type="text" v-model="formData.title" class="form-input" required placeholder="مثال: مطور برمجيات أول (Laravel & Vue.js)" />
            </div>
            <div class="form-group">
              <label class="form-label">المسمى الوظيفي (English) *</label>
              <input type="text" v-model="formData.title_en" class="form-input ltr-text" required placeholder="Senior Full-Stack Engineer" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">القسم / الفريق</label>
              <input type="text" v-model="formData.department" class="form-input" placeholder="الهندسة والتطوير البرمجي" />
            </div>
            <div class="form-group">
              <label class="form-label">المعرف البرمجي (Slug)</label>
              <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="senior-fullstack-engineer" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">نوع الدوام</label>
              <input type="text" v-model="formData.type" class="form-input" placeholder="دوام كامل (مكتبي / هجين)" />
            </div>
            <div class="form-group">
              <label class="form-label">موقع العمل</label>
              <input type="text" v-model="formData.location" class="form-input" placeholder="عمان - مجمع الملك حسين للأعمال" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الخبرة المطلوبة</label>
            <input type="text" v-model="formData.experience" class="form-input" placeholder="+4 سنوات خبرة عملية" />
          </div>

          <div class="form-group">
            <label class="form-label">الوصف الوظيفي والمسؤوليات</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3" placeholder="تفاصيل الدور الوظيفي والتحديات التقنية..."></textarea>
          </div>

          <div class="form-group checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
              <span>إتاحة الشاغر واستقبال طلبات التوظيف</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث الشاغر' : 'نشر الشاغر') }}
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
const careers = ref([]);

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);

const formData = ref({
  title: '',
  title_en: '',
  department: 'الهندسة والتطوير',
  slug: '',
  location: 'عمان - مجمع الملك حسين للأعمال',
  type: 'دوام كامل',
  experience: '+3 سنوات',
  description: '',
  is_active: 1,
});

const fetchCareers = async () => {
  loading.value = true;
  try {
    careers.value = await ContentService.getCareers();
  } catch (err) {
    console.error('Failed to fetch careers', err);
    toastError('تعذر تحميل شواغر التوظيف');
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (job) => {
  const newStatus = job.is_active ? 0 : 1;
  try {
    await ContentService.updateCareer(job.id, { is_active: newStatus });
    job.is_active = newStatus;
    success('تم تحديث حالة الشاغر');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('حدث خطأ أثناء تحديث الحالة');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  formData.value = {
    title: '',
    title_en: '',
    department: 'الهندسة والتطوير',
    slug: '',
    location: 'عمان - مجمع الملك حسين للأعمال',
    type: 'دوام كامل',
    experience: '+3 سنوات',
    description: '',
    is_active: 1,
  };
  modalOpen.value = true;
};

const openEditModal = (job) => {
  isEdit.value = true;
  currentEditId.value = job.id;
  formData.value = JSON.parse(JSON.stringify(job));
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveJob = async () => {
  saving.value = true;
  try {
    if (isEdit.value) {
      const updated = await ContentService.updateCareer(currentEditId.value, formData.value);
      const idx = careers.value.findIndex(c => c.id === currentEditId.value);
      if (idx !== -1) careers.value[idx] = updated;
      success('تم تحديث الشاغر الوظيفي بنجاح');
    } else {
      const created = await ContentService.createCareer(formData.value);
      careers.value.unshift(created);
      success('تم نشر الشاغر الوظيفي بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save career', err);
    toastError('حدث خطأ أثناء حفظ الشاغر');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (job) => {
  if (confirm(`هل أنت متأكد من حذف شاغر "${job.title}"؟`)) {
    try {
      await ContentService.deleteCareer(job.id);
      careers.value = careers.value.filter(c => c.id !== job.id);
      success('تم حذف الشاغر الوظيفي بنجاح');
    } catch (err) {
      console.error('Failed to delete job', err);
      toastError('حدث خطأ أثناء حذف الشاغر');
    }
  }
};

onMounted(() => {
  fetchCareers();
});
</script>

<style scoped>
.careers-page {
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

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: right;
}

.data-table th {
  background: var(--table-header-bg);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.data-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  vertical-align: middle;
}

.job-meta {
  display: flex;
  flex-direction: column;
}

.job-title { font-weight: 800; color: var(--text-main); }
.job-title-en { font-size: 0.75rem; color: var(--text-muted); }

.dept-pill {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.loc-type-wrap {
  display: flex;
  flex-direction: column;
}
.type-text { font-size: 0.8rem; font-weight: 600; color: var(--text-main); }
.loc-text { font-size: 0.72rem; color: var(--text-muted); }

.exp-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #059669;
}

.td-date { font-size: 0.75rem; color: var(--text-muted); }

.status-toggle-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.status-toggle-btn.active { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.status-toggle-btn.inactive { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
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

.state-row td {
  text-align: center;
  padding: 2.5rem;
  color: var(--text-muted);
}

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
  max-width: 620px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
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
</style>
