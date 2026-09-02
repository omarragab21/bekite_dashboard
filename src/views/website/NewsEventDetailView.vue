<template>
  <div class="news-event-detail-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container" v-if="item">
      <nav class="breadcrumb">
        <router-link to="/">{{ t('nav.home', 'الرئيسية') }}</router-link>
        <span class="sep">/</span>
        <router-link to="/news-events">{{ t('nav.news_events', 'الأخبار والفعاليات') }}</router-link>
        <span class="sep">/</span>
        <span class="current">{{ item.title }}</span>
      </nav>

      <div class="item-header">
        <span class="item-type-badge" :class="item.type">{{ item.type === 'event' ? 'فعالية' : 'خبر' }}</span>
        <h1 class="item-title">{{ item.title }}</h1>
        <div class="item-meta-bar">
          <span class="item-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ item.event_date_display }}
          </span>
        </div>
      </div>

      <div class="image-gallery" v-if="item.images?.length">
        <div class="main-image">
          <img :src="item.images[currentImageIdx]" :alt="item.title" />
          <button v-if="item.images.length > 1" class="gallery-nav prev" @click="prevImage">&#10095;</button>
          <button v-if="item.images.length > 1" class="gallery-nav next" @click="nextImage">&#10094;</button>
        </div>
        <div class="thumbnails" v-if="item.images.length > 1">
          <img v-for="(img, idx) in item.images" :key="idx" :src="img" :class="{ active: currentImageIdx === idx }" @click="currentImageIdx = idx" />
        </div>
      </div>

      <div class="item-content" v-if="item.description">
        <h2 class="section-title">{{ t('news_events.description', 'التفاصيل') }}</h2>
        <div class="section-body" style="white-space: pre-wrap;">{{ item.description }}</div>
      </div>
    </div>

    <div class="loading-state" v-else>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '../../config/axios';

const route = useRoute();
const { t, locale } = useI18n();
const currentLang = computed(() => locale.value);

const item = ref(null);
const currentImageIdx = ref(0);

const prevImage = () => {
  if (currentImageIdx.value > 0) currentImageIdx.value--;
  else currentImageIdx.value = (item.value?.images?.length || 1) - 1;
};
const nextImage = () => {
  const max = (item.value?.images?.length || 1) - 1;
  if (currentImageIdx.value < max) currentImageIdx.value++;
  else currentImageIdx.value = 0;
};

onMounted(async () => {
  try {
    const res = await api.get(`/frontend/news-events/${route.params.id}`);
    item.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch news/event', err);
  }
});
</script>

<style scoped>
.news-event-detail-view { padding: 2rem 0 4rem; }
.container { max-width: 900px; margin: 0 auto; padding: 0 5%; }
.breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: #6b7280; }
.breadcrumb a { color: #873260; text-decoration: none; font-weight: 600; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb .sep { color: #d1d5db; }
.breadcrumb .current { color: #111827; font-weight: 600; }
.item-header { margin-bottom: 2rem; }
.item-type-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem; }
.item-type-badge.news { background: #ecfdf5; color: #059669; }
.item-type-badge.event { background: #fefce8; color: #ca8a04; }
.item-title { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0 0 0.75rem; line-height: 1.3; }
.item-meta-bar { display: flex; align-items: center; gap: 1rem; }
.item-date { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; color: #6b7280; font-weight: 600; }
.image-gallery { margin-bottom: 2.5rem; }
.main-image { position: relative; width: 100%; height: 400px; border-radius: 12px; overflow: hidden; background: #f3f4f6; }
.main-image img { width: 100%; height: 100%; object-fit: cover; }
.gallery-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s; }
.gallery-nav:hover { background: rgba(0,0,0,0.8); }
.gallery-nav.prev { left: 1rem; }
.gallery-nav.next { right: 1rem; }
.thumbnails { display: flex; gap: 0.6rem; margin-top: 1rem; }
.thumbnails img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid transparent; opacity: 0.5; transition: all 0.2s; }
.thumbnails img.active { border-color: #873260; opacity: 1; }
.thumbnails img:hover { opacity: 1; }
.item-content { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; }
.section-title { font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0 0 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f3f4f6; }
.section-body { font-size: 0.95rem; color: #4b5563; line-height: 1.8; }
.loading-state { display: flex; justify-content: center; padding: 6rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
