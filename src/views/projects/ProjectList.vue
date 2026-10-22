<template>
  <div class="project-list-container">
    <!-- Header simple -->
    <div class="header">
      <h1 class="page-title">
        {{ currentMode === 'professional' ? 'Projets Entreprise' : 'Projets Personnels' }}
      </h1>
      <LoadingButton
        text="Nouveau Projet"
        :loading="false"
        variant="primary"
        size="small"
        @click="showCreateProject = true"
      >
        <template #icon>
          <i class="fa-solid fa-plus"></i>
        </template>
      </LoadingButton>
    </div>

    <!-- Liste des projets -->
    <div v-if="isLoading" class="skeleton-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <SkeletonLoader variant="rectangular" :height="'60px'" :width="'60px'" :borderRadius="'0.5rem'" />
        <SkeletonLoader variant="text" :height="'1rem'" :width="'70%'" :random-width="true" />
        <SkeletonLoader variant="text" :height="'0.875rem'" :width="'90%'" :random-width="true" />
      </div>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fa-solid fa-folder-open"></i>
      </div>
      <h3>Aucun projet</h3>
      <p>Créez votre premier projet pour commencer</p>
      <LoadingButton
        text="Créer un projet"
        :loading="false"
        variant="primary"
        @click="showCreateProject = true"
      />
    </div>

    <div v-else class="projects-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @open="openProject"
        @edit="editProject"
        @delete="deleteProject"
      />
    </div>

    <!-- Modal de création de projet -->
    <CreateProjectModal
      v-if="showCreateProject"
      :mode="currentMode"
      @close="showCreateProject = false"
      @created="onProjectCreated"
    />

    <!-- Modal d'édition de projet -->
    <EditProjectModal
      v-if="showEditProject"
      :project="editingProject"
      @close="showEditProject = false"
      @updated="onProjectUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { WORK_MODES } from '@/types/projectModels'
import WorkModeSwitch from '@/components/projects/WorkModeSwitch.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import CreateProjectModal from '@/components/projects/CreateProjectModal.vue'
import EditProjectModal from '@/components/projects/EditProjectModal.vue'
import UserProfileSummary from '@/components/gamification/UserProfileSummary.vue'
import LoadingButton from '@/components/ui/LoadingButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const projectStore = useProjectStore()
const gamificationStore = useGamificationStore()

const showCreateProject = ref(false)
const showEditProject = ref(false)
const editingProject = ref(null)
const isLoading = ref(true)

const currentMode = computed(() => projectStore.currentWorkMode)

const filteredProjects = computed(() => {
  if (currentMode.value === WORK_MODES.PROFESSIONAL) {
    return projectStore.professionalProjects
  } else {
    return projectStore.personalProjects
  }
})

const openProject = (project) => {
  projectStore.setCurrentProject(project)
  // Naviguer vers la page de détail du projet
  // router.push(`/projects/${project.id}`)
}

const editProject = (project) => {
  editingProject.value = project
  showEditProject.value = true
}

const deleteProject = (project) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`)) {
    projectStore.deleteProject(project.id)
  }
}

const onProjectCreated = (project) => {
  showCreateProject.value = false
  projectStore.addProject(project)
}

const onProjectUpdated = (project) => {
  showEditProject.value = false
  projectStore.updateProject(project.id, project)
}

onMounted(() => {
  // Simuler un chargement
  setTimeout(() => {
    isLoading.value = false
  }, 1000)

  // Charger les projets depuis l'API ou localStorage
  // Pour l'instant, on utilise des données mock détaillées pour le mode sans backend
  const mockProjects = [
    {
      id: 1,
      name: 'Site Web E-commerce',
      description: 'Développement complet d\'un site e-commerce avec panier et paiement',
      mode: WORK_MODES.PROFESSIONAL,
      color: '#293848',
      icon: 'code',
      ownerId: 1,
      members: [
        {
          id: 1,
          userId: 1,
          username: 'Admin',
          email: 'admin@taskflow.com',
          role: 'owner',
          status: 'active',
          joinedAt: new Date().toISOString(),
        },
        {
          id: 2,
          userId: 2,
          username: 'Marie Dev',
          email: 'marie@taskflow.com',
          role: 'admin',
          status: 'active',
          joinedAt: new Date().toISOString(),
        },
        {
          id: 3,
          userId: 3,
          username: 'Jean Designer',
          email: 'jean@taskflow.com',
          role: 'member',
          status: 'active',
          joinedAt: new Date().toISOString(),
        },
      ],
      phases: [
        { id: 1, projectId: 1, name: 'Analyse', color: '#293848', order: 1, isDefault: true },
        { id: 2, projectId: 1, name: 'Conception', color: '#8B5CF6', order: 2, isDefault: true },
        { id: 3, projectId: 1, name: 'Développement', color: '#10B981', order: 3, isDefault: true },
        { id: 4, projectId: 1, name: 'Tests', color: '#F59E0B', order: 4, isDefault: true },
        { id: 5, projectId: 1, name: 'Déploiement', color: '#EF4444', order: 5, isDefault: true },
      ],
      tasks: [
        {
          id: 1,
          projectId: 1,
          phaseId: 1,
          title: 'Analyse des besoins',
          description: 'Recueillir les besoins du client et définir les fonctionnalités',
          instructions: 'Rencontrer le client et documenter ses exigences',
          status: 'done',
          priority: 'high',
          assignees: [
            { userId: 1, username: 'Admin', instructions: 'Lancer le projet' },
            { userId: 2, username: 'Marie Dev', instructions: 'Participer aux réunions' },
          ],
          tags: ['analyse', 'client'],
          subtasks: [
            { id: 1, title: 'Réunion client', completed: true },
            { id: 2, title: 'Document spécifications', completed: true },
          ],
          timeTracking: { estimatedHours: 8, actualHours: 6, remainingHours: 2 },
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          projectId: 1,
          phaseId: 2,
          title: 'Design de l\'interface',
          description: 'Créer les maquettes et prototypes de l\'interface utilisateur',
          instructions: 'Suivre les guidelines de design du client',
          status: 'in_progress',
          priority: 'high',
          assignees: [
            { userId: 3, username: 'Jean Designer', instructions: 'Créer les maquettes Figma' },
          ],
          tags: ['design', 'ui'],
          subtasks: [
            { id: 1, title: 'Wireframes', completed: true },
            { id: 2, title: 'Maquettes haute fidélité', completed: false },
            { id: 3, title: 'Prototypes interactifs', completed: false },
          ],
          timeTracking: { estimatedHours: 16, actualHours: 8, remainingHours: 8 },
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          projectId: 1,
          phaseId: 3,
          title: 'Développement frontend',
          description: 'Implémenter l\'interface avec Vue.js',
          instructions: 'Suivre les best practices Vue.js',
          status: 'todo',
          priority: 'high',
          assignees: [
            { userId: 2, username: 'Marie Dev', instructions: 'Développer les composants' },
          ],
          tags: ['développement', 'vuejs'],
          subtasks: [
            { id: 1, title: 'Setup du projet', completed: false },
            { id: 2, title: 'Composants de base', completed: false },
            { id: 3, title: 'Intégration API', completed: false },
          ],
          timeTracking: { estimatedHours: 24, actualHours: 0, remainingHours: 24 },
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      name: 'Rénovation Cuisine',
      description: 'Projet de rénovation complète de la cuisine',
      mode: WORK_MODES.PERSONAL,
      color: '#10B981',
      icon: 'home',
      ownerId: 1,
      members: [
        {
          id: 1,
          userId: 1,
          username: 'Admin',
          email: 'admin@taskflow.com',
          role: 'owner',
          status: 'active',
          joinedAt: new Date().toISOString(),
        },
      ],
      phases: [
        { id: 1, projectId: 2, name: 'À planifier', color: '#6B7280', order: 1, isDefault: true },
        { id: 2, projectId: 2, name: 'En cours', color: '#293848', order: 2, isDefault: true },
        { id: 3, projectId: 2, name: 'En attente', color: '#F59E0B', order: 3, isDefault: true },
        { id: 4, projectId: 2, name: 'Terminé', color: '#10B981', order: 4, isDefault: true },
      ],
      tasks: [
        {
          id: 4,
          projectId: 2,
          phaseId: 1,
          title: 'Choisir les matériaux',
          description: 'Sélectionner les carrelages, peinture et équipements',
          instructions: 'Comparer les prix et qualité',
          status: 'done',
          priority: 'medium',
          assignees: [
            { userId: 1, username: 'Admin', instructions: 'Faire les devis' },
          ],
          tags: ['matériaux', 'budget'],
          subtasks: [
            { id: 1, title: 'Visiter showrooms', completed: true },
            { id: 2, title: 'Comparer devis', completed: true },
          ],
          timeTracking: { estimatedHours: 4, actualHours: 3, remainingHours: 1 },
          dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 5,
          projectId: 2,
          phaseId: 2,
          title: 'Demander les devis',
          description: 'Contacter les artisans pour obtenir des devis',
          instructions: 'Demander 3 devis minimum par corps de métier',
          status: 'in_progress',
          priority: 'high',
          assignees: [
            { userId: 1, username: 'Admin', instructions: 'Relancer les non-répondants' },
          ],
          tags: ['artisans', 'devis'],
          subtasks: [
            { id: 1, title: 'Plombier', completed: true },
            { id: 2, title: 'Électricien', completed: true },
            { id: 3, title: 'Menuisier', completed: false },
            { id: 4, title: 'Peintre', completed: false },
          ],
          timeTracking: { estimatedHours: 8, actualHours: 4, remainingHours: 4 },
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  projectStore.setProjects(mockProjects)

  // Initialiser le profil gamification avec des données de base
  gamificationStore.loadFromStorage()
  if (!gamificationStore.userProfile) {
    gamificationStore.initUserProfile(1)
    // Donner du XP initial pour tester
    gamificationStore.addXP(500)
    gamificationStore.completeTask()
    gamificationStore.completeTask()
    gamificationStore.completeTask()
  }
})
</script>

<style scoped>
.project-list-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .project-list-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
