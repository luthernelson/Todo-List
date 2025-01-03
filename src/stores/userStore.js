import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: useStorage('user', null, ), // Objet utilisateur
    token: useStorage('token', null), // Jeton d'authentification
  }),

  getters: {
    isLoggedIn: (state) => !!state.user, // Vérifie si un utilisateur est connecté
    getUser: (state) => state.user, // Récupère l'utilisateur connecté
  },

  actions: {
    login(userData, token) {
      this.user = userData // Stocke directement l'objet utilisateur
      this.token = token // Stocke le token
      console.log('Utilisateur connecté :', this.user)
    },

    logout() {
      this.user = null
      this.token = null
    },
  },
})
