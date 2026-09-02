<template>
  <div class="news-events-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t('news_events.title', 'الأخبار والفعاليات') }}</h1>
        <p class="page-subtitle">{{ t('news_events.subtitle', 'تابع أحدث الأخبار والفعاليات') }}</p>
      </div>

      <div class="type-filter" v-if="items.length > 0">
        <button class="filter-btn" :class="{ active: !selectedType }" @click="selectedType = null">{{ t('news_events.all', 'الكل') }}</button>
        <button class="filter-btn" :class="{ active: selectedType === 'news' }" @click="selectedType = 'news'">{{ t('news_events.news', 'أخبار') }}</button>
        <button class="filter-btn" :class="{ active: selectedType === 'event' }" @click="selectedType = 'event'">{{ t('news_events.events', 'فعاليات') }}</button>
      </div>

      <div class="items-grid" v-if="!loading">
        <div v-if="filteredItems.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          <p>{{ t('news_events.no_items', 'لا توجد نتائج') }}</p>
        </div>
        <router-link v-for="item in filteredItems" :key="item.id" :to="`/news-event/${item.id}`" class="item-card">
          <div class="item-image">
            <img v-if="item.image" :src="item.image" :alt="item.title" />
            <div v-else class="placeholder-image">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </div>
          <div class="item-info">
            <div class="item-meta">
              <span class="type-badge" :class="item.type">{{ item.type === 'event' ? 'فعالية' : 'خبر' }}</span>
              <span class="date">{{ item.event_date_display }}</span>
            </div>
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-desc" v-if="item.description">{{ truncate(item.description, 100) }}</p>
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

const items = ref([]);
const loading = ref(true);
const selectedType = ref(null);

const filteredItems = computed(() => {
  if (!selectedType.value) return items.value;
  return items.value.filter(i => i.type === selectedType.value);
});

const truncate = (text, max) => {
  if (!text) return '';
  return text.length > max ? text.substring(0, max) + '...' : text;
};

onMounted(async () => {
  try {
    const res = await api.get('/frontend/news-events?per_page=100');
    items.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch news/events', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.news-events-view { padding: 3rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
.page-header { text-align: center; margin-bottom: 2.5rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
.page-subtitle { font-size: 1rem; color: #6b7280; }
.type-filter { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
.filter-btn { padding: 0.5rem 1.2rem; border-radius: 20px; border: 1px solid #e5e7eb; background: #fff; color: #374151; font-family: 'Cairo', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover { border-color: #873260; color: #873260; }
.filter-btn.active { background: #873260; color: #fff; border-color: #873260; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.item-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s; display: block; }
.item-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.item-image { width: 100%; height: 200px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
.item-image img { width: 100%; height: 100%; object-fit: cover; }
.placeholder-image { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.item-info { padding: 1.2rem; }
.item-meta { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; }
.type-badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
.type-badge.news { background: #ecfdf5; color: #059669; }
.type-badge.event { background: #fefce8; color: #ca8a04; }
.date { font-size: 0.75rem; color: #9ca3af; }
.item-title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 0.4rem; line-height: 1.3; }
.item-desc { font-size: 0.8rem; color: #6b7280; margin: 0; line-height: 1.5; }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; color: #9ca3af; }
.empty-state p { margin-top: 1rem; font-size: 0.9rem; }
.loading-state { display: flex; justify-content: center; padding: 4rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
