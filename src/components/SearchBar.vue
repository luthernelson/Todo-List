<template>
  <div class="search-bar-container">
    <div class="search-input-wrapper">
      <i class="fa-solid fa-search search-icon"></i>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @input="handleSearch"
        @focus="showResults = true"
        @blur="hideResults"
      />
      <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <div v-if="showResults && (filteredProjects.length > 0 || filteredTasks.length > 0)" class="search-results">
      <div v-if="filteredProjects.length > 0" class="results-section">
        <h4>Projets</h4>
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="result-item"
          @click="goToProject(project)"
        >
          <div class="result-icon" :style="{ backgroundColor: project.color }">
            <i :class="getIconClass(project.icon)"></i>
          </div>
          <div class="result-info">
            <h5>{{ project.name }}</h5>
            <p>{{ project.description }}</p>
          </div>
        </div>
      </div>

      <div v-if="filteredTasks.length > 0" class="results-section">
        <h4>Tâches</h4>
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="result-item"
          @click="goToTask(task)"
        >
          <div class="result-icon task-icon">
            <i class="fa-solid fa-check-square"></i>
          </div>
          <div class="result-info">
            <h5>{{ task.title }}</h5>
            <p>{{ task.projectName || 'Projet inconnu' }}</p>
          </div>
        </div>
      </div>

      <div v-if="filteredProjects.length === 0 && filteredTasks.length === 0" class="no-results">
        <i class="fa-solid fa-search"></i>
        <p>Aucun résultat trouvé</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Rechercher des projets, tâches...',
  },
})

const emit = defineEmits(['search'])

const router = useRouter()
const projectStore = useProjectStore()

const searchQuery = ref('')
const showResults = ref(false)

const filteredProjects = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return projectStore.projects.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  ).slice(0, 5)
})

const filteredTasks = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  const allTasks = projectStore.projects.flatMap(p =>
    (p.tasks || []).map(t => ({
      ...t,
      projectName: p.name,
      projectId: p.id,
    }))
  )
  return allTasks.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.description?.toLowerCase().includes(query)
  ).slice(0, 5)
})

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  showResults.value = false
  emit('search', '')
}

const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

const goToProject = (project) => {
  searchQuery.value = ''
  showResults.value = false
  router.push(`/projects/${project.id}`)
}

const goToTask = (task) => {
  searchQuery.value = ''
  showResults.value = false
  router.push(`/projects/${task.projectId}`)
}

const getIconClass = (icon) => {
  const iconMap = {
    folder: 'fa-solid fa-folder',
    code: 'fa-solid fa-code',
    design: 'fa-solid fa-palette',
    rocket: 'fa-solid fa-rocket',
    home: 'fa-solid fa-home',
    briefcase: 'fa-solid fa-briefcase',
  }
  return iconMap[icon] || 'fa-solid fa-folder'
}
</script>

<style scoped>
.search-bar-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: #f9fafb;
  transition: all 0.2s;
}

.dark .search-input {
  background: #4b5563;
  border-color: #6b7280;
  color: white;
}

.search-input:focus {
  outline: none;
  border-color: #293848;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark .search-input:focus {
  background: #374151;
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.clear-btn:hover {
  color: #6b7280;
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

.dark .search-results {
  background: #374151;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-section {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .results-section {
  border-bottom-color: #6b7280;
}

.results-section:last-child {
  border-bottom: none;
}

.results-section h4 {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.result-item:hover {
  background: #f9fafb;
}

.dark .result-item:hover {
  background: #4b5563;
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.task-icon {
  background: #293848;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-info h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .result-info h5 {
  color: white;
}

.result-info p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .result-info p {
  color: #d1d5db;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
}

.no-results i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.no-results p {
  font-size: 0.875rem;
  margin: 0;
}
</style>
