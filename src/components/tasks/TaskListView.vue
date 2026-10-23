<template>
  <div class="task-list-view">
    <div class="task-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        @click="editTask(task)"
      >
        <div class="task-main">
          <div class="task-checkbox">
            <input
              type="checkbox"
              :checked="task.status === 'done'"
              @change="toggleTaskStatus(task)"
              @click.stop
            />
          </div>
          <div class="task-content">
            <h4 class="task-title">{{ task.title }}</h4>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-meta">
              <span class="meta-item">
                <i class="fa-solid fa-calendar"></i>
                {{ formatDate(task.dueDate) }}
              </span>
              <span class="meta-item">
                <i class="fa-solid fa-flag"></i>
                {{ getPriorityLabel(task.priority) }}
              </span>
            </div>
          </div>
        </div>

        <div class="task-side">
          <div class="task-assignees">
            <div
              v-for="assignee in task.assignees.slice(0, 3)"
              :key="assignee.userId"
              class="assignee-avatar"
              :title="assignee.username"
            >
              {{ assignee.username.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="task-actions">
            <button @click.stop="editTask(task)" class="action-btn">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button @click.stop="deleteTask(task.id)" class="action-btn delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Sous-tâches -->
        <div v-if="task.subtasks && task.subtasks.length > 0" class="subtasks-section">
          <div
            v-for="(subtask, index) in task.subtasks"
            :key="index"
            class="subtask-item"
          >
            <input
              type="checkbox"
              :checked="subtask.completed"
              @change="toggleSubtask(task, index)"
              @click.stop
            />
            <span>{{ subtask.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()

const tasks = computed(() => projectStore.activeProjectTasks)

const formatDate = (dateString) => {
  if (!dateString) return 'Pas de date'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
    urgent: 'Urgente',
  }
  return labels[priority] || priority
}

const toggleTaskStatus = (task) => {
  const newStatus = task.status === 'done' ? 'todo' : 'done'
  projectStore.updateTask(task.id, { status: newStatus })
}

const toggleSubtask = (task, index) => {
  task.subtasks[index].completed = !task.subtasks[index].completed
  projectStore.updateTask(task.id, { subtasks: task.subtasks })
}

const editTask = (task) => {
  console.log('Edit task:', task)
}

const deleteTask = (taskId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
    projectStore.deleteTask(taskId)
  }
}
</script>

<style scoped>
.task-list-view {
  padding: 1rem;
  height: 100%;
  overflow: auto;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.task-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.task-main {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.task-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #374151;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.task-description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.task-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.task-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
}

.task-assignees {
  display: flex;
  gap: -0.125rem;
}

.assignee-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.6875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.subtasks-section {
  margin-top: 0.625rem;
  padding-top: 0.625rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

.subtask-item input {
  cursor: pointer;
  accent-color: #374151;
}
</style>
