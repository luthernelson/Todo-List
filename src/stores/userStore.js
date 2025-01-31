import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { apiService, setAuthToken } from '@/service/apiServices'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: useStorage('user', null), // Objet utilisateur
    token: useStorage('token', null), // Jeton d'authentification
  }),

  getters: {
    isLoggedIn: (state) => {
      console.log('STATE.user', state.users)
      return state.users ? true : false
    }, // Vérifie si un utilisateur est connecté
    getUser: (state) => state.users, // Récupère l'utilisateur connecté
  },

  actions: {
    // Méthode pour vérifier l'authentification
    checkAuth() {
      const token = this.token // Récupérer le token depuis l'état
      if (token) {
        setAuthToken(token) // Configurer le token pour les requêtes futures
        // Optionnel : Récupérer les informations de l'utilisateur du serveur
        // this.getUserFromToken(token);
      }
    },
    async login(email, password) {
      try {
        const { users, token } = await apiService.login(email, password) // Utilisez la méthode de connexion
        this.users = users
        this.token = token
        setAuthToken(token) // Configurer le token pour les requêtes futures
        console.log('Utilisateur connecté :', users)
      } catch (error) {
        console.error("Erreur lors de l'authentification:", error)
        throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.')
      }
    },

    logout() {
      this.users = null
      this.token = null
      setAuthToken(null) // Supprimer le token lors de la déconnexion
    },
  },
})
// Appeler checkAuth lors de l'utilisation du store
export function useAuth() {
  const userStore = useUserStore()
  userStore.checkAuth() // Vérifier l'authentification à l'initialisation
  return userStore
}
