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
      <!-- Zone d'affichage des messages -->
      <div class="messages overflow-y-auto h-[70vh] bg-white p-4 rounded-lg mb-4">
        <Task :data="task" v-if="task" />

        <!-- Date en haut de la conversation -->
        <div class="text-center text-gray-500 text-sm mb-4">
          {{ formatDate(messages[0]?.createdAt) || "Aujourd'hui" }}
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div
            class="mt-8"
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'message p-4 rounded-lg mb-2',
              message.idUser === authStore.idUser
                ? 'bg-blue-100 text-blue-700 self-end'
                : 'bg-gray-100 text-gray-800 self-start',
            ]"
          >
            <strong>{{ message.idUser === authStore.idUser ? 'Moi' : message.username }}</strong
            >: {{ message.comment }}
            <!-- Heure sous chaque message -->
            <div class="text-xs text-gray-500 mt-1">
              {{ formatTime(message.Timetamps) }}
            </div>
          </div>
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
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { apiService } from '@/service/apiServices'
import { useTaskStore } from '@/stores/taskStore'
import { useUserStore } from '@/stores/userStore'
import Task from './Task.vue'

const taskStore = useTaskStore()
const route = useRoute()
const taskId = ref(route.params.id)
const task = ref(null)
const authStore = useUserStore()
const { proxy } = getCurrentInstance()

// Liste des membres de la communauté
const members = ref(['Nelson Luther', 'Bob', 'Charlie', 'David', 'Eve'])

// Déclaration des variables réactives pour le chat
const messages = ref([])
const newMessage = ref('')

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
    : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

// Fonction pour formater l'heure (ex: "14:30")
const formatTime = (dateString) => {
  if (!dateString) return ''
  console.log('Timestamp:', dateString)
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Fonction pour charger les commentaires de la tâche
const loadCommentToTasks = async () => {
  try {
    const result = await apiService.getCommentById(taskId.value)

    // Vérifiez que les commentaires sont présents dans la réponse
    if (result.comments && Array.isArray(result.comments)) {
      messages.value = result.comments // Charger les commentaires directement
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
      comment: newMessage.value, // Utilisation directe de la chaîne
      idTask: taskId.value, // Assurez-vous que c'est l'ID de tâche correct
      idUser: authStore.idUser, // ID de l'utilisateur connecté
      username: authStore.username, // Nom de l'utilisateur connecté
      Timetamps: new Date().toISOString(), // Ajouter la date et l'heure du message
    }

    // Appel à l'API pour ajouter le commentaire
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
      newMessage.value = '' // Réinitialiser le champ d'entrée
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}

// Écouter les nouveaux messages via Socket.IO
// Écouter les nouveaux messages via Socket.IO
const listenForMessages = () => {
  proxy.$socket.on('newComment', (data) => {
    if (data.idTask === taskId.value) {
      // Ajouter la date et l'heure si elles ne sont pas déjà présentes
      if (!data.createdAt) {
        data.Timetamps = new Date().toISOString()
      }
      messages.value.push(data) // Ajouter le message reçu à la liste
    }
  })
}

onMounted(async () => {
  await loadCommentToTasks()
  listenForMessages() // Écouter les nouveaux messages
})

// Fonction pour charger les détails de la tâche
const loadTaskDetails = async () => {
  try {
    const result = await apiService.getTaskById(taskId.value)
    taskStore.setTaskLisByID(result) // Met à jour les détails de la tâche
    task.value = result
  } catch (error) {
    console.error('Error loading task details:', error)
  }
}

// Récupérer l'ID de la tâche depuis les paramètres de la route
watch(
  () => route.params.id,
  (newId) => {
    taskId.value = newId // Met à jour l'ID de la tâche
    loadTaskDetails() // Charger les détails de la tâche lorsque l'ID change
  },
  { immediate: true },
)
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
