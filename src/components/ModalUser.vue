<script setup>
import { defineProps, defineEmits, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { apiService } from '@/service/apiServices'
import { computed } from 'vue'

const taskStore = useTaskStore()
// Définition des props du modal

const selectedUserIds = computed(() => taskStore.selectedUserIds)
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: Object,
})

// Définition des événements
const emit = defineEmits(['close'])
console.log('props.data', props.data)
const blueBtn =
  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
const grayBtn =
  'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'

// Méthode pour fermer le modal
let previouslySelectedUserIds = []
const closeModal = () => {
  previouslySelectedUserIds = [...taskStore.selectedUserIds] // Conserver la sélection actuelle avant de réinitialiser
  taskStore.updateSelectedUserTask(null)
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
const handleUserCheck = (idUser) => {
  if (taskStore.selectedUserIds.includes(idUser)) {
    // Retirer l'utilisateur sélectionné
    taskStore.removeSelectedUser(idUser)
  } else {
    // Ajouter l'utilisateur sélectionné
    taskStore.addSelectedUser(idUser)
  }

  console.log('Utilisateurs sélectionnés:', taskStore.selectedUserIds)
}

// Partager la tâche avec les utilisateurs sélectionnés
const handleShareTask = async () => {
  console.log('props.data:', props.data) // Vérification de props.data
  if (!props.data.task || !props.data.task.idTask) {
    console.warn('Aucune tâche sélectionnée !')
    return
  }

  if (taskStore.selectedUserIds.length === 0) {
    console.warn('Aucun utilisateur sélectionné pour le partage.')
    return
  }

  const taskToShare = {
    idTask: props.data.task.idTask,
    idUser: taskStore.selectedUserIds,
    title: props.data.task.title, // Utilisation des ID stockés dans le store
    description: props.data.task.description,
    isCompled: props.data.task.isCompled,
    isShared: true,
  }

  console.log('Tâche à partager:', taskToShare)

  try {
    const result = await apiService.shareTask(taskToShare)
    taskStore.updateAfterShare(result)
    // Mettre à jour le store après partage
    alert('Tâche partagée avec succès.')
    console.log('Tâche partagée avec succès:', result)
    taskStore.selectedUserIds = []
    closeModal() // Fermer le modal après partage
  } catch (error) {
    console.error('Erreur lors du partage des tâches:', error.response?.data || error)
  }
}

// Charger les utilisateurs lors du montage du composant
onMounted(() => {
  loadUsers()
  // Récupérer la sélection précédente lors de l'ouverture du modal
  if (props.isVisible) {
    taskStore.selectedUserIds = [...previouslySelectedUserIds]
  }
})
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
          <ul class="pl-6 space-y-2">
            <li v-for="users in taskStore.UsersList" :key="users.idUser">
              <input
                type="checkbox"
                class="mr-2 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :value="users.idUser"
                :checked="taskStore.selectedUserIds.includes(users.idUser)"
                @change="handleUserCheck(users.idUser)"
              />
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
