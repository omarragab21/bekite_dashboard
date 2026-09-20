<template>
  <router-view />
  <ToastNotification />
</template>

<script setup>
import { onMounted } from 'vue';
import ToastNotification from './components/common/ToastNotification.vue';

onMounted(() => {
  document.title = 'Be-Kite Hub | لوحة التحكم';
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
