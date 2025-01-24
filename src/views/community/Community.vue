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
        Mes Taches
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
        Taches Partagés
      </a>
    </li>
  </ul>
  <div
    class="w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 pt-8 bg-white"
  >
    <div
      v-if="!taskStore.showForm && activeTab === 'profile' && taskStore.taskList.length > 0"
      class="w-full max-w-[1800px] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 ju"
    >
      <Task
        v-for="(task, index) in taskStore.taskList"
        :key="index"
        :data="task"
        @open-modal="taskStore.openModal(task)"
        @open-update-modal="handleUpdateTask(task)"
        @remove-tasks="handleDeleteTask(task.task.idTask)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Task from '../../components/Task.vue'
import { useTaskStore } from '../../stores/taskStore'

const taskStore = useTaskStore()
const activeTab = ref('profile') // Onglet actif par défaut

function setActiveTab(tab) {
  activeTab.value = tab // Met à jour l'onglet actif
}
</script>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
