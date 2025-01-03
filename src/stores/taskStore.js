import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    taskList: [], // Toutes les tâches
    showForm: false,
    showModal: false,
    selectedTask: null,
    task: {
      title: '',
      description: '',
      file: '',
      subTodoLists: [],
      userId: null, // Propriétaire de la tâche
    },
  }),

  getters: {
    // Filtrer les tâches de l'utilisateur connecté
    userTasks(state) {
      const userStore = useUserStore()
      return userStore.user
        ? state.taskList.filter((task) => task.userId === userStore.user.UserId)
        : []
    },
  },

  actions: {
    // Charger les tâches pour l'utilisateur connecté
    // Charger les tâches pour l'utilisateur connecté
    loadUserTasks() {
      const userStore = useUserStore()
      const currentUser = userStore.user

      if (!currentUser) {
        console.error('Utilisateur non connecté! Chargement impossible.')
        return
      }

      // Charger les tâches depuis localStorage
      const savedTasks = localStorage.getItem('Tasks')
      if (savedTasks) {
        // Convertir la chaîne JSON en tableau d'objets
        const allTasks = JSON.parse(savedTasks)

        // Filtrer les tâches pour ne charger que celles de l'utilisateur connecté
        this.taskList = allTasks.filter((task) => task.userId === currentUser.UserId)
      } else {
        // Si aucune tâche n'est trouvée dans le localStorage, initialiser taskList à un tableau vide
        this.taskList = []
      }

      console.log("Tâches chargées pour l'utilisateur", currentUser.UserId, ':', this.taskList)
    },

    // Ajouter une tâche
    addTask() {
      const userStore = useUserStore()
      const currentUser = userStore.user

      if (!currentUser) {
        console.error('Utilisateur non connecté! Ajout impossible.')
        return
      }

      // Vérifier si des tâches existent dans le localStorage
      const savedTasks = localStorage.getItem('Tasks')
      let allTasks = savedTasks ? JSON.parse(savedTasks) : []

      // Créer une nouvelle tâche et l'ajouter à la liste des tâches de l'utilisateur
      const newTask = {
        ...this.task,
        subTodoLists: [...this.task.subTodoLists],
        userId: currentUser.UserId, // Associer la tâche à l'utilisateur connecté
      }

      allTasks.push(newTask) // Ajouter la nouvelle tâche à la liste de toutes les tâches

      // Sauvegarder toutes les tâches dans le localStorage (y compris celle de l'utilisateur connecté)
      this.saveTaskSToLocalStorage(allTasks)

      // Ajouter la tâche à la taskList pour un affichage immédiat
      this.taskList.push(newTask)

      this.resetForm()
    },

    // Sauvegarder les tâches dans le localStorage
    saveTaskSToLocalStorage(tasks) {
      localStorage.setItem('Tasks', JSON.stringify(tasks))
    },

    // Réinitialiser le formulaire
    resetForm() {
      this.task = { title: '', description: '', file: '', subTodoLists: [], userId: null }
      this.showForm = false
    },

    // Supprimer une tâche appartenant à l'utilisateur connecté
    removeTask(taskIndex) {
      const userStore = useUserStore()
      const currentUser = userStore.user

      if (!currentUser) {
        console.error('Utilisateur non connecté! Suppression impossible.')
        return
      }

      const taskToRemove = this.taskList[taskIndex]
      if (taskToRemove && taskToRemove.userId === currentUser.UserId) {
        this.taskList.splice(taskIndex, 1)
      } else {
        console.error('Suppression refusée : cette tâche ne vous appartient pas.')
      }
    },

    // Ajouter une sous-tâche
    addSubTask() {
      this.task.subTodoLists.push({ name: '' })
    },

    // Supprimer une sous-tâche
    removeSubTask(index) {
      if (this.task.subTodoLists && index >= 0 && index < this.task.subTodoLists.length) {
        this.task.subTodoLists.splice(index, 1)
      } else {
        console.error('Sous-tâche introuvable.')
      }
    },

    // Basculer l'affichage du formulaire
    toggleForm() {
      this.showForm = !this.showForm
      if (this.showForm && this.task.subTodoLists.length === 0) {
        this.task.subTodoLists.push({ name: '' })
      }
    },

    // Ouvrir une modal pour une tâche spécifique
    openModal(task) {
      const userStore = useUserStore()
      const currentUser = userStore.user

      if (!currentUser) {
        console.error('Utilisateur non connecté! Ouverture impossible.')
        return
      }

      if (task.userId === currentUser.UserId) {
        this.selectedTask = task
        this.showModal = true
      } else {
        console.error('Accès refusé : cette tâche ne vous appartient pas.')
      }
    },

    // Gérer le téléchargement de fichier
    handleFileUpload(file) {
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          this.task.file = reader.result
        }
        reader.readAsDataURL(file)
      }
    },

    // Réinitialiser les tâches lors de la déconnexion
/*     resetTasksOnLogout() {
      this.taskList = [] // Vider la liste des tâches
    }, */
  },
})
