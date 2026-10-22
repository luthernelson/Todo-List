import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { io } from 'socket.io-client' // Désactivé pour le mode mock (évite l'erreur CORS)
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './index.css'
import '../src/assets/main.css'
import '../src/assets/design-system.css'
import './styles/animations.css'
import './styles/variables.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuth } from './stores/userStore' // Importez la fonction useAuth

const app = createApp(App) // Créez une instance de l'application

const pinia = createPinia() // Créez une instance de Pinia
pinia.use(piniaPluginPersistedstate)
app.use(pinia) // Associez Pinia à l'application
app.use(router) // Associer routeur à l'application
app.use(i18n) // Associer i18n à l'application

// Socket.io désactivé pour le mode mock (évite l'erreur CORS)
// const socket = io('https://api-task-ar3g.onrender.com')
// socket.on('connect', () => {
//   console.log('Connecté au serveur WebSocket')
// })
// socket.on('connect_error', (err) => {
//   console.error('Erreur de connexion:', err)
// })
// app.config.globalProperties.$socket = socket

// Vérifiez l'authentification au démarrage de l'application
useAuth()

app.mount('#app') // Montez l'application
