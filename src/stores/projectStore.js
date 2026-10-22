import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  Project,
  ProjectMember,
  Phase,
  Task,
  TaskAssignee,
  Attachment,
  Comment,
  DiscussionMessage,
  ProjectPlanning,
  UserProfile,
  DashboardWidget,
  AISuggestion,
  WORK_MODES,
  TASK_VIEW_TYPES,
  DEFAULT_PROFESSIONAL_PHASES,
  DEFAULT_PERSONAL_PHASES,
  PROJECT_ROLES,
  TASK_STATUS,
  TASK_PRIORITY,
} from '@/types/projectModels'

export const useProjectStore = defineStore('projectStore', {
  state: () => ({
    // ===== MODE DE TRAVAIL =====
    currentWorkMode: WORK_MODES.PERSONAL, // Pro ou Perso

    // ===== PROJETS =====
    projects: [],
    currentProject: null,
    showProjectForm: false,
    showProjectDetail: false,

    // ===== MEMBRES =====
    projectMembers: [],
    invitedMembers: [], // Membres en attente d'invitation

    // ===== PHASES =====
    phases: [],
    currentPhase: null,

    // ===== TÂCHES =====
    tasks: [],
    currentTask: null,
    showTaskForm: false,
    selectedTaskIds: [], // Pour actions groupées

    // ===== VUES DE TÂCHES =====
    currentTaskView: TASK_VIEW_TYPES.KANBAN,
    taskViewSettings: {
      kanban: { showAssignees: true, showPriority: true, showDueDate: true },
      table: { columns: ['title', 'status', 'assignee', 'dueDate', 'priority'] },
      list: { showSubtasks: true, showProgress: true },
    },

    // ===== ATTACHEMENTS =====
    attachments: [],
    uploadingAttachments: false,

    // ===== COMMENTAIRES =====
    comments: [],
    showComments: false,

    // ===== DISCUSSIONS =====
    discussions: [],
    currentConversation: null, // null = groupe global, ID = conversation privée
    showDiscussionPanel: false,

    // ===== PLANIFICATION =====
    projectPlanning: null,
    showPlanningModal: false,

    // ===== DASHBOARD =====
    dashboardWidgets: [],
    showDashboardSettings: false,

    // ===== GAMIFICATION =====
    userProfile: null,
    showProfileModal: false,

    // ===== IA SUGGESTIONS =====
    aiSuggestions: [],
    showAIPanel: false,

    // ===== UI STATE =====
    isLoading: false,
    error: null,

    // ===== PARTAGE =====
    showShareModal: false,
  }),

  getters: {
    // Projets filtrés par mode
    professionalProjects: (state) => state.projects.filter((p) => p.mode === WORK_MODES.PROFESSIONAL),
    personalProjects: (state) => state.projects.filter((p) => p.mode === WORK_MODES.PERSONAL),

    // Projet actuel
    activeProject: (state) => state.currentProject,

    // Tâches du projet actuel
    activeProjectTasks: (state) => {
      if (!state.currentProject) return []
      return state.tasks.filter((t) => t.projectId === state.currentProject.id)
    },

    // Tâches par phase
    tasksByPhase: (state) => {
      const grouped = {}
      state.phases.forEach((phase) => {
        grouped[phase.id] = state.tasks.filter((t) => t.phaseId === phase.id)
      })
      return grouped
    },

    // Membres du projet actuel
    activeProjectMembers: (state) => {
      if (!state.currentProject) return []
      return state.currentProject.members
    },

    // Statistiques du projet
    projectStats: (state) => {
      if (!state.currentProject) return null
      const tasks = state.activeProjectTasks
      return {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === TASK_STATUS.DONE).length,
        inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
        blocked: tasks.filter((t) => t.status === TASK_STATUS.BLOCKED).length,
        overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date()).length,
        completionRate: tasks.length > 0
          ? Math.round((tasks.filter((t) => t.status === TASK_STATUS.DONE).length / tasks.length) * 100)
          : 0,
      }
    },

    // Charge de travail par membre
    memberWorkload: (state) => {
      const workload = {}
      state.activeProjectMembers.forEach((member) => {
        const memberTasks = state.activeProjectTasks.filter((t) =>
          t.assignees.some((a) => a.userId === member.userId),
        )
        workload[member.userId] = {
          total: memberTasks.length,
          completed: memberTasks.filter((t) => t.status === TASK_STATUS.DONE).length,
          estimatedHours: memberTasks.reduce((sum, t) => sum + (t.timeTracking?.estimatedHours || 0), 0),
        }
      })
      return workload
    },

    // Estimation de temps total du projet
    projectEstimatedHours: (state) => {
      return state.activeProjectTasks.reduce((sum, t) => sum + (t.timeTracking?.estimatedHours || 0), 0)
    },

    // XP et niveau utilisateur
    userLevel: (state) => {
      if (!state.userProfile) return { level: 1, xp: 0, progress: 0 }
      const xpForNextLevel = state.userProfile.level * 1000
      const progress = (state.userProfile.xp % 1000) / 10
      return {
        level: state.userProfile.level,
        xp: state.userProfile.xp,
        progress,
        xpToNext: xpForNextLevel - (state.userProfile.xp % 1000),
      }
    },
  },

  actions: {
    // ===== MODE DE TRAVAIL =====
    setWorkMode(mode) {
      this.currentWorkMode = mode
      // Charger les phases par défaut selon le mode
      if (mode === WORK_MODES.PROFESSIONAL) {
        this.phases = DEFAULT_PROFESSIONAL_PHASES.map((p) => new Phase(p))
      } else {
        this.phases = DEFAULT_PERSONAL_PHASES.map((p) => new Phase(p))
      }
    },

    toggleWorkMode() {
      this.setWorkMode(
        this.currentWorkMode === WORK_MODES.PROFESSIONAL
          ? WORK_MODES.PERSONAL
          : WORK_MODES.PROFESSIONAL,
      )
    },

    // ===== PROJETS =====
    setProjects(projects) {
      this.projects = projects.map((p) => new Project(p))
    },

    addProject(project) {
      const newProject = new Project(project)
      this.projects.push(newProject)
      return newProject
    },

    updateProject(projectId, updates) {
      const index = this.projects.findIndex((p) => p.id === projectId)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updates, updatedAt: new Date().toISOString() }
        if (this.currentProject?.id === projectId) {
          this.currentProject = this.projects[index]
        }
      }
    },

    deleteProject(projectId) {
      this.projects = this.projects.filter((p) => p.id !== projectId)
      if (this.currentProject?.id === projectId) {
        this.currentProject = null
      }
    },

    setCurrentProject(project) {
      this.currentProject = project ? new Project(project) : null
      // Charger les tâches et phases du projet
      if (project) {
        this.phases = project.phases || []
        this.tasks = project.tasks || []
      }
    },

    toggleProjectForm() {
      this.showProjectForm = !this.showProjectForm
    },

    // ===== MEMBRES =====
    addMember(member) {
      const newMember = new ProjectMember(member)
      if (this.currentProject) {
        this.currentProject.members.push(newMember)
      }
      return newMember
    },

    updateMember(memberId, updates) {
      if (this.currentProject) {
        const index = this.currentProject.members.findIndex((m) => m.id === memberId)
        if (index !== -1) {
          this.currentProject.members[index] = { ...this.currentProject.members[index], ...updates }
        }
      }
    },

    removeMember(memberId) {
      if (this.currentProject) {
        this.currentProject.members = this.currentProject.members.filter((m) => m.id !== memberId)
      }
    },

    inviteMember(email, role = PROJECT_ROLES.MEMBER) {
      const invitation = {
        email,
        role,
        status: 'pending',
        invitedAt: new Date().toISOString(),
      }
      this.invitedMembers.push(invitation)
      return invitation
    },

    // ===== PARTAGE =====
    shareProject(projectId, email, permission = 'read') {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        if (!project.sharedWith) {
          project.sharedWith = []
        }
        
        // Vérifier si l'utilisateur est déjà partagé
        const existingIndex = project.sharedWith.findIndex(u => u.email === email)
        if (existingIndex > -1) {
          // Mettre à jour les permissions
          project.sharedWith[existingIndex].permission = permission
        } else {
          // Ajouter le partage
          project.sharedWith.push({
            id: Date.now(),
            email,
            permission,
            sharedAt: new Date().toISOString(),
          })
        }
        
        return project.sharedWith
      }
    },

    removeShare(projectId, userId) {
      const project = this.projects.find(p => p.id === projectId)
      if (project && project.sharedWith) {
        project.sharedWith = project.sharedWith.filter(u => u.id !== userId)
      }
    },

    toggleShareModal() {
      this.showShareModal = !this.showShareModal
    },

    // ===== PHASES =====
    setPhases(phases) {
      this.phases = phases.map((p) => new Phase(p))
    },

    addPhase(phase) {
      const newPhase = new Phase(phase)
      this.phases.push(newPhase)
      if (this.currentProject) {
        this.currentProject.phases.push(newPhase)
      }
      return newPhase
    },

    updatePhase(phaseId, updates) {
      const index = this.phases.findIndex((p) => p.id === phaseId)
      if (index !== -1) {
        this.phases[index] = { ...this.phases[index], ...updates }
      }
    },

    deletePhase(phaseId) {
      this.phases = this.phases.filter((p) => p.id !== phaseId)
      // Réassigner les tâches de cette phase
      this.tasks = this.tasks.map((t) => (t.phaseId === phaseId ? { ...t, phaseId: null } : t))
    },

    reorderPhases(phases) {
      this.phases = phases
    },

    // ===== TÂCHES =====
    setTasks(tasks) {
      this.tasks = tasks.map((t) => new Task(t))
    },

    addTask(task) {
      const newTask = new Task(task)
      this.tasks.push(newTask)
      return newTask
    },

    updateTask(taskId, updates) {
      const index = this.tasks.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date().toISOString() }
        if (this.currentTask?.id === taskId) {
          this.currentTask = this.tasks[index]
        }
      }
    },

    deleteTask(taskId) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId)
      if (this.currentTask?.id === taskId) {
        this.currentTask = null
      }
    },

    setCurrentTask(task) {
      this.currentTask = task ? new Task(task) : null
    },

    toggleTaskForm() {
      this.showTaskForm = !this.showTaskForm
    },

    // Assignation de tâche
    assignTaskToUser(taskId, userId, instructions = '') {
      const task = this.tasks.find((t) => t.id === taskId)
      if (task) {
        const member = this.activeProjectMembers.find((m) => m.userId === userId)
        if (member) {
          const assignee = new TaskAssignee({
            userId,
            username: member.username,
            avatar: member.avatar,
            instructions,
          })
          task.assignees.push(assignee)
        }
      }
    },

    unassignTaskFromUser(taskId, userId) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (task) {
        task.assignees = task.assignees.filter((a) => a.userId !== userId)
      }
    },

    // ===== VUES DE TÂCHES =====
    setTaskView(viewType) {
      this.currentTaskView = viewType
    },

    updateTaskViewSettings(viewType, settings) {
      this.taskViewSettings[viewType] = { ...this.taskViewSettings[viewType], ...settings }
    },

    // ===== ATTACHEMENTS =====
    addAttachment(attachment) {
      const newAttachment = new Attachment(attachment)
      this.attachments.push(newAttachment)
      if (this.currentTask) {
        this.currentTask.attachments.push(newAttachment)
      }
      return newAttachment
    },

    deleteAttachment(attachmentId) {
      this.attachments = this.attachments.filter((a) => a.id !== attachmentId)
      if (this.currentTask) {
        this.currentTask.attachments = this.currentTask.attachments.filter((a) => a.id !== attachmentId)
      }
    },

    // ===== COMMENTAIRES =====
    setComments(comments) {
      this.comments = comments.map((c) => new Comment(c))
    },

    addComment(comment) {
      const newComment = new Comment(comment)
      this.comments.push(newComment)
      if (this.currentTask) {
        this.currentTask.comments.push(newComment)
      }
      return newComment
    },

    deleteComment(commentId) {
      this.comments = this.comments.filter((c) => c.id !== commentId)
      if (this.currentTask) {
        this.currentTask.comments = this.currentTask.comments.filter((c) => c.id !== commentId)
      }
    },

    // ===== DISCUSSIONS =====
    setDiscussions(discussions) {
      this.discussions = discussions.map((d) => new DiscussionMessage(d))
    },

    addDiscussionMessage(message) {
      const newMessage = new DiscussionMessage(message)
      this.discussions.push(newMessage)
      return newMessage
    },

    setCurrentConversation(conversationId) {
      this.currentConversation = conversationId
    },

    toggleDiscussionPanel() {
      this.showDiscussionPanel = !this.showDiscussionPanel
    },

    // ===== PLANIFICATION =====
    setProjectPlanning(planning) {
      this.projectPlanning = new ProjectPlanning(planning)
    },

    updateProjectPlanning(updates) {
      if (this.projectPlanning) {
        this.projectPlanning = { ...this.projectPlanning, ...updates }
      }
    },

    togglePlanningModal() {
      this.showPlanningModal = !this.showPlanningModal
    },

    // ===== DASHBOARD =====
    setDashboardWidgets(widgets) {
      this.dashboardWidgets = widgets.map((w) => new DashboardWidget(w))
    },

    addDashboardWidget(widget) {
      const newWidget = new DashboardWidget(widget)
      this.dashboardWidgets.push(newWidget)
      return newWidget
    },

    updateDashboardWidget(widgetId, updates) {
      const index = this.dashboardWidgets.findIndex((w) => w.id === widgetId)
      if (index !== -1) {
        this.dashboardWidgets[index] = { ...this.dashboardWidgets[index], ...updates }
      }
    },

    deleteDashboardWidget(widgetId) {
      this.dashboardWidgets = this.dashboardWidgets.filter((w) => w.id !== widgetId)
    },

    reorderDashboardWidgets(widgets) {
      this.dashboardWidgets = widgets
    },

    toggleDashboardSettings() {
      this.showDashboardSettings = !this.showDashboardSettings
    },

    // ===== GAMIFICATION =====
    setUserProfile(profile) {
      this.userProfile = new UserProfile(profile)
    },

    addXP(amount) {
      if (this.userProfile) {
        this.userProfile.xp += amount
        // Calculer le nouveau niveau
        const newLevel = Math.floor(this.userProfile.xp / 1000) + 1
        if (newLevel > this.userProfile.level) {
          this.userProfile.level = newLevel
          // Débloquer des récompenses si nécessaire
        }
      }
    },

    completeTask() {
      if (this.userProfile) {
        this.userProfile.totalTasksCompleted += 1
        this.addXP(100) // 100 XP par tâche complétée
      }
    },

    incrementStreak() {
      if (this.userProfile) {
        this.userProfile.streak += 1
        this.addXP(50 * this.userProfile.streak) // Bonus XP pour streak
      }
    },

    resetStreak() {
      if (this.userProfile) {
        this.userProfile.streak = 0
      }
    },

    // ===== IA SUGGESTIONS =====
    setAISuggestions(suggestions) {
      this.aiSuggestions = suggestions.map((s) => new AISuggestion(s))
    },

    addAISuggestion(suggestion) {
      const newSuggestion = new AISuggestion(suggestion)
      this.aiSuggestions.push(newSuggestion)
      return newSuggestion
    },

    applyAISuggestion(suggestionId) {
      const index = this.aiSuggestions.findIndex((s) => s.id === suggestionId)
      if (index !== -1) {
        this.aiSuggestions[index].isApplied = true
      }
    },

    toggleAIPanel() {
      this.showAIPanel = !this.showAIPanel
    },

    // ===== RESET =====
    reset() {
      this.projects = []
      this.currentProject = null
      this.tasks = []
      this.currentTask = null
      this.phases = []
      this.comments = []
      this.discussions = []
      this.attachments = []
      this.error = null
    },
  },
})
