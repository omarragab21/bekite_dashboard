<template>
  <div class="news-events-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h2 class="page-title">الأخبار والفعاليات</h2>
        <p class="page-subtitle">إدارة الأخبار والفعاليات</p>
      </div>
      <button class="add-btn" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة جديد
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon-wrapper total-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">الإجمالي</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper active-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">نشط</span>
          <span class="stat-value">{{ activeCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper main-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">أخبار</span>
          <span class="stat-value">{{ newsCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper sub-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">فعاليات</span>
          <span class="stat-value">{{ eventsCount }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث عن عنوان..." class="search-input" />
      </div>
      <div class="filter-select">
        <select v-model="statusFilter" class="form-select">
          <option value="">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="select-icon" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="filter-select">
        <select v-model="typeFilter" class="form-select">
          <option value="">جميع الأنواع</option>
          <option value="news">أخبار</option>
          <option value="event">فعاليات</option>
        </select>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="select-icon" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-drag"></th>
            <th class="col-title">العنوان</th>
            <th class="col-type">النوع</th>
            <th class="col-date">التاريخ</th>
            <th class="col-status">الحالة</th>
            <th class="col-actions">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="state-row"><td colspan="6">جاري التحميل...</td></tr>
          <tr v-else-if="filteredItems.length === 0" class="state-row"><td colspan="6">لا توجد نتائج مطابقة</td></tr>
          <template v-else>
            <tr v-for="item in filteredItems" :key="item.id" class="data-row"
              :class="{ 'row-dragging': draggedId === item.id, 'row-drag-over': dragOverId === item.id }"
              draggable="true"
              @dragstart="onDragStart(item)"
              @dragover.prevent="onDragOver(item)"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop(item)"
              @dragend="onDragEnd"
            >
              <td class="col-drag">
                <span class="drag-handle" title="اسحب لإعادة الترتيب">⠇</span>
              </td>
              <td class="col-title">
                <div class="item-name-cell">
                  <div class="item-image">
                    <img v-if="item.image" :src="item.image" :alt="item.title" />
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div class="item-details">
                    <span class="item-title">{{ item.title_i18n?.ar || item.title }}</span>
                    <span class="item-desc">{{ truncate(item.description_i18n?.ar || item.description, 40) }}</span>
                  </div>
                </div>
              </td>
              <td class="col-type">
                <span class="type-badge" :class="item.type">{{ item.type === 'event' ? 'فعالية' : 'خبر' }}</span>
              </td>
              <td class="col-date">{{ item.event_date_display }}</td>
              <td class="col-status">
                <span class="status-badge" :class="item.status === 'active' ? 'active' : 'inactive'">
                  {{ item.status === 'active' ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-group">
                  <button class="action-btn delete-btn" @click="confirmDelete(item)" title="حذف">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  <button class="action-btn edit-btn" @click="openEditModal(item)" title="تعديل">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="action-btn view-btn" @click="openViewModal(item)" title="عرض">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="totalCount > perPage">
      <div class="pagination-info">
        <span>إظهار {{ (currentPage - 1) * perPage + 1 }} - {{ Math.min(currentPage * perPage, totalCount) }} من أصل {{ totalCount }}</span>
      </div>
      <div class="pagination-controls">
        <button class="pagination-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>السابق</button>
        <div class="pagination-pages"><button v-for="page in totalPages" :key="page" class="pagination-page-btn" :class="{ active: currentPage === page }" @click="goToPage(page)">{{ page }}</button></div>
        <button class="pagination-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">التالي<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" v-if="showFormModal" @click.self="closeModal">
      <div class="modal-content form-content">
        <button class="modal-close" @click="closeModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h3 class="modal-title">{{ isEdit ? 'تعديل' : 'إضافة جديد' }}</h3>
        <p class="modal-subtitle">أدخل معلومات الخبر أو الفعالية</p>

        <div class="i18n-toggle" role="tablist" aria-label="Language">
          <button type="button" class="i18n-btn" :class="{ active: activeLang === 'en' }" @click="activeLang = 'en'">English</button>
          <button type="button" class="i18n-btn" :class="{ active: activeLang === 'ar' }" @click="activeLang = 'ar'">العربية</button>
        </div>

        <form @submit.prevent="submitForm" class="news-form">
          <div class="tab-pane">
            <!-- Images Upload -->
            <div class="form-group">
              <label class="form-label" style="text-align: right;">الصور <span class="req">*</span></label>
              <div class="image-uploader">
                <div class="upload-box" @click="triggerFileInput" v-if="(form.existing_images.length + form.new_images.length) < 4">
                  <input type="file" ref="fileInput" @change="handleFileChange" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" multiple class="hidden-input" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <p>إضافة صورة<br><span>(JPG, PNG | بحد أقصى 4 صور)</span></p>
                </div>
                <div class="upload-box disabled" v-else>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  <p>وصلت للحد الأقصى (4 صور)</p>
                </div>
                <div class="preview-grid" v-if="imagePreviews.length > 0 || form.existing_images.length > 0">
                  <div class="preview-item" v-for="(img, idx) in form.existing_images" :key="'e'+idx">
                    <img :src="img" /><button type="button" class="remove-img-btn" @click.prevent="removeExistingImage(idx)">✕</button>
                  </div>
                  <div class="preview-item" v-for="(file, idx) in imagePreviews" :key="'p'+idx">
                    <img :src="file.preview" /><button type="button" class="remove-img-btn" @click.prevent="removeNewImage(idx)">✕</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="form-group" v-show="activeLang === 'ar'">
              <label class="form-label">العنوان (عربي) <span class="req">*</span></label>
              <input type="text" v-model="form.title_ar" class="form-control" placeholder="مثال: مؤتمر التكنولوجيا السنوي" />
            </div>
            <div class="form-group" v-show="activeLang === 'en'">
              <label class="form-label">العنوان (English) <span class="req">*</span></label>
              <input type="text" v-model="form.title_en" class="form-control" placeholder="Title in English" required />
            </div>

            <!-- Description -->
            <div class="form-group" v-show="activeLang === 'ar'">
              <label class="form-label">الوصف (عربي) <span class="req">*</span></label>
              <textarea v-model="form.description_ar" class="form-control textarea" placeholder="أدخل الوصف..." rows="4"></textarea>
            </div>
            <div class="form-group" v-show="activeLang === 'en'">
              <label class="form-label">الوصف (English)</label>
              <textarea v-model="form.description_en" class="form-control textarea" placeholder="Description in English..." rows="4"></textarea>
            </div>

            <div class="form-row">
              <!-- Date -->
              <div class="form-group half-width">
                <label class="form-label">التاريخ <span class="req">*</span></label>
                <input type="date" v-model="form.event_date" class="form-control" />
              </div>
              <!-- Type -->
              <div class="form-group half-width">
                <label class="form-label">النوع <span class="req">*</span></label>
                <div class="select-wrapper">
                  <select v-model="form.type" class="form-control">
                    <option value="news">خبر</option>
                    <option value="event">فعالية</option>
                  </select>
                  <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            <!-- Status -->
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
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'جاري الحفظ...' : (isEdit ? 'تعديل' : 'إضافة') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" v-if="showViewModal" @click.self="showViewModal = false;">
      <div class="modal-content view-content no-padding-top">
        <button class="modal-close floating-close" @click="showViewModal = false;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="view-image-slider" v-if="viewItem?.images?.length">
          <img :src="viewItem.images[currentImageIdx]" class="view-main-image" />
          <button v-if="viewItem.images.length > 1" class="slider-btn prev-btn" @click.prevent="prevImage">&#10095;</button>
          <button v-if="viewItem.images.length > 1" class="slider-btn next-btn" @click.prevent="nextImage">&#10094;</button>
          <div v-if="viewItem.images.length > 1" class="image-indicator">{{currentImageIdx + 1}} / {{viewItem.images.length}}</div>
        </div>
        <div class="view-body-wrapper">
          <div class="view-title-row">
            <div>
              <h3 class="view-title">{{ viewItem?.title }}</h3>
              <span class="view-type-badge" :class="viewItem?.type">{{ viewItem?.type === 'event' ? 'فعالية' : 'خبر' }}</span>
            </div>
            <div class="view-status-badge" :class="viewItem?.status === 'active' ? 'active' : 'inactive'">{{ viewItem?.status === 'active' ? 'نشط' : 'غير نشط' }}</div>
          </div>
          <div class="view-meta-row">
            <span class="view-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> {{ viewItem?.event_date_display }}</span>
          </div>
          <div class="view-sections" v-if="viewItem?.description">
            <div class="v-section">
              <h4 class="v-section-title">الوصف</h4>
              <div class="v-section-content" style="white-space: pre-wrap;">{{ viewItem?.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert -->
    <div class="alert-toast" :class="[alertType, { show: showAlert }]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
        <path v-if="alertType === 'success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="alertType === 'success'" points="22 4 12 14.01 9 11.01"/>
        <circle v-if="alertType === 'error'" cx="12" cy="12" r="10"/><line v-if="alertType === 'error'" x1="12" y1="8" x2="12" y2="12"/><line v-if="alertType === 'error'" x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ alertMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import api from '../config/axios';
import { revokeObjectUrl, validateImageFiles } from '../utils/imageUpload';

const items = ref([]);
const loading = ref(false);
const draggedId = ref(null);
const dragOverId = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const typeFilter = ref('');
const currentPage = ref(1);
const perPage = ref(15);
const totalCount = ref(0);

const totalItems = computed(() => totalCount.value);
const activeCount = computed(() => items.value.filter(i => i.status === 'active').length);
const newsCount = computed(() => items.value.filter(i => i.type === 'news').length);
const eventsCount = computed(() => items.value.filter(i => i.type === 'event').length);
const totalPages = computed(() => Math.ceil(totalCount.value / perPage.value));
const filteredItems = computed(() => items.value);

const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg; alertType.value = type; showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3000);
};

const goToPage = (page) => { if (page < 1 || page > totalPages.value) return; currentPage.value = page; fetchItems(); };

const onDragStart = (item) => { draggedId.value = item.id; };
const onDragOver = (target) => { if (!draggedId.value || draggedId.value === target.id) return; dragOverId.value = target.id; };
const onDragLeave = () => { dragOverId.value = null; };
const onDragEnd = () => { draggedId.value = null; dragOverId.value = null; };

const onDrop = async (target) => {
  dragOverId.value = null;
  if (!draggedId.value || draggedId.value === target.id) { draggedId.value = null; return; }
  const current = [...items.value];
  const fromIdx = current.findIndex(i => i.id === draggedId.value);
  const toIdx = current.findIndex(i => i.id === target.id);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) { draggedId.value = null; return; }
  const [moved] = current.splice(fromIdx, 1);
  current.splice(toIdx, 0, moved);
  current.forEach((i, idx) => { i.sort_order = idx + 1 + (currentPage.value - 1) * perPage.value; });
  items.value = current;
  draggedId.value = null;
  try {
    await api.post('/dashboard/news-events/reorder', { items: current.map(i => ({ id: i.id, sort_order: i.sort_order })) });
    triggerAlert('تم تحديث الترتيب بنجاح');
  } catch (err) {
    triggerAlert('فشل حفظ الترتيب', 'error');
    fetchItems();
  }
};

const truncate = (text, max) => { if (!text) return ''; return text.length > max ? text.substring(0, max) + '...' : text; };

const fetchItems = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, per_page: perPage.value };
    if (statusFilter.value) params.is_active = statusFilter.value === 'active' ? 1 : 0;
    if (typeFilter.value) params.type = typeFilter.value;
    if (searchQuery.value) params.search = searchQuery.value;
    const res = await api.get('/dashboard/news-events', { params });
    items.value = res.data.data;
    totalCount.value = res.data.meta?.total || res.data.data?.length || 0;
  } catch (err) {
    triggerAlert('فشل استيراد البيانات', 'error');
  } finally { loading.value = false; }
};

let searchDebounceTimer = null;
watch([statusFilter, typeFilter], () => { currentPage.value = 1; fetchItems(); });
watch(searchQuery, () => { clearTimeout(searchDebounceTimer); searchDebounceTimer = setTimeout(() => { currentPage.value = 1; fetchItems(); }, 400); });

onMounted(() => { fetchItems(); });
onBeforeUnmount(() => imagePreviews.value.forEach(({ preview }) => revokeObjectUrl(preview)));

const showFormModal = ref(false);
const showViewModal = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const viewItem = ref(null);
const currentImageIdx = ref(0);
const fileInput = ref(null);
const imagePreviews = ref([]);
const activeLang = ref('ar');

const form = ref({
  title_ar: '', title_en: '', description_ar: '', description_en: '',
  event_date: '', type: 'news', is_active: true,
  existing_images: [], new_images: [], sort_order: 1
});

const openAddModal = () => {
  isEdit.value = false; editingId.value = null; activeLang.value = 'ar'; imagePreviews.value = [];
  form.value = { title_ar: '', title_en: '', description_ar: '', description_en: '', event_date: '', type: 'news', is_active: true, existing_images: [], new_images: [], sort_order: 1 };
  showFormModal.value = true;
};

const openEditModal = (item) => {
  isEdit.value = true; editingId.value = item.id; activeLang.value = 'ar'; imagePreviews.value = [];
  form.value = {
    title_ar: (item.title_i18n && typeof item.title_i18n === 'object' ? (item.title_i18n.ar ?? item.title) : item.title) || '',
    title_en: (item.title_i18n && typeof item.title_i18n === 'object' ? (item.title_i18n.en ?? '') : ''),
    description_ar: (item.description_i18n && typeof item.description_i18n === 'object' ? (item.description_i18n.ar ?? item.description) : item.description) || '',
    description_en: (item.description_i18n && typeof item.description_i18n === 'object' ? (item.description_i18n.en ?? '') : ''),
    event_date: item.event_date || '', type: item.type, is_active: item.status === 'active',
    existing_images: [...(item.images || [])], new_images: [], sort_order: item.sort_order ?? 1
  };
  showFormModal.value = true;
};

const openViewModal = (item) => { viewItem.value = item; currentImageIdx.value = 0; showViewModal.value = true; };
const prevImage = () => { if (currentImageIdx.value > 0) currentImageIdx.value--; else currentImageIdx.value = (viewItem.value?.images?.length || 1) - 1; };
const nextImage = () => { const max = (viewItem.value?.images?.length || 1) - 1; if (currentImageIdx.value < max) currentImageIdx.value++; else currentImageIdx.value = 0; };
const closeModal = () => {
  imagePreviews.value.forEach(({ preview }) => revokeObjectUrl(preview));
  imagePreviews.value = [];
  showFormModal.value = false;
};

const triggerFileInput = () => { fileInput.value.click(); };
const handleFileChange = (e) => {
  const files = Array.from(e.target.files || []);
  const currentTotal = form.value.existing_images.length + form.value.new_images.length;
  const { accepted, errors } = validateImageFiles(files, { currentCount, maxFiles: 4 });
  accepted.forEach((file) => {
    form.value.new_images.push(file);
    imagePreviews.value.push({ file, preview: URL.createObjectURL(file) });
  });
  if (errors.length) triggerAlert(errors.join(' • '), 'error');
  e.target.value = null;
};
const removeExistingImage = (idx) => { form.value.existing_images.splice(idx, 1); };
const removeNewImage = (idx) => {
  revokeObjectUrl(imagePreviews.value[idx]?.preview);
  form.value.new_images.splice(idx, 1);
  imagePreviews.value.splice(idx, 1);
};

const submitForm = async () => {
  if (!String(form.value.title_ar || '').trim()) { activeLang.value = 'ar'; triggerAlert('العنوان بالعربي مطلوب', 'error'); return; }
  if (!String(form.value.title_en || '').trim()) { activeLang.value = 'en'; triggerAlert('العنوان بالإنجليزية مطلوب', 'error'); return; }
  if (!String(form.value.description_ar || '').trim()) { activeLang.value = 'ar'; triggerAlert('الوصف بالعربي مطلوب', 'error'); return; }
  if (!form.value.event_date) { triggerAlert('التاريخ مطلوب', 'error'); return; }
  if (form.value.existing_images.length + form.value.new_images.length === 0) { triggerAlert('يجب إضافة صورة واحدة على الأقل', 'error'); return; }

  isSubmitting.value = true;
  const fd = new FormData();
  fd.append('title', JSON.stringify({ ar: form.value.title_ar || '', en: form.value.title_en || '' }));
  fd.append('description', JSON.stringify({ ar: form.value.description_ar || '', en: form.value.description_en || '' }));
  fd.append('event_date', form.value.event_date);
  fd.append('type', form.value.type);
  fd.append('is_active', form.value.is_active ? 1 : 0);
  fd.append('sort_order', form.value.sort_order ?? 1);

  form.value.existing_images.forEach(img => { fd.append('existing_images[]', img); });
  form.value.new_images.forEach(img => { fd.append('images[]', img); });

  try {
    if (isEdit.value) {
      fd.append('_method', 'PUT');
      await api.post(`/dashboard/news-events/${editingId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      triggerAlert('تم التحديث بنجاح');
    } else {
      await api.post('/dashboard/news-events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      triggerAlert('تم الإضافة بنجاح');
    }
    closeModal(); fetchItems();
  } catch (error) {
    const msg = error.response?.data?.message || 'حدث خطأ أثناء الحفظ';
    triggerAlert(msg, 'error');
  } finally { isSubmitting.value = false; }
};

const confirmDelete = async (item) => {
  if (confirm(`تأكيد حذف "${item.title_i18n?.ar || item.title}"؟`)) {
    try {
      await api.delete(`/dashboard/news-events/${item.id}`);
      triggerAlert('تم الحذف بنجاح'); fetchItems();
    } catch (err) { triggerAlert('فشل عملية الحذف', 'error'); }
  }
};
</script>

<style scoped>
.news-events-page { display: flex; flex-direction: column; gap: 1.5rem; direction: rtl; font-family: 'Cairo', sans-serif; padding-bottom: 2rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: 1.4rem; font-weight: 800; color: #111827; margin-bottom: 0.2rem; }
.page-subtitle { font-size: 0.85rem; color: #6b7280; }
.add-btn { display: flex; align-items: center; gap: 0.5rem; background: #873260; color: #fff; border: none; padding: 0.65rem 1.1rem; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.add-btn:hover { background: #6E1A41; }
.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.25rem; display: flex; align-items: center; justify-content: flex-end; gap: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); flex-direction: row-reverse; }
.stat-info { display: flex; flex-direction: column; align-items: flex-start; flex: 1; }
.stat-label { font-size: 0.75rem; font-weight: 700; color: #6b7280; }
.stat-value { font-size: 1.5rem; font-weight: 800; color: #1f2937; margin-top: 0.2rem; }
.stat-icon-wrapper { width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.active-icon { background: #fdf2f8; color: #db2777; }
.total-icon { background: #ecfdf5; color: #059669; }
.main-icon { background: #fefce8; color: #ca8a04; }
.sub-icon { background: #eff6ff; color: #2563eb; }
.filters-row { display: flex; gap: 1rem; align-items: center; }
.search-box { flex: 1; position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; right: 1rem; color: #9ca3af; }
.search-input { width: 100%; padding: 0.7rem 2.8rem 0.7rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; outline: none; background: #fff; transition: border-color 0.2s; }
.search-input:focus { border-color: #873260; }
.filter-select { position: relative; display: flex; align-items: center; min-width: 150px; }
.form-select { width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #374151; appearance: none; outline: none; cursor: pointer; }
.filter-select .select-icon { position: absolute; left: 1rem; color: #9ca3af; pointer-events: none; }
.col-drag { width: 36px; text-align: center; padding: 0 4px !important; }
.drag-handle { font-size: 1.2rem; color: #d1d5db; cursor: grab; user-select: none; display: inline-block; line-height: 1; transition: color 0.2s; }
.drag-handle:hover { color: #873260; }
.data-row.row-dragging { opacity: 0.35; }
.data-row.row-drag-over > td:first-child { border-right: 3px solid #873260; }
.data-row.row-drag-over { background: #fdf2f8 !important; }
.table-container { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 1rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.data-table th { background: #f9fafb; font-size: 0.75rem; font-weight: 700; color: #6b7280; white-space: nowrap; }
.data-table td { font-size: 0.85rem; color: #374151; }
.data-table tr:last-child td { border-bottom: none; }
.data-row:hover td { background: #fdfafb; }
.state-row td { text-align: center; color: #6b7280; padding: 2.5rem; }
.col-title { text-align: right; width: 35%; }
.col-type { text-align: center; width: 12%; }
.col-date { text-align: center; width: 15%; }
.col-status { text-align: center; width: 10%; }
.col-actions { text-align: left; width: 15%; padding-left: 1.5rem !important; }
.data-table th.col-actions, .data-table th.col-status, .data-table th.col-type, .data-table th.col-date { text-align: center; }
.data-table th.col-actions { text-align: right; }
.item-name-cell { display: flex; align-items: center; gap: 0.85rem; }
.item-image { width: 40px; height: 40px; border-radius: 6px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #e5e7eb; }
.item-image img { width: 100%; height: 100%; object-fit: cover; }
.item-details { display: flex; flex-direction: column; align-items: flex-start; }
.item-title { font-weight: 700; color: #111827; font-size: 0.85rem; line-height: 1.3; margin-bottom: 0.2rem; }
.item-desc { font-size: 0.7rem; color: #6b7280; }
.type-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.type-badge.news { background: #ecfdf5; color: #059669; }
.type-badge.event { background: #fefce8; color: #ca8a04; }
.status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.status-badge.active { background: #ecfdf5; color: #059669; }
.status-badge.inactive { background: #fef2f2; color: #dc2626; }
.actions-group { display: flex; align-items: center; justify-content: flex-start; gap: 0.4rem; }
.action-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9ca3af; transition: all 0.2s; }
.action-btn:hover { background: #f3f4f6; }
.delete-btn:hover { color: #dc2626; background: #fef2f2; }
.edit-btn:hover { color: #2563eb; background: #eff6ff; }
.view-btn:hover { color: #059669; background: #ecfdf5; }
.pagination-container { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding: 0 0.5rem; }
.pagination-info { font-size: 0.8rem; color: #6b7280; }
.pagination-controls { display: flex; align-items: center; gap: 0.5rem; }
.pagination-btn { display: flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.8rem; border: 1px solid #e5e7eb; background: #fff; border-radius: 6px; font-family: 'Cairo', sans-serif; font-size: 0.8rem; cursor: pointer; color: #374151; transition: all 0.2s; }
.pagination-btn:hover:not(:disabled) { background: #f9fafb; border-color: #d1d5db; }
.pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination-pages { display: flex; gap: 0.3rem; }
.pagination-page-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e5e7eb; background: #fff; font-family: 'Cairo', sans-serif; font-size: 0.8rem; cursor: pointer; color: #374151; transition: all 0.2s; }
.pagination-page-btn:hover { background: #f9fafb; }
.pagination-page-btn.active { background: #873260; color: #fff; border-color: #873260; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
.modal-content { background: #fff; border-radius: 12px; width: 100%; max-width: 600px; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto; }
.form-content { max-width: 700px; }
.modal-close { position: absolute; top: 1.2rem; left: 1.2rem; background: none; border: none; color: #9ca3af; cursor: pointer; transition: color 0.2s; }
.modal-close:hover { color: #111827; }
.modal-title { font-size: 1.2rem; font-weight: 800; color: #111827; text-align: center; margin-bottom: 0.2rem; }
.modal-subtitle { font-size: 0.8rem; color: #6b7280; text-align: center; margin-bottom: 1.5rem; }
.i18n-toggle { display: inline-flex; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff; margin: 0.75rem auto 1.25rem; }
.i18n-btn { border: none; background: transparent; padding: 0.4rem 0.9rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; color: #6b7280; min-width: 96px; }
.i18n-btn.active { background: #873260; color: #fff; }
.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; text-align: right; }
.req { color: #dc2626; }
.form-control { width: 100%; padding: 0.65rem 0.8rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #1f2937; outline: none; transition: border-color 0.2s; text-align: right; }
.form-control:focus { border-color: #873260; }
.textarea { resize: vertical; min-height: 80px; }
.form-row { display: flex; gap: 1rem; }
.half-width { flex: 1; }
.select-wrapper { position: relative; display: flex; align-items: center; }
.select-wrapper .form-control { appearance: none; padding-left: 2rem; cursor: pointer; }
.select-wrapper .select-icon { position: absolute; left: 0.8rem; color: #9ca3af; pointer-events: none; }
.image-uploader { display: flex; flex-direction: column; gap: 0.8rem; }
.upload-box { border: 1.5px dashed #d1d5db; border-radius: 10px; padding: 1.5rem; text-align: center; cursor: pointer; transition: background 0.2s; background: #fafafa; }
.upload-box:hover { border-color: #873260; background: #fdfafb; }
.upload-box.disabled { cursor: not-allowed; opacity: 0.6; }
.hidden-input { display: none; }
.upload-box p { font-size: 0.85rem; font-weight: 600; color: #374151; margin: 0.5rem 0 0; }
.upload-box span { font-size: 0.75rem; color: #9ca3af; }
.preview-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.preview-item { width: 60px; height: 60px; border-radius: 6px; border: 1px solid #e5e7eb; position: relative; overflow: hidden; }
.preview-item img { width: 100%; height: 100%; object-fit: cover; }
.remove-img-btn { position: absolute; top: 2px; left: 2px; background: rgba(0,0,0,0.5); color: #fff; width: 16px; height: 16px; border-radius: 50%; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
.remove-img-btn:hover { background: #dc2626; }
.form-actions { margin-top: 2rem; display: flex; justify-content: center; gap: 0.75rem; }
.btn-submit { background: #873260; color: #fff; border: none; padding: 0.7rem 2rem; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
.btn-submit:hover:not(:disabled) { background: #6E1A41; }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-cancel { padding: 0.7rem 2rem; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: #f9fafb; }
.view-content { max-width: 500px; }
.no-padding-top { padding-top: 0 !important; overflow-x: hidden; overflow-y: auto; }
.floating-close { top: 1rem; left: 1rem; background: rgba(0,0,0,0.4); color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; z-index: 10; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.floating-close:hover { background: rgba(0,0,0,0.6); color: white; }
.view-image-slider { position: relative; width: calc(100% + 4rem); margin: 0 -2rem 1rem -2rem; height: 350px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.view-main-image { width: 100%; height: 100%; object-fit: cover; }
.slider-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; z-index: 2; font-size: 1rem; }
.slider-btn:hover { background: rgba(0,0,0,0.8); }
.prev-btn { left: 1rem; }
.next-btn { right: 1rem; }
.image-indicator { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 0.25rem 0.7rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 1px; backdrop-filter: blur(4px); }
.view-body-wrapper { padding: 0 0 0.5rem 0; }
.view-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; gap: 1rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 1.25rem; }
.view-title { font-size: 1.3rem; font-weight: 800; color: #111827; margin: 0 0 0.4rem 0; line-height: 1.3; }
.view-type-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.view-type-badge.news { background: #ecfdf5; color: #059669; }
.view-type-badge.event { background: #fefce8; color: #ca8a04; }
.view-status-badge { padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; display: inline-block; }
.view-status-badge.active { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.view-status-badge.inactive { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.view-meta-row { margin-bottom: 1.25rem; }
.view-date { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #6b7280; font-weight: 600; }
.view-sections { display: flex; flex-direction: column; gap: 0.6rem; border-top: 1px solid #f3f4f6; margin-bottom: 1.5rem; padding-top: 1.2rem; }
.v-section { background: #f9fafb; padding: 1.25rem; border-radius: 8px; border: 1px solid #f3f4f6; }
.v-section-title { font-size: 0.85rem; font-weight: 800; color: #111827; margin: 0 0 0.8rem 0; }
.v-section-content { font-size: 0.85rem; color: #4b5563; line-height: 1.7; font-weight: 500; }
.alert-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); padding: 0.75rem 1.5rem; border-radius: 30px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; opacity: 0; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: 'Cairo', sans-serif; }
.alert-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
.alert-toast.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.alert-toast.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.alert-icon { flex-shrink: 0; }
</style>
