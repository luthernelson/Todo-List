<template>
  <div class="tasks-page">
    <div class="page-header">
      <h1>Mes Tâches</h1>
      <div class="header-actions">
        <select v-model="selectedProject" class="project-select">
          <option value="all">Tous les projets</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
        <button @click="showCreateTask = true" class="btn-create">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle tâche
        </button>
      </div>
    </div>

    <div v-if="loading" class="skeleton-loader">
      <div class="skeleton-card" v-for="i in 8" :key="i"></div>
    </div>

    <div v-else class="tasks-list">
      <div v-for="task in filteredTasks" :key="task.id" class="task-item">
        <div class="task-checkbox">
          <input
            type="checkbox"
            :checked="task.status === 'done'"
            @change="toggleTaskStatus(task)"
          />
        </div>
        <div class="task-content">
          <h3 class="task-title">{{ task.title }}</h3>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-meta">
            <span class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ formatDate(task.dueDate) }}
            </span>
            <span class="meta-item priority" :class="task.priority">
              {{ getPriorityLabel(task.priority) }}
            </span>
            <span class="meta-item project">{{ task.projectName }}</span>
          </div>
        </div>
        <div class="task-assignees">
          <div
            v-for="assignee in task.assignees.slice(0, 3)"
            :key="assignee.id"
            class="assignee-avatar"
            :title="assignee.name"
          >
            {{ assignee.name.charAt(0).toUpperCase() }}
          </div>
          <div v-if="task.assignees.length > 3" class="assignee-avatar more">
            +{{ task.assignees.length - 3 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(true)
const selectedProject = ref('all')
const showCreateTask = ref(false)

const projects = ref([
  { id: 1, name: 'Projet Alpha' },
  { id: 2, name: 'Projet Beta' },
  { id: 3, name: 'Projet Gamma' },
])

const tasks = ref([
  {
    id: 1,
    title: 'Analyse des besoins fonctionnels',
    description: 'Recueillir et documenter les besoins du client pour le module CRM',
    status: 'done',
    priority: 'high',
    dueDate: '2024-01-15',
    projectId: 1,
    projectName: 'Projet Alpha',
    assignees: [
      { id: 1, name: 'Marie Dupont' },
      { id: 2, name: 'Jean Martin' },
    ],
  },
  {
    id: 2,
    title: 'Design des maquettes UI/UX',
    description: 'Créer les wireframes et prototypes haute fidélité pour le dashboard',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-20',
    projectId: 1,
    projectName: 'Projet Alpha',
    assignees: [
      { id: 3, name: 'Sophie Bernard' },
      { id: 4, name: 'Pierre Leroy' },
    ],
  },
  {
    id: 3,
    title: 'Implémentation du composant authentification',
    description: 'Développer le système de login avec OAuth2 et JWT',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-01-25',
    projectId: 1,
    projectName: 'Projet Alpha',
    assignees: [
      { id: 2, name: 'Jean Martin' },
      { id: 5, name: 'Claire Moreau' },
    ],
  },
  {
    id: 4,
    title: 'Configuration PostgreSQL avec migrations',
    description: 'Mettre en place la base de données et les scripts de migration',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-01-18',
    projectId: 2,
    projectName: 'Projet Beta',
    assignees: [
      { id: 6, name: 'Lucas Petit' },
    ],
  },
  {
    id: 5,
    title: 'Tests unitaires composants React',
    description: 'Écrire les tests Jest pour les composants principaux',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-22',
    projectId: 2,
    projectName: 'Projet Beta',
    assignees: [
      { id: 7, name: 'Emma Roux' },
      { id: 8, name: 'Thomas Dubois' },
    ],
  },
  {
    id: 6,
    title: 'Documentation API REST Swagger',
    description: 'Documenter tous les endpoints avec OpenAPI specification',
    status: 'todo',
    priority: 'low',
    dueDate: '2024-01-30',
    projectId: 3,
    projectName: 'Projet Gamma',
    assignees: [
      { id: 9, name: 'Hugo Michel' },
    ],
  },
  {
    id: 7,
    title: 'Optimisation des requêtes base de données',
    description: 'Analyser et optimiser les requêtes lentes avec indexation',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-01-28',
    projectId: 3,
    projectName: 'Projet Gamma',
    assignees: [
      { id: 10, name: 'Léa Garcia' },
      { id: 11, name: 'Adam Thomas' },
    ],
  },
  {
    id: 8,
    title: 'Setup CI/CD pipeline GitHub Actions',
    description: 'Configurer le pipeline de déploiement automatique',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2024-02-01',
    projectId: 3,
    projectName: 'Projet Gamma',
    assignees: [
      { id: 12, name: 'Chloé Robert' },
    ],
  },
  {
    id: 9,
    title: 'Revue de code - Module paiement',
    description: 'Revue et validation du code du module de paiement Stripe',
    status: 'done',
    priority: 'medium',
    dueDate: '2024-01-14',
    projectId: 1,
    projectName: 'Projet Alpha',
    assignees: [
      { id: 2, name: 'Jean Martin' },
      { id: 13, name: 'Antoine Blanc' },
    ],
  },
  {
    id: 10,
    title: 'Développement API notifications',
    description: 'Créer les endpoints pour l\'envoi de notifications push',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-01-23',
    projectId: 2,
    projectName: 'Projet Beta',
    assignees: [
      { id: 6, name: 'Lucas Petit' },
      { id: 14, name: 'Camille Durand' },
    ],
  },
  {
    id: 11,
    title: 'Intégration Google Analytics',
    description: 'Intégrer le tracking et les événements personnalisés',
    status: 'todo',
    priority: 'low',
    dueDate: '2024-02-05',
    projectId: 1,
    projectName: 'Projet Alpha',
    assignees: [
      { id: 4, name: 'Pierre Leroy' },
    ],
  },
  {
    id: 12,
    title: 'Refactoring legacy code',
    description: 'Moderniser le code legacy du module utilisateurs',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-02-03',
    projectId: 3,
    projectName: 'Projet Gamma',
    assignees: [
      { id: 10, name: 'Léa Garcia' },
    ],
  },
])

const filteredTasks = computed(() => {
  if (selectedProject.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(task => task.projectId === selectedProject.value)
})

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
  task.status = task.status === 'done' ? 'todo' : 'done'
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
</script>

<style scoped>
.tasks-page {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.project-select {
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.btn-create {
  padding: 0.625rem 1.25rem;
  background: #374151;
  color: white;
  border: 1px solid #374151;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.btn-create:hover {
  background: #1f2937;
  border-color: #1f2937;
}

.skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1.5rem;
}

.skeleton-card {
  height: 80px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1.5rem;
}

.task-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.15s ease;
}

.task-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.task-checkbox input {
  width: 20px;
  height: 20px;
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
  margin: 0 0 0.25rem 0;
}

.task-description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
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

.meta-item.priority {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.meta-item.priority.low {
  background: #dbeafe;
  color: #1e40af;
}

.meta-item.priority.medium {
  background: #fef3c7;
  color: #92400e;
}

.meta-item.priority.high {
  background: #fee2e2;
  color: #dc2626;
}

.meta-item.priority.urgent {
  background: #fecaca;
  color: #b91c1c;
}

.meta-item.project {
  color: #6b7280;
}

.task-assignees {
  display: flex;
  gap: -0.125rem;
}

.assignee-avatar {
  width: 28px;
  height: 28px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 500;
  border: 2px solid white;
}

.assignee-avatar.more {
  background: #f3f4f6;
  color: #9ca3af;
}
</style>
