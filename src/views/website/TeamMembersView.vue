<template>
  <div class="team-members-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t('team.title', 'فريقنا') }}</h1>
        <p class="page-subtitle">{{ t('team.subtitle', 'تعرف على فريق العمل') }}</p>
      </div>

      <div class="team-grid" v-if="!loading">
        <div v-if="items.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p>{{ t('team.no_members', 'لا يوجد أعضاء للعرض') }}</p>
        </div>
        <div v-for="member in items" :key="member.id" class="member-card">
          <div class="member-image">
            <img v-if="member.image" :src="member.image" :alt="member.name" />
            <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="member-info">
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-job">{{ member.job_title }}</p>
          </div>
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

onMounted(async () => {
  try {
    const res = await api.get('/frontend/team-members?per_page=100');
    items.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch team members', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.team-members-view { padding: 3rem 0; }
.container { max-width: 900px; margin: 0 auto; padding: 0 5%; }
.page-header { text-align: center; margin-bottom: 3rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
.page-subtitle { font-size: 1rem; color: #6b7280; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
.member-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
.member-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.member-image { width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f3f4f6; }
.member-image img { width: 100%; height: 100%; object-fit: cover; }
.member-info { display: flex; flex-direction: column; }
.member-name { font-size: 1rem; font-weight: 700; color: #111827; margin: 0 0 0.4rem; }
.member-job { font-size: 0.85rem; color: #6b7280; margin: 0; }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; color: #9ca3af; }
.empty-state p { margin-top: 1rem; font-size: 0.9rem; }
.loading-state { display: flex; justify-content: center; padding: 4rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(135, 50, 96, 0.1); border-top-color: #873260; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
