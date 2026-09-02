<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click="handleBackdropClick">
        <div
          class="modal-wrapper"
          :style="{ maxWidth: maxWidth || '650px' }"
          @click.stop
          dir="rtl"
        >
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title-wrap">
              <slot name="icon"></slot>
              <h3 class="modal-title">{{ title }}</h3>
            </div>
            <button class="btn-close" @click="closeModal" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: '650px',
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal();
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 5, 25, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
}

.modal-wrapper {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 14px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main, #1f2937);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: var(--text-muted, #9ca3af);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  background: var(--bg-main, #f3f4f6);
  color: var(--text-main, #1f2937);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  background: var(--table-header-bg, #f9fafb);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-wrapper {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .modal-wrapper {
  transform: scale(0.95) translateY(10px);
}
</style>
