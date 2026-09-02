<template>
  <div class="solutions-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">دليل الحلول والخدمات (Digital Solutions)</h1>
        <p class="page-subtitle">إدارة حلول Be Kite التخصصية — الحلول التقنية والبرمجية، التسويق الرقمي، والإنتاج الإبداعي</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة حل تخصصي جديد
      </button>
    </div>

    <!-- Category Filter Tabs -->
    <div class="category-tabs">
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === '' }"
        @click="selectedCategory = ''"
      >
        كافة الحلول ({{ solutions.length }})
      </button>
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === 'technology' }"
        @click="selectedCategory = 'technology'"
      >
        الحلول التقنية و ERP ({{ techCount }})
      </button>
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === 'marketing' }"
        @click="selectedCategory = 'marketing'"
      >
        التسويق ونمو العلامات ({{ marketingCount }})
      </button>
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === 'creative' }"
        @click="selectedCategory = 'creative'"
      >
        الإنتاج الإبداعي والمرئي ({{ creativeCount }})
      </button>
    </div>

    <!-- Search & Status Filter -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث في الحلول، التقنيات، أو الميزات..." class="search-input" />
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">جميع الحالات</option>
          <option value="1">مفعل (Active)</option>
          <option value="0">غير مفعل (Inactive)</option>
        </select>
      </div>
    </div>

    <!-- Solutions Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل الحلول التخصصية...</p>
    </div>

    <div v-else-if="filteredSolutions.length === 0" class="empty-state">
      <p>لا توجد حلول مطابقة للبحث المحدد</p>
    </div>

    <div v-else class="solutions-grid">
      <div
        v-for="sol in filteredSolutions"
        :key="sol.id"
        class="solution-card"
        :class="{ 'card-inactive': !sol.is_active }"
      >
        <div class="sol-top">
          <div class="sol-icon-box" :class="'cat-' + sol.category">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <g v-if="sol.icon_name === 'Code'">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
              </g>
              <g v-else-if="sol.icon_name === 'Smartphone'">
                <path d="M12 18h.01M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
              </g>
              <g v-else-if="sol.icon_name === 'Database'">
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3M3 5c0 1.66 4 3 9 3s9-1.34 9-3s-4-3-9-3s-9 1.34-9 3"/>
              </g>
              <g v-else-if="sol.icon_name === 'Cloud'">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </g>
              <g v-else-if="sol.icon_name === 'Palette'">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 2.4 6.6 5.7 7.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5C19.6 18.6 22 15.6 22 12c0-5.5-4.5-10-10-10z"/>
              </g>
              <g v-else-if="sol.icon_name === 'TrendingUp'">
                <path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6"/>
              </g>
              <g v-else-if="sol.icon_name === 'Camera'">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </g>
              <g v-else>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </g>
            </svg>
          </div>
          <div class="sol-badge-wrap">
            <span class="sol-badge">{{ sol.badge || sol.category }}</span>
          </div>
        </div>

        <div class="sol-body">
          <h3 class="sol-title">{{ sol.title }}</h3>
          <p class="sol-desc">{{ sol.description }}</p>

          <!-- Tech Stack Tags -->
          <div class="tech-stack-wrap">
            <span v-for="tech in sol.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>

          <!-- Capabilities Highlights -->
          <div v-if="sol.capabilities && sol.capabilities.length" class="capabilities-list">
            <div v-for="(cap, cIdx) in sol.capabilities.slice(0, 2)" :key="cIdx" class="cap-item">
              <span class="cap-check">✓</span>
              <span class="cap-text">{{ cap.title }}</span>
            </div>
          </div>
        </div>

        <div class="sol-footer">
          <button
            class="status-btn"
            :class="sol.is_active ? 'active' : 'inactive'"
            @click="toggleSolutionStatus(sol)"
          >
            {{ sol.is_active ? 'مفعل على الموقع' : 'معطل' }}
          </button>

          <div class="sol-actions">
            <button class="action-btn edit-btn" @click="openEditModal(sol)" title="تعديل">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn delete-btn" @click="confirmDelete(sol)" title="حذف">
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
          <h2 class="modal-title">{{ isEdit ? 'تعديل الحل التخصصي' : 'إضافة حل جديد' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="saveSolution" class="modal-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">عنوان الحل (بالعربية) *</label>
              <input type="text" v-model="formData.title" class="form-input" required placeholder="مثال: تصميم وتطوير المواقع والمنصات" />
            </div>
            <div class="form-group">
              <label class="form-label">عنوان الحل (English) *</label>
              <input type="text" v-model="formData.title_en" class="form-input ltr-text" required placeholder="e.g. Web Design & Development" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">القطاع الرئيسي *</label>
              <select v-model="formData.category" class="form-input" required>
                <option value="technology">الحلول التقنية والبرمجية (Technology)</option>
                <option value="marketing">التسويق ونمو العلامات (Marketing)</option>
                <option value="creative">الإنتاج الإبداعي والمرئي (Creative)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">الرابط المخصص (Slug)</label>
              <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="web-development" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">الشارة (Badge)</label>
              <input type="text" v-model="formData.badge" class="form-input" placeholder="DEVELOPMENT" />
            </div>
            <div class="form-group">
              <label class="form-label">الأيقونة (Icon Name)</label>
              <select v-model="formData.icon_name" class="form-input ltr-text">
                <option value="Code">Code</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Database">Database</option>
                <option value="Cloud">Cloud</option>
                <option value="Palette">Palette</option>
                <option value="Share2">Share2</option>
                <option value="TrendingUp">TrendingUp</option>
                <option value="FileText">FileText</option>
                <option value="Camera">Camera</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الوصف والملخص</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3" placeholder="نبذة عن القيمة المضافة للحل التقني..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">التقنيات المستخدمة (مفصولة بفواصل)</label>
            <input
              type="text"
              :value="formData.technologies?.join(', ')"
              @input="formData.technologies = $event.target.value.split(',').map(s => s.trim())"
              class="form-input ltr-text"
              placeholder="React 18, Vue 3, Laravel 11, AWS, PostgreSQL"
            />
          </div>

          <div class="form-group checkbox-row">
            <label class="toggle-switch-label">
              <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
              <span>تفعيل وإظهار هذا الحل في دليل الحلول</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث الحل' : 'إضافة ونشر') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { SolutionService } from '../services/SolutionService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const solutions = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);

const formData = ref({
  title: '',
  title_en: '',
  slug: '',
  category: 'technology',
  badge: 'TECH',
  description: '',
  technologies: ['React 18', 'Laravel 11'],
  icon_name: 'Code',
  is_active: 1,
});

const techCount = computed(() => solutions.value.filter(s => s.category === 'technology').length);
const marketingCount = computed(() => solutions.value.filter(s => s.category === 'marketing').length);
const creativeCount = computed(() => solutions.value.filter(s => s.category === 'creative').length);

const filteredSolutions = computed(() => {
  return solutions.value.filter(s => {
    const matchesSearch = !searchQuery.value ||
      s.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (s.technologies && s.technologies.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase())));
    const matchesCat = !selectedCategory.value || s.category === selectedCategory.value;
    const matchesStatus = selectedStatus.value === '' || String(s.is_active) === String(selectedStatus.value);
    return matchesSearch && matchesCat && matchesStatus;
  });
});

const fetchSolutions = async () => {
  loading.value = true;
  try {
    solutions.value = await SolutionService.getAll();
  } catch (err) {
    console.error('Failed to fetch solutions', err);
    toastError('تعذر تحميل الحلول والخدمات');
  } finally {
    loading.value = false;
  }
};

const toggleSolutionStatus = async (sol) => {
  const newStatus = sol.is_active ? 0 : 1;
  try {
    await SolutionService.update(sol.id, { is_active: newStatus });
    sol.is_active = newStatus;
    success('تم تحديث حالة الخدمة');
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
    slug: '',
    category: 'technology',
    badge: 'SOLUTION',
    description: '',
    technologies: ['Laravel 11', 'Vue 3', 'Cloudflare'],
    icon_name: 'Code',
    is_active: 1,
  };
  modalOpen.value = true;
};

const openEditModal = (sol) => {
  isEdit.value = true;
  currentEditId.value = sol.id;
  formData.value = JSON.parse(JSON.stringify(sol));
  if (!formData.value.technologies) formData.value.technologies = [];
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveSolution = async () => {
  saving.value = true;
  try {
    if (isEdit.value) {
      const updated = await SolutionService.update(currentEditId.value, formData.value);
      const idx = solutions.value.findIndex(s => s.id === currentEditId.value);
      if (idx !== -1) solutions.value[idx] = updated;
      success('تم تحديث الخدمة بنجاح');
    } else {
      const created = await SolutionService.create(formData.value);
      solutions.value.push(created);
      success('تمت إضافة الخدمة بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save solution', err);
    toastError('حدث خطأ أثناء حفظ الخدمة');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (sol) => {
  if (confirm(`هل أنت متأكد من حذف حل "${sol.title}"؟`)) {
    try {
      await SolutionService.delete(sol.id);
      solutions.value = solutions.value.filter(s => s.id !== sol.id);
      success('تم حذف الخدمة بنجاح');
    } catch (err) {
      console.error('Failed to delete solution', err);
      toastError('حدث خطأ أثناء حذف الخدمة');
    }
  }
};

onMounted(() => {
  fetchSolutions();
});
</script>

<style scoped>
.solutions-page {
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

/* Tabs */
.category-tabs {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  background: var(--bg-card);
  padding: 0.4rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  width: fit-content;
}

.cat-tab-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cat-tab-btn.active {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

/* Filters */
.filters-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.4rem 0.65rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
}

.filter-select {
  padding: 0.65rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

/* Grid */
.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.solution-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.solution-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.card-inactive {
  opacity: 0.65;
}

.sol-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sol-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cat-technology { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }
.cat-marketing { background: rgba(8, 145, 178, 0.12); color: #0891b2; }
.cat-creative { background: rgba(219, 39, 119, 0.12); color: #db2777; }

.sol-badge {
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--text-muted);
  background: var(--bg-main);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
}

.sol-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sol-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.3;
}

.sol-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.tech-stack-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tech-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-main);
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
}

.capabilities-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: var(--bg-main);
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
}

.cap-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
}

.cap-check {
  color: #10b981;
  font-weight: 800;
}

.cap-text {
  color: var(--text-main);
  font-weight: 600;
}

.sol-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-color);
}

.status-btn {
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.status-btn.active { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.status-btn.inactive { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

.sol-actions {
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
  max-width: 650px;
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

.loading-state, .empty-state {
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
