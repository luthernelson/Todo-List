<template>
  <button
    :class="[
      'custom-button',
      variant,
      size,
      { 'has-icon': $slots.icon, 'loading': loading, 'disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner">
      <svg viewBox="0 0 50 50" class="spinner-svg">
        <circle
          class="spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
      </svg>
    </span>
    <span v-if="!loading && $slots.icon" class="icon-slot">
      <slot name="icon"></slot>
    </span>
    <span class="button-text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, outline, danger, success
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.custom-button {
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

.custom-button:hover:not(.disabled):not(.loading) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.custom-button:active:not(.disabled):not(.loading) {
  transform: translateY(0);
}

.custom-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-button.loading {
  cursor: wait;
}

/* Variants */
.custom-button.primary {
  background: rgb(29, 40, 61);
  color: white;
}

.custom-button.primary:hover:not(.disabled):not(.loading) {
  background: rgba(29, 40, 61, 0.8);
  box-shadow: 0 4px 12px rgba(29, 40, 61, 0.4);
}

.custom-button.secondary {
  background: #f3f4f6;
  color: rgb(29, 40, 61);
}

.custom-button.secondary:hover:not(.disabled):not(.loading) {
  background: #e5e7eb;
}

.custom-button.outline {
  background: transparent;
  color: rgb(29, 40, 61);
  border: 2px solid rgb(29, 40, 61);
}

.custom-button.outline:hover:not(.disabled):not(.loading) {
  background: rgb(29, 40, 61);
  color: white;
}

.custom-button.danger {
  background: #ef4444;
  color: white;
}

.custom-button.danger:hover:not(.disabled):not(.loading) {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.custom-button.success {
  background: #10b981;
  color: white;
}

.custom-button.success:hover:not(.disabled):not(.loading) {
  background: #059669;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* Sizes */
.custom-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.custom-button.medium {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

.custom-button.large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Icon */
.icon-slot {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-button.has-icon {
  gap: 0.5rem;
}

/* Spinner */
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}

.spinner-svg {
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

.button-text {
  white-space: nowrap;
}
</style>
