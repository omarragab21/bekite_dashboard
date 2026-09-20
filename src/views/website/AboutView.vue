<template>
  <div class="about-view">
    <!-- Story Section -->
    <section class="story-section container">
      <h2 class="section-title">{{ t('about.story') }}</h2>
      <div class="story-content content-rich" v-html="formattedContent"></div>
    </section>

    <!-- Stats Section -->
    <!-- <section class="stats-section container">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">10,000+</span>
          <span class="stat-label">{{ t('about.happy_customers') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">500+</span>
          <span class="stat-label">{{ t('about.products_count') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">98%</span>
          <span class="stat-label">{{ t('about.customer_satisfaction') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">24/7</span>
          <span class="stat-label">{{ t('about.support') }}</span>
        </div>
      </div>
    </section> -->

    <div class="loading-state-fullscreen" v-if="loading">
       <div class="spinner"></div>
       <p>{{ t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '../../config/axios';
import { useLocalized } from '../../composables/useLocalized';

const { t } = useI18n();
const { localized } = useLocalized();
const page = ref(null);
const loading = ref(true);

const fetchAboutContent = async () => {
  loading.value = true;
  try {
    const res = await api.get('/frontend/topics?status=published');
    const topics = res.data.data || res.data || [];
    page.value = topics.find(t => 
      localized(t, 'title').includes('من نحن') || 
      localized(t, 'title').toLowerCase().includes('about')
    ) || null;
  } catch (err) {
    console.error('Failed to fetch About content', err);
  } finally {
    loading.value = false;
  }
};

import { sanitizeHtml } from '../../utils/sanitizer';

onMounted(fetchAboutContent);

const formattedContent = computed(() => {
  if (!page.value?.content) {
    return sanitizeHtml(t('about.default_story'));
  }
  return sanitizeHtml(localized(page.value, 'content'));
});
</script>

<style scoped>
.about-view {
  min-height: 80vh;
  background: #fff;
  padding: 120px 0 100px;
  font-family: 'Almarai', sans-serif;
}

@media (max-width: 1024px) {
  .about-view { padding-top: 40px !important; }
}

.container {
  max-width: 1300px !important;
  margin: 0 auto;
  padding: 0 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  text-align: center;
  margin-bottom: 25px;
  position: relative;
}

.section-subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 50px;
  font-size: 16px;
}

/* Story Section */
.story-section {
  margin-bottom: 120px;
  max-width: 900px !important;
}

.story-content {
  font-size: 18px;
  line-height: 2;
  color: #4b5563;
  text-align: center;
}

/* Values Section */
.values-section {
  margin-bottom: 120px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.value-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 20px;
  padding: 40px 25px;
  text-align: center;
  transition: all 0.3s;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
  border-color: #87326033;
}

.value-icon {
  width: 64px;
  height: 64px;
  background: #fdf2f8;
  color: #873260;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 25px;
  transition: all 0.3s;
}

.value-card:hover .value-icon {
  background: #873260;
  color: #fff;
}

.value-name {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12px;
}

.value-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  padding-bottom: 50px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-number {
  font-size: 42px;
  font-weight: 900;
  color: #873260;
}

.stat-label {
  font-size: 15px;
  font-weight: 700;
  color: #6b7280;
}

/* Loading state */
.loading-state-fullscreen {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #873260;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .values-grid, .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-title { font-size: 26px; }
  .story-content { font-size: 16px; }
  .stat-number { font-size: 32px; }
  .values-grid { grid-template-columns: 1fr; }
  .container { padding: 0 20px; }
}
</style>

