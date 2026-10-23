<template>
  <div class="table-skeleton">
    <div class="skeleton-header" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div v-for="i in columns" :key="i" class="skeleton-th"></div>
    </div>
    <div class="skeleton-body">
      <div v-for="row in rows" :key="row" class="skeleton-row" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
        <div v-for="i in columns" :key="i" class="skeleton-td"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Number,
    default: 5
  },
  rows: {
    type: Number,
    default: 5
  }
})
</script>

<style scoped>
.table-skeleton {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.skeleton-header {
  display: grid;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem;
  gap: 0.5rem;
}

.skeleton-th {
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
}

.skeleton-row {
  display: grid;
  padding: 0.75rem;
  gap: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-td {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
