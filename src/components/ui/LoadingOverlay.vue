<template>
  <div v-if="visible" class="loading-overlay" :class="{ 'dark-mode': isDarkMode }">
    <div class="loading-content">
      <div class="spinner-wrapper">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle
            class="spinner-circle-bg"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="4"
          ></circle>
          <circle
            class="spinner-circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            :stroke="color"
            stroke-width="4"
          ></circle>
        </svg>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'Chargement...',
  },
  color: {
    type: String,
    default: '#293848',
  },
})

const isDarkMode = computed(() => document.documentElement.classList.contains('dark'))
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.dark-mode .loading-overlay {
  background: rgba(31, 41, 55, 0.9);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner-wrapper {
  width: 60px;
  height: 60px;
}

.spinner {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

.spinner-circle-bg {
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
}

.dark-mode .spinner-circle-bg {
  stroke: #4b5563;
}

.spinner-circle {
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.loading-message {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.dark-mode .loading-message {
  color: white;
}
</style>
