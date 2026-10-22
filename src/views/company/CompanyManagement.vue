<template>
  <div class="company-management">
    <!-- Header -->
    <div class="management-header">
      <div class="header-info">
        <h1>Gestion de l'Entreprise</h1>
        <p>{{ company?.name }}</p>
      </div>
      <div class="header-actions">
        <button @click="showUpgradeModal = true" class="btn-upgrade">
          <Rocket :size="18" />
          Upgrader le plan
        </button>
        <button @click="showBillingModal = true" class="btn-billing">
          <CreditCard :size="18" />
          Facturation
        </button>
      </div>
    </div>

    <!-- Subscription Banner -->
    <div v-if="isTrialActive" class="trial-banner">
      <div class="trial-info">
        <Clock :size="20" />
        <span>
          Essai gratuit en cours - <strong>{{ trialDaysRemaining }} jours</strong> restants
        </span>
      </div>
      <button @click="showUpgradeModal = true" class="btn-upgrade-small">
        Upgrader maintenant
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users">
          <Users :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ subscription?.currentUsers || 0 }}/{{ subscription?.maxUsers || 0 }}</div>
          <div class="stat-label">Utilisateurs</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon projects">
          <Folder :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">
            {{ subscription?.maxProjects === -1 ? '∞' : (subscription?.currentProjects || 0) }}/{{ subscription?.maxProjects === -1 ? '∞' : (subscription?.maxProjects || 0) }}
          </div>
          <div class="stat-label">Projets</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon plan">
          <Crown :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ currentPlan?.name || 'Free' }}</div>
          <div class="stat-label">Plan actuel</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon status">
          <CheckCircle :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value" :class="subscriptionStatusClass">
            {{ subscriptionStatusLabel }}
          </div>
          <div class="stat-label">Statut</div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
      >
        <component :is="tab.icon" :size="18" />
        <span>{{ tab.label }}</span>
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Members Tab -->
      <div v-if="activeTab === 'members'" class="members-section">
        <div class="section-header">
          <h2>Membres de l'équipe</h2>
          <button
            @click="showMemberModal = true"
            class="btn-add"
            :disabled="!canInviteMembers"
          >
            <UserPlus :size="18" />
            Inviter un membre
          </button>
        </div>

        <div v-if="!canInviteMembers" class="limit-warning">
          <Building :size="20" />
          <span>
            Limite d'utilisateurs atteinte. Upgrader votre plan pour inviter plus de membres.
          </span>
        </div>

        <div class="members-list">
          <div
            v-for="member in activeMembers"
            :key="member.id"
            class="member-card"
          >
            <div class="member-avatar">
              {{ member.username.charAt(0).toUpperCase() }}
            </div>
            <div class="member-info">
              <div class="member-name">{{ member.username }}</div>
              <div class="member-email">{{ member.email }}</div>
              <div class="member-role">
                <span :class="['role-badge', member.role]">
                  {{ getRoleLabel(member.role) }}
                </span>
              </div>
            </div>
            <div class="member-actions">
              <button @click="editMember(member)" class="action-btn">
                <Edit :size="16" />
              </button>
              <button
                v-if="member.role !== 'owner'"
                @click="removeMember(member.id)"
                class="action-btn delete"
              >
                <Trash :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="pendingMembers.length > 0" class="pending-section">
          <h3>Invitations en attente</h3>
          <div class="pending-list">
            <div
              v-for="member in pendingMembers"
              :key="member.id"
              class="pending-item"
            >
              <div class="pending-info">
                <div class="pending-email">{{ member.email }}</div>
                <div class="pending-date">Invité le {{ formatDate(member.invitedAt) }}</div>
              </div>
              <div class="pending-actions">
                <button @click="resendInvitation(member.id)" class="btn-resend">
                  Renvoyer
                </button>
                <button @click="cancelInvitation(member.id)" class="btn-cancel">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="settings-section">
        <h2>Paramètres de l'entreprise</h2>
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label>Nom de l'entreprise</label>
            <input v-model="companyForm.name" type="text" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="companyForm.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Industrie</label>
            <select v-model="companyForm.industry">
              <option value="">Sélectionner...</option>
              <option value="technology">Technologie</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Santé</option>
              <option value="education">Éducation</option>
              <option value="retail">Commerce de détail</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Site web</label>
            <input v-model="companyForm.website" type="url" placeholder="https://" />
          </div>
          <div class="form-group">
            <label>Taille de l'entreprise</label>
            <select v-model="companyForm.size">
              <option value="small">Petite (1-10 employés)</option>
              <option value="medium">Moyenne (11-50 employés)</option>
              <option value="large">Grande (51-200 employés)</option>
              <option value="enterprise">Entreprise (200+ employés)</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-save">Sauvegarder</button>
          </div>
        </form>
      </div>

      <!-- Billing Tab -->
      <div v-if="activeTab === 'billing'" class="billing-section">
        <h2>Facturation</h2>
        <div class="billing-info">
          <div class="info-card">
            <h3>Plan actuel</h3>
            <div class="plan-details">
              <div class="plan-name">{{ currentPlan?.name }}</div>
              <div class="plan-price">{{ currentPlan?.price }}€/mois</div>
            </div>
            <button @click="showUpgradeModal = true" class="btn-change">
              Changer de plan
            </button>
          </div>
          <div class="info-card">
            <h3>Prochaine facturation</h3>
            <div class="next-billing">
              <div class="billing-date">
                {{ formatDate(subscription?.nextBillingDate) }}
              </div>
              <div class="billing-amount">{{ currentPlan?.price }}€</div>
            </div>
          </div>
        </div>

        <h3>Historique des factures</h3>
        <div class="invoices-list">
          <div
            v-for="invoice in invoices"
            :key="invoice.id"
            class="invoice-item"
          >
            <div class="invoice-info">
              <div class="invoice-number">{{ invoice.number }}</div>
              <div class="invoice-date">{{ formatDate(invoice.createdAt) }}</div>
            </div>
            <div class="invoice-amount">{{ invoice.total }}€</div>
            <div :class="['invoice-status', invoice.status]">
              {{ getInvoiceStatusLabel(invoice.status) }}
            </div>
            <button class="btn-download">
              <Download :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <MemberInvitationModal
      v-if="showMemberModal"
      :company="company"
      @close="showMemberModal = false"
      @invited="onMemberInvited"
    />

    <UpgradePlanModal
      v-if="showUpgradeModal"
      :current-plan="currentPlan"
      @close="showUpgradeModal = false"
      @upgraded="onPlanUpgraded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/companyStore'
import { useUserStore } from '@/stores/userStore'
import { useActivityStore } from '@/stores/activityStore'
import MemberInvitationModal from '@/components/company/MemberInvitationModal.vue'
import UpgradePlanModal from '@/components/company/UpgradePlanModal.vue'
import {
  Rocket,
  CreditCard,
  Clock,
  Users,
  Folder,
  Crown,
  CheckCircle,
  Cog,
  UserPlus,
  Edit,
  Trash,
  Download,
  Building,
} from 'lucide-vue-next'

const companyStore = useCompanyStore()
const userStore = useUserStore()
const activityStore = useActivityStore()

const activeTab = ref('members')
const showMemberModal = ref(false)
const showUpgradeModal = ref(false)
const showBillingModal = ref(false)

const companyForm = ref({
  name: '',
  description: '',
  industry: '',
  website: '',
  size: '',
})

const tabs = computed(() => [
  {
    id: 'members',
    label: 'Membres',
    icon: Users,
    count: companyStore.activeMembers.length,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Cog,
  },
  {
    id: 'billing',
    label: 'Facturation',
    icon: CreditCard,
    count: companyStore.unpaidInvoices.length,
  },
])

const company = computed(() => companyStore.currentCompany)
const subscription = computed(() => companyStore.currentSubscription)
const currentPlan = computed(() => companyStore.currentPlan)
const activeMembers = computed(() => companyStore.activeMembers)
const pendingMembers = computed(() => companyStore.pendingMembers)
const invoices = computed(() => companyStore.invoices)

const isTrialActive = computed(() => companyStore.isTrialActive)
const trialDaysRemaining = computed(() => companyStore.trialDaysRemaining)
const canInviteMembers = computed(() => companyStore.canInviteMembers)

const subscriptionStatusLabel = computed(() => {
  const labels = {
    trial: 'Essai',
    active: 'Actif',
    past_due: 'En retard',
    cancelled: 'Annulé',
    expired: 'Expiré',
  }
  return labels[subscription.value?.status] || 'Inconnu'
})

const subscriptionStatusClass = computed(() => {
  const classes = {
    trial: 'trial',
    active: 'active',
    past_due: 'past-due',
    cancelled: 'cancelled',
    expired: 'expired',
  }
  return classes[subscription.value?.status] || ''
})

const getRoleLabel = (role) => {
  const labels = {
    owner: 'Propriétaire',
    admin: 'Admin',
    member: 'Membre',
  }
  return labels[role] || role
}

const getInvoiceStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    paid: 'Payé',
    failed: 'Échoué',
    cancelled: 'Annulé',
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const editMember = (member) => {
  console.log('Edit member:', member)
}

const removeMember = (memberId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
    companyStore.removeMember(memberId)
  }
}

const resendInvitation = (invitationId) => {
  console.log('Resend invitation:', invitationId)
}

const cancelInvitation = (invitationId) => {
  companyStore.declineInvitation(invitationId)
}

const onMemberInvited = (member) => {
  companyStore.addMember(member)
  activityStore.addMemberInvited(
    company.value.id,
    company.value.name,
    { userId: userStore.idUser, username: userStore.username },
    member.email
  )
  showMemberModal.value = false
}

const onPlanUpgraded = (planId) => {
  companyStore.upgradePlan(planId)
  activityStore.addSubscriptionUpgraded(
    company.value.id,
    company.value.name,
    planId,
    userStore.idUser,
    userStore.username
  )
  showUpgradeModal.value = false
}

const saveSettings = () => {
  companyStore.updateCompany(company.value.id, companyForm.value)
}

onMounted(() => {
  // Charger les données de l'entreprise
  if (company.value) {
    companyForm.value = {
      name: company.value.name,
      description: company.value.description,
      industry: company.value.industry,
      website: company.value.website,
      size: company.value.size,
    }
  }

  // Données mock pour démonstration
  if (!companyStore.currentCompany) {
    companyStore.setCompany({
      id: 1,
      name: 'TechCorp Inc.',
      slug: 'techcorp',
      description: 'Entreprise technologique innovante',
      industry: 'technology',
      size: 'medium',
      website: 'https://techcorp.com',
      ownerId: 1,
    })

    companyStore.setSubscription({
      id: 1,
      companyId: 1,
      planId: 'starter',
      status: 'trial',
      startDate: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      maxUsers: 5,
      maxProjects: 10,
      currentUsers: 3,
      currentProjects: 5,
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    companyStore.setCompanyMembers([
      {
        id: 1,
        companyId: 1,
        userId: 1,
        email: 'owner@techcorp.com',
        username: 'John Owner',
        role: 'owner',
        status: 'active',
        joinedAt: new Date().toISOString(),
      },
      {
        id: 2,
        companyId: 1,
        userId: 2,
        email: 'marie@techcorp.com',
        username: 'Marie Admin',
        role: 'admin',
        status: 'active',
        joinedAt: new Date().toISOString(),
      },
      {
        id: 3,
        companyId: 1,
        userId: 3,
        email: 'jean@techcorp.com',
        username: 'Jean Member',
        role: 'member',
        status: 'active',
        joinedAt: new Date().toISOString(),
      },
    ])

    companyStore.setInvoices([
      {
        id: 1,
        companyId: 1,
        number: 'INV-001',
        amount: 29,
        status: 'paid',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
        total: 29,
      },
    ])
  }
})
</script>

<style scoped>
.company-management {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-info h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.header-info p {
  color: #6b7280;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-upgrade,
.btn-billing {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-upgrade {
  background: #667eea;
  color: white;
}

.btn-upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-billing {
  background: #f3f4f6;
  color: #374151;
}

.btn-billing:hover {
  background: #e5e7eb;
}

.trial-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #fef3c7;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.trial-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #92400e;
  font-weight: 600;
}

.btn-upgrade-small {
  padding: 0.5rem 1rem;
  background: #92400e;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-upgrade-small:hover {
  background: #78350f;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.users {
  background: #667eea;
}

.stat-icon.projects {
  background: #10b981;
}

.stat-icon.plan {
  background: #f59e0b;
}

.stat-icon.status {
  background: #ef4444;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-value.trial {
  color: #f59e0b;
}

.stat-value.active {
  color: #10b981;
}

.stat-value.past-due {
  color: #ef4444;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-count {
  background: #ef4444;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.tab-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.members-section,
.settings-section,
.billing-section {
  min-height: 400px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add:hover:not(:disabled) {
  background: #5568d3;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.limit-warning {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 0.5rem;
  color: #92400e;
  margin-bottom: 1.5rem;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.member-card:hover {
  background: #f3f4f6;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-info {
  flex: 1;
}

.member-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.member-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge.owner {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.member {
  background: #d1fae5;
  color: #065f46;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
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

.pending-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.pending-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 0.5rem;
}

.pending-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pending-email {
  font-weight: 600;
  color: #92400e;
}

.pending-date {
  font-size: 0.875rem;
  color: #b45309;
}

.pending-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-resend,
.btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-resend {
  background: #92400e;
  color: white;
}

.btn-resend:hover {
  background: #78350f;
}

.btn-cancel {
  background: white;
  color: #92400e;
}

.btn-cancel:hover {
  background: #fef3c7;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background: #5568d3;
}

.billing-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.info-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.plan-details {
  margin-bottom: 1rem;
}

.plan-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.plan-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.btn-change {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-change:hover {
  background: #5568d3;
}

.next-billing {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.billing-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.billing-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.invoices-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.invoice-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.invoice-info {
  flex: 1;
}

.invoice-number {
  font-weight: 600;
  color: #1f2937;
}

.invoice-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.invoice-amount {
  font-weight: 700;
  color: #1f2937;
}

.invoice-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.invoice-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.invoice-status.paid {
  background: #d1fae5;
  color: #065f46;
}

.invoice-status.failed {
  background: #fee2e2;
  color: #991b1b;
}

.btn-download {
  width: 36px;
  height: 36px;
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

.btn-download:hover {
  background: #e5e7eb;
  color: #374151;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .billing-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
  }
}
</style>
