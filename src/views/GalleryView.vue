<template>
  <div class="gallery-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h2 class="page-title">معرض الصور و الفيديوهات</h2>
        <p class="page-subtitle">إدارة الصور و الفيديوهات</p>
      </div>
      <button class="add-btn" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة عنصر جديد
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon-wrapper total-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">إجمالي العناصر</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper active-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">عناصر نشطة</span>
          <span class="stat-value">{{ activeCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper image-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">صور</span>
          <span class="stat-value">{{ imageCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper video-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">فيديوهات</span>
          <span class="stat-value">{{ videoCount }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث عن عنصر..." class="search-input" />
      </div>
      <div class="filter-select">
        <select v-model="statusFilter" class="form-select">
          <option value="">جميع الحالات</option>
          <option value="true">نشط</option>
          <option value="false">غير نشط</option>
        </select>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="select-icon" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="filter-select">
        <select v-model="categoryFilter" class="form-select">
          <option value="">جميع التصنيفات</option>
          <option value="events">فعاليات</option>
          <option value="projects">مشاريع</option>
          <option value="products">منتجات</option>
          <option value="team">الفريق</option>
          <option value="other">أخرى</option>
        </select>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="select-icon" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="filter-select">
        <select v-model="mediaTypeFilter" class="form-select">
          <option value="">جميع الأنواع</option>
          <option value="image">صور</option>
          <option value="video">فيديوهات</option>
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
            <th class="col-media">العنصر</th>
            <th class="col-category">التصنيف</th>
            <th class="col-type">النوع</th>
            <th class="col-status">الحالة</th>
            <th class="col-actions">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="state-row"><td colspan="6">جاري التحميل...</td></tr>
          <tr v-else-if="filteredItems.length === 0" class="state-row"><td colspan="6">لا توجد عناصر مطابقة</td></tr>
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
              <td class="col-media">
                <div class="media-cell">
                  <div class="media-preview">
                    <img v-if="item.media_type === 'image' && item.image_url" :src="item.image_url" :alt="item.title" />
                    <div v-else-if="item.media_type === 'video' && item.video_thumbnail_url" class="video-thumbnail">
                      <img :src="item.video_thumbnail_url" alt="Video thumbnail" />
                      <div class="play-icon">▶</div>
                    </div>
                    <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div class="media-details">
                    <span class="media-title">{{ item.title_i18n?.ar || item.title }}</span>
                    <span class="media-desc">{{ truncateText(item.description_i18n?.ar || item.description, 50) }}</span>
                  </div>
                </div>
              </td>
              <td class="col-category">
                <span class="category-badge">{{ getCategoryLabel(item.category) }}</span>
              </td>
              <td class="col-type">
                <span class="type-badge" :class="item.media_type">
                  {{ item.media_type === 'image' ? 'صورة' : 'فيديو' }}
                </span>
              </td>
              <td class="col-status">
                <span class="status-badge" :class="item.is_active ? 'active' : 'inactive'">
                  {{ item.is_active ? 'نشط' : 'غير نشط' }}
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
        <h3 class="modal-title">{{ isEdit ? 'تعديل العنصر' : 'إضافة عنصر جديد' }}</h3>
        <p class="modal-subtitle">أدخل معلومات العنصر</p>

        <div class="i18n-toggle" role="tablist" aria-label="Language">
          <button type="button" class="i18n-btn" :class="{ active: activeLang === 'en' }" @click="activeLang = 'en'">English</button>
          <button type="button" class="i18n-btn" :class="{ active: activeLang === 'ar' }" @click="activeLang = 'ar'">العربية</button>
        </div>

        <form @submit.prevent="submitForm" class="gallery-form">
          <!-- Media Type -->
          <div class="form-group">
            <label class="form-label">نوع الوسائط <span class="req">*</span></label>
            <div class="media-type-selector">
              <button type="button" class="media-type-btn" :class="{ active: form.media_type === 'image' }" @click="form.media_type = 'image'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                صورة
              </button>
              <button type="button" class="media-type-btn" :class="{ active: form.media_type === 'video' }" @click="form.media_type = 'video'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                فيديو
              </button>
            </div>
          </div>

          <!-- Image Upload (for image type) -->
          <div class="form-group" v-if="form.media_type === 'image'">
            <label class="form-label">الصورة <span class="req">*</span></label>
            <div class="image-uploader">
              <div class="upload-box" @click="triggerImageInput" v-if="!selectedImage && !form.existing_image">
                <input type="file" ref="imageInput" @change="handleImageChange" accept="image/*" class="hidden-input" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>انقر لرفع صورة</p>
                <span>jpeg, png, jpg, gif, svg, webp (بحد أقصى 5 ميجابايت)</span>
              </div>
              <div class="image-preview" v-else>
                <img :src="selectedImage || form.existing_image" alt="Preview" class="preview-img" />
                <button type="button" class="change-image-btn" @click="clearImage">تغيير</button>
              </div>
            </div>
          </div>

          <!-- Video URL (for video type) -->
          <div class="form-group" v-if="form.media_type === 'video'">
            <label class="form-label">رابط الفيديو <span class="req">*</span></label>
            <input type="url" v-model="form.video_url" class="form-control" placeholder="https://youtube.com/watch?v=..." />
            <span class="form-hint">يدعم روابط YouTube و Vimeo</span>
          </div>

          <!-- Video Thumbnail (for video type) -->
          <div class="form-group" v-if="form.media_type === 'video'">
            <label class="form-label">صورة مصغرة للفيديو</label>
            <div class="image-uploader">
              <div class="upload-box" @click="triggerThumbnailInput" v-if="!selectedThumbnail && !form.existing_thumbnail">
                <input type="file" ref="thumbnailInput" @change="handleThumbnailChange" accept="image/*" class="hidden-input" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>انقر لرفع صورة مصغرة</p>
                <span>jpeg, png, jpg (بحد أقصى 5 ميجابايت)</span>
              </div>
              <div class="image-preview" v-else>
                <img :src="selectedThumbnail || form.existing_thumbnail" alt="Thumbnail" class="preview-img" />
                <button type="button" class="change-image-btn" @click="clearThumbnail">تغيير</button>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group" v-show="activeLang === 'ar'">
            <label class="form-label">العنوان (عربي) <span class="req">*</span></label>
            <input type="text" v-model="form.title_ar" class="form-control" placeholder="العنوان" />
          </div>
          <div class="form-group" v-show="activeLang === 'en'">
            <label class="form-label">العنوان (English) <span class="req">*</span></label>
            <input type="text" v-model="form.title_en" class="form-control" placeholder="Title" required />
          </div>

          <!-- Description -->
          <div class="form-group" v-show="activeLang === 'ar'">
            <label class="form-label">الوصف (عربي)</label>
            <textarea v-model="form.description_ar" class="form-control" rows="3" placeholder="الوصف"></textarea>
          </div>
          <div class="form-group" v-show="activeLang === 'en'">
            <label class="form-label">الوصف (English)</label>
            <textarea v-model="form.description_en" class="form-control" rows="3" placeholder="Description"></textarea>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label">التصنيف</label>
            <div class="select-wrapper">
              <select v-model="form.category" class="form-control">
                <option value="">بدون تصنيف</option>
                <option value="events">فعاليات</option>
                <option value="projects">مشاريع</option>
                <option value="products">منتجات</option>
                <option value="team">الفريق</option>
                <option value="other">أخرى</option>
              </select>
              <svg class="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
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

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'جاري الحفظ...' : (isEdit ? 'تعديل' : 'إضافة العنصر') }}
            </button>
          </div>
        </form>
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
import { ref, computed, onMounted, watch } from 'vue';
import api from '../config/axios';

const items = ref([]);
const loading = ref(false);
const draggedId = ref(null);
const dragOverId = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const categoryFilter = ref('');
const mediaTypeFilter = ref('');
const currentPage = ref(1);
const perPage = ref(15);
const totalCount = ref(0);

const totalItems = computed(() => totalCount.value);
const activeCount = computed(() => items.value.filter(i => i.is_active).length);
const imageCount = computed(() => items.value.filter(i => i.media_type === 'image').length);
const videoCount = computed(() => items.value.filter(i => i.media_type === 'video').length);
const totalPages = computed(() => Math.ceil(totalCount.value / perPage.value));
const filteredItems = computed(() => items.value);

const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg; alertType.value = type; showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3000);
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getCategoryLabel = (category) => {
  const labels = {
    events: 'فعاليات',
    projects: 'مشاريع',
    products: 'منتجات',
    team: 'الفريق',
    other: 'أخرى'
  };
  return labels[category] || 'بدون تصنيف';
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
    await api.post('/dashboard/galleries/reorder', { items: current.map(i => ({ id: i.id, sort_order: i.sort_order })) });
    triggerAlert('تم تحديث الترتيب بنجاح');
  } catch (err) {
    triggerAlert('فشل حفظ الترتيب', 'error');
    fetchItems();
  }
};

const fetchItems = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, per_page: perPage.value };
    if (statusFilter.value !== '') params.is_active = statusFilter.value === 'true' ? 1 : 0;
    if (categoryFilter.value) params.category = categoryFilter.value;
    if (mediaTypeFilter.value) params.media_type = mediaTypeFilter.value;
    if (searchQuery.value) params.search = searchQuery.value;
    const res = await api.get('/dashboard/galleries', { params });
    items.value = res.data.data;
    totalCount.value = res.data.meta?.total || res.data.data?.length || 0;
  } catch (err) {
    triggerAlert('فشل استيراد البيانات', 'error');
  } finally { loading.value = false; }
};

let searchDebounceTimer = null;
watch([statusFilter, categoryFilter, mediaTypeFilter], () => { currentPage.value = 1; fetchItems(); });
watch(searchQuery, () => { clearTimeout(searchDebounceTimer); searchDebounceTimer = setTimeout(() => { currentPage.value = 1; fetchItems(); }, 400); });

onMounted(() => { fetchItems(); });

const showFormModal = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);
const imageInput = ref(null);
const thumbnailInput = ref(null);
const activeLang = ref('ar');
const selectedImage = ref('');
const selectedThumbnail = ref('');

const form = ref({
  title_ar: '', title_en: '', description_ar: '', description_en: '', 
  media_type: 'image', category: '', is_active: true, sort_order: 1,
  video_url: '', existing_image: null, existing_thumbnail: null
});

const openAddModal = () => {
  isEdit.value = false; editingId.value = null; activeLang.value = 'ar';
  selectedImage.value = ''; selectedThumbnail.value = '';
  form.value = {
    title_ar: '', title_en: '', description_ar: '', description_en: '', 
    media_type: 'image', category: '', is_active: true, sort_order: 1,
    video_url: '', existing_image: null, existing_thumbnail: null
  };
  showFormModal.value = true;
};

const openEditModal = (item) => {
  isEdit.value = true; editingId.value = item.id; activeLang.value = 'ar';
  selectedImage.value = ''; selectedThumbnail.value = '';
  form.value = {
    title_ar: (item.title_i18n && typeof item.title_i18n === 'object' ? (item.title_i18n.ar ?? item.title) : item.title) || '',
    title_en: (item.title_i18n && typeof item.title_i18n === 'object' ? (item.title_i18n.en ?? '') : ''),
    description_ar: (item.description_i18n && typeof item.description_i18n === 'object' ? (item.description_i18n.ar ?? item.description) : item.description) || '',
    description_en: (item.description_i18n && typeof item.description_i18n === 'object' ? (item.description_i18n.en ?? '') : ''),
    media_type: item.media_type || 'image',
    category: item.category || '',
    is_active: item.is_active,
    sort_order: item.sort_order ?? 1,
    video_url: item.video_url || '',
    existing_image: item.image_url || null,
    existing_thumbnail: item.video_thumbnail_url || null
  };
  showFormModal.value = true;
};

const closeModal = () => { showFormModal.value = false; };

const triggerImageInput = () => { imageInput.value.click(); };
const triggerThumbnailInput = () => { thumbnailInput.value.click(); };

const handleImageChange = (e) => {
  const file = e.target.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { triggerAlert('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت', 'error'); e.target.value = ''; return; }
  selectedImage.value = URL.createObjectURL(file);
  form.value.image = file;
  e.target.value = null;
};

const handleThumbnailChange = (e) => {
  const file = e.target.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { triggerAlert('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت', 'error'); e.target.value = ''; return; }
  selectedThumbnail.value = URL.createObjectURL(file);
  form.value.video_thumbnail = file;
  e.target.value = null;
};

const clearImage = () => { selectedImage.value = ''; form.value.image = null; form.value.existing_image = null; };
const clearThumbnail = () => { selectedThumbnail.value = ''; form.value.video_thumbnail = null; form.value.existing_thumbnail = null; };

const submitForm = async () => {
  if (form.value.media_type === 'image' && !form.value.image && !form.value.existing_image) { triggerAlert('الصورة مطلوبة', 'error'); return; }
  if (form.value.media_type === 'video' && !String(form.value.video_url || '').trim()) { triggerAlert('رابط الفيديو مطلوب', 'error'); return; }

  isSubmitting.value = true;
  const fd = new FormData();
  fd.append('title[ar]', form.value.title_ar || '');
  fd.append('title[en]', form.value.title_en || '');
  fd.append('description[ar]', form.value.description_ar || '');
  fd.append('description[en]', form.value.description_en || '');
  fd.append('media_type', form.value.media_type);
  fd.append('category', form.value.category || '');
  fd.append('is_active', form.value.is_active ? 1 : 0);
  fd.append('sort_order', form.value.sort_order ?? 1);
  if (form.value.media_type === 'image' && form.value.image) fd.append('image', form.value.image);
  if (form.value.media_type === 'video') {
    fd.append('video_url', form.value.video_url || '');
    if (form.value.video_thumbnail) fd.append('video_thumbnail', form.value.video_thumbnail);
  }

  try {
    if (isEdit.value) {
      fd.append('_method', 'PUT');
      await api.post(`/dashboard/galleries/${editingId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      triggerAlert('تم التحديث بنجاح');
    } else {
      await api.post('/dashboard/galleries', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      await api.delete(`/dashboard/galleries/${item.id}`);
      triggerAlert('تم الحذف بنجاح'); fetchItems();
    } catch (err) { triggerAlert('فشل عملية الحذف', 'error'); }
  }
};
</script>

<style scoped>
.gallery-page { display: flex; flex-direction: column; gap: 1.5rem; direction: rtl; font-family: 'Cairo', sans-serif; padding-bottom: 2rem; }
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
.image-icon { background: #eff6ff; color: #2563eb; }
.video-icon { background: #fef3c7; color: #d97706; }
.filters-row { display: flex; gap: 0.75rem; align-items: center; }
.search-box { flex: 1; position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; right: 1rem; color: #9ca3af; }
.search-input { width: 100%; padding: 0.7rem 2.8rem 0.7rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; outline: none; background: #fff; transition: border-color 0.2s; }
.search-input:focus { border-color: #873260; }
.filter-select { position: relative; display: flex; align-items: center; min-width: 140px; }
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
.col-media { text-align: right; width: 35%; }
.col-category { text-align: center; width: 12%; }
.col-type { text-align: center; width: 10%; }
.col-status { text-align: center; width: 12%; }
.col-actions { text-align: left; width: 15%; padding-left: 1.5rem !important; }
.media-cell { display: flex; align-items: center; gap: 1rem; }
.media-preview { width: 64px; height: 64px; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #f3f4f6; position: relative; }
.media-preview img { width: 100%; height: 100%; object-fit: cover; }
.video-thumbnail { position: relative; width: 100%; height: 100%; }
.video-thumbnail .play-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: rgba(255,255,255,0.9); background: rgba(0,0,0,0.3); }
.media-details { display: flex; flex-direction: column; align-items: flex-start; }
.media-title { font-weight: 700; color: #111827; font-size: 0.9rem; margin-bottom: 0.2rem; }
.media-desc { font-size: 0.75rem; color: #9ca3af; }
.category-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; background: #f3f4f6; color: #6b7280; }
.type-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.type-badge.image { background: #eff6ff; color: #2563eb; }
.type-badge.video { background: #fef3c7; color: #d97706; }
.status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.status-badge.active { background: #ecfdf5; color: #059669; }
.status-badge.inactive { background: #fef2f2; color: #dc2626; }
.actions-group { display: flex; align-items: center; justify-content: flex-start; gap: 0.4rem; }
.action-btn { width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9ca3af; transition: all 0.2s; }
.action-btn:hover { background: #f3f4f6; }
.delete-btn:hover { color: #dc2626; background: #fef2f2; }
.edit-btn:hover { color: #2563eb; background: #eff6ff; }
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
.modal-content { background: #fff; border-radius: 12px; width: 100%; max-width: 500px; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto; }
.form-content { max-width: 550px; }
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
.form-hint { display: block; font-size: 0.7rem; color: #9ca3af; margin-top: 0.2rem; }
.form-control { width: 100%; padding: 0.65rem 0.8rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #1f2937; outline: none; transition: border-color 0.2s; text-align: right; }
.form-control:focus { border-color: #873260; }
select.form-control { cursor: pointer; }
.select-wrapper { position: relative; display: flex; align-items: center; }
.select-wrapper .form-control { appearance: none; padding-left: 2rem; cursor: pointer; }
.select-wrapper .select-icon { position: absolute; left: 0.8rem; color: #9ca3af; pointer-events: none; }
.media-type-selector { display: flex; gap: 0.5rem; }
.media-type-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.6rem; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; cursor: pointer; transition: all 0.2s; font-family: 'Cairo', sans-serif; font-size: 0.85rem; color: #6b7280; }
.media-type-btn:hover { border-color: #873260; }
.media-type-btn.active { background: #873260; color: #fff; border-color: #873260; }
.image-uploader { display: flex; flex-direction: column; gap: 0.8rem; }
.upload-box { border: 1.5px dashed #d1d5db; border-radius: 10px; padding: 2rem; text-align: center; cursor: pointer; transition: background 0.2s; background: #fafafa; }
.upload-box:hover { border-color: #873260; background: #fdfafb; }
.hidden-input { display: none; }
.upload-box p { font-size: 0.85rem; font-weight: 600; color: #374151; margin: 0.8rem 0 0.2rem; }
.upload-box span { font-size: 0.75rem; color: #9ca3af; }
.image-preview { position: relative; border-radius: 10px; overflow: hidden; }
.preview-img { width: 100%; max-height: 250px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 10px; }
.change-image-btn { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #fff; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-family: 'Cairo', sans-serif; font-size: 0.8rem; cursor: pointer; transition: background 0.2s; }
.change-image-btn:hover { background: rgba(0,0,0,0.85); }
.form-actions { margin-top: 2rem; display: flex; justify-content: center; gap: 0.75rem; }
.btn-submit { background: #873260; color: #fff; border: none; padding: 0.7rem 2rem; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; }
.btn-submit:hover:not(:disabled) { background: #6E1A41; }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-cancel { padding: 0.7rem 2rem; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: #f9fafb; }
.alert-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); padding: 0.75rem 1.5rem; border-radius: 30px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; opacity: 0; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: 'Cairo', sans-serif; }
.alert-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
.alert-toast.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.alert-toast.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.alert-icon { flex-shrink: 0; }
</style>
