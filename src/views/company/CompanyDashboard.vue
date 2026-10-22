<template>
  <div class="company-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Entreprise</h1>
        <p class="subtitle">Gérez votre entreprise et votre équipe</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showCreateCompanyModal = true">
          <i class="fa-solid fa-plus"></i>
          Créer une entreprise
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="card stat-card">
        <div class="stat-content">
          <p class="stat-label">Membres</p>
          <p class="stat-value">{{ companyStats.members }}</p>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-content">
          <p class="stat-label">Projets</p>
          <p class="stat-value">{{ companyStats.projects }}</p>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-content">
          <p class="stat-label">Abonnement</p>
          <p class="stat-value">{{ companyStats.subscription }}</p>
        </div>
      </div>
      <div class="card stat-card">
        <div class="stat-content">
          <p class="stat-label">Budget mensuel</p>
          <p class="stat-value">{{ companyStats.budget }}</p>
        </div>
      </div>
    </div>

    <!-- Company List or Detail -->
    <div v-if="!selectedCompany" class="companies-section">
      <div class="card">
        <div class="card-header">
          <h2>Vos entreprises</h2>
        </div>
        <div v-if="companies.length === 0" class="empty-state">
          <p>Vous n'avez pas encore d'entreprise</p>
          <button class="btn btn-primary" @click="showCreateCompanyModal = true">
            Créer votre première entreprise
          </button>
        </div>
        <div v-else class="companies-list">
          <div
            v-for="company in companies"
            :key="company.id"
            class="company-item"
            @click="selectCompany(company)"
          >
            <div class="company-logo">
              {{ company.name.charAt(0).toUpperCase() }}
            </div>
            <div class="company-info">
              <h3>{{ company.name }}</h3>
              <p>{{ company.industry || 'Non spécifié' }}</p>
              <div class="company-meta">
                <span class="badge badge-primary">{{ company.size || 'Small' }}</span>
                <span class="date">{{ formatDate(company.createdAt) }}</span>
              </div>
            </div>
            <div class="company-progress">
              <div class="progress">
                <div class="progress-bar" :style="{ width: company.usage + '%' }"></div>
              </div>
              <span class="progress-text">{{ company.usage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Detail View -->
    <div v-else class="company-detail">
      <div class="detail-header">
        <button @click="selectedCompany = null" class="btn btn-ghost btn-sm">
          <i class="fa-solid fa-arrow-left"></i>
          Retour
        </button>
        <div class="company-header-info">
          <div class="company-logo large">
            {{ selectedCompany.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2>{{ selectedCompany.name }}</h2>
            <p>{{ selectedCompany.industry || 'Non spécifié' }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Members Tab -->
        <div v-if="activeTab === 'members'" class="members-section">
          <div class="section-header">
            <h3>Membres de l'équipe</h3>
            <button class="btn btn-primary btn-sm" @click="showInviteModal = true">
              <i class="fa-solid fa-user-plus"></i>
              Inviter
            </button>
          </div>
          <div class="members-list">
            <div v-for="member in companyMembers" :key="member.id" class="member-card">
              <div class="avatar">{{ member.username.charAt(0).toUpperCase() }}</div>
              <div class="member-info">
                <h4>{{ member.username }}</h4>
                <p>{{ member.email }}</p>
                <span class="badge" :class="getRoleBadgeClass(member.role)">{{ member.role }}</span>
              </div>
              <div class="member-actions">
                <button class="btn btn-ghost btn-sm">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button v-if="member.role !== 'owner'" class="btn btn-ghost btn-sm text-danger">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'" class="projects-section">
          <div class="section-header">
            <h3>Projets de l'entreprise</h3>
            <button class="btn btn-primary btn-sm" @click="$router.push('/projects')">
              <i class="fa-solid fa-plus"></i>
              Nouveau projet
            </button>
          </div>
          <div class="projects-grid">
            <div v-for="project in companyProjects" :key="project.id" class="project-card">
              <div class="project-dot" :style="{ background: project.color }"></div>
              <h4>{{ project.name }}</h4>
              <p>{{ project.description || 'Aucune description' }}</p>
              <div class="project-meta">
                <span class="badge badge-gray">{{ project.tasks?.length || 0 }} tâches</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscription Tab -->
        <div v-if="activeTab === 'subscription'" class="subscription-section">
          <div class="subscription-card">
            <h3>Plan actuel: {{ currentPlan.name }}</h3>
            <p class="price">{{ currentPlan.price }}€ / mois</p>
            <div class="plan-features">
              <ul>
                <li v-for="feature in currentPlan.features" :key="feature">
                  <i class="fa-solid fa-check text-success"></i>
                  {{ feature }}
                </li>
              </ul>
            </div>
            <button class="btn btn-secondary">Changer de plan</button>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="settings-section">
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h4>Nom de l'entreprise</h4>
                <p>{{ selectedCompany.name }}</p>
              </div>
              <button class="btn btn-ghost btn-sm">Modifier</button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Industrie</h4>
                <p>{{ selectedCompany.industry || 'Non spécifié' }}</p>
              </div>
              <button class="btn btn-ghost btn-sm">Modifier</button>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Site web</h4>
                <p>{{ selectedCompany.website || 'Non spécifié' }}</p>
              </div>
              <button class="btn btn-ghost btn-sm">Modifier</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Company Modal -->
    <div v-if="showCreateCompanyModal" class="modal-overlay" @click.self="showCreateCompanyModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Créer une entreprise</h2>
          <button @click="showCreateCompanyModal = false" class="btn btn-ghost btn-sm">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="createCompany" class="modal-body">
          <div class="form-group">
            <label>Nom de l'entreprise *</label>
            <input v-model="newCompany.name" type="text" class="input" required placeholder="Ex: Ma Startup" />
          </div>
          <div class="form-group">
            <label>Industrie</label>
            <select v-model="newCompany.industry" class="select">
              <option value="">Sélectionner...</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Other">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Taille</label>
            <select v-model="newCompany.size" class="select">
              <option value="small">Small (1-10)</option>
              <option value="medium">Medium (11-50)</option>
              <option value="large">Large (51-200)</option>
              <option value="enterprise">Enterprise (200+)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Site web</label>
            <input v-model="newCompany.website" type="url" class="input" placeholder="https://example.com" />
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateCompanyModal = false" class="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import { useActivityStore } from '@/stores/activityStore'

const userStore = useUserStore()
const projectStore = useProjectStore()
const activityStore = useActivityStore()

const showCreateCompanyModal = ref(false)
const showInviteModal = ref(false)
const selectedCompany = ref(null)
const activeTab = ref('members')

const newCompany = ref({
  name: '',
  industry: '',
  size: 'small',
  website: '',
})

const companies = ref([
  {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    size: 'medium',
    website: 'https://techcorp.com',
    createdAt: new Date().toISOString(),
    usage: 65,
  },
])

const tabs = [
  { id: 'members', label: 'Membres' },
  { id: 'projects', label: 'Projets' },
  { id: 'subscription', label: 'Abonnement' },
  { id: 'settings', label: 'Paramètres' },
]

const companyStats = computed(() => ({
  members: 12,
  projects: 8,
  subscription: 'Professional',
  budget: '€2,400',
}))

const companyMembers = ref([
  { id: 1, username: 'Jean Dupont', email: 'jean@techcorp.com', role: 'owner' },
  { id: 2, username: 'Marie Martin', email: 'marie@techcorp.com', role: 'admin' },
  { id: 3, username: 'Pierre Bernard', email: 'pierre@techcorp.com', role: 'member' },
])

const companyProjects = computed(() => {
  return projectStore.projects.filter(p => p.mode === 'professional')
})

const currentPlan = ref({
  name: 'Professional',
  price: 79,
  features: [
    '25 utilisateurs',
    '50 projets',
    'Support prioritaire',
    'IA basique',
  ],
})

const selectCompany = (company) => {
  selectedCompany.value = company
}

const createCompany = () => {
  const company = {
    id: Date.now(),
    ...newCompany.value,
    createdAt: new Date().toISOString(),
    usage: 0,
  }
  companies.value.push(company)

  // Mettre à jour l'utilisateur
  if (userStore.user) {
    userStore.user.accountType = 'business_owner'
    userStore.user.companyId = company.id
    userStore.user.mode = 'pro'
  }

  // Ajouter activité
  activityStore.addCompanyCreated(company.id, company.name, userStore.idUser, userStore.username)

  showCreateCompanyModal.value = false
  newCompany.value = { name: '', industry: '', size: 'small', website: '' }
}

const getRoleBadgeClass = (role) => {
  const classes = {
    owner: 'badge-warning',
    admin: 'badge-primary',
    member: 'badge-gray',
  }
  return classes[role] || 'badge-gray'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  // Données mock pour la démo
})
</script>

<style scoped>
.company-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--color-gray-500);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  margin: 0;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.companies-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.company-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.company-item:hover {
  border-color: var(--color-primary);
  background: var(--bg-secondary);
}

.company-logo {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.company-logo.large {
  width: 64px;
  height: 64px;
  font-size: 1.75rem;
}

.company-info {
  flex: 1;
}

.company-info h3 {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
}

.company-info p {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: 0 0 0.5rem 0;
}

.company-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.company-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 80px;
}

.progress {
  flex: 1;
  height: 4px;
}

.progress-text {
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-gray-600);
  min-width: 30px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.company-header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-header-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-gray-500);
  transition: all var(--transition-base);
}

.tab-btn:hover {
  color: var(--color-gray-700);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.member-info {
  flex: 1;
}

.member-info h4 {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
}

.member-info p {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: 0 0 0.5rem 0;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.project-card {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.project-card h4 {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-900);
  margin: 0;
}

.project-card p {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: 0;
}

.subscription-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
}

.subscription-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.plan-features ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.plan-features li {
  padding: 0.5rem 0;
  color: var(--color-gray-700);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.setting-info h4 {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
}

.setting-info p {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin: 0;
}
</style>
