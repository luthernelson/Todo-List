<template>
  <div class="onboarding-wizard">
    <div class="wizard-container">
      <!-- Progress Steps -->
      <div class="wizard-progress">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :class="['step-item', { active: currentStep === index, completed: currentStep > index }]"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.title }}</div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="wizard-content">
        <div v-if="currentStep === 0" class="step-content">
          <h2>Bienvenue sur WorkStream! 🎉</h2>
          <p>Configurons votre espace de travail en quelques secondes.</p>
          <div class="welcome-illustration">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
              <path d="M9 12h6"/>
              <path d="M12 9v6"/>
            </svg>
          </div>
        </div>

        <div v-if="currentStep === 1" class="step-content">
          <h2>Quel type d'espace voulez-vous?</h2>
          <p>Choisissez selon votre utilisation principale</p>
          <div class="account-type-options">
            <div
              :class="['type-card', { selected: selectedAccountType === 'personal' }]"
              @click="selectedAccountType = 'personal'"
            >
              <div class="type-icon">👤</div>
              <h3>Personnel</h3>
              <p>Pour vos projets personnels et tâches individuelles</p>
            </div>
            <div
              :class="['type-card', { selected: selectedAccountType === 'business_owner' }]"
              @click="selectedAccountType = 'business_owner'"
            >
              <div class="type-icon">🏢</div>
              <h3>Entreprise (Propriétaire)</h3>
              <p>Créez et gérez votre entreprise avec votre équipe</p>
            </div>
            <div
              :class="['type-card', { selected: selectedAccountType === 'business_member' }]"
              @click="selectedAccountType = 'business_member'"
            >
              <div class="type-icon">👥</div>
              <h3>Entreprise (Membre)</h3>
              <p>Rejoignez une entreprise existante</p>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="step-content">
          <h2>Créons votre premier projet</h2>
          <p>Commencez simplement, vous pourrez l'éditer plus tard</p>
          <div class="form-group">
            <label>Nom du projet</label>
            <input v-model="firstProject.name" type="text" class="input" placeholder="Ex: Site Web E-commerce" />
          </div>
          <div class="form-group">
            <label>Description (optionnel)</label>
            <textarea v-model="firstProject.description" class="textarea" placeholder="Une brève description..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Couleur</label>
            <div class="color-picker">
              <div
                v-for="color in projectColors"
                :key="color"
                :class="['color-option', { selected: firstProject.color === color }]"
                :style="{ background: color }"
                @click="firstProject.color = color"
              ></div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="step-content">
          <h2>Invitez votre équipe (optionnel)</h2>
          <p>Vous pourrez le faire plus tard aussi</p>
          <div class="form-group">
            <label>Email des membres</label>
            <div class="member-inputs">
              <div v-for="(email, index) in memberEmails" :key="index" class="member-input-row">
                <input v-model="memberEmails[index]" type="email" class="input" placeholder="email@exemple.com" />
                <button @click="removeMemberEmail(index)" class="btn btn-ghost btn-sm">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
              <button @click="addMemberEmail" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-plus"></i> Ajouter un membre
              </button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 4" class="step-content">
          <h2>Vous êtes prêt! 🚀</h2>
          <p>WorkStream est configuré et prêt à l'emploi.</p>
          <div class="success-illustration">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="summary">
            <p><strong>Type de compte:</strong> {{ getAccountTypeLabel(selectedAccountType) }}</p>
            <p v-if="firstProject.name"><strong>Premier projet:</strong> {{ firstProject.name }}</p>
            <p v-if="memberEmails.length > 0"><strong>Membres invités:</strong> {{ memberEmails.length }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="wizard-footer">
        <button
          v-if="currentStep > 0"
          @click="previousStep"
          class="btn btn-secondary"
        >
          Précédent
        </button>
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          class="btn btn-primary"
          :disabled="!canProceed"
        >
          Suivant
        </button>
        <button
          v-else
          @click="completeOnboarding"
          class="btn btn-primary"
        >
          Commencer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'

const emit = defineEmits(['complete'])

const router = useRouter()
const userStore = useUserStore()
const projectStore = useProjectStore()

const currentStep = ref(0)
const selectedAccountType = ref('personal')
const firstProject = ref({
  name: '',
  description: '',
  color: '#293848',
})
const memberEmails = ref([])

const projectColors = ['#293848', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6']

const steps = [
  { title: 'Bienvenue' },
  { title: 'Type de compte' },
  { title: 'Premier projet' },
  { title: 'Équipe' },
  { title: 'Terminé' },
]

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return selectedAccountType.value !== null
  }
  if (currentStep.value === 2) {
    return firstProject.value.name.trim() !== ''
  }
  return true
})

const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const addMemberEmail = () => {
  memberEmails.value.push('')
}

const removeMemberEmail = (index) => {
  memberEmails.value.splice(index, 1)
}

const getAccountTypeLabel = (type) => {
  const labels = {
    personal: 'Personnel',
    business_owner: 'Entreprise (Propriétaire)',
    business_member: 'Entreprise (Membre)',
  }
  return labels[type] || type
}

const completeOnboarding = () => {
  // Mettre à jour le type de compte de l'utilisateur
  if (userStore.user) {
    userStore.user.accountType = selectedAccountType.value
    userStore.user.mode = selectedAccountType.value === 'personal' ? 'perso' : 'pro'
  }

  // Créer le premier projet si fourni
  if (firstProject.value.name) {
    projectStore.addProject({
      name: firstProject.value.name,
      description: firstProject.value.description,
      mode: selectedAccountType.value === 'personal' ? 'personal' : 'professional',
      color: firstProject.value.color,
      tasks: [],
    })
  }

  // Marquer l'onboarding comme terminé
  localStorage.setItem('onboardingCompleted', 'true')

  emit('complete')
  router.push('/')
}
</script>

<style scoped>
.onboarding-wizard {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  padding: 2rem;
}

.wizard-container {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: var(--shadow-xl);
}

.wizard-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.wizard-progress::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--bg-tertiary);
  z-index: 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  color: var(--color-gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all var(--transition-base);
}

.step-item.active .step-number {
  background: var(--color-primary);
  color: white;
}

.step-item.completed .step-number {
  background: var(--color-success);
  color: white;
}

.step-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  font-weight: 500;
}

.step-item.active .step-label {
  color: var(--color-primary);
}

.wizard-content {
  min-height: 300px;
  margin-bottom: 2rem;
}

.step-content {
  text-align: center;
}

.step-content h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--color-gray-500);
  margin-bottom: 2rem;
}

.welcome-illustration,
.success-illustration {
  margin: 2rem auto;
  color: var(--color-primary);
}

.success-illustration {
  color: var(--color-success);
}

.account-type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.type-card {
  padding: 2rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.type-card:hover {
  border-color: var(--color-primary);
  background: var(--bg-secondary);
}

.type-card.selected {
  border-color: var(--color-primary);
  background: #F0F9FF;
}

.type-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.type-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.type-card p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin: 0;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
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
  transition: all var(--transition-base);
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: var(--color-gray-900);
}

.member-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.member-input-row {
  display: flex;
  gap: 0.5rem;
}

.member-input-row .input {
  flex: 1;
}

.summary {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  text-align: left;
  margin-top: 2rem;
}

.summary p {
  margin-bottom: 0.5rem;
  color: var(--color-gray-700);
}

.wizard-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .wizard-container {
    padding: 2rem;
  }

  .step-label {
    display: none;
  }

  .account-type-options {
    grid-template-columns: 1fr;
  }
}
</style>
