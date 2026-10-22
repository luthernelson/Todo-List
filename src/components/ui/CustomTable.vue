<template>
  <div class="custom-table-container">
    <div v-if="loading" class="table-loading">
      <div class="loading-row" v-for="i in 5" :key="i">
        <div class="loading-cell" v-for="j in columns.length" :key="j"></div>
      </div>
    </div>
    
    <table v-else class="custom-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="column.sortable && sortBy(column.key)"
            :class="{ 'sortable': column.sortable, 'sorted': sortKey === column.key }"
          >
            <div class="th-content">
              <span>{{ column.label }}</span>
              <ChevronUp v-if="column.sortable && sortKey === column.key && sortOrder === 'asc'" :size="16" />
              <ChevronDown v-if="column.sortable && sortKey === column.key && sortOrder === 'desc'" :size="16" />
            </div>
          </th>
          <th v-if="actions" class="actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0" class="empty-row">
          <td :colspan="columns.length + (actions ? 1 : 0)">
            <div class="empty-state">
              <Inbox :size="48" />
              <p>{{ emptyMessage }}</p>
            </div>
          </td>
        </tr>
        <tr v-for="(row, index) in sortedData" :key="index" :class="{ 'selected': selectedRows.includes(index) }">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="actions" class="actions-cell">
            <slot name="actions" :row="row" :index="index"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="pagination && totalPages > 1" class="table-pagination">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        <ChevronLeft :size="16" />
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-vue-next'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
  pagination: {
    type: Boolean,
    default: false,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  emptyMessage: {
    type: String,
    default: 'Aucune donnée disponible',
  },
  actions: {
    type: Boolean,
    default: false,
  },
})

const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const selectedRows = ref([])

const sortedData = computed(() => {
  let result = [...props.data]
  
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  if (props.pagination) {
    const start = (currentPage.value - 1) * props.pageSize
    const end = start + props.pageSize
    result = result.slice(start, end)
  }
  
  return result
})

const totalPages = computed(() => {
  return Math.ceil(props.data.length / props.pageSize)
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
.custom-table-container {
  width: 100%;
  overflow-x: auto;
}

.table-loading {
  padding: 1rem;
}

.loading-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.loading-cell {
  flex: 1;
  height: 40px;
  border-radius: 0.375rem;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
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

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-table thead {
  background: rgb(29, 40, 61);
  color: white;
}

.custom-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
}

.custom-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.custom-table th.sortable:hover {
  background: rgba(255, 255, 255, 0.1);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.custom-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s;
}

.custom-table tbody tr:hover {
  background: #f9fafb;
}

.custom-table tbody tr.selected {
  background: #eff6ff;
}

.custom-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: rgb(29, 40, 61);
}

.custom-table tbody tr:last-child {
  border-bottom: none;
}

.empty-row td {
  padding: 3rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #9ca3af;
}

.actions-column,
.actions-cell {
  width: 100px;
  text-align: center;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: rgb(29, 40, 61);
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: rgb(29, 40, 61);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: rgb(29, 40, 61);
}
</style>
