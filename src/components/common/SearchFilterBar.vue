<template>
  <div class="search-filter-bar" dir="rtl">
    <!-- Search Input -->
    <div class="search-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        :value="searchQuery"
        type="text"
        :placeholder="placeholder || 'بحث سريع...'"
        class="search-input"
        @input="$emit('update:searchQuery', $event.target.value)"
      />
      <button
        v-if="searchQuery"
        class="btn-clear-search"
        @click="$emit('update:searchQuery', '')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Category / Custom Filters -->
    <div class="filters-actions">
      <slot name="filters"></slot>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: String,
  placeholder: String,
});

defineEmits(['update:searchQuery']);
</script>

<style scoped>
.search-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 260px;
  max-width: 420px;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--text-muted, #9ca3af);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.55rem 2.2rem 0.55rem 2rem;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  font-size: 0.82rem;
  color: var(--text-main, #1f2937);
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #4f008c;
  box-shadow: 0 0 0 3px rgba(79, 0, 140, 0.1);
}

.btn-clear-search {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted, #9ca3af);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filters-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>
