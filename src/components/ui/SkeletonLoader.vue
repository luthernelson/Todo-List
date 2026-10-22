<template>
  <div class="skeleton-wrapper" :class="{ 'dark-mode': isDarkMode }">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton-item"
      :class="variant"
      :style="{
        width: getRandomWidth(),
        height: height,
        borderRadius: borderRadius
      }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
  variant: {
    type: String,
    default: 'text', // text, circular, rectangular, avatar
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '1rem',
  },
  borderRadius: {
    type: String,
    default: '0.25rem',
  },
  randomWidth: {
    type: Boolean,
    default: false,
  },
})

const isDarkMode = computed(() => document.documentElement.classList.contains('dark'))

const getRandomWidth = () => {
  if (props.randomWidth && props.variant === 'text') {
    const minWidth = 60
    const maxWidth = 100
    const random = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth
    return `${random}%`
  }
  return props.width
}
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-item {
  background: #e0e0e0;
  animation: pulse 1.5s infinite;
}

.dark-mode .skeleton-item {
  background: #6b7280;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Variantes */
.skeleton-item.text {
  min-height: 1rem;
}

.skeleton-item.circular {
  border-radius: 50% !important;
}

.skeleton-item.avatar {
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
}

.skeleton-item.rectangular {
  border-radius: 0.5rem;
}
</style>
