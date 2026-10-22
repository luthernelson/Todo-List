import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivityStore = defineStore('activityStore', {
  state: () => ({
    activities: [],
    isLoading: false,
    error: null,
    lastSync: null,
    unreadCount: 0,
  }),

  getters: {
    recentActivities: (state) => {
      return state.activities
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20)
    },

    activitiesByUser: (state) => (userId) => {
      return state.activities.filter(a => a.userId === userId)
    },

    activitiesByProject: (state) => (projectId) => {
      return state.activities.filter(a => a.projectId === projectId)
    },

    activitiesByType: (state) => (type) => {
      return state.activities.filter(a => a.type === type)
    },

    activitiesByDate: (state) => (date) => {
      const targetDate = new Date(date).toDateString()
      return state.activities.filter(a => {
        const activityDate = new Date(a.createdAt).toDateString()
        return activityDate === targetDate
      })
    },

    activityStats: (state) => {
      const stats = {
        total: state.activities.length,
        byType: {},
        byProject: {},
      }

      state.activities.forEach(activity => {
        stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1
        if (activity.projectId) {
          stats.byProject[activity.projectId] = (stats.byProject[activity.projectId] || 0) + 1
        }
      })

      return stats
    },
  },

  actions: {
    addActivity(activity) {
      const newActivity = {
        id: Date.now(),
        ...activity,
        createdAt: new Date().toISOString(),
        read: false,
      }
      this.activities.unshift(newActivity)
      this.unreadCount++

      // Garder seulement les 100 dernières activités
      if (this.activities.length > 100) {
        this.activities = this.activities.slice(0, 100)
      }

      return newActivity
    },

    addProjectCreated(projectId, projectName, userId, username) {
      return this.addActivity({
        type: 'project_created',
        projectId,
        projectName,
        userId,
        username,
        action: `a créé le projet "${projectName}"`,
        icon: 'folder-plus',
        category: 'project',
      })
    },

    addTaskCreated(taskId, taskTitle, projectId, projectName, userId, username) {
      return this.addActivity({
        type: 'task_created',
        taskId,
        taskTitle,
        projectId,
        projectName,
        userId,
        username,
        action: `a créé la tâche "${taskTitle}"`,
        icon: 'plus-circle',
        category: 'task',
      })
    },

    addTaskCompleted(taskId, taskTitle, projectId, projectName, userId, username) {
      return this.addActivity({
        type: 'task_completed',
        taskId,
        taskTitle,
        projectId,
        projectName,
        userId,
        username,
        action: `a complété la tâche "${taskTitle}"`,
        icon: 'check-circle',
        category: 'task',
      })
    },

    addTaskUpdated(taskId, taskTitle, projectId, projectName, userId, username) {
      return this.addActivity({
        type: 'task_updated',
        taskId,
        taskTitle,
        projectId,
        projectName,
        userId,
        username,
        action: `a mis à jour la tâche "${taskTitle}"`,
        icon: 'edit',
        category: 'task',
      })
    },

    addCommentAdded(taskId, taskTitle, projectId, projectName, userId, username) {
      return this.addActivity({
        type: 'comment_added',
        taskId,
        taskTitle,
        projectId,
        projectName,
        userId,
        username,
        action: `a commenté sur "${taskTitle}"`,
        icon: 'message-circle',
        category: 'comment',
      })
    },

    addMemberInvited(projectId, projectName, invitedBy, invitedUser) {
      return this.addActivity({
        type: 'member_invited',
        projectId,
        projectName,
        userId: invitedBy.userId,
        username: invitedBy.username,
        action: `a invité ${invitedUser} à rejoindre "${projectName}"`,
        icon: 'user-plus',
        category: 'member',
      })
    },

    addBudgetUpdated(projectId, projectName, userId, username) {
      return this.addActivity({
        type: 'budget_updated',
        projectId,
        projectName,
        userId,
        username,
        action: `a mis à jour le budget de "${projectName}"`,
        icon: 'coins',
        category: 'budget',
      })
    },

    addCompanyCreated(companyId, companyName, userId, username) {
      return this.addActivity({
        type: 'company_created',
        companyId,
        companyName,
        userId,
        username,
        action: `a créé l'entreprise "${companyName}"`,
        icon: 'building',
        category: 'company',
      })
    },

    addMemberJoined(companyId, companyName, userId, username) {
      return this.addActivity({
        type: 'member_joined',
        companyId,
        companyName,
        userId,
        username,
        action: `a rejoint l'entreprise "${companyName}"`,
        icon: 'user-check',
        category: 'member',
      })
    },

    addSubscriptionUpgraded(companyId, companyName, planId, userId, username) {
      return this.addActivity({
        type: 'subscription_upgraded',
        companyId,
        companyName,
        planId,
        userId,
        username,
        action: `a mis à jour l'abonnement de "${companyName}"`,
        icon: 'credit-card',
        category: 'subscription',
      })
    },

    markAsRead(activityId) {
      const activity = this.activities.find(a => a.id === activityId)
      if (activity && !activity.read) {
        activity.read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    markAllAsRead() {
      this.activities.forEach(activity => {
        activity.read = true
      })
      this.unreadCount = 0
    },

    loadActivities(activities) {
      this.activities = activities
      this.unreadCount = activities.filter(a => !a.read).length
    },

    clearActivities() {
      this.activities = []
      this.unreadCount = 0
    },

    getActivityCount(projectId = null) {
      if (projectId) {
        return this.activities.filter(a => a.projectId === projectId).length
      }
      return this.activities.length
    },

    syncActivities() {
      this.lastSync = new Date().toISOString()
    },

    loadMockActivities() {
      const mockActivities = [
        {
          id: 1,
          type: 'project_created',
          projectId: 1,
          projectName: 'Site Web E-commerce',
          userId: 1,
          username: 'Admin',
          action: 'a créé le projet "Site Web E-commerce"',
          icon: 'folder-plus',
          category: 'project',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: 2,
          type: 'task_created',
          taskId: 1,
          taskTitle: 'Créer la page d\'accueil',
          projectId: 1,
          projectName: 'Site Web E-commerce',
          userId: 1,
          username: 'Admin',
          action: 'a créé la tâche "Créer la page d\'accueil"',
          icon: 'plus-circle',
          category: 'task',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          read: true,
        },
        {
          id: 3,
          type: 'task_completed',
          taskId: 2,
          taskTitle: 'Configurer la base de données',
          projectId: 1,
          projectName: 'Site Web E-commerce',
          userId: 2,
          username: 'UserPerso1',
          action: 'a complété la tâche "Configurer la base de données"',
          icon: 'check-circle',
          category: 'task',
          createdAt: new Date(Date.now() - 900000).toISOString(),
          read: false,
        },
        {
          id: 4,
          type: 'comment_added',
          taskId: 1,
          taskTitle: 'Créer la page d\'accueil',
          projectId: 1,
          projectName: 'Site Web E-commerce',
          userId: 2,
          username: 'UserPerso1',
          action: 'a commenté sur "Créer la page d\'accueil"',
          icon: 'message-circle',
          category: 'comment',
          createdAt: new Date(Date.now() - 600000).toISOString(),
          read: false,
        },
        {
          id: 5,
          type: 'member_invited',
          projectId: 1,
          projectName: 'Site Web E-commerce',
          userId: 1,
          username: 'Admin',
          action: 'a invité UserPerso2 à rejoindre "Site Web E-commerce"',
          icon: 'user-plus',
          category: 'member',
          createdAt: new Date(Date.now() - 300000).toISOString(),
          read: false,
        },
      ]
      this.loadActivities(mockActivities)
    },
  },
})
