<template>
  <div class="project-card" :style="{ borderTopColor: project.color }" @click="$emit('open', project)">
    <div class="card-header">
      <div class="project-icon" :style="{ backgroundColor: project.color }">
        <i :class="getIconClass(project.icon)"></i>
      </div>
      <div class="project-actions">
        <button @click.stop="$emit('edit', project)" class="action-btn">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button @click.stop="$emit('delete', project)" class="action-btn delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>

    <h3 class="project-name">{{ project.name }}</h3>
    <p class="project-description">{{ project.description }}</p>

    <div class="card-footer">
      <div class="project-stats">
        <div class="stat">
          <i class="fa-solid fa-list-check"></i>
          <span>{{ taskCount }} tâches</span>
        </div>
        <div class="stat">
          <i class="fa-solid fa-users"></i>
          <span>{{ memberCount }} membres</span>
        </div>
      </div>
      <div class="project-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: completionRate + '%', backgroundColor: project.color }"></div>
        </div>
        <span class="progress-text">{{ completionRate }}%</span>
      </div>
    </div>

    <div class="card-meta">
      <span class="date">
        <i class="fa-solid fa-calendar"></i>
        {{ formatDate(project.createdAt) }}
      </span>
      <div class="meta-badges">
        <span class="mode-badge" :class="project.mode">
          {{ project.mode === 'professional' ? 'Pro' : 'Perso' }}
        </span>
        <span v-if="project.budget?.enabled" class="budget-badge">
          <i class="fa-solid fa-coins"></i>
          Budget
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

defineEmits(['open', 'edit', 'delete'])

const projectStore = useProjectStore()

const taskCount = computed(() => props.project.tasks?.length || 0)
const memberCount = computed(() => props.project.members?.length || 0)

const completionRate = computed(() => {
  const tasks = props.project.tasks || []
  if (tasks.length === 0) return 0
  const completed = tasks.filter((t) => t.status === 'done').length
  return Math.round((completed / tasks.length) * 100)
})

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

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.project-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border-top: 4px solid;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -1px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #ef4444;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.project-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-bottom: 1rem;
}

.project-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.stat i {
  color: #9ca3af;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 3rem;
  text-align: right;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.meta-badges {
  display: flex;
  gap: 0.5rem;
}

.date {
  font-size: 0.75rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.mode-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.mode-badge.professional {
  background: #dbeafe;
  color: #1e40af;
}

.mode-badge.personal {
  background: #d1fae5;
  color: #065f46;
}

.budget-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #fef3c7;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
