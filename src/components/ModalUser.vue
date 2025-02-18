<script setup>
import { defineProps, defineEmits, onMounted, ref, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { apiService } from '@/service/apiServices'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const authStore = useUserStore()
const taskStore = useTaskStore()
const sharedUsers = ref([]) // Pour stocker les utilisateurs partagés
const canUpdate = ref(false)
// Définition des props du modal
const userSelectionState = ref({}) // Stocke l'état des utilisateurs
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  data: Object,
})

// Définition des événements
const emit = defineEmits(['close'])
// Récupère l'ID de la tâche en cours
const taskId = computed(() => props.data?.task?.idTask || null)

const selectedUserIds = computed(() => {
  if (!taskId.value) return []
  return taskStore.selectedTaskUsers[taskId.value] || []
})

console.log('props.data', props.data)
const blueBtn =
  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
const grayBtn =
  'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'

// Méthode pour fermer le modal
const closeModal = () => {
  canUpdate.value = false
  emit('close')
}
// Charger l'état des utilisateurs pour la tâche sélectionnée
const loadTaskUsers = () => {
  if (taskId.value) {
    const selectedUsers = taskStore.getSelectedUsers(taskId.value)
    userSelectionState.value = {} // Réinitialiser avant de charger
    selectedUsers.forEach((id) => {
      userSelectionState.value[id] = true
    })
  }
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
// Gestion des checkbox utilisateur
const handleUserCheck = (idUser) => {
  console.log('ID utilisateur sélectionné:', idUser)
  console.log('État avant modification:', JSON.parse(JSON.stringify(userSelectionState.value)))

  if (userSelectionState.value[idUser]) {
    taskStore.removeSelectedUser(taskId.value, idUser)
    userSelectionState.value[idUser] = false
  } else {
    taskStore.addSelectedUser(taskId.value, idUser)
    userSelectionState.value[idUser] = true
  }

  console.log('Utilisateurs sélectionnés dans le store:', taskStore.selectedTaskUsers[taskId.value])
}
// Partager la tâche avec les utilisateurs sélectionnés
const handleShareTask = async () => {
  console.log('props.data:', props.data) // Vérification de props.data
  if (!props.data.task || !props.data.task.idTask) {
    console.warn('Aucune tâche sélectionnée !')
    return
  }

  if (selectedUserIds.value.length === 0) {
    console.warn('Aucun utilisateur sélectionné pour le partage.')
    return
  }

  const taskToShare = {
    idTask: taskId.value,
    idUser: [...selectedUserIds.value, authStore.idUser], // Utilisateur connecté
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
const loadSharedUsers = async () => {
  try {
    const response = await apiService.getsharedTasks() // Corrigez le nom de la méthode si nécessaire
    console.log("Réponse complète de l'API:", response)

    if (response && Array.isArray(response)) {
      console.log('Liste des tâches partagées:', response)

      const tasks = response.find((t) => t.task.idTask == taskId.value)

      if (tasks) {
        if (tasks.sharedWith && tasks.sharedWith.length > 0) {
          sharedUsers.value = tasks.sharedWith // Récupère les utilisateurs partagés
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
// Charger l'état à l'ouverture du modal
watch(taskId, (newTaskId) => {
  if (newTaskId) {
    loadTaskUsers()
  }
})
// Charger les utilisateurs lors du montage du composant
onMounted(() => {
  loadUsers()
  loadTaskUsers()
  loadSharedUsers() // Charge les utilisateurs partagés
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
            <li
              v-for="user in taskStore.UsersList.filter(
                (u) => u.idUser !== authStore.idUser && !sharedUsers.includes(u.idUser),
              )"
              :key="user.idUser"
            >
              <input
                type="checkbox"
                class="mr-2 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :value="user.idUser"
                :checked="userSelectionState[user.idUser] || false"
                :disabled="sharedUsers.includes(user.idUser)"
                @click="
                  () => {
                    handleUserCheck(user.idUser)
                  }
                "
              />
              {{ user.username }}
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
