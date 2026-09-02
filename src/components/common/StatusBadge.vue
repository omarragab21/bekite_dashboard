<template>
  <span class="status-badge" :style="computedStyle">
    <span v-if="dot" class="badge-dot" :style="{ background: badgeColor }"></span>
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { INQUIRY_STATUSES } from '../../core/constants';

const props = defineProps({
  status: String,
  label: String,
  color: String,
  bg: String,
  dot: {
    type: Boolean,
    default: true,
  },
});

const statusConfig = computed(() => {
  if (props.status && INQUIRY_STATUSES[props.status.toUpperCase()]) {
    return INQUIRY_STATUSES[props.status.toUpperCase()];
  }
  return null;
});

const badgeColor = computed(() => {
  return props.color || statusConfig.value?.color || '#4f008c';
});

const computedStyle = computed(() => {
  const c = badgeColor.value;
  const bg = props.bg || statusConfig.value?.bg || `${c}18`;
  return {
    color: c,
    backgroundColor: bg,
    borderColor: `${c}33`,
  };
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 1px solid transparent;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
