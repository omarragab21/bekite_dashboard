<template>
  <div class="dynamic-pages-view" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">إدارة الصفحات والمحتوى التعريفي (Content & Legal Pages)</h1>
        <p class="page-subtitle">تعديل محتوى من نحن (About Be Kite)، سياسة الخصوصية، الشروط والأحكام، وسياسات المنظومة</p>
      </div>
      <button class="btn-save-all" @click="saveActivePage" :disabled="saving">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
        </svg>
        {{ saving ? 'جاري الحفظ...' : 'حفظ الصفحة الحالية' }}
      </button>
    </div>

    <!-- Page Selector Tabs -->
    <div class="pages-tabs">
      <button
        v-for="page in pages"
        :key="page.slug"
        class="page-tab-btn"
        :class="{ active: activeSlug === page.slug }"
        @click="activeSlug = page.slug"
      >
        <span class="tab-title">{{ page.title }}</span>
        <span class="tab-slug">/{{ page.slug }}</span>
      </button>
    </div>

    <!-- Active Page Editor Card -->
    <div v-if="currentPage" class="editor-card">
      <div class="editor-header">
        <div class="editor-titles">
          <h2 class="editor-title">{{ currentPage.title }}</h2>
          <span class="editor-slug ltr-text">Slug: /{{ currentPage.slug }}</span>
        </div>
        <div class="editor-actions">
          <span v-if="lastSavedTime" class="saved-indicator">تم الحفظ: {{ lastSavedTime }}</span>
        </div>
      </div>

      <div class="editor-body">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">عنوان الصفحة (بالعربية)</label>
            <input type="text" v-model="currentPage.title" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">عنوان الصفحة (English)</label>
            <input type="text" v-model="currentPage.title_en" class="form-input ltr-text" />
          </div>
        </div>

        <!-- If About Page: Show Sections -->
        <template v-if="currentPage.slug === 'about'">
          <div class="section-divider"><span>أقسام قصة المنظومة والرؤية</span></div>
          <div class="form-group">
            <label class="form-label">مقدمة ورؤية Be Kite</label>
            <textarea v-model="currentPage.content.hero_intro" class="form-textarea" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">قصة المنظومة والنشأة</label>
            <textarea v-model="currentPage.content.story" class="form-textarea" rows="4"></textarea>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">رسالة الشركة (Mission)</label>
              <textarea v-model="currentPage.content.mission" class="form-textarea" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">رؤية الشركة (Vision)</label>
              <textarea v-model="currentPage.content.vision" class="form-textarea" rows="3"></textarea>
            </div>
          </div>
        </template>

        <!-- If Legal Policy Page: Markdown / Rich Text Content -->
        <template v-else>
          <div class="form-group">
            <label class="form-label">نص السياسة والشروط (بالعربية)</label>
            <textarea v-model="currentPage.content_ar" class="form-textarea large-area" rows="12"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">نص السياسة والشروط (English)</label>
            <textarea v-model="currentPage.content_en" class="form-textarea large-area ltr-text" rows="10"></textarea>
          </div>
        </template>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">عنوان الـ SEO (Meta Title)</label>
            <input type="text" v-model="currentPage.meta_title" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">وصف الـ SEO (Meta Description)</label>
            <input type="text" v-model="currentPage.meta_description" class="form-input" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ContentService } from '../services/ContentService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const pages = ref([]);
const activeSlug = ref('about');
const lastSavedTime = ref('');

const currentPage = computed(() => {
  return pages.value.find(p => p.slug === activeSlug.value) || pages.value[0];
});

const fetchPages = async () => {
  loading.value = true;
  try {
    pages.value = await ContentService.getPages();
    if (pages.value.length > 0 && !activeSlug.value) {
      activeSlug.value = pages.value[0].slug;
    }
  } catch (err) {
    console.error('Failed to fetch dynamic pages', err);
    toastError('تعذر تحميل الصفحات');
  } finally {
    loading.value = false;
  }
};

const saveActivePage = async () => {
  if (!currentPage.value) return;
  saving.value = true;
  try {
    await ContentService.updatePage(currentPage.value.id || currentPage.value.slug, currentPage.value);
    lastSavedTime.value = new Date().toLocaleTimeString('ar-SA');
    success(`تم حفظ صفحة "${currentPage.value.title_ar || currentPage.value.title}" بنجاح`);
  } catch (err) {
    console.error('Failed to save page content', err);
    toastError('حدث خطأ أثناء حفظ الصفحة');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchPages();
});
</script>

<style scoped>
.dynamic-pages-view {
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

.btn-save-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  transition: transform 0.15s ease;
}
.btn-save-all:hover { transform: translateY(-2px); }

/* Tabs */
.pages-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-tab-btn {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  cursor: pointer;
  text-align: right;
  transition: all 0.15s ease;
}
.page-tab-btn.active {
  border-color: #7c3aed;
  background: linear-gradient(135deg, rgba(79, 0, 140, 0.08), rgba(124, 58, 237, 0.12));
}

.tab-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-main);
}
.page-tab-btn.active .tab-title { color: #7c3aed; }

.tab-slug {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: monospace;
}

/* Editor Card */
.editor-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.editor-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
}

.editor-slug {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.saved-indicator {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 700;
}

.editor-body {
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
  line-height: 1.5;
}

.large-area {
  font-family: inherit;
}

.section-divider {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  color: #7c3aed;
  font-size: 0.82rem;
  font-weight: 800;
}
.section-divider span {
  background: rgba(124, 58, 237, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
}
</style>
