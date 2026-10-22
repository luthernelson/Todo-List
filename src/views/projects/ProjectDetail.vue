<template>
  <div class="project-detail">
    <!-- Header simple -->
    <div class="project-header">
      <div class="project-info">
        <div class="project-icon" :style="{ backgroundColor: project?.color }">
          <i :class="getIconClass(project?.icon)"></i>
        </div>
        <div>
          <h1>{{ project?.name }}</h1>
          <p>{{ project?.description }}</p>
        </div>
      </div>

      <div class="project-actions">
        <button @click="$router.push('/budget')" class="action-btn">
          <i class="fa-solid fa-coins"></i>
        </button>
        <button @click="showShareModal = true" class="action-btn">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
        <button @click="showMemberModal = true" class="action-btn">
          <i class="fa-solid fa-user-plus"></i>
        </button>
        <button @click="showSettings = true" class="action-btn">
          <i class="fa-solid fa-cog"></i>
        </button>
      </div>
    </div>

    <!-- Barre d'outils simple -->
    <div class="toolbar">
      <div class="view-switcher">
        <button
          v-for="view in views"
          :key="view.id"
          @click="currentView = view.id"
          :class="['view-btn', { active: currentView === view.id }]"
        >
          <i :class="view.icon"></i>
          <span>{{ view.label }}</span>
        </button>
      </div>

      <div class="toolbar-actions">
        <button @click="showPlanning = true" class="action-btn">
          <i class="fa-solid fa-calendar-alt"></i>
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="project-content">
      <!-- Vue Kanban -->
      <TaskKanbanView v-if="currentView === 'kanban'" />

      <!-- Vue Tableau -->
      <TaskTableView v-else-if="currentView === 'table'" />

      <!-- Vue Liste -->
      <TaskListView v-else-if="currentView === 'list'" />

      <!-- Vue Calendrier -->
      <TaskCalendarView v-else-if="currentView === 'calendar'" />
    </div>

    <!-- Modal d'invitation de membres -->
    <MemberInvitationModal
      v-if="showMemberModal"
      :project="project"
      @close="showMemberModal = false"
      @invited="onMemberInvited"
    />

    <!-- Modal de partage -->
    <ShareProjectModal
      v-if="showShareModal"
      :project="project"
      @close="showShareModal = false"
      @invite="onShareInvite"
      @remove="onShareRemove"
    />

    <!-- Panel de planning -->
    <div v-if="showPlanning" class="planning-panel">
      <div class="planning-header">
        <h3>Planning du projet</h3>
        <button @click="showPlanning = false" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <div class="planning-content">
        <PlanningCalendar :project="project" @save="savePlanning" @addTask="addTaskFromPlanning" @editTask="editTaskFromPlanning" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useUserStore } from '@/stores/userStore'
import TaskKanbanView from '@/components/tasks/TaskKanbanView.vue'
import TaskTableView from '@/components/tasks/TaskTableView.vue'
import TaskListView from '@/components/tasks/TaskListView.vue'
import TaskCalendarView from '@/components/tasks/TaskCalendarView.vue'
import MemberInvitationModal from '@/components/company/MemberInvitationModal.vue'
import BudgetModal from '@/components/projects/BudgetModal.vue'
import PlanningCalendar from '@/components/projects/PlanningCalendar.vue'
import ShareProjectModal from '@/components/projects/ShareProjectModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const projectStore = useProjectStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const currentView = ref('kanban')
const showDiscussion = ref(false)
const showPlanning = ref(false)
const showMemberModal = ref(false)
const showSettings = ref(false)
const showReports = ref(false)
const showBudgetModal = ref(false)
const showShareModal = ref(false)
const newMessage = ref('')

const project = computed(() => projectStore.currentProject)
const currentUserId = computed(() => userStore.idUser)

const projectStats = computed(() => {
  if (!project.value) return { total: 0, completed: 0, inProgress: 0, completionRate: 0 }
  const tasks = project.value.tasks || []
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
  }
})

const projectReports = ref([])

const views = [
  { id: 'kanban', label: 'Kanban', icon: 'fa-solid fa-columns' },
  { id: 'table', label: 'Tableau', icon: 'fa-solid fa-table' },
  { id: 'list', label: 'Liste', icon: 'fa-solid fa-list' },
  { id: 'calendar', label: 'Calendrier', icon: 'fa-solid fa-calendar' },
]

const messages = ref([
  {
    id: 1,
    senderId: 1,
    senderName: 'Marie',
    content: 'Bonjour à tous! Comment avance le projet?',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    senderId: 2,
    senderName: 'Jean',
    content: 'Ça avance bien! J\'ai terminé la phase d\'analyse.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
])

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

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      senderId: currentUserId.value,
      senderName: userStore.username || 'Moi',
      content: newMessage.value,
      createdAt: new Date().toISOString(),
    })
    newMessage.value = ''
  }
}

const onMemberInvited = (member) => {
  projectStore.addMember(member)
  showMemberModal.value = false
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const generateReport = () => {
  const newReport = {
    id: Date.now(),
    title: `Rapport - ${project.value?.name || 'Projet'} - ${new Date().toLocaleDateString('fr-FR')}`,
    type: 'summary',
    generatedAt: new Date().toISOString(),
    metrics: {
      totalTasks: projectStats.value.total,
      completedTasks: projectStats.value.completed,
      inProgressTasks: projectStats.value.inProgress,
      completionRate: projectStats.value.completionRate
    }
  }
  projectReports.value.push(newReport)
  notificationStore.success('Rapport généré', 'Le rapport a été créé avec succès')
}

const viewReport = (report) => {
  alert(`Voir le rapport: ${report.title}`)
}

const downloadReport = (report) => {
  alert(`Télécharger le rapport: ${report.title}`)
}

const onBudgetSave = (budgetData) => {
  if (project.value) {
    projectStore.updateProject(project.value.id, { budget: budgetData })
    notificationStore.success('Budget mis à jour', 'Le budget du projet a été enregistré avec succès')
  }
  showBudgetModal.value = false
}

const savePlanning = (planningData) => {
  if (project.value) {
    projectStore.updateProject(project.value.id, { planning: planningData })
    notificationStore.success('Planning sauvegardé', 'Le planning a été mis à jour avec succès')
  }
}

const addTaskFromPlanning = (taskData) => {
  console.log('Add task from planning:', taskData)
  // Logique pour ajouter une tâche depuis le planning
}

const editTaskFromPlanning = (task) => {
  console.log('Edit task from planning:', task)
  // Logique pour éditer une tâche depuis le planning
}

const onShareInvite = (data) => {
  projectStore.shareProject(project.value.id, data.email, data.permission)
  notificationStore.success('Invitation envoyée', `Une invitation a été envoyée à ${data.email}`)
}

const onShareRemove = (userId) => {
  projectStore.removeShare(project.value.id, userId)
  notificationStore.success('Accès retiré', 'L\'accès au projet a été retiré')
}

onMounted(() => {
  // Charger les données du projet
  if (!projectStore.currentProject) {
    // Rediriger vers la liste si pas de projet
    // router.push('/projects')
  }
})
</script>

<style scoped>
.project-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
}

.project-info h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.project-info p {
  color: #6b7280;
  font-size: 0.875rem;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: #e5e7eb;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.view-switcher {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-btn:hover {
  color: #374151;
}

.view-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

.project-content {
  flex: 1;
  overflow: hidden;
  transition: all 0.3s ease;
}

.project-content.with-discussion {
  margin-right: 400px;
}

.project-content.with-reports {
  margin-right: 400px;
}

.project-content.with-discussion.with-reports {
  margin-right: 800px;
}

.discussion-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.discussion-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.discussion-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
}

.message.own {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.message-sender {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.message-text {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.75rem;
  color: #1f2937;
  line-height: 1.5;
}

.message.own .message-text {
  background: #667eea;
  color: white;
}

.message-time {
  font-size: 0.625rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.discussion-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.discussion-input input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.discussion-input input:focus {
  outline: none;
  border-color: #667eea;
}

.send-btn {
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover {
  background: #5568d3;
}

/* Panel de rapports */
.reports-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.reports-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.reports-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.reports-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: #293848;
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
}

.summary-card h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.reports-list {
  margin-bottom: 1.5rem;
}

.reports-list h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.no-reports {
  text-align: center;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  border: 2px dashed #e5e7eb;
}

.no-reports p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.btn-generate-report {
  padding: 0.5rem 1rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-generate-report:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.report-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.report-item:hover {
  border-color: #293848;
  background: #f0f9ff;
}

.report-info h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.report-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-download {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #293848;
  color: white;
}

.btn-download:hover {
  background: #10B981;
  color: white;
}

.btn-add-report {
  width: 100%;
  padding: 0.75rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-add-report:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Panel de planning */
.planning-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 500px;
  height: 100vh;
  background: white;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.planning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.planning-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.planning-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

@media (max-width: 1024px) {
  .discussion-panel,
  .reports-panel,
  .planning-panel {
    width: 320px;
  }

  .project-content.with-discussion {
    margin-right: 320px;
  }

  .project-content.with-reports {
    margin-right: 320px;
  }

  .project-content.with-discussion.with-reports {
    margin-right: 640px;
  }
}

@media (max-width: 768px) {
  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .view-switcher {
    overflow-x: auto;
  }

  .discussion-panel {
    width: 100%;
  }

  .project-content.with-discussion {
    margin-right: 0;
  }
}
</style>
