<template>
  <ul
    class="flex justify-center flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
  >
    <li class="me-2">
      <a
        href="#"
        @click.prevent="setActiveTab('profile')"
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
        @click.prevent="setActiveTab('dashboard')"
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

  <div
    class="w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 bg-white"
  >
    <div
      v-if="!taskStore.showForm && activeTab === 'profile' && taskStore.taskList.length > 0"
      class="w-full max-w-[1800px] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1"
    >
      <Task
        v-for="(task, index) in taskStore.taskList"
        :key="index"
        :data="task"
        @open-modal="taskStore.openModal(task)"
        @open-user-modal="taskStore.openUserModal()"
        @open-update-modal="handleUpdateTask(task)"
        @remove-tasks="handleDeleteTask(task.task.idTask)"
      />
      <div v-if="!taskStore.showForm && activeTab === 'profile' && taskStore.taskList.length === 0">
        <p>Aucune tâche disponible.</p>
      </div>
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
        !taskStore.showForm && activeTab === 'dashboard' && taskStore.sharedTaskList.length === 0
      "
    >
      <p>Aucune tâche partagée disponible.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Task from '../../components/Task.vue'
import { useTaskStore } from '../../stores/taskStore'
import { apiService } from '@/service/apiServices'
import { useRouter } from 'vue-router'

const taskStore = useTaskStore()
const activeTab = ref('profile') // Onglet actif par défaut

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
  if (tab === 'profile') {
    // Charger Mes Tâches
    try {
      const result = await apiService.getTasks() // Méthode pour obtenir Mes Tâches
      console.log('Mes Tâches:', result)
      taskStore.setTaskList(result) // Met à jour la liste des tâches
    } catch (e) {
      console.error('loadMyTasks.error >> ', e)
    }
  } else if (tab === 'dashboard') {
    // Charger Tâches Partagées
    try {
      const result = await apiService.getsharedTasks() // Méthode pour obtenir les Tâches Partagées
      console.log('Tâches Partagées:', result)
      taskStore.setSharedTaskList(result) // Met à jour la liste des tâches partagées
    } catch (e) {
      console.error('loadSharedTasks.error >> ', e)
    }
    console.log('sharedtaskList:', taskStore.sharedTaskList)
  }
}
</script>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
