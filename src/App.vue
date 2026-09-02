<template>
  <router-view />
  <ToastNotification />
</template>

<script setup>
import { onMounted } from 'vue';
import ToastNotification from './components/common/ToastNotification.vue';
import api from './config/axios';

onMounted(async () => {
  try {
    const res = await api.get('/frontend/settings');
    const settings = res.data.data || res.data;
    const siteName = settings.find(s => s.key === 'site_name')?.value || settings.site_name || 'Dashboard';
    document.title = siteName;
  } catch (error) {
    console.error('Failed to load site name from settings:', error);
    document.title = 'Dashboard';
  }
});
</script>

<style>
@media (min-width: 1000px) {
  .page-title {
    margin-top: 50px;
  }
}
</style>

<style scoped>
</style>
