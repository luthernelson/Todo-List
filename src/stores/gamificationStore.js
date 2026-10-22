import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserProfile } from '@/types/projectModels'

export const useGamificationStore = defineStore('gamificationStore', {
  state: () => ({
    userProfile: null,
    badges: [
      { id: 1, name: 'Première tâche', description: 'Compléter votre première tâche', icon: '🎯', requirement: 1, type: 'tasks' },
      { id: 2, name: 'Sérieux', description: 'Compléter 10 tâches', icon: '🏆', requirement: 10, type: 'tasks' },
      { id: 3, name: 'Maître', description: 'Compléter 100 tâches', icon: '👑', requirement: 100, type: 'tasks' },
      { id: 4, name: 'Streak 3', description: '3 jours consécutifs', icon: '🔥', requirement: 3, type: 'streak' },
      { id: 5, name: 'Streak 7', description: '7 jours consécutifs', icon: '⚡', requirement: 7, type: 'streak' },
      { id: 6, name: 'Streak 30', description: '30 jours consécutifs', icon: '💎', requirement: 30, type: 'streak' },
      { id: 7, name: 'Niveau 5', description: 'Atteindre le niveau 5', icon: '⭐', requirement: 5, type: 'level' },
      { id: 8, name: 'Niveau 10', description: 'Atteindre le niveau 10', icon: '🌟', requirement: 10, type: 'level' },
      { id: 9, name: 'Niveau 25', description: 'Atteindre le niveau 25', icon: '✨', requirement: 25, type: 'level' },
    ],
    themes: [
      { id: 'default', name: 'Défaut', colors: { primary: '#293848', secondary: '#10B981' }, unlockedAt: 0 },
      { id: 'dark', name: 'Dark Mode', colors: { primary: '#6366F1', secondary: '#8B5CF6' }, unlockedAt: 0 },
      { id: 'ocean', name: 'Océan', colors: { primary: '#0EA5E9', secondary: '#06B6D4' }, unlockedAt: 500 },
      { id: 'sunset', name: 'Coucher de soleil', colors: { primary: '#F59E0B', secondary: '#EF4444' }, unlockedAt: 1000 },
      { id: 'forest', name: 'Forêt', colors: { primary: '#10B981', secondary: '#059669' }, unlockedAt: 2000 },
      { id: 'galaxy', name: 'Galaxie', colors: { primary: '#8B5CF6', secondary: '#EC4899' }, unlockedAt: 5000 },
    ],
    showLevelUpAnimation: false,
    showBadgeUnlocked: false,
    lastUnlockedBadge: null,
  }),

  getters: {
    // Calculer le niveau actuel
    currentLevel: (state) => {
      if (!state.userProfile) return 1
      return Math.floor(state.userProfile.xp / 1000) + 1
    },

    // XP pour le niveau suivant
    xpToNextLevel: (state) => {
      const level = state.currentLevel
      return level * 1000 - (state.userProfile?.xp || 0)
    },

    // Progression vers le niveau suivant (en pourcentage)
    levelProgress: (state) => {
      if (!state.userProfile) return 0
      const currentLevelXP = (state.currentLevel - 1) * 1000
      const xpInCurrentLevel = state.userProfile.xp - currentLevelXP
      return Math.round((xpInCurrentLevel / 1000) * 100)
    },

    // Badges débloqués
    unlockedBadges: (state) => {
      if (!state.userProfile) return []
      return state.badges.filter((badge) => state.userProfile.badges.includes(badge.id))
    },

    // Badges non débloqués
    lockedBadges: (state) => {
      if (!state.userProfile) return state.badges
      return state.badges.filter((badge) => !state.userProfile.badges.includes(badge.id))
    },

    // Thèmes débloqués
    unlockedThemes: (state) => {
      if (!state.userProfile) return [state.themes[0]]
      return state.themes.filter((theme) => state.userProfile.xp >= theme.unlockedAt)
    },

    // Thème actuel
    currentTheme: (state) => {
      if (!state.userProfile) return state.themes[0]
      return state.themes.find((t) => t.id === state.userProfile.theme) || state.themes[0]
    },

    // Prochain badge à débloquer
    nextBadgeToUnlock: (state) => {
      if (!state.userProfile) return state.badges[0]
      return state.lockedBadges[0] || null
    },

    // Statistiques de productivité
    productivityStats: (state) => {
      if (!state.userProfile) return null
      return {
        tasksCompletedThisWeek: state.userProfile.statistics?.tasksCompletedThisWeek || 0,
        tasksCompletedThisMonth: state.userProfile.statistics?.tasksCompletedThisMonth || 0,
        totalHoursSaved: state.userProfile.statistics?.totalHoursSaved || 0,
        mostProductiveDay: state.userProfile.statistics?.mostProductiveDay || null,
        totalTasksCompleted: state.userProfile.totalTasksCompleted || 0,
        currentStreak: state.userProfile.streak || 0,
      }
    },
  },

  actions: {
    // Initialiser le profil utilisateur
    initUserProfile(userId) {
      if (!this.userProfile) {
        this.userProfile = new UserProfile({
          userId,
          xp: 0,
          level: 1,
          totalTasksCompleted: 0,
          streak: 0,
          badges: [],
          avatar: null,
          theme: 'default',
          statistics: {
            tasksCompletedThisWeek: 0,
            tasksCompletedThisMonth: 0,
            totalHoursSaved: 0,
            mostProductiveDay: null,
          },
        })
      }
    },

    // Ajouter de l'XP
    addXP(amount) {
      if (!this.userProfile) return

      const oldLevel = this.currentLevel
      this.userProfile.xp += amount
      const newLevel = this.currentLevel

      // Vérifier si on a changé de niveau
      if (newLevel > oldLevel) {
        this.showLevelUpAnimation = true
        this.checkBadges('level', newLevel)
        setTimeout(() => {
          this.showLevelUpAnimation = false
        }, 3000)
      }
    },

    // Compléter une tâche
    completeTask() {
      if (!this.userProfile) return

      this.userProfile.totalTasksCompleted += 1
      this.userProfile.statistics.tasksCompletedThisWeek += 1
      this.userProfile.statistics.tasksCompletedThisMonth += 1

      // Ajouter de l'XP
      this.addXP(100)

      // Vérifier les badges de tâches
      this.checkBadges('tasks', this.userProfile.totalTasksCompleted)
    },

    // Incrémenter le streak
    incrementStreak() {
      if (!this.userProfile) return

      this.userProfile.streak += 1
      this.addXP(50 * this.userProfile.streak) // Bonus XP pour streak

      // Vérifier les badges de streak
      this.checkBadges('streak', this.userProfile.streak)
    },

    // Réinitialiser le streak
    resetStreak() {
      if (!this.userProfile) return
      this.userProfile.streak = 0
    },

    // Changer le thème
    setTheme(themeId) {
      if (!this.userProfile) return
      const theme = this.themes.find((t) => t.id === themeId)
      if (theme && this.userProfile.xp >= theme.unlockedAt) {
        this.userProfile.theme = themeId
      }
    },

    // Débloquer un badge
    unlockBadge(badgeId) {
      if (!this.userProfile) return
      if (!this.userProfile.badges.includes(badgeId)) {
        this.userProfile.badges.push(badgeId)
        this.lastUnlockedBadge = this.badges.find((b) => b.id === badgeId)
        this.showBadgeUnlocked = true
        setTimeout(() => {
          this.showBadgeUnlocked = false
        }, 3000)
      }
    },

    // Vérifier si un badge doit être débloqué
    checkBadges(type, value) {
      this.badges.forEach((badge) => {
        if (badge.type === type && value >= badge.requirement) {
          this.unlockBadge(badge.id)
        }
      })
    },

    // Mettre à jour les statistiques
    updateStatistics(stats) {
      if (!this.userProfile) return
      this.userProfile.statistics = { ...this.userProfile.statistics, ...stats }
    },

    // Enregistrer les données dans localStorage
    saveToStorage() {
      if (this.userProfile) {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile))
      }
    },

    // Charger les données depuis localStorage
    loadFromStorage() {
      const saved = localStorage.getItem('userProfile')
      if (saved) {
        try {
          this.userProfile = new UserProfile(JSON.parse(saved))
        } catch (e) {
          console.error('Erreur lors du chargement du profil:', e)
        }
      }
    },

    // Réinitialiser le profil
    reset() {
      this.userProfile = null
      localStorage.removeItem('userProfile')
    },
  },
})
