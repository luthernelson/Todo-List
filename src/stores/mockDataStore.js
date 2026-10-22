import { defineStore } from 'pinia'

export const useMockDataStore = defineStore('mockData', {
  state: () => ({
    projects: [
      {
        id: 1,
        name: 'Site Web E-commerce',
        description: 'Développement complet d\'un site e-commerce avec panier et paiement',
        color: '#293848',
        icon: 'code',
        status: 'in-progress',
        statusText: 'En cours',
        progress: 65,
        dueDate: '15 Jan 2026',
        owner: 1,
        members: [1, 2],
        phases: [
          { id: 1, name: 'Analyse', color: '#293848', order: 1, isDefault: true },
          { id: 2, name: 'Conception', color: '#8B5CF6', order: 2, isDefault: true },
          { id: 3, name: 'Développement', color: '#10B981', order: 3, isDefault: true },
          { id: 4, name: 'Tests', color: '#F59E0B', order: 4, isDefault: true },
          { id: 5, name: 'Déploiement', color: '#EF4444', order: 5, isDefault: true },
        ],
        budget: {
          enabled: true,
          total: 50000,
          spent: 32500,
          currency: 'EUR'
        }
      },
      {
        id: 2,
        name: 'Application Mobile',
        description: 'Application iOS et Android pour l\'entreprise',
        color: '#10B981',
        icon: 'smartphone',
        status: 'in-progress',
        statusText: 'En cours',
        progress: 45,
        dueDate: '20 Jan 2026',
        owner: 1,
        members: [1, 2, 3],
        phases: [
          { id: 1, name: 'À planifier', color: '#6B7280', order: 1, isDefault: true },
          { id: 2, name: 'En cours', color: '#293848', order: 2, isDefault: true },
          { id: 3, name: 'En attente', color: '#F59E0B', order: 3, isDefault: true },
          { id: 4, name: 'Terminé', color: '#10B981', order: 4, isDefault: true },
        ],
        budget: {
          enabled: true,
          total: 75000,
          spent: 33750,
          currency: 'EUR'
        }
      },
      {
        id: 3,
        name: 'Refactoring Backend',
        description: 'Optimisation et refactoring du système backend',
        color: '#F59E0B',
        icon: 'server',
        status: 'critical',
        statusText: 'Critique',
        progress: 80,
        dueDate: '10 Jan 2026',
        owner: 1,
        members: [1],
        phases: [
          { id: 1, name: 'Backlog', color: '#6B7280', order: 1, isDefault: true },
          { id: 2, name: 'En cours', color: '#293848', order: 2, isDefault: true },
          { id: 3, name: 'Révision', color: '#8B5CF6', order: 3, isDefault: true },
        ],
        budget: {
          enabled: false,
          total: 0,
          spent: 0,
          currency: 'EUR'
        }
      },
      {
        id: 4,
        name: 'Dashboard Analytics',
        description: 'Tableau de bord pour les métriques et KPIs',
        color: '#8B5CF6',
        icon: 'chart-bar',
        status: 'planning',
        statusText: 'Planifié',
        progress: 15,
        dueDate: '01 Fév 2026',
        owner: 1,
        members: [1, 2],
        phases: [
          { id: 1, name: 'Idéation', color: '#6B7280', order: 1, isDefault: true },
          { id: 2, name: 'Design', color: '#8B5CF6', order: 2, isDefault: true },
          { id: 3, name: 'Développement', color: '#10B981', order: 3, isDefault: true },
        ],
        budget: {
          enabled: true,
          total: 25000,
          spent: 3750,
          currency: 'EUR'
        }
      }
    ],
    tasks: [
      {
        id: 1,
        title: 'Implémenter le système d\'authentification',
        description: 'Créer le système de login, register et gestion des sessions',
        projectId: 1,
        project: 'Site Web E-commerce',
        status: 'in-progress',
        priority: 'high',
        dueDate: 'Aujourd\'hui',
        assignee: 1,
        assigneeName: 'Admin',
        phase: 'Développement',
        createdAt: '2026-01-15'
      },
      {
        id: 2,
        title: 'Design des maquettes mobile',
        description: 'Créer les designs pour iOS et Android',
        projectId: 2,
        project: 'Application Mobile',
        status: 'in-progress',
        priority: 'medium',
        dueDate: 'Demain',
        assignee: 2,
        assigneeName: 'UserPerso1',
        phase: 'En cours',
        createdAt: '2026-01-14'
      },
      {
        id: 3,
        title: 'Optimiser les requêtes base de données',
        description: 'Améliorer les performances des requêtes SQL',
        projectId: 3,
        project: 'Refactoring Backend',
        status: 'in-progress',
        priority: 'high',
        dueDate: 'Hier',
        assignee: 1,
        assigneeName: 'Admin',
        phase: 'En cours',
        createdAt: '2026-01-13'
      },
      {
        id: 4,
        title: 'Créer les composants graphiques',
        description: 'Développer les composants React pour le dashboard',
        projectId: 4,
        project: 'Dashboard Analytics',
        status: 'todo',
        priority: 'low',
        dueDate: '12 Jan',
        assignee: 2,
        assigneeName: 'UserPerso1',
        phase: 'Design',
        createdAt: '2026-01-12'
      },
      {
        id: 5,
        title: 'Intégrer Stripe pour les paiements',
        description: 'Configurer Stripe et créer les webhooks',
        projectId: 1,
        project: 'Site Web E-commerce',
        status: 'done',
        priority: 'high',
        dueDate: '10 Jan',
        assignee: 1,
        assigneeName: 'Admin',
        phase: 'Développement',
        createdAt: '2026-01-10'
      },
      {
        id: 6,
        title: 'Tests unitaires API',
        description: 'Écrire les tests unitaires pour les endpoints API',
        projectId: 3,
        project: 'Refactoring Backend',
        status: 'todo',
        priority: 'medium',
        dueDate: '15 Jan',
        assignee: 3,
        assigneeName: 'UserPerso2',
        phase: 'Révision',
        createdAt: '2026-01-11'
      }
    ],
    activities: [
      {
        id: 1,
        user: 'Jean Dupont',
        userInitials: 'JD',
        action: 'a complété la tâche "Design homepage"',
        time: 'Il y a 5 minutes',
        type: 'task_completed'
      },
      {
        id: 2,
        user: 'Marie Martin',
        userInitials: 'MM',
        action: 'a créé un nouveau projet "Marketing Q1"',
        time: 'Il y a 1 heure',
        type: 'project_created'
      },
      {
        id: 3,
        user: 'Pierre Bernard',
        userInitials: 'PB',
        action: 'a commenté sur "Refactoring Backend"',
        time: 'Il y a 2 heures',
        type: 'comment'
      },
      {
        id: 4,
        user: 'Sophie Petit',
        userInitials: 'SP',
        action: 'a assigné 3 tâches à l\'équipe',
        time: 'Il y a 3 heures',
        type: 'task_assigned'
      },
      {
        id: 5,
        user: 'Admin',
        userInitials: 'A',
        action: 'a mis à jour le budget du projet "Site Web E-commerce"',
        time: 'Il y a 5 heures',
        type: 'budget_updated'
      },
      {
        id: 6,
        user: 'UserPerso1',
        userInitials: 'U1',
        action: 'a changé le statut de "Design maquettes" à terminé',
        time: 'Hier',
        type: 'status_changed'
      }
    ],
    communities: [
      {
        id: 1,
        name: 'Équipe Développement',
        projectId: 1,
        project: 'Site Web E-commerce',
        description: 'Groupe pour les développeurs du projet e-commerce',
        members: [1, 2, 3],
        type: 'development'
      },
      {
        id: 2,
        name: 'Équipe Design',
        projectId: 2,
        project: 'Application Mobile',
        description: 'Designers et UX/UI de l\'app mobile',
        members: [1, 2],
        type: 'design'
      },
      {
        id: 3,
        name: 'Comité Technique',
        projectId: 3,
        project: 'Refactoring Backend',
        description: 'Discussions techniques sur le refactoring',
        members: [1, 3],
        type: 'technical'
      }
    ]
  }),

  getters: {
    getProjectsByStatus: (state) => (status) => {
      return state.projects.filter(p => p.status === status)
    },
    getTasksByProject: (state) => (projectId) => {
      return state.tasks.filter(t => t.projectId === projectId)
    },
    getTasksByStatus: (state) => (status) => {
      return state.tasks.filter(t => t.status === status)
    },
    getActivitiesByUser: (state) => (userId) => {
      return state.activities.filter(a => a.userId === userId)
    },
    getCommunitiesByProject: (state) => (projectId) => {
      return state.communities.filter(c => c.projectId === projectId)
    }
  },

  actions: {
    addProject(project) {
      this.projects.push({
        ...project,
        id: this.projects.length + 1,
        status: 'planning',
        progress: 0
      })
    },
    updateProject(projectId, updates) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updates }
      }
    },
    deleteProject(projectId) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index !== -1) {
        this.projects.splice(index, 1)
      }
    },
    addTask(task) {
      this.tasks.push({
        ...task,
        id: this.tasks.length + 1,
        status: 'todo',
        createdAt: new Date().toISOString()
      })
    },
    updateTask(taskId, updates) {
      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updates }
      }
    },
    deleteTask(taskId) {
      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    },
    addActivity(activity) {
      this.activities.unshift({
        ...activity,
        id: this.activities.length + 1,
        time: 'À l\'instant'
      })
    }
  }
})
