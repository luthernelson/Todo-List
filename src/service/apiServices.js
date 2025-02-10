// src/services/apiService.js
import axios from 'axios'

const API_URL = 'http://localhost:3001/api' // Base URL for your API

// Create an instance of axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fonction pour configurer le token d'authentification
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

// Service functions to interact with the API

export const apiService = {
  // GET Request: Fetch data (you can customize this to fetch specific resources)
  /*   get(endpoint) {
    return apiClient
      .get(endpoint)
      .then((response) => response.data)
      .catch((error) => {
        console.error('There was an error with the GET request:', error)
        throw error
      })
  }, */

  //Authentification

  login(email, password) {
    return apiClient
      .post('/user/login', { email, password })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors de la connexion:', error)
        throw error
      })
  },

  // Liste des Taches
  getTasks() {
    return apiClient
      .get('/tasks/listTasks')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors du chargement des taches de cet utilisateur:', error)
        throw error
      })
  },

  getTaskById(id) {
    return apiClient
      .get(`/tasks/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors du chargement de la tache:', error)
        throw error
      })
  },
  getUser() {
    return apiClient
      .get('/getUsers')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors du chargement des taches de cet utilisateur:', error)
        throw error
      })
  },

  getsharedTasks() {
    return apiClient
      .get('/getsharedTasks')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors du chargement des taches partarges:', error)
        throw error
      })
  },

  getCommentById(id) {
    return apiClient
      .get(`/tasks/getComment/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors du chargement de la tache:', error)
        throw error
      })
  },
  //Ajouter une nouvelle tache

  addTask(taskData) {
    return apiClient
      .post('/tasks/addTasks', taskData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error lors de l'de cette taches:", error)
        throw error
      })
  },
  shareTask(taskData) {
    return apiClient
      .post('/tasks/shareTasks', taskData)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors du partarge de cette taches:', error)
        throw error
      })
  },

  addTodo(taskData) {
    return apiClient
      .post('/tasks/addTodo', taskData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error lors de l'de cette taches:", error)
        throw error
      })
  },
  addComment(taskData) {
    return apiClient
      .post('/tasks/addComment', taskData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error lors de l'ajout de commmentaire:", error)
        throw error
      })
  },
  addUser(userData) {
    return apiClient
      .post('/user/adduser', userData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error lors de l'ajout d'un utilisateur'", error)
        throw error
      })
  },
  //update task
  updateTask(id, payload) {
    return apiClient
      .put(`/tasks/${id}`, payload)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors de la modification de la tache:', error)
        throw error
      })
  },

  // DELETE Request: Delete data
  removeTask(id) {
    return apiClient
      .delete(`/tasks/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors de la suppression de cette tache:', error)
        throw error
      })
  },
  removeTodo(taskId, todoId) {
    return apiClient
      .delete(`/tasks/${taskId}/todos/${todoId}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error lors de la suppression de cette tache:', error)
        throw error
      })
  },
}
