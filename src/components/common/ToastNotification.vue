<template>
  <div class="toast-container" dir="rtl">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="'toast-' + toast.type"
        @click="removeToast(toast.id)"
      >
        <!-- Icon -->
        <span class="toast-icon">
          <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg v-else-if="toast.type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </span>

        <span class="toast-msg">{{ toast.message }}</span>

        <button class="toast-close" @click.stop="removeToast(toast.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast';

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  pointer-events: none;
  max-width: 400px;
  width: calc(100% - 48px);
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #1f2937);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.25s ease;
}

.toast-success {
  border-left: 4px solid #10b981;
}
.toast-success .toast-icon {
  color: #10b981;
}

.toast-error {
  border-left: 4px solid #dc2626;
}
.toast-error .toast-icon {
  color: #dc2626;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}
.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info {
  border-left: 4px solid #4f008c;
}
.toast-info .toast-icon {
  color: #4f008c;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-msg {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted, #9ca3af);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
}
.toast-close:hover {
  color: var(--text-main, #1f2937);
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
</style>
