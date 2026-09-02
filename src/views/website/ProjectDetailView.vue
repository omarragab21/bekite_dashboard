<template>
  <div class="project-detail-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container" v-if="project">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">{{ t('nav.home', 'الرئيسية') }}</router-link>
        <span class="sep">/</span>
        <router-link to="/projects">{{ t('nav.projects', 'المشاريع') }}</router-link>
        <span class="sep">/</span>
        <span class="current">{{ project.name }}</span>
      </nav>

      <!-- Project Header -->
      <div class="project-header">
        <h1 class="project-title">{{ project.name }}</h1>
        <span class="project-status" :class="project.status">{{ project.status === 'active' ? 'نشط' : 'غير نشط' }}</span>
      </div>

      <!-- Image Gallery -->
      <div class="image-gallery" v-if="project.images?.length">
        <div class="main-image">
          <img :src="project.images[currentImageIdx]" :alt="project.name" />
          <button v-if="project.images.length > 1" class="gallery-nav prev" @click="prevImage">&#10095;</button>
          <button v-if="project.images.length > 1" class="gallery-nav next" @click="nextImage">&#10094;</button>
        </div>
        <div class="thumbnails" v-if="project.images.length > 1">
          <img v-for="(img, idx) in project.images" :key="idx" :src="img"
            :class="{ active: currentImageIdx === idx }" @click="currentImageIdx = idx" />
        </div>
      </div>

      <!-- Project Info -->
      <div class="project-content">
        <div class="info-section" v-if="project.description">
          <h2 class="section-title">{{ t('project.about', 'نبذة عن المشروع') }}</h2>
          <div class="section-body" style="white-space: pre-wrap;">{{ project.description }}</div>
        </div>

        <div class="info-section" v-if="project.features">
          <h2 class="section-title">{{ t('project.features', 'المميزات الرئيسية') }}</h2>
          <div class="section-body">
            <ul class="feature-list">
              <li v-for="(feature, idx) in project.features.split('\n')" :key="idx" v-show="feature.trim()">
                {{ feature.replace(/^[-*•]\s*/, '').trim() }}
              </li>
            </ul>
          </div>
        </div>

        <div class="info-section" v-if="project.videos?.length">
          <h2 class="section-title">{{ t('project.videos', 'الفيديوهات') }}</h2>
          <div class="videos-grid">
            <div v-for="(video, idx) in project.videos" :key="idx" class="video-wrapper">
              <iframe v-if="getEmbedUrl(video)" :src="getEmbedUrl(video)" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
              <a v-else :href="video" target="_blank" class="video-link-fallback">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20.54 12 20.54 12 20.54s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
                {{ t('project.watch_video', 'شاهد الفيديو') }} {{ idx + 1 }}
              </a>
            </div>
          </div>
        </div>
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

const project = ref(null);
const currentImageIdx = ref(0);

const prevImage = () => {
  if (currentImageIdx.value > 0) currentImageIdx.value--;
  else currentImageIdx.value = (project.value?.images?.length || 1) - 1;
};
const nextImage = () => {
  const max = (project.value?.images?.length || 1) - 1;
  if (currentImageIdx.value < max) currentImageIdx.value++;
  else currentImageIdx.value = 0;
};

const getEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
  return null;
};

const fetchProject = async () => {
  try {
    const res = await api.get(`/frontend/projects/${route.params.id}`);
    project.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch project', err);
  }
};

onMounted(() => { fetchProject(); });
</script>

<style scoped>
.project-detail-view { padding: 2rem 0 4rem; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 5%; }
.breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: #6b7280; }
.breadcrumb a { color: #873260; text-decoration: none; font-weight: 600; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb .sep { color: #d1d5db; }
.breadcrumb .current { color: #111827; font-weight: 600; }
.project-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.project-title { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0; }
.project-status { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
.project-status.active { background: #ecfdf5; color: #059669; }
.project-status.inactive { background: #fef2f2; color: #dc2626; }
.image-gallery { margin-bottom: 2.5rem; }
.main-image { position: relative; width: 100%; height: 450px; border-radius: 12px; overflow: hidden; background: #f3f4f6; }
.main-image img { width: 100%; height: 100%; object-fit: cover; }
.gallery-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s; }
.gallery-nav:hover { background: rgba(0,0,0,0.8); }
.gallery-nav.prev { left: 1rem; }
.gallery-nav.next { right: 1rem; }
.thumbnails { display: flex; gap: 0.6rem; margin-top: 1rem; }
.thumbnails img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid transparent; opacity: 0.5; transition: all 0.2s; }
.thumbnails img.active { border-color: #873260; opacity: 1; }
.thumbnails img:hover { opacity: 1; }
.project-content { display: flex; flex-direction: column; gap: 2rem; }
.info-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; }
.section-title { font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0 0 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f3f4f6; }
.section-body { font-size: 0.9rem; color: #4b5563; line-height: 1.8; }
.feature-list { margin: 0; padding-right: 1.2rem; list-style-type: disc; }
.feature-list li { margin-bottom: 0.4rem; }
.videos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 8px; overflow: hidden; background: #f3f4f6; }
.video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
.video-link-fallback { display: flex; align-items: center; justify-content: center; gap: 0.5rem; position: absolute; inset: 0; color: #dc2626; text-decoration: none; font-weight: 600; }
.loading-state { display: flex; justify-content: center; padding: 6rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
