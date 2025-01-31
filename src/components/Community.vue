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
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'message p-2 rounded-lg mb-2',
            message.user === 'You'
              ? 'bg-blue-100 text-blue-700 self-end w-max-[90vh]'
              : 'bg-gray-100 text-gray-800 self-start w-max-[60vh]',
          ]"
        >
          <strong>{{ message.user }}</strong
          >: {{ message.text }}
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
import { ref } from 'vue'

// Liste des membres de la communauté
const members = ref(['Nelson Luther', 'Bob', 'Charlie', 'David', 'Eve'])

// Déclaration des variables réactives pour le chat
const messages = ref([
  { user: 'Bot', text: 'Bonjour ! Comment puis-je vous aider ?', date: new Date() },
])
const newMessage = ref('')

// Fonction pour envoyer le message
const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    // Ajoute le message de l'utilisateur
    messages.value.push({ user: 'You', text: newMessage.value })
    newMessage.value = ''

    // Simule une réponse automatique du bot
    setTimeout(() => {
      messages.value.push({ user: 'Bot', text: 'Merci pour votre message !' })
    }, 1000)
  }
}
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
</style>
