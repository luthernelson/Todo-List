<script setup>
import { defineEmits } from 'vue'
import imageCheck from '../assets/images/icons8-ok-48.png'
import imageLoad from '../assets/images/icons8-load-50.png'
const emit = defineEmits(['remove-tasks', 'open-modal', 'open-update-modal'])
const props = defineProps({
  data: Object,
})
console.log('data:', props.data)

/* const toggleTaskState = (task) => {
  task.etat = task.etat === 'Terminé' ? 'En cours' : 'Terminé' // fonction gérant le statut d'une tâche
} */
console.log(props.data.task.isCompleted)

const removeTask = () => {
  // fonction de suppression d'une tâche
  console.log('ID de la tâche à supprimer:', props.data.task.idTask) // Ajoutez un log pour vérifier l'ID
  const taskId = Number(props.data.task.idTask, 10)
  emit('remove-tasks', taskId)
}
</script>

<template>
  <div>
    <div>
      <div
        class="bg-gray-700 bg-opacity-5 shadow-2lg rounded-md p-6 flex items-start gap-4 relative transition-transform duration-200 shadow-2xl"
      >
        <!--    <div
          class="w-30 h-30 bg-red-500 rounded-full flex justify-center items-center text-black text-xl font-bold uppercase"
        >
          <img
            v-if="data.file"
            :src="data.file"
            alt="Task Image"
            class="w-20 h-20 rounded-full object-cover"
          />
        </div> -->
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
          <button
            @click="removeTask"
            class="absolute bottom-2 right-2 text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center rounded-md"
          >
            <i class="fa-solid fa-trash-can text-xl"></i>
          </button>
          <button
            @click="$emit('open-update-modal', data)"
            class="absolute bottom-2 right-10 text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center rounded-md"
          >
            <i class="fa-solid fa-pen-to-square text-xl" style="color: #0091ff"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
