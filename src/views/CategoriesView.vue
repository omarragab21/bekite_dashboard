<template>
  <div class="categories-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">أقسام المنتجات والأنظمة الرقمية</h1>
        <p class="page-subtitle">تصنيف الأنظمة البرمجية (منصات التجارة، الأنظمة التعليمية، وحلول الحضور الرقمي)</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة قطاع جديد
      </button>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>اسم القطاع (بالعربية)</th>
              <th>الاسم بالإنجليزية</th>
              <th>المعرف (Slug)</th>
              <th>الأنظمة الرقمية المندرجة</th>
              <th>الحالة</th>
              <th class="text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="state-row"><td colspan="6">جاري تحميل قطاعات المنتجات...</td></tr>
            <tr v-else-if="categories.length === 0" class="state-row"><td colspan="6">لا توجد قطاعات مضافة</td></tr>
            <template v-else>
              <tr v-for="cat in categories" :key="cat.id" class="data-row">
                <td>
                  <span class="cat-name">{{ cat.name }}</span>
                </td>
                <td>
                  <span class="cat-name-en ltr-text">{{ cat.name_en || '-' }}</span>
                </td>
                <td>
                  <code class="slug-tag">{{ cat.slug }}</code>
                </td>
                <td>
                  <span class="products-count-pill">{{ getProductsCount(cat.slug) }} أنظمة سحابية</span>
                </td>
                <td>
                  <button
                    class="status-toggle-btn"
                    :class="cat.is_active ? 'active' : 'inactive'"
                    @click="toggleStatus(cat)"
                  >
                    {{ cat.is_active ? 'مفعل' : 'معطل' }}
                  </button>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn edit-btn" @click="openEditModal(cat)" title="تعديل">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" @click="confirmDelete(cat)" title="حذف">
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
          <h2 class="modal-title">{{ isEdit ? 'تعديل قطاع المنتجات' : 'إضافة قطاع جديد' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveCategory" class="modal-body">
          <div class="form-group">
            <label class="form-label">اسم القطاع (بالعربية) *</label>
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              :class="{ 'input-error': formErrors.name }"
              @input="formErrors.name = null"
              required
              placeholder="مثال: منصات التجارة وإدارة المتاجر"
            />
            <span v-if="formErrors.name" class="field-error-msg">{{ formErrors.name }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">اسم القطاع (English) *</label>
            <input
              type="text"
              v-model="formData.name_en"
              class="form-input ltr-text"
              :class="{ 'input-error': formErrors.name_en }"
              @input="formErrors.name_en = null"
              required
              placeholder="e.g. E-Commerce & Stores"
            />
            <span v-if="formErrors.name_en" class="field-error-msg">{{ formErrors.name_en }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">المعرف البرمجي (Slug) *</label>
            <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="ecommerce" />
          </div>

          <div class="form-group checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
              <span>تفعيل وإظهار هذا القطاع في دليل المنتجات</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث القطاع' : 'إضافة القطاع') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../config/axios';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const categories = ref([]);
const products = ref([]);

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);
const formErrors = ref({});

const formData = ref({
  name: '',
  name_en: '',
  slug: '',
  is_active: 1,
});

const getProductsCount = (slug) => {
  return products.value.filter(p => p.category === slug).length;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [catRes, prodRes] = await Promise.all([
      api.get('/dashboard/categories'),
      api.get('/dashboard/products'),
    ]);
    categories.value = catRes.data.data || [];
    products.value = prodRes.data.data || [];
  } catch (err) {
    console.error('Failed to fetch product categories', err);
    toastError('تعذر تحميل قطاعات المنتجات');
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (cat) => {
  const newStatus = cat.is_active ? 0 : 1;
  try {
    await api.put(`/dashboard/categories/${cat.id}`, { is_active: newStatus });
    cat.is_active = newStatus;
    success(newStatus ? 'تم تفعيل القطاع' : 'تم تعطيل القطاع');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('تعذر تحديث حالة القطاع');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  formErrors.value = {};
  formData.value = {
    name: '',
    name_en: '',
    slug: '',
    is_active: 1,
  };
  modalOpen.value = true;
};

const openEditModal = (cat) => {
  isEdit.value = true;
  currentEditId.value = cat.id;
  formErrors.value = {};
  formData.value = JSON.parse(JSON.stringify(cat));
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveCategory = async () => {
  formErrors.value = {};
  // Front-end Validation
  const name_ar = (formData.value.name || '').trim();
  const name_en = (formData.value.name_en || '').trim();

  let hasError = false;
  if (!name_ar) {
    formErrors.value.name = 'يرجى إدخال اسم القطاع بالعربية';
    hasError = true;
  }
  if (!name_en) {
    formErrors.value.name_en = 'يرجى إدخال اسم القطاع بالإنجليزية (English Name)';
    hasError = true;
  }

  if (hasError) {
    toastError('يرجى ملء الحقول الإجبارية المحددة باللون الأحمر');
    return;
  }

  // Auto-generate slug if not provided
  let slug = (formData.value.slug || '').trim();
  if (!slug) {
    slug = name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
    formData.value.slug = slug;
  }

  const payload = {
    name_ar,
    name_en,
    name: name_ar,
    slug,
    is_active: formData.value.is_active ? 1 : 0,
  };

  saving.value = true;
  try {
    if (isEdit.value) {
      const res = await api.put(`/dashboard/categories/${currentEditId.value}`, payload);
      const idx = categories.value.findIndex(c => c.id === currentEditId.value);
      if (idx !== -1) categories.value[idx] = res.data.data;
      success('تم تحديث قطاع المنتجات بنجاح');
    } else {
      const res = await api.post('/dashboard/categories', payload);
      categories.value.push(res.data.data);
      success('تمت إضافة قطاع المنتجات بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save product category', err);
    const msg = err.response?.data?.message || 'حدث خطأ أثناء حفظ القطاع';
    toastError(msg);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (cat) => {
  if (confirm(`هل أنت متأكد من حذف قطاع "${cat.name}"؟`)) {
    try {
      await api.delete(`/dashboard/categories/${cat.id}`);
      categories.value = categories.value.filter(c => c.id !== cat.id);
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.categories-page {
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

.cat-name { font-weight: 800; color: var(--text-main); }
.cat-name-en { color: var(--text-muted); font-size: 0.8rem; }
.slug-tag {
  font-size: 0.72rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-family: monospace;
}

.products-count-pill {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

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
  max-width: 520px;
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
  display: flex;
  flex-direction: column;
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

.form-input {
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

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18) !important;
  background-color: rgba(239, 68, 68, 0.02) !important;
}

.field-error-msg {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 700;
  margin-top: 0.35rem;
}
</style>
