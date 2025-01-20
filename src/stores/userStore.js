import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { apiService, setAuthToken } from '@/service/apiServices'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: useStorage('user', null), // Objet utilisateur
    token: useStorage('token', null), // Jeton d'authentification
  }),

  getters: {
    isLoggedIn: (state) => !!state.user, // Vérifie si un utilisateur est connecté
    getUser: (state) => state.user, // Récupère l'utilisateur connecté
  },

  actions: {
    async login(email, password) {
      try {
        const { user, token } = await apiService.login(email, password) // Utilisez la méthode de connexion
        this.user = user
        this.token = token
        setAuthToken(token) // Configurer le token pour les requêtes futures
        console.log('Utilisateur connecté :', this.user)
      } catch (error) {
        console.error("Erreur lors de l'authentification:", error)
        throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.')
      }
    },

    logout() {
      this.user = null
      this.token = null
      setAuthToken(null) // Supprimer le token lors de la déconnexion
    },
  },
})
