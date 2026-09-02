<template>
  <div class="stat-card" dir="rtl">
    <div class="stat-top">
      <div class="stat-icon" :style="{ background: iconBg || 'rgba(79, 0, 140, 0.1)', color: iconColor || '#4f008c' }">
        <slot name="icon"></slot>
      </div>
      <div v-if="trend" class="stat-trend" :class="trendUp ? 'trend-up' : 'trend-down'">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline :points="trendUp ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
        </svg>
        <span>{{ trend }}</span>
      </div>
    </div>
    <div class="stat-bottom">
      <span class="stat-value">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: [String, Number],
  label: String,
  trend: String,
  trendUp: {
    type: Boolean,
    default: true,
  },
  iconBg: String,
  iconColor: String,
});
</script>

<style scoped>
.stat-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
}
.trend-up { background: #dcfce7; color: #16a34a; }
.trend-down { background: #fee2e2; color: #dc2626; }

.stat-bottom {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-main, #1f2937);
  line-height: 1.1;
  font-family: 'Outfit', 'Cairo', sans-serif;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted, #6b7280);
  font-weight: 500;
  margin-top: 0.2rem;
}
</style>
