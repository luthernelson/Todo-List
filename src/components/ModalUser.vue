<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { apiService } from '@/service/apiServices'

const taskStore = useTaskStore()
// Définition des props du modal
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: {
    required: true,
    type: Object,
  },
})

// Définition des événements
const emit = defineEmits(['close'])
const selectedUserIds = ref([]) // Tableau pour les utilisateurs sélectionnés

const blueBtn =
  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
const grayBtn =
  'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'

// Méthode pour fermer le modal
const closeModal = () => {
  selectedUserIds.value = [] // Réinitialiser les utilisateurs sélectionnés
  emit('close')
}

// Charger les utilisateurs depuis l'API et les stocker dans le store
const loadUsers = async () => {
  try {
    const users = await apiService.getUser()
    taskStore.loadUser(users) // Charger les utilisateurs dans le store
    console.log('Utilisateurs:', users)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error.response)
  }
}

// Gérer la sélection des utilisateurs
const handleUserCheck = (userId) => {
  if (selectedUserIds.value.includes(userId)) {
    selectedUserIds.value = selectedUserIds.value.filter((id) => id !== userId) // Retirer l'utilisateur
  } else {
    selectedUserIds.value.push(userId) // Ajouter l'utilisateur
  }
}

// Partager la tâche avec les utilisateurs sélectionnés
const handleShareTask = async () => {
  const task = props.data.task
  if (!task || !task.idTask || selectedUserIds.value.length === 0) {
    console.warn('Aucune tâche sélectionnée ou aucun utilisateur sélectionné pour le partage.')
    return
  }

  const taskToShare = {
    idTask: task.idTask,
    idUser: selectedUserIds.value, // Inclure les utilisateurs sélectionnés
    title: task.title,
    isShared: true,
  }

  console.log('Tâche à partager:', taskToShare)

  try {
    const result = await apiService.shareTask(taskToShare)
    taskStore.updateAfterShare(result)

    if (result && result.isShared !== undefined) {
      task.isShared = result.isShared
    } else {
      task.isShared = true
    }

    console.log('Tâche partagée avec succès:', result)
    // Réinitialiser la sélection après le partage
    selectedUserIds.value = []
    emit('close') // Fermer le modal après partage
  } catch (error) {
    console.error(
      'Erreur lors du partage des tâches:',
      error.response ? error.response.data : error,
    )
    task.isShared = false
  }
}

// Charger les utilisateurs lors du montage du composant
onMounted(loadUsers)
</script>

<template>
  <div class="actions">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn"
    >
      <div
        class="bg-white max-w-3xl w-full max-h-[90vh] p-4 rounded-lg shadow-lg overflow-y-auto animate-scaleUp"
      >
        <header
          class="w-full p-4 bg-slate-100 border-b border-slate-300 text-center font-bold text-xl relative"
        >
          <button
            class="absolute top-2 right-2 text-4xl text-slate-700 hover:text-red-600"
            @click="closeModal"
          >
            ×
          </button>
          <h2 class="m-0">Partager la Tâche</h2>
        </header>

        <div class="modal-body p-4">
          <!-- Liste des utilisateurs à partager -->
          <h3 class="text-lg font-semibold mt-4">Sélectionnez les utilisateurs à partager:</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li v-for="users in taskStore.UsersList" :key="users.idUser">
              <input type="checkbox" class="mr-2" @change="handleUserCheck(users.idUser)" />
              {{ users.username }}
            </li>
          </ul>

          <div class="flex justify-center mt-10">
            <button
              type="button"
              :disabled="selectedUserIds.length === 0"
              :class="selectedUserIds.length > 0 ? blueBtn : grayBtn"
              @click="handleShareTask"
            >
              Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
