<template>
  <div class="onboarding-container">
    <div class="onboarding-content">
      <!-- Étape 1: Bienvenue -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="welcome-card">
          <div class="logo-section">
            <div class="logo-icon">
              <svg width="100" height="100" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="28" fill="url(#gradient1)"/>
                <path d="M18 30L26 38L42 22" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#293848"/>
                    <stop offset="100%" style="stop-color:#10B981"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="app-name">Workstream</h1>
          </div>

          <div class="welcome-section">
            <h2>Bienvenue sur Workstream !</h2>
            <p>Organisez vos projets, collaborez avec votre équipe et atteignez vos objectifs plus efficacement.</p>
          </div>

          <div class="features-preview">
            <div class="feature-item">
              <i class="fa-solid fa-folder-open"></i>
              <span>Organisation</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-users"></i>
              <span>Collaboration</span>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-chart-line"></i>
              <span>Analyse</span>
            </div>
          </div>

          <div class="step-actions">
            <button @click="nextStep" class="btn-primary">
              Commencer
            </button>
            <button @click="skipOnboarding" class="btn-secondary">
              Passer
            </button>
          </div>
        </div>
      </div>

      <!-- Étape 2: Choix du type de projet -->
      <div v-if="currentStep === 2" class="step-content">
        <h2>Créez votre premier projet</h2>
        <p>Quel type de projet souhaitez-vous créer ?</p>

        <div class="project-type-selector">
          <button
            type="button"
            @click="selectProjectType('personal')"
            :class="['type-card', { active: projectForm.mode === 'personal' }]"
            :style="{ '--active-color': '#10B981', '--active-bg': '#D1FAE5' }"
          >
            <div class="type-icon" :style="{ background: projectForm.mode === 'personal' ? '#10B981' : '#E5E7EB' }">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3>Personnel</h3>
            <p>Pour vos projets personnels et loisirs</p>
          </button>

          <button
            type="button"
            @click="selectProjectType('professional')"
            :class="['type-card', { active: projectForm.mode === 'professional' }]"
            :style="{ '--active-color': '#293848', '--active-bg': '#E0E7FF' }"
          >
            <div class="type-icon" :style="{ background: projectForm.mode === 'professional' ? '#293848' : '#E5E7EB' }">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <h3>Professionnel</h3>
            <p>Pour vos projets d'entreprise</p>
          </button>

          <button
            type="button"
            @click="selectProjectType('community')"
            :class="['type-card', { active: projectForm.mode === 'community' }]"
            :style="{ '--active-color': '#8B5CF6', '--active-bg': '#EDE9FE' }"
          >
            <div class="type-icon" :style="{ background: projectForm.mode === 'community' ? '#8B5CF6' : '#E5E7EB' }">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3>Communautaire</h3>
            <p>Pour des projets collaboratifs</p>
          </button>
        </div>

        <div class="step-actions">
          <button @click="skipOnboarding" class="btn-secondary">
            Passer
          </button>
          <button @click="nextStep" class="btn-primary">
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 3: Détails du projet -->
      <div v-if="currentStep === 3" class="step-content">
        <h2>Détails du projet</h2>
        <p>Donnez un nom et une description à votre projet</p>

        <div class="form-group">
          <label>Nom du projet</label>
          <input
            v-model="projectForm.name"
            type="text"
            placeholder="Ex: Site Web E-commerce"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="projectForm.description"
            placeholder="Décrivez votre projet..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Icône du projet</label>
          <div class="icon-uploader">
            <div v-if="projectForm.iconPreview" class="icon-preview">
              <img :src="projectForm.iconPreview" alt="Icon preview" />
              <button @click="removeIcon" class="btn-remove-icon">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div v-else class="icon-upload-placeholder" @click="$refs.iconInput.click()">
              <i class="fa-solid fa-cloud-upload-alt"></i>
              <span>Uploader une icône</span>
            </div>
            <input
              ref="iconInput"
              type="file"
              accept="image/*"
              @change="handleIconUpload"
              style="display: none"
            />
          </div>
        </div>

        <div class="step-actions">
          <button @click="previousStep" class="btn-secondary">
            Retour
          </button>
          <button @click="nextStep" class="btn-primary">
            Suivant
          </button>
        </div>
      </div>

      <!-- Étape 4: Tâches initiales (optionnel) -->
      <div v-if="currentStep === 4" class="step-content">
        <h2>Ajoutez vos premières tâches</h2>
        <p>Cette étape est optionnelle, vous pourrez ajouter des tâches plus tard</p>

        <div class="tasks-list">
          <div
            v-for="(task, index) in projectForm.tasks"
            :key="index"
            class="task-item"
          >
            <input
              v-model="task.title"
              type="text"
              placeholder="Tâche..."
            />
            <button @click="removeTask(index)" class="btn-remove">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <button @click="addTask" class="btn-add-task">
          <i class="fa-solid fa-plus"></i>
          Ajouter une tâche
        </button>

        <div class="step-actions">
          <button @click="previousStep" class="btn-secondary">
            Retour
          </button>
          <button @click="skipStep" class="btn-secondary">
            Passer
          </button>
          <button @click="finishOnboarding" class="btn-primary" :disabled="loading">
            {{ loading ? 'Création...' : 'Terminer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const projectStore = useProjectStore()
const toastStore = useToastStore()
const userStore = useUserStore()

const currentStep = ref(1)
const totalSteps = 4
const loading = ref(false)

const projectForm = ref({
  name: '',
  description: '',
  mode: 'personal',
  color: '#10B981',
  icon: null,
  iconPreview: null,
  tasks: [],
})

const projectColors = [
  '#293848',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
]

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectProjectType = (type) => {
  projectForm.value.mode = type
  // Changer la couleur selon le type
  if (type === 'personal') {
    projectForm.value.color = '#10B981'
  } else if (type === 'professional') {
    projectForm.value.color = '#293848'
  } else if (type === 'community') {
    projectForm.value.color = '#8B5CF6'
  }
}

const skipStep = () => {
  // Passer l'étape des tâches et aller directement à la fin
  finishOnboarding()
}

const addTask = () => {
  projectForm.value.tasks.push({ title: '', completed: false })
}

const removeTask = (index) => {
  projectForm.value.tasks.splice(index, 1)
}

const handleIconUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      projectForm.value.iconPreview = e.target.result
      projectForm.value.icon = file
    }
    reader.readAsDataURL(file)
  }
}

const removeIcon = () => {
  projectForm.value.icon = null
  projectForm.value.iconPreview = null
}

const finishOnboarding = async () => {
  loading.value = true

  try {
    // Marquer l'onboarding comme terminé AVANT la redirection
    userStore.completeFirstLogin()

    // Créer le projet si un nom est fourni
    if (projectForm.value.name) {
      const newProject = projectStore.addProject({
        id: Date.now(), // Générer un ID unique
        name: projectForm.value.name,
        description: projectForm.value.description,
        mode: projectForm.value.mode,
        color: projectForm.value.color,
        icon: projectForm.value.iconPreview ? 'custom' : 'folder',
        tasks: projectForm.value.tasks.filter(t => t.title.trim()),
      })

      toastStore.success('Bienvenue sur Workstream !')

      // Rediriger vers le détail du projet ou le dashboard
      if (newProject && newProject.id) {
        console.log('Redirection vers le projet:', newProject.id)
        await router.push(`/projects/${newProject.id}`)
      } else {
        console.log('Redirection vers le dashboard')
        await router.push('/')
      }
    } else {
      // Pas de projet créé, aller directement au dashboard
      toastStore.success('Bienvenue sur Workstream !')
      console.log('Redirection vers le dashboard (sans projet)')
      await router.push('/')
    }
  } catch (error) {
    toastStore.error('Erreur lors de la création')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const skipOnboarding = async () => {
  // Marquer l'onboarding comme terminé
  userStore.completeFirstLogin()

  // Rediriger vers le dashboard
  console.log('Redirection vers le dashboard (skip)')
  await router.push('/')
}
</script>

<style scoped>
.onboarding-container {
  min-height: 100vh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.onboarding-content {
  max-width: 600px;
  width: 100%;
  padding: 2.5rem;
}

/* Step content */
.step-content {
  min-height: 400px;
}

/* Étape 1: Bienvenue */
.welcome-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.app-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: #293848;
  margin: 0;
  letter-spacing: -1px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.75rem;
}

.welcome-section p {
  color: #6B7280;
  font-size: 1rem;
  line-height: 1.6;
}

.features-preview {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.feature-item i {
  font-size: 1.5rem;
  color: #293848;
}

/* Étape 2: Type de projet */
.step-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
  text-align: center;
}

.step-content > p {
  color: #6B7280;
  text-align: center;
  margin-bottom: 2rem;
}

.project-type-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-card {
  padding: 1.5rem;
  border: 2px solid #E5E7EB;
  border-radius: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.type-card:hover {
  border-color: #667eea;
  background: #F0F9FF;
}

.type-card.active {
  border-color: var(--active-color, #667eea);
  background: var(--active-bg, #E0E7FF);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.type-card.active .type-icon {
  background: var(--active-color, #667eea);
}

.type-icon {
  width: 48px;
  height: 48px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.type-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.type-card p {
  color: #6B7280;
  font-size: 0.875rem;
  margin: 0;
}

/* Étape 3: Formulaire */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 0.875rem;
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.color-selector {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #1F2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.2);
}

/* Étape 4: Tâches */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  gap: 0.75rem;
}

.task-item input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.btn-remove {
  padding: 0.5rem;
  background: #FEF2F2;
  border: 2px solid #FECACA;
  border-radius: 0.5rem;
  color: #EF4444;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #FEE2E2;
}

.btn-add-task {
  width: 100%;
  padding: 0.75rem;
  background: #F0F9FF;
  border: 2px dashed #BAE6FD;
  border-radius: 0.75rem;
  color: #0369A1;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-task:hover {
  background: #E0F2FE;
  border-color: #7DD3FC;
}

/* Actions */
.step-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.step-actions button {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #6B7280;
  border: 2px solid #E5E7EB;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Responsive */
@media (max-width: 768px) {
  .onboarding-container {
    padding: 1rem;
  }

  .onboarding-content {
    padding: 1.5rem;
  }

  .app-name {
    font-size: 2rem;
  }

  .step-content h2 {
    font-size: 1.25rem;
  }

  .features-preview {
    flex-direction: column;
    gap: 1rem;
  }

  .step-actions {
    flex-direction: column;
  }
}
</style>
