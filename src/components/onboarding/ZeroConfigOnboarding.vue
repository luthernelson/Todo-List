<template>
  <div class="onboarding-overlay" v-if="showOnboarding">
    <div class="onboarding-container">
      <div class="onboarding-header">
        <div class="logo-section">
          <div class="logo-icon">
            <Rocket :size="48" />
          </div>
          <h1>Bienvenue sur WorkStream !</h1>
          <p>Configurons votre espace en quelques secondes</p>
        </div>
        <button @click="skipOnboarding" class="btn-skip">
          Passer
        </button>
      </div>

      <div class="onboarding-content">
        <!-- Step 1: Create First Project -->
        <div v-if="currentStep === 1" class="step-content slide-up">
          <h2>Créons votre premier projet</h2>
          <form @submit.prevent="goToNextStep" class="onboarding-form">
            <div class="form-group">
              <label>Nom du projet</label>
              <input
                v-model="formData.projectName"
                type="text"
                placeholder="Ex: Mes tâches personnelles"
                required
              />
            </div>
            <div class="form-group">
              <label>Description (optionnel)</label>
              <textarea
                v-model="formData.projectDescription"
                placeholder="Décrivez votre projet..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Couleur du projet</label>
              <div class="color-picker">
                <div
                  v-for="color in projectColors"
                  :key="color"
                  @click="formData.projectColor = color"
                  :class="['color-option', { selected: formData.projectColor === color }]"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
            </div>
          </form>
        </div>

        <!-- Step 3: First Tasks (for both) -->
        <div v-if="currentStep === 3" class="step-content slide-up">
          <h2>Ajoutons quelques tâches d'exemple</h2>
          <p class="step-description">Voici quelques tâches courantes pour commencer</p>
          
          <div class="example-tasks">
            <div
              v-for="task in exampleTasks"
              :key="task.id"
              @click="toggleTask(task.id)"
              :class="['task-item', { selected: selectedTasks.includes(task.id) }]"
            >
              <div class="task-checkbox">
                <Check v-if="selectedTasks.includes(task.id)" :size="20" />
                <div v-else class="checkbox-empty"></div>
              </div>
              <div class="task-info">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Completion -->
        <div v-if="currentStep === 3" class="step-content slide-up">
          <div class="completion-animation">
            <div class="success-icon">
              <CheckCircle :size="80" />
            </div>
            <h2>Tout est prêt ! 🎉</h2>
            <p class="completion-message">
              Votre espace est configuré et prêt à l'emploi.
              Vous pouvez commencer à gérer vos tâches et projets.
            </p>
            <div class="next-steps">
              <div class="next-step-item">
                <Folder :size="24" />
                <span>Créer votre premier projet</span>
              </div>
              <div class="next-step-item">
                <PlusCircle :size="24" />
                <span>Ajouter des tâches</span>
              </div>
              <div class="next-step-item">
                <UserPlus :size="24" />
                <span>Partager vos projets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="onboarding-footer">
        <div class="progress-indicator">
          <div
            v-for="step in totalSteps"
            :key="step"
            :class="['progress-dot', { active: step === currentStep, completed: step < currentStep }]"
          ></div>
        </div>
        <div class="footer-actions">
          <button
            v-if="currentStep > 1 && currentStep < 4"
            @click="goToPreviousStep"
            class="btn-secondary"
          >
            Précédent
          </button>
          <button
            v-if="currentStep < 3"
            @click="goToNextStep"
            class="btn-primary"
            :disabled="!canProceed"
          >
            {{ currentStep === 2 ? 'Terminer' : 'Suivant' }}
          </button>
          <button
            v-if="currentStep === 3"
            @click="completeOnboarding"
            class="btn-primary"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import { useCompanyStore } from '@/stores/companyStore'
import { useActivityStore } from '@/stores/activityStore'
import {
  Rocket,
  User,
  Building,
  Check,
  CheckCircle,
  Folder,
  PlusCircle,
  UserPlus,
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const projectStore = useProjectStore()
const companyStore = useCompanyStore()
const activityStore = useActivityStore()

const showOnboarding = ref(true)
const currentStep = ref(1)
const totalSteps = 3

const formData = ref({
  projectName: '',
  projectDescription: '',
  projectColor: '#667eea',
})

const selectedTasks = ref([])

const projectColors = [
  '#667eea',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
]

const exampleTasks = [
  {
    id: 1,
    title: 'Explorer l\'interface',
    description: 'Découvrez les différentes fonctionnalités de WorkStream',
  },
  {
    id: 2,
    title: 'Créer votre première tâche',
    description: 'Ajoutez une tâche pour organiser votre travail',
  },
  {
    id: 3,
    title: 'Configurer vos préférences',
    description: 'Personnalisez votre espace de travail',
  },
]

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return !!formData.value.projectName
  }
  if (currentStep.value === 2) {
    return selectedTasks.value.length > 0
  }
  return true
})

const toggleTask = (taskId) => {
  const index = selectedTasks.value.indexOf(taskId)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const goToNextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipOnboarding = () => {
  showOnboarding.value = false
  router.push('/dashboard')
}

const completeOnboarding = () => {
  // Create the first project
  const project = projectStore.createProject({
    name: formData.value.projectName,
    description: formData.value.projectDescription,
    color: formData.value.projectColor,
    tasks: [],
  })
  
  activityStore.addProjectCreated(
    project.id,
    project.name,
    userStore.idUser,
    userStore.username
  )
  
  // Mark first login as complete
  userStore.completeFirstLogin()
  
  router.push('/dashboard')
  showOnboarding.value = false
}
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.onboarding-container {
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.onboarding-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.logo-section {
  text-align: center;
  flex: 1;
}

.logo-icon {
  color: #667eea;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.logo-section h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.logo-section p {
  color: #6b7280;
  font-size: 1rem;
}

.btn-skip {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-skip:hover {
  background: #f3f4f6;
  color: #374151;
}

.onboarding-content {
  padding: 2rem;
  min-height: 400px;
}

.step-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

.step-description {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

.account-type-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.account-type-card {
  padding: 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.account-type-card:hover {
  border-color: #667eea;
  background: #f9fafb;
  transform: translateY(-4px);
}

.account-type-card.selected {
  border-color: #667eea;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.card-icon {
  color: #667eea;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.account-type-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.account-type-card p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.onboarding-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.color-picker {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #1f2937;
}

.example-tasks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.task-item.selected {
  border-color: #10b981;
  background: #ecfdf5;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

.checkbox-empty {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
}

.task-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.task-info p {
  font-size: 0.75rem;
  color: #6b7280;
}

.completion-animation {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  color: #10b981;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  animation: scaleIn 0.5s ease-out;
}

.completion-animation h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.completion-message {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.next-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

.next-step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.next-step-item:first-child {
  color: #667eea;
}

.onboarding-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-indicator {
  display: flex;
  gap: 0.5rem;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: all 0.3s;
}

.progress-dot.active {
  background: #667eea;
  width: 24px;
  border-radius: 4px;
}

.progress-dot.completed {
  background: #10b981;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .account-type-options {
    grid-template-columns: 1fr;
  }

  .onboarding-header {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .onboarding-footer {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
