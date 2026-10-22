import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  Company,
  Subscription,
  CompanyMember,
  Billing,
  Invoice,
  PaymentMethod,
  Payment,
  ACCOUNT_TYPES,
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_PLANS,
} from '@/types/projectModels'

export const useCompanyStore = defineStore('companyStore', {
  state: () => ({
    // ===== ENTREPRISE =====
    currentCompany: null,
    companies: [],

    // ===== ABONNEMENT =====
    currentSubscription: null,

    // ===== MEMBRES =====
    companyMembers: [],
    pendingInvitations: [],

    // ===== FACTURATION =====
    billing: null,
    invoices: [],
    paymentMethods: [],

    // ===== UI STATE =====
    showCompanyForm: false,
    showMemberModal: false,
    showBillingModal: false,
    showUpgradeModal: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    // Vérifier si l'utilisateur est un propriétaire d'entreprise
    isCompanyOwner: (state) => {
      return state.currentCompany?.ownerId === state.currentUserId
    },

    // Vérifier si l'utilisateur est un membre d'entreprise
    isCompanyMember: (state) => {
      return state.companyMembers.some((m) => m.userId === state.currentUserId)
    },

    // Obtenir le plan actuel
    currentPlan: (state) => {
      if (!state.currentSubscription) return null
      return Object.values(SUBSCRIPTION_PLANS).find(
        (plan) => plan.id === state.currentSubscription.planId,
      )
    },

    // Vérifier si l'abonnement est actif
    isSubscriptionActive: (state) => {
      return state.currentSubscription?.status === SUBSCRIPTION_STATUS.ACTIVE
    },

    // Vérifier si l'essai est en cours
    isTrialActive: (state) => {
      if (!state.currentSubscription) return false
      if (state.currentSubscription.status !== SUBSCRIPTION_STATUS.TRIAL) return false
      return new Date(state.currentSubscription.trialEndsAt) > new Date()
    },

    // Jours restants dans l'essai
    trialDaysRemaining: (state) => {
      if (!state.currentSubscription?.trialEndsAt) return 0
      const trialEnd = new Date(state.currentSubscription.trialEndsAt)
      const now = new Date()
      const diff = trialEnd - now
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    },

    // Utilisateurs restants
    usersRemaining: (state) => {
      if (!state.currentSubscription) return 0
      return state.currentSubscription.maxUsers - state.currentSubscription.currentUsers
    },

    // Projets restants
    projectsRemaining: (state) => {
      if (!state.currentSubscription) return 0
      if (state.currentSubscription.maxProjects === -1) return -1 // Illimité
      return state.currentSubscription.maxProjects - state.currentSubscription.currentProjects
    },

    // Vérifier si on peut inviter des membres
    canInviteMembers: (state) => {
      return state.usersRemaining > 0
    },

    // Vérifier si on peut créer des projets
    canCreateProjects: (state) => {
      return state.projectsRemaining > 0 || state.projectsRemaining === -1
    },

    // Membres actifs
    activeMembers: (state) => {
      return state.companyMembers.filter((m) => m.status === 'active')
    },

    // Membres en attente
    pendingMembers: (state) => {
      return state.companyMembers.filter((m) => m.status === 'pending')
    },

    // Factures impayées
    unpaidInvoices: (state) => {
      return state.invoices.filter((i) => i.status === 'pending')
    },
  },

  actions: {
    // ===== ENTREPRISE =====
    setCompany(company) {
      this.currentCompany = new Company(company)
    },

    setCompanies(companies) {
      this.companies = companies.map((c) => new Company(c))
    },

    createCompany(companyData) {
      const company = new Company({
        ...companyData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      this.companies.push(company)
      this.currentCompany = company
      return company
    },

    updateCompany(companyId, updates) {
      const index = this.companies.findIndex((c) => c.id === companyId)
      if (index !== -1) {
        this.companies[index] = {
          ...this.companies[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        if (this.currentCompany?.id === companyId) {
          this.currentCompany = this.companies[index]
        }
      }
    },

    deleteCompany(companyId) {
      this.companies = this.companies.filter((c) => c.id !== companyId)
      if (this.currentCompany?.id === companyId) {
        this.currentCompany = null
      }
    },

    // ===== ABONNEMENT =====
    setSubscription(subscription) {
      this.currentSubscription = new Subscription(subscription)
    },

    createSubscription(subscriptionData) {
      const subscription = new Subscription({
        ...subscriptionData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      this.currentSubscription = subscription
      return subscription
    },

    updateSubscription(updates) {
      if (this.currentSubscription) {
        this.currentSubscription = {
          ...this.currentSubscription,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    upgradePlan(planId) {
      const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()]
      if (plan && this.currentSubscription) {
        this.updateSubscription({
          planId: plan.id,
          maxUsers: plan.maxUsers,
          maxProjects: plan.maxProjects,
        })
      }
    },

    cancelSubscription(cancelAt = null) {
      if (this.currentSubscription) {
        this.updateSubscription({
          status: SUBSCRIPTION_STATUS.CANCELLED,
          cancelAt: cancelAt || new Date().toISOString(),
        })
      }
    },

    // ===== MEMBRES =====
    setCompanyMembers(members) {
      this.companyMembers = members.map((m) => new CompanyMember(m))
    },

    addMember(memberData) {
      const member = new CompanyMember({
        ...memberData,
        id: Date.now(),
        invitedAt: new Date().toISOString(),
      })
      this.companyMembers.push(member)

      // Incrémenter le compteur d'utilisateurs
      if (this.currentSubscription) {
        this.currentSubscription.currentUsers += 1
      }

      return member
    },

    updateMember(memberId, updates) {
      const index = this.companyMembers.findIndex((m) => m.id === memberId)
      if (index !== -1) {
        this.companyMembers[index] = { ...this.companyMembers[index], ...updates }
      }
    },

    removeMember(memberId) {
      this.companyMembers = this.companyMembers.filter((m) => m.id !== memberId)

      // Décrémenter le compteur d'utilisateurs
      if (this.currentSubscription) {
        this.currentSubscription.currentUsers = Math.max(
          0,
          this.currentSubscription.currentUsers - 1,
        )
      }
    },

    inviteMember(email, role = 'member') {
      const invitation = {
        id: Date.now(),
        email,
        role,
        status: 'pending',
        invitedAt: new Date().toISOString(),
      }
      this.pendingInvitations.push(invitation)
      return invitation
    },

    acceptInvitation(invitationId) {
      const index = this.pendingInvitations.findIndex((i) => i.id === invitationId)
      if (index !== -1) {
        const invitation = this.pendingInvitations[index]
        this.addMember({
          email: invitation.email,
          role: invitation.role,
          status: 'active',
          joinedAt: new Date().toISOString(),
        })
        this.pendingInvitations.splice(index, 1)
      }
    },

    declineInvitation(invitationId) {
      this.pendingInvitations = this.pendingInvitations.filter((i) => i.id !== invitationId)
    },

    // ===== FACTURATION =====
    setBilling(billing) {
      this.billing = new Billing(billing)
    },

    setInvoices(invoices) {
      this.invoices = invoices.map((i) => new Invoice(i))
    },

    addInvoice(invoice) {
      const newInvoice = new Invoice(invoice)
      this.invoices.push(newInvoice)
      return newInvoice
    },

    setPaymentMethods(methods) {
      this.paymentMethods = methods.map((m) => new PaymentMethod(m))
    },

    addPaymentMethod(method) {
      const newMethod = new PaymentMethod(method)
      this.paymentMethods.push(newMethod)
      return newMethod
    },

    removePaymentMethod(methodId) {
      this.paymentMethods = this.paymentMethods.filter((m) => m.id !== methodId)
    },

    setDefaultPaymentMethod(methodId) {
      this.paymentMethods = this.paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === methodId,
      }))
    },

    // ===== UI STATE =====
    toggleCompanyForm() {
      this.showCompanyForm = !this.showCompanyForm
    },

    toggleMemberModal() {
      this.showMemberModal = !this.showMemberModal
    },

    toggleBillingModal() {
      this.showBillingModal = !this.showBillingModal
    },

    toggleUpgradeModal() {
      this.showUpgradeModal = !this.showUpgradeModal
    },

    // ===== RESET =====
    reset() {
      this.currentCompany = null
      this.companies = []
      this.currentSubscription = null
      this.companyMembers = []
      this.pendingInvitations = []
      this.billing = null
      this.invoices = []
      this.paymentMethods = []
      this.error = null
    },
  },
})
