<template>
  <BaseModal
    :model-value="modelValue"
    :title="title || 'تأكيد الإجراء'"
    max-width="440px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #icon>
      <div class="confirm-icon-box" :class="isDanger ? 'box-danger' : 'box-warning'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
    </template>

    <div class="confirm-content">
      <p class="confirm-message">{{ message }}</p>
      <span v-if="detail" class="confirm-detail">{{ detail }}</span>
    </div>

    <template #footer>
      <button class="btn-cancel" @click="$emit('update:modelValue', false)">
        {{ cancelText || 'إلغاء' }}
      </button>
      <button
        class="btn-confirm"
        :class="isDanger ? 'btn-danger' : 'btn-primary'"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        <span v-if="loading" class="spinner-sm"></span>
        <span>{{ confirmText || 'تأكيد' }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
  modelValue: Boolean,
  title: String,
  message: {
    type: String,
    default: 'هل أنت متأكد من تنفيذ هذا الإجراء؟ لا يمكن التراجع عن هذه العملية.',
  },
  detail: String,
  confirmText: String,
  cancelText: String,
  isDanger: {
    type: Boolean,
    default: true,
  },
  loading: Boolean,
});

defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
.confirm-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box-danger {
  background: rgba(220, 38, 38, 0.12);
  color: #dc2626;
}
.box-warning {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.confirm-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.confirm-message {
  font-size: 0.92rem;
  color: var(--text-main, #1f2937);
  line-height: 1.5;
  margin: 0;
}

.confirm-detail {
  font-size: 0.8rem;
  color: var(--text-muted, #6b7280);
}

.btn-cancel {
  padding: 0.55rem 1rem;
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #1f2937);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: var(--bg-main, #f3f4f6);
}

.btn-confirm {
  padding: 0.55rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  transition: all 0.2s;
}

.btn-danger {
  background: #dc2626;
}
.btn-danger:hover {
  background: #b91c1c;
}

.btn-primary {
  background: #4f008c;
}
.btn-primary:hover {
  background: #370062;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
