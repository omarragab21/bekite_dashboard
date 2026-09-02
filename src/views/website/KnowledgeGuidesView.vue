<template>
  <div class="knowledge-guides-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t('knowledge_guides.title', 'دليل المعرفة') }}</h1>
        <p class="page-subtitle">{{ t('knowledge_guides.subtitle', 'مكتبة الملفات والمستندات') }}</p>
      </div>

      <div class="type-filter" v-if="items.length > 0">
        <button class="filter-btn" :class="{ active: !selectedType }" @click="selectedType = null">{{ t('knowledge_guides.all', 'الكل') }}</button>
        <button class="filter-btn" :class="{ active: selectedType === 'pdf' }" @click="selectedType = 'pdf'">PDF</button>
        <button class="filter-btn" :class="{ active: selectedType === 'doc' }" @click="selectedType = 'doc'">Word</button>
        <button class="filter-btn" :class="{ active: selectedType === 'xls' }" @click="selectedType = 'xls'">Excel</button>
        <button class="filter-btn" :class="{ active: selectedType === 'ppt' }" @click="selectedType = 'ppt'">PowerPoint</button>
      </div>

      <div class="guides-list" v-if="!loading">
        <div v-if="filteredItems.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>{{ t('knowledge_guides.no_files', 'لا توجد ملفات متاحة') }}</p>
        </div>
        <div v-for="item in filteredItems" :key="item.id" class="guide-card">
          <div class="guide-icon" :class="item.file_type_icon">
            <svg v-if="item.file_type_icon === 'pdf'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <svg v-else-if="item.file_type_icon === 'doc'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <svg v-else-if="item.file_type_icon === 'xls'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="guide-info">
            <h3 class="guide-title">{{ item.title }}</h3>
            <div class="guide-meta">
              <span class="guide-type" :class="item.file_type_icon">{{ item.file_type_label }}</span>
              <span class="guide-size">{{ item.file_size_formatted }}</span>
            </div>
          </div>
          <a :href="item.file_url" target="_blank" class="guide-download">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {{ t('knowledge_guides.download', 'تحميل') }}
          </a>
        </div>
      </div>

      <div class="loading-state" v-else>
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '../../config/axios';

const { t, locale } = useI18n();
const currentLang = computed(() => locale.value);

const items = ref([]);
const loading = ref(true);
const selectedType = ref(null);

const filteredItems = computed(() => {
  if (!selectedType.value) return items.value;
  return items.value.filter(i => i.file_type_icon === selectedType.value);
});

onMounted(async () => {
  try {
    const res = await api.get('/frontend/knowledge-guides?per_page=100');
    items.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch knowledge guides', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.knowledge-guides-view { padding: 3rem 0; }
.container { max-width: 900px; margin: 0 auto; padding: 0 5%; }
.page-header { text-align: center; margin-bottom: 2.5rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
.page-subtitle { font-size: 1rem; color: #6b7280; }
.type-filter { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
.filter-btn { padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-family: 'Cairo', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover { border-color: #873260; color: #873260; }
.filter-btn.active { background: #873260; color: #fff; border-color: #873260; }
.guides-list { display: flex; flex-direction: column; gap: 1rem; }
.guide-card { display: flex; align-items: center; gap: 1.25rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; transition: transform 0.2s, box-shadow 0.2s; }
.guide-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.guide-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.guide-icon.pdf { background: #fef2f2; color: #dc2626; }
.guide-icon.doc { background: #eff6ff; color: #2563eb; }
.guide-icon.xls { background: #ecfdf5; color: #059669; }
.guide-icon.ppt { background: #fefce8; color: #ca8a04; }
.guide-icon.file { background: #f3f4f6; color: #6b7280; }
.guide-info { flex: 1; }
.guide-title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 0.4rem; line-height: 1.3; }
.guide-meta { display: flex; align-items: center; gap: 0.6rem; }
.guide-type { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
.guide-type.pdf { background: #fef2f2; color: #dc2626; }
.guide-type.doc { background: #eff6ff; color: #2563eb; }
.guide-type.xls { background: #ecfdf5; color: #059669; }
.guide-type.ppt { background: #fefce8; color: #ca8a04; }
.guide-type.file { background: #f3f4f6; color: #6b7280; }
.guide-size { font-size: 0.75rem; color: #9ca3af; }
.guide-download { display: inline-flex; align-items: center; gap: 0.4rem; background: #873260; color: #fff; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 600; font-family: 'Cairo', sans-serif; transition: background 0.2s; flex-shrink: 0; }
.guide-download:hover { background: #6E1A41; }
.empty-state { text-align: center; padding: 4rem; color: #9ca3af; }
.empty-state p { margin-top: 1rem; font-size: 0.9rem; }
.loading-state { display: flex; justify-content: center; padding: 4rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
