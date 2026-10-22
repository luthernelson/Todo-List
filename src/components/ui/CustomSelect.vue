<template>
  <div class="custom-select" :class="{ 'has-error': error, disabled: disabled }">
    <label v-if="label" class="select-label">{{ label }}</label>
    <div class="select-wrapper" @click="toggleDropdown">
      <div class="select-value">
        <span v-if="selectedOption" class="selected-text">{{ selectedOption.label }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <ChevronDown :size="18" class="select-icon" :class="{ 'rotated': isOpen }" />
    </div>
    
    <div v-if="isOpen" class="dropdown-menu">
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        :class="['dropdown-item', { 'selected': selectedValue === option.value }]"
      >
        <span>{{ option.label }}</span>
        <Check v-if="selectedValue === option.value" :size="16" />
      </div>
    </div>
    
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Sélectionner...',
  },
  label: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option) => {
  selectedValue.value = option.value
  isOpen.value = false
}

const closeDropdown = (e) => {
  if (!e.target.closest('.custom-select')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.select-label {
  display: block;
  font-weight: 600;
  color: rgb(29, 40, 61);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.select-wrapper:hover {
  border-color: rgb(29, 40, 61);
}

.custom-select.has-error .select-wrapper {
  border-color: #ef4444;
}

.custom-select.disabled .select-wrapper {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.select-value {
  flex: 1;
}

.selected-text {
  color: rgb(29, 40, 61);
  font-weight: 500;
}

.placeholder {
  color: #9ca3af;
}

.select-icon {
  color: #6b7280;
  transition: transform 0.2s;
}

.select-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
  animation: dropdown 0.2s ease-out;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  color: rgb(29, 40, 61);
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item.selected {
  background: #eff6ff;
  color: rgb(29, 40, 61);
  font-weight: 600;
}

.dropdown-item svg {
  color: rgb(29, 40, 61);
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
