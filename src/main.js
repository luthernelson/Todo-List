import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { io } from 'socket.io-client'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from './App.vue'
import router from './router'
import './index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuth } from './stores/userStore' // Importez la fonction useAuth

const app = createApp(App) // Créez une instance de l'application

const pinia = createPinia() // Créez une instance de Pinia
pinia.use(piniaPluginPersistedstate)
app.use(pinia) // Associez Pinia à l'application
app.use(router) // Associer routeur à l'application

const socket = io('http://localhost:3001') // Remplacez par votre URL de serveur
// Gérer les événements de connexion
socket.on('connect', () => {
  console.log('Connecté au serveur WebSocket')
})

socket.on('connect_error', (err) => {
  console.error('Erreur de connexion:', err)
})

app.config.globalProperties.$socket = socket

// Vérifiez l'authentification au démarrage de l'application
useAuth()

app.mount('#app') // Montez l'application
