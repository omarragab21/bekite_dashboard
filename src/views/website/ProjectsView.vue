<template>
  <div class="projects-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t('projects.title', 'المشاريع') }}</h1>
        <p class="page-subtitle">{{ t('projects.subtitle', 'اكتشف أحدث مشاريعنا') }}</p>
      </div>

      <!-- Categories Filter -->
      <div class="categories-filter" v-if="categories.length > 0">
        <button class="filter-btn" :class="{ active: !selectedCategory }" @click="selectedCategory = null">
          {{ t('projects.all', 'الكل') }}
        </button>
        <button class="filter-btn" v-for="cat in categories" :key="cat.id"
          :class="{ active: selectedCategory === cat.id }" @click="selectedCategory = cat.id">
          {{ cat.name }}
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid" v-if="!loading">
        <div v-if="filteredProjects.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <p>{{ t('projects.no_projects', 'لا توجد مشاريع متاحة') }}</p>
        </div>
        <router-link v-for="proj in filteredProjects" :key="proj.id" :to="`/project/${proj.id}`" class="project-card">
          <div class="project-image">
            <img v-if="proj.image" :src="proj.image" :alt="proj.name" />
            <div v-else class="placeholder-image">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </div>
          <div class="project-info">
            <h3 class="project-name">{{ proj.name }}</h3>
            <p class="project-desc" v-if="proj.description">{{ truncate(proj.description, 80) }}</p>
            <span class="project-category" v-if="proj.category">{{ proj.category }}</span>
          </div>
        </router-link>
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

const projects = ref([]);
const categories = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);

const filteredProjects = computed(() => {
  if (!selectedCategory.value) return projects.value;
  return projects.value.filter(p => p.category_id === selectedCategory.value);
});

const truncate = (text, max) => {
  if (!text) return '';
  return text.length > max ? text.substring(0, max) + '...' : text;
};

const fetchProjects = async () => {
  try {
    const res = await api.get('/frontend/projects?per_page=100');
    projects.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch projects', err);
  }
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/frontend/project-categories');
    categories.value = (res.data.data || []).filter(c => !c.parent_id && c.is_active);
  } catch (err) {
    console.error('Failed to fetch categories', err);
  }
};

onMounted(async () => {
  await Promise.all([fetchProjects(), fetchCategories()]);
  loading.value = false;
});
</script>

<style scoped>
.projects-view { padding: 3rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
.page-header { text-align: center; margin-bottom: 2.5rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
.page-subtitle { font-size: 1rem; color: #6b7280; }
.categories-filter { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
.filter-btn { padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-family: 'Cairo', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover { border-color: #873260; color: #873260; }
.filter-btn.active { background: #873260; color: #fff; border-color: #873260; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.project-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s; display: block; }
.project-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.project-image { width: 100%; height: 200px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
.project-image img { width: 100%; height: 100%; object-fit: cover; }
.placeholder-image { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.project-info { padding: 1.2rem; }
.project-name { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 0.4rem; line-height: 1.3; }
.project-desc { font-size: 0.8rem; color: #6b7280; margin: 0 0 0.6rem; line-height: 1.5; }
.project-category { display: inline-block; background: #fdf2f8; color: #873260; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; color: #9ca3af; }
.empty-state p { margin-top: 1rem; font-size: 0.9rem; }
.loading-state { display: flex; justify-content: center; padding: 4rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
