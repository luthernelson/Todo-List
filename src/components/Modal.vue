<script setup>
import { defineProps, defineEmits } from "vue";

// Définition des props du modal
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  }, 
  data: {
    require: true,
    type: Object
  }
});

// Définition des événements
const emit = defineEmits(["close"]);

// Méthode pour fermer le modal
const closeModal = () =>{ 
  emit("close");
};
</script>

<template>
  <div class="actions">
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
      <div class="bg-white max-w-3xl w-full max-h-[90vh] p-4 rounded-lg shadow-lg overflow-y-auto animate-scaleUp">
        <!-- En-tête de la modal -->
        <header class="w-full p-4 bg-gray-100 border-b border-gray-300 text-center font-bold text-xl relative">
          <button class="absolute top-2 right-2 text-2xl text-gray-700 hover:text-red-600" @click="closeModal">×</button>
          <h2 class="m-0"> Détails de la tâche {{ data.title }} !</h2>
        </header>

        <!-- Corps du modal -->
        <div class="modal-body p-4">
          <!-- Description -->
          <h3 class="text-lg font-semibold mb-4">
            <strong>Description:</strong> {{ data.description }}
          </h3>

          <!-- Étapes de réalisation (To-Do List) -->
          <div>
            <ul class="list-disc pl-6 space-y-2">
              <li v-for="(subTask, index) in data?.subTodoLists" :key="index" class="flex items-center">
                <input type="checkbox" class="mr-2" />
                {{ subTask.name }}
              </li>
            </ul>
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
