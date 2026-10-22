/**
 * Modèles de données pour la gestion de projet
 * Architecture complète pour plateforme Pro/Perso avec IA
 * Modèle B2B: Les entreprises paient et gèrent les comptes
 */

// ===== MODES DE TRAVAIL =====
export const WORK_MODES = {
  PROFESSIONAL: 'professional',
  PERSONAL: 'personal',
}

// ===== TYPES DE COMPTE =====
export const ACCOUNT_TYPES = {
  PERSONAL: 'personal', // Compte individuel (usage personnel)
  BUSINESS_OWNER: 'business_owner', // Propriétaire d'entreprise
  BUSINESS_MEMBER: 'business_member', // Membre d'entreprise (employé)
}

// ===== STATUTS D'ABONNEMENT =====
export const SUBSCRIPTION_STATUS = {
  TRIAL: 'trial',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
}

// ===== PLANS D'ABONNEMENT =====
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    maxUsers: 5,
    maxProjects: 10,
    features: ['Gestion de projet de base', '5 utilisateurs', '10 projets', 'Support email'],
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 79,
    maxUsers: 25,
    maxProjects: 50,
    features: ['Gestion de projet avancée', '25 utilisateurs', '50 projets', 'Support prioritaire', 'IA basique'],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    maxUsers: 100,
    maxProjects: -1, // Illimité
    features: ['Toutes les fonctionnalités', '100+ utilisateurs', 'Projets illimités', 'IA avancée', 'Support dédié', 'API access', 'SSO'],
  },
}

// ===== TYPES DE VUES DE TÂCHES =====
export const TASK_VIEW_TYPES = {
  KANBAN: 'kanban',
  TABLE: 'table',
  LIST: 'list',
  CALENDAR: 'calendar',
  TIMELINE: 'timeline',
}

// ===== PHASES/NIVEAUX PAR DÉFAUT =====
export const DEFAULT_PROFESSIONAL_PHASES = [
  { id: 1, name: 'Analyse', color: '#293848', order: 1 },
  { id: 2, name: 'Conception', color: '#8B5CF6', order: 2 },
  { id: 3, name: 'Développement', color: '#10B981', order: 3 },
  { id: 4, name: 'Tests', color: '#F59E0B', order: 4 },
  { id: 5, name: 'Déploiement', color: '#EF4444', order: 5 },
]

export const DEFAULT_PERSONAL_PHASES = [
  { id: 1, name: 'À planifier', color: '#6B7280', order: 1 },
  { id: 2, name: 'En cours', color: '#293848', order: 2 },
  { id: 3, name: 'En attente', color: '#F59E0B', order: 3 },
  { id: 4, name: 'Terminé', color: '#10B981', order: 4 },
]

// ===== STATUTS DE TÂCHE =====
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  BLOCKED: 'blocked',
}

// ===== PRIORITÉS =====
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

// ===== ROLES DANS UN PROJET =====
export const PROJECT_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
}

// ===== STRUCTURE PROJET =====
export class Project {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.description = data.description || ''
    this.mode = data.mode || WORK_MODES.PERSONAL // Pro ou Perso
    this.color = data.color || '#293848'
    this.icon = data.icon || 'folder'
    this.ownerId = data.ownerId || null
    this.members = data.members || [] // Array de ProjectMember
    this.phases = data.phases || []
    this.tasks = data.tasks || []
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    this.isArchived = data.isArchived || false
    this.settings = data.settings || {
      allowGuestAccess: false,
      requireApproval: false,
      notificationsEnabled: true,
    }
    this.planning = data.planning || {
      estimatedStartDate: null,
      estimatedEndDate: null,
      actualStartDate: null,
      actualEndDate: null,
      totalEstimatedHours: 0,
    }
    this.budget = data.budget || {
      enabled: false,
      totalBudget: 0,
      currency: 'EUR',
      spent: 0,
      remaining: 0,
      expenses: [],
    }
  }
}

// ===== MEMBRE DE PROJET =====
export class ProjectMember {
  constructor(data = {}) {
    this.id = data.id || null
    this.userId = data.userId || null
    this.username = data.username || ''
    this.email = data.email || ''
    this.avatar = data.avatar || null
    this.role = data.role || PROJECT_ROLES.MEMBER
    this.joinedAt = data.joinedAt || new Date().toISOString()
    this.invitedBy = data.invitedBy || null
    this.status = data.status || 'active' // active, pending, declined
    this.skills = data.skills || [] // Compétences pour l'IA
    this.availability = data.availability || {
      monday: { available: true, hours: [] },
      tuesday: { available: true, hours: [] },
      wednesday: { available: true, hours: [] },
      thursday: { available: true, hours: [] },
      friday: { available: true, hours: [] },
      saturday: { available: false, hours: [] },
      sunday: { available: false, hours: [] },
    }
  }
}

// ===== PHASE/NIVEAU =====
export class Phase {
  constructor(data = {}) {
    this.id = data.id || null
    this.projectId = data.projectId || null
    this.name = data.name || ''
    this.description = data.description || ''
    this.color = data.color || '#6B7280'
    this.order = data.order || 0
    this.isDefault = data.isDefault || false
  }
}

// ===== TÂCHE =====
export class Task {
  constructor(data = {}) {
    this.id = data.id || null
    this.projectId = data.projectId || null
    this.phaseId = data.phaseId || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.instructions = data.instructions || '' // Instructions détaillées pour les assignés
    this.status = data.status || TASK_STATUS.TODO
    this.priority = data.priority || TASK_PRIORITY.MEDIUM
    this.assignees = data.assignees || [] // Array de TaskAssignee
    this.tags = data.tags || []
    this.attachments = data.attachments || [] // Images, vidéos, fichiers
    this.comments = data.comments || []
    this.subtasks = data.subtasks || []
    this.timeTracking = data.timeTracking || {
      estimatedHours: 0,
      actualHours: 0,
      remainingHours: 0,
    }
    this.dueDate = data.dueDate || null
    this.startDate = data.startDate || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    this.createdBy = data.createdBy || null
    this.dependencies = data.dependencies || [] // IDs des tâches dépendantes
    this.completedAt = data.completedAt || null
    this.aiSuggestions = data.aiSuggestions || [] // Suggestions de l'IA
  }
}

// ===== ASSIGNATION DE TÂCHE =====
export class TaskAssignee {
  constructor(data = {}) {
    this.userId = data.userId || null
    this.username = data.username || ''
    this.avatar = data.avatar || null
    this.role = data.role || 'assignee' // assignee, reviewer
    this.instructions = data.instructions || '' // Instructions spécifiques à cette personne
    this.assignedAt = data.assignedAt || new Date().toISOString()
    this.acceptedAt = data.acceptedAt || null
  }
}

// ===== ATTACHEMENT (IMAGE/VIDÉO) =====
export class Attachment {
  constructor(data = {}) {
    this.id = data.id || null
    this.taskId = data.taskId || null
    this.type = data.type || 'image' // image, video, file
    this.name = data.name || ''
    this.url = data.url || ''
    this.thumbnail = data.thumbnail || ''
    this.size = data.size || 0
    this.uploadedBy = data.uploadedBy || null
    this.uploadedAt = data.uploadedAt || new Date().toISOString()
  }
}

// ===== COMMENTAIRE =====
export class Comment {
  constructor(data = {}) {
    this.id = data.id || null
    this.taskId = data.taskId || null
    this.projectId = data.projectId || null
    this.userId = data.userId || null
    this.username = data.username || ''
    this.content = data.content || ''
    this.attachments = data.attachments || []
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    this.isPrivate = data.isPrivate || false
    this.replyTo = data.replyTo || null // ID du commentaire parent
  }
}

// ===== MESSAGE DE DISCUSSION (GROUPE/INDIVIDUEL) =====
export class DiscussionMessage {
  constructor(data = {}) {
    this.id = data.id || null
    this.projectId = data.projectId || null
    this.conversationId = data.conversationId || null // null = groupe global
    this.senderId = data.senderId || null
    this.senderName = data.senderName || ''
    this.recipientId = data.recipientId || null // null = message de groupe
    this.content = data.content || ''
    this.attachments = data.attachments || []
    this.type = data.type || 'text' // text, image, video, file
    this.createdAt = data.createdAt || new Date().toISOString()
    this.isRead = data.isRead || false
    this.readBy = data.readBy || [] // IDs des utilisateurs qui ont lu
  }
}

// ===== PLANIFICATION DE PROJET =====
export class ProjectPlanning {
  constructor(data = {}) {
    this.projectId = data.projectId || null
    this.estimatedStartDate = data.estimatedStartDate || null
    this.estimatedEndDate = data.estimatedEndDate || null
    this.actualStartDate = data.actualStartDate || null
    this.actualEndDate = data.actualEndDate || null
    this.totalEstimatedHours = data.totalEstimatedHours || 0
    this.totalActualHours = data.totalActualHours || 0
    this.milestones = data.milestones || [] // Jalon importants
    this.ganttData = data.ganttData || null // Données pour diagramme Gantt
  }
}

// ===== GAMIFICATION (USAGE PERSONNEL) =====
export class UserProfile {
  constructor(data = {}) {
    this.userId = data.userId || null
    this.xp = data.xp || 0
    this.level = data.level || 1
    this.totalTasksCompleted = data.totalTasksCompleted || 0
    this.streak = data.streak || 0 // Jours consécutifs
    this.badges = data.badges || []
    this.avatar = data.avatar || null
    this.theme = data.theme || 'default'
    this.statistics = data.statistics || {
      tasksCompletedThisWeek: 0,
      tasksCompletedThisMonth: 0,
      totalHoursSaved: 0,
      mostProductiveDay: null,
    }
  }
}

// ===== DASHBOARD WIDGET =====
export class DashboardWidget {
  constructor(data = {}) {
    this.id = data.id || null
    this.type = data.type || 'stat' // stat, chart, task-list, calendar, timer
    this.title = data.title || ''
    this.position = data.position || { x: 0, y: 0, w: 4, h: 3 }
    this.config = data.config || {}
    this.isVisible = data.isVisible !== false
  }
}

// ===== SUGGESTION IA =====
export class AISuggestion {
  constructor(data = {}) {
    this.id = data.id || null
    this.type = data.type || 'planning' // planning, bottleneck, optimization
    this.taskId = data.taskId || null
    this.projectId = data.projectId || null
    this.title = data.title || ''
    this.description = data.description || ''
    this.confidence = data.confidence || 0.8 // 0-1
    this.suggestedAction = data.suggestedAction || ''
    this.isApplied = data.isApplied || false
    this.createdAt = data.createdAt || new Date().toISOString()
  }
}

// ===== ENTREPRISE =====
export class Company {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.slug = data.slug || '' // URL-friendly name
    this.logo = data.logo || null
    this.description = data.description || ''
    this.industry = data.industry || ''
    this.size = data.size || '' // small, medium, large, enterprise
    this.website = data.website || ''
    this.ownerId = data.ownerId || null // ID du propriétaire
    this.subscriptionId = data.subscriptionId || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
    this.settings = data.settings || {
      allowSelfRegistration: false,
      requireApproval: true,
      defaultUserRole: PROJECT_ROLES.MEMBER,
      ssoEnabled: false,
    }
  }
}

// ===== ABONNEMENT =====
export class Subscription {
  constructor(data = {}) {
    this.id = data.id || null
    this.companyId = data.companyId || null
    this.planId = data.planId || SUBSCRIPTION_PLANS.STARTER.id
    this.status = data.status || SUBSCRIPTION_STATUS.TRIAL
    this.startDate = data.startDate || new Date().toISOString()
    this.endDate = data.endDate || null
    this.trialEndsAt = data.trialEndsAt || null
    this.maxUsers = data.maxUsers || SUBSCRIPTION_PLANS.STARTER.maxUsers
    this.maxProjects = data.maxProjects || SUBSCRIPTION_PLANS.STARTER.maxProjects
    this.currentUsers = data.currentUsers || 0
    this.currentProjects = data.currentProjects || 0
    this.billingCycle = data.billingCycle || 'monthly' // monthly, yearly
    this.nextBillingDate = data.nextBillingDate || null
    this.cancelAt = data.cancelAt || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }
}

// ===== MEMBRE D'ENTREPRISE =====
export class CompanyMember {
  constructor(data = {}) {
    this.id = data.id || null
    this.companyId = data.companyId || null
    this.userId = data.userId || null
    this.email = data.email || ''
    this.username = data.username || ''
    this.role = data.role || 'member' // owner, admin, member
    this.status = data.status || 'active' // active, pending, suspended, deleted
    this.invitedBy = data.invitedBy || null
    this.invitedAt = data.invitedAt || new Date().toISOString()
    this.joinedAt = data.joinedAt || null
    this.lastActiveAt = data.lastActiveAt || null
    this.permissions = data.permissions || {
      canCreateProjects: true,
      canInviteMembers: false,
      canManageBilling: false,
      canDeleteProjects: true,
    }
    this.department = data.department || ''
    this.jobTitle = data.jobTitle || ''
    this.phone = data.phone || ''
  }
}

// ===== FACTURATION =====
export class Billing {
  constructor(data = {}) {
    this.id = data.id || null
    this.companyId = data.companyId || null
    this.subscriptionId = data.subscriptionId || null
    this.billingAddress = data.billingAddress || {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    }
    this.taxId = data.taxId || ''
    this.taxRate = data.taxRate || 0
    this.paymentMethodId = data.paymentMethodId || null
    this.invoices = data.invoices || []
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }
}

// ===== FACTURE =====
export class Invoice {
  constructor(data = {}) {
    this.id = data.id || null
    this.companyId = data.companyId || null
    this.subscriptionId = data.subscriptionId || null
    this.number = data.number || ''
    this.amount = data.amount || 0
    this.currency = data.currency || 'EUR'
    this.status = data.status || 'pending' // pending, paid, failed, cancelled
    this.dueDate = data.dueDate || null
    this.paidAt = data.paidAt || null
    this.items = data.items || []
    this.tax = data.tax || 0
    this.total = data.total || 0
    this.pdfUrl = data.pdfUrl || null
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }
}

// ===== MÉTHODE DE PAIEMENT =====
export class PaymentMethod {
  constructor(data = {}) {
    this.id = data.id || null
    this.companyId = data.companyId || null
    this.type = data.type || 'card' // card, bank_account
    this.isDefault = data.isDefault || false
    this.cardDetails = data.cardDetails || {
      last4: '',
      brand: '',
      expiryMonth: '',
      expiryYear: '',
    }
    this.bankDetails = data.bankDetails || {
      last4: '',
      bankName: '',
    }
    this.createdAt = data.createdAt || new Date().toISOString()
  }
}

// ===== PAIEMENT =====
export class Payment {
  constructor(data = {}) {
    this.id = data.id || null
    this.invoiceId = data.invoiceId || null
    this.companyId = data.companyId || null
    this.amount = data.amount || 0
    this.currency = data.currency || 'EUR'
    this.status = data.status || 'pending' // pending, succeeded, failed, refunded
    this.paymentMethodId = data.paymentMethodId || null
    this.transactionId = data.transactionId || null
    this.failureReason = data.failureReason || null
    this.refundedAmount = data.refundedAmount || 0
    this.createdAt = data.createdAt || new Date().toISOString()
  }
}

// ===== BUDGET DE PROJET =====
export class ProjectBudget {
  constructor(data = {}) {
    this.id = data.id || null
    this.projectId = data.projectId || null
    this.enabled = data.enabled !== undefined ? data.enabled : false
    this.totalBudget = data.totalBudget || 0
    this.currency = data.currency || 'EUR'
    this.spent = data.spent || 0
    this.remaining = data.remaining || 0
    this.expenses = data.expenses || [] // Array de ProjectExpense
    this.alertThreshold = data.alertThreshold || 0.8 // Alert à 80% du budget
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }
}

// ===== DÉPENSE DE PROJET =====
export class ProjectExpense {
  constructor(data = {}) {
    this.id = data.id || null
    this.projectId = data.projectId || null
    this.taskId = data.taskId || null
    this.description = data.description || ''
    this.amount = data.amount || 0
    this.currency = data.currency || 'EUR'
    this.category = data.category || 'other' // software, hardware, services, other
    this.date = data.date || new Date().toISOString()
    this.addedBy = data.addedBy || null
    this.receiptUrl = data.receiptUrl || null
    this.approved = data.approved !== undefined ? data.approved : true
    this.approvedBy = data.approvedBy || null
    this.notes = data.notes || ''
  }
}

// ===== RAPPORT DE PROJET =====
export class ProjectReport {
  constructor(data = {}) {
    this.id = data.id || null
    this.projectId = data.projectId || null
    this.title = data.title || ''
    this.type = data.type || 'summary' // summary, budget, progress, custom
    this.generatedBy = data.generatedBy || null
    this.generatedAt = data.generatedAt || new Date().toISOString()
    this.period = data.period || {
      startDate: null,
      endDate: null,
    }
    this.metrics = data.metrics || {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      totalHours: 0,
      budgetUsed: 0,
      budgetRemaining: 0,
    }
    this.charts = data.charts || []
    this.summary = data.summary || ''
    this.isPublic = data.isPublic || false
  }
}
