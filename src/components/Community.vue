<template>
  <div class="flex h-screen">
    <!-- Barre verticale pour les membres -->
    <aside class="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 class="text-lg font-bold mb-4">Membres</h2>
      <ul class="space-y-2">
        <li v-for="(member, index) in members" :key="index" class="p-2 bg-gray-700 rounded-lg">
          {{ member }}
        </li>
      </ul>
    </aside>

    <!-- Zone principale pour le chat -->
    <main class="flex-1 chat-container bg-gray-100 p-6">
      <div
        ref="messagesContainer"
        class="messages overflow-y-auto h-[70vh] bg-white p-4 rounded-lg mb-4"
      >
        <Task :data="task" v-if="task" />

        <div class="flex-1 overflow-y-auto p-4">
          <template v-for="(date, index) in Object.keys(groupedMessages)" :key="index">
            <div class="text-center text-gray-500 text-sm mb-2">
              {{ date }}
              <!-- Affiche la date -->
            </div>
            <template v-for="(message, msgIndex) in groupedMessages[date]" :key="msgIndex">
              <div
                class="message p-4 rounded-lg mb-2"
                :class="[
                  message.idUser == authStore.idUser
                    ? 'bg-blue-100 text-blue-700 self-end'
                    : 'bg-gray-100 text-gray-800 self-start',
                ]"
              >
                <strong>{{ message.idUser === authStore.idUser ? 'Moi' : message.username }}</strong
                >: {{ message.comment }}
                <div class="text-xs text-gray-500 mt-1">
                  {{ formatTime(message.Timetamps) }}
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Zone de saisie -->
      <div class="input-area flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Tapez votre message..."
          class="flex-1 p-2 border rounded-lg focus:outline-none"
        />
        <button
          @click="sendMessage"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Envoyer
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/service/apiServices'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import Task from './Task.vue'

const sharedUsers = ref([])
const taskStore = useTaskStore()
const route = useRoute()
const taskId = ref(route.params.id)
const task = ref(null)
const authStore = useUserStore()
const { proxy } = getCurrentInstance()
const socketStatus = ref('Déconnecté')
const messages = ref([])
const newMessage = ref('')
const groupedMessages = ref({}) // Un objet pour stocker les messages regroupés par date
const messagesContainer = ref(null) // Référence à la zone des messages

const loadSharedUsers = async () => {
  try {
    const response = await apiService.getsharedTasks() // Appel à l'API pour récupérer les tâches partagées
    console.log("Réponse complète de l'API:", response) // Affiche la réponse complète pour vérifier la structure

    // Vérifie si la réponse est correctement structurée
    if (response && Array.isArray(response)) {
      console.log('Liste des tâches partagées:', response)

      // Vérifie l'ID de la tâche et compare-le avec l'ID de la route
      console.log('ID de la tâche recherchée:', taskId.value)

      // Recherche la tâche avec l'ID de la tâche actuelle
      const tasks = response.find((t) => t.task.idTask == taskId.value)

      if (tasks) {
        // Si la tâche est trouvée, on récupère les utilisateurs partagés
        if (tasks.sharedWith && tasks.sharedWith.length > 0) {
          sharedUsers.value = tasks.sharedWith // Récupère uniquement les utilisateurs partagés
          console.log('Utilisateurs partagés:', sharedUsers.value)
        } else {
          console.warn("Aucun utilisateur trouvé dans 'sharedWith' pour la tâche", taskId.value)
        }
      } else {
        console.warn("Aucune tâche trouvée avec l'idTask", taskId.value)
      }
    } else {
      console.error('La réponse ne contient pas de tableau ou est mal structurée.')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs partagés:', error)
  }
}

const members = computed(() => sharedUsers.value.map((user) => user.username))

// Fonction pour formater la date (ex: "Aujourd'hui")
const formatDate = (dateString) => {
  if (!dateString) return "Aujourd'hui"
  const date = new Date(dateString)
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  return isToday
    ? "Aujourd'hui"
    : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Fonction pour formater l'heure (ex: "14:30")
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Fonction pour charger les commentaires de la tâche
const loadCommentToTasks = async () => {
  try {
    const result = await apiService.getCommentById(taskId.value)
    if (result.comments && Array.isArray(result.comments)) {
      messages.value = result.comments
      groupMessagesByDate() // Regrouper les messages après les avoir chargés
      await nextTick()
      scrollToBottom() // Faire défiler vers le bas après le chargement des messages
    } else {
      console.warn('Aucun commentaire trouvé ou réponse invalide', result)
    }
  } catch (error) {
    console.error('loadCommentToTasks.error >> ', error)
  }
}

// Fonction pour envoyer un message
const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const messageData = {
      comment: newMessage.value,
      idTask: taskId.value,
      idUser: authStore.idUser,
      username: authStore.username,
      Timetamps: new Date().toISOString(),
    }

    try {
      const response = await apiService.addComment(messageData)
      console.log("Réponse de l'API:", response)

      // Émettre le message via Socket.IO
      if (proxy.$socket) {
        proxy.$socket.emit('newComment', messageData)
      } else {
        console.error("SocketIO n'est pas initialisé")
      }

      // Ajouter le message à la liste locale
      messages.value.push(messageData)
      groupMessagesByDate() // Regrouper après l'ajout d'un nouveau message
      newMessage.value = ''
      await nextTick()
      scrollToBottom() // Faire défiler vers le bas après l'envoi d'un nouveau message
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}

// Fonction pour regrouper les messages par date
const groupMessagesByDate = () => {
  groupedMessages.value = {} // Réinitialiser l'objet
  messages.value.forEach((message) => {
    const dateKey = formatDate(message.Timetamps) // Utiliser formatDate pour obtenir la date
    if (!groupedMessages.value[dateKey]) {
      groupedMessages.value[dateKey] = []
    }
    groupedMessages.value[dateKey].push(message)
  })
}

// Fonction pour faire défiler la zone des messages vers le bas
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Écouter les nouveaux messages via Socket.IO
const listenForMessages = () => {
  if (proxy.$socket) {
    proxy.$socket.on('newComment', (data) => {
      console.log('Nouveau message reçu:', data)
      if (data.idTask === taskId.value) {
        if (!data.Timetamps) {
          data.Timetamps = new Date().toISOString()
        }
        messages.value.push(data)
        groupMessagesByDate() // Regrouper après l'ajout d'un nouveau message
        nextTick(() => {
          scrollToBottom() // Faire défiler vers le bas après l'ajout d'un nouveau message
        })
      }
    })

    proxy.$socket.on('error', (error) => {
      console.error('Erreur de socket:', error)
    })
  } else {
    console.error("SocketIO n'est pas initialisé")
  }
}

onMounted(async () => {
  await loadCommentToTasks()
  await loadTaskDetails()
  await loadSharedUsers()
  if (proxy.$socket) {
    proxy.$socket.connect()
    proxy.$socket.on('connect', () => {
      socketStatus.value = 'Connecté'
      console.log('Connecté au serveur WebSocket')
    })

    proxy.$socket.on('connect_error', (err) => {
      console.error('Erreur de connexion au socket:', err)
    })

    listenForMessages()
  } else {
    console.error("SocketIO n'est pas initialisé")
  }
})

// Fonction pour charger les détails de la tâche
const loadTaskDetails = async () => {
  try {
    const result = await apiService.getTaskById(taskId.value)
    taskStore.setTaskLisByID(result)
    task.value = result
  } catch (error) {
    console.error('Error loading task details:', error)
  }
}

// Récupérer l'ID de la tâche depuis les paramètres de la route
watch(
  () => route.params.id,
  (newId) => {
    taskId.value = newId
    loadTaskDetails()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (proxy.$socket) {
    proxy.$socket.off('newComment')
    proxy.$socket.off('connect')
    proxy.$socket.off('error')
    proxy.$socket.disconnect() // Déconnecter le socket lors de la destruction du composant
    console.log('Socket déconnecté avant destruction du composant.')
  }
})
</script>

<style scoped>
.chat-container {
  font-family: Arial, sans-serif;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  max-width: 70%; /* Largeur maximale des messages */
  width: fit-content; /* Largeur adaptée au contenu */
  word-wrap: break-word; /* Permet de casser les mots longs */
}

/* Style des messages envoyés */
.bg-blue-100 {
  margin-left: auto; /* Aligner à droite */
}

/* Style des messages reçus */
.bg-gray-100 {
  margin-right: auto; /* Aligner à gauche */
}
</style>
