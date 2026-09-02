<template>
  <div class="brands-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">العلامات واستثمارات المنظومة (Venture Brands)</h1>
        <p class="page-subtitle">إدارة الشركات والعلامات التابعة المطورة والمملوكة لـ Be Kite — تطبيق زلمة، هدايا أب، والمشاريع الاستثمارية القادمة</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة علامة تابعة جديدة
      </button>
    </div>

    <!-- Brands Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل العلامات التابعة...</p>
    </div>

    <div v-else class="brands-grid">
      <div
        v-for="brand in brands"
        :key="brand.id"
        class="brand-card"
        :class="{ 'card-coming-soon': brand.is_coming_soon }"
      >
        <div class="brand-top-bar" :style="{ background: brand.brand_color || '#7c3aed' }"></div>

        <div class="brand-content">
          <div class="brand-header-flex">
            <div class="brand-badge-wrap">
              <span class="brand-badge" :style="{ color: brand.brand_color, background: getAlphaColor(brand.brand_color) }">
                {{ brand.badge || (brand.is_coming_soon ? 'قيد التطوير' : 'VENTURE') }}
              </span>
            </div>
            <div class="brand-status-pill" :class="brand.is_active ? 'active' : 'inactive'">
              {{ brand.is_active ? 'نشط' : 'معطل' }}
            </div>
          </div>

          <div class="brand-title-wrap">
            <h3 class="brand-name">{{ brand.name }}</h3>
            <span class="brand-subtitle">{{ brand.subtitle }}</span>
          </div>

          <p class="brand-desc">{{ brand.description }}</p>

          <!-- Tags -->
          <div class="brand-tags-wrap">
            <span v-for="tag in brand.tags" :key="tag" class="brand-tag">{{ tag }}</span>
          </div>

          <!-- Links -->
          <div v-if="brand.links && brand.links.length" class="brand-links-flex">
            <a
              v-for="link in brand.links"
              :key="link.label"
              :href="link.href"
              target="_blank"
              class="brand-link-btn"
              :class="'btn-' + link.type"
            >
              {{ link.label }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="brand-footer">
          <button class="status-btn" @click="toggleBrandStatus(brand)">
            {{ brand.is_active ? 'إيقاف العلامة' : 'تفعيل العلامة' }}
          </button>
          <div class="brand-actions">
            <button class="action-btn edit-btn" @click="openEditModal(brand)" title="تعديل">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn delete-btn" @click="confirmDelete(brand)" title="حذف">
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
          <h2 class="modal-title">{{ isEdit ? 'تعديل بيانات العلامة' : 'إضافة علامة تابعة جديدة' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveBrand" class="modal-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">اسم العلامة (بالعربية) *</label>
              <input type="text" v-model="formData.name" class="form-input" required placeholder="مثال: تطبيق زلمة | Zalameh App" />
            </div>
            <div class="form-group">
              <label class="form-label">اسم العلامة (English) *</label>
              <input type="text" v-model="formData.name_en" class="form-input ltr-text" required placeholder="e.g. Zalameh App" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">العنوان الفرعي</label>
              <input type="text" v-model="formData.subtitle" class="form-input" placeholder="مجتمع ونمط حياة عصري مخصص للرجل العربي" />
            </div>
            <div class="form-group">
              <label class="form-label">الرابط المخصص (Slug)</label>
              <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="zalameh-app" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">الشارة (Badge)</label>
              <input type="text" v-model="formData.badge" class="form-input" placeholder="CONSUMER APP" />
            </div>
            <div class="form-group">
              <label class="form-label">لون الهوية البصرية (Brand Color)</label>
              <div class="color-wrap">
                <input type="color" v-model="formData.brand_color" class="color-input" />
                <input type="text" v-model="formData.brand_color" class="form-input ltr-text" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الوصف والرسالة</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3" placeholder="نبذة عن المشروع وأهدافه والجمهور المستهدف..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">الوسوم والتصنيفات (مفصولة بفواصل)</label>
            <input
              type="text"
              :value="formData.tags?.join(', ')"
              @input="formData.tags = $event.target.value.split(',').map(s => s.trim())"
              class="form-input"
              placeholder="تطبيق مجتمعي, علامة استهلاكية, ثقافة"
            />
          </div>

          <div class="form-grid-2">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.is_coming_soon" :true-value="1" :false-value="0" />
              <span>مشروع قيد التطوير (Coming Soon)</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
              <span>تفعيل وإظهار العلامة في المنظومة</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث العلامة' : 'حفظ ونشر') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BrandService } from '../services/BrandService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const brands = ref([]);

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);

const formData = ref({
  name: '',
  name_en: '',
  subtitle: '',
  slug: '',
  badge: 'VENTURE',
  description: '',
  tags: ['علامة استهلاكية'],
  brand_color: '#ea580c',
  accent_color: '#c2410c',
  is_coming_soon: 0,
  is_active: 1,
});

const getAlphaColor = (hex) => {
  return `${hex || '#7c3aed'}18`;
};

const fetchBrands = async () => {
  loading.value = true;
  try {
    brands.value = await BrandService.getAll();
  } catch (err) {
    console.error('Failed to fetch brands', err);
    toastError('تعذر تحميل العلامات التابعة');
  } finally {
    loading.value = false;
  }
};

const toggleBrandStatus = async (brand) => {
  const newStatus = brand.is_active ? 0 : 1;
  try {
    await BrandService.update(brand.id, { is_active: newStatus });
    brand.is_active = newStatus;
    success('تم تحديث حالة العلامة التابعة');
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
    subtitle: '',
    slug: '',
    badge: 'VENTURE',
    description: '',
    tags: ['علامة استثمارية'],
    brand_color: '#4f008c',
    accent_color: '#7c3aed',
    is_coming_soon: 0,
    is_active: 1,
  };
  modalOpen.value = true;
};

const openEditModal = (brand) => {
  isEdit.value = true;
  currentEditId.value = brand.id;
  formData.value = JSON.parse(JSON.stringify(brand));
  if (!formData.value.tags) formData.value.tags = [];
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveBrand = async () => {
  saving.value = true;
  try {
    if (isEdit.value) {
      const updated = await BrandService.update(currentEditId.value, formData.value);
      const idx = brands.value.findIndex(b => b.id === currentEditId.value);
      if (idx !== -1) brands.value[idx] = updated;
      success('تم تحديث العلامة التابعة بنجاح');
    } else {
      const created = await BrandService.create(formData.value);
      brands.value.push(created);
      success('تمت إضافة العلامة التابعة بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save brand', err);
    toastError('حدث خطأ أثناء حفظ العلامة');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (brand) => {
  if (confirm(`هل أنت متأكد من حذف علامة "${brand.name}"؟`)) {
    try {
      await api.delete(`/dashboard/brands/${brand.id}`);
      brands.value = brands.value.filter(b => b.id !== brand.id);
    } catch (err) {
      console.error('Failed to delete brand', err);
    }
  }
};

onMounted(() => {
  fetchBrands();
});
</script>

<style scoped>
.brands-page {
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

/* Brands Grid */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.brand-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.brand-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.07);
}

.brand-top-bar {
  height: 6px;
  width: 100%;
}

.brand-content {
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.brand-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
}

.brand-status-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
}
.brand-status-pill.active { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.brand-status-pill.inactive { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

.brand-title-wrap {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-main);
}

.brand-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.brand-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.brand-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.brand-tag {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-main);
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.brand-links-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.brand-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.74rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
}
.btn-primary { background: #7c3aed; color: #fff; }
.btn-secondary { background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-main); }

.brand-footer {
  padding: 0.9rem 1.35rem;
  background: var(--table-header-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.brand-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
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

.color-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.color-input {
  width: 40px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
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
