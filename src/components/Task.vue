<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['remove-tasks', 'open-modal'])
const props = defineProps({
  data: Object,
})
console.log(props.data)

/* const toggleTaskState = (task) => {
  task.etat = task.etat === 'Terminé' ? 'En cours' : 'Terminé' // fonction gérant le statut d'une tâche
} */

const removeTask = (index) => {
  // fonction de suppression d'une tâche
  emit('remove-tasks', index)
}
</script>

<template>
  <div>
    <div>
      <div
        class="bg-gray-700 bg-opacity-5 shadow-2lg rounded-md p-6 flex items-start gap-4 relative transition-transform duration-200"
      >
        <div
          class="w-30 h-30 bg-red-500 rounded-full flex justify-center items-center text-black text-xl font-bold uppercase"
        >
          <img
            v-if="data.file"
            :src="data.file"
            alt="Task Image"
            class="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <div class="flex-1">
          <h2
            @click.self="$emit('open-modal', data)"
            class="text-2xl text-black font-bold cursor-pointer"
          >
            {{ data.title }}
          </h2>
          <p class="text-gray-600 text-lg mt-2 mb-4">{{ data.description }}</p>
          <span class="bg-purple-700 text-white px-3 py-1 text-xs absolute top-2 right-2">
            {{ data.etat || 'En cours' }}
          </span>
          <button
            @click="removeTask(index)"
            class="absolute bottom-2 right-2 text-red-500 hover:text-red-700 p-2 w-8 h-8 flex items-center justify-center rounded-md"
          >
            <i class="fa-solid fa-trash-can text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
