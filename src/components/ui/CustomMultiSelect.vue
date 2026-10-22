<template>
  <div class="custom-multi-select" :class="{ 'has-error': error, disabled: disabled }">
    <label v-if="label" class="select-label">{{ label }}</label>
    
    <div class="select-wrapper" @click="toggleDropdown">
      <div class="selected-values">
        <span v-if="selectedOptions.length === 0" class="placeholder">{{ placeholder }}</span>
        <span v-else class="selected-count">{{ selectedOptions.length }} sélectionné(s)</span>
      </div>
      <ChevronDown :size="18" class="select-icon" :class="{ 'rotated': isOpen }" />
    </div>
    
    <div v-if="isOpen" class="dropdown-menu">
      <div
        v-for="option in options"
        :key="option.value"
        @click="toggleOption(option)"
        :class="['dropdown-item', { 'selected': isSelected(option.value) }]"
      >
        <div class="checkbox-wrapper">
          <div class="checkbox">
            <Check v-if="isSelected(option.value)" :size="14" />
          </div>
          <span>{{ option.label }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="selectedOptions.length > 0" class="selected-tags">
      <span
        v-for="option in selectedOptions"
        :key="option.value"
        class="tag"
      >
        {{ option.label }}
        <X @click="removeOption(option)" :size="14" />
      </span>
    </div>
    
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
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

const selectedValues = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const selectedOptions = computed(() => {
  return props.options.filter(option => selectedValues.value.includes(option.value))
})

const isSelected = (value) => {
  return selectedValues.value.includes(value)
}

const toggleOption = (option) => {
  const index = selectedValues.value.indexOf(option.value)
  if (index > -1) {
    selectedValues.value.splice(index, 1)
  } else {
    selectedValues.value.push(option.value)
  }
}

const removeOption = (option) => {
  const index = selectedValues.value.indexOf(option.value)
  if (index > -1) {
    selectedValues.value.splice(index, 1)
  }
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const closeDropdown = (e) => {
  if (!e.target.closest('.custom-multi-select')) {
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
.custom-multi-select {
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

.custom-multi-select.has-error .select-wrapper {
  border-color: #ef4444;
}

.custom-multi-select.disabled .select-wrapper {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.selected-values {
  flex: 1;
}

.placeholder {
  color: #9ca3af;
}

.selected-count {
  color: rgb(29, 40, 61);
  font-weight: 500;
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
  cursor: pointer;
  transition: all 0.2s;
  color: rgb(29, 40, 61);
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item.selected {
  background: #eff6ff;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: white;
  transition: all 0.2s;
}

.dropdown-item.selected .checkbox {
  background: rgb(29, 40, 61);
  border-color: rgb(29, 40, 61);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: #eff6ff;
  color: rgb(29, 40, 61);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tag svg {
  cursor: pointer;
  transition: color 0.2s;
}

.tag svg:hover {
  color: #ef4444;
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
