<template>
  <div class="task-table-view">
    <div class="table-container">
      <table class="task-table">
        <thead>
          <tr>
            <th>Tâche</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Assigné à</th>
            <th>Date d'échéance</th>
            <th>Progression</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>
              <div class="task-cell">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
              </div>
            </td>
            <td>
              <span :class="['status-badge', task.status]">
                {{ getStatusLabel(task.status) }}
              </span>
            </td>
            <td>
              <span :class="['priority-badge', task.priority]">
                {{ getPriorityLabel(task.priority) }}
              </span>
            </td>
            <td>
              <div class="assignees-cell">
                <div
                  v-for="assignee in task.assignees.slice(0, 2)"
                  :key="assignee.userId"
                  class="assignee-avatar"
                  :title="assignee.username"
                >
                  {{ assignee.username.charAt(0).toUpperCase() }}
                </div>
                <span v-if="task.assignees.length > 2" class="more-assignees">
                  +{{ task.assignees.length - 2 }}
                </span>
              </div>
            </td>
            <td>
              <span :class="{ overdue: isOverdue(task.dueDate) }">
                {{ formatDate(task.dueDate) }}
              </span>
            </td>
            <td>
              <div class="progress-cell">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: getProgress(task) + '%' }"
                  ></div>
                </div>
                <span>{{ getProgress(task) }}%</span>
              </div>
            </td>
            <td>
              <div class="actions-cell">
                <button @click="editTask(task)" class="action-btn">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button @click="deleteTask(task.id)" class="action-btn delete">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()

const tasks = computed(() => projectStore.activeProjectTasks)

const getStatusLabel = (status) => {
  const labels = {
    todo: 'À faire',
    in_progress: 'En cours',
    review: 'En révision',
    done: 'Terminé',
    blocked: 'Bloqué',
  }
  return labels[status] || status
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

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

const getProgress = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === 'done' ? 100 : 0
  }
  const completed = task.subtasks.filter((st) => st.completed).length
  return Math.round((completed / task.subtasks.length) * 100)
}

const editTask = (task) => {
  // Ouvrir le modal d'édition
  console.log('Edit task:', task)
}

const deleteTask = (taskId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
    projectStore.deleteTask(taskId)
  }
}
</script>

<style scoped>
.task-table-view {
  padding: 1rem;
  height: 100%;
  overflow: auto;
}

.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table thead {
  background: #f9fafb;
}

.task-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.task-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.task-table tbody tr:hover {
  background: #f9fafb;
}

.task-cell h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.task-cell p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.todo {
  background: #e5e7eb;
  color: #374151;
}

.status-badge.in_progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.review {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.done {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.blocked {
  background: #fee2e2;
  color: #991b1b;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-badge.low {
  background: #dbeafe;
  color: #1e40af;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-badge.high {
  background: #fee2e2;
  color: #991b1b;
}

.priority-badge.urgent {
  background: #fecaca;
  color: #7f1d1d;
}

.assignees-cell {
  display: flex;
  align-items: center;
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

.more-assignees {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.overdue {
  color: #ef4444;
  font-weight: 600;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
}

.progress-cell span {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 3rem;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
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
</style>
