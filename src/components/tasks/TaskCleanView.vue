<template>
  <div class="task-clean-view">
    <div class="view-header">
      <div class="header-left">
        <h2>Tâches</h2>
        <span class="task-count">{{ tasks.length }} tâches</span>
      </div>
      <div class="header-right">
        <select v-model="selectedStatus" class="filter-select">
          <option value="all">Tous les statuts</option>
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
        </select>
        <select v-model="selectedPriority" class="filter-select">
          <option value="all">Toutes les priorités</option>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
          <option value="urgent">Urgente</option>
        </select>
        <button @click="openCreateTask" class="btn-create">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle tâche
        </button>
      </div>
    </div>

    <div class="tasks-table">
      <table>
        <thead>
          <tr>
            <th width="40">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
            </th>
            <th>Tâche</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Assigné à</th>
            <th>Date limite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id" :class="{ selected: selectedTasks.includes(task.id) }">
            <td>
              <input 
                type="checkbox" 
                :checked="selectedTasks.includes(task.id)"
                @change="toggleTaskSelection(task.id)"
              />
            </td>
            <td>
              <div class="task-main">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="task.status">{{ getStatusLabel(task.status) }}</span>
            </td>
            <td>
              <span class="priority-indicator" :class="task.priority">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                {{ getPriorityLabel(task.priority) }}
              </span>
            </td>
            <td>
              <div class="assignees">
                <div 
                  v-for="(assignee, index) in task.assignees.slice(0, 3)" 
                  :key="index"
                  class="assignee-avatar"
                  :title="assignee.username"
                >
                  {{ assignee.username.charAt(0).toUpperCase() }}
                </div>
                <div v-if="task.assignees.length > 3" class="assignee-more">
                  +{{ task.assignees.length - 3 }}
                </div>
              </div>
            </td>
            <td>
              <span class="due-date" :class="{ overdue: isOverdue(task.dueDate) }">
                {{ formatDate(task.dueDate) }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editTask(task)" class="action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="deleteTask(task.id)" class="action-btn delete" title="Supprimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredTasks.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" stroke-width="1.5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="2"/>
        <path d="M9 14l2 2 4-4"/>
      </svg>
      <p>Aucune tâche trouvée</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedStatus = ref('all')
const selectedPriority = ref('all')
const selectedTasks = ref([])
const selectAll = ref(false)

const tasks = ref([
  {
    id: 1,
    title: 'Créer la page d\'accueil',
    description: 'Design et implémentation de la landing page',
    status: 'in_progress',
    priority: 'high',
    assignees: [{ username: 'Marie' }, { username: 'Jean' }],
    dueDate: '2024-02-15',
  },
  {
    id: 2,
    title: 'Intégrer l\'authentification',
    description: 'Setup de l\'auth avec JWT et refresh tokens',
    status: 'todo',
    priority: 'urgent',
    assignees: [{ username: 'Pierre' }],
    dueDate: '2024-02-10',
  },
  {
    id: 3,
    title: 'Optimiser les performances',
    description: 'Lazy loading et optimisation des assets',
    status: 'done',
    priority: 'medium',
    assignees: [{ username: 'Sophie' }, { username: 'Claire' }, { username: 'Lucas' }],
    dueDate: '2024-02-20',
  },
  {
    id: 4,
    title: 'Tests unitaires',
    description: 'Écrire les tests pour les composants principaux',
    status: 'todo',
    priority: 'low',
    assignees: [{ username: 'Emma' }],
    dueDate: '2024-02-25',
  },
  {
    id: 5,
    title: 'Documentation API',
    description: 'Créer la documentation Swagger',
    status: 'in_progress',
    priority: 'medium',
    assignees: [{ username: 'Thomas' }, { username: 'Hugo' }],
    dueDate: '2024-02-18',
  },
])

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const statusMatch = selectedStatus.value === 'all' || task.status === selectedStatus.value
    const priorityMatch = selectedPriority.value === 'all' || task.priority === selectedPriority.value
    return statusMatch && priorityMatch
  })
})

const getStatusLabel = (status) => {
  const labels = {
    todo: 'À faire',
    in_progress: 'En cours',
    done: 'Terminé',
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

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTasks.value = filteredTasks.value.map(t => t.id)
  } else {
    selectedTasks.value = []
  }
}

const toggleTaskSelection = (taskId) => {
  const index = selectedTasks.value.indexOf(taskId)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const openCreateTask = () => {
  console.log('Open create task modal')
}

const editTask = (task) => {
  console.log('Edit task:', task)
}

const deleteTask = (taskId) => {
  if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }
}
</script>

<style scoped>
.task-clean-view {
  padding: 0;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.header-left h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.task-count {
  font-size: 0.875rem;
  color: #6B7280;
}

.header-right {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.625rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #1F2937;
}

.btn-create {
  padding: 0.625rem 1.25rem;
  background: #1F2937;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #374151;
}

.tasks-table {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr {
  border-bottom: 1px solid #E5E7EB;
  transition: background 0.15s;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: #F9FAFB;
}

tbody tr.selected {
  background: #F3F4F6;
}

td {
  padding: 1rem;
  vertical-align: middle;
}

.task-main h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.task-main p {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-badge.todo {
  background: #F3F4F6;
  color: #6B7280;
}

.status-badge.in_progress {
  background: #DBEAFE;
  color: #1E40AF;
}

.status-badge.done {
  background: #D1FAE5;
  color: #065F46;
}

.priority-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-indicator.low {
  background: #F3F4F6;
  color: #6B7280;
}

.priority-indicator.medium {
  background: #FEF3C7;
  color: #92400E;
}

.priority-indicator.high {
  background: #FEE2E2;
  color: #991B1B;
}

.priority-indicator.urgent {
  background: #FECACA;
  color: #7F1D1D;
}

.assignees {
  display: flex;
  gap: -0.25rem;
}

.assignee-avatar {
  width: 28px;
  height: 28px;
  background: #1F2937;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  border: 2px solid white;
}

.assignee-more {
  width: 28px;
  height: 28px;
  background: #E5E7EB;
  color: #6B7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  border: 2px solid white;
}

.due-date {
  font-size: 0.875rem;
  color: #6B7280;
}

.due-date.overdue {
  color: #DC2626;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #F3F4F6;
  border-radius: 4px;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.action-btn:hover {
  background: #E5E7EB;
  color: #1F2937;
}

.action-btn.delete:hover {
  background: #FEF2F2;
  color: #DC2626;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #9CA3AF;
}

.empty-state p {
  margin-top: 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .task-clean-view {
    padding: 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .tasks-table {
    overflow-x: auto;
  }

  table {
    min-width: 700px;
  }
}
</style>
