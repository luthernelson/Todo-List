import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { apiService, setAuthToken } from '@/service/apiServices'
import router from '@/router'

export const useUserStore = defineStore('auth', {
  state: () => ({
    user: useStorage('user', null, sessionStorage), // Objet utilisateur persistant
    token: useStorage('token', null, sessionStorage), // Jeton d'authentification persistant
    lastRoute: useStorage('lastRoute', null, sessionStorage), // Dernière route visitée
    idUser: useStorage('idUser', null, sessionStorage), // ID de l'utilisateur
    username: useStorage('username', null, sessionStorage), // Nom d'utilisateur
  }),

  getters: {
    isLoggedIn: (state) => !!state.user, // Vérifie si l'utilisateur est connecté
  },

  actions: {
    checkAuth() {
      const token = this.token
      if (token) {
        setAuthToken(token) // Configure le jeton pour les requêtes futures
      }
    },

    async login(email, password) {
      try {
        const { users, token, idUser, username } = await apiService.login(email, password)
        this.user = users
        this.token = token
        this.idUser = idUser
        this.username = username
        setAuthToken(token)
        console.log('Utilisateur connecté :', users)
        const lastRoute = this.lastRoute || '/'
        router.push(lastRoute)
      } catch (error) {
        console.error("Erreur d'authentification :", error)
        throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.')
      }
    },

    logout() {
      this.user = null
      this.token = null
      setAuthToken(null)
      this.lastRoute = null // Efface la dernière route
      router.push('/login')
    },

    setLastRoute(route) {
      this.lastRoute = route // Enregistre la dernière route
      console.log('Dernière route enregistrée :', route) // Débogage
    },
  },
})

// Fonction pour initialiser l'authentification
export function useAuth() {
  const authStore = useUserStore()
  authStore.checkAuth() // Vérifie l'authentification à l'initialisation

  // Redirige vers la dernière route visitée si déjà authentifié
  if (authStore.isLoggedIn) {
    const lastRoute = authStore.lastRoute || '/' // Utilise la page d'accueil par défaut
    if (lastRoute) {
      router.push(lastRoute)
    } else {
      router.push('/') // Redirection vers la page d'accueil si lastRoute est nul
    }
  }
  return authStore
}
