<script setup>
import { defineProps, defineEmits } from 'vue'

// Définition des props du modal
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
})

// Définition des événements
const emit = defineEmits(['close'])

// Méthode pour fermer le modal
const closeModal = () => {
  emit('close')
}
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
        <!-- En-tête de la modal -->
        <header
          class="w-full p-4 bg-gray-100 border-b border-gray-300 text-center font-bold text-xl relative"
        >
          <button
            class="absolute top-2 right-2 text-4xl text-gray-700 hover:text-red-600"
            @click="closeModal"
          >
            ×
          </button>
          <h2 class="m-0">Update Tasks</h2>
        </header>

        <!-- Corps du modal -->
        <slot name="Update"> </slot>
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
