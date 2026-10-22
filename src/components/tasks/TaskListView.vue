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
  gap: 0.75rem;
}

.task-item {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-main {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.task-checkbox input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.task-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
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
  gap: 0.5rem;
}

.task-assignees {
  display: flex;
  gap: -0.25rem;
}

.assignee-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
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
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0.375rem;
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

.subtasks-section {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.subtask-item input {
  cursor: pointer;
}
</style>
