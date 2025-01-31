<script setup>
import { defineEmits, defineProps } from 'vue'
import imageCheck from '../assets/images/icons8-ok-48.png'
import imageLoad from '../assets/images/icons8-load-50.png'
import { useTaskStore } from '@/stores/taskStore'
import { apiService } from '@/service/apiServices'

const taskStore = useTaskStore()
const emit = defineEmits(['remove-tasks', 'open-modal', 'open-update-modal', 'open-user-modal'])
const props = defineProps({
  data: Object,
})

console.log('data:', props.data)

const numtodoisCompled = () => {
  let number = 0 // Initialisez le compteur à 0

  // Parcourez le tableau de todos
  for (const todo of props.data.todos) {
    if (todo.isCompled === true) {
      number += 1 // Incrémentez le compteur si isCompled est vrai
    }
  }

  return number // Retournez le nombre de todos complétés
}

const removeTask = () => {
  // Fonction de suppression d'une tâche
  console.log('ID de la tâche à supprimer:', props.data.task.idTask) // Ajoutez un log pour vérifier l'ID
  const taskId = Number(props.data.task.idTask, 10)
  emit('remove-tasks', taskId)
}

const handleShareTask = async () => {
  // Vérifiez si la tâche est sélectionnée
  const task = props.data.task
  if (!task || !task.idTask) {
    console.warn('Aucune tâche sélectionnée pour le partage.')
    return
  }

  // Créez l'objet de tâche à partager
  const taskToShare = {
    idTask: task.idTask,
    idUser: task.idUser, // Si nécessaire
    title: task.title,
    description: task.description,
    isCompled: task.isCompled,
    isShared: true, // On suppose que vous voulez le mettre à true lors du partage
  }

  console.log('Tâche à partager:', taskToShare) // Log pour vérifier l'objet

  try {
    const result = await apiService.shareTask(taskToShare) // Envoyer l'objet à l'API
    taskStore.updateAfterShare(result)

    // Mettre à jour la propriété isShared après le partage
    if (result && result.isShared !== undefined) {
      task.isShared = result.isShared // Mettre à jour l'état de isShared
    } else {
      task.isShared = true // Si l'API ne renvoie pas, on met à jour localement
    }

    console.log('Tâche partagée avec succès:', result)
  } catch (error) {
    console.error(
      'Erreur lors du partage des tâches:',
      error.response ? error.response.data : error,
    )
    task.isShared = false // Mettre à false en cas d'erreur
  }
}
</script>

<template>
  <div>
    <div>
      <div
        class="bg-gray-700 bg-opacity-5 shadow-2lg rounded-md p-6 flex items-start gap-4 relative transition-transform duration-200 shadow-2xl"
      >
        <div class="flex-1">
          <h2
            @click.self="$emit('open-modal', data)"
            class="text-2xl text-black font-bold cursor-pointer"
          >
            {{ data.task.title }}
          </h2>
          <p class="text-gray-600 text-lg mt-2 mb-4">{{ data.task.description }}</p>
          <img
            class="px-3 py-1 text-xs absolute top-2 right-2 w-14"
            :src="data.task.isCompled ? imageCheck : imageLoad"
            alt="Statut de la tâche"
          />
          <span class="absolute bottom-1 text-left text-[12px] text-gray-600 italic font-bold">
            {{ numtodoisCompled() }} tâche(s) complétée(s) / {{ data.todos.length }} tâche(s)
          </span>
          <div class="absolute bottom-1 right-0 flex space-x-2">
            <button
              @click="handleShareTask"
              class="text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center rounded-md"
            >
              <i class="fa-solid fa-share" style="color: #1db927"></i>
            </button>
            <button
              @click="$emit('open-update-modal', data)"
              class="text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center rounded-md"
            >
              <i class="fa-solid fa-pen-to-square text-xl" style="color: #0091ff"></i>
            </button>
            <button
              @click="removeTask"
              class="text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center rounded-md"
            >
              <i class="fa-solid fa-trash-can text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
