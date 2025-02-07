import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from './App.vue'
import { io } from 'socket.io-client'
import router from './router'
import './index.css'
import { useUserStore } from '@/stores/userStore'

const socket = io('http://localhost:3001') // Remplacez par votre URL de serveur
const app = createApp(App) // Créez une instance de l'application
app.config.globalProperties.$socket = socket
const pinia = createPinia() // Créez une instance de Pinia

app.use(pinia) // Associez Pinia à l'application
app.use(router) // Associer routeur à l'application

const userStore = useUserStore()
userStore.checkAuth() // Vérifier l'authentification à l'initialisation

if (userStore.isLoggedIn && userStore.lastRoute) {
  router.push(userStore.lastRoute)
}

app.mount('#app') // Montez l'application
