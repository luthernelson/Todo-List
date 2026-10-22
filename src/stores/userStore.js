import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { apiService, setAuthToken } from '@/service/apiServices'
import router from '@/router'
import { useTwoFactorStore } from './twoFactorStore'

// Utilisateurs fictifs pour le mode sans backend
const MOCK_USERS = [
  {
    id: 1,
    idUser: 1,
    username: 'admin',
    email: 'admin@workstream.com',
    password: 'admin123',
    role: 'admin',
    isFirstLogin: false,
    token: 'demo-token-admin-' + Date.now(),
  },
  {
    id: 2,
    idUser: 2,
    username: 'userperso1',
    email: 'user1@workstream.com',
    password: 'user123',
    role: 'user',
    isFirstLogin: true,
    token: 'demo-token-user1-' + Date.now(),
  },
  {
    id: 3,
    idUser: 3,
    username: 'userperso2',
    email: 'user2@workstream.com',
    password: 'user123',
    role: 'user',
    isFirstLogin: false,
    token: 'demo-token-user2-' + Date.now(),
  },
]

// Stockage local des utilisateurs (pour que l'admin puisse en créer de nouveaux)
let localMockUsers = []
try {
  const storedUsers = localStorage.getItem('mockUsers')
  if (storedUsers) {
    localMockUsers = JSON.parse(storedUsers)
  }
  // Si le localStorage est vide ou corrompu, utiliser les utilisateurs par défaut
  if (!localMockUsers || localMockUsers.length === 0) {
    localMockUsers = [...MOCK_USERS]
    localStorage.setItem('mockUsers', JSON.stringify(localMockUsers))
  }
} catch (e) {
  console.error('Erreur lors de la lecture du localStorage:', e)
  localMockUsers = [...MOCK_USERS]
  localStorage.setItem('mockUsers', JSON.stringify(localMockUsers))
}

// Fonction globale accessible via la console pour réinitialiser les utilisateurs
if (typeof window !== 'undefined') {
  window.resetWorkstreamUsers = () => {
    localMockUsers = [...MOCK_USERS]
    localStorage.setItem('mockUsers', JSON.stringify(localMockUsers))
    console.log('✅ Utilisateurs réinitialisés aux valeurs par défaut')
    console.log('Utilisants disponibles:', localMockUsers.map(u => ({ email: u.email, username: u.username })))
    return localMockUsers
  }

  window.clearWorkstreamAuth = () => {
    sessionStorage.clear()
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('idUser')
    localStorage.removeItem('username')
    localStorage.removeItem('lastRoute')
    console.log('✅ Authentification effacée')
    console.log('Veuillez rafraîchir la page (F5)')
  }

  console.log('💡 Commandes disponibles dans la console:')
  console.log('  - resetWorkstreamUsers() : Réinitialiser les utilisateurs par défaut')
  console.log('  - clearWorkstreamAuth() : Effacer l\'authentification')
}

export const useUserStore = defineStore('auth', {
  state: () => ({
    user: null, // Stocké manuellement pour éviter les problèmes de sérialisation
    token: useStorage('token', null, sessionStorage), // Jeton d'authentification persistant
    lastRoute: useStorage('lastRoute', null, sessionStorage), // Dernière route visitée
    idUser: useStorage('idUser', null, sessionStorage), // ID de l'utilisateur
    username: useStorage('username', null, sessionStorage), // Nom d'utilisateur
    useMockMode: true, // Mode sans backend activé par défaut
  }),

  getters: {
    isLoggedIn: (state) => !!state.user, // Vérifie si l'utilisateur est connecté

    // Vérifier si c'est la première connexion
    isFirstLogin: (state) => state.user?.isFirstLogin || false,

    // Permissions basées sur le rôle
    canCreateProjects: (state) => {
      if (!state.user) return false
      return true
    },

    canManageUsers: (state) => {
      if (!state.user) return false
      return state.user.role === 'admin'
    },

    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    // Charger l'utilisateur depuis sessionStorage
    loadUser() {
      try {
        const storedUser = sessionStorage.getItem('user')
        if (storedUser) {
          this.user = JSON.parse(storedUser)
        }
      } catch (e) {
        console.error('Erreur lors du chargement de l\'utilisateur:', e)
      }
    },

    // Sauvegarder l'utilisateur dans sessionStorage
    saveUser() {
      if (this.user) {
        sessionStorage.setItem('user', JSON.stringify(this.user))
      } else {
        sessionStorage.removeItem('user')
      }
    },

    // Méthode helper pour mettre à jour l'utilisateur de manière réactive
    updateUser(updatedUser) {
      this.user = updatedUser
      this.saveUser()
    },

    checkAuth() {
      const token = this.token
      if (token) {
        // Charger l'utilisateur depuis sessionStorage
        this.loadUser()
        setAuthToken(token) // Configure le jeton pour les requêtes futures
      }
    },

    async login(email, password) {
      // Mode sans backend - vérifier les identifiants dans la liste des utilisateurs fictifs
      if (this.useMockMode) {
        console.log('Mode mock - Vérification des identifiants')
        console.log('Email saisi:', email)
        console.log('Mot de passe saisi:', password)
        console.log('Utilisants disponibles:', localMockUsers.map(u => ({ email: u.email, username: u.username })))

        const user = localMockUsers.find(
          (u) => u.email === email && u.password === password
        )

        if (!user) {
          console.log('Aucun utilisateur trouvé avec ces identifiants')
          throw new Error('Email ou mot de passe incorrect')
        }

        console.log('Utilisateur trouvé:', user.username)
        this.user = user
        this.saveUser() // Sauvegarder explicitement
        this.token = user.token
        this.idUser = user.idUser
        this.username = user.username
        setAuthToken(user.token)

        // Ne plus rediriger automatiquement - laisser le composant gérer la redirection
        return { user, lastRoute: this.lastRoute || '/' }
      }

      // Mode avec backend réel
      try {
        const { users, token, idUser, username } = await apiService.login(email, password)
        this.user = users
        this.token = token
        this.idUser = idUser
        this.username = username
        setAuthToken(token)
        console.log('Utilisateur connecté :', users)
        // Ne plus rediriger automatiquement - laisser le composant gérer la redirection
        return { user: users, lastRoute: this.lastRoute || '/' }
      } catch (error) {
        console.error("Erreur d'authentification :", error)
        throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.')
      }
    },

    logout() {
      this.user = null
      this.saveUser() // Sauvegarder explicitement (pour supprimer)
      this.token = null
      setAuthToken(null)
      this.lastRoute = null // Efface la dernière route
      router.push('/login')
    },

    setLastRoute(route) {
      this.lastRoute = route // Enregistre la dernière route
      console.log('Dernière route enregistrée :', route) // Débogage
    },

    setMockMode(enabled) {
      this.useMockMode = enabled
    },

    // Actions pour l'admin uniquement
    createUser(username, email, password) {
      if (!this.user || this.user.role !== 'admin') {
        throw new Error('Seul l\'admin peut créer des utilisateurs')
      }

      const newUser = {
        id: localMockUsers.length + 1,
        idUser: localMockUsers.length + 1,
        username,
        email,
        password,
        role: 'user',
        isFirstLogin: true,
        token: 'demo-token-' + username + '-' + Date.now(),
      }

      localMockUsers.push(newUser)
      localStorage.setItem('mockUsers', JSON.stringify(localMockUsers))
      return newUser
    },

    // Marquer la première connexion comme terminée
    completeFirstLogin() {
      if (this.user) {
        // Créer un nouvel objet pour forcer la réactivité
        const updatedUser = {
          ...this.user,
          isFirstLogin: false
        }
        this.user = updatedUser
        this.saveUser() // Sauvegarder explicitement
        console.log('First login marqué comme terminé pour:', this.user.username)
        console.log('Utilisateur mis à jour:', this.user)
      }
    },

    getAllUsers() {
      if (!this.user || this.user.role !== 'admin') {
        throw new Error('Seul l\'admin peut voir tous les utilisateurs')
      }
      return localMockUsers
    },

    deleteUser(userId) {
      if (!this.user || this.user.role !== 'admin') {
        throw new Error('Seul l\'admin peut supprimer des utilisateurs')
      }

      const index = localMockUsers.findIndex((u) => u.id === userId)
      if (index === -1) {
        throw new Error('Utilisateur non trouvé')
      }

      localMockUsers.splice(index, 1)
      localStorage.setItem('mockUsers', JSON.stringify(localMockUsers))
    },
  },
})

// Fonction pour initialiser l'authentification
export function useAuth() {
  const authStore = useUserStore()
  authStore.checkAuth() // Vérifie l'authentification à l'initialisation

  // NE PAS rediriger automatiquement - laisser le router guard gérer cela
  return authStore
}
