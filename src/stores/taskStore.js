import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { apiService } from '@/service/apiServices'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    taskList: [],
    sharedTaskList: [],
    allCommentsToTask: [],
    showForm: false,
    showModal: false,
    selectedTask: null,
    showUpdateModal: false,
    UsersList: [],
    ismodalvisible: false,
  }),

  getters: {},

  actions: {
    // Charger les tâches pour l'utilisateur connecté
    // Charger les tâches pour l'utilisateur connecté

    async loadUserTasks() {
      const userStore = useUserStore()
      const currentUser = userStore.token

      if (!currentUser) {
        console.error('Utilisateur non connecté! Chargement impossible.')
        return
      }

      try {
        const tasks = await apiService.getTasks() // Appel à l'API sans argument
        this.taskList = tasks // Mettre à jour taskList avec les tâches récupérées
        console.log("Tâches chargées pour l'utilisateur:", this.taskList)
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error)
      }
    },
    loadUser(users) {
      this.UsersList = users
    },
    // Ajouter une tâche
    addTask(newTask) {
      console.log('old:', this.taskList)
      this.taskList.push(newTask) // Ajoute la tâche à la liste des tâches
      console.log('new:', this.taskList)
    },
    addTodo(newTodo) {
      this.todoList.push(newTodo) // Ajoute le todo à la liste des todos
    },
    // Supprimer une tâche appartenant à l'utilisateur connecté
    removeTask(taskId) {
      console.log('ID à supprimer:', taskId)
      console.log('Avant suppression:', this.taskList)

      this.taskList = this.taskList.filter((t) => t.task.idTask !== taskId)

      console.log('Après suppression:', this.taskList)
    },
    // Supprimer une tâche appartenant à l'utilisateur connecté
    updateSelectedTask(task) {
      this.selectedTask = task
    },
    checkUserSelectedTask(task) {
      this.selectedTask = task
    },
    deleteTodoTask(todoId, taskId) {
      const todo = this.taskList.find((t) => t.task.idTask === taskId)
      if (todo) {
        todo.todos = todo.todos.filter((t) => t.idTodo !== todoId)
      }
    },
    updateAfterShare(task) {
      this.selectedTask = task
    },
    setSelectedTask(task) {
      this.selectedTask = task
    },
    // Basculer l'affichage du formulaire
    toggleForm() {
      this.showForm = !this.showForm
    },

    // Ouvrir une modal pour une tâche spécifique
    openModal(task) {
      this.selectedTask = task
      this.showModal = true
    },
    openUserModal() {
      this.ismodalvisible = true
    },

    openUpdateModal() {
      this.showUpdateModal = true
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
    setSharedTaskList(task) {
      this.sharedTaskList = task
    },
    setTaskList(task) {
      this.taskList = task
    },
    setTaskLisByID(task) {
      this.taskList = task
    },
    setCommentsToTask(comments) {
      this.allCommentsToTask = Array.isArray(comments) ? [...comments] : []
      console.log('this.allCommentsToTask in store', this.allCommentsToTask)
      // console.log('taskList after set task list', comments)
      // this.CalculateCompletionPercentage();
    },
    // Réinitialiser les tâches lors de la déconnexion
    /*     resetTasksOnLogout() {
      this.taskList = [] // Vider la liste des tâches
    }, */
  },
})
