<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="ai-assistant-section">
        <div class="ai-header">
          <div class="ai-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div>
            <h1>Comment pouvons-nous vous aider aujourd'hui ?</h1>
            <p>Décrivez votre projet ou votre tâche, et notre IA vous guidera</p>
          </div>
        </div>

        <div class="ai-input-container">
          <textarea
            v-model="aiQuery"
            class="ai-input"
            placeholder="Ex: Je veux créer un site e-commerce pour vendre des vêtements..."
            rows="4"
            @keydown.enter.prevent="handleAIQuery"
          ></textarea>
          <button @click="handleAIQuery" class="ai-submit-btn" :disabled="!aiQuery.trim() || loading">
            <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <svg v-else class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20">
                <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </button>
        </div>

        <div v-if="aiResponse" class="ai-response">
          <div class="response-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Suggestion de l'IA</span>
          </div>
          <div class="response-content">
            {{ aiResponse }}
          </div>
          <div class="response-actions">
            <button @click="createProjectFromAI" class="btn-primary">
              Créer ce projet
            </button>
            <button @click="aiResponse = ''" class="btn-secondary">
              Ignorer
            </button>
          </div>
        </div>

        <!-- Suggestions rapides -->
        <div class="quick-suggestions">
          <p class="suggestions-title">Suggestions rapides :</p>
          <div class="suggestions-grid">
            <button
              v-for="suggestion in quickSuggestions"
              :key="suggestion"
              @click="aiQuery = suggestion"
              class="suggestion-btn"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <!-- Projets récents -->
      <div class="recent-projects">
        <div class="section-header">
          <h2>Projets récents</h2>
          <RouterLink to="/projects" class="view-all">Voir tout</RouterLink>
        </div>

        <div v-if="recentProjects.length === 0" class="empty-state">
          <p>Aucun projet récent</p>
          <RouterLink to="/projects" class="create-link">Créer un projet</RouterLink>
        </div>

        <div v-else class="projects-list">
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="project-item"
            @click="$router.push(`/projects/${project.id}`)"
          >
            <div class="project-dot" :style="{ background: project.color }"></div>
            <div class="project-info">
              <h3>{{ project.name }}</h3>
              <p>{{ project.description || 'Aucune description' }}</p>
            </div>
            <div class="project-progress">
              <div class="progress">
                <div class="progress-bar" :style="{ width: getProjectProgress(project) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getProjectProgress(project) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'

const projectStore = useProjectStore()
const router = useRouter()
const toastStore = useToastStore()
const userStore = useUserStore()

const aiQuery = ref('')
const aiResponse = ref('')
const loading = ref(false)

const quickSuggestions = ref([
  'Créer un site web e-commerce',
  'Organiser un événement professionnel',
  'Gérer un projet de rénovation',
  'Lancer une campagne marketing',
])

const recentProjects = computed(() => {
  return projectStore.projects.slice(0, 5)
})

const getProjectProgress = (project) => {
  if (!project.tasks || project.tasks.length === 0) return 0
  const completed = project.tasks.filter(t => t.status === 'done').length
  return Math.round((completed / project.tasks.length) * 100)
}

const handleAIQuery = async () => {
  if (!aiQuery.value.trim()) return

  loading.value = true

  // Simulation de réponse IA
  setTimeout(() => {
    aiResponse.value = `Basé sur votre demande "${aiQuery.value}", je vous suggère de créer un projet avec les phases suivantes : Analyse, Planification, Exécution, et Suivi. Voulez-vous que je crée ce projet pour vous ?`
    loading.value = false
  }, 1500)
}

const createProjectFromAI = () => {
  const newProject = projectStore.addProject({
    name: aiQuery.value.substring(0, 50) + '...',
    description: aiQuery.value,
    mode: 'personal',
    color: '#293848',
  })

  toastStore.success('Projet créé avec succès !')
  aiQuery.value = ''
  aiResponse.value = ''

  router.push(`/projects/${newProject.id}`)
}

onMounted(() => {
  // Vérifier si c'est la première connexion et rediriger vers l'onboarding
  if (userStore.isFirstLogin) {
    router.push('/onboarding')
    return
  }

  // Charger les projets existants
  if (projectStore.projects.length === 0) {
    // Charger des données mock si nécessaire
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f9fafb;
  padding: 0;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* AI Assistant Section */
.ai-assistant-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.ai-icon {
  width: 48px;
  height: 48px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.ai-header h1 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.ai-header p {
  color: #6B7280;
  font-size: 0.95rem;
  margin: 0;
}

.ai-input-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.ai-input {
  width: 100%;
  padding: 0.875rem 3.5rem 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9375rem;
  line-height: 1.5;
  resize: none;
  transition: all 0.15s ease;
  font-family: inherit;
}

.ai-input:focus {
  outline: none;
  border-color: #374151;
  box-shadow: 0 0 0 2px rgba(55, 65, 81, 0.05);
}

.ai-submit-btn {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  width: 32px;
  height: 32px;
  background: #374151;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.ai-submit-btn:hover:not(:disabled) {
  background: #1f2937;
}

.ai-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ai-response {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.response-content {
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.response-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #e5e7eb;
}

.btn-primary {
  background: #374151;
  color: white;
  border-color: #374151;
}

.btn-primary:hover {
  background: #1f2937;
  border-color: #1f2937;
}

.btn-secondary {
  background: white;
  color: #6b7280;
}

.btn-secondary:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* Quick Suggestions */
.quick-suggestions {
  margin-top: 1.5rem;
}

.suggestions-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 0.75rem;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-btn {
  padding: 0.5rem 1rem;
  background: #F3F4F6;
  border: 2px solid transparent;
  border-radius: 2rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-btn:hover {
  background: #E5E7EB;
  border-color: #D1D5DB;
}

/* Recent Projects */
.recent-projects {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1F2937;
  margin: 0;
}

.view-all {
  color: #293848;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6B7280;
}

.create-link {
  color: #293848;
  font-weight: 600;
  text-decoration: none;
}

.create-link:hover {
  text-decoration: underline;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.project-item:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.project-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.project-info p {
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.progress {
  flex: 1;
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #374151;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  min-width: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .ai-assistant-section {
    padding: 1.5rem;
  }

  .ai-header {
    flex-direction: column;
    text-align: center;
  }

  .ai-header h1 {
    font-size: 1.25rem;
  }

  .ai-input {
    padding: 1rem 3rem 1rem 1rem;
  }

  .suggestions-grid {
    flex-direction: column;
  }

  .suggestion-btn {
    width: 100%;
  }
}
</style>
