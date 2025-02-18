<template>
  <ul
    class="flex justify-center flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
  >
    <li class="me-2">
      <a
        href="#"
        @click="setActiveTab('profile')"
        :class="[
          'inline-block p-4',
          activeTab === 'profile'
            ? 'text-white-600 bg-gray-100 dark:bg-gray-800 dark:text-white-500'
            : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
        ]"
      >
        Mes Tâches
      </a>
    </li>
    <li class="me-2">
      <a
        href="#"
        @click="setActiveTab('dashboard')"
        :class="[
          'inline-block p-4',
          activeTab === 'dashboard'
            ? 'text-white-600 bg-gray-100 dark:bg-gray-800 dark:text-white-500'
            : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
        ]"
      >
        Tâches Partagées
      </a>
    </li>
  </ul>
  <div v-if="loading" class="flex h-screen justify-center items-center">
    <div class="loader"></div>
  </div>
  <div
    v-else
    class="w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 bg-white"
  >
    <div
      v-if="!taskStore.showForm && activeTab === 'profile' && taskStore.sharedTaskList.length > 0"
      class="w-full max-w-[1800px] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1"
    >
      <Task
        v-for="(task, index) in taskStore.sharedTaskList"
        :key="index"
        :data="task"
        @open-modal="taskStore.openModal(task)"
        @open-user-modal="taskStore.openUserModal()"
        @open-update-modal="handleUpdateTask(task)"
        @remove-tasks="handleDeleteTask(task.task.idTask)"
        @open-chat="openChat(task.task.idTask)"
      />
    </div>
    <div
      v-if="!taskStore.showForm && activeTab === 'profile' && taskStore.sharedTaskList.length == 0"
    >
      <p>Vous n'avez partgé aucune tache:(</p>
    </div>
    

    <div
      v-if="!taskStore.showForm && activeTab === 'dashboard' && taskStore.sharedTaskList.length > 0"
      class="w-full max-w-[1800px] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1"
    >
      <Task
        v-for="(task, index) in taskStore.sharedTaskList"
        :key="index"
        :data="task"
        @open-chat="openChat(task.task.idTask)"
      />
    </div>
    <div
      v-if="
        !taskStore.showForm && activeTab === 'dashboard' && taskStore.sharedTaskList.lenght === 0
      "
    >
      <p>Vous n'avez recu aucune tache:(</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Task from '../../components/Task.vue'
import { useTaskStore } from '../../stores/taskStore'
import { apiService } from '@/service/apiServices'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'

const authStore = useUserStore() // Utilisation du store d'authentification pour obtenir l'idUser
const taskStore = useTaskStore()
const activeTab = ref('profile') // Onglet actif par défaut
const loading = ref(true) // État du loader
const router = useRouter()
// Fonction pour ouvrir le chat
const openChat = (taskId) => {
  // Assurez-vous que taskId est défini
  router.push(`/community/${taskId}`)
}

function setActiveTab(tab) {
  activeTab.value = tab // Met à jour l'onglet actif
  loadTasks(tab) // Charge les tâches appropriées au clic
}

const loadTasks = async (tab) => {
  try {
    let result = []

    if (tab === 'profile') {
      // Charger Mes Tâches : filtrer directement ici
      result = await apiService.getsharedTasks() // Méthode pour obtenir Mes Tâches
      result = result.filter((task) => task.task.idUser == authStore.idUser) // Filtre sur les tâches créées par l'utilisateur connecté
    } else if (tab === 'dashboard') {
      console.log('dashboard')
      // Charger Tâches Partagées : filtrer directement ici
      result = await apiService.getsharedTasks() // Méthode pour obtenir les Tâches Partagées
      console.log('authStore.idUser', authStore.idUser)
      result = result.filter(
        (task) =>
          task.sharedWith.some((user) => user.idUser == authStore.idUser) && // Vérifie si l'utilisateur est dans sharedWith
          task.task.idUser != authStore.idUser, // Exclut les tâches partagées par l'utilisateur connecté lui-même
      )
      console.log('result', result)
    }

    // Met à jour la liste des tâches filtrées dans le store
    taskStore.setSharedTaskList(result)
  } catch (e) {
    console.error('loadTasks.error >> ', e)
  }
}
onMounted(async () => {
  loadTasks(activeTab.value) // Charge les tâches au montage
  loading.value = true // Activer le loader
  setTimeout(() => {
    loading.value = false
  }, 2000)
})
</script>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
