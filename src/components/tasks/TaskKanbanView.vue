<template>
  <div class="kanban-view">
    <div class="kanban-board">
      <div
        v-for="phase in phases"
        :key="phase.id"
        class="kanban-column"
        :style="{ borderTopColor: phase.color }"
      >
        <div class="column-header">
          <div class="column-title">
            <div class="phase-color" :style="{ backgroundColor: phase.color }"></div>
            <h3>{{ phase.name }}</h3>
            <span class="task-count">{{ tasksByPhase[phase.id]?.length || 0 }}</span>
          </div>
          <button @click="openAddTask(phase.id)" class="add-task-btn">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <div class="column-tasks" @drop="onDrop($event, phase.id)" @dragover.prevent>
          <div
            v-for="task in tasksByPhase[phase.id]"
            :key="task.id"
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
            @click="openTaskDetail(task)"
          >
            <div class="task-priority" :class="task.priority">
              <i :class="getPriorityIcon(task.priority)"></i>
            </div>

            <h4 class="task-title">{{ task.title }}</h4>
            <p class="task-description">{{ task.description }}</p>

            <div class="task-assignees">
              <div
                v-for="assignee in task.assignees.slice(0, 3)"
                :key="assignee.userId"
                class="assignee-avatar"
                :title="assignee.username"
              >
                {{ assignee.username.charAt(0).toUpperCase() }}
              </div>
              <div v-if="task.assignees.length > 3" class="assignee-more">
                +{{ task.assignees.length - 3 }}
              </div>
            </div>

            <div class="task-footer">
              <div class="task-meta">
                <span v-if="task.dueDate" class="due-date" :class="{ overdue: isOverdue(task.dueDate) }">
                  <i class="fa-solid fa-calendar"></i>
                  {{ formatDate(task.dueDate) }}
                </span>
                <span class="subtasks">
                  <i class="fa-solid fa-list-check"></i>
                  {{ completedSubtasks(task) }}/{{ task.subtasks?.length || 0 }}
                </span>
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
          </div>

          <div v-if="tasksByPhase[phase.id]?.length === 0" class="empty-column">
            <i class="fa-solid fa-inbox"></i>
            <p>Aucune tâche</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création de tâche -->
    <TaskModal
      v-if="showTaskModal"
      :visible="showTaskModal"
      :task="editingTask"
      :phase-id="selectedPhaseId"
      @close="showTaskModal = false"
      @saved="onTaskSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import TaskModal from './TaskModal.vue'

const projectStore = useProjectStore()

const showTaskModal = ref(false)
const editingTask = ref(null)
const selectedPhaseId = ref(null)
const draggedTask = ref(null)

const phases = computed(() => projectStore.phases)
const tasks = computed(() => projectStore.activeProjectTasks)

const tasksByPhase = computed(() => {
  const grouped = {}
  phases.value.forEach((phase) => {
    grouped[phase.id] = tasks.value.filter((t) => t.phaseId === phase.id)
  })
  return grouped
})

const getPriorityIcon = (priority) => {
  const icons = {
    low: 'fa-solid fa-arrow-down',
    medium: 'fa-solid fa-minus',
    high: 'fa-solid fa-arrow-up',
    urgent: 'fa-solid fa-exclamation',
  }
  return icons[priority] || icons.medium
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

const completedSubtasks = (task) => {
  if (!task.subtasks) return 0
  return task.subtasks.filter((st) => st.completed).length
}

const onDragStart = (event, task) => {
  draggedTask.value = task
  event.dataTransfer.effectAllowed = 'move'
}

const onDrop = (event, phaseId) => {
  if (draggedTask.value) {
    projectStore.updateTask(draggedTask.value.id, { phaseId })
    draggedTask.value = null
  }
}

const openAddTask = (phaseId) => {
  editingTask.value = null
  selectedPhaseId.value = phaseId
  showTaskModal.value = true
}

const openTaskDetail = (task) => {
  editingTask.value = task
  selectedPhaseId.value = task.phaseId
  showTaskModal.value = true
}

const editTask = (task) => {
  editingTask.value = task
  selectedPhaseId.value = task.phaseId
  showTaskModal.value = true
}

const deleteTask = (taskId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
    projectStore.deleteTask(taskId)
  }
}

const onTaskSaved = (task) => {
  showTaskModal.value = false
  if (task.id) {
    projectStore.updateTask(task.id, task)
  } else {
    projectStore.addTask(task)
  }
}
</script>

<style scoped>
.kanban-view {
  height: 100%;
  overflow-x: auto;
  padding: 1rem;
}

.kanban-board {
  display: flex;
  gap: 1rem;
  min-width: max-content;
}

.kanban-column {
  flex: 0 0 320px;
  background: #f9fafb;
  border-radius: 1rem;
  border-top: 4px solid;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 200px);
}

.column-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.phase-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.column-title h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.task-count {
  background: #e5e7eb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.add-task-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  background: #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task-btn:hover {
  background: #d1d5db;
  color: #374151;
}

.column-tasks {
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
  transform: translateY(-2px);
}

.task-priority {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.task-priority.low {
  background: #dbeafe;
  color: #1e40af;
}

.task-priority.medium {
  background: #fef3c7;
  color: #92400e;
}

.task-priority.high {
  background: #fee2e2;
  color: #991b1b;
}

.task-priority.urgent {
  background: #fecaca;
  color: #7f1d1d;
}

.task-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.task-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-assignees {
  display: flex;
  gap: -0.25rem;
  margin-bottom: 0.75rem;
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

.assignee-more {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.task-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.due-date.overdue {
  color: #ef4444;
  font-weight: 600;
}

.subtasks {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
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

.empty-column {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.empty-column i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.empty-column p {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .kanban-column {
    flex: 0 0 280px;
  }
}
</style>
