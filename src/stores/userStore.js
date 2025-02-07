import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { apiService, setAuthToken } from '@/service/apiServices'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    user: useStorage('user', null), // Objet utilisateur
    token: useStorage('token', null), // Jeton d'authentification
    lastRoute: useStorage('lastRoute', null), // Dernière route visitée
    idUser: useStorage('idUser', null), // ID de l'utilisateur
    username: useStorage('username', null), // Nom d'utilisateur
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    checkAuth() {
      const token = this.token
      if (token) {
        setAuthToken(token) // Configurer le token pour les requêtes futures
        // Optionnel : récupérer les informations de l'utilisateur depuis le serveur
        // this.getUserFromToken(token);
      }
    },
    async login(email, password) {
      try {
        const { users, token, idUser, username } = await apiService.login(email, password)
        this.user = users
        this.token = token
        this.idUser = idUser // Mettez à jour l'ID de l'utilisateur
        this.username = username // Mettez à jour le nom d'utilisateur
        this.isAuthenticated = true
        setAuthToken(token)
        console.log('Utilisateur connecté :', users)
        console.log('ID de l’utilisateur connecté:', this.idUser) // Log de l'ID de l'utilisateur
        console.log('username de l’utilisateur connecté:', this.username)
        const lastRoute = sessionStorage.getItem('lastRoute') || '/'
        router.push(lastRoute)
      } catch (error) {
        console.error("Erreur lors de l'authentification:", error)
        throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.')
      }
    },

    logout() {
      this.users = null
      this.token = null
      setAuthToken(null)
      this.isAuthenticated = false
      sessionStorage.removeItem('lastRoute') // Supprimer la dernière route du sessionStorage
      router.push('/login')
    },

    setLastRoute(route) {
      sessionStorage.setItem('lastRoute', route) // Enregistrer la dernière route dans sessionStorage
      console.log('Dernière route enregistrée:', route) // Débogage
    },
  },
})
// Assurez-vous que cette fonction est bien exportée
export function useAuth() {
  const userStore = useUserStore()
  userStore.checkAuth() // Vérifier l'authentification à l'initialisation
  // Rediriger l'utilisateur vers la dernière route visitée s'il est déjà authentifié
  if (userStore.isLoggedIn && userStore.lastRoute) {
    router.push(userStore.lastRoute)
  }
  return userStore
}
