<template>
  <button
    :class="[
      'loading-button',
      variant,
      size,
      { 'loading': loading, 'disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner-container">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle
          class="spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          :stroke="spinnerColor"
          stroke-width="4"
        ></circle>
      </svg>
    </span>
    <span v-if="!loading" class="icon-container">
      <slot name="icon"></slot>
    </span>
    <span class="button-text">
      <slot v-if="!loading">{{ text }}</slot>
      <slot v-else name="loading-text">{{ loadingText }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  loadingText: {
    type: String,
    default: 'Chargement...',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, success, danger, warning, info
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
  },
})

const emit = defineEmits(['click'])

const spinnerColor = computed(() => {
  const colors = {
    primary: '#ffffff',
    secondary: '#293848',
    success: '#ffffff',
    danger: '#ffffff',
    warning: '#ffffff',
    info: '#ffffff',
  }
  return colors[props.variant] || '#ffffff'
})

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.loading-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.loading-button:hover:not(.disabled):not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-button:active:not(.disabled):not(.loading) {
  transform: translateY(0);
}

.loading-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-button.loading {
  cursor: wait;
}

/* Variants */
.loading-button.primary {
  background: #293848;
  color: white;
}

.loading-button.primary:hover:not(.disabled):not(.loading) {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.loading-button.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.loading-button.secondary:hover:not(.disabled):not(.loading) {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.dark .loading-button.secondary {
  background: #4b5563;
  color: white;
  border-color: #6b7280;
}

.dark .loading-button.secondary:hover:not(.disabled):not(.loading) {
  background: #6b7280;
  border-color: #9ca3af;
}

.loading-button.success {
  background: #10B981;
  color: white;
}

.loading-button.success:hover:not(.disabled):not(.loading) {
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.loading-button.danger {
  background: #EF4444;
  color: white;
}

.loading-button.danger:hover:not(.disabled):not(.loading) {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.loading-button.warning {
  background: #F59E0B;
  color: white;
}

.loading-button.warning:hover:not(.disabled):not(.loading) {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.loading-button.info {
  background: #293848;
  color: white;
}

.loading-button.info:hover:not(.disabled):not(.loading) {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Sizes */
.loading-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.loading-button.medium {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

.loading-button.large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Spinner */
.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
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

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  white-space: nowrap;
}
</style>
