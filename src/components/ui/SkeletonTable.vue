<template>
  <div class="skeleton-table-wrapper" :class="{ 'dark-mode': isDarkMode }">
    <!-- Header du tableau -->
    <div class="skeleton-table-header">
      <div class="skeleton-header-title">
        <SkeletonLoader variant="text" :height="'1.5rem'" :width="'30%'" />
      </div>
      <div class="skeleton-header-actions">
        <SkeletonLoader variant="rectangular" :width="'120px'" :height="'40px'" :borderRadius="'0.5rem'" />
      </div>
    </div>

    <!-- Tableau -->
    <div class="skeleton-table">
      <!-- En-têtes -->
      <div class="skeleton-table-head">
        <div
          v-for="i in columns"
          :key="`head-${i}`"
          class="skeleton-table-cell head-cell"
        >
          <SkeletonLoader variant="text" :height="'1rem'" :width="'80%'" />
        </div>
      </div>

      <!-- Lignes -->
      <div
        v-for="row in rows"
        :key="`row-${row}`"
        class="skeleton-table-row"
      >
        <div
          v-for="col in columns"
          :key="`cell-${row}-${col}`"
          class="skeleton-table-cell"
        >
          <SkeletonLoader
            :variant="col === 1 ? 'avatar' : 'text'"
            :height="col === 1 ? '40px' : '1rem'"
            :width="col === 1 ? '40px' : '80%'"
            :borderRadius="col === 1 ? '50%' : '0.25rem'"
          />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="skeleton-pagination">
      <SkeletonLoader variant="rectangular" :width="'100px'" :height="'36px'" :borderRadius="'0.5rem'" />
      <div class="pagination-items">
        <SkeletonLoader
          v-for="i in 5"
          :key="i"
          variant="rectangular"
          :width="'40px'"
          :height="'36px'"
          :borderRadius="'0.5rem'"
        />
      </div>
      <SkeletonLoader variant="rectangular" :width="'100px'" :height="'36px'" :borderRadius="'0.5rem'" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SkeletonLoader from './SkeletonLoader.vue'

const props = defineProps({
  columns: {
    type: Number,
    default: 5,
  },
  rows: {
    type: Number,
    default: 5,
  },
})

const isDarkMode = computed(() => document.documentElement.classList.contains('dark'))
</script>

<style scoped>
.skeleton-table-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-mode .skeleton-table-wrapper {
  background: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.skeleton-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.skeleton-header-title {
  flex: 1;
}

.skeleton-header-actions {
  display: flex;
  gap: 0.75rem;
}

.skeleton-table {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.dark-mode .skeleton-table {
  border-color: #6b7280;
}

.skeleton-table-head {
  display: grid;
  grid-template-columns: repeat(var(--columns, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.dark-mode .skeleton-table-head {
  background: #4b5563;
  border-bottom-color: #6b7280;
}

.skeleton-table-head {
  --columns: v-bind(columns);
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(var(--columns, 1fr));
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark-mode .skeleton-table-row {
  border-bottom-color: #6b7280;
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

.skeleton-table-row {
  --columns: v-bind(columns);
}

.skeleton-table-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.head-cell {
  justify-content: center;
}

.skeleton-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pagination-items {
  display: flex;
  gap: 0.5rem;
}
</style>
